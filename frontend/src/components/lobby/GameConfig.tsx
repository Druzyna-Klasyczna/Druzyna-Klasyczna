import { TactileButton } from "../TactileButton";
import { TactileContainer } from "../TactileContainer";
import { SessionCode } from "./SessionCode";

interface GameConfigProps {
  roomCode: string;
  isHost?: boolean;
  canStart?: boolean;
  onStart?: () => void;
}

const inputClass =
  "w-full border-2 border-white/20 bg-black p-3 font-black italic uppercase text-yellow-400 outline-none transition-colors focus:border-yellow-400";
const labelClass =
  "mb-1 text-xs font-black italic uppercase text-white";
const checkboxLabelClass =
  "text-sm font-black italic uppercase text-white transition-colors group-hover:text-yellow-400";

export const GameConfig = ({
  roomCode,
  isHost,
  canStart = false,
  onStart,
}: GameConfigProps) => (
  <div className="flex h-full flex-col justify-between">
    <div className="p-2">
      <TactileContainer>
        <SessionCode code={roomCode} />
      </TactileContainer>
    </div>

    <div className="flex flex-col gap-8 p-2">
      <div className="flex flex-col">
        <label className={labelClass}>Punkty do wygranej</label>
        <input type="number" className={inputClass} defaultValue={10} />
      </div>

      <div className="flex flex-col">
        <label className={labelClass}>Czas tury (sekundy)</label>
        <input type="number" className={inputClass} defaultValue={30} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-6 w-6 border-2 border-white accent-yellow-400"
          />
          <span className={checkboxLabelClass}>Pokój prywatny</span>
        </label>

        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-6 w-6 border-2 border-white accent-yellow-400"
          />
          <span className={checkboxLabelClass}>Włącz czat</span>
        </label>
      </div>
    </div>

    {isHost && (
      <div className="flex shrink-0 flex-col items-center justify-center gap-2 p-2">
        <TactileButton
          size="lg"
          color="yellow"
          onClick={onStart}
          disabled={!canStart}
        >
          START
        </TactileButton>
        {!canStart && (
          <span className="text-center text-[11px] font-black italic uppercase text-white/60">
            Wszyscy gracze (min. 2) muszą być gotowi
          </span>
        )}
      </div>
    )}
  </div>
);
