import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { useGloss } from "../hooks/useGloss";

type GlossCardProps = {
  children: ReactNode;
  className?: string;
  /** Outer wrapper classes: grid placement, height. */
  wrapClassName?: string;
  as?: ElementType;
  delay?: number;
  /** Degrees of pointer tilt. 0 turns it off. */
  tilt?: number;
  /** Keeps the spectrum rim lit: for the one card in a group that leads. */
  lead?: boolean;
};

/** The page's one card. It rises in on scroll, catches a pass of light as it
 *  appears, and under a cursor it tilts, lifts, and shows a glare and a
 *  spectrum rim (styles: `.gloss` in index.css). */
export default function GlossCard({
  children,
  className = "",
  wrapClassName = "",
  as: Tag = "div",
  delay = 0,
  tilt = 4,
  lead = false,
}: GlossCardProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const gloss = useGloss<HTMLElement>(tilt);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "-50px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className={`reveal ${shown ? "reveal-in" : ""} ${wrapClassName}`}
      style={{ transitionDelay: delay ? `${delay}s` : undefined } as CSSProperties}
    >
      <Tag {...gloss} className={`gloss ${lead ? "gloss-lead" : ""} h-full ${className}`}>
        <span aria-hidden className="gloss-sweep" />
        {children}
      </Tag>
    </div>
  );
}
