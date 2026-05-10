import type { GamePlayer, QuestionCard } from "../types/game";
import { newQuestionCard, newSupportCard } from "./cards";

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

const STARTING_QUESTIONS = 5;

export const makeMockPlayers = (myName: string): GamePlayer[] => {
  const me: GamePlayer = {
    id: "me",
    name: myName || "Ty",
    avatarUrl: avatarUrl(myName || "Ty"),
    isMe: true,
    hand: [
      ...Array.from({ length: STARTING_QUESTIONS }, () => newQuestionCard()),
      newSupportCard(),
    ],
  };

  return [me];
};

export interface RemoteQuestion {
  question: string;
  answers: string[];
  correctIndex: number;
}

export interface QuestionDeck {
  order: RemoteQuestion[];
  cursor: number;
}

const shuffleWith = <T>(items: T[], rng: () => number): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const makeQuestionDeck = (
  pool: RemoteQuestion[],
  rng: () => number,
): QuestionDeck => ({ order: shuffleWith(pool, rng), cursor: 0 });

let remoteCounter = 0;

const drawNextTemplate = (
  deck: QuestionDeck,
  rng: () => number,
): RemoteQuestion => {
  if (deck.order.length === 0) throw new Error("Empty question deck");
  if (deck.cursor >= deck.order.length) {
    deck.order = shuffleWith(deck.order, rng);
    deck.cursor = 0;
  }
  return deck.order[deck.cursor++];
};

const newDeckQuestionCard = (
  deck: QuestionDeck,
  rng: () => number,
  idPrefix: string,
): QuestionCard => {
  const tpl = drawNextTemplate(deck, rng);
  return {
    id: `${idPrefix}rq-${++remoteCounter}`,
    kind: "QUESTION",
    question: tpl.question,
    answers: tpl.answers,
    correctIndex: tpl.correctIndex,
  };
};

export const makeNetworkedPlayers = (
  roomPlayers: { id: string; name: string }[],
  myId: string,
  rng: () => number,
  deck: QuestionDeck | null,
): GamePlayer[] =>
  roomPlayers.map((rp) => ({
    id: rp.id,
    name: rp.name,
    avatarUrl: avatarUrl(rp.name || rp.id),
    isMe: rp.id === myId,
    hand: [
      ...Array.from({ length: STARTING_QUESTIONS }, () =>
        deck ? newDeckQuestionCard(deck, rng, `${rp.id}-`) : newQuestionCard(rng, `${rp.id}-`),
      ),
      newSupportCard(rng, `${rp.id}-`),
    ],
  }));

export const drawQuestionFromDeck = (
  deck: QuestionDeck,
  rng: () => number,
  idPrefix: string,
): QuestionCard => newDeckQuestionCard(deck, rng, idPrefix);

export const burnFromDeck = (
  deck: QuestionDeck,
  count: number,
  rng: () => number,
): void => {
  for (let i = 0; i < count; i++) {
    if (deck.cursor >= deck.order.length) {
      deck.order = shuffleWith(deck.order, rng);
      deck.cursor = 0;
    }
    deck.cursor++;
  }
};
