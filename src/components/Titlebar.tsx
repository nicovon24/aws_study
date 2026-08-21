"use client";

import type { Mode, VisualStyle } from "@/lib/types";

type Props = {
  mode: Mode;
  style: VisualStyle;
  onModeChange: (m: Mode) => void;
  onStyleChange: (s: VisualStyle) => void;
};

export default function Titlebar({ mode, style, onModeChange, onStyleChange }: Props) {
  return (
    <div className="z-20 flex flex-shrink-0 items-center gap-[.6rem] border-b border-line bg-panel-2 px-4 py-[.55rem]">
      <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f56]" />
      <span className="h-[11px] w-[11px] rounded-full bg-[#ffbd2e]" />
      <span className="h-[11px] w-[11px] rounded-full bg-[#27c93f]" />
      <span className="ml-2 text-[.8rem] text-muted">~/aws-map</span>
      <span className="ml-2 text-[.8rem] text-muted">
        ./study.sh --track=CLF-C02
        <span className="animate-blink ml-[2px] inline-block h-[14px] w-[7px] align-middle bg-muted-2" />
      </span>

      <div className="ml-auto flex gap-[.35rem]">
        <ModeButton active={mode === "radial"} onClick={() => onModeChange("radial")}>
          radial
        </ModeButton>
        <ModeButton active={mode === "graph"} onClick={() => onModeChange("graph")}>
          relaciones
        </ModeButton>
      </div>

      <div className="ml-[.6rem] flex gap-[.35rem]">
        <ModeButton active={style === "circle"} onClick={() => onStyleChange("circle")}>
          círculo
        </ModeButton>
        <ModeButton active={style === "cards"} onClick={() => onStyleChange("cards")}>
          cards
        </ModeButton>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-md border bg-panel px-[.7rem] py-[.4rem] font-mono text-[.74rem] ${
        active ? "border-accent text-accent" : "border-line text-muted"
      }`}
    >
      {children}
    </button>
  );
}
