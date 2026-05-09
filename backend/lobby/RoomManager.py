import uuid
import secrets
import string
from typing import Optional, List, Dict
from fastapi import WebSocket
from .models import Room, Player

class RoomManager:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.active_rooms: Dict[str, Room] = {} 
        self.active_connections: Dict[str, WebSocket] = {}

    def generate_join_code(self, length=6) -> str:
        chars = string.ascii_uppercase + string.digits
        return ''.join(secrets.choice(chars) for _ in range(length))

    def create_room(self, creator_name: str):
        join_code = self.generate_join_code()
        host_id = str(uuid.uuid4())
        
        host = Player(player_id=host_id, name=creator_name, is_ready=True, is_host=True)
        room_data = Room(room_code=join_code, players={host_id: host})

        self.active_rooms[join_code] = room_data
        
        return {
            "room_id": str(uuid.uuid4()),
            "join_code": join_code,
            "invite_url": f"{self.base_url}/join/{join_code}",
            "host_id": host_id,
            "status": "active"
        }

    def get_room(self, join_code: str) -> Optional[Room]:
        return self.active_rooms.get(join_code.upper().strip())

    def add_player_to_room(self, join_code: str, player_name: str) -> Optional[str]:
        room = self.get_room(join_code)
        if room and room.status == "waiting":
            p_id = str(uuid.uuid4())
            room.players[p_id] = Player(player_id=p_id, name=player_name)
            return p_id
        return None


    async def broadcast_to_room(self, room_code: str, message: dict):
        room = self.get_room(room_code)
        if not room: return
        for p_id in room.players.keys():
            ws = self.active_connections.get(p_id)
            if ws:
                await ws.send_json(message)

    def toggle_ready(self, room_code: str, player_id: str) -> bool:
        room = self.get_room(room_code)
        if room and player_id in room.players:
            room.players[player_id].is_ready = not room.players[player_id].is_ready
            return True
        return False

    def update_settings(self, room_code: str, player_id: str, payload: dict) -> bool:
        room = self.get_room(room_code)
        if room and room.players.get(player_id) and room.players[player_id].is_host:
            # Tu możesz dodać np. room.settings.deck_id = payload.get('deck_id')
            return True
        return False

    def remove_player(self, room_code: str, player_id: str, requesting_host_id: str = None) -> bool:
        room = self.get_room(room_code)
        if not room or player_id not in room.players: return False
        
        if requesting_host_id: # Logika Kicka
            if not room.players.get(requesting_host_id) or not room.players[requesting_host_id].is_host:
                return False

        del room.players[player_id]
        if len(room.players) == 0:
            del self.active_rooms[room_code]
        return True

lobby_manager = RoomManager(base_url="http://localhost:5173")