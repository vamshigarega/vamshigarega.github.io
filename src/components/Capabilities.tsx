import { motion } from "motion/react";
import { Bot, Database, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import capAi from "../assets/img/cap-ai.jpg";
import capData from "../assets/img/cap-data.jpg";
import capFullstack from "../assets/img/cap-fullstack.jpg";

type Cap = {
  icon: LucideIcon;
  title: string;
  blurb: string;
  tools: string[];
  image: string;
};

const caps: Cap[] = [
  {
    icon: Bot,
    title: "AI Engineering & Agents",
    blurb:
      "Production LLM agents and MCP servers with the Anthropic Claude SDK and Google ADK, wired into real engineering workflows.",
    tools: ["Claude SDK", "MCP", "RAG", "FastAPI"],
    image: capAi,
  },
  {
    icon: Database,
    title: "Data Engineering",
    blurb:
      "Distributed pipelines and lakehouses moving data at petabyte scale, with reliable orchestration and quality checks.",
    tools: ["Airflow", "Spark", "Iceberg", "Trino"],
    image: capData,
  },
  {
    icon: Layers,
    title: "Full-Stack & Backend",
    blurb:
      "React and TypeScript front ends over FastAPI and Django services, shipped on Docker and Kubernetes with clean CI/CD.",
    tools: ["React", "TypeScript", "Django", "Kubernetes"],
    image: capFullstack,
  },
];

export default function Capabilities() {
  return (
    <Section id="capabilities" eyebrow="What I build" title="Capabilities, end to end.">
      <div className="grid gap-6 md:grid-cols-3">
        {caps.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.1} className="h-full">
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex h-full min-h-[24rem] flex-col justify-end overflow-hidden rounded-2xl border border-white/10"
            >
              {/* image */}
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
              />
              {/* overlays for legibility (dark in both themes by design) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-[#06060a]/55 to-[#06060a]/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* content */}
              <div className="relative p-6">
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md">
                  <c.icon size={20} className="text-white" />
                </span>
                <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {c.blurb}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[11px] text-white/90 backdrop-blur-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
