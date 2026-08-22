"use client";

import type { Node, Point } from "@/lib/types";

type Props = {
  node: Node;
  p: Point;
  dim: number;
  /** Compact form used when all 15 categories render at once. */
  compact?: boolean;
  selected?: boolean;
  onSelect: (id: string) => void;
  onHover?: (node: Node | null, clientX: number, clientY: number) => void;
};

/** Service pill: accent dot plus name, positioned at a world-space point. */
export default function ServiceNode({ node, p, dim, compact, selected, onSelect, onHover }: Props) {
  const w = compact ? 140 : 168;
  return (
    <g
      transform={`translate(${p.x},${p.y})`}
      className="service-node cursor-pointer"
      opacity={dim}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onMouseEnter={(e) => onHover?.(node, e.clientX, e.clientY)}
      onMouseMove={(e) => onHover?.(node, e.clientX, e.clientY)}
      onMouseLeave={() => onHover?.(null, 0, 0)}
    >
      <foreignObject x={-w / 2} y={-14} width={w} height={28}>
        <div
          className="service-pill flex items-center gap-2 rounded-full border px-2.5 py-1.5"
          style={{
            background: selected ? `${node.accent}26` : "#131e33",
            borderColor: selected ? node.accent : `${node.accent}88`,
            borderWidth: selected ? 1.5 : 1,
            boxShadow: selected
              ? `0 0 0 3px ${node.accent}33, 0 4px 14px rgba(5,8,15,.5)`
              : "0 4px 14px rgba(5,8,15,.5)",
          }}
        >
          <span
            className="block h-1.75 w-1.75 shrink-0 rounded-full"
            style={{ background: node.accent }}
          />
          <span
            className="overflow-hidden text-ellipsis whitespace-nowrap font-sans font-semibold"
            style={{ fontSize: compact ? 11 : 12.5, color: selected ? "#fff" : undefined }}
          >
            {node.name}
          </span>
        </div>
      </foreignObject>
    </g>
  );
}
