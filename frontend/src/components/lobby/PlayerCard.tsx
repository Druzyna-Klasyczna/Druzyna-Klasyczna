import { LogOut, Shield, UserX } from "lucide-react";
import { TactileButton } from "../TactileButton";

export interface PlayerCardProps {
  name: string;
  isAdmin: boolean;
  isMe: boolean;
  canKick: boolean;
  avatarUrl?: string;
  onKick?: () => void;
  onLeave?: () => void;
}

export const PlayerCard = ({
  name,
  isAdmin,
  isMe,
  canKick,
  avatarUrl,
  onKick,
  onLeave,
}: PlayerCardProps) => (
  <div className="group relative">
    <div className="flex items-center justify-between border-[3px] border-black bg-[#333333] p-4 pr-6 transition-transform hover:-translate-y-1">
      <div className="flex items-center gap-5">
        <div className="relative h-14 w-14 flex-shrink-0 border-[3px] border-black bg-[#444444]">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-xl font-black text-white">
              {name[0]?.toUpperCase()}
            </div>
          )}
          {isAdmin && (
            <div className="absolute -left-3 -top-3 border-2 border-black bg-[#FFD700] p-1 shadow-[2px_2px_0_rgba(0,0,0,1)]">
              <Shield size={14} className="fill-black/20 text-black" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xl font-black uppercase tracking-tight ${
              isMe ? "text-[#FFD700]" : "text-white"
            }`}
          >
            {name}
          </span>
          {isMe && (
            <span className="border border-black bg-white px-1 text-[10px] font-bold uppercase text-black">
              Ty
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
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
    </div>
  </div>
);
