import { useSearchParams, useNavigate } from "react-router-dom";
import { useLobby } from "../hooks/useLobby";
import { DeckPreview } from "../components/lobby/DeckPreview";
import { GameConfig } from "../components/lobby/GameConfig";
import { PlayerCardList } from "../components/lobby/PlayerCardList";
import { TactileContainer } from "../components/TactileContainer";

export const Lobby = () => {
    const [searchParams] = useSearchParams();
    const roomCode = searchParams.get("code");
    const playerId = searchParams.get("id");
    const navigate = useNavigate();

    const { room, kickPlayer } = useLobby(roomCode, playerId);

    if (!room) {
        return (
            <div className="h-screen w-full bg-[#e53935] flex items-center justify-center">
                <h1 className="text-white text-4xl font-black italic">
                    Łączenie z serwerem...
                </h1>
            </div>
        );
    }

    const playersArray = Object.values(room.players).map((p) => ({
        id: p.player_id,
        name: p.name,
        isHost: p.is_host,
        isAdmin: p.is_host,
        score: 0,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`,
    }));

    const handleLeave = () => {
        navigate("/");
    };

    return (
        <div className="h-screen w-full bg-[#e53935] p-6 flex flex-col gap-6 overflow-hidden">
            <div className="flex-1 grid grid-cols-3 gap-8 min-h-0 h-full">
                <TactileContainer className="h-full flex flex-col">
                    <h2 className="text-white text-2xl mb-4 uppercase border-b-4 border-black pb-2 flex-none">
                        Players
                    </h2>
                    <div className="flex-1 min-h-0 ">
                        <PlayerCardList
                            players={playersArray}
                            currentUserId={playerId!}
                            onKick={kickPlayer}
                            onLeave={handleLeave}
                        />
                    </div>
                </TactileContainer>

                <TactileContainer className="h-full flex flex-col">
                    <h2 className="text-white text-2xl mb-4 uppercase border-b-4 border-black pb-2">
                        Deck
                    </h2>
                    <DeckPreview />
                </TactileContainer>

                <TactileContainer className="h-full flex flex-col">
                    <h2 className="text-white text-2xl mb-4 uppercase border-b-4 border-black pb-2">
                        Game Config
                    </h2>
                    <GameConfig
                        roomCode={room.room_code}
                        isHost={room.players[playerId!]?.is_host}
                    />
                </TactileContainer>
            </div>
        </div>
    );
};
