import { useState } from "react";
import { DeckPreview } from "../components/lobby/DeckPreview";
import { GameConfig } from "../components/lobby/GameConfig";
import { PlayerCardList } from "../components/lobby/PlayerCardList";
import { TactileButton } from "../components/TactileButton";
import { TactileContainer } from "../components/TactileContainer";

// Definicja interfejsu zgodna z Twoim PlayerCardList
interface Player {
    id: string;
    name: string;
    isHost: boolean;
    isAdmin: boolean; // Dodane
    score: number; // Dodane
    avatarUrl?: string;
}

export const Lobby = () => {
    // 2. Dodaj brakujące pola do zahardkodowanych danych
    const [players, setPlayers] = useState<Player[]>([
        {
            id: "1",
            name: "ZADYMIARZ_99",
            isHost: true,
            isAdmin: true, // Host zazwyczaj jest adminem
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

    const currentUserId = "1"; // Zakładamy, że my to Zadymiarz_99

    const handleKick = (id: string) => {
        setPlayers((prev) => prev.filter((p) => p.id !== id));
    };

    const handleLeave = () => {
        console.log("Leaving lobby...");
    };

    return (
        <div className="h-screen w-full bg-[#e53935] p-6 flex flex-col gap-6 overflow-hidden">
            {/* Trzy kolumny rozciągnięte na pełną wysokość */}
            <div className="flex-1 grid grid-cols-3 gap-8 min-h-0">
                {/* Kolumna 1: Gracze */}
                <section className="flex flex-col min-h-0">
                    <h2 className="text-black text-2xl font-black italic uppercase mb-2 ml-1">
                        Gracze
                    </h2>
                    <TactileContainer className="flex-1 overflow-y-auto">
                        <PlayerCardList
                            players={players}
                            currentUserId={currentUserId}
                            onKick={handleKick}
                            onLeave={handleLeave}
                        />
                    </TactileContainer>
                </section>

                {/* Kolumna 2: Deck */}
                <section className="flex flex-col min-h-0">
                    <h2 className="text-black text-2xl font-black italic uppercase mb-2 ml-1">
                        Talia
                    </h2>
                    <TactileContainer className="flex-1">
                        <DeckPreview />
                    </TactileContainer>
                </section>

                {/* Kolumna 3: Konfiguracja */}
                <section className="flex flex-col min-h-0">
                    <h2 className="text-black text-2xl font-black italic uppercase mb-2 ml-1">
                        Ustawienia
                    </h2>
                    <TactileContainer className="flex-1 overflow-y-auto">
                        <GameConfig />
                    </TactileContainer>
                </section>
            </div>

            {/* Dolny pasek akcji */}
            <div className="flex justify-center items-center h-24 shrink-0">
                <TactileButton color="yellow" className="scale-125 px-20">
                    ROZPOCZNIJ GRĘ
                </TactileButton>
            </div>
        </div>
    );
};
