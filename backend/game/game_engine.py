import asyncio
from player import GamePlayer
from deck import Deck
from input_provider import ConsoleInputProvider, WebsocketInputProvider
from card import QuestionCard, CardType, PowerUpType
from game_exceptions import WrongCardException
from event import GameEvent, EventType
from collections import deque

class GameEngine:
    def __init__(self, room):
        self.config = room.settings
        self.room_code = room.room_code
        self.lobby_manager = None

        self.players = [GamePlayer(pid, self.config) for pid in room.players.keys()]
        self.current_player = 0

        self.event_queue = deque([])

        self.draw_pile = self.get_deck(room)
        self.discard_pile = Deck()
        self.played_card = None

        self.input_provider = WebsocketInputProvider() 
    
    def get_deck(self, room):
        return Deck()

    async def run(self):
        self.init_game()

        while True:
            if not self.event_queue:
                await asyncio.sleep(0.1)
                continue
                
            event = self.event_queue.popleft()
            await self.process_event(event)

    def init_game(self):
        self.shuffle_cards()
        self.deal_cards()
        self.add_initial_events()
    
    def shuffle_cards(self):
        self.draw_pile.shuffle_cards()

    def deal_cards(self):
        initial_cards = getattr(self.config, 'initial_deal_cards', 6)
        
        for loop_index in range(initial_cards * len(self.players)):
            player_index = loop_index % len(self.players)
            player = self.players[player_index]
            player.add_card(self.draw_pile.pop_card())
    
    def add_initial_events(self):
        self.add_event(self.players[0], EventType.EFFECT)
        self.add_event(self.players[0], EventType.QUESTION)
        self.add_event(self.players[0], EventType.DEBUFF)
    
    def add_all_player_events(self, player):
        self.add_event(player, EventType.POWER_UP)
        self.add_event(player, EventType.ANSWER)
        self.add_event(player, EventType.EFFECT)
        self.add_event(player, EventType.QUESTION)
        self.add_event(player, EventType.DEBUFF)
    
    def add_event(self, player, event_type):
        self.event_queue.append(GameEvent(player=player, event_type=event_type))
    
    def add_event_to_start(self, player, event_type):
        self.event_queue.appendleft(GameEvent(player=player, event_type=event_type))
    
    async def process_event(self, event):
        if self.lobby_manager:
            await self.lobby_manager.broadcast_to_room(self.room_code, {
                "event": "GAME_UPDATE",
                "message": f"Gracz {event.player.id} wykonuje akcję {event.event_type.name}"
            })

        if event.event_type == EventType.POWER_UP:
            await self.process_powerup_event(event.player)
        elif event.event_type == EventType.ANSWER:
            await self.process_answer_event(event.player)
        elif event.event_type == EventType.EFFECT:
            await self.process_effect_event(event.player)
        elif event.event_type == EventType.QUESTION:
            await self.process_question_event(event.player)
        elif event.event_type == EventType.DEBUFF:
            await self.process_debuff_event(event.player)
            
        if not self.event_queue:
            self.next_turn()

    async def process_powerup_event(self, player):
        powerup_card = await self.get_player_card_from_input(player)
        if powerup_card is not None:
            self.process_powerup_card(powerup_card, player)
    
    def process_powerup_card(self, card, player):
        if card.get_card_type() != CardType.POWER_UP:
            raise WrongCardException("card should be of type: power-up")
        
        player.remove_card(card)

        if card.powerup_type == PowerUpType.SKIP:
            self.event_queue.clear()
            self.next_turn()
        elif card.powerup_type == PowerUpType.MIRROR:
            self.event_queue.popleft()
            prev_player = self.players[self.get_prev_player_index()]
            self.add_event_to_start(prev_player, EventType.ANSWER)
    
    async def process_answer_event(self, player):
        answer_input = await self.prompt_answer(player)
        answer_index = answer_input.index
        self.process_answer(answer_index, player)
        self.discard_pile.push_card(self.played_card)
        self.played_card = None
    
    async def prompt_answer(self, player):
        return await self.input_provider.get_answer_selection(self.played_card, player)
    
    def process_answer(self, answer_index, player):
        if self.played_card.validate_answer(answer_index):
            self.correct_answer(self.played_card, player)
        else:
            self.incorrect_answer(self.played_card, player)
    
    def correct_answer(self, card, player):
        pass

    def incorrect_answer(self, card, player):
        pass
    
    async def process_effect_event(self, player):
        effect_card = await self.get_player_card_from_input(player)
        if effect_card is not None:
            self.process_effect_card(effect_card, player)
    
    def process_effect_card(self, card, player):
        pass

    async def process_question_event(self, player):
        question_card = await self.get_player_card_from_input(player)
        if question_card is not None:
            self.process_question_card(question_card, player)
    
    def process_question_card(self, card, player):
        if card.get_card_type() != CardType.QUESTION:
            raise WrongCardException("card should be of type: question")
        
        self.played_card = card
        player.remove_card(card)
    
    async def process_debuff_event(self, player):
        debuff_card = await self.get_player_card_from_input(player)
        if debuff_card is not None:
            self.process_debuff_card(debuff_card, player)
        
        self.next_turn()
    
    def process_debuff_card(self, card, player):
        pass
    
    async def get_player_card_from_input(self, player):
        card_input = await self.input_provider.get_card_selection(player)
        card_index = card_input.index
        if card_index is None:
            return None
        card = player.get_card(card_index)
        return card
    
    def next_turn(self):
        self.current_player = self.get_next_player_index()
        self.add_all_player_events(self.players[self.current_player])
    
    def get_next_player_index(self):
        return (self.current_player + 1) % len(self.players)

    def get_prev_player_index(self):
        return (self.current_player - 1) % len(self.players)