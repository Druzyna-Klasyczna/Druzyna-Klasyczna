import { DeckPreview } from "../components/lobby/DeckPreview";
import { GameConfig } from "../components/lobby/GameConfig";
import { PlayerCardList } from "../components/lobby/PlayerCardList";
import { TactileContainer } from "../components/TactileContainer";

import { useLobbySocket } from "../hooks/useLobbySocket";
import { useSearchParams } from "react-router-dom";


export const Lobby = () => {
    const [searchParams] = useSearchParams();

    const roomCode = searchParams.get("code");
    const currentUserId = searchParams.get("id");
    // const currentUserId = "1";

    const {
        room,
        connected,
        toggleReady,
        kickPlayer,
        startGame,
    } = useLobbySocket(roomCode!, currentUserId!);

    const players = room
        ? Object.values(room.players)
        : [];

    return (
        <div className="h-screen w-full bg-[#e53935] p-6 flex flex-col gap-6 overflow-hidden">
            <div className="mb-2 text-white">
                Socket: {connected ? "CONNECTED" : "DISCONNECTED"}
            </div>

            <div className="flex gap-4 mb-4">
                <button onClick={toggleReady}>
                    Toggle Ready
                </button>

                <button onClick={startGame}>
                    Start Game
                </button>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-8 min-h-0 h-full">
                <TactileContainer className="h-full flex flex-col">
                    <PlayerCardList
                        players={players}
                        currentUserId={currentUserId}
                        onKick={kickPlayer}
                        onLeave={() => console.log("leave")}
                    />
                </TactileContainer>

                <TactileContainer className="h-full flex flex-col">
                    <DeckPreview />
                </TactileContainer>

                <TactileContainer className="h-full flex flex-col">
                    <GameConfig sessionCode={roomCode ?? ""} />
                </TactileContainer>
            </div>
        </div>
    );
};