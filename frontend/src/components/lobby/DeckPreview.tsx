import { ChevronLeft, ChevronRight, Import } from "lucide-react";
import { TactileButton } from "../TactileButton";

interface DeckPreviewProps {
  isHost?: boolean;
}

export const DeckPreview = ({ isHost = false }: DeckPreviewProps) => (
  <div className="flex h-full w-full flex-col items-center justify-around py-4">
    <div className="flex items-center gap-6">
      <TactileButton size="sm" color="blue" disabled={!isHost}>
        <ChevronLeft size={24} />
      </TactileButton>

      <div className="flex h-56 w-40 -rotate-2 transform flex-col items-center justify-center border-2 border-black bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
        <div className="text-5xl">🎴</div>
        <span className="mt-4 font-black italic text-black">CLASSIC</span>
      </div>

      <TactileButton size="sm" color="blue" disabled={!isHost}>
        <ChevronRight size={24} />
      </TactileButton>
    </div>

    {isHost && (
      <TactileButton size="sm" color="yellow">
        <Import size={16} /> Importuj Deck
      </TactileButton>
    )}
  </div>
);
