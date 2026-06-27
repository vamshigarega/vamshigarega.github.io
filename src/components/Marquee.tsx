const tech = [
  "Anthropic Claude SDK",
  "Model Context Protocol",
  "Google ADK",
  "FastAPI",
  "Kubernetes",
  "Apache Airflow",
  "Python",
  "Docker",
  "Snowflake",
  "Trino",
  "Apache Iceberg",
  "Kafka",
  "React",
  "TypeScript",
  "AWS",
];

export default function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-line py-6">
      <div className="mask-fade-x flex w-max animate-marquee gap-10 pr-10">
        {[...tech, ...tech].map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-3 whitespace-nowrap font-mono text-sm text-mist/70"
          >
            <span className="h-1 w-1 rounded-full bg-accent/60" />
            {t}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
