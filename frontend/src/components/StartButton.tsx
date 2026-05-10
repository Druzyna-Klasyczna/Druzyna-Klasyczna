import { Link } from "react-router-dom";
import { TactileButton } from "./TactileButton";

interface StartButtonProps {
  name: string;
  href?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
}

export const StartButton = ({
  name,
  href,
  onClick,
  size = "xl",
}: StartButtonProps) => {
  const button = (
    <TactileButton color="yellow" size={size} onClick={onClick}>
      {name}
    </TactileButton>
  );

  return href ? <Link to={href}>{button}</Link> : button;
};
