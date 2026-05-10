import type {
  DebuffCard,
  EffectCard,
  PowerUpCard,
  QuestionCard,
} from "../types/game";

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${++counter}`;

export const QUESTION_POOL: Omit<QuestionCard, "id">[] = [
  {
    kind: "QUESTION",
    question: "Stolica Polski to:",
    answers: ["Kraków", "Warszawa", "Wrocław", "Poznań"],
    correctIndex: 1,
  },
  {
    kind: "QUESTION",
    question: "Ile to 7 × 8?",
    answers: ["54", "56", "64", "49"],
    correctIndex: 1,
  },
  {
    kind: "QUESTION",
    question: "Autor 'Pana Tadeusza' to:",
    answers: ["Słowacki", "Mickiewicz", "Sienkiewicz", "Norwid"],
    correctIndex: 1,
  },
  {
    kind: "QUESTION",
    question: "Symbol chemiczny złota to:",
    answers: ["Au", "Ag", "Go", "Zl"],
    correctIndex: 0,
  },
  {
    kind: "QUESTION",
    question: "Najwyższy szczyt Polski to:",
    answers: ["Śnieżka", "Rysy", "Babia Góra", "Giewont"],
    correctIndex: 1,
  },
  {
    kind: "QUESTION",
    question: "W którym roku rozpoczęła się II wojna światowa?",
    answers: ["1914", "1939", "1945", "1918"],
    correctIndex: 1,
  },
  {
    kind: "QUESTION",
    question: "Planeta najbliższa Słońcu to:",
    answers: ["Wenus", "Ziemia", "Merkury", "Mars"],
    correctIndex: 2,
  },
  {
    kind: "QUESTION",
    question: "Ile boków ma sześciokąt?",
    answers: ["5", "6", "7", "8"],
    correctIndex: 1,
  },
  {
    kind: "QUESTION",
    question: "Język programowania stworzony przez Brendana Eicha to:",
    answers: ["Python", "Ruby", "JavaScript", "Java"],
    correctIndex: 2,
  },
  {
    kind: "QUESTION",
    question: "Pierwiastek o symbolu Fe to:",
    answers: ["Fluor", "Żelazo", "Fosfor", "Frans"],
    correctIndex: 1,
  },
  {
    kind: "QUESTION",
    question: "Stolica Japonii to:",
    answers: ["Kyoto", "Tokyo", "Osaka", "Seul"],
    correctIndex: 1,
  },
  {
    kind: "QUESTION",
    question: "Twórca teorii względności to:",
    answers: ["Newton", "Einstein", "Tesla", "Bohr"],
    correctIndex: 1,
  },
];

export const POWER_UP_POOL: Omit<PowerUpCard, "id">[] = [
  {
    kind: "POWER_UP",
    type: "MIRROR",
    name: "Mirror",
    description: "Pytanie wraca do osoby, która je zadała.",
  },
  {
    kind: "POWER_UP",
    type: "SKIP",
    name: "Skip",
    description: "Pytanie i kolejka przechodzą do następnego gracza.",
  },
  {
    kind: "POWER_UP",
    type: "FIFTY_FIFTY",
    name: "50/50",
    description: "Usuwana jest połowa błędnych odpowiedzi.",
  },
];

export const DEBUFF_POOL: Omit<DebuffCard, "id">[] = [
  {
    kind: "DEBUFF",
    type: "DOUBLE_OR_NOTHING",
    name: "Double or Nothing",
    description: "Dwa razy większa kara, dwa razy większa nagroda.",
  },
  {
    kind: "DEBUFF",
    type: "ROLE_REVERSAL",
    name: "Role Reversal",
    description: "Ciągniesz nagrodę lub karę razem z przeciwnikiem.",
  },
  {
    kind: "DEBUFF",
    type: "TIME_WARP",
    name: "Time Warp",
    description:
      "Przeciwnik ma o połowę krótszy czas, ale przy poprawnej odpowiedzi pozbywa się też losowej karty pytań.",
  },
];

export const EFFECT_POOL: Omit<EffectCard, "id">[] = [
  {
    kind: "EFFECT",
    type: "SHUFFLE",
    name: "Shuffle",
    description: "Pozycje graczy zostają wymieszane.",
  },
  {
    kind: "EFFECT",
    type: "TAX",
    name: "Tax",
    description: "Każdy gracz z 3+ kartami wsparcia oddaje je na stos.",
  },
  {
    kind: "EFFECT",
    type: "TIME_RUSH",
    name: "Time Rush",
    description: "Następna runda ma skrócony czas na odpowiedź.",
  },
];

export const SUPPORT_POOL: Omit<PowerUpCard | DebuffCard | EffectCard, "id">[] =
  [...POWER_UP_POOL, ...DEBUFF_POOL, ...EFFECT_POOL];

export const newQuestionCard = (rng: () => number = Math.random): QuestionCard => {
  const tpl = QUESTION_POOL[Math.floor(rng() * QUESTION_POOL.length)];
  return { ...tpl, id: nextId("q") };
};

export const newSupportCard = (rng: () => number = Math.random) => {
  const tpl = SUPPORT_POOL[Math.floor(rng() * SUPPORT_POOL.length)];
  return { ...tpl, id: nextId("s") } as PowerUpCard | DebuffCard | EffectCard;
};

export const newPowerUpCard = (rng: () => number = Math.random): PowerUpCard => {
  const tpl = POWER_UP_POOL[Math.floor(rng() * POWER_UP_POOL.length)];
  return { ...tpl, id: nextId("p") };
};
