import type { Card } from "../../types/game";
import { TactileContainer } from "../TactileContainer";
import { HandCard } from "./HandCard";

interface HandProps {
  cards: Card[];
  hoveredCardId: string | null;
  onHoverStart: (card: Card) => void;
  onHoverEnd: () => void;
  onPlay?: (card: Card) => void;
}

export const Hand = ({
  cards,
  hoveredCardId,
  onHoverStart,
  onHoverEnd,
  onPlay,
}: HandProps) => (
  <TactileContainer className="relative h-64 !flex-col !items-stretch !justify-end pb-2 pt-12">
    <h2 className="absolute left-4 top-4 text-xl uppercase text-white">
      Twoja ręka
    </h2>

    <div className="flex h-full items-end justify-center gap-4">
      {cards.length === 0 ? (
        <div className="flex h-full items-center justify-center pb-6 text-center text-lg italic text-gray-300">
          Czekamy na karty...
        </div>
      ) : (
        cards.map((card) => (
          <HandCard
            key={card.id}
            card={card}
            isHovered={card.id === hoveredCardId}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            onClick={onPlay}
          />
        ))
      )}
    </div>
  </TactileContainer>
);
