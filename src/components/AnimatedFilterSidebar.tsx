"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MapFocus } from "@/lib/types";
import CategoryFilters from "./CategoryFilters";

type Props = {
  focus: MapFocus;
  onFocusChange: (f: MapFocus) => void;
  show: boolean;
  /** Fires once the width/opacity transition finishes, in both directions. */
  onAnimationComplete?: () => void;
};

const SIDEBAR_W = 236; // px, matches the old w-59 utility

/** Category sidebar used by MindMapView and CatalogView, sliding its width in/out on toggle. */
export default function AnimatedFilterSidebar({ focus, onFocusChange, show, onAnimationComplete }: Props) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: SIDEBAR_W, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onAnimationComplete={onAnimationComplete}
          className="hidden shrink-0 overflow-hidden border-r border-line bg-panel md:block"
        >
          <div className="w-59 overflow-auto px-3 py-4" style={{ width: SIDEBAR_W }}>
            <CategoryFilters focus={focus} onFocusChange={onFocusChange} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
