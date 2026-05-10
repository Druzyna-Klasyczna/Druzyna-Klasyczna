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
    def get_card_selection(self, player):
        pass

    @abstractmethod
    def get_answer_selection(self, question_card, player, answer_time):
        pass

class ConsoleInputProvider(GameInputProvider):
    def get_card_selection(self, player):
        card_index = input(f"Player {player.id}, choose a card index: ")
        if card_index == 'skip':
            return CardInput()
        return CardInput(index=int(card_index)-1)
    
    def get_answer_selection(self, question_card, player, answer_time):
        print(f"Player {player.id}, answer the question: ")
        print(question_card.question)
        for i, answer in enumerate(question_card.answers, 1):
            print(f"{i}. {answer}")
        answer_index = input(">>> ")
        return AnswerInput(index=int(answer_index))

class WebsocketInputProvider(GameInputProvider):
    def get_card_selection(self, player):
        pass

    def get_answer_selection(self, question_card, player, answer_time):
        pass