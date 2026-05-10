import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StartButton } from "../components/StartButton";
import { TactileContainer } from "../components/TactileContainer";
import { lobbyService } from "../services/lobbyService";

const HomePage = () => {
  const [isJoining, setIsJoining] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleHost = async () => {
    if (!userName.trim()) {
      alert("Najpierw podaj swój nick!");
      return;
    }
    try {
      const data = await lobbyService.createRoom(userName);
      navigate(`/lobby?code=${data.join_code}&id=${data.host_id}`);
    } catch {
      alert("Nie udało się połączyć z serwerem.");
    }
  };

  const handleJoin = async () => {
    if (!userName.trim() || !roomCode.trim()) {
      alert("Podaj nick i kod pokoju!");
      return;
    }
    const code = roomCode.toUpperCase();
    try {
      const data = await lobbyService.joinRoom(code, userName);
      navigate(`/lobby?code=${code}&id=${data.player_id}`);
    } catch {
      alert("Pokój nie istnieje lub gra już trwa!");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="font-display text-stroke-white mb-12 text-6xl text-black transition-all duration-300">
        Card Clash
      </h1>

      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <TactileContainer className="flex w-full justify-center p-2">
          <input
            type="text"
            placeholder="TWÓJ NICK"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-80 border-4 border-black bg-white px-6 py-4 text-center text-2xl font-bold uppercase text-black placeholder-gray-400 outline-none transition-colors focus:bg-yellow-100"
          />
        </TactileContainer>

        <TactileContainer className="flex min-h-[180px] w-full flex-col items-center justify-center p-6">
          {isJoining ? (
            <div className="flex w-full animate-fade-in flex-col items-center gap-4">
              <div className="flex flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="KOD POKOJU"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-48 border-4 border-black bg-white px-4 py-4 text-center text-2xl font-bold uppercase text-black outline-none focus:bg-yellow-100"
                />
                <StartButton onClick={handleJoin} name="Go!" size="lg" />
              </div>

              <button
                type="button"
                onClick={() => setIsJoining(false)}
                className="text-lg font-bold text-white transition-all hover:text-gray-600"
              >
                ← Wróć
              </button>
            </div>
          ) : (
            <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
              <StartButton onClick={handleHost} name="Host" />
              <StartButton onClick={() => setIsJoining(true)} name="Join" />
            </div>
          )}
        </TactileContainer>
      </div>
    </div>
  );
};

export default HomePage;
