import { useEffect, useRef, useState } from "react";

function parse(value: string) {
  const m = value.match(/^(\D*)([\d.]+)(.*)$/);
  if (!m) return { prefix: "", num: 0, suffix: value, decimals: 0 };
  const decimals = m[2].includes(".") ? m[2].split(".")[1].length : 0;
  return { prefix: m[1], num: parseFloat(m[2]), suffix: m[3], decimals };
}

/**
 * Counts up to a numeric value when scrolled into view.
 * Uses a plain IntersectionObserver (reliable on mobile), honors
 * reduced-motion, and always resolves to the real value as a safety net.
 */
export default function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { prefix, num, suffix, decimals } = parse(value);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setN(num);
      return;
    }

    let raf = 0;
    let started = false;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      if (started) return;
      started = true;
      if (reduce) {
        setN(num);
        return;
      }
      const start = performance.now();
      const duration = 1300;
      const tick = (t: number) => {
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(num * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setN(num);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);

    // Safety net: if the observer never fires for any reason, still show the
    // real number after a short delay so it never sticks at 0.
    const fallback = window.setTimeout(run, 2500);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, [num]);

  return (
    <span ref={ref}>
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}
