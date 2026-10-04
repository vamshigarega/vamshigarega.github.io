import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  StageBase,
  TIERS,
  VIEW_HEIGHT,
  dotTexture,
  gradientTexture,
  shadowTexture,
  smooth,
  spectrumColor,
  type SceneOptions,
  type Tier,
} from "./kit";

/* ============================================================
   PlatformScene - the platform as an exploded isometric stack

   Five tiers, top to bottom, with the real counts:
     teams    8 engineering teams
     agents   9 production AI agents
     gateway  the central MCP gateway
     servers  13 MCP servers
     data     350 pods in 9 product-line blocks

   Requests travel down the stack as points of light. Scrolling the
   tour moves the camera between tiers and dims the rest.

   The model is a control: drag to turn it, hover a tier to light it,
   click a tier to open its chapter. Corners are finely rounded and the
   geometry is instanced; the rest of what keeps it sharp and cheap
   lives in kit.ts.
   ============================================================ */

type Key = {
  y: number;
  zoom: number;
  explode: number;
  turn: number;
  focus: number[];
};

// One keyframe per tour chapter: overview, agents, gateway, data, foundation.
const KEYS: Key[] = [
  { y: -0.1, zoom: 1.0, explode: 1.0, turn: 0, focus: [1, 1, 1, 1, 1] },
  { y: 2.0, zoom: 1.42, explode: 1.12, turn: 0.14, focus: [1, 1, 0.2, 0.12, 0.1] },
  { y: -0.7, zoom: 1.42, explode: 1.12, turn: -0.12, focus: [0.12, 0.18, 1, 1, 0.14] },
  { y: -2.85, zoom: 1.5, explode: 1.08, turn: 0.18, focus: [0.1, 0.1, 0.16, 0.22, 1] },
  { y: -0.05, zoom: 1.12, explode: 0.62, turn: Math.PI / 2, focus: [1, 1, 1, 1, 1] },
];

// How far each tier reaches below and above its own origin.
const REACH: Record<Tier, [number, number]> = {
  teams: [-0.1, 0.1],
  agents: [-0.29, 0.32],
  gateway: [-0.12, 0.12],
  servers: [-0.19, 0.19],
  data: [-0.12, 0.42],
};

const BASE_Y: Record<Tier, number> = {
  teams: 2.75,
  agents: 1.45,
  gateway: 0,
  servers: -1.35,
  data: -2.8,
};

const STACK_WIDTH = 5.3; // widest tier as seen on screen

// what stands in each tier (these match the copy in content.ts)
const COUNTS: Record<Tier, number> = { teams: 8, agents: 9, gateway: 1, servers: 13, data: 350 };

// half width and half depth of each tier, for label anchoring
const EXTENT: Record<Tier, [number, number]> = {
  teams: [1.55, 0.45],
  agents: [1.2, 1.2],
  gateway: [1.65, 1.25],
  servers: [1.42, 0.82],
  data: [1.9, 1.6],
};

export class PlatformScene extends StageBase {
  private root = new THREE.Group();
  private tiers = {} as Record<Tier, THREE.Group>;

  // per-tier things that respond to focus
  private lit: Record<Tier, THREE.MeshPhysicalMaterial[]> = {
    teams: [],
    agents: [],
    gateway: [],
    servers: [],
    data: [],
  };
  private glow: Record<Tier, { mat: THREE.MeshBasicMaterial; base: THREE.Color }[]> = {
    teams: [],
    agents: [],
    gateway: [],
    servers: [],
    data: [],
  };

  private core!: THREE.MeshStandardMaterial;
  private ground!: THREE.MeshBasicMaterial;
  private podTops!: THREE.InstancedMesh;
  private podSeeds: number[] = [];
  private links!: THREE.LineSegments;
  private linkEnds: { from: Tier; a: THREE.Vector3; to: Tier; b: THREE.Vector3 }[] = [];
  private pulses!: THREE.Points;
  private pulseMeta: { link: number; phase: number; speed: number }[] = [];

  // pointer interaction: hover lights a tier, a click picks it
  private onHover?: (tier: Tier | null) => void;
  private onSelect?: (tier: Tier) => void;
  private hover: Tier | null = null;
  private pickables: THREE.Object3D[] = [];
  private probe: { x: number; y: number } | null = null;
  private hoverMix = [0, 0, 0, 0, 0];
  private anyHover = 0;
  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private inv = new THREE.Matrix4();
  private localRay = new THREE.Ray();
  private box = new THREE.Box3();
  private v3 = new THREE.Vector3();

  private target = 0;
  private state = { y: -0.1, zoom: 1, explode: 1, turn: 0, focus: [1, 1, 1, 1, 1] };
  private pan = 0;
  private tmp = new THREE.Vector3();
  private tmpColor = new THREE.Color();

  constructor(opts: SceneOptions) {
    super(opts, { shadow: 2048, pixels: 5_400_000 });
    this.onHover = opts.onHover;
    this.onSelect = opts.onSelect;

    this.root.rotation.y = Math.PI / 4;
    this.scene.add(this.root);

    this.build();
    for (const tier of TIERS) {
      this.tiers[tier].traverse((o) => {
        if (!(o as THREE.Mesh).isMesh || o.userData.backdrop) return;
        o.userData.tier = tier;
        this.pickables.push(o);
      });
    }

    const el = this.renderer.domElement;
    this.bindDrag({
      down: () => {
        // a drag is not a hover
        this.probe = null;
        this.setHover(null);
      },
      hover: (e) => {
        // resolved on the next frame, so a fast mouse costs one lookup per frame
        this.probe = { x: e.clientX, y: e.clientY };
        this.redraw();
      },
      tap: (e) => {
        const tier = this.pick(e.clientX, e.clientY);
        if (tier) this.onSelect?.(tier);
      },
      leave: () => {
        this.probe = null;
        this.setHover(null);
        el.style.cursor = "grab";
      },
    });
    this.init();
  }

  /* ---------------- construction ---------------- */

  /** `light` overrides apply on a light page, where pale glossy objects
   *  would otherwise dissolve into the background. */
  private physical(
    tier: Tier,
    params: THREE.MeshPhysicalMaterialParameters,
    light: { color?: number; opacity?: number; env?: number } = {},
  ) {
    const m = this.track(new THREE.MeshPhysicalMaterial(params));
    const env = params.envMapIntensity ?? 1;
    m.userData.dark = { color: m.color.clone(), opacity: m.opacity, env };
    m.userData.light = {
      color: light.color !== undefined ? new THREE.Color(light.color) : m.color.clone(),
      opacity: light.opacity ?? m.opacity,
      env: light.env ?? env,
    };
    m.userData.base = m.userData.dark.color;
    m.userData.opacity = m.opacity;
    m.userData.env = env;
    m.userData.coat = m.clearcoat;
    this.lit[tier].push(m);
    return m;
  }

  private emissive(tier: Tier, params: THREE.MeshBasicMaterialParameters) {
    const mat = this.track(new THREE.MeshBasicMaterial({ toneMapped: false, ...params }));
    this.glow[tier].push({ mat, base: mat.color.clone() });
    return mat;
  }

  private build() {
    for (const tier of TIERS) {
      const g = new THREE.Group();
      this.tiers[tier] = g;
      this.root.add(g);
    }
    const m4 = new THREE.Matrix4();
    const spectrum = this.track(gradientTexture());

    /* teams: 8 light ceramic pills */
    {
      const geo = this.track(new RoundedBoxGeometry(0.66, 0.16, 0.32, 10, 0.078));
      const mat = this.physical(
        "teams",
        {
          color: 0xe9ecf4,
          metalness: 0.05,
          roughness: 0.3,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
        },
        { color: 0xa9b2c6 },
      );
      const mesh = new THREE.InstancedMesh(geo, mat, 8);
      mesh.castShadow = true;
      for (let i = 0; i < 8; i++) {
        const x = ((i % 4) - 1.5) * 0.8;
        const z = (Math.floor(i / 4) - 0.5) * 0.52;
        mesh.setMatrixAt(i, m4.makeTranslation(x, 0, z));
      }
      this.tiers.teams.add(mesh);
    }

    /* agents: 9 graphite cubes, each with a lit face in its own hue */
    {
      const geo = this.track(new RoundedBoxGeometry(0.58, 0.58, 0.58, 10, 0.11));
      const mat = this.physical("agents", {
        color: 0x191b22,
        metalness: 0.9,
        roughness: 0.26,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
      });
      const cubes = new THREE.InstancedMesh(geo, mat, 9);
      cubes.castShadow = true;
      cubes.receiveShadow = true;
      const faceGeo = this.track(new RoundedBoxGeometry(0.36, 0.03, 0.36, 6, 0.014));
      const faceMat = this.emissive("agents", { color: 0xffffff });
      const faces = new THREE.InstancedMesh(faceGeo, faceMat, 9);
      for (let i = 0; i < 9; i++) {
        const x = ((i % 3) - 1) * 0.9;
        const z = (Math.floor(i / 3) - 1) * 0.9;
        cubes.setMatrixAt(i, m4.makeTranslation(x, 0, z));
        faces.setMatrixAt(i, m4.makeTranslation(x, 0.3, z));
        faces.setColorAt(i, spectrumColor(i / 8, this.tmpColor));
      }
      faces.instanceColor!.needsUpdate = true;
      this.tiers.agents.add(cubes, faces);
    }

    /* gateway: a glass slab with the spectrum running through it */
    {
      // lit as well as glowing, so the agents above cast real shadows on it
      this.core = this.track(
        new THREE.MeshStandardMaterial({
          map: spectrum,
          emissiveMap: spectrum,
          emissive: 0xffffff,
          emissiveIntensity: 0.82,
          roughness: 0.35,
          metalness: 0,
          toneMapped: false,
        }),
      );
      const core = new THREE.Mesh(
        this.track(new RoundedBoxGeometry(2.75, 0.07, 1.95, 6, 0.03)),
        this.core,
      );
      core.receiveShadow = true;
      const slab = new THREE.Mesh(
        this.track(new RoundedBoxGeometry(3.3, 0.24, 2.5, 10, 0.115)),
        this.physical(
          "gateway",
          {
            color: 0xc8d8ff,
            metalness: 0,
            roughness: 0.05,
            transparent: true,
            opacity: 0.3,
            clearcoat: 1,
            clearcoatRoughness: 0.04,
            depthWrite: false,
          },
          { color: 0x9fb2ee, opacity: 0.2, env: 0.3 },
        ),
      );
      slab.renderOrder = 2;
      this.tiers.gateway.add(core, slab);
    }

    /* servers: 13 brushed-metal cubes in rows of 5, 4, 4 */
    {
      const geo = this.track(new RoundedBoxGeometry(0.38, 0.38, 0.38, 8, 0.075));
      const mat = this.physical(
        "servers",
        {
          color: 0xcdd2dc,
          metalness: 1,
          roughness: 0.24,
          clearcoat: 0.6,
          clearcoatRoughness: 0.2,
        },
        { color: 0x7f8899 },
      );
      const mesh = new THREE.InstancedMesh(geo, mat, 13);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const rows = [5, 4, 4];
      let n = 0;
      rows.forEach((count, r) => {
        for (let c = 0; c < count; c++) {
          const x = (c - (count - 1) / 2) * 0.6;
          const z = (r - 1) * 0.62;
          mesh.setMatrixAt(n++, m4.makeTranslation(x, 0, z));
        }
      });
      this.tiers.servers.add(mesh);
    }

    /* data: a base plate carrying 350 pods in 9 product-line blocks */
    {
      const plate = new THREE.Mesh(
        this.track(new RoundedBoxGeometry(3.8, 0.12, 3.2, 4, 0.05)),
        this.physical("data", {
          color: 0x0b0c10,
          metalness: 0.5,
          roughness: 0.55,
          clearcoat: 0.3,
          clearcoatRoughness: 0.4,
          envMapIntensity: 0.22,
        }),
      );
      plate.position.y = -0.06;
      plate.receiveShadow = true;

      // on a light page the stack needs something to stand on
      this.ground = this.track(
        new THREE.MeshBasicMaterial({
          map: this.track(shadowTexture()),
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      const ground = new THREE.Mesh(this.track(new THREE.PlaneGeometry(7.4, 6.6)), this.ground);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.55;
      ground.renderOrder = -1;
      ground.userData.backdrop = true;

      const POD_COUNT = 350;
      const podGeo = this.track(new THREE.BoxGeometry(0.086, 1, 0.086));
      podGeo.translate(0, 0.5, 0);
      const podMat = this.physical("data", {
        color: 0x1a2030,
        metalness: 0.8,
        roughness: 0.34,
      });
      const pods = new THREE.InstancedMesh(podGeo, podMat, POD_COUNT);
      pods.castShadow = true;
      pods.receiveShadow = true;
      const topGeo = this.track(new THREE.BoxGeometry(0.07, 0.012, 0.07));
      this.podTops = new THREE.InstancedMesh(
        topGeo,
        this.emissive("data", { color: 0xffffff }),
        POD_COUNT,
      );
      const scale = new THREE.Vector3();
      const pos = new THREE.Vector3();
      const quat = new THREE.Quaternion();
      for (let i = 0; i < POD_COUNT; i++) {
        const block = i % 9;
        const slot = Math.floor(i / 9); // 0..38 inside the block
        const bx = ((block % 3) - 1) * 1.18;
        const bz = (Math.floor(block / 3) - 1) * 0.98;
        const px = bx + ((slot % 8) - 3.5) * 0.118;
        const pz = bz + (Math.floor(slot / 8) - 2) * 0.118;
        // deterministic pseudo-random height so the skyline never changes
        const seed = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const h = 0.09 + seed * 0.3;
        pods.setMatrixAt(i, m4.compose(pos.set(px, 0, pz), quat, scale.set(1, h, 1)));
        this.podTops.setMatrixAt(i, m4.makeTranslation(px, h + 0.006, pz));
        this.podSeeds.push(seed + block * 0.7);
        this.podTops.setColorAt(i, this.tmpColor.setHex(0x3ea6ff));
      }
      this.tiers.data.add(ground, plate, pods, this.podTops);
    }

    /* links between tiers, and the requests that travel them */
    {
      const add = (from: Tier, a: THREE.Vector3, to: Tier, b: THREE.Vector3) =>
        this.linkEnds.push({ from, a, to, b });
      for (let i = 0; i < 8; i++) {
        const x = ((i % 4) - 1.5) * 0.8;
        const z = (Math.floor(i / 4) - 0.5) * 0.52;
        const j = i % 9;
        add(
          "teams",
          new THREE.Vector3(x, -0.08, z),
          "agents",
          new THREE.Vector3(((j % 3) - 1) * 0.9, 0.32, (Math.floor(j / 3) - 1) * 0.9),
        );
      }
      for (let i = 0; i < 9; i++) {
        const x = ((i % 3) - 1) * 0.9;
        const z = (Math.floor(i / 3) - 1) * 0.9;
        add(
          "agents",
          new THREE.Vector3(x, -0.3, z),
          "gateway",
          new THREE.Vector3(x * 0.9, 0.13, z * 0.7),
        );
      }
      const rows = [5, 4, 4];
      rows.forEach((count, r) => {
        for (let c = 0; c < count; c++) {
          const x = (c - (count - 1) / 2) * 0.6;
          const z = (r - 1) * 0.62;
          add(
            "gateway",
            new THREE.Vector3(x * 0.95, -0.13, z * 0.9),
            "servers",
            new THREE.Vector3(x, 0.2, z),
          );
          add(
            "servers",
            new THREE.Vector3(x, -0.2, z),
            "data",
            new THREE.Vector3(x * 1.3, 0.42, z * 1.5),
          );
        }
      });

      const geo = this.track(new THREE.BufferGeometry());
      geo.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(this.linkEnds.length * 6), 3),
      );
      geo.setAttribute(
        "color",
        new THREE.BufferAttribute(new Float32Array(this.linkEnds.length * 6), 3),
      );
      this.links = new THREE.LineSegments(
        geo,
        this.track(
          new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.55,
            depthWrite: false,
          }),
        ),
      );
      this.links.frustumCulled = false;
      this.root.add(this.links);

      const PULSES = 44;
      const pg = this.track(new THREE.BufferGeometry());
      pg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3));
      pg.setAttribute("color", new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3));
      for (let i = 0; i < PULSES; i++) {
        this.pulseMeta.push({
          link: (i * 7) % this.linkEnds.length,
          phase: (i * 0.618) % 1,
          speed: 0.22 + ((i * 0.37) % 1) * 0.2,
        });
      }
      this.pulses = new THREE.Points(
        pg,
        this.track(
          new THREE.PointsMaterial({
            size: 8,
            sizeAttenuation: false,
            map: this.track(dotTexture()),
            vertexColors: true,
            transparent: true,
            depthWrite: false,
            depthTest: false,
          }),
        ),
      );
      this.pulses.frustumCulled = false;
      this.pulses.renderOrder = 5;
      this.root.add(this.pulses);
    }
  }

  /* ---------------- public controls ---------------- */

  /** Continuous chapter position: 0 = overview ... 4 = foundation. */
  override setProgress(p: number) {
    this.target = Math.min(Math.max(p, 0), KEYS.length - 1);
  }

  /* ---------------- pointer ---------------- */

  // which tier, if any, is under a point on the canvas
  private pick(clientX: number, clientY: number): Tier | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.ndc.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.ndc, this.camera);
    // what you point at is what you get: the nearest solid object wins
    const hit = this.raycaster.intersectObjects(this.pickables, false)[0];
    if (hit) return hit.object.userData.tier as Tier;
    // nothing solid there: the gaps inside a tier's footprint still count as it
    let best: Tier | null = null;
    let near = Infinity;
    for (const tier of TIERS) {
      const [hw, hd] = EXTENT[tier];
      const [lo, hi] = REACH[tier];
      this.box.min.set(-hw, lo, -hd);
      this.box.max.set(hw, hi, hd);
      this.inv.copy(this.tiers[tier].matrixWorld).invert();
      this.localRay.copy(this.raycaster.ray).applyMatrix4(this.inv);
      const hit = this.localRay.intersectBox(this.box, this.v3);
      if (!hit) continue;
      const d = hit.distanceTo(this.localRay.origin);
      if (d < near) {
        near = d;
        best = tier;
      }
    }
    return best;
  }

  private setHover(tier: Tier | null) {
    if (tier === this.hover) return;
    this.hover = tier;
    this.onHover?.(tier);
  }

  protected applyTheme() {
    const pm = this.pulses.material as THREE.PointsMaterial;
    pm.blending = this.dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    pm.size = this.dark ? 8 : 6;
    pm.needsUpdate = true;
    this.renderer.toneMappingExposure = this.dark ? 1.15 : 1.05;
    for (const tier of TIERS) {
      for (const m of this.lit[tier]) {
        const set = this.dark ? m.userData.dark : m.userData.light;
        m.userData.base = set.color;
        m.userData.opacity = set.opacity;
        m.userData.env = set.env;
      }
    }
    this.ground.opacity = this.dark ? 0 : 0.3;
  }

  protected override layout(width: number) {
    // callouts live to the right of the model, so on a roomy stage the
    // model sits a little left of center to leave them space
    this.pan = width >= 560 ? 0.075 : 0;
  }

  /* ---------------- per-frame ---------------- */

  protected frame(dt: number, snap: boolean) {
    const t = this.elapsed;

    // where the scroll says we should be
    const i = Math.min(Math.floor(this.target), KEYS.length - 2);
    const f = smooth(this.target - i);
    const a = KEYS[i];
    const b = KEYS[i + 1];
    const want = {
      y: a.y + (b.y - a.y) * f,
      zoom: a.zoom + (b.zoom - a.zoom) * f,
      explode: a.explode + (b.explode - a.explode) * f,
      turn: a.turn + (b.turn - a.turn) * f,
    };

    // ease toward it so fast scrolling still reads as one camera move
    const k = snap || this.reduced ? 1 : 1 - Math.exp(-dt * 7);
    const s = this.state;

    // a drag turns the model; let go and it coasts, then settles back to its
    // chapter angle
    this.coast(dt);

    // the tier under the cursor lights up; the others step back a little
    this.anyHover += ((this.hover ? 1 : 0) - this.anyHover) * (snap ? 1 : 0.14);
    TIERS.forEach((tier, n) => {
      this.hoverMix[n] += ((tier === this.hover ? 1 : 0) - this.hoverMix[n]) * (snap ? 1 : 0.14);
    });
    s.y += (want.y - s.y) * k;
    s.zoom += (want.zoom - s.zoom) * k;
    s.explode += (want.explode - s.explode) * k;
    s.turn += (want.turn - s.turn) * k;
    for (let n = 0; n < 5; n++) {
      const w = a.focus[n] + (b.focus[n] - a.focus[n]) * f;
      s.focus[n] += (w - s.focus[n]) * k;
    }
    // the stack assembles on first load
    const intro = this.reduced ? 1 : Math.min(t / 1.6, 1);

    TIERS.forEach((tier, n) => {
      const g = this.tiers[tier];
      const local = smooth(Math.min(Math.max(intro * 1.6 - n * 0.12, 0), 1));
      const bob = this.reduced ? 0 : Math.sin(t * 0.7 + n * 1.3) * 0.035;
      g.position.y = BASE_Y[tier] * s.explode + bob - (1 - local) * 1.4;
      g.scale.setScalar(0.86 + 0.14 * local);
      const lit = s.focus[n] * (1 - 0.5 * this.anyHover);
      const focus = (lit + (1 - lit) * this.hoverMix[n]) * local;
      // direct light would keep an unfocused tier bright, so its color, its
      // reflections, and its clear coat all fall away together
      const lum = 0.045 + 0.955 * focus * focus;
      for (const m of this.lit[tier]) {
        m.color.copy(m.userData.base).multiplyScalar(lum);
        m.envMapIntensity = m.userData.env * (0.06 + 0.94 * focus);
        m.clearcoat = m.userData.coat * focus;
        if (m.transparent) m.opacity = m.userData.opacity * (0.35 + 0.65 * focus);
      }
      for (const e of this.glow[tier]) e.mat.color.copy(e.base).multiplyScalar(0.08 + 0.92 * focus);
      if (tier === "gateway") {
        this.core.color.setScalar(0.28 * (0.1 + 0.9 * focus));
        this.core.emissiveIntensity = 0.82 * (0.1 + 0.9 * focus);
      }
    });

    // activity ripples across the pod field
    const dataFocus = s.focus[4];
    for (let n = 0; n < this.podSeeds.length; n++) {
      const wave = Math.max(0, Math.sin(t * 1.4 + this.podSeeds[n] * 6.283));
      const lum = (0.25 + 0.75 * wave * wave) * (0.1 + 0.9 * dataFocus);
      spectrumColor((this.podSeeds[n] * 0.37) % 0.6, this.tmpColor).multiplyScalar(lum);
      this.podTops.setColorAt(n, this.tmpColor);
    }
    this.podTops.instanceColor!.needsUpdate = true;

    // links follow the tiers as the stack opens and closes
    const lp = this.links.geometry.getAttribute("position") as THREE.BufferAttribute;
    const lc = this.links.geometry.getAttribute("color") as THREE.BufferAttribute;
    const lineLum = this.dark ? 0.5 : 0.28;
    this.linkEnds.forEach((link, n) => {
      const ya = this.tiers[link.from].position.y;
      const yb = this.tiers[link.to].position.y;
      lp.setXYZ(n * 2, link.a.x, link.a.y + ya, link.a.z);
      lp.setXYZ(n * 2 + 1, link.b.x, link.b.y + yb, link.b.z);
      const fa = s.focus[TIERS.indexOf(link.from)];
      const fb = s.focus[TIERS.indexOf(link.to)];
      const v = lineLum * Math.min(fa, fb) * intro;
      const base = this.dark ? v : 1 - v * 2.2;
      lc.setXYZ(n * 2, base * 0.7, base * 0.8, base);
      lc.setXYZ(n * 2 + 1, base * 0.7, base * 0.8, base);
    });
    lp.needsUpdate = true;
    lc.needsUpdate = true;

    const pp = this.pulses.geometry.getAttribute("position") as THREE.BufferAttribute;
    const pc = this.pulses.geometry.getAttribute("color") as THREE.BufferAttribute;
    this.pulseMeta.forEach((p, n) => {
      const link = this.linkEnds[p.link];
      const u = (t * p.speed + p.phase) % 1;
      const ya = this.tiers[link.from].position.y;
      const yb = this.tiers[link.to].position.y;
      pp.setXYZ(
        n,
        link.a.x + (link.b.x - link.a.x) * u,
        link.a.y + ya + (link.b.y + yb - link.a.y - ya) * u,
        link.a.z + (link.b.z - link.a.z) * u,
      );
      const focus = Math.min(s.focus[TIERS.indexOf(link.from)], s.focus[TIERS.indexOf(link.to)]);
      const fade = Math.sin(u * Math.PI) * focus * intro;
      spectrumColor(p.phase, this.tmpColor).multiplyScalar(this.dark ? fade : 1);
      pc.setXYZ(n, this.tmpColor.r, this.tmpColor.g, this.tmpColor.b);
    });
    pp.needsUpdate = true;
    pc.needsUpdate = true;
    (this.pulses.material as THREE.PointsMaterial).opacity = this.dark ? 1 : 0.85;

    // isometric camera; the pointer nudges the turn and the tilt
    const drift = this.reduced ? 0 : Math.sin(t * 0.22) * 0.05;
    const nudge = this.dragging ? 0 : this.pointer.x * 0.2;
    this.root.rotation.y = Math.PI / 4 + s.turn + drift + nudge + this.spin;
    const elevation = 0.56 - this.pointer.y * 0.07;
    const d = 30;
    // never let a zoom crop the stack on a narrow stage
    const aspect = (this.camera.right - this.camera.left) / VIEW_HEIGHT;
    const fit = (VIEW_HEIGHT * aspect * (1 - this.pan * 2)) / STACK_WIDTH;
    this.camera.zoom = Math.min(s.zoom, fit) * (0.9 + 0.1 * intro);
    const shift = (VIEW_HEIGHT * aspect * this.pan) / this.camera.zoom;
    this.camera.position.set(shift, s.y + Math.sin(elevation) * d, Math.cos(elevation) * d);
    this.camera.lookAt(shift, s.y, 0);
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);

    if (this.probe && !this.dragging) {
      const tier = this.pick(this.probe.x, this.probe.y);
      this.probe = null;
      this.setHover(tier);
      this.renderer.domElement.style.cursor = tier ? "pointer" : "grab";
    }

    if (this.onLabels) {
      const canvas = this.renderer.domElement;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      this.root.updateMatrixWorld();
      this.onLabels(
        TIERS.map((tier, n) => {
          // callouts hang off whichever corner is furthest right on screen,
          // so they stay clear of the model at any turn of the stack
          const [hw, hd] = EXTENT[tier];
          let bestX = -Infinity;
          let bestY = 0;
          for (const sx of [-1, 1]) {
            for (const sz of [-1, 1]) {
              this.tmp.set(sx * hw, 0, sz * hd);
              this.tiers[tier].localToWorld(this.tmp);
              this.tmp.project(this.camera);
              if (this.tmp.x > bestX) {
                bestX = this.tmp.x;
                bestY = this.tmp.y;
              }
            }
          }
          return {
            tier,
            x: (bestX * 0.5 + 0.5) * w,
            y: (-bestY * 0.5 + 0.5) * h,
            strength: s.focus[n] * intro,
            count: COUNTS[tier],
          };
        }),
      );
    }
  }
}
