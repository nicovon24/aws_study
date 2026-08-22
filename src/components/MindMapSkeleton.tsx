"use client";

import { motion } from "framer-motion";

/** A branch of ghost pills fanning out from the root at a given angle, used on both sides. */
function GhostBranch({ angle, count, delay }: { angle: number; count: number; delay: number }) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const r = 90 + i * 70;
        return (
          <motion.div
            key={i}
            className="absolute h-4 w-24 rounded-full bg-panel-2"
            style={{
              left: `calc(50% + ${dx * r}px - 3rem)`,
              top: `calc(50% + ${dy * r}px - 0.5rem)`,
            }}
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: delay + i * 0.08 }}
          />
        );
      })}
    </>
  );
}

/** Ghost tree shown while computeMindLayout resolves, echoing the mindmap's fan-out shape. */
export default function MindMapSkeleton() {
  const angles = [200, 160, 120, 20, -20, -160];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-line bg-panel-2" />
      {angles.map((angle, i) => (
        <GhostBranch key={angle} angle={angle} count={2} delay={i * 0.1} />
      ))}
    </div>
  );
}
