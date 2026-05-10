import { Check, LogOut, Shield, UserX } from "lucide-react";
import { TactileButton } from "../TactileButton";

export interface PlayerCardProps {
  name: string;
  isAdmin: boolean;
  isMe: boolean;
  isReady: boolean;
  canKick: boolean;
  avatarUrl?: string;
  onKick?: () => void;
  onLeave?: () => void;
  onToggleReady?: () => void;
}

export const PlayerCard = ({
  name,
  isAdmin,
  isMe,
  isReady,
  canKick,
  avatarUrl,
  onKick,
  onLeave,
  onToggleReady,
}: PlayerCardProps) => {
  const showActions = isMe || canKick;

  return (
    <div
      className={`flex flex-col gap-3 border-[3px] p-4 transition-transform hover:-translate-y-1 ${
        isReady ? "border-emerald-400 bg-[#1f3a2c]" : "border-black bg-[#333333]"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 flex-none border-[3px] border-black bg-[#444444]">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-lg font-black text-white">
              {name[0]?.toUpperCase()}
            </div>
          )}
          {isAdmin && (
            <div className="absolute -left-3 -top-3 border-2 border-black bg-[#FFD700] p-1 shadow-[2px_2px_0_rgba(0,0,0,1)]">
              <Shield size={14} className="fill-black/20 text-black" />
            </div>
          )}
          {isReady && (
            <div className="absolute -bottom-3 -right-3 border-2 border-black bg-emerald-400 p-1 shadow-[2px_2px_0_rgba(0,0,0,1)]">
              <Check size={14} className="text-black" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className={`truncate text-xl font-black uppercase tracking-tight ${
              isMe ? "text-[#FFD700]" : "text-white"
            }`}
          >
            {name}
          </span>
          {isMe && (
            <span className="flex-none border border-black bg-white px-1 text-[10px] font-bold uppercase text-black">
              Ty
            </span>
          )}
        </div>
      </div>

      {showActions && (
        <div className="flex items-center justify-end gap-3">
          {isMe && (
            <TactileButton
              size="sm"
              color={isReady ? "yellow" : "blue"}
              onClick={onToggleReady}
            >
              {isReady ? "Nie gotowy" : "Gotowy"}
            </TactileButton>
          )}
          {isMe ? (
            <TactileButton size="sm" color="red" onClick={onLeave}>
              <LogOut size={14} /> Wyjdź
            </TactileButton>
          ) : (
            canKick && (
              <TactileButton size="sm" color="red" onClick={onKick}>
                <UserX size={14} /> Kick
              </TactileButton>
            )
          )}
        </div>
      )}
    </div>
  );
};
