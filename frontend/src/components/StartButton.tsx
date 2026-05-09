import { Link } from "react-router-dom";
import { TactileButton } from "./TactileButton";

export interface ButtonProps {
    href?: string;
    name: string;
    onClick?: () => void;
}

export const StartButton = ({ href, name, onClick }: ButtonProps) => {
    const button = (
        <TactileButton size="lg" color="yellow" onClick={onClick}>
            {name}
        </TactileButton>
    );

    if (href) {
        return <Link to={href}>{button}</Link>;
    }

    return button;
};
