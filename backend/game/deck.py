import random
from game_exceptions import DrawPileEmptyException

class Deck:
    def __init__(self, cards):
        self.cards = cards 
    
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
