import { Link } from "react-router-dom";

export interface ButtonProps {
    href?: string;           // Znak zapytania oznacza, że to jest opcjonalne
    name: string;
    onClick?: () => void;    // Dodajemy opcjonalną funkcję kliknięcia
}
    
export const StartButton = ({ href, name, onClick }: ButtonProps) => {
    // Zapisujemy style do zmiennej, żeby nie powtarzać kodu
    const baseStyles = "bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 px-16 text-3xl rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:translate-x-2 hover:shadow-none active:translate-y-2 active:translate-x-2 transition-all duration-150 inline-block text-center cursor-pointer";

    // Jeśli przekazano href, zachowuje się jak dawniej (Link)
    if (href) {
        return (
            <Link to={href} className={baseStyles}>
                {name}
            </Link>
        );
    }

    // Jeśli nie ma href, działa jak zwykły przycisk (zmieniający stan)
    return (
        <button onClick={onClick} className={baseStyles}>
            {name}
        </button>
    );
};