import { useEffect, useRef, useState } from "react";

function parse(value: string) {
  const m = value.match(/^([~$<>]?)([\d.,]+)(.*)$/);
  if (!m) return null;
  const digits = m[2].replace(/,/g, "");
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  return {
    prefix: m[1],
    num: parseFloat(digits),
    suffix: m[3],
    decimals,
    grouped: m[2].includes(","),
  };
}

/** Counts up to a figure the first time it scrolls into view. Anything that
 *  is not a number ("React 19" is, "Docs" is not) is shown as written. Honors
 *  reduced motion, and always lands on the exact value. */
export default function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parse(value);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - start) / 1400, 1);
          setN(parsed.num * (1 - Math.pow(1 - p, 4)));
          if (p < 1) raf = requestAnimationFrame(tick);
          else setDone(true);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!parsed) return <span>{value}</span>;
  const shownValue = done ? parsed.num : n;
  const text = parsed.grouped
    ? Math.round(shownValue).toLocaleString("en-US")
    : shownValue.toFixed(parsed.decimals);

  return (
    <span ref={ref} className="tabular-nums">
      {parsed.prefix}
      {text}
      {parsed.suffix}
    </span>
  );
}
