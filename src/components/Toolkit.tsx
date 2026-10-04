import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Bot,
  ChartNoAxesCombined,
  Cloud,
  Code2,
  Database,
  LayoutTemplate,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import SectionHead from "./SectionHead";
import GlossCard from "./GlossCard";
import { stageHint, toolkit } from "../data/content";
import { techIcon } from "../lib/techIcons";

const groupIcons: Record<string, LucideIcon> = {
  "AI and agents": Bot,
  Languages: Code2,
  Backend: Server,
  "Front end": LayoutTemplate,
  "Data engineering": Database,
  "Cloud and DevOps": Cloud,
  "Auth and platform": ShieldCheck,
  "ML and analytics": ChartNoAxesCombined,
};

// every tool that has a brand mark, for the rings
const branded = toolkit
  .flatMap((g) => g.items)
  .filter((item, i, all) => techIcon(item) && all.indexOf(item) === i);

// four columns of two groups each (see the note on `toolkit` in content.ts)
const stacks = [0, 1, 2, 3].map((c) => toolkit.slice(c * 2, c * 2 + 2));

const GAP = 14; // between pills, in px
const SPEED = 42; // how fast the surface of a ring travels, in px per second

/** Two rings of tool marks, turning in opposite directions around a shared
 *  axis. Real CSS 3D: each pill sits on the surface of a cylinder a little
 *  narrower than the frame, seen from just outside it. So the strip faces the
 *  reader in the middle, turns away toward both sides, and leaves the frame as
 *  it goes edge-on; the far side of the cylinder is hidden. Drag to spin. */
function Rings() {
  const wrap = useRef<HTMLDivElement>(null);
  const turn = useRef<HTMLDivElement>(null);
  const motion = useRef({ held: false, x: 0, angle: 0, vel: 0, raf: 0, radius: 1000 });
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const m = motion.current;
    return () => {
      ro.disconnect();
      cancelAnimationFrame(m.raf);
    };
  }, []);

  // on a phone the pills are smaller and the cylinder wider than the screen,
  // so more than one of them faces the reader at a time
  const pill = width < 640 ? 148 : 184; // width of one pill, in px
  const radius = Math.max(width * 0.9, 440);
  const count = Math.max(Math.floor((2 * Math.PI * radius) / (pill + GAP)), 8);
  const step = 360 / count;
  motion.current.radius = radius;
  // Each ring carries its own share of the marks, repeated only as often as it
  // takes to close the loop, so copies of a mark sit on opposite sides of the
  // cylinder and the same one never shows twice in the frame.
  let repeats = 1;
  while (2 * Math.ceil(count / repeats) > branded.length) repeats++;
  const share = Math.ceil(count / repeats);
  const pick = (row: number) =>
    Array.from({ length: count }, (_, i) => branded[row * share + (i % share)]);

  const place = () => {
    const m = motion.current;
    if (turn.current) {
      turn.current.style.transform = `translateZ(${-m.radius}px) rotateY(${m.angle.toFixed(2)}deg)`;
    }
  };
  // let go and the rings coast to a stop
  const coast = () => {
    const m = motion.current;
    m.angle += m.vel;
    m.vel *= 0.94;
    place();
    m.raf = Math.abs(m.vel) > 0.01 ? requestAnimationFrame(coast) : 0;
  };
  const release = () => {
    const m = motion.current;
    if (!m.held) return;
    m.held = false;
    wrap.current?.removeAttribute("data-held");
    m.raf = requestAnimationFrame(coast);
  };

  return (
    <div
      ref={wrap}
      aria-hidden
      onPointerDown={(e) => {
        const m = motion.current;
        cancelAnimationFrame(m.raf);
        m.held = true;
        m.x = e.clientX;
        m.vel = 0;
        e.currentTarget.setAttribute("data-held", "");
        if (e.pointerType === "mouse") {
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            /* the drag still works without capture */
          }
        }
      }}
      onPointerMove={(e) => {
        const m = motion.current;
        if (!m.held) return;
        // the surface follows the finger: arc length over radius
        m.vel = ((e.clientX - m.x) / m.radius) * (180 / Math.PI);
        m.angle += m.vel;
        m.x = e.clientX;
        place();
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      className="rings fade-x relative mx-auto mt-10 h-[7.25rem] max-w-[110rem] cursor-grab touch-pan-y select-none overflow-hidden data-[held]:cursor-grabbing lg:mt-14"
      style={
        {
          perspective: `${(radius / 0.857).toFixed(0)}px`,
          "--ring-time": `${((2 * Math.PI * radius) / SPEED).toFixed(0)}s`,
        } as CSSProperties
      }
    >
      <div
        ref={turn}
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{
          transform: `translateZ(${-radius}px) rotateY(${motion.current.angle.toFixed(2)}deg)`,
        }}
      >
        {[0, 1].map((row) => (
          <div
            key={row}
            className={`ring-spin absolute inset-x-0 h-11 [transform-style:preserve-3d] ${
              row ? "ring-reverse top-[4.25rem]" : "top-2"
            }`}
          >
            {pick(row).map((item, i) => {
              const Icon = techIcon(item)!;
              return (
                <span
                  key={i}
                  className="plate absolute left-1/2 top-0 flex h-11 items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-3 text-[13px] text-muted [backface-visibility:hidden] sm:px-4 sm:text-sm"
                  style={{
                    width: pill,
                    marginLeft: -pill / 2,
                    transform: `rotateY(${(i * step).toFixed(3)}deg) translateZ(${radius.toFixed(1)}px)`,
                  }}
                >
                  <Icon size={15} className="shrink-0 text-ink" />
                  <span className="truncate">{item}</span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** The toolkit twice over: rings of marks that never stop turning, then the
 *  full list by discipline on glass. */
export default function Toolkit() {
  return (
    <section id="toolkit" className="relative isolate scroll-mt-14 overflow-x-clip">
      <span aria-hidden className="aura -left-40 top-24 h-[24rem] w-[24rem]" />

      <div className="page pt-16 sm:pt-20 lg:pt-28">
        <SectionHead kicker="Toolkit" title="What I build with." />
      </div>

      {/* decorative repeat of the list below, so it is hidden from assistive tech */}
      <Rings />
      <p className="kicker mt-4 text-center">{stageHint.rings}</p>

      <div className="page pb-16 sm:pb-20 lg:pb-28">
        {/* columns of two rather than rows of four: a long group sits above a
            short one, and the lower card stretches to close the column */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
          {stacks.map((stack, c) => (
            <div key={c} className="flex flex-col gap-4">
              {stack.map((group, r) => {
                const GroupIcon = groupIcons[group.title] ?? Code2;
                return (
                  <GlossCard
                    key={group.title}
                    delay={c * 0.06 + r * 0.05}
                    tilt={5}
                    wrapClassName={r === stack.length - 1 ? "flex-1" : ""}
                    className="p-6"
                  >
                    <span className="tile">
                      <GroupIcon size={18} />
                    </span>
                    <h3 className="mt-5 text-[15px] font-semibold tracking-tight">
                      {group.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span key={item} className="tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  </GlossCard>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
