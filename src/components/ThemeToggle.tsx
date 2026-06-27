import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "../theme/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-line text-fog transition-colors hover:text-snow"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 14, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
