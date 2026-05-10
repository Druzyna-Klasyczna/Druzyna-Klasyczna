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

export type Card = QuestionCard | PowerUpCard | DebuffCard | EffectCard;
