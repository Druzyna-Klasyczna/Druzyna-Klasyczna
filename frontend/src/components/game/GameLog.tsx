interface GameLogProps {
  entries: string[];
}

export const GameLog = ({ entries }: GameLogProps) => {
  const last = entries.slice(-5);
  return (
    <div className="pointer-events-none absolute right-4 top-4 z-10 flex w-72 flex-col gap-1 text-right">
      {last.map((entry, i) => (
        <div
          key={`${entries.length - last.length + i}`}
          className="border-2 border-black bg-black/80 px-3 py-1 text-xs font-black uppercase text-yellow-400 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
        >
          {entry}
        </div>
      ))}
    </div>
  );
};
