"use client";

import { useCallback, useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import { computeMindLayout, type MindLayout } from "@/lib/mindmapLayout";
import type { MapFocus } from "@/lib/types";
import { useLocale } from "./useLocale";

/**
 * Computes the mind-map layout for the current focus (async, via elk.js) and
 * keeps React Flow's camera centered on whatever's actually visible — not
 * always on the root, since filtering down to one category should bring that
 * category's own branch to the middle of the view.
 */
export function useMindMapLayout(focus: MapFocus) {
  const [layout, setLayout] = useState<MindLayout | null>(null);
  const { setCenter } = useReactFlow();
  const { locale } = useLocale();

  useEffect(() => {
    let cancelled = false;
    setLayout(null);
    computeMindLayout(focus, locale).then((l) => {
      if (!cancelled) setLayout(l);
    });
    return () => {
      cancelled = true;
    };
  }, [focus, locale]);

  const recenter = useCallback(() => {
    if (!layout || layout.nodes.length === 0) return;
    const pane = document.querySelector(".react-flow__pane") as HTMLElement | null;
    const w = pane?.clientWidth ?? 1200;
    const h = pane?.clientHeight ?? 800;
    if (!w || !h) return;
    const xs = layout.nodes.map((n) => n.x);
    const ys = layout.nodes.map((n) => n.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs.map((x, i) => x + layout.nodes[i].width));
    const maxY = Math.max(...ys.map((y, i) => y + layout.nodes[i].height));
    const treeW = maxX - minX || 1;
    const treeH = maxY - minY || 1;
    const padding = 1.15;
    const zoom = Math.max(0.15, Math.min(w / (treeW * padding), h / (treeH * padding), 1.4));
    setCenter((minX + maxX) / 2, (minY + maxY) / 2, { zoom, duration: 200 });
  }, [layout, setCenter]);

  // React Flow only knows its own pane size after it finishes mounting/measuring
  // (it remounts each time `layout` flips from null back to a value, since a
  // skeleton swaps in during that gap) — recentering on a plain effect could
  // run before that measurement lands and silently no-op. Callers should also
  // wire `recenter` to ReactFlow's `onInit`, which fires once its viewport is
  // actually ready — that's the reliable hook for the very first mount.
  useEffect(() => {
    if (!layout) return;
    const id = requestAnimationFrame(recenter);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  return { layout, recenter };
}
