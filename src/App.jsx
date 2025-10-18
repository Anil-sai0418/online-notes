import { Routes, Route } from "react-router-dom";
import FullScreenComponent from "./componets/first";
import Home from "./componets/Home";

function App() {
  return (
    <Routes>
      <Route path="/online-notes" element={<Home />} />
      <Route path="/online-notes/FullScreen" element={<FullScreenComponent/>} />
    </Routes>
  );
}

export default App;