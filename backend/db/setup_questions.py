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

        ("OOP important for?", "Games", "Enterprise apps", "Only AI", "Only CLI", "b"),

        ("OOP improves?", "Scalability", "Lag", "Ads", "Storage", "a"),

        ("OOP helps?", "Code organization", "Crashes", "Delays", "Viruses", "a"),

        ("Encapsulation bundles?", "Data+Methods", "Files", "Loops", "Threads", "a"),

        ("Private attribute symbol in Python?", "__", "//", "##", "@@", "a"),

        ("BankAccount balance is?", "Public", "Protected", "Private", "Static", "c"),

        ("Inheritance promotes?", "Duplication", "Reuse", "Deletion", "Encryption", "b"),

        ("Polymorphism means?", "One form", "Many forms", "No forms", "Static only", "b"),

        ("Pure virtual function?", "Abstract method", "Loop", "Constructor", "Array", "a"),

        ("Circle overrides?", "area()", "main()", "start()", "stop()", "a"),

        ("Abstraction hides?", "Implementation", "Variables", "Loops", "Classes", "a"),

        ("ABC in Python means?", "Abstract Base Class", "Array Base Code", "Auto Build Class", "App Byte Compiler", "a"),

        ("Vehicle class type?", "Abstract", "Final", "Static", "Private", "a"),

        ("Class is?", "Blueprint", "Object", "Memory", "Thread", "a"),

        ("Object is?", "Class instance", "Method", "Package", "Library", "a"),

        ("Employee('John') creates?", "Class", "Object", "Function", "Module", "b"),

        ("Overloading uses?", "Different params", "Different files", "Threads", "Packages", "a"),

        ("Overriding uses?", "Same method", "Same variable", "Arrays", "Pointers", "a"),

        ("Compile-time polymorphism?", "Overloading", "Overriding", "GC", "Reflection", "a"),

        ("Runtime polymorphism?", "Inheritance", "Overriding", "Compilation", "Parsing", "b"),

        ("Access modifiers control?", "Visibility", "RAM", "CPU", "Speed", "a"),

        ("Accessible everywhere?", "Private", "Protected", "Public", "Final", "c"),

        ("Only same class access?", "Protected", "Static", "Private", "Public", "c"),

        ("Diamond problem from?", "Multiple inheritance", "GC", "Loops", "Arrays", "a"),

        ("Diamond problem causes?", "Ambiguity", "Compilation", "Encryption", "Sorting", "a"),

        ("Interfaces define?", "Contract", "Database", "Compiler", "Cache", "a"),

        ("Interfaces help achieve?", "Loose coupling", "Lag", "Duplication", "Crashes", "a"),

        ("PaymentProcessor is?", "Interface", "Object", "Array", "Loop", "a"),

        ("Composition relation?", "HAS-A", "IS-A", "USES-A", "CALLS-A", "a"),

        ("Inheritance relation?", "HAS-A", "IS-A", "OWNS-A", "LINKS-A", "b"),

        ("Car HAS-A Engine means?", "Composition", "Inheritance", "Abstraction", "GC", "a"),

        ("SOLID has how many principles?", "3", "4", "5", "6", "c"),

        ("SRP full form?", "Single Responsibility Principle", "Simple Runtime Process", "Secure Resource Policy", "Static Rule Pattern", "a"),

        ("Single responsibility means?", "One reason to change", "One variable", "One method", "One loop", "a"),

        ("Open/Closed principle?", "Extend not modify", "Modify always", "Delete classes", "Avoid interfaces", "a"),

        ("LSP full form?", "Liskov Substitution Principle", "Local Static Process", "Linked Source Pattern", "Linear Storage Policy", "a"),

        ("ISP full form?", "Interface Segregation Principle", "Internal System Package", "Indexed Storage Process", "Integrated Source Policy", "a"),

        ("DIP full form?", "Dependency Inversion Principle", "Dynamic Interface Package", "Direct Injection Policy", "Default Integration Process", "a"),

        ("Design patterns are?", "Reusable solutions", "Errors", "Databases", "Loops", "a"),

        ("Singleton ensures?", "One instance", "Many threads", "Fast loops", "Two objects", "a"),

        ("Factory pattern creates?", "Objects", "RAM", "Threads", "Servers", "a"),

        ("Observer pattern defines?", "One-to-many dependency", "Compilation", "Encryption", "Sorting", "a"),

        ("Strategy pattern uses?", "Algorithms family", "Files", "Packages", "Pointers", "a"),

        ("Garbage collection manages?", "Memory", "Threads", "Database", "Graphics", "a"),

        ("Unreachable objects are?", "Removed", "Compiled", "Encrypted", "Cached", "a"),

        ("Java memory management?", "Automatic GC", "Manual only", "No memory", "Binary", "a"),

        ("C++ traditionally uses?", "Manual memory", "GC only", "Python GC", "Browser cache", "a"),

        ("Reflection works at?", "Runtime", "Compile time", "Install time", "Boot time", "a"),

        ("dir(obj) does?", "List attributes", "Delete object", "Compile class", "Encrypt file", "a"),

        ("hasattr checks?", "Attribute exists", "Memory size", "GC state", "Class type", "a"),

        ("getattr returns?", "Attribute value", "Thread", "Loop", "Package", "a"),

        ("Metaclass creates?", "Classes", "Loops", "Variables", "Arrays", "a"),

        ("Dependency Injection reduces?", "Tight coupling", "Memory", "Threads", "Files", "a"),

        ("Without DI causes?", "Tight coupling", "Abstraction", "GC", "Inheritance", "a"),

        ("Injected dependency passed by?", "Constructor", "Loop", "GC", "Compiler", "a"),

        ("Code maintainability improved by?", "OOP", "Binary", "HTML", "Assembly", "a"),

        ("Design patterns require?", "OOP knowledge", "No coding", "Only SQL", "Only CSS", "a"),

        ("OOP helps break?", "Complex problems", "Databases", "Servers", "Networks", "a"),

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

