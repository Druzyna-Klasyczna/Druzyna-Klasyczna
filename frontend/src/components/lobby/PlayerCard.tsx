import { UserX, LogOut, Shield } from "lucide-react";
import { TactileButton } from "../TactileButton";

interface PlayerCardProps {
    name: string;
    isAdmin: boolean;
    isMe: boolean;
    canKick: boolean; // Czy osoba przeglądająca ma uprawnienia admina
    avatarUrl?: string;
    onKick?: () => void;
    onLeave?: () => void;
}

const PlayerCard = ({
    name,
    isAdmin,
    isMe,
    canKick,
    avatarUrl,
    onKick,
    onLeave,
}: PlayerCardProps) => {
    return (
        <div className="group relative">
            {/* Główny kontener karty - kanciasty i tactile */}
            <div
                className="bg-[#333333] border-[3px] border-black p-4 flex items-center justify-between 
                      shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1"
            >
                <div className="flex items-center gap-5">
                    {/* Avatar - kanciasty box */}
                    <div className="w-14 h-14 bg-[#444444] border-[3px] border-black flex-shrink-0 relative">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-xl font-black">
                                {name[0].toUpperCase()}
                            </div>
                        )}
                        {isAdmin && (
                            <div className="absolute -top-3 -left-3 bg-[#FFD700] border-2 border-black p-1 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                                <Shield
                                    size={14}
                                    className="text-black fill-black/20"
                                />
                            </div>
                        )}
                    </div>

                    {/* Dane gracza */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span
                                className={`text-xl font-black uppercase tracking-tight ${isMe ? "text-[#FFD700]" : "text-white"}`}
                            >
                                {name}
                            </span>
                            {isMe && (
                                <span className="text-[10px] bg-white text-black px-1 font-bold border border-black uppercase">
                                    Ty
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Akcje - przyciski w stylu Quick Draw */}
                <div className="flex gap-4 items-center">
                    {" "}
                    {/* Dodaj margines dla ścianek przycisków */}
                    {isMe ? (
                        <TactileButton size="sm" color="red" onClick={onLeave}>
                            <LogOut size={14} /> Wyjdź
                        </TactileButton>
                    ) : (
                        canKick && (
                            <TactileButton
                                size="sm"
                                color="red"
                                onClick={onKick}
                            >
                                <UserX size={14} /> Kick
                            </TactileButton>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
