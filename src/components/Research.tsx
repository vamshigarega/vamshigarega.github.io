import {
  ExternalLink,
  FileText,
  Award,
  GraduationCap,
  Trophy,
  Medal,
  Star,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import Tilt from "./Tilt";
import { publication, honors, education } from "../data/content";

const honorIcons: LucideIcon[] = [Trophy, Star, Medal, Award];

export default function Research() {
  return (
    <Section
      id="research"
      eyebrow="Research & Recognition"
      title="Publication, education, and honors."
    >
      <div className="space-y-6">
        {/* featured publication - full width */}
        <Reveal>
          <Tilt max={3}>
            <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/[0.1] to-transparent p-7 sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
              <div className="relative grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
                {/* left: meta */}
                <div>
                  <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 font-mono text-xs text-accent-soft">
                    <FileText size={13} /> Peer-reviewed publication
                  </div>
                  <h3 className="text-2xl font-semibold leading-snug text-snow">
                    {publication.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs text-mist">
                    {publication.venue} &middot; {publication.date}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {publication.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent-soft"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={publication.doi}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-solid mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:gap-3"
                  >
                    View publication <ExternalLink size={14} />
                  </a>
                </div>
                {/* right: abstract */}
                <p className="text-sm leading-relaxed text-mist lg:border-l lg:border-line lg:pl-10">
                  {publication.abstract}
                </p>
              </div>
            </div>
          </Tilt>
        </Reveal>

        {/* education + honors, equal columns */}
        <div className="grid items-stretch gap-6 md:grid-cols-2">
          <Reveal delay={0.05} className="h-full">
            <div className="gloss h-full rounded-2xl p-7">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-snow">
                <GraduationCap size={16} className="text-accent" /> Education
              </h3>
              <div className="space-y-5">
                {education.map((e) => (
                  <div key={e.degree} className="border-l-2 border-accent/40 pl-4">
                    <p className="font-medium text-fog">{e.degree}</p>
                    <p className="text-sm text-mist">{e.school}</p>
                    <p className="mt-0.5 font-mono text-xs text-mist">
                      {e.detail} &middot; {e.period}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            <div className="gloss h-full rounded-2xl p-7">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-snow">
                <Sparkles size={15} className="text-accent" /> Honors &amp; Awards
              </h3>
              <ul className="space-y-2.5">
                {honors.map((h, i) => {
                  const Icon = honorIcons[i % honorIcons.length];
                  return (
                    <li
                      key={h.title}
                      className="group flex items-start gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-line hover:bg-[color:var(--chip-bg)]"
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent-soft transition-transform group-hover:scale-110">
                        <Icon size={15} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-fog">{h.title}</p>
                        <p className="text-xs text-mist">
                          {h.note} &middot; {h.year}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
