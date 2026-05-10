import { PlayerCard } from "./PlayerCard";

export interface LobbyPlayer {
  id: string;
  name: string;
  isAdmin: boolean;
  avatarUrl?: string;
}

interface PlayerCardListProps {
  players: LobbyPlayer[];
  currentUserId: string;
  onKick: (id: string) => void;
  onLeave: () => void;
}

export const PlayerCardList = ({
  players,
  currentUserId,
  onKick,
  onLeave,
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
          isMe={player.id === currentUserId}
          canKick={amIAdmin && player.id !== currentUserId}
          avatarUrl={player.avatarUrl}
          onKick={() => onKick(player.id)}
          onLeave={onLeave}
        />
      ))}
    </div>
  );
};
