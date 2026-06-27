import { ExternalLink, FileText, Award } from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import { publication, honors, education } from "../data/content";

export default function Research() {
  return (
    <Section
      id="research"
      eyebrow="Research & Recognition"
      title="Publication, education, and honors."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* publication */}
        <Reveal className="lg:row-span-2">
          <div className="flex h-full flex-col gloss rounded-2xl p-7">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1 font-mono text-xs text-accent-soft">
              <FileText size={13} /> Peer-reviewed publication
            </div>
            <h3 className="text-xl font-semibold leading-snug text-snow">
              {publication.title}
            </h3>
            <p className="mt-1 font-mono text-xs text-mist">
              {publication.venue} &middot; {publication.date}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {publication.tags.map((t) => (
                <span
                  key={t}
                  className="chip rounded-md px-2 py-0.5 font-mono text-[11px] text-fog"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-5 flex-1 text-sm leading-relaxed text-mist">
              {publication.abstract}
            </p>
            <a
              href={publication.doi}
              target="_blank"
              rel="noreferrer"
              className="btn-outline mt-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              View publication <ExternalLink size={14} />
            </a>
          </div>
        </Reveal>

        {/* education */}
        <Reveal delay={0.05}>
          <div className="gloss rounded-2xl p-7">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-snow">
              Education
            </h3>
            <div className="space-y-5">
              {education.map((e) => (
                <div key={e.degree} className="border-l border-accent/40 pl-4">
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

        {/* honors */}
        <Reveal delay={0.1}>
          <div className="gloss rounded-2xl p-7">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-snow">
              <Award size={15} className="text-accent" /> Honors & Awards
            </h3>
            <ul className="space-y-4">
              {honors.map((h) => (
                <li key={h.title} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm font-medium text-fog">{h.title}</p>
                    <p className="text-xs text-mist">
                      {h.note} &middot; {h.year}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
