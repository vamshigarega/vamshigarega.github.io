import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTheme } from "../theme/ThemeContext";
import { stageLabels } from "../data/content";
import type { LabelAnchor, SceneOptions, StageBase, Tier } from "../three/kit";

export type StageHandle = {
  /** What the number means is up to the scene (see each scene's file). */
  setProgress: (p: number) => void;
  /** Tell the scene that something happened on the page, by name. */
  signal: (name: string) => void;
};

/** Every 3D picture on the page. Each section gets its own: the platform for
 *  the tour, counting stacks for before and after, a paper plane for contact.
 *  The same diagram is never shown twice. */
export type SceneName = "platform" | "towers" | "plane";

type StageProps = {
  className?: string;
  scene?: SceneName;
  /** the platform's tier callouts, pinned beside the model */
  labels?: boolean;
  /** raw anchors every frame, for a section that draws its own callouts */
  onAnchors?: (anchors: LabelAnchor[]) => void;
  onSelect?: (tier: Tier) => void;
  /** overlays that sit on top of the canvas */
  children?: ReactNode;
};

type SceneClass = new (opts: SceneOptions) => StageBase;

// each scene is its own small chunk on top of the shared three.js chunk
const loaders: Record<SceneName, () => Promise<SceneClass>> = {
  platform: () => import("../three/PlatformScene").then((m) => m.PlatformScene),
  towers: () => import("../three/TowersScene").then((m) => m.TowersScene),
  plane: () => import("../three/PlaneScene").then((m) => m.PlaneScene),
};

const TIER_ORDER: Tier[] = ["teams", "agents", "gateway", "servers", "data"];

/** Hosts one 3D scene. The engine is a separate chunk that loads only when a
 *  stage comes near the viewport, and a scene draws only while it is on
 *  screen. If WebGL is unavailable the tour falls back to the same stack as
 *  plain plates, and the other stages simply stay empty, so the page never
 *  breaks. Every scene can be dragged to turn it. */
const Stage = forwardRef<StageHandle, StageProps>(function Stage(
  { className = "", scene = "platform", labels = scene === "platform", onAnchors, onSelect, children },
  ref,
) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef<StageBase | null>(null);
  const nodes = useRef<Record<string, HTMLSpanElement | null>>({});
  const pending = useRef(0);
  const select = useRef(onSelect);
  const anchors = useRef(onAnchors);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  select.current = onSelect;
  anchors.current = onAnchors;

  useImperativeHandle(ref, () => ({
    setProgress(p: number) {
      pending.current = p;
      live.current?.setProgress(p);
    },
    signal(name: string) {
      live.current?.signal(name);
    },
  }));

  useEffect(() => {
    const el = canvas.current;
    const box = host.current;
    if (!el || !box) return;
    let cancelled = false;
    let visible = false;
    let requested = false;
    let instance: StageBase | null = null;

    // Callouts are placed top to bottom, and pushed apart when the stack
    // closes up and their anchors crowd together.
    const place = (list: LabelAnchor[]) => {
      // a callout may run past the stage into the page margin, but never
      // past the edge of the window
      const room = window.innerWidth - box.getBoundingClientRect().left - 12;
      let floor = -Infinity;
      for (const a of list) {
        const node = nodes.current[a.tier];
        if (!node) continue;
        const x = Math.min(a.x, room - node.offsetWidth);
        const y = Math.max(a.y, floor + 22);
        floor = y;
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        node.style.opacity = String(Math.max(0, (a.strength - 0.35) / 0.65).toFixed(2));
      }
    };
    const sync = () => {
      if (!instance) return;
      if (visible && !document.hidden) instance.start();
      else instance.stop();
    };
    const load = () => {
      if (requested) return;
      requested = true;
      loaders[scene]()
        .then((Scene) => {
          if (cancelled) return;
          instance = new Scene({
            canvas: el,
            dark: themeRef.current === "dark",
            reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            onLabels:
              labels || anchors.current
                ? (list) => {
                    if (labels) place(list);
                    anchors.current?.(list);
                  }
                : undefined,
            onHover: (tier) => {
              for (const t of TIER_ORDER) nodes.current[t]?.toggleAttribute("data-on", t === tier);
            },
            onSelect: (tier) => select.current?.(tier),
          });
          live.current = instance;
          instance.setProgress(pending.current);
          return instance.prepare();
        })
        .then(() => {
          if (cancelled) return;
          setReady(true);
          sync();
        })
        .catch((err) => {
          console.warn("3D stage unavailable:", err);
          if (!cancelled) setFailed(true);
        });
    };

    // build the scene when the stage is about to come on screen; draw only
    // while it actually is
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) load();
      },
      { rootMargin: "900px 0px" },
    );
    near.observe(box);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(box);
    const ro = new ResizeObserver(() => instance?.resize());
    ro.observe(box);
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      instance?.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelled = true;
      near.disconnect();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
      instance?.dispose();
      live.current = null;
    };
    // a stage keeps the scene it was mounted with
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    themeRef.current = theme;
    live.current?.setTheme(theme === "dark");
  }, [theme]);

  return (
    <div ref={host} className={`relative ${className}`}>
      {/* soft pool of light the subject sits in */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_52%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_70%)]"
      />

      {failed ? (
        scene === "platform" && (
          <ol className="absolute inset-0 m-auto flex h-fit w-56 flex-col gap-2.5">
            {TIER_ORDER.map((tier) => (
              <li
                key={tier}
                className="plate rounded-xl px-4 py-3 text-center font-mono text-xs text-muted"
              >
                {stageLabels[tier]}
              </li>
            ))}
          </ol>
        )
      ) : (
        <>
          {/* a stage that floats on the page (everything but the pinned tour)
              lets its picture run out softly at the frame */}
          <canvas
            ref={canvas}
            aria-hidden
            className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
              ready ? "opacity-100" : "opacity-0"
            } ${scene === "platform" ? "" : "stage-soft"}`}
          />
          {/* tier callouts, pinned to the model every frame */}
          {labels && (
            <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
              {TIER_ORDER.map((tier) => (
                <span
                  key={tier}
                  ref={(node) => {
                    nodes.current[tier] = node;
                  }}
                  className="group absolute left-0 top-0 opacity-0 will-change-transform"
                >
                  <span className="flex -translate-y-1/2 items-center gap-2.5 whitespace-nowrap pl-3 font-mono text-[11px] text-muted transition-colors group-data-[on]:text-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-[image:var(--spectrum)] shadow-[0_0_10px_var(--accent)] transition-transform group-data-[on]:scale-[1.8]" />
                    {stageLabels[tier]}
                  </span>
                </span>
              ))}
            </div>
          )}
          <div
            className={`transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
});

export default Stage;
