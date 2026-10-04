import Reveal from "./Reveal";

type SectionHeadProps = {
  kicker: string;
  title: string;
  body?: string;
  className?: string;
};

/** Section opener: a small label, a large statement, an optional lead-in. */
export default function SectionHead({ kicker, title, body, className = "" }: SectionHeadProps) {
  return (
    <Reveal className={className}>
      <p className="kicker">{kicker}</p>
      <h2 className="display-2 mt-4 max-w-3xl">{title}</h2>
      {body && <p className="lede mt-5 max-w-2xl">{body}</p>}
    </Reveal>
  );
}
