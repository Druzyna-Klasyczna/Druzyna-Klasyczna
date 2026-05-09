from abc import ABC, abstractmethod

class CardInput:
    def __init__(self, card_index=None):
        self.card_index = card_index

class AnswerInput:
    def __init__(self, answer_index=None):
        self.answer_index = answer_index

class GameInputProvider(ABC):
    @abstractmethod
    def get_action(self, player):
        pass

class ConsoleInputProvider(GameInputProvider):
    def get_action(self, player):
        card_index = input(f"Player {player.id}, choose a card index: ")
        if card_index == 'skip':
            return CardInput()
        return CardInput(int(card_index))
    
    def answer_question(self, question_card, player):
        print(f"Player {player.id}, answer the question: ")
        print(question_card.question)
        for i, answer in enumerate(question_card.answers, 1):
            print(f"{i}. {answer}")
        answer_index = input(">>> ")
        return AnswerInput(int(answer_index))

class WebsocketInputProvider(GameInputProvider):
    def get_action(self, player):
        pass