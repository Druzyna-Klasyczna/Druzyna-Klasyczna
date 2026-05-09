import React from "react";

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: "blue" | "yellow" | "red";
    variant?: "default" | "small"; // Zmienione z size na variant
}

export const TactileButton = ({
    children,
    color = "blue",
    variant = "default", // Zmienione z size na variant
    className = "",
    ...props
}: TactileButtonProps) => {
    const theme = {
        blue: { main: "#3498db", bottom: "#217dbb", side: "#196090" },
        yellow: { main: "#FFCC00", bottom: "#cca300", side: "#997a00" },
        red: { main: "#e53935", bottom: "#b72e2a", side: "#8e2421" },
    };

    const c = theme[color];

    // Definicja stałych dla wariantów, aby zachować proporcje 3D
    const isSmall = variant === "small"; // Używamy variant

    const sizes = {
        padding: isSmall ? "px-4 py-2" : "px-10 py-5",
        fontSize: isSmall ? "text-sm" : "text-3xl",
        depth: isSmall ? 6 : 15,
        offset: isSmall ? 3 : 7,
        activeMove: isSmall ? 4 : 10,
    };

    return (
        <button
            {...props}
            style={
                {
                    "--btn-main": c.main,
                    "--btn-bottom": c.bottom,
                    "--btn-side": c.side,
                    "--depth": `${sizes.depth}px`,
                    "--depth-plus-one": `${sizes.depth + 1}px`,
                    "--offset": `${sizes.offset}px`,
                    "--active-move": `${sizes.activeMove}px`,
                } as React.CSSProperties
            }
            className={`
                relative inline-block 
                ${sizes.padding} ${sizes.fontSize}
                bg-[var(--btn-main)] text-black 
                font-['Rubik_One',sans-serif] font-black uppercase italic
                border-[1px] border-black
                outline-none cursor-pointer
                transition-all duration-500
                z-20
                
                /* ŚCIANKA DOLNA (Before) */
                before:content-[''] before:absolute 
                before:bottom-[calc(var(--depth-plus-one)*-1)] before:left-[var(--offset)] 
                before:w-[calc(100%+1px)] before:h-[var(--depth)] 
                before:bg-[var(--btn-bottom)]
                before:border-l-[1px] before:border-b-[1px] before:border-r-[1px] before:border-black
                before:transform before:skew-x-[45deg]
                before:transition-all before:duration-500
                before:z-[-1]
                
                /* ŚCIANKA BOCZNA (After) */
                after:content-[''] after:absolute 
                after:top-[var(--offset)] after:right-[calc(var(--depth-plus-one)*-1)] 
                after:w-[var(--depth)] after:h-[calc(100%+1px)] 
                after:bg-[var(--btn-side)]
                after:border-t-[1px] after:border-r-[1px] after:border-b-[1px] after:border-black
                after:transform after:skew-y-[45deg]
                after:transition-all after:duration-500
                after:z-[-1]

                /* LOGIKA WCISKANIA */
                active:translate-x-[var(--active-move)] 
                active:translate-y-[var(--active-move)]
                
                active:before:h-[2px] 
                active:before:bottom-[-3px] 
                active:before:left-[1px]
                
                active:after:w-[2px] 
                active:after:right-[-3px] 
                active:after:top-[1px]

                ${className}
            `}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
};
