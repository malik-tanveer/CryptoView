import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/A";
import  from "./pages/";
import  from "./pages/";
// import CoinDetails from "./pages/CoinDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/trending" element={<Trending/>} />
<Route path="/watchlist" element={<Watchlist />} />
<Route path="/help" element={<Help />} />

        {/* <Route path="/coin/:id" element={<CoinDetails />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
