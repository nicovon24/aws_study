"use client";

import { useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type ReviewedCtx = {
  reviewed: Set<string>;
  isReviewed: (k: string) => boolean;
  toggle: (itemKey: string) => void;
  signedIn: boolean;
  loaded: boolean;
};

const Ctx = createContext<ReviewedCtx | null>(null);

/** Wraps the app; fetches the signed-in user's reviewed items once and shares them everywhere. */
export function ReviewedProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const signedIn = status === "authenticated";
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!signedIn) {
      setReviewed(new Set());
      setLoaded(false);
      return;
    }
    fetch("/api/reviewed")
      .then((r) => r.json())
      .then((data: { reviewed: string[] }) => setReviewed(new Set(data.reviewed)))
      .finally(() => setLoaded(true));
  }, [signedIn]);

  const toggle = useCallback(
    (itemKey: string) => {
      if (!signedIn) return;
      setReviewed((prev) => {
        const next = new Set(prev);
        next.has(itemKey) ? next.delete(itemKey) : next.add(itemKey);
        return next;
      });
      fetch("/api/reviewed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemKey }),
      }).catch(() => {
        // Revert on failure.
        setReviewed((prev) => {
          const next = new Set(prev);
          next.has(itemKey) ? next.delete(itemKey) : next.add(itemKey);
          return next;
        });
      });
    },
    [signedIn],
  );

  const value: ReviewedCtx = {
    reviewed,
    isReviewed: (k: string) => reviewed.has(k),
    toggle,
    signedIn,
    loaded,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useReviewed() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useReviewed must be used within ReviewedProvider");
  return ctx;
}
