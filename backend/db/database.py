import sqlite3

DB_NAME = "db/flashcards.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


def fetch_all_questions():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Questions_abcd")

    questions = cursor.fetchall()

    conn.close()

    return questions