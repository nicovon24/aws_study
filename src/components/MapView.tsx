"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DATA from "@/data/services";
import { DOMAIN_META, domainOf } from "@/lib/domains";
import { byId } from "@/lib/graph";
import { computeLayout, curve, fitTransform } from "@/lib/layout";
import type { Category, MapFocus, Node as MapNode } from "@/lib/types";
import { usePanZoom } from "@/lib/usePanZoom";
import CategoryFilters from "./CategoryFilters";
import DetailPanel from "./DetailPanel";
import ServiceNode from "./ServiceNode";

type Props = {
  focus: MapFocus;
  onFocusChange: (f: MapFocus) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

/** Whether a category's services should be drawn for the current focus. */
function catInFocus(focus: MapFocus, cat: Category): boolean {
  if (focus.kind === "all") return true;
  if (focus.kind === "domain") return domainOf(cat.cat) === focus.n;
  return cat.cat === focus.name;
}

export default function MapView({ focus, onFocusChange, selectedId, onSelect }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const { transform, setTransform, dragging, zoomIn, zoomOut, stageHandlers } = usePanZoom(stageRef);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const layout = useMemo(() => computeLayout(focus), [focus]);

  const fit = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    setTransform(fitTransform(focus, stage.clientWidth, stage.clientHeight));
  }, [focus, setTransform]);

  useEffect(() => {
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      stage.requestFullscreen();
    }
  }, []);

  const { pos, catPos } = layout;
  const activeCats = useMemo(() => DATA.filter((c) => catInFocus(focus, c)), [focus]);
  const focusKey =
    focus.kind === "all" ? "all" : focus.kind === "domain" ? `d${focus.n}` : `c${focus.name}`;
  const shownCount = useMemo(
    () => activeCats.reduce((acc, c) => acc + c.items.length, 0),
    [activeCats],
  );
  const focusLabel =
    focus.kind === "domain"
      ? DOMAIN_META[focus.n].name
      : focus.kind === "category"
        ? focus.name
        : null;

  // Custom tooltip: the native SVG <title> has an OS-styled ~1s delay.
  const [tip, setTip] = useState<{ node: MapNode; x: number; y: number } | null>(null);
  const onHover = useCallback(
    (node: MapNode | null, clientX: number, clientY: number) => {
      const stage = stageRef.current;
      if (!node || !stage) return setTip(null);
      const rect = stage.getBoundingClientRect();
      setTip({ node, x: clientX - rect.left, y: clientY - rect.top });
    },
    [],
  );
  // A drag would otherwise leave the tooltip pinned over the moving map.
  useEffect(() => {
    if (dragging) setTip(null);
  }, [dragging]);

  return (
    <main className="flex min-h-0 flex-1">
      <aside className="hidden w-59 shrink-0 overflow-auto border-r border-line bg-panel px-3 py-4 md:block">
        <CategoryFilters focus={focus} onFocusChange={onFocusChange} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          ref={stageRef}
          className={`relative flex-1 touch-none overflow-hidden bg-bg ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            backgroundImage:
              "linear-gradient(#141f36 1px,transparent 1px),linear-gradient(90deg,#141f36 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
          {...stageHandlers}
        >
          <svg className="block h-full w-full" onClick={() => onSelect(null)}>
            <g transform={`translate(${transform.tx},${transform.ty}) scale(${transform.scale})`}>
              {/* Re-keyed on the focus so the whole tree fades in when the layout is rebuilt. */}
              <g key={focusKey} className="map-layer">
              {/* center → category spokes */}
              <g>
                {DATA.map((cat, ci) => {
                  const c = catPos[ci];
                  const on = catInFocus(focus, cat);
                  return (
                    <line
                      key={`spoke-${ci}`}
                      x1={0}
                      y1={0}
                      x2={c.x}
                      y2={c.y}
                      stroke={cat.accent}
                      strokeWidth={focus.kind !== "all" && on ? 2 : 1}
                      opacity={focus.kind === "all" ? 0.5 : on ? 0.9 : 0.25}
                    />
                  );
                })}
                {/* category → service twigs, only for categories in focus */}
                {activeCats.map((cat) => {
                  const ci = DATA.indexOf(cat);
                  const c = catPos[ci];
                  return cat.items.map((_svc, si) => {
                    const p = pos[`${ci}-${si}`];
                    if (!p) return null;
                    return (
                      <path
                        key={`twig-${ci}-${si}`}
                        d={curve(c.x, c.y, p.x, p.y, 0.65)}
                        fill="none"
                        stroke={cat.accent}
                        strokeWidth={focus.kind === "all" ? 1 : 1.3}
                        opacity={focus.kind === "all" ? 0.35 : 0.55}
                      />
                    );
                  });
                })}
              </g>

              {/* center node */}
              <g>
                <circle r={48} fill="#131e33" stroke="#ec7211" strokeWidth={1.5} />
                <text
                  y={-4}
                  textAnchor="middle"
                  fontSize={19}
                  fontWeight={900}
                  fill="#fff"
                  fontFamily="var(--font-sans)"
                >
                  aws
                </text>
                <text
                  y={13}
                  textAnchor="middle"
                  fontSize={9.5}
                  fill="#94a3bb"
                  fontFamily="var(--font-mono)"
                >
                  80 items
                </text>
              </g>

              {/* category labels */}
              {DATA.map((cat, ci) => {
                const c = catPos[ci];
                const on = catInFocus(focus, cat);
                const isSingleCat = focus.kind === "category" && focus.name === cat.cat;
                return (
                  <g
                    key={`cat-${ci}`}
                    transform={`translate(${c.x},${c.y})`}
                    className="cat-hub cursor-pointer"
                    opacity={on ? 1 : 0.45}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFocusChange({ kind: "category", name: cat.cat });
                    }}
                  >
                    <title>{`${cat.cat} · ${cat.items.length} servicios`}</title>
                    {/* Invisible hit area: the 5px dot alone is a hard target to click. */}
                    <circle r={16} fill="transparent" />
                    {isSingleCat && (
                      <circle r={12} fill="none" stroke={cat.accent} strokeWidth={1} opacity={0.35} />
                    )}
                    <circle
                      r={isSingleCat ? 7 : 5}
                      fill="#131e33"
                      stroke={cat.accent}
                      strokeWidth={isSingleCat ? 2.5 : 1.5}
                    />
                    <text
                      y={c.y >= 0 ? 22 : -15}
                      textAnchor="middle"
                      fontSize={13}
                      fontWeight={isSingleCat ? 700 : 600}
                      fill={isSingleCat ? cat.accent : "#c3cfe2"}
                      fontFamily="var(--font-sans)"
                      paintOrder="stroke"
                      stroke="#0a1120"
                      strokeWidth={3.5}
                      strokeLinejoin="round"
                    >
                      {cat.cat}
                    </text>
                  </g>
                );
              })}

              {/* service nodes */}
              {activeCats.map((cat) =>
                cat.items.map((_svc, si) => {
                  const ci = DATA.indexOf(cat);
                  const id = `${ci}-${si}`;
                  const p = pos[id];
                  if (!p) return null;
                  return (
                    <ServiceNode
                      key={id}
                      node={byId[id]}
                      p={p}
                      dim={1}
                      compact={focus.kind === "all"}
                      selected={id === selectedId}
                      onSelect={onSelect}
                      onHover={onHover}
                    />
                  );
                }),
              )}
              </g>
            </g>
          </svg>

          {tip && (
            <div
              className="pointer-events-none absolute z-20 max-w-65 rounded-lg border border-line bg-panel-2/95 px-3 py-2 shadow-[0_8px_24px_rgba(5,8,15,.6)] backdrop-blur-sm"
              style={{
                // Flip to the other side near the right/bottom edge so the tip stays on screen.
                left: tip.x,
                top: tip.y,
                transform: `translate(${tip.x > (stageRef.current?.clientWidth ?? 0) - 280 ? "calc(-100% - 14px)" : "14px"}, ${
                  tip.y > (stageRef.current?.clientHeight ?? 0) - 120 ? "calc(-100% - 14px)" : "14px"
                })`,
                borderLeftColor: tip.node.accent,
                borderLeftWidth: 2,
              }}
            >
              <div className="mb-0.5 font-sans text-[13px] font-bold text-white">{tip.node.name}</div>
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[.06em]" style={{ color: tip.node.accent }}>
                {tip.node.cat}
              </div>
              <div className="text-[11.5px] leading-[1.45] text-muted">{tip.node.d}</div>
            </div>
          )}

          {/* Status bar: what the map is currently showing, with a one-click reset. */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
            {focusLabel ? (
              <button
                type="button"
                onClick={() => onFocusChange({ kind: "all" })}
                onMouseDown={(e) => e.stopPropagation()}
                className="flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 py-1.5 pl-3 pr-2.5 font-mono text-[11px] text-accent transition-colors hover:border-accent hover:bg-accent/20"
              >
                {focusLabel}
                <span className="text-muted-2">{shownCount}</span>
                <span aria-hidden className="text-[13px] leading-none">
                  ✕
                </span>
              </button>
            ) : (
              <span className="pointer-events-none rounded-full border border-line bg-panel-2/80 px-3 py-1.5 font-mono text-[11px] text-muted-2">
                {shownCount} servicios
              </span>
            )}
          </div>

          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5">
            <div className="flex flex-col overflow-hidden rounded-lg border border-line bg-panel-2">
              <ZoomButton onClick={zoomIn} title="acercar">
                <PlusIcon />
              </ZoomButton>
              <div className="h-px bg-line" />
              <ZoomButton onClick={zoomOut} title="alejar">
                <MinusIcon />
              </ZoomButton>
              <div className="h-px bg-line" />
              <ZoomButton onClick={fit} title="centrar">
                <FitIcon />
              </ZoomButton>
            </div>
            <ZoomButton
              onClick={toggleFullscreen}
              title={isFullscreen ? "salir de pantalla completa" : "pantalla completa"}
              standalone
            >
              <FullscreenIcon exit={isFullscreen} />
            </ZoomButton>
          </div>
        </div>
      </div>

      <DetailPanel node={selectedId ? byId[selectedId] : null} onSelect={onSelect} onClose={() => onSelect(null)} />
    </main>
  );
}

function ZoomButton({
  onClick,
  title,
  standalone,
  children,
}: {
  onClick: () => void;
  title: string;
  /** Own rounded border, for a button that is not part of the stacked group. */
  standalone?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      className={`flex h-8.5 w-8.5 items-center justify-center text-muted transition-colors hover:bg-[#1b2740] hover:text-ink active:bg-[#22304d] ${
        standalone ? "rounded-lg border border-line bg-panel-2" : ""
      }`}
    >
      {children}
    </button>
  );
}

/** Shared props for the small 16px control glyphs. */
const ICON = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function PlusIcon() {
  return (
    <svg {...ICON}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg {...ICON}>
      <path d="M5 12h14" />
    </svg>
  );
}

function FitIcon() {
  return (
    <svg {...ICON}>
      <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function FullscreenIcon({ exit }: { exit: boolean }) {
  return (
    <svg {...ICON}>
      {exit ? (
        <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M16 21v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
      ) : (
        <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
      )}
    </svg>
  );
}
