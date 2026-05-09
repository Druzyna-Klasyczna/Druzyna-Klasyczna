from player import GamePlayer
from deck import Deck

class RoomSettingsMock:
    def __init__(self):
        self.deck_id = 1
        self.initial_deal_cards = 6

class RoomMock:
    def __init__(self):
        self.settings = RoomSettingsMock()
        self.players = [1,2,3,4]

class GameEngine:
    def __init__(self, room):
        self.config = room.settings
        self.players = [GamePlayer(self.config) for _ in room.players] # TODO: add players according to room from lobby
        self.draw_pile = self.get_deck(room)
        self.discard_pile = Deck() # for now, maybe separate class later?
    
    def get_deck(self, room):
        # TODO: fetch deck from db
        return Deck()

    def run(self):
        self.init_game()

        for player in self.players():
            pass # play card
    
    def init_game(self):
        self.shuffle_cards()
        self.deal_cards()
    
    def shuffle_cards():
        self.draw_pile.shuffle_cards()

    def deal_cards(self):
        for loop_index in range(self.config.initial_deal_cards * len(self.players)):
            player_index = loop_index % len(self.players)
            player = self.players[player_index]
            player.add_card(self.draw_pile.pop_card())

    def play_turn(self, player):
        pass


if __name__ == '__main__':
    room = RoomMock()
    engine = GameEngine(room)
    engine.init_game()
    for player in engine.players:
        print(player.cards)
