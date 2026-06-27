import Section from "./Section";
import Reveal from "./Reveal";
import { experience } from "../data/content";

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I have shipped.">
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/50 via-line to-transparent sm:left-[9px]" />

        <div className="space-y-12">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.05}>
              <div className="relative pl-8 sm:pl-12">
                {/* node */}
                <span
                  className={`absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                    job.current
                      ? "border-accent bg-accent/20"
                      : "border-line bg-surface"
                  } sm:h-5 sm:w-5`}
                >
                  {job.current && (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  )}
                </span>

                <div className="gloss group rounded-2xl p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-lg font-semibold text-snow">
                      {job.role}
                      <span className="text-accent"> @ {job.company}</span>
                    </h3>
                    <span className="font-mono text-xs text-mist">
                      {job.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-mist">{job.location}</p>

                  <ul className="mt-4 space-y-2.5">
                    {job.points.map((pt, j) => (
                      <li key={j} className="flex gap-3 text-sm leading-relaxed text-fog">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
