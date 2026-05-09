import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePageWithSync";
import { Lobby } from "./pages/Lobby";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby" element={<Lobby></Lobby>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
