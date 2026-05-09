import { useState } from "react";
import { DeckPreview } from "../components/lobby/DeckPreview";
import { GameConfig } from "../components/lobby/GameConfig";
import { PlayerCardList } from "../components/lobby/PlayerCardList";
import { TactileButton } from "../components/TactileButton";
import { TactileContainer } from "../components/TactileContainer";

interface Player {
    id: string;
    name: string;
    isHost: boolean;
    isAdmin: boolean; // Dodane
    score: number; // Dodane
    avatarUrl?: string;
}

export const Lobby = () => {
    const [players, setPlayers] = useState<Player[]>([
        {
            id: "1",
            name: "ZADYMIARZ_99",
            isHost: true,
            isAdmin: true,
            score: 0,
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        },
        {
            id: "2",
            name: "KARCIAZ",
            isHost: false,
            isAdmin: false,
            score: 0,
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
        },
        {
            id: "3",
            name: "CZITER_PL",
            isHost: false,
            isAdmin: false,
            score: 0,
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb",
        },
        {
            id: "4",
            name: "EASY_GAME",
            isHost: false,
            isAdmin: false,
            score: 0,
            avatarUrl:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Snuggles",
        },
    ]);

    const currentUserId = "1";

    const handleKick = (id: string) => {
        setPlayers((prev) => prev.filter((p) => p.id !== id));
    };

    const handleLeave = () => {
        console.log("Leaving lobby...");
    };

    return (
        <div className="h-screen w-full bg-[#e53935] p-6 flex flex-col gap-6 overflow-hidden">
            <div className="flex-1 grid grid-cols-3 gap-8 min-h-0 h-full">
                <TactileContainer className="h-full flex flex-col">
                    <PlayerCardList
                        players={players}
                        currentUserId={currentUserId}
                        onKick={handleKick}
                        onLeave={handleLeave}
                    />
                </TactileContainer>

                <TactileContainer className="h-full flex flex-col">
                    <DeckPreview />
                </TactileContainer>

                <TactileContainer className="h-full flex flex-col">
                    <GameConfig />
                </TactileContainer>
            </div>
        </div>
    );
};
