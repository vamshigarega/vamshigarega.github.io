import { BookOpen, Briefcase, GraduationCap, MapPin, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import GlossCard from "./GlossCard";
import Picture from "./Picture";
import { about, profile } from "../data/content";
import portrait from "../assets/img/profile.jpg";
import portraitAvif from "../assets/img/profile.avif";

// one icon per fact, in about.facts order
const factIcons: LucideIcon[] = [Briefcase, MapPin, GraduationCap, BookOpen];

export default function About() {
  return (
    <section className="relative isolate overflow-x-clip">
      <span aria-hidden className="aura -left-48 top-32 h-[26rem] w-[26rem]" />

      <div className="page grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
        {/* portrait in a glass frame; the name plate floats above it */}
        <GlossCard
          wrapClassName="lg:col-span-4"
          className="aspect-[4/5] overflow-clip lg:aspect-auto lg:min-h-[32rem]"
          tilt={7}
        >
          <Picture
            avif={portraitAvif}
            src={portrait}
            alt={profile.name}
            width={900}
            height={1062}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 z-[3] rounded-2xl border border-white/15 bg-black/45 px-4 py-3 backdrop-blur-md">
            <p className="text-sm font-semibold text-white">{profile.name}</p>
            <p className="mt-0.5 text-xs text-white/70">
              {profile.role} / {profile.title}, {profile.company}
            </p>
          </div>
        </GlossCard>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal>
            <p className="kicker">{about.kicker}</p>
            <h2 className="display-2 mt-4">{about.title}</h2>
          </Reveal>
          <div className="mt-7 space-y-5">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.06 * (i + 1)}>
                <p className="lede">{p}</p>
              </Reveal>
            ))}
          </div>

          <dl className="mt-10 grid gap-3 sm:grid-cols-2">
            {about.facts.map((f, i) => {
              const Icon = factIcons[i % factIcons.length];
              return (
                <GlossCard
                  key={f.label}
                  delay={0.05 * i}
                  tilt={0}
                  className="flex items-center gap-4 !rounded-2xl p-4"
                >
                  <span className="tile">
                    <Icon size={18} />
                  </span>
                  <div>
                    <dt className="kicker">{f.label}</dt>
                    <dd className="mt-1.5 text-[15px] font-medium leading-snug">{f.value}</dd>
                  </div>
                </GlossCard>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
