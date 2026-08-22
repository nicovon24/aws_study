"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md";
};

const SIZE = {
  sm: "h-8 w-9",
  md: "h-9 w-9",
};

/** Square/circular icon-only button: border + panel background, accent on hover.
 * Used for back arrows, close/toggle controls, and the mobile menu button. */
export default function IconButton({ size = "md", className = "", children, ...rest }: Props) {
  return (
    <button
      type="button"
      className={`flex shrink-0 items-center justify-center rounded-full border border-line bg-panel-2 text-ink-2 transition-colors hover:border-accent hover:text-accent ${SIZE[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** The back-arrow glyph shared by every "volver" IconButton. */
export function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
