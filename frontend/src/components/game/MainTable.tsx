import type { Card } from "../../types/game";
import { TactileContainer } from "../TactileContainer";
import { CardArt } from "./CardArt";

interface MainTableProps {
  drawPileCount?: number;
  activeCard?: Card | null;
  currentPlayerName?: string | null;
}

export const MainTable = ({
  drawPileCount,
  activeCard,
  currentPlayerName,
}: MainTableProps) => (
  <TactileContainer className="relative col-span-2 !flex-col !items-center !justify-center gap-8">
    <h2 className="absolute left-4 top-4 text-xl uppercase text-white">Stół</h2>

    {currentPlayerName && (
      <div className="absolute right-4 top-4 border-2 border-black bg-yellow-400 px-3 py-1 text-sm font-black uppercase text-black">
        Tura: {currentPlayerName}
      </div>
    )}

    <div className="flex items-center gap-12">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-44 w-32 items-center justify-center rounded-md border-[3px] border-black bg-yellow-400 text-2xl font-black text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          {drawPileCount ?? "?"}
        </div>
        <span className="text-xs font-black uppercase text-white">Stos</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        {activeCard ? (
          <div className="h-44 w-32">
            <CardArt card={activeCard} size="sm" />
          </div>
        ) : (
          <div className="flex h-44 w-32 items-center justify-center rounded-md border-[3px] border-dashed border-white/40 text-center text-xs italic text-white/60">
            Brak aktywnej karty
          </div>
        )}
        <span className="text-xs font-black uppercase text-white">Aktywna</span>
      </div>
    </div>
  </TactileContainer>
);
