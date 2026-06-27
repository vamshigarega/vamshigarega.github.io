/** Ambient Apple-Noir backdrop: deep base, two slow aurora glows, fine grid,
 *  and a subtle grain layer. Purely decorative and pointer-transparent. */
export default function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink"
    >
      {/* aurora glows */}
      <div className="animate-drift absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-accent/15 blur-[120px]" />
      <div
        className="animate-drift absolute -bottom-52 -right-32 h-[40rem] w-[40rem] rounded-full bg-accent-2/12 blur-[130px]"
        style={{ animationDelay: "-9s" }}
      />

      {/* fine grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(var(--grid-rgb) / 1) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--grid-rgb) / 1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
        }}
      />

      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--shadow)_100%)]" />
    </div>
  );
}
