import { useRef } from "react";
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
import { techIcon } from "../lib/techIcons";

const icons: Record<string, LucideIcon> = {
  ShieldAlert,
  Waypoints,
  FileText,
  NotebookPen,
  FlaskConical,
  ShoppingBag,
};

function useSpotlight() {
  const frame = useRef(0);
  return (e: React.MouseEvent<HTMLElement>) => {
    if (frame.current) return;
    const el = e.currentTarget;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
      frame.current = 0;
    });
  };
}

export default function Projects() {
  const spotlight = useSpotlight();

  return (
    <Section id="work" eyebrow="Selected Work" title="Things I have built.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => {
          const Icon = icons[p.icon] ?? FileText;
          return (
            <Reveal key={p.title} delay={(i % 3) * 0.07} className="h-full">
              <Tilt max={7} className="h-full">
                <article
                  onMouseMove={spotlight}
                  className="group relative flex h-full min-h-[23rem] flex-col justify-end overflow-hidden rounded-2xl border border-line [transform-style:preserve-3d]"
                >
                  {/* cover image (cohesive dark treatment) */}
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover brightness-[0.8] saturate-[0.85] transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-100 group-hover:saturate-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-[#070709]/25" />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_55%)] opacity-60 mix-blend-overlay" />

                  {/* cursor spotlight */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(260px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 28%, transparent), transparent 60%)",
                    }}
                  />

                  {/* index watermark */}
                  <span className="pointer-events-none absolute right-4 top-1 font-mono text-6xl font-bold text-white/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* icon badge (floats in 3D) */}
                  <span
                    className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    <Icon size={18} className="text-white" />
                  </span>

                  {/* content */}
                  <div
                    className="relative p-5"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <h3 className="text-base font-semibold text-white">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {p.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.map((t) => {
                        const TagIcon = techIcon(t);
                        return (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[11px] text-white/90 backdrop-blur-md"
                          >
                            {TagIcon && (
                              <TagIcon size={11} className="text-accent-soft" />
                            )}
                            {t}
                          </span>
                        );
                      })}
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
