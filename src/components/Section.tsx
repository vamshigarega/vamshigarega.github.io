import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:py-28 ${className}`}
    >
      {(eyebrow || title) && (
        <Reveal className="mb-14">
          {eyebrow && (
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent/90">
                {eyebrow}
              </span>
            </div>
          )}
          {title && (
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-snow sm:text-4xl">
              {title}
            </h2>
          )}
        </Reveal>
      )}
      {children}
    </section>
  );
}
