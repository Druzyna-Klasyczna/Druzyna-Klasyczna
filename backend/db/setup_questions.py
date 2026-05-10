def add_decks(conn):
    """Create decks table if it doesn't exist."""
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS decks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deck_name TEXT NOT NULL
    );
    """)
    conn.commit()
    print("Decks table ready.")


def add_deck_questions_table(conn):
    """Create junction table for deck-question relations."""
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS deck_questions (
        deck_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        PRIMARY KEY (deck_id, question_id),
        FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES Questions_abcd(id) ON DELETE CASCADE
    );
    """)
    conn.commit()
    print("Deck-questions table ready.")

def add_questions_table(conn):
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Questions_abcd (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT,
        a TEXT,
        b TEXT,
        c TEXT,
        d TEXT,
        proper_answer TEXT
    );
    """)


def add_questions(conn):
    cursor = conn.cursor()

    questions = [

        ("Do czego ważne jest OOP?", "Gier", "Aplikacji firmowych", "Tylko AI", "Tylko CLI", "b"),

        ("OOP poprawia?", "Skalowalność", "Lagi", "Reklamy", "Pamięć", "a"),

        ("OOP pomaga w?", "Organizacji kodu", "Awariach", "Opóźnieniach", "Wirusach", "a"),

        ("Hermetyzacja łączy?", "Dane + metody", "Pliki", "Pętle", "Wątki", "a"),

        ("Symbol prywatnego atrybutu w Pythonie?", "__", "//", "##", "@@", "a"),

        ("Pole BankAccount.balance jest?", "Publiczne", "Chronione", "Prywatne", "Statyczne", "c"),

        ("Dziedziczenie sprzyja?", "Duplikacji", "Reużyciu kodu", "Usuwaniu", "Szyfrowaniu", "b"),

        ("Polimorfizm oznacza?", "Jedna forma", "Wiele form", "Brak form", "Tylko statyczna", "b"),

        ("Czysta funkcja wirtualna to?", "Metoda abstrakcyjna", "Pętla", "Konstruktor", "Tablica", "a"),

        ("Klasa Circle nadpisuje?", "area()", "main()", "start()", "stop()", "a"),

        ("Abstrakcja ukrywa?", "Implementację", "Zmienne", "Pętle", "Klasy", "a"),

        ("ABC w Pythonie znaczy?", "Abstract Base Class", "Array Base Code", "Auto Build Class", "App Byte Compiler", "a"),

        ("Typ klasy Vehicle?", "Abstrakcyjna", "Final", "Statyczna", "Prywatna", "a"),

        ("Klasa to?", "Schemat (blueprint)", "Obiekt", "Pamięć", "Wątek", "a"),

        ("Obiekt to?", "Instancja klasy", "Metoda", "Pakiet", "Biblioteka", "a"),

        ("Employee('John') tworzy?", "Klasę", "Obiekt", "Funkcję", "Moduł", "b"),

        ("Przeciążenie używa?", "Różnych parametrów", "Różnych plików", "Wątków", "Pakietów", "a"),

        ("Nadpisywanie używa?", "Tej samej metody", "Tej samej zmiennej", "Tablic", "Wskaźników", "a"),

        ("Polimorfizm na etapie kompilacji?", "Przeciążanie", "Nadpisywanie", "GC", "Refleksja", "a"),

        ("Polimorfizm w czasie wykonania?", "Dziedziczenie", "Nadpisywanie", "Kompilacja", "Parsowanie", "b"),

        ("Modyfikatory dostępu kontrolują?", "Widoczność", "RAM", "CPU", "Szybkość", "a"),

        ("Dostępne wszędzie?", "Private", "Protected", "Public", "Final", "c"),

        ("Tylko ta sama klasa ma dostęp?", "Protected", "Static", "Private", "Public", "c"),

        ("Problem diamentu wynika z?", "Wielokrotnego dziedziczenia", "GC", "Pętli", "Tablic", "a"),

        ("Problem diamentu powoduje?", "Niejednoznaczność", "Kompilację", "Szyfrowanie", "Sortowanie", "a"),

        ("Interfejsy definiują?", "Kontrakt", "Bazę danych", "Kompilator", "Cache", "a"),

        ("Interfejsy pomagają osiągnąć?", "Luźne powiązania", "Lagi", "Duplikację", "Awarie", "a"),

        ("PaymentProcessor to?", "Interfejs", "Obiekt", "Tablica", "Pętla", "a"),

        ("Relacja w kompozycji?", "HAS-A", "IS-A", "USES-A", "CALLS-A", "a"),

        ("Relacja w dziedziczeniu?", "HAS-A", "IS-A", "OWNS-A", "LINKS-A", "b"),

        ("Car HAS-A Engine to?", "Kompozycja", "Dziedziczenie", "Abstrakcja", "GC", "a"),

        ("Ile zasad ma SOLID?", "3", "4", "5", "6", "c"),

        ("Rozwinięcie SRP?", "Single Responsibility Principle", "Simple Runtime Process", "Secure Resource Policy", "Static Rule Pattern", "a"),

        ("Pojedyncza odpowiedzialność znaczy?", "Jeden powód do zmiany", "Jedna zmienna", "Jedna metoda", "Jedna pętla", "a"),

        ("Zasada otwarte/zamknięte?", "Rozszerzaj, nie modyfikuj", "Zawsze modyfikuj", "Usuwaj klasy", "Unikaj interfejsów", "a"),

        ("Rozwinięcie LSP?", "Liskov Substitution Principle", "Local Static Process", "Linked Source Pattern", "Linear Storage Policy", "a"),

        ("Rozwinięcie ISP?", "Interface Segregation Principle", "Internal System Package", "Indexed Storage Process", "Integrated Source Policy", "a"),

        ("Rozwinięcie DIP?", "Dependency Inversion Principle", "Dynamic Interface Package", "Direct Injection Policy", "Default Integration Process", "a"),

        ("Wzorce projektowe to?", "Powtarzalne rozwiązania", "Błędy", "Bazy danych", "Pętle", "a"),

        ("Singleton zapewnia?", "Jedną instancję", "Wiele wątków", "Szybkie pętle", "Dwa obiekty", "a"),

        ("Wzorzec Factory tworzy?", "Obiekty", "RAM", "Wątki", "Serwery", "a"),

        ("Wzorzec Observer definiuje?", "Zależność jeden-do-wielu", "Kompilację", "Szyfrowanie", "Sortowanie", "a"),

        ("Wzorzec Strategy używa?", "Rodziny algorytmów", "Plików", "Pakietów", "Wskaźników", "a"),

        ("Garbage collection zarządza?", "Pamięcią", "Wątkami", "Bazą danych", "Grafiką", "a"),

        ("Nieosiągalne obiekty są?", "Usuwane", "Kompilowane", "Szyfrowane", "Cache'owane", "a"),

        ("Zarządzanie pamięcią w Javie?", "Automatyczny GC", "Tylko ręczne", "Brak pamięci", "Binarne", "a"),

        ("C++ tradycyjnie używa?", "Ręcznej pamięci", "Tylko GC", "Pythonowego GC", "Cache przeglądarki", "a"),

        ("Refleksja działa w?", "Czasie wykonania", "Czasie kompilacji", "Czasie instalacji", "Czasie startu", "a"),

        ("dir(obj) robi co?", "Listuje atrybuty", "Usuwa obiekt", "Kompiluje klasę", "Szyfruje plik", "a"),

        ("hasattr sprawdza?", "Czy atrybut istnieje", "Rozmiar pamięci", "Stan GC", "Typ klasy", "a"),

        ("getattr zwraca?", "Wartość atrybutu", "Wątek", "Pętlę", "Pakiet", "a"),

        ("Metaklasa tworzy?", "Klasy", "Pętle", "Zmienne", "Tablice", "a"),

        ("Dependency Injection redukuje?", "Silne powiązania", "Pamięć", "Wątki", "Pliki", "a"),

        ("Brak DI powoduje?", "Silne powiązania", "Abstrakcję", "GC", "Dziedziczenie", "a"),

        ("Wstrzyknięta zależność jest podawana przez?", "Konstruktor", "Pętlę", "GC", "Kompilator", "a"),

        ("Łatwość utrzymania kodu poprawia?", "OOP", "Binarka", "HTML", "Assembler", "a"),

        ("Wzorce projektowe wymagają?", "Znajomości OOP", "Braku kodowania", "Tylko SQL", "Tylko CSS", "a"),

        ("OOP pomaga rozbić?", "Złożone problemy", "Bazy danych", "Serwery", "Sieci", "a"),

    ]

    question_ids = []
    for q in questions:
        cursor.execute("""
            INSERT INTO Questions_abcd (question, a, b, c, d, proper_answer)
            VALUES (?, ?, ?, ?, ?, ?)
        """, q)
        question_ids.append(cursor.lastrowid) # Captures the real ID from the DB

    deck_names = ["OOP Basics", "Inheritance & Polymorphism", "Advanced OOP & Design Patterns"]
    for name in deck_names:
        cursor.execute("INSERT INTO decks (deck_name) VALUES (?)", (name,))

    cursor.execute("SELECT id, deck_name FROM decks")
    deck_id_map = {name: did for did, name in cursor.fetchall()}

    decks_config = {
        "OOP Basics": [0, 1, 2, 10, 13, 14, 15, 20, 21, 22, 55, 57], # Using indices
        "Inheritance & Polymorphism": [6, 7, 8, 9, 16, 17, 18, 19, 23, 24, 28, 29, 30],
        "Advanced OOP & Design Patterns": list(range(3, 6)) + [11, 12] + list(range(25, 28)) + list(range(31, 55)) + [56]
    }

    deck_question_links = []
    for deck_name, indices in decks_config.items():
        deck_id = deck_id_map[deck_name]
        for idx in indices:
            if idx < len(question_ids): # Safety check
                deck_question_links.append((deck_id, question_ids[idx]))

    cursor.executemany("""
        INSERT INTO deck_questions (deck_id, question_id)
        VALUES (?, ?)
    """, deck_question_links)

    conn.commit()
    print("Database populated successfully.")

