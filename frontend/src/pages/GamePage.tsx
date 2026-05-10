import { useState } from "react";
import { TactileContainer } from "../components/TactileContainer";

const PLACEHOLDER_HAND = ["Karta 1", "Karta 2", "Karta 3", "Karta 4", "Karta 5"];

const GamePage = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-full flex-col gap-6 overflow-hidden bg-[#e53935] p-6 font-bold">
      <div className="grid min-h-0 flex-1 grid-cols-4 gap-8">
        <TactileContainer className="!flex-col !items-stretch !justify-start">
          <h2 className="mb-4 border-b-4 border-black pb-2 text-2xl uppercase text-white">
            Players
          </h2>
          <div className="italic text-gray-400">
            Lista graczy pojawi się tutaj...
          </div>
        </TactileContainer>

        <TactileContainer className="relative col-span-2 !flex-col !items-center !justify-center">
          <h2 className="absolute left-4 top-4 text-xl uppercase text-white">
            Main Table
          </h2>
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-black bg-yellow-400 text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            Deck
          </div>
        </TactileContainer>

        <TactileContainer className="!flex-col !items-stretch !justify-start">
          <h2 className="mb-4 border-b-4 border-black pb-2 text-center text-xl uppercase text-white">
            Card Preview
          </h2>
          {hoveredCard ? (
            <div className="flex h-full flex-col items-center justify-center text-white">
              <h3 className="text-center text-4xl font-black text-yellow-400">
                {hoveredCard}
              </h3>
              <p className="mt-4 text-center text-gray-300">
                To jest tymczasowy podgląd. Szczegóły pojawią się później.
              </p>
            </div>
          ) : (
            <div className="flex flex-grow items-center justify-center text-center text-xl font-bold text-gray-500">
              Wskaż kartę,
              <br />
              aby zobaczyć podgląd
            </div>
          )}
        </TactileContainer>
      </div>

      <TactileContainer className="relative h-64 !flex-col !items-stretch !justify-end pb-2 pt-12">
        <h2 className="absolute left-4 top-4 text-xl uppercase text-white">
          Your Hand
        </h2>

        <div className="flex h-full items-end justify-center gap-4">
          {PLACEHOLDER_HAND.map((cardName) => (
            <div
              key={cardName}
              onMouseEnter={() => setHoveredCard(cardName)}
              onMouseLeave={() => setHoveredCard(null)}
              className="flex h-48 w-32 cursor-pointer items-center justify-center rounded-md border-[3px] border-black bg-yellow-400 p-2 text-center font-black text-black transition-transform hover:-translate-y-8"
            >
              {cardName}
            </div>
          ))}
        </div>
      </TactileContainer>
    </div>
  );
};

export default GamePage;
