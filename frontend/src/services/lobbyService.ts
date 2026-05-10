import { API_BASE_URL } from "../lib/config";
import type { CreateRoomResponse, JoinRoomResponse } from "../types/api";

const postJson = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const lobbyService = {
  createRoom: (userName: string) =>
    postJson<CreateRoomResponse>("/create-room", { user_name: userName }),

  joinRoom: (roomCode: string, userName: string) =>
    postJson<JoinRoomResponse>(`/room/${roomCode}/join`, {
      user_name: userName,
    }),
};
