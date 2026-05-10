import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CardPreview } from "../components/game/CardPreview";
import { Hand } from "../components/game/Hand";
import { PhaseBanner } from "../components/game/PhaseBanner";
import { PlayersPanel } from "../components/game/PlayersPanel";
import { RoundTable } from "../components/game/RoundTable";
import { WinOverlay } from "../components/game/WinOverlay";
import { nextPlayerIdx, useGameMock } from "../hooks/useGameMock";
import type { Card } from "../types/game";

const GamePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomCode = searchParams.get("code");
  const playerId = searchParams.get("id");

  const myName = playerId ? `Ty (${playerId.slice(0, 4)})` : "Ty";
  const { state, actions } = useGameMock(myName);
  const [hovered, setHovered] = useState<Card | null>(null);

  const me = state.players.find((p) => p.isMe);
  const cur = state.players[state.currentPlayerIdx];
  const isMyTurn = !!cur?.isMe;

  const handlePlay = (card: Card) => {
    if (state.phase === "ANSWER" && card.kind === "POWER_UP") {
      actions.playPowerUp(card.id);
    } else if (state.phase === "EFFECT" && card.kind === "EFFECT") {
      actions.playEffect(card.id);
    } else if (state.phase === "QUESTION" && card.kind === "QUESTION") {
      const targetIdx = nextPlayerIdx(
        state.players,
        state.currentPlayerIdx,
        state.direction,
      );
      actions.playQuestion(card.id, state.players[targetIdx].id);
    } else if (state.phase === "DEBUFF" && card.kind === "DEBUFF") {
      actions.attachDebuff(card.id);
    }
  };

  const winner = state.winnerId
    ? state.players.find((p) => p.id === state.winnerId)
    : null;

  return (
    <div className="relative flex h-screen w-full flex-col gap-2 overflow-hidden bg-[#e53935] p-3 font-bold">
      <div className="grid min-h-0 flex-1 grid-cols-4 gap-3">
        <PlayersPanel
          players={state.players}
          currentPlayerId={cur?.id ?? null}
          pendingTargetId={state.pendingQuestion?.toPlayerId ?? null}
        />
        <RoundTable state={state} />
        <CardPreview
          state={state}
          hoveredCard={hovered}
          onAnswer={actions.answerQuestion}
        />
      </div>

      <PhaseBanner
        state={state}
        onSkipEffect={actions.skipEffect}
        onSkipDebuff={actions.skipDebuff}
      />

      <Hand
        cards={me?.hand ?? []}
        hoveredCardId={hovered?.id ?? null}
        phase={state.phase}
        isMyTurn={isMyTurn}
        onHoverStart={setHovered}
        onHoverEnd={() => setHovered(null)}
        onPlay={handlePlay}
      />

      {state.phase === "RESULT" && winner && (
        <WinOverlay
          winnerName={winner.name}
          onPlayAgain={actions.restart}
          onBackToLobby={() =>
            navigate(`/lobby?code=${roomCode ?? ""}&id=${playerId ?? ""}`)
          }
        />
      )}
    </div>
  );
};

export default GamePage;
