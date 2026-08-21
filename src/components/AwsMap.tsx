"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DATA from "@/data/services";
import { byId, highlightSet, relPairs, totalServices } from "@/lib/graph";
import { CARD_H, CARD_W, computeLayout, curve, edgeAnchor, fitTransform } from "@/lib/layout";
import type { Mode, VisualStyle } from "@/lib/types";
import { usePanZoom } from "@/lib/usePanZoom";
import DetailPanel from "./DetailPanel";
import ServiceCard from "./ServiceCard";
import ServiceDot from "./ServiceDot";
import Titlebar from "./Titlebar";

const HINTS: Record<Mode, string> = {
  radial: "arrastrá para mover · rueda para zoom · click en un servicio para ver detalle",
  graph: "cada línea es una relación real entre servicios · click en uno para resaltar sus conexiones",
};

export default function AwsMap() {
  const [mode, setMode] = useState<Mode>("radial");
  const [style, setStyle] = useState<VisualStyle>("circle");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const { transform, setTransform, dragging, zoomIn, zoomOut, stageHandlers } = usePanZoom(stageRef);

  const layout = useMemo(() => computeLayout(mode, style), [mode, style]);
  const hl = useMemo(() => highlightSet(selectedId), [selectedId]);

  const fit = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    setTransform(fitTransform(layout, style, mode, stage.clientWidth, stage.clientHeight));
  }, [layout, style, mode, setTransform]);

  // Re-fit whenever the layout changes or the window resizes.
  useEffect(() => {
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

  function switchMode(next: Mode) {
    setMode(next);
    setSelectedId(null);
  }
  function switchStyle(next: VisualStyle) {
    setStyle(next);
    setSelectedId(null);
  }

  const { pos, catPos } = layout;
  const cards = style === "cards";

  return (
    <div className="flex h-screen flex-col">
      <Titlebar mode={mode} style={style} onModeChange={switchMode} onStyleChange={switchStyle} />

      <div
        ref={stageRef}
        className={`relative flex-1 overflow-hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        {...stageHandlers}
      >
        <svg className="block h-full w-full" onClick={() => setSelectedId(null)}>
          <g transform={`translate(${transform.tx},${transform.ty}) scale(${transform.scale})`}>
            {/* ---------- edges ---------- */}
            <g>
              {cards && mode === "radial" && (
                <>
                  {/* category header down to the first card in its column */}
                  {DATA.map((cat, ci) => {
                    const c = catPos[ci];
                    const p0 = pos[`${ci}-0`];
                    if (!c || !p0) return null;
                    return (
                      <path
                        key={`head-${ci}`}
                        d={curve(c.x, c.y - 3, p0.x, p0.y - CARD_H / 2)}
                        stroke={cat.accent}
                        strokeWidth={1.5}
                        fill="none"
                        strokeDasharray="2 4"
                        opacity={0.4}
                      />
                    );
                  })}
                  {/* card to card within a column */}
                  {DATA.flatMap((cat, ci) =>
                    cat.items.slice(0, -1).map((_svc, si) => {
                      const a = pos[`${ci}-${si}`];
                      const b = pos[`${ci}-${si + 1}`];
                      return (
                        <path
                          key={`col-${ci}-${si}`}
                          d={`M ${a.x} ${a.y + CARD_H / 2} L ${b.x} ${b.y - CARD_H / 2}`}
                          stroke={cat.accent}
                          strokeWidth={1}
                          fill="none"
                          strokeDasharray="2 4"
                          opacity={0.25}
                        />
                      );
                    }),
                  )}
                </>
              )}

              {!cards &&
                mode === "radial" &&
                DATA.map((cat, ci) => {
                  const c = catPos[ci];
                  return (
                    <g key={`orbit-${ci}`}>
                      <path
                        d={curve(0, 0, c.x, c.y)}
                        stroke={cat.accent}
                        strokeWidth={4.5}
                        fill="none"
                        strokeLinecap="round"
                        opacity={0.85}
                      />
                      {cat.items.map((_svc, si) => {
                        const p = pos[`${ci}-${si}`];
                        return (
                          <path
                            key={`spoke-${ci}-${si}`}
                            d={curve(c.x, c.y, p.x, p.y)}
                            stroke={cat.accent}
                            strokeWidth={2}
                            fill="none"
                            strokeLinecap="round"
                            opacity={0.45}
                          />
                        );
                      })}
                    </g>
                  );
                })}

              {mode === "graph" &&
                relPairs.map(([a, b], i) => {
                  const pa = pos[a];
                  const pb = pos[b];
                  const active = !!hl && hl.has(a) && hl.has(b);
                  if (cards) {
                    const A = edgeAnchor(pa, pa.x < pb.x ? "right" : "left");
                    const B = edgeAnchor(pb, pb.x < pa.x ? "right" : "left");
                    return (
                      <path
                        key={`rel-${i}`}
                        d={curve(A.x, A.y, B.x, B.y, 0.5)}
                        stroke={active ? "#4DD9C5" : "#5a6a80"}
                        strokeWidth={active ? 2 : 1.3}
                        fill="none"
                        strokeDasharray={active ? undefined : "3 3"}
                        opacity={hl ? (active ? 1 : 0.06) : 0.75}
                      />
                    );
                  }
                  return (
                    <path
                      key={`rel-${i}`}
                      d={curve(pa.x, pa.y, pb.x, pb.y, 0.18)}
                      stroke={active ? "#4DD9C5" : "#3a4757"}
                      strokeWidth={active ? 2 : 1.2}
                      fill="none"
                      opacity={hl ? (active ? 1 : 0.08) : 0.32}
                    />
                  );
                })}
            </g>

            {/* ---------- nodes ---------- */}
            <g>
              {cards &&
                mode === "radial" &&
                DATA.map((cat, ci) => {
                  const c = catPos[ci];
                  return (
                    <g key={`cathead-${ci}`} transform={`translate(${c.x - CARD_W / 2},${c.y - 18})`}>
                      <rect
                        x={0}
                        y={0}
                        width={CARD_W}
                        height={30}
                        rx={7}
                        fill="#131a26"
                        stroke={cat.accent}
                        strokeWidth={1.2}
                        opacity={0.9}
                      />
                      <text
                        x={CARD_W / 2}
                        y={19}
                        fill={cat.accent}
                        fontSize={12}
                        fontWeight={700}
                        textAnchor="middle"
                        fontFamily="var(--font-sans)"
                      >
                        {cat.cat}
                      </text>
                    </g>
                  );
                })}

              {!cards &&
                mode === "radial" &&
                DATA.map((cat, ci) => {
                  const c = catPos[ci];
                  return (
                    <text
                      key={`catlabel-${ci}`}
                      x={c.x}
                      y={c.y}
                      fill={cat.accent}
                      fontSize={16}
                      fontWeight={700}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="var(--font-sans)"
                    >
                      {cat.cat}
                    </text>
                  );
                })}

              {Object.values(byId).map((node) => {
                const p = pos[node.id];
                if (!p) return null;
                const highlighted = !!hl && hl.has(node.id);
                // Fade unrelated nodes so a selection reads clearly without hiding context.
                const faded = !!hl && !highlighted;
                const dim = faded ? (cards && mode === "graph" ? 0.22 : cards ? 0.28 : mode === "graph" ? 0.25 : 0.28) : 1;
                return cards ? (
                  <ServiceCard
                    key={node.id}
                    node={node}
                    p={p}
                    dim={dim}
                    highlighted={highlighted}
                    onSelect={setSelectedId}
                  />
                ) : (
                  <ServiceDot
                    key={node.id}
                    node={node}
                    p={p}
                    dim={dim}
                    highlighted={highlighted}
                    rotate={mode === "graph"}
                    onSelect={setSelectedId}
                  />
                );
              })}
            </g>

            {/* center node — only meaningful in the circle style */}
            {!cards && (
              <g>
                <rect x={-95} y={-26} width={190} height={52} rx={12} fill="#0f1520" stroke="#4d5a6c" strokeWidth={1.5} />
                <text
                  x={0}
                  y={0}
                  fill="#e7ecf2"
                  fontSize={18}
                  fontWeight={700}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-sans)"
                >
                  Amazon Web Services
                </text>
              </g>
            )}
          </g>
        </svg>

        <div className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 text-center text-[.72rem] text-muted-2">
          {HINTS[mode]}
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 z-10 text-[.72rem] text-muted-2">
          {totalServices} servicios
        </div>

        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-[.3rem]">
          <ZoomButton onClick={zoomIn} label="+" title="acercar" />
          <ZoomButton onClick={zoomOut} label="−" title="alejar" />
          <ZoomButton onClick={fit} label="fit" title="centrar" small />
        </div>
      </div>

      <DetailPanel
        node={selectedId ? byId[selectedId] : null}
        onSelect={setSelectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

function ZoomButton({
  onClick,
  label,
  title,
  small,
}: {
  onClick: () => void;
  label: string;
  title: string;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      // The stage owns mousedown for panning; pressing a control must not start a drag.
      onMouseDown={(e) => e.stopPropagation()}
      className={`h-[34px] w-[34px] rounded-lg border border-line bg-panel-2 font-mono text-ink hover:border-muted-2 ${
        small ? "text-[.7rem]" : "text-[1.1rem]"
      }`}
    >
      {label}
    </button>
  );
}
