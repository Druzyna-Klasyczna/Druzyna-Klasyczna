import { ChevronLeft, ChevronRight, Import } from "lucide-react";
import { TactileButton } from "../TactileButton";

export const DeckPreview = () => {
    return (
        <div className="flex flex-col items-center justify-around h-full py-4 w-full">
            <div className="flex items-center gap-6">
                <TactileButton size="sm" color="blue">
                    <ChevronLeft size={24} />
                </TactileButton>

                {/* Wizualizacja karty decku */}
                <div className="w-40 h-56 bg-white border-2 border-black flex flex-col items-center justify-center shadow-[6px_6px_0_0_rgba(0,0,0,1)] transform -rotate-2">
                    <div className="text-5xl">🎴</div>
                    <span className="mt-4 font-black italic text-black">
                        CLASSIC
                    </span>
                </div>

                <TactileButton size="sm" color="blue">
                    <ChevronRight size={24} />
                </TactileButton>
            </div>

            <TactileButton size="sm" color="yellow">
                <Import size={16} className="mr-2" /> Importuj Deck
            </TactileButton>
        </div>
    );
};
