export const GameConfig = () => {
    const inputStyle =
        "w-full bg-black border-2 border-white/20 text-yellow-400 p-3 font-black italic uppercase outline-none focus:border-yellow-400 transition-colors";
    const labelStyle = "text-white font-black italic uppercase text-xs mb-1";

    return (
        <div className="flex flex-col gap-8 p-2">
            <div className="flex flex-col">
                <label className={labelStyle}>Punkty do wygranej</label>
                <input type="number" className={inputStyle} defaultValue={10} />
            </div>

            <div className="flex flex-col">
                <label className={labelStyle}>Czas tury (sekundy)</label>
                <input type="number" className={inputStyle} defaultValue={30} />
            </div>

            <div className="flex flex-col gap-4 mt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        className="w-6 h-6 border-2 border-white accent-yellow-400"
                    />
                    <span className="text-white font-black italic uppercase text-sm group-hover:text-yellow-400 transition-colors">
                        Pokój prywatny
                    </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        className="w-6 h-6 border-2 border-white accent-yellow-400"
                    />
                    <span className="text-white font-black italic uppercase text-sm group-hover:text-yellow-400 transition-colors">
                        Włącz czat
                    </span>
                </label>
            </div>
        </div>
    );
};
