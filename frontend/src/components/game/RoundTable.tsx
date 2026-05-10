import { RotateCcw, RotateCw } from "lucide-react";
import type { GameState, TurnPhase } from "../../types/game";
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

const SEAT_RADIUS_PCT = 40;
const ARROW_RADIUS_PCT = 28;

const polar = (angle: number, radiusPct: number) => ({
  left: `${50 + Math.cos(angle) * radiusPct}%`,
  top: `${50 + Math.sin(angle) * radiusPct}%`,
});

const seatAngle = (idx: number, total: number) =>
  (idx / total) * Math.PI * 2 + Math.PI / 2;

export const RoundTable = ({ state }: RoundTableProps) => {
  const { players, currentPlayerIdx, direction, phase, pendingQuestion } =
    state;

  const RotateIcon = direction === 1 ? RotateCw : RotateCcw;

  return (
    <TactileContainer className="relative h-full !items-stretch !justify-stretch !p-2">
      <div className="relative h-full w-full overflow-hidden">
        {/* Round table surface */}
        <div className="absolute left-1/2 top-1/2 aspect-square h-[96%] max-h-full -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-black bg-gradient-to-br from-[#7a2a26] to-[#3d1311] shadow-[inset_0_0_0_8px_rgba(0,0,0,0.25),inset_0_0_60px_rgba(0,0,0,0.6)]">
          {/* Inner felt ring */}
          <div className="absolute inset-[10%] rounded-full border-[3px] border-black/40 bg-[#5a1f1d]" />

          {/* Wood grain rings (decorative) */}
          <div className="pointer-events-none absolute inset-[18%] rounded-full border border-black/30" />
          <div className="pointer-events-none absolute inset-[26%] rounded-full border border-black/20" />

          {/* Direction arrows curving around inner table */}
          {players.map((_, i) => {
            const a = seatAngle(i, players.length) + (Math.PI / players.length) * direction;
            const pos = polar(a, ARROW_RADIUS_PCT);
            const rotateDeg = (a * 180) / Math.PI + (direction === 1 ? 90 : -90);
            return (
              <div
                key={`arrow-${i}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-yellow-300/80"
                style={{
                  left: pos.left,
                  top: pos.top,
                  transform: `translate(-50%, -50%) rotate(${rotateDeg}deg)`,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12 L19 12 M13 6 L19 12 L13 18"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            );
          })}

          {/* Center hub */}
          <div className="absolute left-1/2 top-1/2 flex w-[58%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-black bg-yellow-400 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              <RotateIcon size={24} className="text-black" strokeWidth={3} />
            </div>

            <div className="border-[3px] border-black bg-yellow-400 px-3 py-1 text-xs font-black uppercase text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              {PHASE_LABEL[phase]}
            </div>

            {pendingQuestion && (
              <div className="max-w-[14rem] border-[3px] border-black bg-rose-400 px-2 py-0.5 text-center text-[10px] font-black uppercase text-black">
                {players.find((p) => p.id === pendingQuestion.fromPlayerId)?.name}
                &nbsp;→&nbsp;
                {players.find((p) => p.id === pendingQuestion.toPlayerId)?.name}
              </div>
            )}
          </div>
        </div>

        {/* Player avatars around the table */}
        {players.map((player, i) => (
          <PlayerSeat
            key={player.id}
            player={player}
            isCurrent={i === currentPlayerIdx}
            isPending={player.id === pendingQuestion?.toPlayerId}
            style={polar(seatAngle(i, players.length), SEAT_RADIUS_PCT)}
          />
        ))}
      </div>
    </TactileContainer>
  );
};
