import { useMemo } from "react";

// Gentle, always-on floating particles for ambient life. Decorative only.
export default function Particles({ count = 30 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin(i * 9301 + n * 49297) * 233280;
          return x - Math.floor(x);
        };
        return {
          left: r(1) * 100,
          top: r(2) * 100,
          size: 1.5 + r(3) * 2.5,
          duration: 8 + r(4) * 12,
          delay: r(5) * -16,
          drift: 10 + r(6) * 26,
          opacity: 0.15 + r(7) * 0.4,
        };
      }),
    [count],
  );

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-accent"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            boxShadow: "0 0 8px 1px color-mix(in srgb, var(--accent) 50%, transparent)",
            animation: `floaty ${d.duration}s ease-in-out ${d.delay}s infinite`,
            // each particle drifts a slightly different distance
            ["--drift" as string]: `-${d.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
