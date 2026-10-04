import SectionHead from "./SectionHead";
import GlossCard from "./GlossCard";
import { projects } from "../data/content";

/** Earlier independent and academic work, kept compact on purpose. */
export default function Projects() {
  return (
    <section className="relative isolate overflow-x-clip">
      <span aria-hidden className="aura -left-48 top-20 h-[24rem] w-[24rem]" />

      <div className="page py-16 sm:py-20 lg:py-28">
        <SectionHead kicker="Earlier projects" title="Where the fundamentals came from." />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {projects.map((p, i) => (
            <GlossCard
              as="article"
              key={p.title}
              delay={(i % 3) * 0.06}
              tilt={5}
              className="flex flex-col p-6 sm:p-7"
            >
              <p className="spectrum-text w-fit font-mono text-sm font-semibold">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight">{p.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{p.description}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </GlossCard>
          ))}
        </div>
      </div>
    </section>
  );
}
