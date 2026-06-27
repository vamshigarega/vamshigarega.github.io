import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin, ChevronDown } from "lucide-react";
import { profile } from "../data/content";
import Tilt from "./Tilt";
import heroImg from "../assets/img/showcase-datacenter.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  function onMove(e: React.MouseEvent) {
    if (frame.current) return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
      frame.current = 0;
    });
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      id="top"
      className="group/hero relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pt-28 pb-24"
    >
      {/* cursor-reactive glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/hero:opacity-100"
        style={{
          background:
            "radial-gradient(440px circle at var(--mx, 50%) var(--my, 40%), color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)",
        }}
      />

      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* left: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="chip mb-7 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-mist backdrop-blur"
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
            className="text-5xl font-semibold leading-[1.02] tracking-tight text-snow sm:text-6xl"
          >
            <span className="text-gradient-anim">AI Engineer</span> building
            agents, MCP servers, and intelligent systems.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-mist"
          >
            I design and ship production AI agents and large-scale data systems.
            Currently at <span className="text-fog">Apple</span>, turning
            ambiguous problems into clean, shipped software.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#work"
              className="btn-solid group/btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:gap-3"
            >
              View my work
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
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
        </div>

        {/* right: cinematic floating visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease }}
          className="relative hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Tilt max={9}>
              <div className="relative rounded-3xl [transform-style:preserve-3d]">
                <div className="overflow-hidden rounded-3xl border border-white/12 shadow-2xl shadow-black/50">
                  <img
                    src={heroImg}
                    alt="Large-scale infrastructure"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_srgb,var(--accent)_25%,transparent),transparent_55%)] mix-blend-screen" />
                </div>

                {/* floating stat chips with real 3D depth */}
                <div
                  className="absolute left-4 top-4 rounded-xl border border-white/15 bg-black/45 px-3.5 py-2 shadow-lg shadow-black/40 backdrop-blur-md"
                  style={{ transform: "translateZ(60px)" }}
                >
                  <div className="text-lg font-semibold text-white">95.6%</div>
                  <div className="text-[11px] text-white/70">gateway success</div>
                </div>
                <div
                  className="absolute bottom-4 right-4 rounded-xl border border-white/15 bg-black/45 px-3.5 py-2 shadow-lg shadow-black/40 backdrop-blur-md"
                  style={{ transform: "translateZ(45px)" }}
                >
                  <div className="text-lg font-semibold text-white">9 agents</div>
                  <div className="text-[11px] text-white/70">13+ MCP servers</div>
                </div>
                <div
                  className="absolute bottom-4 left-4 rounded-xl border border-white/15 bg-black/45 px-3.5 py-2 shadow-lg shadow-black/40 backdrop-blur-md"
                  style={{ transform: "translateZ(80px)" }}
                >
                  <div className="text-lg font-semibold text-white">~350</div>
                  <div className="text-[11px] text-white/70">K8s pods</div>
                </div>
              </div>
            </Tilt>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-mist transition-colors hover:text-snow sm:flex"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]">
          Scroll to explore
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </motion.a>
    </section>
  );
}
