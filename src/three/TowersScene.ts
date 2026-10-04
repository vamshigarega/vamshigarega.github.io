import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  StageBase,
  VIEW_HEIGHT,
  clamp01,
  pop,
  shadowTexture,
  spectrumColor,
  type SceneOptions,
  type Tier,
} from "./kit";

/* ============================================================
   TowersScene - before and after, as three stacks you can count

   One slab is one real thing: an AI agent, an MCP server, an
   engineering team. The silver slabs are what existed when I joined
   (1 agent, no MCP servers, 1 team: our own). The colored ones are
   what was added since, up to 9, 13 and 8. `setProgress(0..1)` drops
   them in one at a time, so the section's scroll builds the chart.

   These numbers are the `shift` rows in content.ts. Keep them in step.
   ============================================================ */

const TOWERS: { tier: Tier; before: number; after: number; hue: [number, number] }[] = [
  { tier: "agents", before: 1, after: 9, hue: [0, 0.4] },
  { tier: "servers", before: 0, after: 13, hue: [0.28, 0.72] },
  { tier: "teams", before: 1, after: 8, hue: [0.62, 1] },
];

const GAP = 2.3; // between tower centers
const SLAB = 1.2; // side of a slab
const PITCH = 0.25; // from one slab to the next, bottom to bottom
const CHART_WIDTH = 8.1; // as seen on screen, with a margin
const YAW = 0.5; // the row runs away from the reader, left to right
// Studio light on a pure spectrum color washes it out to pastel, so the paint
// goes on darker than the CSS color it is meant to match.
const PAINT = 0.5;
const DROP = 0.55; // how far above its place a slab appears

type Slab = { tower: number; level: number; isNew: boolean; start: number };

export class TowersScene extends StageBase {
  private root = new THREE.Group();
  private slabs!: THREE.InstancedMesh;
  private meta: Slab[] = [];
  private tint: THREE.Color[] = [];
  private ground!: THREE.MeshBasicMaterial;
  private plate!: THREE.MeshPhysicalMaterial;
  private pads!: THREE.MeshPhysicalMaterial;

  private target = 0;
  private growth = 0;
  private counts = TOWERS.map((t) => t.before);
  // the top of each tower, counting a slab that is still on its way down
  private crest = TOWERS.map((t) => t.before * PITCH);
  private zoom = 1;

  private m4 = new THREE.Matrix4();
  private pos = new THREE.Vector3();
  private quat = new THREE.Quaternion();
  private scl = new THREE.Vector3();
  private tmp = new THREE.Vector3();
  private color = new THREE.Color();
  private at = { x: 0, y: 0 };

  constructor(opts: SceneOptions) {
    super(opts, { shadow: 1024, pixels: 3_000_000 });
    // with reduced motion there is no build: the chart is simply complete
    this.growth = this.target = this.reduced ? 1 : 0;

    this.root.rotation.y = YAW;
    this.scene.add(this.root);
    this.build();
    this.bindDrag();
    this.init();
  }

  private build() {
    /* the base everything stands on */
    this.plate = this.track(
      new THREE.MeshPhysicalMaterial({
        color: 0x0b0c10,
        metalness: 0.5,
        roughness: 0.55,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
        envMapIntensity: 0.22,
      }),
    );
    const plate = new THREE.Mesh(
      this.track(new RoundedBoxGeometry(GAP * 2 + SLAB + 0.8, 0.12, SLAB + 0.9, 4, 0.05)),
      this.plate,
    );
    plate.position.y = -0.1;
    plate.receiveShadow = true;
    this.root.add(plate);

    /* one pad per tower: it marks the spot even while a tower is empty */
    this.pads = this.track(
      new THREE.MeshPhysicalMaterial({
        color: 0x23262f,
        metalness: 0.6,
        roughness: 0.4,
        clearcoat: 0.6,
        clearcoatRoughness: 0.3,
      }),
    );
    const padGeo = this.track(new RoundedBoxGeometry(SLAB + 0.3, 0.05, SLAB + 0.3, 4, 0.02));
    TOWERS.forEach((_, n) => {
      const pad = new THREE.Mesh(padGeo, this.pads);
      pad.position.set((n - 1) * GAP, -0.02, 0);
      pad.receiveShadow = true;
      this.root.add(pad);
    });

    // on a light page the chart needs something to stand on
    this.ground = this.track(
      new THREE.MeshBasicMaterial({
        map: this.track(shadowTexture()),
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    const ground = new THREE.Mesh(this.track(new THREE.PlaneGeometry(9.6, 5.2)), this.ground);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.renderOrder = -1;
    this.root.add(ground);

    /* the slabs */
    TOWERS.forEach((tower, n) => {
      const added = tower.after - tower.before;
      for (let level = 0; level < tower.after; level++) {
        const isNew = level >= tower.before;
        const j = level - tower.before; // 0-based among the new ones
        this.meta.push({
          tower: n,
          level,
          isNew,
          // the three towers rise together, each at its own pace
          start: isNew ? 0.05 + (0.83 * (j + 0.4)) / added : -1,
        });
        this.tint.push(
          isNew
            ? spectrumColor(
                tower.hue[0] + ((tower.hue[1] - tower.hue[0]) * j) / Math.max(added - 1, 1),
              ).multiplyScalar(PAINT)
            : new THREE.Color(),
        );
      }
    });
    const mat = this.track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 0.55,
      }),
    );
    this.slabs = new THREE.InstancedMesh(
      this.track(new RoundedBoxGeometry(SLAB, PITCH - 0.05, SLAB, 6, 0.06)),
      mat,
      this.meta.length,
    );
    this.slabs.castShadow = true;
    this.slabs.receiveShadow = true;
    this.slabs.frustumCulled = false;
    this.meta.forEach((_, i) => this.slabs.setColorAt(i, this.color.setHex(0xffffff)));
    this.root.add(this.slabs);
  }

  /** How far the chart has built itself, 0..1. */
  override setProgress(p: number) {
    if (this.reduced) return;
    this.target = clamp01(p);
  }

  protected applyTheme() {
    this.renderer.toneMappingExposure = this.dark ? 1.15 : 1.05;
    this.ground.opacity = this.dark ? 0 : 0.26;
    // the slabs that were already there: silver, darker on a light page so
    // they do not dissolve into it
    this.meta.forEach((slab, i) => {
      if (!slab.isNew) this.tint[i].setHex(this.dark ? 0x9aa1b0 : 0x6f7889);
    });
    this.pads.color.setHex(this.dark ? 0x23262f : 0x3a3f4b);
  }

  protected override layout(width: number, height: number) {
    this.zoom = Math.min(1.5, (VIEW_HEIGHT * (width / height)) / CHART_WIDTH);
  }

  protected frame(dt: number, snap: boolean) {
    const t = this.elapsed;
    this.growth += (this.target - this.growth) * (snap || this.reduced ? 1 : 1 - Math.exp(-dt * 5));
    const g = this.growth;

    this.counts = TOWERS.map((tower) => tower.before);
    const crest = TOWERS.map((tower) => tower.before * PITCH);
    this.meta.forEach((slab, i) => {
      // k: how far this slab has arrived. It drops into place and lands with
      // a small bounce.
      const k = slab.isNew ? clamp01((g - slab.start) / 0.085) : 1;
      const fall = 1 - Math.pow(1 - k, 3);
      const size = slab.isNew ? pop(k) : 1;
      const lift = (1 - fall) * DROP;
      if (slab.isNew && k > 0) {
        if (k > 0.5) this.counts[slab.tower]++;
        crest[slab.tower] = Math.max(crest[slab.tower], (slab.level + 1) * PITCH + lift);
      }
      this.slabs.setMatrixAt(
        i,
        this.m4.compose(
          this.pos.set((slab.tower - 1) * GAP, slab.level * PITCH + (PITCH - 0.05) / 2 + lift, 0),
          this.quat,
          this.scl.setScalar(Math.max(size, 0.0001)),
        ),
      );
      // a slow pass of light climbs each finished tower
      const wave = this.reduced ? 0 : Math.max(0, Math.sin(t * 1.3 - slab.level * 0.55 - slab.tower));
      this.slabs.setColorAt(i, this.color.copy(this.tint[i]).multiplyScalar(1 + 0.3 * wave ** 6));
    });
    this.slabs.instanceMatrix.needsUpdate = true;
    this.slabs.instanceColor!.needsUpdate = true;
    // a count follows the top of its tower, without jumping
    const follow = snap || this.reduced ? 1 : 1 - Math.exp(-dt * 9);
    crest.forEach((y, n) => (this.crest[n] += (y - this.crest[n]) * follow));

    this.coast(dt);
    const drift = this.reduced ? 0 : Math.sin(t * 0.25) * 0.05;
    const nudge = this.dragging ? 0 : this.pointer.x * 0.14;
    this.root.rotation.y = YAW + drift + nudge + this.spin;

    const elevation = 0.5 - this.pointer.y * 0.05;
    const d = 30;
    const lookAt = 1.8;
    this.camera.zoom = this.zoom;
    this.camera.position.set(0, lookAt + Math.sin(elevation) * d, Math.cos(elevation) * d);
    this.camera.lookAt(0, lookAt, 0);
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);

    if (this.onLabels) {
      this.root.updateMatrixWorld();
      this.onLabels(
        TOWERS.map((tower, n) => {
          // a count rides above its tower as the tower grows
          this.tmp.set((n - 1) * GAP, this.crest[n] + 0.6, 0);
          this.root.localToWorld(this.tmp);
          this.toScreen(this.tmp, this.at);
          return {
            tier: tower.tier,
            x: this.at.x,
            y: this.at.y,
            strength: 1,
            count: this.counts[n],
          };
        }),
      );
    }
  }
}
