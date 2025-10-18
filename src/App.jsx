import { Routes, Route, BrowserRouter } from "react-router-dom";
import FullScreenComponent from "./componets/first";
import Home from "./componets/Home";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/FullScreen" element={<FullScreenComponent/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;