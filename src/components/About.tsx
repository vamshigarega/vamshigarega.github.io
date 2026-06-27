import Section from "./Section";
import Reveal from "./Reveal";
import { about, stats, profile } from "../data/content";
import profileImg from "../assets/img/profile.jpg";

export default function About() {
  return (
    <Section id="about" eyebrow="About" title="Engineer at the intersection of AI and data.">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        {/* portrait */}
        <Reveal>
          <div className="group relative mx-auto max-w-sm">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-accent/40 via-transparent to-accent-2/40 opacity-60 blur-sm transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-3xl border border-line">
              <img
                src={profileImg}
                alt={profile.name}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-snow">{profile.name}</p>
                <p className="text-xs text-mist">
                  {profile.role} at {profile.company}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* copy + stats */}
        <div>
          <div className="space-y-5">
            {about.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-base leading-relaxed text-fog sm:text-lg">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.1 + i * 0.06}>
                <div className="gloss h-full rounded-2xl p-4">
                  <div className="text-2xl font-semibold tracking-tight text-snow sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-mist">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
