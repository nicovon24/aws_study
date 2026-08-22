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
import { byId } from "@/lib/graph";
import { computeMindLayout, ROOT_W, type MindLayout } from "@/lib/mindmapLayout";
import type { MapFocus } from "@/lib/types";
import AnimatedFilterSidebar from "./AnimatedFilterSidebar";
import DetailPanel from "./DetailPanel";
import MindMapSkeleton from "./MindMapSkeleton";

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
        <span className="font-mono text-[9.5px] text-muted-2">80 items</span>
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
  const [layout, setLayout] = useState<MindLayout | null>(null);
  const { setCenter } = useReactFlow();

  useEffect(() => {
    let cancelled = false;
    setLayout(null);
    computeMindLayout(focus).then((l) => {
      if (!cancelled) setLayout(l);
    });
    return () => {
      cancelled = true;
    };
  }, [focus]);

  // Center on the root node itself rather than fitting the whole tree: an
  // asymmetric left/right split otherwise pulls the visual center off "aws".
  // The zoom is derived from the layout's real bounding box against the
  // pane's actual pixel size, so "close" means the same thing regardless of
  // window size or how wide/short the tree happens to be for this focus.
  const recenter = useCallback(() => {
    if (!layout) return;
    const pane = document.querySelector(".react-flow__pane") as HTMLElement | null;
    const w = pane?.clientWidth ?? 1200;
    const h = pane?.clientHeight ?? 800;
    const xs = layout.nodes.map((n) => n.x);
    const ys = layout.nodes.map((n) => n.y);
    const treeW = Math.max(...xs.map((x, i) => x + layout.nodes[i].width)) - Math.min(...xs);
    const treeH = Math.max(...ys.map((y, i) => y + layout.nodes[i].height)) - Math.min(...ys);
    const padding = 1.15;
    const zoom = Math.max(0.15, Math.min(w / (treeW * padding), h / (treeH * padding), 1.4));
    setCenter(ROOT_W / 2, 0, { zoom, duration: 200 });
  }, [layout, setCenter]);

  useEffect(() => {
    if (!layout) return;
    const id = requestAnimationFrame(recenter);
    return () => cancelAnimationFrame(id);
    // Only the layout itself should trigger this on its own — a sidebar toggle
    // recenters via its own onAnimationComplete once the width settles instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

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
            ? () => onFocusChange({ kind: "category", name: n.label })
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
            onPaneClick={() => onSelect(null)}
          >
            <Background color="#141f36" gap={56} />
            <Controls showInteractive={false} />
          </ReactFlow>
        ) : (
          <MindMapSkeleton />
        )}

        <button
          type="button"
          onClick={onToggleFilters}
          title={showFilters ? "ocultar categorías" : "mostrar categorías"}
          className="absolute left-3 top-3 z-10 hidden h-8 w-9 items-center justify-center rounded-lg border border-line bg-panel-2 text-muted-2 hover:text-ink md:flex"
        >
          {showFilters ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
        </button>

        {focus.kind !== "all" && (
          <div className="absolute bottom-4 left-4 z-10">
            <button
              type="button"
              onClick={() => onFocusChange({ kind: "all" })}
              className="flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 py-1.5 pl-3 pr-2.5 font-mono text-[11px] text-accent hover:border-accent hover:bg-accent/20"
            >
              {focus.kind === "domain" ? `Dominio ${focus.n}` : focus.name}
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
