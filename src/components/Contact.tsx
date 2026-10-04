import { useEffect, useRef, useState } from "react";
import {
  Check,
  Clock,
  Copy,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import GlossCard from "./GlossCard";
import Reveal from "./Reveal";
import Stage, { type StageHandle } from "./Stage";
import ContactForm from "./ContactForm";
import Map from "./Map";
import { contactCopy, profile, stageHint } from "../data/content";

/** The hour in Austin, so someone scheduling a call knows it at a glance. */
function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
  }).format(now);
  return <span suppressHydrationWarning>{time} Central</span>;
}

/** The close. Beside the invitation flies a paper plane (it leans toward the
 *  cursor, and takes off when the form is sent), with the actions a recruiter
 *  actually needs one click away: email, copy the address, resume. The
 *  message form and the map share one console below. */
export default function Contact() {
  const [copied, setCopied] = useState(false);
  const stage = useRef<StageHandle>(null);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <section id="contact" className="relative isolate scroll-mt-14 overflow-x-clip">
      <span aria-hidden className="aura left-1/2 top-40 h-[30rem] w-[44rem] -translate-x-1/2" />

      <div className="page pb-14 pt-16 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-28">
        <div className="grid items-center gap-x-8 gap-y-4 lg:grid-cols-2">
          <Reveal>
            <p className="kicker">{contactCopy.kicker}</p>
            <h2 className="display-1 mt-4">{contactCopy.title}</h2>
            <p className="lede mt-6 max-w-md">{contactCopy.body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={`mailto:${profile.email}`} className="btn btn-primary">
                <Mail size={16} /> Email me
              </a>
              <button onClick={copyEmail} className="btn btn-ghost" aria-live="polite">
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Copy email
                  </>
                )}
              </button>
              <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <FileText size={16} /> Resume
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-6 text-sm text-muted">
              <li>
                <a
                  href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
                  className="link inline-flex items-center gap-2 py-1 hover:text-ink"
                >
                  <Phone size={15} /> {profile.phone}
                </a>
              </li>
              <li>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="link inline-flex items-center gap-2 py-1 hover:text-ink"
                >
                  <Linkedin size={15} /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="link inline-flex items-center gap-2 py-1 hover:text-ink"
                >
                  <Github size={15} /> GitHub
                </a>
              </li>
            </ul>
            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-faint">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} /> {profile.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} /> <LocalTime />
              </span>
            </p>
          </Reveal>

          {/* a message on its way */}
          <div className="relative">
            <Stage ref={stage} scene="plane" className="h-[19rem] sm:h-[25rem] lg:h-[34rem]" />
            <p className="kicker pointer-events-none absolute inset-x-0 bottom-2 text-center">
              <span className="hidden [@media(hover:hover)]:inline">{stageHint.plane.pointer}</span>
              <span className="[@media(hover:hover)]:hidden">{stageHint.plane.touch}</span>
            </p>
          </div>
        </div>

        <GlossCard
          lead
          tilt={0}
          wrapClassName="mt-10 lg:mt-14"
          className="!rounded-[2rem] p-6 sm:p-9"
        >
          <div className="relative z-[3] grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="kicker mb-6">Send a message</p>
              <ContactForm onSent={() => stage.current?.signal("sent")} />
            </div>
            <div className="min-h-[17rem] lg:col-span-5">
              <Map />
            </div>
          </div>
        </GlossCard>
      </div>
    </section>
  );
}
