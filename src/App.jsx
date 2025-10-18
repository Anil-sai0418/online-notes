import { Routes, Route } from "react-router-dom";
import FullScreenComponent from "./componets/first";
import Home from "./componets/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/FullScreen" element={<FullScreenComponent/>} />
    </Routes>
  );
}

export default App;