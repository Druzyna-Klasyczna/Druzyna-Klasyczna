from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from lobby.RoomManager import RoomManager
# Import your RoomManager class here or paste it above

app = FastAPI()

# --- CRITICAL: CORS SETTINGS ---
# This allows your React app to talk to this Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your React URL
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = RoomManager(base_url="http://localhost:5173") # Your React port

class CreateRoomRequest(BaseModel):
    user_id: str

@app.post("/create-room")
async def create_room_endpoint(request: CreateRoomRequest):
    data = manager.create_room(creator_id=request.user_id)
    return data

@app.get("/validate/{code}")
async def validate_room_endpoint(code: str):
    room = manager.validate_room(code)
    if room:
        return {"valid": True, "room": room}
    return {"valid": False}

@app.get("/room-info/{join_code}")
async def get_room_info(join_code: str):
    result = manager.get_room_data(room_id=join_code)
    if result is None:
        return {"empty":"true"}
    return result

# ... (your existing imports and app setup)

class JoinRoomRequest(BaseModel):
    player_id: str

@app.post("/room/{join_code}/join")
async def join_room_endpoint(join_code: str, request: JoinRoomRequest):
    success = manager.add_player_to_room(join_code, request.player_id)
    if success:
        return {"status": "joined"}
    return {"error": "Room not found"}, 404

@app.get("/room/{join_code}/players")
async def show_players_endpoint(join_code: str):
    """Debug endpoint to see who is in the room"""
    players = manager.get_room_players(join_code)
    
    if players is None:
        return {"error": "Room not found", "players": []}
    
    return {
        "join_code": join_code.upper(),
        "player_count": len(players),
        "players": players
    }