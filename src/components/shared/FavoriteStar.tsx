"use client";

import { Star } from "lucide-react";
import { useFavorites, useLocale } from "@/hooks";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";

/** Small clickable star toggle for a service's favorite status. Disabled (not hidden) when signed out. */
export default function FavoriteStar({ serviceKey, size = 14 }: { serviceKey: string; size?: number }) {
  const { locale } = useLocale();
  const { isFavorite, toggle, signedIn } = useFavorites();
  const favorited = isFavorite(serviceKey);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle(serviceKey);
      }}
      disabled={!signedIn}
      title={signedIn ? pick(locale, UI[favorited ? "removeFromFavorites" : "addToFavorites"]) : pick(locale, UI.signInToUseFavorites)}
      className={`flex shrink-0 items-center justify-center text-muted-2 transition-colors ${
        signedIn ? "hover:text-[#e0c341]" : "cursor-not-allowed opacity-30"
      }`}
    >
      <Star size={size} fill={favorited ? "#e0c341" : "none"} color={favorited ? "#e0c341" : "currentColor"} />
    </button>
  );
}
