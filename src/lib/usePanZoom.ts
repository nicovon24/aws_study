"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Transform } from "./types";

const MIN_SCALE = 0.2;
const MAX_SCALE = 3;

/**
 * Drag-to-pan and wheel-to-zoom over a stage element. Zoom is anchored at the
 * pointer, so the point under the cursor stays put.
 */
export function usePanZoom(stageRef: React.RefObject<HTMLDivElement | null>) {
  const [transform, setTransform] = useState<Transform>({ tx: 0, ty: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  // Drag origin in the same space as tx/ty, so a move is a plain subtraction.
  const origin = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      origin.current = { x: e.clientX - transform.tx, y: e.clientY - transform.ty };
      setDragging(true);
    },
    [transform.tx, transform.ty],
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) =>
      setTransform((t) => ({ ...t, tx: e.clientX - origin.current.x, ty: e.clientY - origin.current.y }));
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging]);

  // Wheel is registered natively: React's onWheel is passive, so it cannot preventDefault.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const f = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const rect = stage.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setTransform((t) => {
        const scale = Math.max(MIN_SCALE, Math.min(t.scale * f, MAX_SCALE));
        // Recover the effective factor after clamping so the anchor stays exact.
        const applied = scale / t.scale;
        return { scale, tx: mx - (mx - t.tx) * applied, ty: my - (my - t.ty) * applied };
      });
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [stageRef]);

  // Single-finger touch pan.
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchOrigin.current = {
        x: e.touches[0].clientX - transform.tx,
        y: e.touches[0].clientY - transform.ty,
      };
    },
    [transform.tx, transform.ty],
  );
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1 || !touchOrigin.current) return;
    const o = touchOrigin.current;
    setTransform((t) => ({ ...t, tx: e.touches[0].clientX - o.x, ty: e.touches[0].clientY - o.y }));
  }, []);

  const zoomIn = useCallback(
    () => setTransform((t) => ({ ...t, scale: Math.min(t.scale * 1.2, MAX_SCALE) })),
    [],
  );
  const zoomOut = useCallback(
    () => setTransform((t) => ({ ...t, scale: Math.max(t.scale / 1.2, MIN_SCALE) })),
    [],
  );

  return {
    transform,
    setTransform,
    dragging,
    zoomIn,
    zoomOut,
    stageHandlers: { onMouseDown, onTouchStart, onTouchMove },
  };
}
