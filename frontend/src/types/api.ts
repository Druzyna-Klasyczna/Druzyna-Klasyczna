export interface Player {
  player_id: string;
  name: string;
  is_ready: boolean;
  is_host: boolean;
}

export interface RoomSettings {
  deck_id: string;
}

export interface Room {
  room_code: string;
  status: string;
  players: Record<string, Player>;
  settings: RoomSettings;
}

export interface CreateRoomResponse {
  join_code: string;
  host_id: string;
  invite_url: string;
}

export interface JoinRoomResponse {
  player_id: string;
  room_code: string;
}

export type LobbyServerEvent =
  | { event: "ROOM_STATE_UPDATE"; room: Room }
  | { event: "GAME_STARTING" };

export type LobbyClientAction =
  | { action: "TOGGLE_READY" }
  | { action: "UPDATE_SETTINGS"; settings: Partial<RoomSettings> }
  | { action: "KICK_PLAYER"; target_id: string }
  | { action: "START_GAME" };

export type GameServerEvent = { event: string; [key: string]: unknown };
export type GameClientAction = { action: string; [key: string]: unknown };

