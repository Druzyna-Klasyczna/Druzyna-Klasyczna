from .ws_router import router as ws_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .RoomManager import lobby_manager

app = FastAPI()

# --- CRITICAL: CORS SETTINGS ---
# This allows your React app to talk to this Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your React URL
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ws_router)


class CreateRoomRequest(BaseModel):
    user_id: str

@app.post("/create-room")
async def create_room_endpoint(request: CreateRoomRequest):
    data = lobby_manager.create_room(creator_name=request.user_id)
    return data

@app.get("/validate/{code}")
async def validate_room_endpoint(code: str):
    room = lobby_manager.get_room(code)
    if room:
        return {"valid": True, "room": room}
    return {"valid": False}

@app.get("/room-info/{join_code}")
async def get_room_info(join_code: str):
    result = lobby_manager.get_room(join_code)
    if result is None:
        return {"empty":"true"}
    return result


class JoinRoomRequest(BaseModel):
    player_id: str

@app.post("/room/{join_code}/join")
async def join_room_endpoint(join_code: str, request: JoinRoomRequest):
    success = lobby_manager.add_player_to_room(join_code, request.player_id)
    if success:
        return {"status": "joined"}
    return {"error": "Room not found"}, 404
