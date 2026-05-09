from enum import Enum
from abc import ABC, abstractmethod

class CardType(Enum):
    QUESTION = 1
    POWER_UP = 2
    DEBUFF = 3
    EFFECT = 4

class PowerUpType(Enum):
    MIRROR = 1
    SKIP = 2

class DebuffType(Enum):
    DRAW_PENALTY = 1
    GROUP_PRESSURE = 2

class EffectType(Enum):
    SHUFFLE_PLAYERS = 1
    COPY_DEBUFF = 2

class Card(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def get_card_type(self):
        pass

class PowerUpCard(Card):
    def __init__(self, powerup_type):
        self.powerup_type = powerup_type

    def get_card_type(self):
        return CardType.POWER_UP

class EffectCard(Card):
    def __init__(self, effect_type):
        self.effect_type = effect_type
    
    def get_card_type(self):
        return CardType.EFFECT

class DebuffCard(Card):
    def __init__(self, debuff_type):
        self.debuff_type = debuff_type
    
    def get_card_type(self):
        return CardType.DEBUFF

class QuestionCard(Card):
    def __init__(self, question, answers, correct):
        self.question = question
        self.answers = answers
        self.correct = correct
    
    def get_card_type(self):
        return CardType.QUESTION
    
    def validate_answer(self, submitted_answer):
        return submitted_answer == self.correct