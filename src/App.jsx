import { Routes, Route, BrowserRouter } from "react-router-dom";
import FullScreenComponent from "./parts/first";
import Home from "./parts/Home";
import NotFound from "./parts/404";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/online-notes" element={<FullScreenComponent/>} />
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;