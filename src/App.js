import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./components/Game";
import HomePage from "./components/HomePage";
import Settings from "./components/Settings";
import ChooseLocation from "./components/ChooseLocation";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/location" element={<ChooseLocation />} />
          <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
