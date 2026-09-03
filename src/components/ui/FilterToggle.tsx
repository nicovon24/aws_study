"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  /** Accent color for the active state's icon/border/background. */
  color: string;
  children: ReactNode;
};

/** Square icon-only filter toggle. Same footprint as the priority dots so the
 * whole filter row reads as one control group. Always pass a `title`. */
export default function FilterToggle({ active, color, className = "", style, children, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      style={{
        color: active ? color : undefined,
        borderColor: active ? `${color}88` : undefined,
        background: active ? `${color}14` : undefined,
        ...style,
      }}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors ${
        active ? "" : "border-line text-muted-2 hover:border-muted-2/70 hover:text-ink-2"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
