import type { ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DeckPreview } from "../components/lobby/DeckPreview";
import { GameConfig } from "../components/lobby/GameConfig";
import {
  PlayerCardList,
  type LobbyPlayer,
} from "../components/lobby/PlayerCardList";
import { TactileContainer } from "../components/TactileContainer";
import { useLobby } from "../hooks/useLobby";
import type { Player } from "../types/api";

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

const toLobbyPlayer = (p: Player): LobbyPlayer => ({
  id: p.player_id,
  name: p.name,
  isAdmin: p.is_host,
  isReady: p.is_ready,
  avatarUrl: avatarUrl(p.name),
});

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <TactileContainer className="flex h-full flex-col">
    <h2 className="mb-4 flex-none border-b-4 border-black pb-2 text-2xl uppercase text-white">
      {title}
    </h2>
    <div className="flex-1 w-full min-h-0">{children}</div>
  </TactileContainer>
);

export const Lobby = () => {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("code");
  const playerId = searchParams.get("id");
  const navigate = useNavigate();

  const { room, kickPlayer, startGame, toggleReady } = useLobby(
    roomCode,
    playerId,
  );

  if (!room || !playerId) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#e53935]">
        <h1 className="text-4xl font-black italic text-white">
          Łączenie z serwerem...
        </h1>
      </div>
    );
  }

  const players = Object.values(room.players).map(toLobbyPlayer);
  const isHost = !!room.players[playerId]?.is_host;
  const canStart = players.length >= 2 && players.every((p) => p.isReady);

  return (
    <div className="flex h-screen w-full flex-col gap-6 overflow-hidden bg-[#e53935] p-6">
      <div className="grid h-full min-h-0 flex-1 grid-cols-3 gap-8">
        <Section title="Players">
          <PlayerCardList
            players={players}
            currentUserId={playerId}
            onKick={kickPlayer}
            onLeave={() => navigate("/")}
            onToggleReady={toggleReady}
          />
        </Section>

        <Section title="Deck">
          <DeckPreview isHost={isHost} />
        </Section>

        <Section title="Game Config">
          <GameConfig
            roomCode={room.room_code}
            isHost={isHost}
            canStart={canStart}
            onStart={startGame}
          />
        </Section>
      </div>
    </div>
  );
};
