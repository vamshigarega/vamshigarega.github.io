import { ArrowUpRight, Award, GraduationCap, ScrollText } from "lucide-react";
import SectionHead from "./SectionHead";
import GlossCard from "./GlossCard";
import { education, honors, publication } from "../data/content";

/** The paper leads at full width (what it is on the left, what it says on
 *  the right); education and honors share the row beneath, sized so both
 *  cards end on the same line. */
export default function Research() {
  return (
    <section id="research" className="relative isolate scroll-mt-14 overflow-x-clip">
      <span aria-hidden className="aura -right-44 top-40 h-[26rem] w-[26rem]" />

      <div className="page py-16 sm:py-20 lg:py-28">
        <SectionHead kicker="Research and education" title="Published, funded, and recognized." />

        <div className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-12">
          {/* publication */}
          <GlossCard
            as="article"
            lead
            tilt={2}
            wrapClassName="lg:col-span-12"
            className="p-7 sm:p-10"
          >
            <div className="grid gap-x-12 gap-y-7 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <div className="flex items-center gap-4">
                  <span className="tile">
                    <ScrollText size={19} />
                  </span>
                  <p className="kicker">Peer-reviewed publication</p>
                </div>
                <h3 className="display-3 mt-7">{publication.title}</h3>
                <p className="mt-3 font-mono text-xs text-muted">
                  {publication.venue} / {publication.date}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {publication.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={publication.doi}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary relative z-[3] mt-8"
                >
                  Read the paper <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="lg:border-l lg:border-line lg:pl-12">
                <p className="kicker">Abstract</p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{publication.abstract}</p>
              </div>
            </div>
          </GlossCard>

          {/* education */}
          <GlossCard wrapClassName="lg:col-span-5" delay={0.06} className="p-7 sm:p-8">
            <div className="flex items-center gap-4">
              <span className="tile">
                <GraduationCap size={19} />
              </span>
              <p className="kicker">Education</p>
            </div>
            <ul className="mt-5">
              {education.map((e) => (
                <li key={e.degree} className="border-t border-line py-4 first:border-t-0">
                  <p className="font-semibold leading-snug tracking-tight">{e.degree}</p>
                  <p className="mt-1.5 text-sm text-muted">{e.school}</p>
                  <p className="mt-1.5 font-mono text-xs text-faint">
                    {e.detail} / {e.period}
                  </p>
                </li>
              ))}
            </ul>
          </GlossCard>

          {/* honors, two by two so the card matches education in height */}
          <GlossCard wrapClassName="lg:col-span-7" delay={0.12} className="p-7 sm:p-8">
            <div className="flex items-center gap-4">
              <span className="tile">
                <Award size={19} />
              </span>
              <p className="kicker">Honors</p>
            </div>
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
              {honors.map((h) => (
                <li
                  key={h.title}
                  className="border-t border-line py-4 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                >
                  <p className="font-semibold leading-snug tracking-tight">{h.title}</p>
                  <p className="mt-1.5 text-sm text-muted">{h.note}</p>
                  <p className="mt-1.5 font-mono text-xs text-faint">{h.year}</p>
                </li>
              ))}
            </ul>
          </GlossCard>
        </div>
      </div>
    </section>
  );
}
