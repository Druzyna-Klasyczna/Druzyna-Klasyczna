import type { Card } from "../../types/game";
import { CardArt } from "./CardArt";

interface HandCardProps {
  card: Card;
  isHovered: boolean;
  onHoverStart: (card: Card) => void;
  onHoverEnd: () => void;
  onClick?: (card: Card) => void;
}

export const HandCard = ({
  card,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick,
}: HandCardProps) => (
  <button
    type="button"
    onMouseEnter={() => onHoverStart(card)}
    onMouseLeave={onHoverEnd}
    onFocus={() => onHoverStart(card)}
    onBlur={onHoverEnd}
    onClick={() => onClick?.(card)}
    className={`cursor-pointer transition-transform duration-150 outline-none ${
      isHovered ? "-translate-y-8 scale-105" : "hover:-translate-y-4"
    } focus-visible:ring-4 focus-visible:ring-yellow-200`}
  >
    <CardArt card={card} size="sm" />
  </button>
);
