from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .RoomManager import lobby_manager

router = APIRouter()

@router.websocket("/ws/lobby/{room_code}/{player_id}")
async def lobby_websocket(websocket: WebSocket, room_code: str, player_id: str):
    room = lobby_manager.get_room(room_code)
    
    if not room or player_id not in room.players:
        await websocket.close(code=4003)
        return

    await websocket.accept()
    lobby_manager.active_connections[player_id] = websocket

    await lobby_manager.broadcast_to_room(room_code, {
        "event": "ROOM_STATE_UPDATE",
        "room": room.dict()
    })

    try:
        while True:
            data = await websocket.receive_json()
            action = data.get("action")

            payload = data.get("payload", {})

            if action == "TOGGLE_READY":
                if lobby_manager.toggle_ready(room_code, player_id):
                    await lobby_manager.broadcast_to_room(room_code, {
                        "event": "ROOM_STATE_UPDATE", 
                        "room": room.dict()
                    })

            elif action == "UPDATE_SETTINGS":
                if lobby_manager.update_settings(room_code, player_id, payload):
                    await lobby_manager.broadcast_to_room(room_code, {
                        "event": "ROOM_STATE_UPDATE", 
                        "room": room.dict()
                    })

            elif action == "KICK_PLAYER":
                target_id = data.get("target_id")
                if lobby_manager.remove_player(room_code, target_id, requesting_host_id=player_id):
                    kicked_ws = lobby_manager.active_connections.get(target_id)
                    if kicked_ws:
                        await kicked_ws.close(code=4000)
                        del lobby_manager.active_connections[target_id]

                    await lobby_manager.broadcast_to_room(room_code, {
                        "event": "ROOM_STATE_UPDATE", 
                        "room": room.dict()
                    })

            elif action == "START_GAME":
                if room.players.get(player_id) and room.players[player_id].is_host and room.can_start():
                    room.status = "playing"
                    # Relay mode: clients run their own state and the backend
                    # only forwards actions on /ws/game/... — no server-side
                    # engine.
                    await lobby_manager.broadcast_to_room(room_code, {"event": "GAME_STARTING"})

    except WebSocketDisconnect:
        # If the game has started, the client is just navigating away from
        # the lobby route to the game route — don't tear down their player or
        # connection slot, the game websocket will replace it.
        current = lobby_manager.get_room(room_code)
        if current and current.status == "playing":
            return

        lobby_manager.remove_player(room_code, player_id)
        if player_id in lobby_manager.active_connections:
            del lobby_manager.active_connections[player_id]

        if lobby_manager.get_room(room_code):
            await lobby_manager.broadcast_to_room(room_code, {
                "event": "ROOM_STATE_UPDATE",
                "room": lobby_manager.get_room(room_code).dict()
            })


@router.websocket("/ws/game/{room_code}/{player_id}")
async def game_websocket(websocket: WebSocket, room_code: str, player_id: str):
    room = lobby_manager.get_room(room_code)

    if not room or player_id not in room.players:
        await websocket.close(code=4003)
        return

    await websocket.accept()
    lobby_manager.active_connections[player_id] = websocket

    await websocket.send_json({
        "event": "ROOM_INFO",
        "players": [
            {"id": p.player_id, "name": p.name}
            for p in room.players.values()
        ],
    })

    try:
        while True:
            msg = await websocket.receive_json()
            for pid in list(room.players.keys()):
                if pid == player_id:
                    continue
                conn = lobby_manager.active_connections.get(pid)
                if conn:
                    await conn.send_json(msg)
    except WebSocketDisconnect:
        if player_id in lobby_manager.active_connections:
            del lobby_manager.active_connections[player_id]