class GameException(Exception):
    pass

class DrawPileEmptyException(GameException):
    pass

class WrongCardException(GameException):
    pass