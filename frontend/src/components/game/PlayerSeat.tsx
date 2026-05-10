import type { GamePlayer } from "../../types/game";

interface PlayerSeatProps {
  player: GamePlayer;
  isCurrent: boolean;
  isPending?: boolean;
  style?: React.CSSProperties;
}

export const PlayerSeat = ({
  player,
  isCurrent,
  isPending,
  style,
}: PlayerSeatProps) => {
  const questionCount = player.hand.filter((c) => c.kind === "QUESTION").length;
  const supportCount = player.hand.length - questionCount;

  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={style}
    >
      <div
        className={`relative h-16 w-16 border-[3px] bg-[#444] shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform ${
          isCurrent
            ? "border-yellow-400 scale-110 ring-4 ring-yellow-300/60 animate-pulse"
            : "border-black"
        }`}
      >
        {player.avatarUrl ? (
          <img
            src={player.avatarUrl}
            alt={player.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-xl font-black text-white">
            {player.name[0]?.toUpperCase()}
          </div>
        )}
        {isPending && (
          <div className="absolute -top-3 -right-3 border-2 border-black bg-rose-400 px-1 text-[10px] font-black uppercase">
            !
          </div>
        )}
        {player.isMe && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 border-2 border-black bg-white px-1 text-[10px] font-bold uppercase">
            Ty
          </div>
        )}
      </div>

      <div
        className={`mt-3 max-w-[110px] truncate border-2 border-black px-2 py-0.5 text-center text-[11px] font-black uppercase ${
          isCurrent ? "bg-yellow-400 text-black" : "bg-black text-white"
        }`}
      >
        {player.name}
      </div>

      <div className="mt-1 flex gap-1 text-[10px] font-black">
        <span className="border border-black bg-yellow-300 px-1 text-black">
          {questionCount}p
        </span>
        <span className="border border-black bg-emerald-300 px-1 text-black">
          {supportCount}w
        </span>
      </div>
    </div>
  );
};
