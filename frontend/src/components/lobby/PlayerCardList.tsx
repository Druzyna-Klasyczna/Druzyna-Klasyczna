import { PlayerCard } from "./PlayerCard";

export interface LobbyPlayer {
  id: string;
  name: string;
  isAdmin: boolean;
  isReady: boolean;
  avatarUrl?: string;
}

interface PlayerCardListProps {
  players: LobbyPlayer[];
  currentUserId: string;
  onKick: (id: string) => void;
  onLeave: () => void;
  onToggleReady: () => void;
}

export const PlayerCardList = ({
  players,
  currentUserId,
  onKick,
  onLeave,
  onToggleReady,
}: PlayerCardListProps) => {
  const me = players.find((p) => p.id === currentUserId);
  const amIAdmin = me?.isAdmin ?? false;

  return (
    <div className="flex w-full flex-col gap-5">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          name={player.name}
          isAdmin={player.isAdmin}
          isReady={player.isReady}
          isMe={player.id === currentUserId}
          canKick={amIAdmin && player.id !== currentUserId}
          avatarUrl={player.avatarUrl}
          onKick={() => onKick(player.id)}
          onLeave={onLeave}
          onToggleReady={onToggleReady}
        />
      ))}
    </div>
  );
};
