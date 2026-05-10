from pydantic import BaseModel
from typing import List, Optional

class Question(BaseModel):
    id: int
    question: Optional[str]
    a: Optional[str]
    b: Optional[str]
    c: Optional[str]
    d: Optional[str]
    proper_answer: Optional[str]

class Deck(BaseModel):
    id: int
    deck_name: str

class DeckRelation(BaseModel):
    deck_id: int
    deck_name: str
    question_id: int
    question: str
