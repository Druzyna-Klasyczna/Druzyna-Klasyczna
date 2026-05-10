import { useState } from "react";
import { TactileContainer } from "../components/TactileContainer";

function GamePage() {
  // Tymczasowy stan trzymający po prostu nazwę karty (tekst)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Zwykła tablica z nazwami kart do testów
  const myHand = ["Karta 1", "Karta 2", "Karta 3", "Karta 4", "Karta 5"];

  return (
    <div className="h-screen w-full bg-[#e53935] p-6 flex flex-col gap-6 overflow-hidden font-bold">
      
      {/* --- GÓRNA CZĘŚĆ (3 KOLUMNY) --- */}
      <div className="flex-1 grid grid-cols-4 gap-8 min-h-0">
        
        {/* LEWA KOLUMNA (Lista graczy) - 1/4 */}
        <div className="col-span-1 h-full flex">
          <TactileContainer className="w-full h-full !flex-col !items-stretch !justify-start">
            <h2 className="text-white text-2xl mb-4 uppercase border-b-4 border-black pb-2">Players</h2>
            <div className="text-gray-400 italic">Lista graczy pojawi się tutaj...</div>
          </TactileContainer>
        </div>

        {/* ŚRODKOWA KOLUMNA (Stół gry) - 2/4 (Dwa razy szersza) */}
        <div className="col-span-2 h-full flex">
          <TactileContainer className="w-full h-full !flex-col !items-center !justify-center relative">
            <h2 className="absolute top-4 left-4 text-white text-xl uppercase">Main Table</h2>
            <div className="w-32 h-32 rounded-full border-4 border-black bg-yellow-400 flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-black">
              Deck
            </div>
          </TactileContainer>
        </div>

        {/* PRAWA KOLUMNA (Podgląd karty) - 1/4 */}
        <div className="col-span-1 h-full flex">
          <TactileContainer className="w-full h-full !flex-col !items-stretch !justify-start">
            <h2 className="text-white text-xl mb-4 uppercase text-center border-b-4 border-black pb-2">Card Preview</h2>
            
            {hoveredCard ? (
              <div className="flex flex-col h-full text-white items-center justify-center">
                <h3 className="text-4xl font-black text-yellow-400 text-center">{hoveredCard}</h3>
                <p className="mt-4 text-gray-300 text-center">To jest tymczasowy podgląd. Szczegóły pojawią się później.</p>
              </div>
            ) : (
              <div className="flex flex-grow items-center justify-center text-gray-500 font-bold text-xl text-center">
                Wskaż kartę,<br/>aby zobaczyć podgląd
              </div>
            )}
          </TactileContainer>
        </div>

      </div>

      {/* --- DOLNA CZĘŚĆ (Ręka gracza) --- */}
      <TactileContainer className="h-64 !flex-col !items-stretch !justify-end relative pb-2 pt-12">
        <h2 className="absolute top-4 left-4 text-white text-xl uppercase">Your Hand</h2>
        
        <div className="flex items-end justify-center gap-4 h-full">
          {/* Renderujemy proste placeholdery na podstawie tablicy myHand */}
          {myHand.map((cardName) => (
            <div 
              key={cardName} 
              className="w-32 h-48 border-[3px] border-black bg-yellow-400 rounded-md flex items-center justify-center text-black font-black text-center p-2 cursor-pointer transition-transform hover:-translate-y-8"
              onMouseEnter={() => setHoveredCard(cardName)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {cardName}
            </div>
          ))}
        </div>
      </TactileContainer>

    </div>
  );
}

export default GamePage;