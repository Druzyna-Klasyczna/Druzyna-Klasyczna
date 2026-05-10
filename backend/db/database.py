from db.models import Question, Deck, DeckRelation
from typing import List

DB_NAME = "db/flashcards.db"


def dict_factory(cursor, row):
    """Helper to return rows as dictionaries."""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def fetch_all_questions(conn) -> List[Question]:
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Questions_abcd")
    rows = cursor.fetchall()
    # Convert list of dicts to list of Pydantic models
    return [Question(**row) for row in rows]

def fetch_all_decks(conn) -> List[Deck]:
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM decks")
    rows = cursor.fetchall()
    return [Deck(**row) for row in rows]

def fetch_deck_relations(conn) -> List[DeckRelation]:
    """Fetches the junction table, joining names for better debugging."""
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    query = """
    SELECT 
        dq.deck_id, 
        d.deck_name, 
        dq.question_id, 
        q.question
    FROM deck_questions dq
    JOIN decks d ON dq.deck_id = d.id
    JOIN Questions_abcd q ON dq.question_id = q.id
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    return [DeckRelation(**row) for row in rows]
