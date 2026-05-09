from card import QuestionCard

class GamePlayer:
    def __init__(self, pid, config):
        self.cards = [QuestionCard("kto napisał 1984?", ['Fagata', 'George Orwell', 'Jan Kochanowski', 'Królowa Elżbieta'], 1)]
        self.id = pid
    
    def add_card(self, card):
        self.cards.append(card)
    
    def get_card(self, index):
        return self.cards[index]
    
    def remove_card(self, card):
        self.cards.remove(card)