from pydantic import BaseModel
from typing import Dict

class Player(BaseModel):
    player_id: str
    name: str
    is_ready: bool = False
    is_host: bool = False


class RoomSettings(BaseModel):
    deck_id: str = "standard"

class Room(BaseModel):
    room_code: str
    status: str = "waiting"
    players: Dict[str, Player] = {}
    settings: RoomSettings = RoomSettings()

    def can_start(self) -> bool:
        if len(self.players) < 2:
            return False
        return all(player.is_ready for player in self.players.values())
    
