"use client";

import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

/** Shared text/number input style: line border, bg background, accent focus ring. */
export default function Input({ className = "", ...rest }: Props) {
  return (
    <input
      className={`rounded border border-line bg-bg px-3.5 py-2.25 font-sans text-sm text-ink outline-none focus:border-accent ${className}`}
      {...rest}
    />
  );
}
