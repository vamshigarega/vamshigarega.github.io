import { MapPin } from "lucide-react";
import { places } from "../data/content";
import { useTheme } from "../theme/ThemeContext";

// Keyless Google Maps embed framed to show both Austin and San Marcos.
const SRC =
  "https://maps.google.com/maps?ll=30.05,-97.87&q=Austin,Texas&z=9&output=embed";

export default function Map() {
  const { theme } = useTheme();

  return (
    <div className="gloss relative h-full min-h-[340px] overflow-hidden rounded-2xl">
      <iframe
        title="Map of Austin and San Marcos, Texas"
        src={SRC}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0 transition-[filter] duration-500"
        style={{
          filter:
            theme === "dark"
              ? "invert(1) hue-rotate(190deg) brightness(0.92) contrast(0.9) saturate(0.7)"
              : "none",
        }}
      />

      {/* location legend */}
      <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
        {places.map((p) => (
          <span
            key={p.name}
            className="glass inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-snow"
          >
            <MapPin size={12} className="text-accent" />
            {p.name.split(",")[0]}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[color:var(--hairline)]" />
    </div>
  );
}
