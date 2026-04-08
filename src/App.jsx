import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Help from "./pages/Help";
import Trending from "./pages/Trending";
import Watchlist from "./pages/Watchlist";
import Coin from "./pages/Coin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Start from "./pages/Start";
import CoinDetail from "./pages/CoinDetail";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/404";


function App() {

  const location = useLocation();
  const hideNavFooter = ["/login", "/signup"].includes(location.pathname);
  return (
    <AuthProvider>
      {!hideNavFooter && <Navbar />}
      <div className="mt-16">
        <Routes >
          {/* Public Routes */}

          <Route path="/" element={<Start />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coin/:id"
            element={
              <ProtectedRoute>
                <CoinDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trending"
            element={
              <ProtectedRoute>
                <Trending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coin"
            element={
              <ProtectedRoute>
                <Coin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!hideNavFooter && <Footer />}
    </AuthProvider>
  );
}

export default App;