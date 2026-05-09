from player import GamePlayer
from deck import Deck
from input_provider import ConsoleInputProvider
from card import QuestionCard, CardType, PowerUpType
from game_exceptions import WrongCardException

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

        self.players = [GamePlayer(pid, self.config) for pid, _ in enumerate(room.players)] # TODO: add players according to room from lobby
        self.current_player = 0

        self.draw_pile = self.get_deck(room)
        self.discard_pile = Deck() # for now, maybe separate class later?
        self.played_card = None

        self.input_provider = ConsoleInputProvider()
    
    def get_deck(self, room):
        # TODO: fetch deck from db
        return Deck()

    def run(self):
        self.init_game()

        for i, player in enumerate(self.players):
            self.current_player = i

            # question reponse 
            if self.played_card is not None:
                print("POWER-UP")
                powerup_card = self.get_player_card_from_input(player)
                if powerup_card is None:
                    answer_index = self.prompt_answer(player).answer_index
                    self.process_answer(answer_index, player)
                    self.discard_pile.push_card(self.played_card)
                    self.played_card = None
                else:
                    should_continue = self.process_powerup(powerup_card, player)
                    if should_continue:
                        continue

            print("EFFECT")
            effect_card = self.get_player_card_from_input(player)
            if effect_card is not None:
                self.process_effect(effect_card, player)

            print("QUESTION")
            question_card = self.get_player_card_from_input(player)
            self.process_question(question_card, player)

            print("DEBUFF")
            debuff_card = self.get_player_card_from_input(player)
            if debuff_card is not None:
                self.process_debuff(debuff_card, player)
            
            if not self.draw_pile.is_empty():
                drawn_card = self.draw_pile.pop_card()
                player.add_card(drawn_card)

    def init_game(self):
        self.shuffle_cards()
        self.deal_cards()
    
    def get_player_card_from_input(self, player):
        card_input = self.input_provider.get_action(player)
        card_index = card_input.card_index
        if card_index is None:
            return None
        card = player.get_card(card_index)
        return card
    
    def prompt_answer(self, player):
        return self.input_provider.answer_question(self.played_card, player)
    
    def process_answer(self, answer_index, player):
        if self.played_card.validate_answer(answer_index-1):
            self.correct_answer(self.played_card, player)
        else:
            self.incorrect_answer(self.played_card, player)
    
    def correct_answer(self, card, player):
        print("Correct!")

    def incorrect_answer(self, card, player):
        # kara 
        print("Incorrect!")
    
    def process_powerup(self, card, player):
        # ! DON'T USE THIS, IT'S INCOMPLETE
        if card.get_card_type() != CardType.POWER_UP:
            raise WrongCardException("card should be of type: power-up")
        
        player.remove_card(card)
    
    def process_effect(self, card, player):
        pass

    def process_question(self, card, player):
        if card.get_card_type() != CardType.QUESTION:
            raise WrongCardException("card should be of type: question")
        
        self.played_card = card
        player.remove_card(card)

    def process_debuff(self, card, player):
        pass
    
    def shuffle_cards(self):
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
    engine.run()
