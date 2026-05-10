import { useEffect, useReducer, useRef } from "react";
import { newQuestionCard, newSupportCard } from "../mocks/cards";
import { makeMockPlayers } from "../mocks/players";
import type {
  Card,
  DebuffCard,
  Direction,
  GamePlayer,
  GameState,
  PendingQuestion,
  PowerUpCard,
  QuestionCard,
} from "../types/game";

const BASE_TIMER_MS = 30000;
const BOT_DELAY = () => 900 + Math.random() * 900;

type Action =
  | { type: "ANSWER_QUESTION"; idx: number }
  | { type: "TIMEOUT" }
  | { type: "PLAY_POWERUP"; cardId: string }
  | { type: "PLAY_EFFECT"; cardId: string }
  | { type: "SKIP_EFFECT" }
  | { type: "PLAY_QUESTION"; cardId: string; targetId: string }
  | { type: "ATTACH_DEBUFF"; cardId: string }
  | { type: "SKIP_DEBUFF" }
  | { type: "RESTART"; myName: string };

const log = (state: GameState, msg: string): GameState => ({
  ...state,
  log: [...state.log, msg].slice(-20),
});

const indexById = (players: GamePlayer[], id: string) =>
  players.findIndex((p) => p.id === id);

export const nextPlayerIdx = (
  players: GamePlayer[],
  fromIdx: number,
  direction: Direction,
): number => (fromIdx + direction + players.length) % players.length;

const removeCard = (
  players: GamePlayer[],
  playerIdx: number,
  cardId: string,
): { players: GamePlayer[]; card: Card | null } => {
  const player = players[playerIdx];
  const card = player.hand.find((c) => c.id === cardId) ?? null;
  if (!card) return { players, card: null };
  const updated = players.map((p, i) =>
    i === playerIdx ? { ...p, hand: p.hand.filter((c) => c.id !== cardId) } : p,
  );
  return { players: updated, card };
};

const addCards = (
  players: GamePlayer[],
  playerIdx: number,
  cards: Card[],
): GamePlayer[] =>
  players.map((p, i) =>
    i === playerIdx ? { ...p, hand: [...p.hand, ...cards] } : p,
  );

const checkWinner = (players: GamePlayer[]): string | null => {
  const winner = players.find(
    (p) => p.hand.filter((c) => c.kind === "QUESTION").length === 0,
  );
  return winner?.id ?? null;
};

const baseDurationMs = (state: GameState, debuff: DebuffCard | null): number => {
  let base = BASE_TIMER_MS;
  if (state.effects.timeRushTurnsLeft > 0) base /= 2;
  if (debuff?.type === "TIME_WARP") base /= 2;
  return base;
};

const initialState = (myName: string): GameState => {
  const players = makeMockPlayers(myName);
  return {
    players,
    currentPlayerIdx: 0,
    direction: 1,
    phase: "EFFECT",
    pendingQuestion: null,
    drawPileCount: 60,
    log: ["Gra rozpoczęta!"],
    winnerId: null,
    effects: { timeRushTurnsLeft: 0 },
    turnNumber: 1,
  };
};

const advanceAfterAnswer = (state: GameState): GameState => {
  let next: GameState = { ...state, pendingQuestion: null, phase: "EFFECT" };
  if (next.effects.timeRushTurnsLeft > 0) {
    next = {
      ...next,
      effects: {
        ...next.effects,
        timeRushTurnsLeft: next.effects.timeRushTurnsLeft - 1,
      },
    };
  }
  return next;
};

const advanceTurn = (state: GameState): GameState => {
  const nextIdx = nextPlayerIdx(
    state.players,
    state.currentPlayerIdx,
    state.direction,
  );
  return {
    ...state,
    currentPlayerIdx: nextIdx,
    phase: state.pendingQuestion ? "ANSWER" : "EFFECT",
    turnNumber: state.turnNumber + 1,
  };
};

const winnerOrSame = (state: GameState): GameState => {
  const winnerId = checkWinner(state.players);
  if (winnerId && state.winnerId === null) {
    return {
      ...log(state, `🏆 ${state.players.find((p) => p.id === winnerId)?.name} wygrał!`),
      phase: "RESULT",
      winnerId,
    };
  }
  return state;
};

const reducer = (state: GameState, action: Action): GameState => {
  if (state.phase === "RESULT" && action.type !== "RESTART") return state;

  switch (action.type) {
    case "RESTART":
      return initialState(action.myName);

    case "ANSWER_QUESTION":
    case "TIMEOUT": {
      if (!state.pendingQuestion) return state;
      const pq = state.pendingQuestion;
      const responderIdx = indexById(state.players, pq.toPlayerId);
      const askerIdx = indexById(state.players, pq.fromPlayerId);
      if (responderIdx < 0 || askerIdx < 0) return state;

      const correct =
        action.type === "ANSWER_QUESTION" && action.idx === pq.card.correctIndex;
      const debuff = pq.attachedDebuff;
      const multiplier = debuff?.type === "DOUBLE_OR_NOTHING" ? 2 : 1;
      const roleReversal = debuff?.type === "ROLE_REVERSAL";

      let players = state.players;
      const responderName = players[responderIdx].name;

      if (correct) {
        const rewards: Card[] = Array.from({ length: multiplier }, () =>
          newSupportCard(),
        );
        players = addCards(players, responderIdx, rewards);
        if (debuff?.type === "TIME_WARP") {
          const responder = players[responderIdx];
          const questions = responder.hand.filter((c) => c.kind === "QUESTION");
          if (questions.length > 0) {
            const drop = questions[Math.floor(Math.random() * questions.length)];
            players = players.map((p, i) =>
              i === responderIdx
                ? { ...p, hand: p.hand.filter((c) => c.id !== drop.id) }
                : p,
            );
          }
        }
        if (roleReversal) {
          players = addCards(players, askerIdx, [newSupportCard()]);
        }
      } else {
        const penalty: QuestionCard[] = Array.from(
          { length: multiplier },
          () => newQuestionCard(),
        );
        players = addCards(players, responderIdx, penalty);
        if (roleReversal) {
          players = addCards(players, askerIdx, [newQuestionCard()]);
        }
      }

      const phrase =
        action.type === "TIMEOUT"
          ? `${responderName} nie zdążył odpowiedzieć!`
          : correct
            ? `${responderName} odpowiedział poprawnie ✓`
            : `${responderName} odpowiedział błędnie ✗`;

      const next = log(
        { ...state, players },
        phrase,
      );
      const cleared = advanceAfterAnswer(next);
      return winnerOrSame(cleared);
    }

    case "PLAY_POWERUP": {
      if (state.phase !== "ANSWER" || !state.pendingQuestion) return state;
      const playerIdx = state.currentPlayerIdx;
      const removed = removeCard(state.players, playerIdx, action.cardId);
      const card = removed.card;
      if (!card || card.kind !== "POWER_UP") return state;
      const power = card as PowerUpCard;
      const pq = state.pendingQuestion;
      const askerIdx = indexById(removed.players, pq.fromPlayerId);

      let next: GameState = { ...state, players: removed.players };
      next = log(
        next,
        `${state.players[playerIdx].name} zagrał ${power.name}!`,
      );

      if (power.type === "MIRROR") {
        const newResponderIdx = askerIdx;
        const newPq: PendingQuestion = {
          ...pq,
          fromPlayerId: pq.toPlayerId,
          toPlayerId: pq.fromPlayerId,
          attachedDebuff: null,
          eliminatedAnswers: [],
          startedAt: Date.now(),
          baseDurationMs: BASE_TIMER_MS,
        };
        return {
          ...next,
          pendingQuestion: newPq,
          currentPlayerIdx: newResponderIdx,
          phase: "ANSWER",
        };
      }

      if (power.type === "SKIP") {
        const skippedToIdx = nextPlayerIdx(
          next.players,
          playerIdx,
          state.direction,
        );
        const newPq: PendingQuestion = {
          ...pq,
          toPlayerId: next.players[skippedToIdx].id,
          startedAt: Date.now(),
          baseDurationMs: baseDurationMs(next, pq.attachedDebuff),
        };
        return {
          ...next,
          pendingQuestion: newPq,
          currentPlayerIdx: skippedToIdx,
          phase: "ANSWER",
        };
      }

      if (power.type === "FIFTY_FIFTY") {
        const wrongIndices = pq.card.answers
          .map((_, i) => i)
          .filter((i) => i !== pq.card.correctIndex);
        const eliminate = wrongIndices
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.max(1, Math.floor(wrongIndices.length / 2)));
        return {
          ...next,
          pendingQuestion: { ...pq, eliminatedAnswers: eliminate },
        };
      }

      return next;
    }

    case "PLAY_EFFECT": {
      if (state.phase !== "EFFECT") return state;
      const playerIdx = state.currentPlayerIdx;
      const removed = removeCard(state.players, playerIdx, action.cardId);
      const card = removed.card;
      if (!card || card.kind !== "EFFECT") return state;

      let players = removed.players;
      let direction = state.direction;
      let effects = state.effects;
      let currentPlayerIdx = playerIdx;

      if (card.type === "SHUFFLE") {
        const currentId = players[playerIdx].id;
        const shuffled = [...players].sort(() => Math.random() - 0.5);
        players = shuffled;
        currentPlayerIdx = indexById(shuffled, currentId);
      } else if (card.type === "TAX") {
        players = players.map((p) => {
          const support = p.hand.filter((c) => c.kind !== "QUESTION");
          if (support.length >= 3) {
            return { ...p, hand: p.hand.filter((c) => c.kind === "QUESTION") };
          }
          return p;
        });
      } else if (card.type === "TIME_RUSH") {
        effects = { ...effects, timeRushTurnsLeft: players.length };
      }

      const reversed = false;
      direction = reversed ? ((-direction) as Direction) : direction;

      const next = log(
        { ...state, players, direction, effects, currentPlayerIdx },
        `${state.players[playerIdx].name} zagrał efekt ${card.name}.`,
      );
      return { ...next, phase: "QUESTION" };
    }

    case "SKIP_EFFECT":
      if (state.phase !== "EFFECT") return state;
      return { ...state, phase: "QUESTION" };

    case "PLAY_QUESTION": {
      if (state.phase !== "QUESTION") return state;
      const playerIdx = state.currentPlayerIdx;
      const removed = removeCard(state.players, playerIdx, action.cardId);
      const card = removed.card;
      if (!card || card.kind !== "QUESTION") return state;
      const targetIdx = indexById(removed.players, action.targetId);
      if (targetIdx < 0) return state;

      const pq: PendingQuestion = {
        card,
        fromPlayerId: removed.players[playerIdx].id,
        toPlayerId: removed.players[targetIdx].id,
        attachedDebuff: null,
        startedAt: Date.now(),
        baseDurationMs: baseDurationMs(state, null),
        eliminatedAnswers: [],
      };

      const next = log(
        { ...state, players: removed.players, pendingQuestion: pq },
        `${removed.players[playerIdx].name} pyta ${removed.players[targetIdx].name}.`,
      );
      const checked = winnerOrSame(next);
      if (checked.phase === "RESULT") return checked;
      return { ...next, phase: "DEBUFF" };
    }

    case "ATTACH_DEBUFF": {
      if (state.phase !== "DEBUFF" || !state.pendingQuestion) return state;
      const playerIdx = state.currentPlayerIdx;
      const removed = removeCard(state.players, playerIdx, action.cardId);
      const card = removed.card;
      if (!card || card.kind !== "DEBUFF") return state;

      const pq: PendingQuestion = {
        ...state.pendingQuestion,
        attachedDebuff: card,
        baseDurationMs: baseDurationMs(state, card),
        startedAt: Date.now(),
      };

      const next = log(
        { ...state, players: removed.players, pendingQuestion: pq },
        `${state.players[playerIdx].name} nakłada debuff ${card.name}.`,
      );
      return advanceTurn(next);
    }

    case "SKIP_DEBUFF":
      if (state.phase !== "DEBUFF") return state;
      return advanceTurn(state);
  }
};

export interface GameActions {
  answerQuestion: (idx: number) => void;
  timeOut: () => void;
  playPowerUp: (cardId: string) => void;
  playEffect: (cardId: string) => void;
  skipEffect: () => void;
  playQuestion: (cardId: string, targetId: string) => void;
  attachDebuff: (cardId: string) => void;
  skipDebuff: () => void;
  restart: () => void;
}

export const useGameMock = (myName: string) => {
  const [state, dispatch] = useReducer(reducer, myName, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const actions: GameActions = {
    answerQuestion: (idx) => dispatch({ type: "ANSWER_QUESTION", idx }),
    timeOut: () => dispatch({ type: "TIMEOUT" }),
    playPowerUp: (cardId) => dispatch({ type: "PLAY_POWERUP", cardId }),
    playEffect: (cardId) => dispatch({ type: "PLAY_EFFECT", cardId }),
    skipEffect: () => dispatch({ type: "SKIP_EFFECT" }),
    playQuestion: (cardId, targetId) =>
      dispatch({ type: "PLAY_QUESTION", cardId, targetId }),
    attachDebuff: (cardId) => dispatch({ type: "ATTACH_DEBUFF", cardId }),
    skipDebuff: () => dispatch({ type: "SKIP_DEBUFF" }),
    restart: () => dispatch({ type: "RESTART", myName }),
  };

  // Bot driver
  useEffect(() => {
    if (state.phase === "RESULT") return;
    const current = state.players[state.currentPlayerIdx];
    if (!current?.isBot) return;

    const timeoutId = window.setTimeout(() => {
      const s = stateRef.current;
      if (s.phase === "RESULT") return;
      const cur = s.players[s.currentPlayerIdx];
      if (!cur?.isBot) return;

      switch (s.phase) {
        case "ANSWER": {
          if (!s.pendingQuestion) return;
          const powerUps = cur.hand.filter(
            (c) => c.kind === "POWER_UP",
          ) as PowerUpCard[];
          if (powerUps.length > 0 && Math.random() < 0.15) {
            actions.playPowerUp(powerUps[0].id);
            return;
          }
          const correctChance = 0.7;
          const idx =
            Math.random() < correctChance
              ? s.pendingQuestion.card.correctIndex
              : Math.floor(Math.random() * s.pendingQuestion.card.answers.length);
          actions.answerQuestion(idx);
          return;
        }
        case "EFFECT": {
          const effects = cur.hand.filter((c) => c.kind === "EFFECT");
          if (effects.length > 0 && Math.random() < 0.3) {
            actions.playEffect(effects[0].id);
            return;
          }
          actions.skipEffect();
          return;
        }
        case "QUESTION": {
          const questions = cur.hand.filter((c) => c.kind === "QUESTION");
          if (questions.length === 0) return;
          const target = nextPlayerIdx(
            s.players,
            s.currentPlayerIdx,
            s.direction,
          );
          const card = questions[Math.floor(Math.random() * questions.length)];
          actions.playQuestion(card.id, s.players[target].id);
          return;
        }
        case "DEBUFF": {
          const debuffs = cur.hand.filter((c) => c.kind === "DEBUFF");
          if (debuffs.length > 0 && Math.random() < 0.3) {
            actions.attachDebuff(debuffs[0].id);
            return;
          }
          actions.skipDebuff();
          return;
        }
      }
    }, BOT_DELAY());

    return () => window.clearTimeout(timeoutId);
    // actions are stable via dispatch; we only depend on key state slices
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.currentPlayerIdx, state.turnNumber, state.pendingQuestion?.card.id]);

  // Human timeout (when it's "me" answering and the timer expires)
  useEffect(() => {
    if (state.phase !== "ANSWER") return;
    const cur = state.players[state.currentPlayerIdx];
    if (!cur?.isMe || !state.pendingQuestion) return;

    const elapsed = Date.now() - state.pendingQuestion.startedAt;
    const remaining = Math.max(
      0,
      state.pendingQuestion.baseDurationMs - elapsed,
    );

    const id = window.setTimeout(() => {
      dispatch({ type: "TIMEOUT" });
    }, remaining);

    return () => window.clearTimeout(id);
  }, [
    state.phase,
    state.currentPlayerIdx,
    state.pendingQuestion?.startedAt,
    state.pendingQuestion?.baseDurationMs,
    state.players,
  ]);

  return { state, actions };
};
