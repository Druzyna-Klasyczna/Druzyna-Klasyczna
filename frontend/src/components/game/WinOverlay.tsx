import { Trophy } from "lucide-react";
import { TactileButton } from "../TactileButton";

interface WinOverlayProps {
  winnerName: string;
  onBackToLobby: () => void;
  onPlayAgain: () => void;
}

export const WinOverlay = ({
  winnerName,
  onBackToLobby,
  onPlayAgain,
}: WinOverlayProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="flex w-[28rem] max-w-[90vw] flex-col items-center gap-6 border-[4px] border-black bg-yellow-400 p-8 shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
      <Trophy size={64} className="text-black" />
      <h2 className="font-display text-4xl font-black uppercase italic text-black">
        Koniec gry!
      </h2>
      <p className="text-center text-xl font-black uppercase text-black">
        Zwycięzca:
        <br />
        <span className="text-3xl">{winnerName}</span>
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <TactileButton color="blue" size="md" onClick={onPlayAgain}>
          Zagraj jeszcze raz
        </TactileButton>
        <TactileButton color="red" size="md" onClick={onBackToLobby}>
          Powrót do lobby
        </TactileButton>
      </div>
    </div>
  </div>
);
