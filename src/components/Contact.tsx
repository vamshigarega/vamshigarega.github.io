import { Mail, Phone, Linkedin, Github, MapPin } from "lucide-react";
import Reveal from "./Reveal";
import ContactForm from "./ContactForm";
import Map from "./Map";
import { profile } from "../data/content";

const directLinks = [
  { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
  {
    icon: Phone,
    label: profile.phone,
    href: `tel:${profile.phone.replace(/[^+\d]/g, "")}`,
  },
  { icon: Linkedin, label: "LinkedIn", href: profile.socials.linkedin },
  { icon: Github, label: "GitHub", href: profile.socials.github },
];

export default function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      <Reveal className="mb-14 text-center">
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-accent/60" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent/90">
            Contact
          </span>
          <span className="h-px w-8 bg-accent/60" />
        </div>
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-snow sm:text-4xl">
          Let us build something great.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-mist">
          Send me a message and it lands straight in my inbox. I am open to AI and
          software engineering roles, and always happy to talk shop.
        </p>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* form */}
        <Reveal className="h-full">
          <ContactForm />
        </Reveal>

        {/* map + direct links */}
        <Reveal delay={0.08} className="flex flex-col gap-6">
          <div className="flex-1">
            <Map />
          </div>

          <div className="gloss rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-snow">
              <MapPin size={15} className="text-accent" /> Based in Austin, Texas
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {directLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="chip group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-fog transition-colors hover:text-snow"
                >
                  <Icon size={16} className="text-accent" />
                  <span className="truncate">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
