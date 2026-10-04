import { useRef } from "react";

// Tilt and glare follow a real cursor only. A tap also fires mouse events,
// which would leave a card stuck at an angle.
let finePointer: boolean | undefined;
function hasFinePointer() {
  finePointer ??= window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  return finePointer;
}

/** Feeds a `.gloss` element what its styles need from the cursor: where the
 *  glare sits (--mx, --my) and how far the card leans (--rx, --ry). Spread the
 *  result onto the element. `tilt` is in degrees; 0 turns the lean off. */
export function useGloss<T extends HTMLElement>(tilt = 4) {
  const ref = useRef<T>(null);
  const frame = useRef(0);

  function onPointerMove(e: React.PointerEvent) {
    if (frame.current || !hasFinePointer()) return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width;
      const py = (clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      if (tilt) {
        el.style.setProperty("--rx", `${((0.5 - py) * tilt).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${((px - 0.5) * tilt).toFixed(2)}deg`);
      }
    });
  }

  function onPointerLeave() {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    ref.current?.style.removeProperty("--rx");
    ref.current?.style.removeProperty("--ry");
  }

  return { ref, onPointerMove, onPointerLeave };
}
