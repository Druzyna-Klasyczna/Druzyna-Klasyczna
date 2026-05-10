import PlayerCard from "./PlayerCard"; // upewnij się, że ścieżka jest OK

interface Player {
    id: string;
    name: string;
    isAdmin: boolean;
    avatarUrl?: string;
}

interface PlayerCardListProps {
    players: Player[];
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
    const currentUser = players.find((p) => p.id === currentUserId);
    const amIAdmin = currentUser?.isAdmin || false;

    return (
        <div className="w-full flex flex-col gap-5">
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
