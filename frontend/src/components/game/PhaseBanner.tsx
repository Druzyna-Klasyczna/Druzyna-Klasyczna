import type { GameState } from "../../types/game";

interface PhaseBannerProps {
  state: GameState;
  onSkipEffect: () => void;
  onSkipDebuff: () => void;
}

export const PhaseBanner = ({
  state,
  onSkipEffect,
  onSkipDebuff,
}: PhaseBannerProps) => {
  const cur = state.players[state.currentPlayerIdx];
  if (!cur || state.phase === "RESULT") return null;

  const myTurn = cur.isMe;
  let message = "";
  let action: React.ReactNode = null;

  if (!myTurn) {
    message = `Tura: ${cur.name}…`;
  } else if (state.phase === "ANSWER") {
    message = "Odpowiedz na pytanie po prawej, lub zagraj power-up.";
  } else if (state.phase === "EFFECT") {
    message = "Faza efektu — zagraj kartę efektu lub pomiń.";
    action = (
      <button
        type="button"
        onClick={onSkipEffect}
        className="border-2 border-black bg-yellow-400 px-3 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0"
      >
        Pomiń
      </button>
    );
  } else if (state.phase === "QUESTION") {
    message = "Faza pytania — wybierz kartę pytania, by zaatakować następnego gracza.";
  } else if (state.phase === "DEBUFF") {
    message = "Faza debuffa — możesz nałożyć debuff lub pominąć.";
    action = (
      <button
        type="button"
        onClick={onSkipDebuff}
        className="border-2 border-black bg-yellow-400 px-3 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0"
      >
        Pomiń
      </button>
    );
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 border-[3px] border-black px-4 py-2 ${
        myTurn ? "bg-yellow-300 text-black" : "bg-black text-white"
      }`}
    >
      <span className="text-sm font-black uppercase">{message}</span>
      {action}
    </div>
  );
};
