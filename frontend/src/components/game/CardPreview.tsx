import { useEffect, useState } from "react";
import type { Card, GameState } from "../../types/game";
import { TactileContainer } from "../TactileContainer";
import { CardArt } from "./CardArt";

interface CardPreviewProps {
  state: GameState;
  hoveredCard: Card | null;
  onAnswer: (idx: number) => void;
}

const useCountdown = (startedAt: number, durationMs: number) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, []);
  const remaining = Math.max(0, startedAt + durationMs - now);
  return { remaining, total: durationMs };
};

const AnswerPanel = ({
  state,
  onAnswer,
}: {
  state: GameState;
  onAnswer: (idx: number) => void;
}) => {
  const pq = state.pendingQuestion!;
  const { remaining, total } = useCountdown(pq.startedAt, pq.baseDurationMs);
  const seconds = Math.ceil(remaining / 1000);
  const pct = Math.max(0, (remaining / total) * 100);

  return (
    <div className="flex h-full w-full flex-col gap-3">
      {pq.attachedDebuff && (
        <div className="border-2 border-black bg-rose-400 px-2 py-1 text-center text-[11px] font-black uppercase">
          Debuff: {pq.attachedDebuff.name}
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="border-2 border-black bg-black px-2 py-1 font-mono text-sm font-black text-yellow-400">
          {seconds}s
        </span>
        <div className="h-3 flex-1 border-2 border-black bg-white">
          <div
            className="h-full bg-yellow-400 transition-all duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="border-[3px] border-black bg-yellow-300 p-3 text-center text-base font-black uppercase text-black">
        {pq.card.question}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {pq.card.answers.map((answer, idx) => {
          const eliminated = pq.eliminatedAnswers.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              disabled={eliminated || remaining <= 0}
              onClick={() => onAnswer(idx)}
              className={`flex items-center gap-3 border-[3px] border-black px-3 py-2 text-left text-sm font-black uppercase shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform ${
                eliminated
                  ? "cursor-not-allowed bg-gray-300 text-gray-500 line-through opacity-60"
                  : "bg-white text-black hover:-translate-y-0.5 hover:bg-yellow-200 active:translate-y-0"
              }`}
            >
              <span className="flex h-7 w-7 flex-none items-center justify-center border-2 border-black bg-black text-yellow-400">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{answer}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const QuestionDetails = ({
  card,
}: {
  card: Extract<Card, { kind: "QUESTION" }>;
}) => (
  <div className="flex h-full w-full flex-col gap-3">
    <p className="text-center text-base font-black uppercase leading-tight">
      {card.question}
    </p>
    <ul className="flex flex-col gap-2">
      {card.answers.map((answer, idx) => (
        <li
          key={idx}
          className="border-2 border-black bg-white/80 px-3 py-2 text-sm font-bold text-black"
        >
          <span className="mr-2 inline-block w-5 text-black/60">
            {String.fromCharCode(65 + idx)}.
          </span>
          {answer}
        </li>
      ))}
    </ul>
  </div>
);

const SupportDetails = ({
  card,
}: {
  card: Extract<Card, { kind: "POWER_UP" | "DEBUFF" | "EFFECT" }>;
}) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
    <h3 className="text-2xl font-black uppercase">{card.name}</h3>
    <p className="text-sm font-bold leading-snug">{card.description}</p>
  </div>
);

export const CardPreview = ({
  state,
  hoveredCard,
  onAnswer,
}: CardPreviewProps) => {
  const cur = state.players[state.currentPlayerIdx];
  const isAnswerMode =
    state.phase === "ANSWER" && cur?.isMe && state.pendingQuestion !== null;

  return (
    <TactileContainer className="!flex-col !items-stretch !justify-start">
      <h2 className="mb-3 border-b-4 border-black pb-2 text-center text-lg uppercase text-white">
        {isAnswerMode ? "Odpowiedz" : "Podgląd karty"}
      </h2>

      {isAnswerMode ? (
        <AnswerPanel state={state} onAnswer={onAnswer} />
      ) : hoveredCard ? (
        <div className="flex flex-1 items-stretch">
          <CardArt
            card={hoveredCard}
            size="lg"
            className="min-h-[20rem]"
          >
            {hoveredCard.kind === "QUESTION" ? (
              <QuestionDetails card={hoveredCard} />
            ) : (
              <SupportDetails card={hoveredCard} />
            )}
          </CardArt>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-center text-base font-bold text-gray-400">
          Najedź na kartę,
          <br />
          aby zobaczyć szczegóły
        </div>
      )}
    </TactileContainer>
  );
};
