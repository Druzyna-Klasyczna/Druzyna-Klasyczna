import uuid
import secrets
import string
from typing import Optional, List

class RoomManager:
    def __init__(self, base_url: str):
        """
        :param base_url: The frontend URL (e.g., "https://myapp.com")
        """
        self.base_url = base_url.rstrip('/')
        # In a real app, these would be stored in Redis or a Database
        self.active_rooms = {} 

    def generate_join_code(self, length=6) -> str:
        """Generates a short, uppercase alphanumeric code (e.g., 4F2A9X)"""
        chars = string.ascii_uppercase + string.digits
        return ''.join(secrets.choice(chars) for _ in range(length))

    def get_room_data(self, room_id: str):
        print(f"give room id: {room_id}, {type(room_id)}")
        print(self.active_rooms)
        result = self.active_rooms.get(room_id,None)
        return result

    def create_room(self, creator_id: str):
        """
        Initializes a new room and returns the metadata.
        """
        room_id = str(uuid.uuid4())
        join_code = self.generate_join_code()
        
        # The URL the user will share
        invite_url = f"{self.base_url}/join/{join_code}"
    
        room_data = {
            "room_id": room_id,
            "join_code": join_code,
            "invite_url": invite_url,
            "creator_id": creator_id,
            "status": "active",
            "players": []
        }

        # Save to your "database"
        self.active_rooms[join_code] = room_data
        return room_data

    def validate_room(self, join_code: str) -> Optional[dict]:
        """
        Checks if a code exists and returns the room data.
        """
        code = join_code.upper().strip()
        return self.active_rooms.get(code)
    
    def add_player_to_room(self, join_code: str, player_id: str) -> bool:
        """Adds a player to the room list if they aren't already there."""
        room = self.validate_room(join_code)
        if room:
            if player_id not in room["players"]:
                room["players"].append(player_id)
            return True
        return False

    def get_room_players(self, join_code: str) -> Optional[List[str]]:
        """Returns the list of players for a specific room."""
        room = self.validate_room(join_code)
        print(room)
        return room.get("players") if room else None 

# --- Usage Example ---
manager = RoomManager(base_url="https://play.coolgame.com")
new_room = manager.create_room(creator_id="user_123")

print(f"Join Code: {new_room['join_code']}")
print(f"URL: {new_room['invite_url']}")