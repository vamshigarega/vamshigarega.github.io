import {
  ShieldAlert,
  Waypoints,
  FileText,
  NotebookPen,
  FlaskConical,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import Tilt from "./Tilt";
import { projects } from "../data/content";

const icons: Record<string, LucideIcon> = {
  ShieldAlert,
  Waypoints,
  FileText,
  NotebookPen,
  FlaskConical,
  ShoppingBag,
};

export default function Projects() {
  return (
    <Section id="work" eyebrow="Selected Work" title="Things I have built.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => {
          const Icon = icons[p.icon] ?? FileText;
          return (
            <Reveal key={p.title} delay={(i % 3) * 0.06} className="h-full">
              <Tilt className="h-full">
              <article className="gloss group flex h-full flex-col overflow-hidden rounded-2xl">
                {/* designed cover */}
                <div
                  className="relative aspect-[16/10] overflow-hidden"
                  style={{
                    background: `radial-gradient(120% 120% at 0% 0%, ${p.from} 0%, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${p.to} 0%, transparent 55%), #0b0b0e`,
                  }}
                >
                  {/* mesh sheen */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.18),transparent_50%)]" />
                  {/* dot grid */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                      maskImage:
                        "radial-gradient(circle at 70% 30%, #000, transparent 70%)",
                      WebkitMaskImage:
                        "radial-gradient(circle at 70% 30%, #000, transparent 70%)",
                    }}
                  />
                  {/* glyph */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon
                      size={56}
                      strokeWidth={1.4}
                      className="text-white/90 drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-semibold text-snow">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">
                    {p.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent-soft"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
              </Tilt>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
