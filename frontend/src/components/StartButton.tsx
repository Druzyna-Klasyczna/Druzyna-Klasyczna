import { Link } from "react-router-dom";
import { TactileButton } from "./TactileButton";

export interface ButtonProps {
    href?: string;
    name: string;
    size?: "sm" | "md" | "lg" | "xl"; // Już tu jest, super
    onClick?: () => void;
}

// 1. Dodajemy 'size' do argumentów (destrukturyzacja)
// 2. Ustawiamy domyślną wartość (np. "lg"), żeby przycisk nie był malutki bez podania rozmiaru
export const StartButton = ({
    href,
    name,
    onClick,
    size = "xl",
}: ButtonProps) => {
    const baseStyles = "";

    if (href) {
        return (
            <Link to={href} className={baseStyles}>
                {/* Jeśli Link też ma wyglądać jak TactileButton, 
                   powinieneś go nim owinąć lub użyć as={Link} 
                   (zależy od implementacji TactileButton) 
                */}
                <TactileButton color="yellow" size={size}>
                    {name}
                </TactileButton>
            </Link>
        );
    }

    return (
        <TactileButton
            color="yellow"
            size={size} // <--- Teraz size jest przekazywane tutaj
            onClick={onClick}
            className={baseStyles}
        >
            {name}
        </TactileButton>
    );
};
