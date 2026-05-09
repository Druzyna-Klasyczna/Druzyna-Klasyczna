import React from "react";

interface TactileContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const TactileContainer = ({
    children,
    className = "",
}: TactileContainerProps) => {
    return (
        <div className="relative inline-block w-full">
            <div
                className={`
        relative z-10
        bg-[#222222] border-[3px] border-black p-6
        transition-all duration-200
        
        /* ŚCIANKA DOLNA KONTENERA */
        before:content-[''] before:absolute before:left-[10px] before:bottom-[-20px]
        before:w-full before:h-[20px] before:bg-[#111111] before:border-[3px] before:border-black
        before:transform before:skew-x-[45deg]
        
        /* ŚCIANKA BOCZNA KONTENERA */
        after:content-[''] after:absolute after:right-[-20px] after:bottom-[-10px]
        after:w-[20px] after:h-full after:bg-[#0a0a0a] after:border-[3px] after:border-black
        after:transform after:skew-y-[45deg]
        
        ${className}
      `}
            >
                {children}
            </div>
        </div>
    );
};
