import type { Card } from "../../types/game";
import { CardArt } from "./CardArt";

interface HandCardProps {
  card: Card;
  isHovered: boolean;
  playable: boolean;
  onHoverStart: (card: Card) => void;
  onHoverEnd: () => void;
  onPlay?: (card: Card) => void;
}

export const HandCard = ({
  card,
  isHovered,
  playable,
  onHoverStart,
  onHoverEnd,
  onPlay,
}: HandCardProps) => (
  <button
    type="button"
    disabled={!playable}
    onMouseEnter={() => onHoverStart(card)}
    onMouseLeave={onHoverEnd}
    onFocus={() => onHoverStart(card)}
    onBlur={onHoverEnd}
    onClick={() => playable && onPlay?.(card)}
    className={`outline-none transition-transform duration-150 focus-visible:ring-4 focus-visible:ring-yellow-200 ${
      playable ? "cursor-pointer" : "cursor-not-allowed opacity-40 grayscale"
    } ${
      isHovered && playable
        ? "-translate-y-4 scale-105"
        : playable
          ? "hover:-translate-y-2"
          : ""
    }`}
  >
    <CardArt card={card} size="sm" />
  </button>
);
