import * as THREE from "three";
import {
  SPECTRUM,
  StageBase,
  VIEW_HEIGHT,
  clamp01,
  dotTexture,
  shadowTexture,
  smooth,
  type SceneOptions,
} from "./kit";

/* ============================================================
   PlaneScene - a message on its way

   The contact section's own picture: a folded paper plane in the
   page's spectrum, climbing, with a ribbon of light off each wing
   tip. It leans toward the cursor, a drag turns it, a click rolls it,
   and when the contact form is sent (`signal("sent")`) it leaves the
   frame and a fresh one glides in.
   ============================================================ */

const HEADING = 1.9; // radians from +z toward +x: up and away, to the right
const CLIMB = 0.24; // nose-up pitch
const BANK = 0.5; // it flies tipped toward the reader, so its top face shows
// Studio light on a pure spectrum color washes it out to pastel, so the paint
// goes on darker than the CSS color it is meant to match.
const PAINT = 0.52;
const WIND = 2.6; // how fast the air goes by, world units per second
const NODES = 46; // points along each ribbon
const SEGMENT = 0.1; // distance between them
const AIR = 34; // specks of air going by
const AIM: [number, number] = [-0.75, -0.4]; // where the camera looks

// the plane, nose toward +z
const NOSE: V = [0, 0.03, 1.3];
const TIP_L: V = [-1.05, 0.2, -0.95];
const TIP_R: V = [1.05, 0.2, -0.95];
const FOLD_L: V = [-0.2, 0.03, -0.95];
const FOLD_R: V = [0.2, 0.03, -0.95];
const KEEL: V = [0, -0.45, -0.8];
type V = [number, number, number];

const [BLUE, VIOLET, PINK, ORANGE] = SPECTRUM;

class Ribbon {
  readonly mesh: THREE.Mesh;
  private points: THREE.Vector3[] = [];
  private sides: THREE.Vector3[] = [];
  private position: THREE.BufferAttribute;
  private colors: THREE.BufferAttribute;
  private head = new THREE.Color();
  private tail = new THREE.Color();

  constructor(material: THREE.Material, head: number, tail: number) {
    this.head.setHex(head);
    this.tail.setHex(tail);
    const geo = new THREE.BufferGeometry();
    this.position = new THREE.BufferAttribute(new Float32Array(NODES * 6), 3);
    this.colors = new THREE.BufferAttribute(new Float32Array(NODES * 8), 4);
    geo.setAttribute("position", this.position);
    geo.setAttribute("color", this.colors);
    const index: number[] = [];
    for (let i = 0; i < NODES - 1; i++) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    geo.setIndex(index);
    for (let i = 0; i < NODES; i++) {
      this.points.push(new THREE.Vector3());
      this.sides.push(new THREE.Vector3(1, 0, 0));
    }
    this.mesh = new THREE.Mesh(geo, material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 3;
  }

  /** Lay the whole ribbon out behind `from`, as if it had always been there. */
  reset(from: THREE.Vector3, side: THREE.Vector3, wind: THREE.Vector3) {
    for (let i = 0; i < NODES; i++) {
      this.points[i].copy(from).addScaledVector(wind, i * SEGMENT);
      this.sides[i].copy(side);
    }
  }

  /** The air carries the ribbon back; the wing tip keeps feeding it. */
  advance(from: THREE.Vector3, side: THREE.Vector3, wind: THREE.Vector3, distance: number) {
    for (let i = 1; i < NODES; i++) this.points[i].addScaledVector(wind, distance);
    // feed in as many new points as the gap behind the tip has room for
    let guard = NODES;
    while (this.points[1].distanceTo(from) > SEGMENT && guard-- > 0) {
      const last = this.points.pop()!;
      const lastSide = this.sides.pop()!;
      last.copy(this.points[1]).lerp(from, SEGMENT / this.points[1].distanceTo(from));
      lastSide.copy(side);
      this.points.splice(1, 0, last);
      this.sides.splice(1, 0, lastSide);
    }
    this.points[0].copy(from);
    this.sides[0].copy(side);
  }

  write(width: number, alpha: number, dark: boolean) {
    for (let i = 0; i < NODES; i++) {
      const u = i / (NODES - 1);
      const w = (width * Math.pow(1 - u, 1.15)) / 2;
      const p = this.points[i];
      const s = this.sides[i];
      this.position.setXYZ(i * 2, p.x - s.x * w, p.y - s.y * w, p.z - s.z * w);
      this.position.setXYZ(i * 2 + 1, p.x + s.x * w, p.y + s.y * w, p.z + s.z * w);
      const r = this.head.r + (this.tail.r - this.head.r) * u;
      const g = this.head.g + (this.tail.g - this.head.g) * u;
      const b = this.head.b + (this.tail.b - this.head.b) * u;
      // on a dark page the ribbon is light added to the scene, so fading is
      // dimming; on a light page it is paint, so fading is transparency
      const a = alpha * Math.pow(1 - u, 1.5);
      const k = dark ? a : 1;
      this.colors.setXYZW(i * 2, r * k, g * k, b * k, dark ? 1 : a);
      this.colors.setXYZW(i * 2 + 1, r * k, g * k, b * k, dark ? 1 : a);
    }
    this.position.needsUpdate = true;
    this.colors.needsUpdate = true;
  }

  dispose() {
    this.mesh.geometry.dispose();
  }
}

export class PlaneScene extends StageBase {
  private root = new THREE.Group();
  private craft = new THREE.Group();
  private body!: THREE.MeshPhysicalMaterial;
  private creases!: THREE.LineBasicMaterial;
  private ribbonMat!: THREE.MeshBasicMaterial;
  private ribbons: Ribbon[] = [];
  private air!: THREE.Points;
  private airMat!: THREE.PointsMaterial;
  private airSeeds: number[] = [];
  private ground!: THREE.Mesh;
  private groundMat!: THREE.MeshBasicMaterial;

  private zoom = 1;
  // which way the air goes by, in the root's space (opposite to the heading)
  private wind = new THREE.Vector3();
  private heading = new THREE.Vector3();
  // "cruise" in place, "leave" the frame after a send, then "arrive" again
  private phase: "cruise" | "leave" | "arrive" = "cruise";
  private phaseTime = 0;
  private roll = -1; // seconds into a barrel roll, or -1
  private laid = false;

  private tip = new THREE.Vector3();
  private side = new THREE.Vector3();

  constructor(opts: SceneOptions) {
    super(opts, { shadow: 1024, pixels: 3_000_000 });
    this.heading.set(Math.sin(HEADING), Math.sin(CLIMB), Math.cos(HEADING)).normalize();
    this.wind.copy(this.heading).negate();

    this.scene.add(this.root);
    this.build();
    this.bindDrag({
      tap: () => {
        if (!this.reduced && this.roll < 0 && this.phase === "cruise") this.roll = 0;
      },
    });
    this.init();
  }

  private build() {
    /* the plane: four folded faces, each lit as one flat sheet */
    const faces: [V, V, V][] = [
      [NOSE, FOLD_L, TIP_L], // left wing
      [NOSE, TIP_R, FOLD_R], // right wing
      [NOSE, KEEL, FOLD_L], // left of the keel
      [NOSE, FOLD_R, KEEL], // right of the keel
    ];
    const paint: [number, number, number][] = [
      [0x9fd0ff, VIOLET, BLUE],
      [0xffc98f, ORANGE, PINK],
      [0x7c8dff, 0x3b2a9a, 0x5a3fd6],
      [0xff8fc4, 0xb02f77, 0x3b2a9a],
    ];
    const position: number[] = [];
    const color: number[] = [];
    const c = new THREE.Color();
    faces.forEach((face, f) =>
      face.forEach((v, n) => {
        position.push(...v);
        c.setHex(paint[f][n]).multiplyScalar(PAINT);
        color.push(c.r, c.g, c.b);
      }),
    );
    const geo = this.track(new THREE.BufferGeometry());
    geo.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(color, 3));
    geo.computeVertexNormals();
    this.body = this.track(
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        metalness: 0.15,
        roughness: 0.32,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        envMapIntensity: 0.6,
        side: THREE.DoubleSide,
        flatShading: true,
      }),
    );
    this.craft.add(new THREE.Mesh(geo, this.body));

    // the folds, drawn as fine lines so the paper reads as paper
    const edges: [V, V][] = [
      [NOSE, TIP_L],
      [NOSE, TIP_R],
      [NOSE, FOLD_L],
      [NOSE, FOLD_R],
      [NOSE, KEEL],
      [TIP_L, FOLD_L],
      [TIP_R, FOLD_R],
      [FOLD_L, KEEL],
      [FOLD_R, KEEL],
    ];
    const lineGeo = this.track(new THREE.BufferGeometry());
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(edges.flat(2), 3));
    this.creases = this.track(
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }),
    );
    this.craft.add(new THREE.LineSegments(lineGeo, this.creases));
    this.craft.rotation.order = "YXZ";
    this.craft.scale.setScalar(1.45);
    this.root.add(this.craft);

    /* a ribbon of light off each wing tip */
    this.ribbonMat = this.track(
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
    this.ribbons = [
      this.track(new Ribbon(this.ribbonMat, BLUE, VIOLET)),
      this.track(new Ribbon(this.ribbonMat, ORANGE, PINK)),
    ];
    this.ribbons.forEach((r) => this.root.add(r.mesh));

    /* specks of air going by: they are what makes it read as flight */
    const airGeo = this.track(new THREE.BufferGeometry());
    airGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(AIR * 3), 3));
    for (let i = 0; i < AIR; i++) {
      this.airSeeds.push((Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1) * 1000);
    }
    this.airMat = this.track(
      new THREE.PointsMaterial({
        size: 4,
        sizeAttenuation: false,
        map: this.track(dotTexture()),
        transparent: true,
        depthWrite: false,
      }),
    );
    this.air = new THREE.Points(airGeo, this.airMat);
    this.air.frustumCulled = false;
    this.root.add(this.air);

    // on a light page the plane needs a shadow to fly over
    this.groundMat = this.track(
      new THREE.MeshBasicMaterial({
        map: this.track(shadowTexture()),
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    this.ground = new THREE.Mesh(this.track(new THREE.PlaneGeometry(4.4, 3.2)), this.groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -2.3;
    this.ground.renderOrder = -1;
    this.root.add(this.ground);
  }

  /** "sent": the message is on its way, and so is the plane. */
  override signal(name: string) {
    if (name !== "sent" || this.reduced || this.phase !== "cruise") return;
    this.phase = "leave";
    this.phaseTime = 0;
  }

  protected applyTheme() {
    this.renderer.toneMappingExposure = this.dark ? 1.15 : 1.05;
    this.ribbonMat.blending = this.dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    this.ribbonMat.needsUpdate = true;
    this.airMat.blending = this.dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    this.airMat.color.setHex(this.dark ? 0x9fb8ff : 0x7d8db3);
    this.airMat.needsUpdate = true;
    this.creases.color.setHex(this.dark ? 0xffffff : 0x1d1d1f);
    this.creases.opacity = this.dark ? 0.5 : 0.28;
  }

  protected override layout(width: number, height: number) {
    this.zoom = Math.min(1.5, (VIEW_HEIGHT * (width / height)) / 5.6);
  }

  protected frame(dt: number, snap: boolean) {
    const t = this.elapsed;

    /* where the plane is along its heading */
    let along = 0;
    let rush = 1; // how much faster than cruising the air goes by
    if (this.phase !== "cruise") {
      this.phaseTime += dt;
      if (this.phase === "leave") {
        const u = clamp01(this.phaseTime / 0.95);
        along = 11 * u * u * u;
        rush = 1 + 3 * u;
        if (u >= 1) {
          this.phase = "arrive";
          this.phaseTime = 0;
          this.laid = false;
        }
      } else {
        const u = clamp01(this.phaseTime / 1.7);
        along = -11 * Math.pow(1 - u, 3);
        rush = 1 + 2 * (1 - u);
        if (u >= 1) this.phase = "cruise";
      }
    }

    /* attitude: it leans toward the cursor, and never sits quite still */
    const bob = this.reduced ? 0 : Math.sin(t * 1.15) * 0.16;
    const sway = this.reduced ? 0 : Math.sin(t * 0.8 + 1) * 0.1;
    let bank = BANK - this.pointer.x * 0.4 + sway;
    if (this.roll >= 0) {
      this.roll += dt;
      const u = clamp01(this.roll / 0.9);
      bank += smooth(u) * Math.PI * 2;
      if (u >= 1) this.roll = -1;
    }
    this.craft.position.copy(this.heading).multiplyScalar(along);
    this.craft.position.y += bob;
    this.craft.rotation.set(
      -CLIMB + this.pointer.y * 0.16 - (this.reduced ? 0 : Math.cos(t * 1.15) * 0.05),
      HEADING + this.pointer.x * 0.22,
      bank,
    );
    this.craft.updateMatrix();

    /* the ribbons leave the wing tips and are carried back by the air */
    const move = WIND * rush * dt;
    [TIP_L, TIP_R].forEach((at, n) => {
      this.tip.set(at[0], at[1], at[2]).applyMatrix4(this.craft.matrix);
      // each ribbon lies in the plane of its wing
      this.side.set(1, 0, 0).applyQuaternion(this.craft.quaternion);
      if (!this.laid || snap) this.ribbons[n].reset(this.tip, this.side, this.wind);
      else this.ribbons[n].advance(this.tip, this.side, this.wind, move);
      this.ribbons[n].write(0.3, this.dark ? 0.95 : 0.8, this.dark);
    });
    this.laid = true;

    /* air */
    const air = this.air.geometry.getAttribute("position") as THREE.BufferAttribute;
    const drift = this.reduced ? 0 : t * WIND * 1.25;
    for (let i = 0; i < AIR; i++) {
      const seed = this.airSeeds[i];
      // each speck keeps its own lane beside the flight path and loops along it
      const lane = ((seed * 7.13) % 1) * 2 - 1;
      const level = ((seed * 3.71) % 1) * 2 - 1;
      const u = (((seed * 1.37 + drift / 12) % 1) + 1) % 1;
      const d = (0.5 - u) * 12;
      air.setXYZ(
        i,
        this.heading.x * d + this.heading.z * lane * 2.6,
        this.heading.y * d + level * 2.1,
        this.heading.z * d - this.heading.x * lane * 2.6,
      );
    }
    air.needsUpdate = true;
    this.airMat.opacity = this.dark ? 0.55 : 0.4;

    /* the shadow follows on the ground */
    this.ground.position.x = this.craft.position.x - 0.4;
    this.ground.position.z = this.craft.position.z + 0.3;
    this.groundMat.opacity = this.dark ? 0 : 0.2 * clamp01(1 - Math.abs(along) / 5);

    /* a drag turns the whole picture; let go and it settles back */
    this.coast(dt);
    this.root.rotation.y = this.spin;

    // the plane sits right of center, so its ribbons have the frame to cross
    const elevation = 0.44;
    const d = 30;
    this.camera.zoom = this.zoom;
    this.camera.position.set(AIM[0], AIM[1] + Math.sin(elevation) * d, Math.cos(elevation) * d);
    this.camera.lookAt(AIM[0], AIM[1], 0);
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  }
}
