import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Do przerzucenia gracza do Lobby
import { StartButton } from "../components/StartButton";
import { lobbyService } from "../services/lobbyService";
import { TactileContainer } from "../components/TactileContainer";

function HomePage() {
    const [isJoining, setIsJoining] = useState(false);
    const [roomCode, setRoomCode] = useState("");
    const [userName, setUserName] = useState(""); // NOWE: Stan na nick
    const navigate = useNavigate();

    // TWOJA LOGIKA: Hostowanie
    const handleHost = async () => {
        if (!userName.trim()) return alert("Najpierw podaj swój nick!");

        try {
            const data = await lobbyService.createRoom(userName);
            // Przerzucasz gracza i przekazujesz pałeczkę koledze!
            navigate(`/lobby?code=${data.join_code}&id=${data.host_id}`);
        } catch (err) {
            alert("Nie udało się połączyć z serwerem.");
        }
    };

    // TWOJA LOGIKA: Dołączanie
    const handleJoin = async () => {
        if (!userName.trim() || !roomCode.trim())
            return alert("Podaj nick i kod pokoju!");

        try {
            const data = await lobbyService.joinRoom(
                roomCode.toUpperCase(),
                userName,
            );
            // Przerzucasz gracza i przekazujesz pałeczkę koledze!
            navigate(
                `/lobby?code=${roomCode.toUpperCase()}&id=${data.player_id}`,
            );
        } catch (err) {
            alert("Pokój nie istnieje lub gra już trwa!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Bungee&display=swap');`}
            </style>

            {/* 2. Applying the font directly via the style prop */}
            <h1 
                style={{ 
                    fontFamily: "'Bungee', cursive",
                    textShadow: `
                        -1px -1px 0 #fff,  
                        1px -1px 0 #fff,
                        -1px  1px 0 #fff,
                        1px  1px 0 #fff,
                        0px  10px 0px rgba(0,0,0,1)
                    ` 
                }}
                className="text-6xl text-black mb-12 transition-all duration-300"
            >
                Card Clash
            </h1>

            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                {/* SEKCJA NICKU */}
                <TactileContainer className="w-full flex justify-center p-2">
                    <input
                        type="text"
                        placeholder="TWÓJ NICK"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="border-4 border-black bg-white px-6 py-4 text-2xl font-bold outline-none focus:bg-yellow-100 uppercase w-80 text-center text-black placeholder-gray-400 transition-colors"
                    />
                </TactileContainer>

                {/* SEKCJA AKCJI */}
                <TactileContainer className="w-full min-h-[180px] flex flex-col items-center justify-center p-6">
                    {!isJoining ? (
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <StartButton onClick={handleHost} name="Host" />
                            <StartButton
                                onClick={() => setIsJoining(true)}
                                name="Join"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 animate-fade-in w-full">
                            <div className="flex flex-row gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder="KOD POKOJU"
                                    value={roomCode}
                                    onChange={(e) =>
                                        setRoomCode(
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                    className="border-4 bg-white border-black px-4 py-4 text-2xl font-bold outline-none focus:bg-yellow-100 uppercase w-48 text-center text-black"
                                />
                                <StartButton
                                    onClick={handleJoin}
                                    name="Go!"
                                    size="lg"
                                />
                            </div>

                            <button
                                onClick={() => setIsJoining(false)}
                                className="text-white font-bold text-lg hover:text-gray-600 transition-all"
                            >
                                ← Wróć
                            </button>
                        </div>
                    )}
                </TactileContainer>
            </div>
        </div>
    );
}

export default HomePage;
