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

let remoteCounter = 0;
const newRemoteQuestionCard = (
  pool: RemoteQuestion[],
  rng: () => number,
  idPrefix: string,
): QuestionCard => {
  const tpl = pool[Math.floor(rng() * pool.length)];
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
  remoteQuestions: RemoteQuestion[] = [],
): GamePlayer[] =>
  roomPlayers.map((rp) => ({
    id: rp.id,
    name: rp.name,
    avatarUrl: avatarUrl(rp.name || rp.id),
    isMe: rp.id === myId,
    hand: [
      ...Array.from({ length: STARTING_QUESTIONS }, () =>
        remoteQuestions.length > 0
          ? newRemoteQuestionCard(remoteQuestions, rng, `${rp.id}-`)
          : newQuestionCard(rng, `${rp.id}-`),
      ),
      newSupportCard(rng, `${rp.id}-`),
    ],
  }));

export const makeRemoteQuestionCard = (
  pool: RemoteQuestion[],
  rng: () => number,
  idPrefix: string,
): QuestionCard => newRemoteQuestionCard(pool, rng, idPrefix);
