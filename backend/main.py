import db.database as db
import db.setup_questions
import db.show_all_questions
import sqlite3
from db.database import DB_NAME

def main():
    print("Hello from backend!")


if __name__ == "__main__":
    conn = sqlite3.connect(DB_NAME)

    add_quesitons = True
    if add_quesitons:
        db.setup_questions.add_decks(conn)
        db.setup_questions.add_questions_table(conn)
        db.setup_questions.add_deck_questions_table(conn)
        db.setup_questions.add_questions(conn)

    show_quesitons = True 
    if show_quesitons:
        db.show_all_questions.show()
