import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, CalendarDays } from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import { experience } from "../data/content";

export default function Experience() {
  const [active, setActive] = useState(0);
  const job = experience[active];

  return (
    <Section id="experience" eyebrow="Experience" title="Where I have shipped.">
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* company tabs */}
          <div
            role="tablist"
            aria-label="Companies"
            className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
          >
            {experience.map((e, i) => {
              const isActive = i === active;
              return (
                <button
                  key={e.company}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`relative shrink-0 rounded-xl px-4 py-3 text-left text-sm transition-colors lg:shrink ${
                    isActive
                      ? "text-snow"
                      : "text-mist hover:bg-[color:var(--chip-bg)] hover:text-fog"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="exp-active"
                      className="absolute inset-0 -z-10 rounded-xl border border-line bg-[color:var(--panel-bg)]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="block font-semibold">{e.company}</span>
                  <span className="block text-xs text-mist">{e.role}</span>
                </button>
              );
            })}
          </div>

          {/* details panel */}
          <div className="gloss min-h-[20rem] rounded-2xl p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="text-xl font-semibold text-snow">
                  {job.role}
                  <span className="text-accent"> @ {job.company}</span>
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-mist">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-accent" />
                    {job.period}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-accent" />
                    {job.location}
                  </span>
                </div>

                <ul className="mt-6 space-y-3.5">
                  {job.points.map((pt, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + j * 0.06, duration: 0.4 }}
                      className="flex gap-3 text-sm leading-relaxed text-fog"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent/80" />
                      <span>{pt}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
