from player import GamePlayer

class RoomSettingsMock:
    def __init__(self):
        self.deck_id

class RoomMock:
    def __init__(self):
        self.settings = RoomSettingsMock()
        self.players

class GameEngine:
    def __init__(self, room):
        self.config = room.settings
        self.players = [GamePlayer(self.config) for _ in range(len(room))] # TODO: add players according to room from lobby
        self.deck = self.get_deck(room)
    
    def get_deck(self, room):
        # TODO: fetch deck from db
        pass

    def run(self):
        self.init_game()

        for player in self.player_iterator():
            pass
    
    def init_game(self):
        self.shuffle_cards()
        self.deal_cards()
    
    def player_iterator(self):
        pass

    def play_turn(self, player):
        pass