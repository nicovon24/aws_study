"use client";

type Props = {
  label?: string;
};

const SEGMENTS = [
  { d: "M 10 100 L 10 20 L 155 20", delay: "0s" },
  { d: "M 130 20 L 250 20 L 250 100", delay: "-1.05s" },
  { d: "M 250 40 L 250 110 L 105 110", delay: "-2.1s" },
  { d: "M 130 110 L 10 110 L 10 45", delay: "-3.15s" },
];

/**
 * Full-viewport loading state: a rectangle whose four edges chase each other
 * (dash offset animation) with the label inside, and a sliding rainbow bar
 * underneath.
 */
export default function Loader({ label = "LOADING" }: Props) {
  return (
    <div
      className="flex h-screen w-full flex-col items-center justify-center gap-10 bg-bg bg-repeat sm:gap-20"
      style={{
        backgroundImage:
          "linear-gradient(#1c2b4a 1px,transparent 1px),linear-gradient(90deg,#1c2b4a 1px,transparent 1px),linear-gradient(#16233c 1px,transparent 1px),linear-gradient(90deg,#16233c 1px,transparent 1px)",
        backgroundSize: "73px 73px,73px 73px,18.25px 18.25px,18.25px 18.25px",
      }}
    >
      <div className="relative h-[280px] w-[560px] max-w-[85vw]">
        <svg viewBox="0 0 260 130" className="h-full w-full overflow-visible">
          {SEGMENTS.map((seg, i) => (
            <path
              key={i}
              d={seg.d}
              fill="none"
              stroke="#94a3bb"
              strokeWidth="2.5"
              strokeDasharray="16 10"
              className="loader-segment"
              style={{ animationDelay: seg.delay }}
              markerEnd="url(#loader-arrow)"
            />
          ))}
          <defs>
            <marker
              id="loader-arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3bb" />
            </marker>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-sans text-3xl font-bold tracking-wide text-ink-2">{label}</span>
        </div>
      </div>

      <div className="h-[10px] w-4/5 max-w-[1600px] overflow-hidden rounded-full bg-line">
        <div className="loader-bar h-full w-full" />
      </div>
    </div>
  );
}
