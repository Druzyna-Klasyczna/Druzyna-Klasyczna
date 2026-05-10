const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const lobbyService = {
  createRoom: async (userName: string) => {
    const response = await fetch(`${API_BASE}/create-room`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_name: userName }),
    });
    if (!response.ok) throw new Error("Błąd tworzenia pokoju");
    return response.json();
  },

  joinRoom: async (roomCode: string, userName: string) => {
    const response = await fetch(`${API_BASE}/room/${roomCode}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_name: userName }),
    });
    if (!response.ok) throw new Error("Nie znaleziono pokoju");
    return response.json();
  },
};
