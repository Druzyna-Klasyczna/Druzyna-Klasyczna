import random
from game_exceptions import DrawPileEmptyException

class Deck:
    def __init__(self):
        self.cards = [1,2,3,4]*10 # ! hardcoded for now

    def pop_card(self):
        if len(self.cards) == 0:
            raise DrawPileEmptyException("pop from empty pile")
        return self.cards.pop()

    def shuffle_cards(self):
        random.shuffle(self.cards)