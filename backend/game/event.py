from enum import Enum
from dataclasses import dataclass
from player import GamePlayer

class EventType(Enum):
    POWER_UP = 1
    ANSWER = 2
    EFFECT = 3
    QUESTION = 4
    DEBUFF = 5

@dataclass
class GameEvent:
    player: GamePlayer
    event_type: EventType
