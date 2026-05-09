import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Do przerzucenia gracza do Lobby
import { StartButton } from "../components/StartButton";
import { lobbyService } from "../services/lobbyService";

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
      navigate(`/lobby?code=${roomCode.toUpperCase()}&id=${data.player_id}`);
    } catch (err) {
      alert("Pokój nie istnieje lub gra już trwa!");
    }
  };

  return (
    <div className="flex flex-col items-center pt-32 h-screen bg-white">
      <h1 className="text-6xl font-bold text-black mb-12 transition-all duration-300">
        Card Clash
      </h1>

      {/* TWOJE NOWE POLE: Gracz musi podać nick zanim coś kliknie */}
      <input
        type="text"
        placeholder="TWÓJ NICK"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="border-4 border-black rounded-lg px-6 py-4 text-2xl font-bold mb-8 outline-none focus:bg-yellow-100 uppercase w-72 text-center text-black placeholder-gray-600"
      />

      <div className="flex flex-row gap-8 border-4 border-black p-8 rounded-xl min-h-[160px] items-center justify-center transition-all duration-300">
        {!isJoining ? (
          <>
            <StartButton onClick={handleHost} name="Host" />
            <StartButton onClick={() => setIsJoining(true)} name="Join" />
          </>
        ) : (
          <div className="flex flex-row gap-4 animate-fade-in items-center">
            <input
              type="text"
              placeholder="Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="border-4 border-black rounded-lg px-6 py-6 text-2xl font-bold outline-none focus:bg-yellow-100 uppercase w-72 text-center text-black placeholder-gray-600"
            />

            <StartButton onClick={handleJoin} name="Go!" />

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
