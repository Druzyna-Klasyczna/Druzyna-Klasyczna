import type { ReactNode } from "react";
import type { Card, CardKind } from "../../types/game";

const KIND_STYLES: Record<CardKind, { bg: string; label: string; chip: string }> = {
  QUESTION: {
    bg: "bg-yellow-400",
    label: "PYTANIE",
    chip: "bg-black text-yellow-400",
  },
  POWER_UP: {
    bg: "bg-emerald-400",
    label: "POWER-UP",
    chip: "bg-black text-emerald-300",
  },
  DEBUFF: {
    bg: "bg-rose-400",
    label: "DEBUFF",
    chip: "bg-black text-rose-300",
  },
  EFFECT: {
    bg: "bg-sky-400",
    label: "EFEKT",
    chip: "bg-black text-sky-300",
  },
};

export const cardTitle = (card: Card): string => {
  if (card.kind === "QUESTION") return "Pytanie";
  return card.name;
};

interface CardArtProps {
  card: Card;
  size?: "sm" | "lg";
  children?: ReactNode;
  className?: string;
}

export const CardArt = ({
  card,
  size = "sm",
  children,
  className = "",
}: CardArtProps) => {
  const style = KIND_STYLES[card.kind];
  const dimensions =
    size === "lg"
      ? "w-full h-full p-4 text-base"
      : "h-32 w-24 p-1.5 text-xs";

  return (
    <div
      className={`relative flex flex-col ${dimensions} ${style.bg} rounded-md border-[3px] border-black text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${className}`}
    >
      <span
        className={`mb-2 inline-block self-start px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${style.chip}`}
      >
        {style.label}
      </span>
      <div className="flex flex-1 flex-col items-center justify-center text-center font-black uppercase">
        {children ?? <span className="break-words">{cardTitle(card)}</span>}
      </div>
    </div>
  );
};

export const cardKindStyles = KIND_STYLES;
