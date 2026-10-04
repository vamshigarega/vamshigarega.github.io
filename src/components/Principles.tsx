import Reveal from "./Reveal";
import GlossCard from "./GlossCard";
import BackdropVideo from "./BackdropVideo";
import { principles } from "../data/content";
import clip from "../assets/video/band-code.mp4";
import poster from "../assets/img/band-code.jpg";
import posterAvif from "../assets/img/band-code.avif";

/** An editor at work in the background, the working habits on glass in front.
 *  Veiled in the page background, so it follows the theme. */
export default function Principles() {
  return (
    <section className="relative isolate overflow-clip">
      <BackdropVideo src={clip} posterAvif={posterAvif} poster={poster} width={1280} height={720} />
      <div className="absolute -inset-px bg-bg" style={{ opacity: "calc(var(--band-veil) + 0.1)" }} />
      <div className="absolute -inset-px bg-gradient-to-b from-bg from-[4%] via-transparent to-bg to-[96%]" />

      <div className="page relative py-20 lg:py-32">
        <Reveal>
          <p className="kicker">How I work</p>
          <h2 className="display-2 mt-4 max-w-2xl">The habits behind the output.</h2>
        </Reveal>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {principles.map((p, i) => (
            <li key={p.title} className="contents">
              <GlossCard
                delay={i * 0.08}
                tilt={5}
                className="p-6 [background:color-mix(in_srgb,var(--bg)_86%,transparent)] sm:p-7"
              >
                <p className="spectrum-text w-fit font-mono text-sm font-semibold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
              </GlossCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
