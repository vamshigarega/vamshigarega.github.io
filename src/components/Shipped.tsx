import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  KeyRound,
  Layers,
  LifeBuoy,
  MessagesSquare,
  PanelsTopLeft,
  RotateCcw,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import Counter from "./Counter";
import { useGloss } from "../hooks/useGloss";
import { shipped, type Shipped as Case } from "../data/content";

const icons: Record<string, LucideIcon> = {
  BellRing,
  KeyRound,
  Layers,
  LifeBuoy,
  MessagesSquare,
  PanelsTopLeft,
};

/** One case, on a card that turns over. The front is the outcome (figure,
 *  problem, what I built, result). The back is how it works, step by step:
 *  the part an interviewer asks about next. */
function CaseCard({ item, index, wide }: { item: Case; index: number; wide: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const front = useGloss<HTMLElement>(3);
  const back = useGloss<HTMLDivElement>(3);
  const open = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const turned = useRef(false);
  const Icon = icons[item.icon] ?? Layers;
  const number = String(index + 1).padStart(2, "0");

  // keep the keyboard on the side that is facing the reader
  useEffect(() => {
    if (!turned.current) return;
    (flipped ? close : open).current?.focus({ preventScroll: true });
  }, [flipped]);

  const turn = (to: boolean) => {
    turned.current = true;
    setFlipped(to);
  };

  return (
    <Reveal
      delay={(index % 2) * 0.08}
      className={`[perspective:2200px] ${wide ? "lg:col-span-2" : ""}`}
    >
      <div className={`flip relative h-full ${flipped ? "is-flipped" : ""}`}>
        {/* front: the outcome */}
        <article
          {...front}
          inert={flipped}
          className={`flip-face gloss h-full p-7 sm:p-9 ${index === 0 ? "gloss-lead" : ""}`}
        >
          <span aria-hidden className="gloss-sweep" />
          <span className="kicker absolute right-7 top-10 sm:right-9 sm:top-12">{number}</span>
          <div
            className={`relative z-[3] ${wide ? "grid gap-x-12 gap-y-7 lg:grid-cols-[0.85fr_1.15fr]" : ""}`}
          >
            <div>
              <span className="tile">
                <Icon size={19} />
              </span>
              <p
                className={`mt-8 font-semibold leading-none tracking-tight ${
                  wide ? "text-7xl sm:text-8xl" : "text-5xl sm:text-6xl"
                }`}
              >
                <span className="spectrum-text">
                  <Counter value={item.figure} />
                </span>
              </p>
              <p className="mt-3 max-w-xs text-sm leading-snug text-muted">{item.figureLabel}</p>
              <h3 className="display-3 mt-7">{item.title}</h3>
            </div>

            <div className={wide ? "lg:pt-16" : "mt-6"}>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted">
                <p>
                  <span className="font-medium text-ink">The problem. </span>
                  {item.problem}
                </p>
                <p>
                  <span className="font-medium text-ink">What I built. </span>
                  {item.built}
                </p>
              </div>
              <p className="mt-6 flex items-start gap-2.5 border-t border-line pt-5 text-[15px] font-medium leading-snug">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                {item.result}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {item.stack.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <button
                ref={open}
                onClick={() => turn(true)}
                className="btn btn-ghost mt-7 !px-4 !py-2 !text-sm"
              >
                <Workflow size={15} /> How it works
              </button>
            </div>
          </div>
        </article>

        {/* back: the mechanism */}
        <div
          {...back}
          inert={!flipped}
          className="flip-face flip-back gloss absolute inset-0 overflow-y-auto"
        >
          <div className="relative z-[3] flex min-h-full flex-col p-7 sm:p-9">
            <div className="flex items-start justify-between gap-6">
              <p className="kicker">How it works</p>
              <span className="kicker">{number}</span>
            </div>
            <h3 className="display-3 mt-3 max-w-xl">{item.title}</h3>

            <ol className={`mt-7 flex flex-1 flex-col gap-3 ${wide ? "lg:flex-row lg:gap-9" : ""}`}>
              {item.flow.map((step, n) => (
                <li key={step} className="relative flex flex-1">
                  <div
                    className={`plate flex w-full items-center gap-4 rounded-2xl p-4 ${
                      wide ? "lg:flex-col lg:items-start lg:justify-between lg:gap-8 lg:p-5" : ""
                    }`}
                  >
                    <span className="spectrum-text shrink-0 font-mono text-sm font-semibold">
                      {String(n + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] leading-snug">{step}</span>
                  </div>
                  {wide && n < item.flow.length - 1 && (
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="absolute left-full top-1/2 ml-2.5 hidden -translate-y-1/2 text-faint lg:block"
                    />
                  )}
                </li>
              ))}
            </ol>

            <button
              ref={close}
              onClick={() => turn(false)}
              className="btn btn-ghost mt-7 w-fit !px-4 !py-2 !text-sm"
            >
              <RotateCcw size={15} /> Back to the result
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Case notes on glass. The first and last run full width so the grid has no
 *  hole in it. */
export default function Shipped() {
  return (
    <section id="work" className="relative isolate scroll-mt-14 overflow-x-clip">
      <span aria-hidden className="aura -right-48 top-16 h-[28rem] w-[28rem]" />

      <div className="page py-16 sm:py-20 lg:py-28">
        <SectionHead
          kicker="Shipped work"
          title="More that reached production."
          body="Beyond the platform itself. Each card shows the outcome. Turn it over to see how it works."
        />

        <div className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-2">
          {shipped.map((item, i) => (
            <CaseCard
              key={item.title}
              item={item}
              index={i}
              // the first case leads; if the rest leave one card alone on its
              // row, that card also runs full width instead of leaving a hole
              wide={i === 0 || (i === shipped.length - 1 && shipped.length % 2 === 0)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
