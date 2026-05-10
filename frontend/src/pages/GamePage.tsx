import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CardPreview } from "../components/game/CardPreview";
import { Hand } from "../components/game/Hand";
import { MainTable } from "../components/game/MainTable";
import { PlayersPanel } from "../components/game/PlayersPanel";
import { useGame } from "../hooks/useGame";
import type { Card } from "../types/game";

const GamePage = () => {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("code");
  const playerId = searchParams.get("id");

  useGame(roomCode, playerId);

  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const [hand] = useState<Card[]>([]);

  return (
    <div className="flex h-screen w-full flex-col gap-6 overflow-hidden bg-[#e53935] p-6 font-bold">
      <div className="grid min-h-0 flex-1 grid-cols-4 gap-8">
        <PlayersPanel players={[]} />
        <MainTable />
        <CardPreview card={hoveredCard} />
      </div>

      <Hand
        cards={hand}
        hoveredCardId={hoveredCard?.id ?? null}
        onHoverStart={setHoveredCard}
        onHoverEnd={() => setHoveredCard(null)}
      />
    </div>
  );
};

export default GamePage;
