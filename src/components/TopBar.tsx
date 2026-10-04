import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, profile } from "../data/content";
import ThemeToggle from "./ThemeToggle";
import { useActiveSection } from "../hooks/useActiveSection";

/** A flat bar, not a floating capsule: name on the left, sections on the
 *  right, a hairline that appears once the page moves. */
export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ids = useMemo(() => nav.map((n) => n.id), []);
  const active = useActiveSection(ids);

  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) {
        progress.current.style.transform = `scaleX(${(max > 0 ? window.scrollY / max : 0).toFixed(4)})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-500 ${
        scrolled || open ? "border-line bg-[var(--scrim)]" : "border-transparent"
      }`}
    >
      <span
        ref={progress}
        aria-hidden
        className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-[image:var(--spectrum)]"
      />
      <nav aria-label="Primary" className="page flex h-14 items-center justify-between">
        <a
          href="#top"
          aria-label={`${profile.name}, back to top`}
          className="flex items-baseline gap-3 whitespace-nowrap text-[15px] font-semibold tracking-tight"
        >
          {profile.shortName}
          <span className="kicker hidden sm:inline md:hidden lg:inline">{profile.role}</span>
        </a>

        <div className="flex items-center gap-1">
          <div className="mr-3 hidden items-center gap-5 md:flex lg:gap-7">
            {nav.map((item) => {
              const on = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={on ? "location" : undefined}
                  className={`py-2 text-sm transition-colors ${
                    on ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
          <ThemeToggle />
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary ml-2 hidden !px-4 !py-2 !text-sm min-[360px]:inline-flex"
          >
            Resume
          </a>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 ml-1 grid h-10 w-10 place-items-center md:hidden"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="page border-t border-line pb-6 pt-2 md:hidden">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="block border-b border-line py-4 text-2xl font-semibold tracking-tight"
            >
              {item.label}
            </a>
          ))}
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-6 w-full"
          >
            Resume
          </a>
        </div>
      )}
    </header>
  );
}
