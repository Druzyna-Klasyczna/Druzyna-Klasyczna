import { ArrowDown, ArrowUp } from "lucide-react";
import type { GamePlayer, GameState, TurnPhase } from "../../types/game";
import { TactileContainer } from "../TactileContainer";
import { PlayerSeat } from "./PlayerSeat";

const PHASE_LABEL: Record<TurnPhase, string> = {
  ANSWER: "Faza odpowiedzi",
  EFFECT: "Faza efektu",
  QUESTION: "Faza pytania",
  DEBUFF: "Faza debuffa",
  RESULT: "Koniec gry",
};

interface RoundTableProps {
  state: GameState;
}

export const RoundTable = ({ state }: RoundTableProps) => {
  const { players, currentPlayerIdx, direction, phase, pendingQuestion } =
    state;

  return (
    <TactileContainer className="relative col-span-2 !flex-col !items-stretch !justify-center !p-0">
      <div className="relative h-full w-full overflow-hidden">
        <div className="absolute left-1/2 top-1/2 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-black bg-[#5a1f1d] shadow-[inset_0_0_0_8px_rgba(0,0,0,0.25)]">
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
            <div className="border-[3px] border-black bg-yellow-400 px-4 py-1 text-base font-black uppercase text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              {PHASE_LABEL[phase]}
            </div>
            <div className="flex items-center gap-2 border-[3px] border-black bg-black px-3 py-1 text-xs font-black uppercase text-yellow-400">
              {direction === 1 ? (
                <>
                  Kierunek <ArrowDown size={14} className="rotate-90" />
                </>
              ) : (
                <>
                  Kierunek <ArrowUp size={14} className="rotate-90" />
                </>
              )}
            </div>
            {pendingQuestion && (
              <div className="max-w-[16rem] border-[3px] border-black bg-rose-400 px-3 py-1 text-center text-[11px] font-black uppercase text-black">
                Pytanie krąży:&nbsp;
                {players.find((p) => p.id === pendingQuestion.fromPlayerId)?.name}
                &nbsp;→&nbsp;
                {players.find((p) => p.id === pendingQuestion.toPlayerId)?.name}
              </div>
            )}
          </div>
        </div>

        {players.map((player, i) => (
          <PlayerSeat
            key={player.id}
            player={player}
            isCurrent={i === currentPlayerIdx}
            isPending={player.id === pendingQuestion?.toPlayerId}
            style={seatStyle(i, players.length)}
          />
        ))}
      </div>
    </TactileContainer>
  );
};

// Position seats around the circle. Index 0 sits at bottom-center, others
// rotate counter-clockwise so the local player is always closest to the hand.
const seatStyle = (idx: number, total: number) => {
  const angle = (idx / total) * Math.PI * 2 + Math.PI / 2;
  const radiusPct = 38;
  const left = 50 + Math.cos(angle) * radiusPct;
  const top = 50 + Math.sin(angle) * radiusPct;
  return { left: `${left}%`, top: `${top}%` };
};

export const findPlayerById = (players: GamePlayer[], id: string) =>
  players.find((p) => p.id === id);
