// src/hooks/useLobby.ts
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Typy dopasowane do Twojego backendu
export interface Player {
  player_id: string;
  name: string;
  is_ready: boolean;
  is_host: boolean;
}

export interface Room {
  room_code: string;
  status: string;
  players: Record<string, Player>;
  settings: {
    deck_id: string;
  };
}

export const useLobby = (roomCode: string | null, playerId: string | null) => {
  const [room, setRoom] = useState<Room | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomCode || !playerId) return;

    // Dynamiczna zamiana http:// na ws:// dla zmiennych środowiskowych
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const wsBase = apiBase.replace(/^http/, "ws");
    const wsUrl = `${wsBase}/ws/lobby/${roomCode}/${playerId}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event === "ROOM_STATE_UPDATE") {
        setRoom(data.room);
      } else if (data.event === "GAME_STARTING") {
        navigate(`/game?code=${roomCode}&id=${playerId}`);
      }
    };

    ws.current.onclose = (event) => {
      // Kod 4000 to Twój customowy kod Kickowania z backendu
      if (event.code === 4000) {
        alert("Zostałeś wyrzucony z pokoju!");
        navigate("/");
      } else if (event.code === 4003) {
        alert("Błąd autoryzacji (zły kod pokoju lub ID).");
        navigate("/");
      }
    };

    return () => {
      // Zamknięcie gniazdka, gdy gracz wyjdzie z Lobby
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [roomCode, playerId, navigate]);

  // --- FUNKCJE AKCJI ---
  const toggleReady = () => {
    ws.current?.send(JSON.stringify({ action: "TOGGLE_READY" }));
  };

  const kickPlayer = (targetId: string) => {
    ws.current?.send(
      JSON.stringify({ action: "KICK_PLAYER", target_id: targetId }),
    );
  };

  const startGame = () => {
    ws.current?.send(JSON.stringify({ action: "START_GAME" }));
  };

  return { room, toggleReady, kickPlayer, startGame };
};
