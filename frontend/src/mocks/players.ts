import type { GamePlayer } from "../types/game";
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

export const makeNetworkedPlayers = (
  roomPlayers: { id: string; name: string }[],
  myId: string,
  rng: () => number,
): GamePlayer[] =>
  roomPlayers.map((rp) => ({
    id: rp.id,
    name: rp.name,
    avatarUrl: avatarUrl(rp.name || rp.id),
    isMe: rp.id === myId,
    hand: [
      ...Array.from({ length: STARTING_QUESTIONS }, () => newQuestionCard(rng)),
      newSupportCard(rng),
    ],
  }));
