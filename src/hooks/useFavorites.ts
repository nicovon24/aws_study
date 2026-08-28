"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

/** Signed-in user's favorite service keys, with optimistic toggle. Empty/no-op when signed out. */
export function useFavorites() {
  const { status } = useSession();
  const signedIn = status === "authenticated";
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!signedIn) {
      setFavorites(new Set());
      setLoaded(false);
      return;
    }
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((data: { favorites: string[] }) => setFavorites(new Set(data.favorites)))
      .finally(() => setLoaded(true));
  }, [signedIn]);

  const toggle = useCallback(
    (serviceKey: string) => {
      if (!signedIn) return;
      setFavorites((prev) => {
        const next = new Set(prev);
        next.has(serviceKey) ? next.delete(serviceKey) : next.add(serviceKey);
        return next;
      });
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceKey }),
      }).catch(() => {
        // Revert on failure.
        setFavorites((prev) => {
          const next = new Set(prev);
          next.has(serviceKey) ? next.delete(serviceKey) : next.add(serviceKey);
          return next;
        });
      });
    },
    [signedIn],
  );

  return { favorites, isFavorite: (k: string) => favorites.has(k), toggle, signedIn, loaded };
}
