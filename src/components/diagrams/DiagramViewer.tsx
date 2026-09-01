"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MermaidDiagram from "./MermaidDiagram";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

type View = { zoom: number; x: number; y: number };

const IDENTITY: View = { zoom: 1, x: 0, y: 0 };

/**
 * Zooms around a fixed point (a pinch's midpoint, or the cursor) instead of the
 * container's centre, so whatever is under the fingers stays under them.
 */
function zoomAround(view: View, nextZoom: number, px: number, py: number): View {
  const zoom = clampZoom(nextZoom);
  const ratio = zoom / view.zoom;
  return {
    zoom,
    x: px - (px - view.x) * ratio,
    y: py - (py - view.y) * ratio,
  };
}

type Props = {
  chart: string;
  /** Accessible labels, already resolved to the active locale. */
  labels: { zoomIn: string; zoomOut: string; reset: string };
};

/**
 * Wraps a Mermaid diagram in a pan/zoom surface. The diagram itself scales to
 * the container (see `makeResponsive` in MermaidDiagram), so zoom is only
 * needed for dense charts where the fitted size is too small to read.
 *
 * Gestures: one pointer pans, two pinch to zoom, Ctrl/⌘ + wheel zooms.
 */
export default function DiagramViewer({ chart, labels }: Props) {
  const [view, setView] = useState<View>(IDENTITY);
  const [isDragging, setIsDragging] = useState(false);
  const surface = useRef<HTMLDivElement>(null);

  /** Mirrors `view` so pointer handlers read the current value, not a stale closure. */
  const viewRef = useRef(view);
  viewRef.current = view;

  /** Live pointers on the surface, keyed by pointerId. */
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  /** Pan anchor: pointer position minus the current offset. */
  const panFrom = useRef<{ x: number; y: number } | null>(null);
  /** Pinch anchor: finger distance and view at the moment the pinch started. */
  const pinchFrom = useRef<{ distance: number; zoom: number } | null>(null);

  // A different diagram starts from a clean view.
  useEffect(() => {
    setView(IDENTITY);
  }, [chart]);

  /** Pointer coordinates relative to the surface, which the transform is based on. */
  const toLocal = useCallback((x: number, y: number) => {
    const box = surface.current?.getBoundingClientRect();
    return box ? { x: x - box.left, y: y - box.top } : { x, y };
  }, []);

  const zoomBy = useCallback(
    (delta: number) => {
      const box = surface.current?.getBoundingClientRect();
      const cx = box ? box.width / 2 : 0;
      const cy = box ? box.height / 2 : 0;
      setView((v) => zoomAround(v, v.zoom + delta, cx, cy));
    },
    [],
  );

  const reset = useCallback(() => setView(IDENTITY), []);

  // Registered manually: React's onWheel is passive, so it cannot preventDefault
  // the browser's page zoom on Ctrl + wheel, or page scroll on plain wheel.
  useEffect(() => {
    const el = surface.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const box = el.getBoundingClientRect();
      const px = e.clientX - box.left;
      const py = e.clientY - box.top;
      setView((v) => zoomAround(v, v.zoom - e.deltaY * 0.002 * v.zoom, px, py));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const midpoint = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, toLocal(e.clientX, e.clientY));

    const points = [...pointers.current.values()];
    if (points.length === 2) {
      // Second finger down: switch from panning to pinching.
      panFrom.current = null;
      pinchFrom.current = { distance: distance(points[0], points[1]), zoom: viewRef.current.zoom };
      setIsDragging(false);
    } else if (points.length === 1) {
      const p = points[0];
      panFrom.current = { x: p.x - viewRef.current.x, y: p.y - viewRef.current.y };
      setIsDragging(true);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, toLocal(e.clientX, e.clientY));
    const points = [...pointers.current.values()];

    if (points.length >= 2 && pinchFrom.current) {
      const start = pinchFrom.current;
      const centre = midpoint(points[0], points[1]);
      const scale = distance(points[0], points[1]) / start.distance;
      setView((v) => zoomAround(v, start.zoom * scale, centre.x, centre.y));
      return;
    }

    const from = panFrom.current;
    if (points.length === 1 && from) {
      const p = points[0];
      setView((v) => ({ ...v, x: p.x - from.x, y: p.y - from.y }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    e.currentTarget.releasePointerCapture(e.pointerId);

    const points = [...pointers.current.values()];
    if (points.length < 2) pinchFrom.current = null;
    if (points.length === 1) {
      // One finger lifted mid-pinch: resume panning from the one still down.
      const p = points[0];
      panFrom.current = { x: p.x - viewRef.current.x, y: p.y - viewRef.current.y };
      setIsDragging(true);
    } else if (points.length === 0) {
      panFrom.current = null;
      setIsDragging(false);
    }
  };

  const btn =
    "flex h-9 w-9 items-center justify-center rounded border border-line bg-panel-2/90 text-muted backdrop-blur transition-colors hover:border-accent/50 hover:text-ink disabled:opacity-40 disabled:hover:border-line disabled:hover:text-muted";

  const isDefaultView = view.zoom === 1 && view.x === 0 && view.y === 0;

  return (
    <div className="relative min-h-[45vh] flex-1 overflow-hidden rounded-md border border-line/60 bg-panel/40">
      <div className="absolute right-3 top-3 z-10 flex gap-1.5">
        <button
          type="button"
          onClick={() => zoomBy(-ZOOM_STEP)}
          disabled={view.zoom <= MIN_ZOOM}
          aria-label={labels.zoomOut}
          className={btn}
        >
          −
        </button>
        <button
          type="button"
          onClick={() => zoomBy(ZOOM_STEP)}
          disabled={view.zoom >= MAX_ZOOM}
          aria-label={labels.zoomIn}
          className={btn}
        >
          +
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={isDefaultView}
          aria-label={labels.reset}
          className={`${btn} w-auto px-2 text-xs`}
        >
          {Math.round(view.zoom * 100)}%
        </button>
      </div>

      <div
        ref={surface}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="h-full w-full touch-none overscroll-contain"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
            transformOrigin: "0 0",
          }}
          className={`flex h-full w-full items-center justify-center p-4 ${
            isDragging ? "" : "transition-transform duration-150"
          }`}
        >
          <MermaidDiagram chart={chart} className="w-full [&_svg]:h-auto [&_svg]:w-full" />
        </div>
      </div>
    </div>
  );
}
