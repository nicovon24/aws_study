"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"button"> & {
  size?: "sm" | "md";
};

const SIZE = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-6 py-3 text-sm",
};

const CLIP = {
  sm: "polygon(0 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%)",
  md: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)",
};

/** Primary CTA: solid accent background with a cut corner notch, used for every
 * "start/confirm/next" action (start deck, next card, study a domain, ...). */
export default function AccentButton({ size = "md", className = "", style, disabled, ...rest }: Props) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`bg-accent font-sans font-bold text-[#111827] disabled:cursor-not-allowed disabled:opacity-40 ${SIZE[size]} ${className}`}
      style={{ clipPath: CLIP[size], ...style }}
      {...rest}
    />
  );
}
