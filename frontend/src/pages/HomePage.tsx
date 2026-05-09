import { StartButton } from "../components/StartButton"

function HomePage() {
  return (
    <div className="flex flex-col items-center pt-32 h-screen bg-white">
      
      <h1 className="text-6xl font-bold text-black mb-24">
        Card Clash
      </h1>
      <div className="flex flex-row gap-8 border-4 border-black p-8 rounded-xl">
        <StartButton href="/admin-panel" name="Host" />
        <StartButton href="/lobby" name="Join" />
      </div>
      
    </div>
  )
}

export default HomePage