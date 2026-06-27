import Section from "./Section";
import Reveal from "./Reveal";
import { skillGroups } from "../data/content";

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Toolkit" title="Technologies I work with.">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.05}>
            <div className="gloss group h-full rounded-2xl p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-snow">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="chip rounded-lg px-2.5 py-1 font-mono text-xs text-fog transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
