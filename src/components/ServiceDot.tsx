"use client";

import type { Node, Point } from "@/lib/types";

type Props = {
  node: Node;
  p: Point;
  dim: number;
  highlighted: boolean;
  /** Rotate the label to follow the ring tangent (graph mode only). */
  rotate?: boolean;
  onSelect: (id: string) => void;
};

/** Dot plus label, the node form used by the "circle" visual style. */
export default function ServiceDot({ node, p, dim, highlighted, rotate, onSelect }: Props) {
  const right = p.x >= 0;
  // Flip labels on the left half so text never reads upside down.
  const deg = rotate ? ((p.ang ?? 0) * 180) / Math.PI + (right ? 0 : 180) : 0;
  const transform = rotate
    ? `translate(${p.x},${p.y}) rotate(${deg})`
    : `translate(${p.x},${p.y})`;

  return (
    <g
      transform={transform}
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
    >
      <circle
        cx={0}
        cy={0}
        r={rotate ? 4 : 3.5}
        fill={node.accent}
        opacity={dim}
        // Undo the group rotation so the dot itself is never skewed.
        transform={rotate ? `rotate(${-deg})` : undefined}
      />
      <text
        x={right ? (rotate ? 10 : 8) : rotate ? -10 : -8}
        y={0}
        fill={rotate ? (highlighted ? node.accent : "#c9d3de") : "#e7ecf2"}
        fontSize={rotate ? 12 : 13}
        textAnchor={right ? "start" : "end"}
        dominantBaseline="middle"
        fontFamily="var(--font-mono)"
        opacity={dim}
      >
        {node.name}
      </text>
    </g>
  );
}
