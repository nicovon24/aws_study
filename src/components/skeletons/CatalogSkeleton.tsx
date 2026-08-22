"use client";

import { motion } from "framer-motion";

/** Ghost columns/cards echoing CatalogView's real layout, shown while filtering resolves. */
export default function CatalogSkeleton() {
  const columns = Array.from({ length: 6 }, (_, i) => 3 + ((i * 2) % 4));
  return (
    <div className="flex-1 overflow-hidden px-4 pb-10 pt-4 sm:px-6 sm:pt-5.5">
      <div className="flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-start">
        {columns.map((rows, ci) => (
          <div key={ci} className="flex flex-col gap-1.5 sm:w-53 sm:shrink-0">
            <div className="mb-0.5 h-6 rounded bg-panel-2" />
            {Array.from({ length: rows }, (_, ri) => (
              <motion.div
                key={ri}
                className="flex h-14 flex-col gap-1.5 rounded border border-line bg-panel-2 px-2.75 py-2.25"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: (ci * 0.06 + ri * 0.08) % 1.2 }}
              >
                <div className="h-3 w-2/3 rounded bg-line/60" />
                <div className="h-2.5 w-full rounded bg-line/40" />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
