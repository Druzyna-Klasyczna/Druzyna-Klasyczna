import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HomePageWithSync from "./pages/HomePageWithSync";
import { Lobby } from "./pages/Lobby";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageWithSync />} />
        <Route path="/lobby" element={<Lobby></Lobby>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
