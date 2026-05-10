import type { GameState } from "../../types/game";
import { TactileContainer } from "../TactileContainer";

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
        className="border-[3px] border-black bg-white px-4 py-1.5 text-sm font-black uppercase text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
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
        className="border-[3px] border-black bg-white px-4 py-1.5 text-sm font-black uppercase text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Pomiń
      </button>
    );
  }

  return (
    <TactileContainer
      className={`h-16 flex-none !p-3 ${
        myTurn ? "!bg-yellow-300" : "!bg-[#3a3a14]"
      }`}
    >
      <span
        className={`text-base font-black uppercase tracking-tight ${
          myTurn ? "text-black" : "text-yellow-300"
        }`}
      >
        {message}
      </span>
      <div className="flex h-10 w-24 flex-none items-center justify-end">
        {action}
      </div>
    </TactileContainer>
  );
};
