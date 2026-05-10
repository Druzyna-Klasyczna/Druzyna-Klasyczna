import { useEffect, useReducer, useRef } from "react";
import { WS_BASE_URL } from "../lib/config";
import { makeRng, seedFromString } from "../lib/rng";
import { newQuestionCard, newSupportCard } from "../mocks/cards";
import {
  burnFromDeck,
  drawQuestionFromDeck,
  makeNetworkedPlayers,
  makeQuestionDeck,
  type QuestionDeck,
  type RemoteQuestion,
} from "../mocks/players";
import type {
  Card,
  GameState,
  PowerUpCard,
  QuestionCard,
  SupportCard,
} from "../types/game";
import type { Action, GameActions } from "./useGameMock";
import { initialState, reducer } from "./useGameMock";

interface RoomInfo {
  event: "ROOM_INFO";
  players: { id: string; name: string }[];
  questions?: RemoteQuestion[];
}

const isRoomInfo = (msg: unknown): msg is RoomInfo =>
  !!msg &&
  typeof msg === "object" &&
  (msg as { event?: string }).event === "ROOM_INFO";

// How many question cards an action minted from the shared deck. Spectators
// must advance their local cursor by the same amount or they'll re-deal the
// same questions on their own turn.
const countQuestionDraws = (action: Action): number => {
  let n = 0;
  if (action.type === "ANSWER_QUESTION" || action.type === "TIMEOUT") {
    n += action.penaltyCards?.length ?? 0;
    n += (action.roleReversalCards ?? []).filter((c) => c.kind === "QUESTION")
      .length;
  }
  return n;
};

export const useNetworkedGame = (
  roomCode: string | null,
  playerId: string | null,
  myName: string,
) => {
  const [state, dispatch] = useReducer(reducer, myName, initialState);
  const ws = useRef<WebSocket | null>(null);
  const rng = useRef<() => number>(() => Math.random());
  const stateRef = useRef<GameState>(state);
  stateRef.current = state;
  const questionDeck = useRef<QuestionDeck | null>(null);

  useEffect(() => {
    if (!roomCode || !playerId) return;

    rng.current = makeRng(seedFromString(roomCode));

    const socket = new WebSocket(
      `${WS_BASE_URL}/ws/game/${roomCode}/${playerId}`,
    );
    ws.current = socket;

    socket.onmessage = (event) => {
      let msg: unknown;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      if (isRoomInfo(msg)) {
        const pool: RemoteQuestion[] = msg.questions ?? [];
        questionDeck.current =
          pool.length > 0 ? makeQuestionDeck(pool, rng.current) : null;
        const players = makeNetworkedPlayers(
          msg.players,
          playerId,
          rng.current,
          questionDeck.current,
        );
        dispatch({ type: "INIT_GAME", players });
        return;
      }
      // Remote action — dispatch locally without re-broadcasting.
      const remote = msg as Action;
      if (questionDeck.current) {
        const burns = countQuestionDraws(remote);
        if (burns > 0) burnFromDeck(questionDeck.current, burns, rng.current);
      }
      dispatch(remote);
    };

    socket.onclose = (e) => {
      console.info("[useNetworkedGame] closed", e.code, e.reason);
    };
    socket.onerror = (e) => {
      console.warn("[useNetworkedGame] error", e);
    };

    return () => {
      socket.close();
      ws.current = null;
    };
  }, [roomCode, playerId]);

  const sendAndDispatch = (action: Action) => {
    dispatch(action);
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(action));
    }
  };

  const findCard = (pid: string, cardId: string): Card | null => {
    const p = stateRef.current.players.find((pp) => pp.id === pid);
    return p?.hand.find((c) => c.id === cardId) ?? null;
  };

  const buildAnswerExtras = (correct: boolean) => {
    const s = stateRef.current;
    const pq = s.pendingQuestion;
    if (!pq) return {};
    const debuff = pq.attachedDebuff;
    const multiplier = debuff?.type === "DOUBLE_OR_NOTHING" ? 2 : 1;
    const roleReversal = debuff?.type === "ROLE_REVERSAL";
    const responder = s.players.find((p) => p.id === pq.toPlayerId);

    const idPrefix = `${playerId ?? "x"}-`;
    const mintQuestion = () =>
      questionDeck.current
        ? drawQuestionFromDeck(questionDeck.current, rng.current, idPrefix)
        : newQuestionCard(rng.current, idPrefix);

    if (correct) {
      const rewardCards: SupportCard[] = Array.from(
        { length: multiplier },
        () => newSupportCard(rng.current, idPrefix) as SupportCard,
      );
      let timeWarpDropId: string | undefined;
      if (debuff?.type === "TIME_WARP" && responder) {
        const questions = responder.hand.filter((c) => c.kind === "QUESTION");
        if (questions.length > 0) {
          timeWarpDropId =
            questions[Math.floor(rng.current() * questions.length)].id;
        }
      }
      const roleReversalCards: Card[] | undefined = roleReversal
        ? [newSupportCard(rng.current, idPrefix)]
        : undefined;
      return { rewardCards, timeWarpDropId, roleReversalCards };
    }

    const penaltyCards: QuestionCard[] = Array.from(
      { length: multiplier },
      () => mintQuestion(),
    );
    const roleReversalCards: Card[] | undefined = roleReversal
      ? [mintQuestion()]
      : undefined;
    return { penaltyCards, roleReversalCards };
  };

  const actions: GameActions = {
    answerQuestion: (idx) => {
      const pq = stateRef.current.pendingQuestion;
      const correct = !!pq && idx === pq.card.correctIndex;
      sendAndDispatch({
        type: "ANSWER_QUESTION",
        idx,
        ...buildAnswerExtras(correct),
      });
    },
    timeOut: () => {
      const extras = buildAnswerExtras(false);
      sendAndDispatch({
        type: "TIMEOUT",
        penaltyCards: extras.penaltyCards,
        roleReversalCards: extras.roleReversalCards,
      });
    },
    playPowerUp: (cardId) => {
      const s = stateRef.current;
      const cur = s.players[s.currentPlayerIdx];
      const card = cur ? findCard(cur.id, cardId) : null;
      let eliminate: number[] | undefined;
      if (
        card?.kind === "POWER_UP" &&
        (card as PowerUpCard).type === "FIFTY_FIFTY" &&
        s.pendingQuestion
      ) {
        const pq = s.pendingQuestion;
        const wrongIndices = pq.card.answers
          .map((_, i) => i)
          .filter((i) => i !== pq.card.correctIndex);
        // Deterministic shuffle via RNG
        const shuffled = [...wrongIndices].sort(() => rng.current() - 0.5);
        eliminate = shuffled.slice(
          0,
          Math.max(1, Math.floor(wrongIndices.length / 2)),
        );
      }
      sendAndDispatch({ type: "PLAY_POWERUP", cardId, eliminate });
    },
    playEffect: (cardId) => {
      const s = stateRef.current;
      const cur = s.players[s.currentPlayerIdx];
      const card = cur ? findCard(cur.id, cardId) : null;
      let newOrder: string[] | undefined;
      if (card?.kind === "EFFECT" && card.type === "SHUFFLE") {
        const ids = s.players.map((p) => p.id);
        newOrder = [...ids].sort(() => rng.current() - 0.5);
      }
      sendAndDispatch({ type: "PLAY_EFFECT", cardId, newOrder });
    },
    skipEffect: () => sendAndDispatch({ type: "SKIP_EFFECT" }),
    playQuestion: (cardId, targetId) =>
      sendAndDispatch({ type: "PLAY_QUESTION", cardId, targetId }),
    attachDebuff: (cardId) => sendAndDispatch({ type: "ATTACH_DEBUFF", cardId }),
    skipDebuff: () => sendAndDispatch({ type: "SKIP_DEBUFF" }),
    restart: () => sendAndDispatch({ type: "RESTART", myName }),
  };

  // Local-only timeout for "me" answering. The action that fires goes through
  // sendAndDispatch so other tabs see it too.
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
      actions.timeOut();
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
