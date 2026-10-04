import { useEffect, useState } from "react";

/** Scrollspy: the section that currently crosses the middle of the viewport.
 *  Returns "" when none of the given sections is there (for example while the
 *  hero is on screen), so no nav item lights up. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        // sections do not overlap, so at most one is on the midline
        setActive(ids.find((id) => visible.has(id)) ?? "");
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}
