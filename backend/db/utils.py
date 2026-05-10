import random
from typing import List, Tuple
import db.database as db # Assuming your previous fetch functions are here
from game.card import QuestionCard

def get_question_cards_from_random_deck(conn) -> Tuple[int, List[QuestionCard]]:
    # 1. Fetch all decks and pick one randomly
    all_decks = db.fetch_all_decks(conn)
    if not all_decks:
        raise ValueError("No decks found in the database.")
    
    selected_deck = random.choice(all_decks)
    
    # 2. Fetch all relations and filter for our specific deck
    # (Alternatively, you could write a specific SQL query for this,
    # but using your existing fetcher:)
    all_relations = db.fetch_deck_relations(conn)
    
    # Filter relations to find question IDs belonging to our deck
    target_question_ids = [
        rel.question_id for rel in all_relations 
        if rel.deck_id == selected_deck.id
    ]
    
    # 3. Fetch all questions and pick the ones that match our IDs
    all_questions = db.fetch_all_questions(conn)
    
    deck_cards = []
    for q in all_questions:
        if q.id in target_question_ids:
            # Map the Pydantic 'Question' model to your 'QuestionCard' class
            card = QuestionCard(
                question=q.question,
                answers=[q.a, q.b, q.c, q.d],
                correct=q.proper_answer
            )
            deck_cards.append(card)
            
    return selected_deck.id, deck_cards
