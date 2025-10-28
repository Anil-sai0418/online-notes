import { Routes, Route, BrowserRouter } from "react-router-dom";
import FullScreenComponent from "./componets/first";
import Home from "./componets/Home";
import NotFound from "./componets/404";

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