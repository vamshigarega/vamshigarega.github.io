import Section from "./Section";
import Reveal from "./Reveal";
import Tilt from "./Tilt";
import { skillGroups } from "../data/content";
import { techIcon } from "../lib/techIcons";

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Toolkit" title="Technologies I work with.">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.05} className="h-full">
            <Tilt max={5} className="h-full">
              <div className="gloss group h-full rounded-2xl p-6 [transform-style:preserve-3d]">
                <h3
                  className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-snow"
                  style={{ transform: "translateZ(25px)" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {group.title}
                </h3>
                <div
                  className="flex flex-wrap gap-2"
                  style={{ transform: "translateZ(18px)" }}
                >
                  {group.items.map((item) => {
                    const Icon = techIcon(item);
                    return (
                      <span
                        key={item}
                        className="chip inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs text-fog transition-all hover:-translate-y-0.5 hover:text-snow"
                      >
                        {Icon ? (
                          <Icon className="text-accent-soft" size={13} />
                        ) : (
                          <span className="h-1 w-1 rounded-full bg-accent/70" />
                        )}
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
