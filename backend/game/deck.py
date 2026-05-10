import random
from game_exceptions import DrawPileEmptyException
from card import QuestionCard, PowerUpCard, EffectCard, DebuffCard
from card import PowerUpType, EffectType, DebuffType

class Deck:
    def __init__(self, cards):
        self.cards = cards 
    
    def _generate_mock_deck(self):
        cards = []
        
        questions = [
            QuestionCard("Jaki jest wynik działania 2 + 2 * 2?", ["8", "6", "4", "22"], 1),
            QuestionCard("Który język używa asyncio?", ["C++", "Java", "Python", "HTML"], 2),
            QuestionCard("Stolica Polski to:", ["Kraków", "Warszawa", "Poznań", "Gdańsk"], 1),
            QuestionCard("Jak nazywa się metoda wywoływana przy tworzeniu klasy w Pythonie?", ["__start__", "__init__", "__main__", "__create__"], 1)
        ]
        cards.extend(questions)
        
        for _ in range(4):
            cards.append(PowerUpCard(PowerUpType.SKIP))
            cards.append(PowerUpCard(PowerUpType.MIRROR))
            
        for _ in range(2):
            cards.append(EffectCard(EffectType.SHUFFLE_PLAYERS))
            cards.append(DebuffCard(DebuffType.DRAW_PENALTY))
            
        return cards * 3

    def push_card(self, card):
        self.cards.append(card)

    def pop_card(self):
        if len(self.cards) == 0:
            raise DrawPileEmptyException("pop from empty pile")
        return self.cards.pop()
    
    def is_empty(self):
        return len(self.cards) == 0

    def shuffle_cards(self):
        random.shuffle(self.cards)
