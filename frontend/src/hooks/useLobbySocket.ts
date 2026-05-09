import { useEffect, useRef, useState } from "react";

export interface Player {
    id: string;
    name: string;
    isHost: boolean;
    isAdmin: boolean;
    score: number;
    avatarUrl?: string;
    isReady?: boolean;
}

interface RoomState {
    players: Record<string, Player>;
    status: string;
}

export const useLobbySocket = (
    roomCode: string,
    playerId: string
) => {
    const socketRef = useRef<WebSocket | null>(null);

    const [room, setRoom] = useState<RoomState | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(
            `ws://localhost:8000/ws/lobby/${roomCode}/${playerId}`
        );

        socketRef.current = ws;

        ws.onopen = () => {
            console.log("Connected to lobby socket");
            setConnected(true);
        };

        ws.onclose = () => {
            console.log("Disconnected");
            setConnected(false);
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log("WS MESSAGE:", data);

            switch (data.event) {
                case "ROOM_STATE_UPDATE":
                    setRoom(data.room);
                    break;

                case "GAME_STARTING":
                    console.log("Game starting...");
                    break;

                default:
                    console.warn("Unknown event:", data.event);
            }
        };

        return () => {
            ws.close();
        };
    }, [roomCode, playerId]);

    const send = (payload: any) => {
        if (
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN
        ) {
            socketRef.current.send(JSON.stringify(payload));
        }
    };

    return {
        room,
        connected,

        toggleReady: () =>
            send({
                action: "TOGGLE_READY",
            }),

        updateSettings: (settings: any) =>
            send({
                action: "UPDATE_SETTINGS",
                payload: settings,
            }),

        kickPlayer: (targetId: string) =>
            send({
                action: "KICK_PLAYER",
                target_id: targetId,
            }),

        startGame: () =>
            send({
                action: "START_GAME",
            }),
    };
};