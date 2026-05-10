import type { ButtonHTMLAttributes, CSSProperties } from "react";

type Color = "blue" | "yellow" | "red";
type Size = "sm" | "md" | "lg" | "xl";

interface TactileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: Color;
  size?: Size;
}

const COLORS: Record<Color, { main: string; bottom: string; side: string }> = {
  blue: { main: "#3498db", bottom: "#217dbb", side: "#196090" },
  yellow: { main: "#FFCC00", bottom: "#cca300", side: "#997a00" },
  red: { main: "#e53935", bottom: "#b72e2a", side: "#8e2421" },
};

const SIZES: Record<
  Size,
  {
    padding: string;
    fontSize: string;
    depth: number;
    offset: number;
    activeMove: number;
  }
> = {
  sm: { padding: "px-4 py-2", fontSize: "text-sm", depth: 4, offset: 2, activeMove: 2 },
  md: { padding: "px-6 py-3", fontSize: "text-base", depth: 6, offset: 3, activeMove: 3 },
  lg: { padding: "px-8 py-4", fontSize: "text-xl", depth: 8, offset: 4, activeMove: 4 },
  xl: { padding: "px-12 py-6", fontSize: "text-3xl", depth: 12, offset: 6, activeMove: 6 },
};

export const TactileButton = ({
  children,
  color = "blue",
  size = "md",
  className = "",
  ...props
}: TactileButtonProps) => {
  const c = COLORS[color];
  const s = SIZES[size];

  const style = {
    "--btn-main": c.main,
    "--btn-bottom": c.bottom,
    "--btn-side": c.side,
    "--depth": `${s.depth}px`,
    "--depth-plus-one": `${s.depth + 1}px`,
    "--offset": `${s.offset}px`,
    "--active-move": `${s.activeMove}px`,
  } as CSSProperties;

  return (
    <button
      {...props}
      style={style}
      className={`
        relative z-20 inline-block cursor-pointer select-none
        ${s.padding} ${s.fontSize}
        border border-black bg-[var(--btn-main)] text-black
        font-['Rubik_One',sans-serif] font-black uppercase italic
        outline-none transition-all duration-150

        before:absolute before:bottom-[calc(var(--depth-plus-one)*-1)] before:left-[var(--offset)]
        before:z-[-1] before:h-[var(--depth)] before:w-[calc(100%+1px)] before:content-['']
        before:border-l before:border-r before:border-b before:border-black
        before:bg-[var(--btn-bottom)] before:transition-all before:duration-150
        before:skew-x-[45deg]

        after:absolute after:right-[calc(var(--depth-plus-one)*-1)] after:top-[var(--offset)]
        after:z-[-1] after:h-[calc(100%+1px)] after:w-[var(--depth)] after:content-['']
        after:border-t after:border-r after:border-b after:border-black
        after:bg-[var(--btn-side)] after:transition-all after:duration-150
        after:skew-y-[45deg]

        active:translate-x-[var(--active-move)] active:translate-y-[var(--active-move)]
        active:before:bottom-[-3px] active:before:left-[1px] active:before:h-[2px]
        active:after:right-[-3px] active:after:top-[1px] active:after:w-[2px]

        disabled:cursor-not-allowed disabled:opacity-50
        disabled:active:translate-x-0 disabled:active:translate-y-0

        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
