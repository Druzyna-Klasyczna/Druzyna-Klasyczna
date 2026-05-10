import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StartButton } from "../components/StartButton";
import { lobbyService } from "../services/lobbyService";

function HomePage() {
  const [isJoining, setIsJoining] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleHost = async () => {
    if (!userName.trim()) return alert("Najpierw podaj swój nick!");

    try {
      const data = await lobbyService.createRoom(userName);
      navigate(`/lobby?code=${data.join_code}&id=${data.host_id}`);
    } catch (err) {
      alert("Nie udało się połączyć z serwerem.");
    }
  };

  const handleJoin = async () => {
    if (!userName.trim() || !roomCode.trim())
      return alert("Podaj nick i kod pokoju!");

    try {
      const data = await lobbyService.joinRoom(
        roomCode.toUpperCase(),
        userName,
      );
      navigate(`/lobby?code=${roomCode.toUpperCase()}&id=${data.player_id}`);
    } catch (err) {
      alert("Pokój nie istnieje lub gra już trwa!");
    }
  };
  return (
    <div className="flex flex-col items-center pt-32 h-screen bg-white">
      <h1 className="text-6xl font-bold text-black mb-24 transition-all duration-300">
        Card Clash
      </h1>

      {/* Kontener z czarną ramką - dodałem min-h, żeby ramka nie skakała przy zmianie zawartości */}
      <div className="flex flex-row gap-8 border-4 border-black p-8 rounded-xl min-h-[160px] items-center justify-center transition-all duration-300">
        {!isJoining ? (
          // WIDOK 1: PODSTAWOWE GUZIKI
          <>
            <StartButton href="/admin-panel" name="Host" />
            <StartButton onClick={() => setIsJoining(true)} name="Join" />
          </>
        ) : (
          // WIDOK 2: POLE DO WPISANIA KODU
          <div className="flex flex-row gap-4 animate-fade-in items-center">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="border-4 border-black rounded-lg px-6 py-6 text-2xl font-bold outline-none focus:bg-yellow-100 uppercase w-72 text-black placeholder-gray-600"
            />
            {/* Ten guzik przenosi już do właściwego lobby z kodem z inputa */}
            <StartButton href={`/lobby?code=${roomCode}`} name="Go!" />

            {/* Guzik powrotu do poprzedniego widoku */}
            <button
              onClick={() => setIsJoining(false)}
              className="text-black font-bold text-xl underline hover:text-gray-600 ml-4"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
