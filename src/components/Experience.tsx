import { useEffect, useRef } from "react";
import SectionHead from "./SectionHead";
import GlossCard from "./GlossCard";
import Reveal from "./Reveal";
import { experience } from "../data/content";

/** A timeline you scroll through: a line of spectrum light runs down the
 *  rail as you read, and each role's marker lights as the line reaches it.
 *  Every role is open; nothing hides behind a click. */
export default function Experience() {
  const list = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const nodes = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = list.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const eye = window.innerHeight * 0.62;
      const p = Math.min(Math.max((eye - r.top) / r.height, 0), 1);
      if (fill.current) fill.current.style.transform = `scaleY(${p.toFixed(4)})`;
      for (const node of nodes.current) {
        if (!node) continue;
        node.toggleAttribute("data-lit", node.getBoundingClientRect().top < eye);
      }
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

  return (
    <section id="experience" className="relative isolate scroll-mt-14 overflow-x-clip">
      <span aria-hidden className="aura -right-56 top-1/3 h-[28rem] w-[28rem]" />

      <div className="page py-16 sm:py-20 lg:py-28">
        <SectionHead kicker="Experience" title="Where I have shipped." />

        <div ref={list} className="relative mt-10 lg:mt-14">
          {/* the rail, and the light that travels it */}
          <span
            aria-hidden
            className="absolute bottom-3 left-[15rem] top-3 hidden w-px bg-line lg:block"
          />
          <span
            ref={fill}
            aria-hidden
            className="absolute bottom-3 left-[calc(15rem-1px)] top-3 hidden w-[3px] origin-top scale-y-0 rounded-full bg-[linear-gradient(180deg,#3ea6ff,#7c5cff,#ff4fa3,#ff9f43)] lg:block"
          />

          <ol className="space-y-10">
            {experience.map((job, i) => (
              <li
                key={job.company}
                className="relative grid gap-y-4 lg:grid-cols-[13rem_1fr] lg:gap-x-16"
              >
                <span
                  ref={(el) => {
                    nodes.current[i] = el;
                  }}
                  aria-hidden
                  className="absolute left-[calc(15rem-7px)] top-2 hidden h-[15px] w-[15px] rounded-full border-2 border-line-strong bg-bg transition-all duration-500 data-[lit]:border-transparent data-[lit]:bg-[image:var(--spectrum)] data-[lit]:shadow-[0_0_18px_var(--accent)] lg:block"
                />

                <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:sticky lg:top-24 lg:block lg:self-start lg:pt-1 lg:text-right">
                  <p className="font-mono text-xs text-ink">{job.period}</p>
                  <p className="text-sm text-faint lg:mt-1">{job.location}</p>
                  {job.current && (
                    <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-500 lg:mt-3">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute h-full w-full animate-[softping_2s_ease-out_infinite] rounded-full bg-emerald-400" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      Current
                    </p>
                  )}
                </Reveal>

                <GlossCard as="article" lead={job.current} tilt={2} className="p-7 sm:p-9">
                  <h3 className="display-3">
                    {job.company}
                    <span className="text-faint"> / {job.role}</span>
                  </h3>
                  <p className="mt-2 text-[15px] text-muted">{job.summary}</p>
                  <ul className="mt-6 space-y-3.5">
                    {job.points.map((pt) => (
                      <li key={pt} className="flex gap-3.5 text-[15px] leading-relaxed text-muted">
                        <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[image:var(--spectrum)]" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </GlossCard>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
