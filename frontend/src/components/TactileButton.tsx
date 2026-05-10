import React from "react";

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: "blue" | "yellow" | "red";
    size?: "sm" | "md" | "lg" | "xl";
}

export const TactileButton = ({
    children,
    color = "blue",
    size = "md",
    className = "",
    ...props
}: TactileButtonProps) => {
    const theme = {
        blue: {
            main: "#3498db",
            bottom: "#217dbb",
            side: "#196090",
        },
        yellow: {
            main: "#FFCC00",
            bottom: "#cca300",
            side: "#997a00",
        },
        red: {
            main: "#e53935",
            bottom: "#b72e2a",
            side: "#8e2421",
        },
    };

    const sizeStyles = {
        sm: {
            padding: "px-4 py-2",
            fontSize: "text-sm",
            depth: 4,
            offset: 2,
            activeMove: 2,
        },
        md: {
            padding: "px-6 py-3",
            fontSize: "text-base",
            depth: 6,
            offset: 3,
            activeMove: 3,
        },
        lg: {
            padding: "px-8 py-4",
            fontSize: "text-xl",
            depth: 8,
            offset: 4,
            activeMove: 4,
        },
        xl: {
            padding: "px-12 py-6", // Wyraźnie szerszy i wyższy
            fontSize: "text-3xl", // Duży, czytelny tekst
            depth: 12, // Grubsza "podstawa" przycisku (cień)
            offset: 6, // Większe przesunięcie warstwy górnej
            activeMove: 6, // Mocniejszy skok przy kliknięciu (musi zrównać się z offsetem)
        },
    };

    const c = theme[color];
    const sizes = sizeStyles[size];

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

                ${sizes.padding}
                ${sizes.fontSize}

                bg-[var(--btn-main)]
                text-black

                font-['Rubik_One',sans-serif]
                font-black
                uppercase
                italic

                border border-black
                outline-none
                cursor-pointer

                transition-all duration-150
                z-20

                select-none

                /* BOTTOM FACE */
                before:content-['']
                before:absolute
                before:bottom-[calc(var(--depth-plus-one)*-1)]
                before:left-[var(--offset)]

                before:w-[calc(100%+1px)]
                before:h-[var(--depth)]

                before:bg-[var(--btn-bottom)]

                before:border-l
                before:border-b
                before:border-r
                before:border-black

                before:skew-x-[45deg]

                before:transition-all
                before:duration-150

                before:z-[-1]

                /* SIDE FACE */
                after:content-['']
                after:absolute
                after:top-[var(--offset)]
                after:right-[calc(var(--depth-plus-one)*-1)]

                after:w-[var(--depth)]
                after:h-[calc(100%+1px)]

                after:bg-[var(--btn-side)]

                after:border-t
                after:border-r
                after:border-b
                after:border-black

                after:skew-y-[45deg]

                after:transition-all
                after:duration-150

                after:z-[-1]

                /* ACTIVE */
                active:translate-x-[var(--active-move)]
                active:translate-y-[var(--active-move)]

                active:before:h-[2px]
                active:before:bottom-[-3px]
                active:before:left-[1px]

                active:after:w-[2px]
                active:after:right-[-3px]
                active:after:top-[1px]

                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:active:translate-x-0
                disabled:active:translate-y-0

                ${className}
            `}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
};
