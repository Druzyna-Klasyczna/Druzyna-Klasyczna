import { TactileContainer } from "../TactileContainer";

interface GameLogProps {
  log: string[];
}

export const GameLog = ({ log }: GameLogProps) => {
  const recent = log.slice(-12).reverse();

  return (
    <TactileContainer className="h-full !flex-col !items-stretch !justify-start overflow-hidden">
      <h2 className="mb-3 flex-none border-b-4 border-black pb-2 text-center text-lg uppercase text-white">
        Log
      </h2>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {recent.length === 0 ? (
          <div className="text-center text-sm italic text-white/50">
            Cisza przy stole...
          </div>
        ) : (
          recent.map((entry, i) => (
            <div
              key={`${log.length - i}`}
              className={`whitespace-normal break-words border-2 border-black px-2 py-1 text-center text-xs font-black uppercase leading-snug shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${
                i === 0
                  ? "bg-yellow-300 text-black"
                  : "bg-black/80 text-yellow-400"
              }`}
            >
              {entry}
            </div>
          ))
        )}
      </div>
    </TactileContainer>
  );
};
