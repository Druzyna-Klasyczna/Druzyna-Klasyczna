from enum import Enum

class CardType(Enum):
    QUESTION = 1
    POWER_UP = 2
    DEBUFF = 3
    EFFECT = 4

class Card:
    def __init__(self):
        pass

    @abstractmethod
    def get_card_type(self):
        raise NotImplementedError("this card class shouldn't be used. use a more precise card type.")

class PowerUpCard(Card):
    def __init__(self):
        pass

class EffectCard(Card):
    def __init__(self):
        pass

class DebuffCard(Card):
    def __init__(self):
        pass

class QuestionCard(Card):
    def __init__(self):
        pass