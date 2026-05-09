from db.database import fetch_all_questions

def show():
    questions = fetch_all_questions()

    for q in questions:
        print(q)