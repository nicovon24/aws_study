"use client";

import { useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type FavoritesCtx = {
  favorites: Set<string>;
  isFavorite: (k: string) => boolean;
  toggle: (serviceKey: string) => void;
  signedIn: boolean;
  loaded: boolean;
};

const Ctx = createContext<FavoritesCtx | null>(null);

/** Wraps the app; fetches the signed-in user's favorites once and shares them everywhere. */
export function FavoritesProvider({ children }: { children: ReactNode }) {
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

  const value: FavoritesCtx = {
    favorites,
    isFavorite: (k: string) => favorites.has(k),
    toggle,
    signedIn,
    loaded,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
