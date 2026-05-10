import { useEffect, useRef, useState } from "react";
import { WS_BASE_URL } from "../lib/config";
import type { GameClientAction, GameServerEvent } from "../types/api";

export interface GameState {
  lastEvent: GameServerEvent | null;
}

export const useGame = (roomCode: string | null, playerId: string | null) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomCode || !playerId) return;

    let socket: WebSocket;
    try {
      socket = new WebSocket(
        `${WS_BASE_URL}/ws/game/${roomCode}/${playerId}`,
      );
    } catch (err) {
      console.warn("[useGame] failed to open websocket", err);
      return;
    }
    ws.current = socket;

    socket.onmessage = (event) => {
      try {
        const data: GameServerEvent = JSON.parse(event.data);
        setGameState({ lastEvent: data });
      } catch (err) {
        console.warn("[useGame] bad payload", err);
      }
    };

    socket.onerror = (event) => {
      console.warn("[useGame] socket error", event);
    };

    socket.onclose = (event) => {
      console.info("[useGame] socket closed", event.code, event.reason);
    };

    return () => {
      socket.close();
      ws.current = null;
    };
  }, [roomCode, playerId]);

  const send = (message: GameClientAction) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { gameState, send };
};
