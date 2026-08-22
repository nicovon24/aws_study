"use client";

import mermaid from "mermaid";
import { useEffect, useId, useRef, useState } from "react";

let initialized = false;

/** One-time Mermaid init, themed to match the app's dark panel palette. */
function ensureInit() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      background: "#0a1120",
      primaryColor: "#131e33",
      primaryBorderColor: "#ef4444",
      primaryTextColor: "#e8ecf4",
      lineColor: "#5b6b8c",
      secondaryColor: "#1b2740",
      tertiaryColor: "#131e33",
      clusterBkg: "#0f1a30",
      clusterBorder: "#253147",
      edgeLabelBackground: "#131e33",
      fontFamily: "var(--font-sans, sans-serif)",
    },
  });
  initialized = true;
}

type Props = {
  chart: string;
  className?: string;
};

/** Renders a Mermaid flowchart string to inline SVG, client-side only. */
export default function MermaidDiagram({ chart, className }: Props) {
  const [svg, setSvg] = useState<string | null>(null);
  const id = useId().replace(/:/g, "-");
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    ensureInit();
    mermaid.render(`mmd-${id}`, chart).then(({ svg }) => {
      if (!cancelled.current) setSvg(svg);
    });
    return () => {
      cancelled.current = true;
    };
  }, [chart, id]);

  if (!svg) {
    return <div className={`animate-pulse rounded-lg bg-panel-2 ${className ?? "h-64"}`} />;
  }

  // `svg` is Mermaid's own render output, not user input.
  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
