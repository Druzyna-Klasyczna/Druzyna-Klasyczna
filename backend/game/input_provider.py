# input_provider.py
import asyncio
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

@dataclass
class CardInput:
    index: Optional[int] = None

@dataclass
class AnswerInput:
    index: Optional[int] = None

class GameInputProvider(ABC):
    @abstractmethod
    async def get_card_selection(self, player):
        pass

    @abstractmethod
    async def get_answer_selection(self, question_card, player, answer_time=None):
        pass

class ConsoleInputProvider(GameInputProvider):
    async def get_card_selection(self, player):
        card_index = input(f"Player {player.id}, choose a card index: ")
        if card_index == 'skip':
            return CardInput()
        return CardInput(index=int(card_index)-1)
    
    async def get_answer_selection(self, question_card, player, answer_time=None):
        print(f"Player {player.id}, answer the question: ")
        print(question_card.question)
        for i, answer in enumerate(question_card.answers, 1):
            print(f"{i}. {answer}")
        answer_index = input(">>> ")
        return AnswerInput(index=int(answer_index))

class WebsocketInputProvider(GameInputProvider):
    def __init__(self):
        self.mailboxes = {}

    def register_player(self, player_id: str):
        self.mailboxes[player_id] = asyncio.Queue()

    async def get_card_selection(self, player):
        data = await self.mailboxes[player.id].get() 
        card_index = data.get("card_index")
        
        if card_index == "skip" or card_index is None:
            return CardInput(None)
            
        return CardInput(index=int(card_index))

    async def get_answer_selection(self, question_card, player, answer_time=None):
        data = await self.mailboxes[player.id].get()
        answer_index = data.get("answer_index")
        
        if answer_index is None:
            return AnswerInput(-1)
            
        return AnswerInput(index=int(answer_index))