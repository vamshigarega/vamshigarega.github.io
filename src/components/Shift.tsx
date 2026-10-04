import { useEffect, useRef } from "react";
import { ArrowRight, Hand } from "lucide-react";
import Reveal from "./Reveal";
import Counter from "./Counter";
import Stage, { type StageHandle } from "./Stage";
import BackdropVideo from "./BackdropVideo";
import { shift, stageHint, towerLabels } from "../data/content";
import type { LabelAnchor } from "../three/kit";
import clip from "../assets/video/band-servers.mp4";
import poster from "../assets/img/band-servers.jpg";
import posterAvif from "../assets/img/band-servers.avif";

const towers = ["agents", "servers", "teams"] as const;
type Tower = (typeof towers)[number];

/** Before and after, shown rather than told. Beside the ledger stand three
 *  stacks you can count: one slab per AI agent, MCP server, and team. They
 *  start as they were when I joined (1, 0, 1) and build to today's (9, 13, 8)
 *  as the section scrolls into place. Server footage sits far behind, veiled
 *  in the page background so the section belongs to whichever theme is on. */
export default function Shift() {
  const stage = useRef<StageHandle>(null);
  const box = useRef<HTMLDivElement>(null);
  const marks = useRef<Partial<Record<Tower, HTMLSpanElement | null>>>({});
  const values = useRef<Partial<Record<Tower, HTMLSpanElement | null>>>({});
  const captions = useRef<Partial<Record<Tower, HTMLSpanElement | null>>>({});
  const shown = useRef<Partial<Record<Tower, number>>>({});

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = box.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // nothing added yet as the stage enters; complete once it is centered
      const from = vh * 0.9;
      const to = (vh - r.height) / 2;
      const g = (from - r.top) / Math.max(from - to, 1);
      stage.current?.setProgress(Math.min(Math.max(g, 0), 1));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  // each count rides on top of its stack, and ticks as slabs land
  const place = (anchors: LabelAnchor[]) => {
    for (const a of anchors) {
      const tower = a.tier as Tower;
      const mark = marks.current[tower];
      if (!mark) continue;
      mark.style.transform = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
      if (shown.current[tower] === a.count) continue;
      shown.current[tower] = a.count;
      const text = towerLabels[tower](a.count);
      const value = values.current[tower];
      const caption = captions.current[tower];
      if (value) value.textContent = text.value;
      if (caption) caption.textContent = text.caption;
      mark.style.opacity = "1";
    }
  };

  return (
    <section className="relative isolate overflow-clip">
      <BackdropVideo src={clip} posterAvif={posterAvif} poster={poster} width={1280} height={720} />
      <div className="absolute -inset-px bg-bg" style={{ opacity: "calc(var(--band-veil) + 0.2)" }} />
      <div className="absolute -inset-px bg-gradient-to-b from-bg from-[4%] via-transparent to-bg to-[96%]" />

      <div className="page relative grid gap-x-8 gap-y-8 py-16 sm:py-20 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:py-28">
        <Reveal>
          <p className="kicker">{shift.kicker}</p>
          <h2 className="display-1 mt-4">{shift.title}</h2>
          <p className="lede mt-6 max-w-md">{shift.body}</p>
        </Reveal>

        {/* the same numbers, as stacks that build */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div ref={box} className="h-[22rem] sm:h-[30rem] lg:h-[38rem]">
            <Stage ref={stage} scene="towers" className="h-full w-full" onAnchors={place}>
              <div aria-hidden className="pointer-events-none absolute inset-0">
                {towers.map((tower) => (
                  <span
                    key={tower}
                    ref={(node) => {
                      marks.current[tower] = node;
                    }}
                    className="absolute left-0 top-0 opacity-0 will-change-transform"
                  >
                    <span className="flex -translate-x-1/2 -translate-y-full flex-col items-center gap-1.5 pb-1">
                      <span
                        ref={(node) => {
                          values.current[tower] = node;
                        }}
                        className="spectrum-text text-3xl font-semibold leading-none tracking-tight tabular-nums sm:text-4xl"
                      />
                      <span
                        ref={(node) => {
                          captions.current[tower] = node;
                        }}
                        className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:text-[11px]"
                      />
                    </span>
                  </span>
                ))}
              </div>
            </Stage>
          </div>

          <p className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            <Hand size={13} />
            <span>
              <span className="motion-reduce:hidden">{stageHint.towers[0]} </span>
              {stageHint.towers[1]}
            </span>
          </p>
        </div>

        <dl className="self-end">
          {shift.rows.map((row, i) => (
            <Reveal
              key={row.area}
              delay={i * 0.08}
              className="grid gap-x-6 gap-y-1.5 border-t border-line py-4 last:border-b sm:grid-cols-[11.5rem_1fr] sm:items-baseline"
            >
              <dt className="kicker">{row.area}</dt>
              <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-lg">
                <span className="strike text-faint">{row.before}</span>
                <ArrowRight size={16} className="rise-late translate-y-0.5 text-faint" />
                <span className="rise-late font-semibold tracking-tight">
                  <Counter value={row.after} />
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
