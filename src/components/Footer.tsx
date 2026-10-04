import { ArrowUp, FileText, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { codingProfiles, nav, profile } from "../data/content";

const socials = [
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
  { label: "LinkedIn", href: profile.socials.linkedin, icon: Linkedin },
  { label: "GitHub", href: profile.socials.github, icon: Github },
  { label: "Instagram", href: profile.socials.instagram, icon: Instagram },
  { label: "Resume", href: profile.resume, icon: FileText },
];

/** A short close: who this is, where to go, how to reach him. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative">
      <span aria-hidden className="block h-px bg-[image:var(--spectrum)] opacity-60" />

      <div className="page flex flex-col gap-8 py-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">
            {profile.role}. {profile.title} at {profile.company}. {profile.location}.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="link py-1.5 text-muted hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>

        <ul className="flex gap-2">
          {socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="tile transition-transform duration-300 hover:-translate-y-0.5 hover:text-accent"
              >
                <Icon size={17} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line">
        <div className="page flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 text-xs text-faint">
          <p>
            &copy; {year} {profile.name}
          </p>
          <ul className="flex flex-wrap gap-x-5">
            {codingProfiles.map((c) => (
              <li key={c.label}>
                <a href={c.href} target="_blank" rel="noreferrer" className="link py-1.5 hover:text-ink">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#top" className="link inline-flex items-center gap-1.5 py-1.5 hover:text-ink">
            Back to top <ArrowUp size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
