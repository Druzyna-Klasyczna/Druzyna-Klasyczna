import type { GamePlayer } from "../types/game";
import { newQuestionCard, newSupportCard } from "./cards";

const BOT_NAMES = ["Bot Mateusz", "Bot Ania", "Bot Krzysiek"];

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

const STARTING_QUESTIONS = 5;

export const makeMockPlayers = (myName: string): GamePlayer[] => {
  const me: GamePlayer = {
    id: "me",
    name: myName || "Ty",
    avatarUrl: avatarUrl(myName || "Ty"),
    isMe: true,
    isBot: false,
    hand: [
      ...Array.from({ length: STARTING_QUESTIONS }, () => newQuestionCard()),
      newSupportCard(),
    ],
  };

  const bots: GamePlayer[] = BOT_NAMES.map((name, i) => ({
    id: `bot-${i + 1}`,
    name,
    avatarUrl: avatarUrl(name),
    isMe: false,
    isBot: true,
    hand: [
      ...Array.from({ length: STARTING_QUESTIONS }, () => newQuestionCard()),
      newSupportCard(),
    ],
  }));

  return [me, ...bots];
};
