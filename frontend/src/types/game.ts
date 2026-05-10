export type CardKind = "QUESTION" | "POWER_UP" | "DEBUFF" | "EFFECT";

export type PowerUpType = "MIRROR" | "SKIP" | "FIFTY_FIFTY";
export type DebuffType = "DOUBLE_OR_NOTHING" | "ROLE_REVERSAL" | "TIME_WARP";
export type EffectType = "SHUFFLE" | "TAX" | "TIME_RUSH";

export interface QuestionCard {
  id: string;
  kind: "QUESTION";
  question: string;
  answers: string[];
  correctIndex: number;
}

export interface PowerUpCard {
  id: string;
  kind: "POWER_UP";
  type: PowerUpType;
  name: string;
  description: string;
}

export interface DebuffCard {
  id: string;
  kind: "DEBUFF";
  type: DebuffType;
  name: string;
  description: string;
}

export interface EffectCard {
  id: string;
  kind: "EFFECT";
  type: EffectType;
  name: string;
  description: string;
}

export type SupportCard = PowerUpCard | DebuffCard | EffectCard;
export type Card = QuestionCard | SupportCard;

export type TurnPhase =
  | "ANSWER"
  | "EFFECT"
  | "QUESTION"
  | "DEBUFF"
  | "RESULT";

export type Direction = 1 | -1;

export interface GamePlayer {
  id: string;
  name: string;
  avatarUrl?: string;
  hand: Card[];
  isMe: boolean;
  isBot: boolean;
}

export interface PendingQuestion {
  card: QuestionCard;
  fromPlayerId: string;
  toPlayerId: string;
  attachedDebuff: DebuffCard | null;
  startedAt: number;
  baseDurationMs: number;
  eliminatedAnswers: number[];
}

export interface GameEffectsState {
  timeRushTurnsLeft: number;
}

export interface GameState {
  players: GamePlayer[];
  currentPlayerIdx: number;
  direction: Direction;
  phase: TurnPhase;
  pendingQuestion: PendingQuestion | null;
  drawPileCount: number;
  log: string[];
  winnerId: string | null;
  effects: GameEffectsState;
  turnNumber: number;
}
