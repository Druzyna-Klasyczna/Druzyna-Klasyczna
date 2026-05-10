import sqlite3

DB_NAME = "db/flashcards.db"


def dict_factory(cursor, row):
    """Helper to return rows as dictionaries."""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def fetch_all_questions(conn):
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Questions_abcd")
    return cursor.fetchall()

def fetch_all_decks(conn):
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM decks")
    return cursor.fetchall()

def fetch_deck_relations(conn):
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
    return cursor.fetchall()
