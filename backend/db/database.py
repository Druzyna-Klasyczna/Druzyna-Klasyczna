import sqlite3

DB_NAME = "db/flashcards.db"


def fetch_all_questions():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Questions_abcd")

    questions = cursor.fetchall()

    conn.close()

    return questions
