import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, FileText, MapPin, MousePointerClick } from "lucide-react";
import Stage, { type StageHandle } from "./Stage";
import Reveal from "./Reveal";
import Counter from "./Counter";
import { chapters, hero, overviewRail, profile, stageHint } from "../data/content";
import type { Tier } from "../three/kit";

const rail = [overviewRail, ...chapters.map((c) => c.rail)];

// clicking a tier of the model opens the chapter that explains it
const tierChapter: Record<Tier, number> = {
  teams: 1,
  agents: 1,
  gateway: 2,
  servers: 2,
  data: 3,
};

/** The hero and the platform tour are one continuous piece: a pinned 3D
 *  stage and a column of chapters. As each chapter reaches the reader's eye
 *  line, the camera moves to the tier it describes. Scrolling stays native;
 *  nothing is hijacked. */
export default function Tour() {
  const stage = useRef<StageHandle>(null);
  const stageBox = useRef<HTMLDivElement>(null);
  const blocks = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const els = blocks.current.filter((el): el is HTMLElement => !!el);
      if (!els.length) return;
      // The eye line: mid-viewport when the stage sits beside the text, or
      // the middle of the text area when the stage is pinned above it.
      const box = stageBox.current?.getBoundingClientRect();
      const above = box && box.width > window.innerWidth * 0.9 ? box.bottom : 0;
      const eye = above + (window.innerHeight - above) / 2;
      const centers = els.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      let p = centers.length - 1;
      if (eye <= centers[0]) p = 0;
      else
        for (let i = 0; i < centers.length - 1; i++) {
          if (eye < centers[i + 1]) {
            p = i + (eye - centers[i]) / (centers[i + 1] - centers[i]);
            break;
          }
        }
      stage.current?.setProgress(p);
      setActive(Math.round(p));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  const go = (i: number) =>
    blocks.current[i]?.scrollIntoView({ block: "center", behavior: "smooth" });

  const [lead, tail] = hero.headline.split(hero.highlight);

  return (
    <section id="top" className="relative">
      <div className="page pt-14 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:pt-0">
        {/* the stage: pinned above the text on small screens, beside it on large */}
        <div
          ref={stageBox}
          className="sticky top-14 z-10 -mx-5 h-[38svh] bg-bg sm:-mx-8 sm:h-[46svh] lg:top-0 lg:order-2 lg:col-span-7 lg:mx-0 lg:h-screen lg:self-start lg:bg-transparent"
        >
          <Stage
            ref={stage}
            className="h-full w-full"
            onSelect={(tier) => go(tierChapter[tier])}
          />

          {/* how to use the model */}
          <p className="pointer-events-none absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.06em] text-faint min-[360px]:tracking-[0.14em] lg:top-[4.5rem]">
            <MousePointerClick size={13} className="hidden min-[360px]:block" />
            <span className="hidden [@media(hover:hover)]:inline">{stageHint.pointer}</span>
            <span className="[@media(hover:hover)]:hidden">{stageHint.touch}</span>
          </p>

          {/* text slides under the pinned stage, so its lower edge dissolves */}
          <div className="pointer-events-none absolute inset-x-0 top-full h-10 bg-gradient-to-b from-bg to-transparent lg:hidden" />

          {/* chapter rail */}
          <nav
            aria-label="Platform tour"
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 lg:bottom-7 lg:gap-2"
          >
            {rail.map((label, i) => {
              const on = i === active;
              return (
                <button
                  key={label}
                  onClick={() => go(i)}
                  aria-label={`Go to ${label}`}
                  aria-current={on ? "step" : undefined}
                  className="group flex flex-col items-center gap-2 p-1.5"
                >
                  <span
                    className={`block h-1 rounded-full transition-all duration-500 ${
                      on ? "w-9 bg-[image:var(--spectrum)] lg:w-16" : "w-3 bg-line-strong lg:w-16"
                    }`}
                  />
                  <span
                    className={`hidden font-mono text-[10px] uppercase tracking-[0.16em] transition-colors lg:block ${
                      on ? "text-ink" : "text-faint group-hover:text-muted"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* the chapters */}
        <div className="relative lg:order-1 lg:col-span-5">
          {/* 00: who I am */}
          <header
            ref={(el) => {
              blocks.current[0] = el;
            }}
            className="flex flex-col justify-center pb-20 pt-9 sm:pt-12 lg:min-h-screen lg:pb-20 lg:pt-24"
          >
            <Reveal>
              <p className="flex items-center gap-2.5 text-sm text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-[softping_2s_ease-out_infinite] rounded-full bg-emerald-400" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {profile.availability}
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <p className="kicker mt-5 sm:mt-7">
                {profile.name} <span className="mx-1.5 text-line-strong">/</span> {hero.kicker}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="display-hero mt-4">
                {lead}
                <span className="spectrum-text">{hero.highlight}</span>
                {tail}
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="lede mt-5 max-w-xl sm:mt-7">{hero.summary}</p>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
                <button onClick={() => go(1)} className="btn btn-primary">
                  {hero.primaryCta}
                  <ArrowDown size={16} />
                </button>
                <a href="#contact" className="btn btn-ghost">
                  {hero.secondaryCta}
                </a>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="link ml-1 inline-flex items-center gap-1.5 py-2 text-sm text-muted hover:text-ink"
                >
                  <FileText size={15} /> Resume
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.34}>
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-7 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {hero.facts.map((f) => (
                  <div key={f.label}>
                    <dd className="text-2xl font-semibold tracking-tight">
                      <Counter value={f.value} />
                    </dd>
                    <dt className="mt-1 text-xs leading-snug text-muted">{f.label}</dt>
                  </div>
                ))}
              </dl>
              <p className="mt-6 flex items-center gap-1.5 text-sm text-faint">
                <MapPin size={14} /> {profile.location}
              </p>
            </Reveal>
          </header>

          {/* 01-04: down the stack */}
          <div id="platform" className="scroll-mt-14">
          {chapters.map((c, i) => (
            <article
              key={c.id}
              id={c.id}
              ref={(el) => {
                blocks.current[i + 1] = el;
              }}
              className="flex scroll-mt-14 flex-col justify-center border-t border-line py-12 sm:py-16 lg:min-h-screen lg:py-20"
            >
              <Reveal>
                <p className="kicker">{c.kicker}</p>
                <h2 className="display-2 mt-4">{c.title}</h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="lede mt-6">{c.body}</p>
              </Reveal>
              <Reveal delay={0.14}>
                <ul className="mt-7 space-y-3.5">
                  {c.points.map((pt) => (
                    <li key={pt} className="flex gap-3.5 text-[15px] leading-relaxed text-muted">
                      <span className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[image:var(--spectrum)]" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.2}>
                <dl className="mt-9 grid gap-3 sm:grid-cols-3">
                  {c.metrics.map((m) => (
                    <div key={m.label} className="gloss !rounded-2xl p-4">
                      <dd className="text-2xl font-semibold tracking-tight">
                        <Counter value={m.value} />
                      </dd>
                      <dt className="mt-1.5 text-xs leading-snug text-muted">{m.label}</dt>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 flex flex-wrap gap-2">
                  {c.stack.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
              {i === chapters.length - 1 && (
                <Reveal delay={0.26}>
                  <a
                    href="#work"
                    className="link mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-ink"
                  >
                    More shipped work <ArrowUpRight size={15} />
                  </a>
                </Reveal>
              )}
            </article>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
