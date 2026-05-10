import type { Card, CardKind, TurnPhase } from "../../types/game";
import { TactileContainer } from "../TactileContainer";
import { HandCard } from "./HandCard";

interface HandProps {
  cards: Card[];
  hoveredCardId: string | null;
  phase: TurnPhase;
  isMyTurn: boolean;
  onHoverStart: (card: Card) => void;
  onHoverEnd: () => void;
  onPlay: (card: Card) => void;
}

const PLAYABLE_KIND: Record<TurnPhase, CardKind | null> = {
  ANSWER: "POWER_UP",
  EFFECT: "EFFECT",
  QUESTION: "QUESTION",
  DEBUFF: "DEBUFF",
  RESULT: null,
};

export const Hand = ({
  cards,
  hoveredCardId,
  phase,
  isMyTurn,
  onHoverStart,
  onHoverEnd,
  onPlay,
}: HandProps) => {
  const allowedKind = PLAYABLE_KIND[phase];
  const sorted = [...cards].sort((a, b) => {
    const order: CardKind[] = ["QUESTION", "POWER_UP", "EFFECT", "DEBUFF"];
    return order.indexOf(a.kind) - order.indexOf(b.kind);
  });

  return (
    <TactileContainer className="relative h-44 flex-none !flex-col !items-stretch !justify-end !p-2 pt-8">
      <h2 className="absolute left-3 top-2 text-sm uppercase text-white">
        Twoja ręka
      </h2>

      <div className="flex h-full items-end justify-center gap-3">
        {sorted.length === 0 ? (
          <div className="flex h-full items-center justify-center pb-6 text-center text-lg italic text-gray-300">
            Brak kart
          </div>
        ) : (
          sorted.map((card) => (
            <HandCard
              key={card.id}
              card={card}
              isHovered={card.id === hoveredCardId}
              playable={isMyTurn && card.kind === allowedKind}
              onHoverStart={onHoverStart}
              onHoverEnd={onHoverEnd}
              onPlay={onPlay}
            />
          ))
        )}
      </div>
    </TactileContainer>
  );
};
