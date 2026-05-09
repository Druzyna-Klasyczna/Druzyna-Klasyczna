import { Link } from "react-router-dom";

export interface ButtonProps {
    href: string;
    name: string;
}
    
export const StartButton = ({ href, name }: ButtonProps) => {
    return (
        <Link
            to={href}
            className="bg-yellow-400 hover:bg-yellow-500 
                       text-black font-bold 
                       py-6 px-16 text-3xl rounded-lg  /* <-- Zwiększony padding i czcionka */
                       border-4 border-black          /* <-- Grubsza ramka */
                       shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] /* <-- Większy cień */
                       hover:-translate-y-2 hover:translate-x-2 hover:shadow-none
                       active:translate-y-2 active:translate-x-2
                       transition-all duration-150 inline-block"
        >
            {name}
        </Link>
    );
};