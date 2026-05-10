import { useState } from "react";
import { StartButton } from "../components/StartButton";
import { TactileContainer } from "../components/TactileContainer";

function HomePage() {
    // Zastępujemy isJoining stanem zarządzającym aktualnym widokiem
    const [mode, setMode] = useState<"menu" | "join" | "host">("menu");
    const [roomCode, setRoomCode] = useState("");
    const [playerName, setPlayerName] = useState("");

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <h1 className="text-6xl font-bold text-black mb-20">Card Clash</h1>

            <TactileContainer className="flex flex-col items-center gap-6 p-8">
                {/* WIDOK GŁÓWNEGO MENU */}
                {mode === "menu" && (
                    <>
                        <StartButton 
                            onClick={() => setMode("host")} 
                            name="Host" 
                        />
                        <StartButton
                            onClick={() => setMode("join")}
                            name="Join"
                        />
                    </>
                )}

                {/* WIDOK DOŁĄCZANIA (JOIN) */}
                {mode === "join" && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter Room Code"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            className="border-4 border-black px-6 py-4 text-xl font-bold uppercase w-72 text-black focus:bg-yellow-100 outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="border-4 border-black px-6 py-4 text-xl font-bold uppercase w-72 text-black focus:bg-yellow-100 outline-none"
                        />

                        <StartButton
                            href={`/lobby?code=${roomCode}`}
                            name="Go!"
                        />

                        <button
                            onClick={() => setMode("menu")}
                            className="text-white font-bold hover:text-gray-600"
                        >
                            Back
                        </button>
                    </>
                )}

                {/* WIDOK HOSTOWANIA (HOST) */}
                {mode === "host" && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="border-4 border-black px-6 py-4 text-xl font-bold uppercase w-72 text-black focus:bg-yellow-100 outline-none"
                        />

                        <StartButton
                            href="/lobby" 
                            name="Go!"
                        />

                        <button
                            onClick={() => setMode("menu")}
                            className="text-white font-bold hover:text-gray-600"
                        >
                            Back
                        </button>
                    </>
                )}
            </TactileContainer>
        </div>
    );
}

export default HomePage;