import type { ReactNode } from "react";

interface TactileContainerProps {
  children: ReactNode;
  className?: string;
}

export const TactileContainer = ({
  children,
  className = "",
}: TactileContainerProps) => (
  <div className="relative block h-full w-full">
    <div
      className={`flex h-full w-full items-center justify-between border-[3px] border-black bg-[#333333] p-4 shadow-[6px_6px_0_0_rgba(0,0,0,1)] ${className}`}
    >
      {children}
    </div>
  </div>
);
