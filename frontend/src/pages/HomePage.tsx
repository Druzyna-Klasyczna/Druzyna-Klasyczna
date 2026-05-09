import { useState } from "react";
import { StartButton } from "../components/StartButton";
import { TactileContainer } from "../components/TactileContainer";

function HomePage() {
    const [isJoining, setIsJoining] = useState(false);
    const [roomCode, setRoomCode] = useState("");

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <h1 className="text-6xl font-bold text-black mb-20">Card Clash</h1>

            <TactileContainer className="flex flex-col items-center gap-6 p-8">
                {!isJoining ? (
                    <>
                        <StartButton href="/admin-panel" name="Host" />
                        <StartButton
                            onClick={() => setIsJoining(true)}
                            name="Join"
                        />
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Enter Room Code"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            className="border-4 border-black px-6 py-4 text-xl font-bold uppercase w-72 text-black focus:bg-yellow-100 outline-none"
                        />

                        <StartButton
                            href={`/lobby?code=${roomCode}`}
                            name="Go!"
                        />

                        <button
                            onClick={() => setIsJoining(false)}
                            className="text-black font-bold underline hover:text-gray-600"
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
