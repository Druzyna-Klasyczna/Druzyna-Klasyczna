import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WS_BASE_URL } from "../lib/config";
import type {
  LobbyClientAction,
  LobbyServerEvent,
  Room,
} from "../types/api";

export const useLobby = (roomCode: string | null, playerId: string | null) => {
  const [room, setRoom] = useState<Room | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const socket = new WebSocket(
      `${WS_BASE_URL}/ws/lobby/${roomCode}/${playerId}`,
    );
    ws.current = socket;

    socket.onmessage = (event) => {
      const data: LobbyServerEvent = JSON.parse(event.data);
      if (data.event === "ROOM_STATE_UPDATE") {
        setRoom(data.room);
      } else if (data.event === "GAME_STARTING") {
        navigate(`/game?code=${roomCode}&id=${playerId}`);
      }
    };

    socket.onclose = (event) => {
      if (event.code === 4000) {
        alert("Zostałeś wyrzucony z pokoju!");
        navigate("/");
      } else if (event.code === 4003) {
        alert("Błąd autoryzacji (zły kod pokoju lub ID).");
        navigate("/");
      }
    };

    return () => {
      socket.close();
      ws.current = null;
    };
  }, [roomCode, playerId, navigate]);

  const send = (message: LobbyClientAction) => {
    ws.current?.send(JSON.stringify(message));
  };

  return {
    room,
    toggleReady: () => send({ action: "TOGGLE_READY" }),
    kickPlayer: (targetId: string) =>
      send({ action: "KICK_PLAYER", target_id: targetId }),
    startGame: () => send({ action: "START_GAME" }),
  };
};
