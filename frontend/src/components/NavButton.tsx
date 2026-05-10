import { Link } from "react-router-dom";

export interface ButtonProps {
    href: string;
    name: string;
}

export const NavButton = ({ href, name }: ButtonProps) => {
    return (
        <Link
            to={href}
            className="bg-white/40 hover:bg-white/60 backdrop-blur-sm 
                       text-gray-900 font-semibold py-2 px-4 rounded-sm 
                       border border-black/40 
                       shadow-[0_4px_0_rgba(0,0,0,0.25)] 
                       hover:-translate-y-[1px] 
                       active:translate-y-[3px] active:shadow-[0_1px_0_rgba(0,0,0,0.25)] 
                       transition-all duration-150 inline-block"
        >
            {name}
        </Link>
    );
};
