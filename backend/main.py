import db.database as db
import db.setup_questions
import db.show_all_questions

def main():
    print("Hello from backend!")


if __name__ == "__main__":

    show_quesitons = True 
    if show_quesitons:
        db.show_all_questions.show()
    
    add_quesitons = False 
    if add_quesitons:
        db.setup_questions.add_questions()
