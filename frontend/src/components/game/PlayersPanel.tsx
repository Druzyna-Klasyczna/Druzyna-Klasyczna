import { TactileContainer } from "../TactileContainer";

export interface GamePlayerSummary {
  id: string;
  name: string;
  handCount: number;
  isCurrentTurn: boolean;
  isMe: boolean;
}

interface PlayersPanelProps {
  players: GamePlayerSummary[];
}

export const PlayersPanel = ({ players }: PlayersPanelProps) => (
  <TactileContainer className="!flex-col !items-stretch !justify-start">
    <h2 className="mb-4 border-b-4 border-black pb-2 text-2xl uppercase text-white">
      Gracze
    </h2>

    {players.length === 0 ? (
      <div className="italic text-gray-400">Lista graczy pojawi się tutaj...</div>
    ) : (
      <ul className="flex flex-col gap-3">
        {players.map((p) => (
          <li
            key={p.id}
            className={`flex items-center justify-between border-[3px] border-black px-3 py-2 ${
              p.isCurrentTurn ? "bg-yellow-400 text-black" : "bg-[#444444] text-white"
            }`}
          >
            <span className="text-base font-black uppercase tracking-tight">
              {p.name}
              {p.isMe && (
                <span className="ml-2 border border-black bg-white px-1 text-[10px] font-bold uppercase text-black">
                  Ty
                </span>
              )}
            </span>
            <span className="text-sm font-black">
              {p.handCount} <span className="opacity-70">kart</span>
            </span>
          </li>
        ))}
      </ul>
    )}
  </TactileContainer>
);
