import { motion } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { profile } from "../data/content";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pt-28 pb-20"
    >
      {/* availability pill */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="chip mb-8 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-mist backdrop-blur"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Open to AI / Software Engineering roles
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05, ease }}
        className="mb-4 font-mono text-sm tracking-tight text-accent"
      >
        {profile.name}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
        className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-snow sm:text-7xl"
      >
        <span className="text-gradient-anim">AI Engineer</span> building agents,
        <br className="hidden sm:block" /> MCP servers, and intelligent systems.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        className="mt-7 max-w-xl text-lg leading-relaxed text-mist"
      >
        I design and ship production AI agents and large-scale data systems.
        Currently at <span className="text-fog">Apple</span>, turning ambiguous
        problems into clean, shipped software.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease }}
        className="mt-10 flex flex-wrap items-center gap-4"
      >
        <a
          href="#work"
          className="group inline-flex items-center gap-2 rounded-full bg-snow px-6 py-3 text-sm font-semibold text-ink transition-all hover:gap-3 hover:bg-white"
        >
          View my work
          <ArrowUpRight
            size={17}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
        <a
          href="#contact"
          className="btn-outline inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
        >
          Get in touch
        </a>
        <span className="ml-1 inline-flex items-center gap-1.5 text-sm text-mist">
          <MapPin size={15} className="text-accent" />
          {profile.location}
        </span>
      </motion.div>
    </section>
  );
}
