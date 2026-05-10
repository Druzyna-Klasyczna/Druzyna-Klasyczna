import type { ReactNode } from "react";

interface TactileContainerProps {
  children: ReactNode;
  className?: string;
}

export const TactileContainer = ({
  children,
  className = "",
}: TactileContainerProps) => (
  <div className="relative inline-block w-full">
    <div
      className={`flex items-center justify-between border-[3px] border-black bg-[#333333] p-4 shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  </div>
);
