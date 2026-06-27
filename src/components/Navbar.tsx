import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, profile } from "../data/content";
import ThemeToggle from "./ThemeToggle";
import { useActiveSection } from "../hooks/useActiveSection";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ids = useMemo(() => nav.map((n) => n.id), []);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 transition-all duration-500 ${
          scrolled ? "glass py-2.5 shadow-lg shadow-black/30" : "py-2.5"
        }`}
        style={{ width: scrolled ? "min(100% - 1.5rem, 64rem)" : undefined }}
      >
        <a
          href="#top"
          className="font-mono text-sm font-semibold tracking-tight text-snow"
        >
          {profile.initials}
          <span className="text-accent">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`group relative text-sm transition-colors ${
                  isActive ? "text-snow" : "text-mist hover:text-snow"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="btn-outline hidden rounded-full px-4 py-1.5 text-sm font-medium sm:inline-block"
          >
            Resume
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="text-snow md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="mx-3 mt-2 md:hidden">
          <div className="glass flex flex-col rounded-2xl p-2">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-fog transition-colors hover:bg-[color:var(--chip-bg)] hover:text-snow"
              >
                {item.label}
              </a>
            ))}
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-accent"
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
