import { Linkedin, Github, Instagram, Mail, ArrowUp } from "lucide-react";
import { profile, nav, codingProfiles } from "../data/content";

const socials = [
  { icon: Linkedin, href: profile.socials.linkedin, label: "LinkedIn" },
  { icon: Github, href: profile.socials.github, label: "GitHub" },
  { icon: Instagram, href: profile.socials.instagram, label: "Instagram" },
  { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-12">
        {/* brand */}
        <div className="lg:col-span-5">
          <a href="#top" className="font-mono text-lg font-semibold text-snow">
            {profile.initials}
            <span className="text-accent">.</span>
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">
            {profile.role} building agents, MCP servers, and intelligent systems.
            Based in {profile.location}.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={label}
                className="rounded-full border border-line p-2.5 text-mist transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:text-snow"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* nav */}
        <div className="lg:col-span-2">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-snow">
            Navigate
          </h4>
          <ul className="space-y-2.5">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-mist transition-colors hover:text-snow"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* coding profiles */}
        <div className="lg:col-span-2">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-snow">
            Coding
          </h4>
          <ul className="space-y-2.5">
            {codingProfiles.map((p) => (
              <li key={p.label}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-mist transition-colors hover:text-snow"
                >
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* contact */}
        <div className="lg:col-span-3">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-snow">
            Get in touch
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="break-all text-mist transition-colors hover:text-snow"
              >
                {profile.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
                className="text-mist transition-colors hover:text-snow"
              >
                {profile.phone}
              </a>
            </li>
            <li>
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="text-mist transition-colors hover:text-snow"
              >
                Download resume
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* bottom copyright bar */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row">
          <p className="text-xs text-mist">
            &copy; {year} {profile.name}. All rights reserved.
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-xs text-mist transition-colors hover:text-snow"
          >
            Back to top <ArrowUp size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
