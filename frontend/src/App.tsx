import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePageWithSync from "./pages/HomePageWithSync";
import { Lobby } from "./pages/Lobby";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageWithSync />} />
        <Route path="/lobby" element={<Lobby></Lobby>} />
        <Route path="/game" element={<GamePage></GamePage>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
