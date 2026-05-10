import type { Card } from "../../types/game";
import { TactileContainer } from "../TactileContainer";
import { CardArt } from "./CardArt";

interface CardPreviewProps {
  card: Card | null;
}

const QuestionBody = ({ card }: { card: Extract<Card, { kind: "QUESTION" }> }) => (
  <div className="flex h-full w-full flex-col gap-3">
    <p className="text-center text-lg font-black uppercase leading-tight">
      {card.question}
    </p>
    <ul className="mt-2 flex flex-col gap-2">
      {card.answers.map((answer, idx) => (
        <li
          key={idx}
          className="border-2 border-black bg-white/80 px-3 py-2 text-sm font-bold text-black"
        >
          <span className="mr-2 inline-block w-5 text-black/60">
            {String.fromCharCode(65 + idx)}.
          </span>
          {answer}
        </li>
      ))}
    </ul>
  </div>
);

const SupportBody = ({
  card,
}: {
  card: Extract<Card, { kind: "POWER_UP" | "DEBUFF" | "EFFECT" }>;
}) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
    <h3 className="text-2xl font-black uppercase">{card.name}</h3>
    <p className="text-sm font-bold leading-snug">{card.description}</p>
  </div>
);

export const CardPreview = ({ card }: CardPreviewProps) => (
  <TactileContainer className="!flex-col !items-stretch !justify-start">
    <h2 className="mb-4 border-b-4 border-black pb-2 text-center text-xl uppercase text-white">
      Podgląd karty
    </h2>

    {card ? (
      <div className="flex flex-1 items-stretch">
        <CardArt card={card} size="lg" className="min-h-[20rem]">
          {card.kind === "QUESTION" ? (
            <QuestionBody card={card} />
          ) : (
            <SupportBody card={card} />
          )}
        </CardArt>
      </div>
    ) : (
      <div className="flex flex-1 items-center justify-center text-center text-lg font-bold text-gray-400">
        Najedź na kartę,
        <br />
        aby zobaczyć szczegóły
      </div>
    )}
  </TactileContainer>
);
