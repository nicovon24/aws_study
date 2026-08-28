"use client";

import "reactflow/dist/style.css";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BezierEdge,
  Controls,
  type Edge,
  type EdgeProps,
  Handle,
  type Node as FlowNode,
  type NodeProps,
  Position,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import { AnimatedFilterSidebar, DetailPanel } from "@/components/shared";
import { MindMapSkeleton } from "@/components/skeletons";
import { useLocale, useMindMapLayout } from "@/hooks";
import { domainById } from "@/lib/domains";
import { byId, catBySlug, totalServices } from "@/lib/graph";
import { pick } from "@/lib/locale";
import { UI } from "@/lib/uiStrings";
import type { MapFocus } from "@/lib/types";
import MapSearch from "./MapSearch";

type Props = {
  focus: MapFocus;
  onFocusChange: (f: MapFocus) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

type NodeData = {
  kind: "root" | "category" | "service";
  label: string;
  accent: string;
  side: "left" | "right";
  selected: boolean;
  onClick?: () => void;
};

/**
 * Every node exposes a source+target handle on both its left and right edge.
 * A branch drawn on the left side connects root(right side)->category(right
 * side, as target)->service(left side, as source pointing further left), and
 * the mirror image on the right side — same component, opposite handles used.
 */
function AllSideHandles() {
  return (
    <>
      <Handle id="l-t" type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle id="l-s" type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle id="r-t" type="target" position={Position.Right} style={{ opacity: 0 }} />
      <Handle id="r-s" type="source" position={Position.Right} style={{ opacity: 0 }} />
    </>
  );
}

function MindNode({ data }: NodeProps<NodeData>) {
  const { kind, label, accent, selected, onClick } = data;

  if (kind === "root") {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center rounded-full border-2 text-white"
        style={{ borderColor: accent, background: "#131e33" }}
      >
        <AllSideHandles />
        <span className="text-[19px] font-black">aws</span>
        <span className="font-mono text-[9.5px] text-muted-2">{totalServices} items</span>
      </div>
    );
  }

  if (kind === "category") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex h-full w-full cursor-pointer items-center gap-2 rounded-full border px-3 font-sans text-[13px] font-bold"
        style={{
          borderColor: accent,
          background: selected ? `${accent}26` : "#131e33",
          color: selected ? "#fff" : "#c3cfe2",
        }}
      >
        <AllSideHandles />
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: accent }} />
        <span className="truncate">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-full cursor-pointer items-center gap-2 rounded-full border px-2.5 font-sans text-[12.5px] font-semibold"
      style={{
        borderColor: selected ? accent : `${accent}88`,
        background: selected ? `${accent}26` : "#131e33",
        color: selected ? "#fff" : undefined,
        boxShadow: selected ? `0 0 0 3px ${accent}33` : undefined,
      }}
    >
      <AllSideHandles />
      <span className="h-1.75 w-1.75 shrink-0 rounded-full" style={{ background: accent }} />
      <span className="truncate">{label}</span>
    </button>
  );
}

function ColorEdge(props: EdgeProps) {
  return <BezierEdge {...props} style={{ stroke: props.data?.accent, strokeWidth: 1.5, opacity: 0.7 }} />;
}

const nodeTypes = { mind: MindNode };
const edgeTypes = { mind: ColorEdge };

function Inner({
  focus,
  onFocusChange,
  selectedId,
  onSelect,
  showFilters,
  onToggleFilters,
}: Props & { showFilters: boolean; onToggleFilters: () => void }) {
  const { layout, recenter } = useMindMapLayout(focus);
  const { setCenter } = useReactFlow();
  const { locale } = useLocale();

  // Set when a search result is picked; once the layout that should contain
  // it finishes computing, the camera zooms onto that node and this clears
  // so it only fires once per pick.
  const [centerOnId, setCenterOnId] = useState<string | null>(null);

  useEffect(() => {
    if (!centerOnId || !layout) return;
    const node = layout.nodes.find((n) => n.id === centerOnId);
    if (!node) return;
    setCenter(node.x + node.width / 2, node.y + node.height / 2, { zoom: 1.1, duration: 400 });
    setCenterOnId(null);
  }, [centerOnId, layout, setCenter]);

  // React Flow only knows its own pane size after it finishes mounting/measuring
  // (it remounts each time `layout` flips from null back to a value, since the
  // skeleton swaps in during that gap) — `onInit` fires exactly when React
  // Flow's viewport is ready, so that's the reliable hook for the first mount.
  const handleInit = useCallback(() => {
    requestAnimationFrame(recenter);
  }, [recenter]);

  const { nodes, edges } = useMemo<{ nodes: FlowNode<NodeData>[]; edges: Edge[] }>(() => {
    if (!layout) return { nodes: [], edges: [] };
    const nodes: FlowNode<NodeData>[] = layout.nodes.map((n) => ({
      id: n.id,
      type: "mind",
      position: { x: n.x, y: n.y },
      style: { width: n.width, height: n.height },
      draggable: false,
      selectable: n.kind !== "root",
      data: {
        kind: n.kind,
        label: n.label,
        accent: n.accent,
        side: n.side,
        selected: n.kind === "service" ? n.id === selectedId : false,
        onClick:
          n.kind === "category"
            ? () => onFocusChange({ kind: "category", slug: n.slug! })
            : n.kind === "service"
              ? () => onSelect(n.id)
              : undefined,
      },
    }));
    const edges: Edge[] = layout.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      // Right-side branches flow root->right handle into target's left handle;
      // left-side branches are the mirror image.
      sourceHandle: e.side === "right" ? "r-s" : "l-s",
      targetHandle: e.side === "right" ? "l-t" : "r-t",
      type: "mind",
      data: { accent: e.accent },
    }));
    return { nodes, edges };
  }, [layout, selectedId, onFocusChange, onSelect]);

  return (
    <div className="flex min-w-0 flex-1">
      <AnimatedFilterSidebar
        focus={focus}
        onFocusChange={onFocusChange}
        show={showFilters}
        onAnimationComplete={recenter}
      />
      <div className="relative min-w-0 flex-1">
        {layout ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={{ hideAttribution: true }}
            minZoom={0.1}
            maxZoom={2}
            nodesConnectable={false}
            onInit={handleInit}
            onPaneClick={() => onSelect(null)}
          >
            <Background id="grid-minor" color="#16233c" gap={18.25} />
            <Background id="grid-major" color="#1c2b4a" gap={73} />
            <Controls showInteractive={false} />
          </ReactFlow>
        ) : (
          <MindMapSkeleton />
        )}

        <div className="absolute left-3 right-3 top-3 z-10 flex items-start gap-2">
          <button
            type="button"
            onClick={onToggleFilters}
            title={showFilters ? pick(locale, UI.hideCategories) : pick(locale, UI.showCategories)}
            className="hidden h-8 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-panel-2 text-muted-2 hover:text-ink md:flex"
          >
            {showFilters ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
          </button>
          <MapSearch
            onPick={(node) => {
              if (focus.kind !== "all") onFocusChange({ kind: "all" });
              onSelect(node.id);
              setCenterOnId(node.id);
            }}
          />
        </div>

        {focus.kind !== "all" && (
          <div className="absolute bottom-4 left-4 z-10">
            <button
              type="button"
              onClick={() => onFocusChange({ kind: "all" })}
              className="flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 py-1.5 pl-3 pr-2.5 font-mono text-[11px] text-accent hover:border-accent hover:bg-accent/20"
            >
              {focus.kind === "domain"
                ? `${pick(locale, UI.domainChip)} ${domainById(focus.domainId)?.number ?? ""}`
                : pick(locale, catBySlug[focus.slug]?.cat ?? { es: "", en: "" })}
              <span aria-hidden className="text-[13px] leading-none">
                ✕
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MindMapView({ focus, onFocusChange, selectedId, onSelect }: Props) {
  const [showFilters, setShowFilters] = useState(true);
  return (
    <main className="flex min-h-0 flex-1">
      <ReactFlowProvider>
        <Inner
          focus={focus}
          onFocusChange={onFocusChange}
          selectedId={selectedId}
          onSelect={onSelect}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((v) => !v)}
        />
      </ReactFlowProvider>
      <DetailPanel node={selectedId ? byId[selectedId] : null} onSelect={onSelect} onClose={() => onSelect(null)} />
    </main>
  );
}
