"use client";

import { CARD_H, CARD_W } from "@/lib/layout";
import type { Node, Point } from "@/lib/types";

type Props = {
  node: Node;
  p: Point;
  dim: number;
  highlighted: boolean;
  onSelect: (id: string) => void;
};

/** Compact rectangular node used by the "cards" visual style. */
export default function ServiceCard({ node, p, dim, highlighted, onSelect }: Props) {
  const snippet = node.d.length > 34 ? `${node.d.slice(0, 32)}…` : node.d;

  return (
    <g
      transform={`translate(${p.x - CARD_W / 2},${p.y - CARD_H / 2})`}
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
    >
      <rect
        x={0}
        y={0}
        width={CARD_W}
        height={CARD_H}
        rx={8}
        fill={highlighted ? "#151d2b" : "#101722"}
        stroke={highlighted ? node.accent : "#25313f"}
        strokeWidth={highlighted ? 1.6 : 1}
        opacity={dim}
      />
      {/* left accent bar */}
      <rect x={0} y={0} width={4} height={CARD_H} rx={2} fill={node.accent} opacity={dim} />
      <text
        x={14}
        y={16}
        fill={node.accent}
        fontSize={8.5}
        fontWeight={700}
        letterSpacing=".03em"
        fontFamily="var(--font-sans)"
        opacity={dim * 0.9}
      >
        {node.cat.toUpperCase()}
      </text>
      <text
        x={14}
        y={33}
        fill="#e7ecf2"
        fontSize={13.5}
        fontWeight={600}
        fontFamily="var(--font-sans)"
        opacity={dim}
      >
        {node.name}
      </text>
      <text x={14} y={46} fill="#7c8ca0" fontSize={9.5} fontFamily="var(--font-mono)" opacity={dim * 0.85}>
        {snippet}
      </text>
    </g>
  );
}
