"use client";

import { CheckCircle2 } from "lucide-react";
import { useReviewed, useLocale } from "@/hooks";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";

/** Small clickable check toggle for an item's reviewed status. Disabled (not hidden) when signed out. */
export default function ReviewedCheck({ itemKey, size = 14 }: { itemKey: string; size?: number }) {
  const { locale } = useLocale();
  const { isReviewed, toggle, signedIn } = useReviewed();
  const reviewed = isReviewed(itemKey);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle(itemKey);
      }}
      disabled={!signedIn}
      title={signedIn ? pick(locale, UI[reviewed ? "unmarkAsReviewed" : "markAsReviewed"]) : pick(locale, UI.signInToUseReviewed)}
      className={`flex shrink-0 items-center justify-center text-muted-2 transition-colors ${
        signedIn ? "hover:text-[#2ee6a8]" : "cursor-not-allowed opacity-30"
      }`}
    >
      <CheckCircle2 size={size} fill={reviewed ? "#2ee6a8" : "none"} color={reviewed ? "#0b1f19" : "currentColor"} strokeWidth={reviewed ? 0 : 2} />
    </button>
  );
}
