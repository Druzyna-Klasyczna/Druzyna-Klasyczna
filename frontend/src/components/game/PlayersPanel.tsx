import type { GamePlayer } from "../../types/game";
import { TactileContainer } from "../TactileContainer";

interface PlayersPanelProps {
  players: GamePlayer[];
  currentPlayerId: string | null;
  pendingTargetId?: string | null;
}

export const PlayersPanel = ({
  players,
  currentPlayerId,
  pendingTargetId,
}: PlayersPanelProps) => (
  <TactileContainer className="h-full !flex-col !items-stretch !justify-start overflow-hidden">
    <h2 className="mb-3 flex-none border-b-4 border-black pb-2 text-2xl uppercase text-white">
      Gracze
    </h2>

    <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
      {players.map((p) => {
        const questions = p.hand.filter((c) => c.kind === "QUESTION").length;
        const support = p.hand.length - questions;
        const isCurrent = p.id === currentPlayerId;
        const isTarget = p.id === pendingTargetId;
        return (
          <li
            key={p.id}
            className={`flex flex-col gap-1 border-[3px] px-3 py-2 ${
              isCurrent
                ? "border-yellow-400 bg-[#3a3a14] text-yellow-300"
                : "border-black bg-[#444444] text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="truncate text-sm font-black uppercase tracking-tight">
                {p.name}
                {p.isMe && (
                  <span className="ml-2 border border-black bg-white px-1 text-[10px] font-bold uppercase text-black">
                    Ty
                  </span>
                )}
              </span>
              {isCurrent && (
                <span className="border border-black bg-yellow-400 px-1 text-[10px] font-black uppercase text-black">
                  TURA
                </span>
              )}
              {isTarget && !isCurrent && (
                <span className="border border-black bg-rose-400 px-1 text-[10px] font-black uppercase text-black">
                  CEL
                </span>
              )}
            </div>
            <div className="flex gap-2 text-[10px] font-black">
              <span className="border border-black bg-yellow-300 px-1 text-black">
                {questions} pytań
              </span>
              <span className="border border-black bg-emerald-300 px-1 text-black">
                {support} wsparcia
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  </TactileContainer>
);
