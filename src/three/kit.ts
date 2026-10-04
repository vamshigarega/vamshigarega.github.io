import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* ============================================================
   What every 3D stage on the page shares.

   Solid on purpose: a stage is drawn at no less than twice the CSS
   resolution (so edges stay crisp even on a 1x display) and one soft
   shadow map grounds every object. Still cheap: no post processing,
   a procedural studio environment instead of an HDR download, a
   start-up that is spread over several tasks, and a render loop that
   stops when the stage is off screen.
   ============================================================ */

export const TIERS = ["teams", "agents", "gateway", "servers", "data"] as const;
export type Tier = (typeof TIERS)[number];

/** Where a callout belongs on screen, in CSS pixels from the canvas corner. */
export type LabelAnchor = {
  tier: Tier;
  x: number;
  y: number;
  /** 0..1, how present this thing currently is */
  strength: number;
  /** how many of its objects are standing right now */
  count: number;
};

export type SceneOptions = {
  canvas: HTMLCanvasElement;
  dark: boolean;
  reducedMotion: boolean;
  onLabels?: (anchors: LabelAnchor[]) => void;
  onHover?: (tier: Tier | null) => void;
  onSelect?: (tier: Tier) => void;
};

// spectrum stops shared with the CSS (--spectrum)
export const SPECTRUM = [0x3ea6ff, 0x7c5cff, 0xff4fa3, 0xff9f43];
export const VIEW_HEIGHT = 9.8; // world units visible top to bottom at zoom 1

const stop = new THREE.Color();
export function spectrumColor(t: number, out = new THREE.Color()) {
  const n = SPECTRUM.length - 1;
  const x = Math.min(Math.max(t, 0), 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  return out.setHex(SPECTRUM[i]).lerp(stop.setHex(SPECTRUM[i + 1]), x - i);
}

export function gradientTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 8;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 256, 0);
  SPECTRUM.forEach((hex, i) =>
    g.addColorStop(i / (SPECTRUM.length - 1), `#${hex.toString(16).padStart(6, "0")}`),
  );
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 8);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.42, "rgba(255,255,255,1)");
  g.addColorStop(0.62, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(0.55, "rgba(0,0,0,0.45)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export const smooth = (x: number) => x * x * (3 - 2 * x);
export const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
// arrive with a small overshoot, like an object dropped into place
export const pop = (x: number) => {
  const t = clamp01(x);
  return t === 0 ? 0 : 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);
};
// hand the main thread back, and carry on when the browser has a moment
const breathe = () =>
  new Promise<void>((resolve) => {
    if ("requestIdleCallback" in window) requestIdleCallback(() => resolve(), { timeout: 200 });
    else setTimeout(resolve, 16);
  });

type Quality = {
  /** side of the shadow map, in texels */
  shadow: number;
  /** most pixels the canvas may be drawn at */
  pixels: number;
};

type DragHooks = {
  /** a press began */
  down?: () => void;
  /** the mouse moved over the canvas without a button held */
  hover?: (e: PointerEvent) => void;
  /** a press ended without really moving: a click, or a tap */
  tap?: (e: PointerEvent) => void;
  leave?: () => void;
};

/** The frame every stage is built on: renderer, studio light, sizing, the
 *  render loop, and a horizontal drag that turns the subject. A scene adds its
 *  own objects and says what one frame looks like. */
export abstract class StageBase {
  protected renderer: THREE.WebGLRenderer;
  protected scene = new THREE.Scene();
  protected camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  protected dark: boolean;
  protected reduced: boolean;
  protected onLabels?: (anchors: LabelAnchor[]) => void;
  /** where the cursor is over the window, -1..1, eased */
  protected pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  /** seconds of animation so far; stands still with reduced motion */
  protected elapsed = 0;
  protected running = false;
  /** yaw added by dragging, in radians, and how fast it is still coasting */
  protected spin = 0;
  protected spinVel = 0;
  protected dragging = false;

  private quality: Quality;
  private disposables: { dispose(): void }[] = [];
  private unbind: (() => void)[] = [];
  private raf = 0;
  private last = 0;
  private ready = false;
  private disposed = false;

  constructor(opts: SceneOptions, quality: Quality) {
    this.dark = opts.dark;
    this.reduced = opts.reducedMotion;
    this.onLabels = opts.onLabels;
    this.quality = quality;

    this.renderer = new THREE.WebGLRenderer({
      canvas: opts.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "default",
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setClearColor(0x000000, 0);

    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(-5, 11, 7);
    key.castShadow = true;
    key.shadow.mapSize.setScalar(quality.shadow);
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 30;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.03;
    key.shadow.radius = 5;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x7c9cff, 0.9);
    rim.position.set(6, 2, -5);
    this.scene.add(rim);
  }

  /* ---------------- for the scene to fill in ---------------- */

  /** Update everything and draw. `snap` means jump to the target state. */
  protected abstract frame(dt: number, snap: boolean): void;
  /** Swap whatever depends on a dark or a light page. */
  protected abstract applyTheme(): void;
  /** The canvas changed size. */
  protected layout(_width: number, _height: number) {}

  /** Call at the end of the scene's constructor, once its objects exist. */
  protected init() {
    this.applyTheme();
    this.resize();
  }

  protected track<T extends { dispose(): void }>(x: T) {
    this.disposables.push(x);
    return x;
  }

  /** Draw once now if the loop is not running (the stage is off screen). */
  protected redraw() {
    if (!this.running) this.tick(0, true);
  }

  /** Let a released drag run on, then (unless `keep`) ease back to rest. */
  protected coast(dt: number, keep = false) {
    if (this.dragging) return;
    this.spin += this.spinVel;
    this.spinVel *= 0.93;
    if (!keep) this.spin *= Math.exp(-dt * 1.4);
  }

  // A horizontal drag turns the subject. Vertical swipes still scroll the
  // page, because the canvas only claims the horizontal axis.
  protected bindDrag(hooks: DragHooks = {}) {
    const el = this.renderer.domElement;
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";
    let lastX = 0;
    let moved = 0;

    const down = (e: PointerEvent) => {
      this.dragging = true;
      lastX = e.clientX;
      moved = 0;
      this.spinVel = 0;
      hooks.down?.();
      el.style.cursor = "grabbing";
      // keep the drag when the cursor runs off the canvas; capture can be
      // refused (the button is already up), and the drag works without it
      if (e.pointerType === "mouse") {
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* not captured */
        }
      }
    };
    const move = (e: PointerEvent) => {
      if (this.dragging) {
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        moved += Math.abs(dx);
        this.spin += dx * 0.008;
        this.spinVel = dx * 0.008;
        this.redraw();
        return;
      }
      if (e.pointerType === "mouse") hooks.hover?.(e);
    };
    const up = (e: PointerEvent) => {
      if (!this.dragging) return;
      this.dragging = false;
      el.style.cursor = "grab";
      if (moved < 6) hooks.tap?.(e);
    };
    const leave = () => {
      this.dragging = false;
      hooks.leave?.();
      el.style.cursor = "grab";
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", leave);
    el.addEventListener("pointerleave", leave);
    this.unbind.push(() => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", leave);
      el.removeEventListener("pointerleave", leave);
    });
  }

  /** A point in world space, as CSS pixels from the canvas corner. */
  protected toScreen(world: THREE.Vector3, out: { x: number; y: number }) {
    world.project(this.camera);
    const canvas = this.renderer.domElement;
    out.x = (world.x * 0.5 + 0.5) * canvas.clientWidth;
    out.y = (-world.y * 0.5 + 0.5) * canvas.clientHeight;
    return out;
  }

  /* ---------------- start-up ---------------- */

  /** The costly half of start-up, one piece per task so that no single frame
   *  pays for all of it: the reflection map first, then the shader programs
   *  (compiled off the main thread where the browser allows it). Resolves
   *  with the first frame on the canvas. Nothing is drawn before that. */
  async prepare() {
    await breathe();
    if (this.disposed) return;
    // studio reflections without downloading an HDR
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.scene.environment = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();

    await breathe();
    if (this.disposed) return;
    await this.renderer.compileAsync(this.scene, this.camera);
    if (this.disposed) return;
    this.ready = true;
    this.last = performance.now();
    this.tick(0, true);
  }

  /* ---------------- public controls ---------------- */

  /** What the number means is up to the scene. */
  setProgress(_p: number) {}

  /** Something happened on the page that the scene may want to answer. */
  signal(_name: string) {}

  setPointer(x: number, y: number) {
    this.pointer.tx = x;
    this.pointer.ty = y;
  }

  setTheme(dark: boolean) {
    this.dark = dark;
    this.applyTheme();
    this.redraw();
  }

  resize() {
    const canvas = this.renderer.domElement;
    const w = Math.max(canvas.clientWidth, 1);
    const h = Math.max(canvas.clientHeight, 1);
    // Never below 2x: on a 1x display those extra samples are what make edges
    // read as solid. Above that, follow the screen, within a pixel budget.
    const wanted = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
    const budget = Math.sqrt(this.quality.pixels / (w * h));
    this.renderer.setPixelRatio(Math.max(1, Math.min(wanted, budget)));
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.left = (-VIEW_HEIGHT * aspect) / 2;
    this.camera.right = (VIEW_HEIGHT * aspect) / 2;
    this.camera.top = VIEW_HEIGHT / 2;
    this.camera.bottom = -VIEW_HEIGHT / 2;
    this.camera.updateProjectionMatrix();
    this.layout(w, h);
    this.redraw();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      // cap the step so a background tab does not come back as one big jump
      this.tick(Math.min((now - this.last) / 1000, 0.05), false);
      this.last = now;
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.unbind.forEach((fn) => fn());
    this.disposables.forEach((d) => d.dispose());
    this.scene.environment?.dispose();
    this.renderer.dispose();
  }

  private tick(dt: number, snap: boolean) {
    if (!this.ready) return;
    if (!this.reduced) this.elapsed += dt;
    this.pointer.x += (this.pointer.tx - this.pointer.x) * (snap ? 1 : 0.06);
    this.pointer.y += (this.pointer.ty - this.pointer.y) * (snap ? 1 : 0.06);
    this.frame(dt, snap);
  }
}
