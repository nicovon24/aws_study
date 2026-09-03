"use client";

import { useEffect } from "react";
import { useLocale } from "@/hooks";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";
import ServiceContent from "./ServiceContent";
import type { Node } from "@/lib/types";

type Props = {
  node: Node | null;
  onSelect: (id: string) => void;
  onClose: () => void;
};

/** Sliding side panel: a thin frame around `ServiceContent`, the same body
 * the `/servicio/[key]` full-view page renders. */
export default function DetailPanel({ node, onSelect, onClose }: Props) {
  const { locale } = useLocale();

  useEffect(() => {
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [node, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-75 bg-black/35 ${node ? "block" : "hidden"}`}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-80 w-full overflow-y-auto border-l border-line bg-panel-2 px-5 pb-8 pt-5 shadow-2xl shadow-black/40 transition-transform duration-180 ease-out sm:w-[min(460px,94vw)] sm:px-6 sm:pt-[1.2rem] ${
          node ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {node && (
          <>
            <button
              type="button"
              onClick={onClose}
              aria-label={pick(locale, UI.close)}
              className="absolute right-4 top-[.9rem] text-[1.1rem] text-muted"
            >
              ✕
            </button>
            <ServiceContent node={node} onSelect={onSelect} showFullViewLink />
          </>
        )}
      </aside>
    </>
  );
}
