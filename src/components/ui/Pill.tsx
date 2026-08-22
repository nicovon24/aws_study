"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  /** Accent color used for the active state's text/border/background; defaults to the theme accent. */
  color?: string;
  small?: boolean;
};

/** Rounded-full filter chip whose active state tints border/text/background with
 * a given accent color. Used for scope/domain/category filter toggles. */
export default function Pill({ active, color, small, className = "", style, ...rest }: Props) {
  const c = color ?? "#ec7211";
  return (
    <button
      type="button"
      style={{
        color: active ? c : undefined,
        borderColor: active ? `${c}88` : undefined,
        background: active ? `${c}14` : undefined,
        ...style,
      }}
      className={`rounded-full border px-3 py-[6px] font-mono uppercase tracking-[.04em] ${
        small ? "text-[10.5px]" : "text-xs"
      } ${active ? "" : "border-line text-muted-2 hover:border-muted-2/70"} ${className}`}
      {...rest}
    />
  );
}
