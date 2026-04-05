import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  Home,
  Info,
  BarChart3,
  TrendingUp,
  Star,
  HelpCircle,
  LogIn,
  UserPlus,
} from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  return (
    <nav className="w-full bg-white border-b shadow-sm relative">
      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo2.png" alt="logo" className="w-14 h-14" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/cryptos" className="nav-link">Cryptocurrencies</Link>
          <Link to="/trending" className="nav-link">Trending</Link>
          <Link to="/watchlist" className="nav-link">Watchlist</Link>
          <Link to="/help" className="nav-link">Help</Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {!currentUser ? (
            <>
              <Link to="/login">
                <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                  <LogIn size={16} className="inline mr-1" /> Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700">
                  <UserPlus size={16} className="inline mr-1" /> Sign Up
                </button>
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-full">
  {/* Avatar */}
  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold">
    {(currentUser.displayName || currentUser.email).charAt(0).toUpperCase()}
  </div>

  {/* Name */}
  <div className="flex flex-col leading-tight">
    <span className="text-xs text-gray-500">Welcome back</span>
    <span className="text-sm font-semibold text-gray-800">
      {currentUser.displayName || currentUser.email}
    </span>
  </div>
</div>
              <button
                onClick={logout}
                className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-400"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <img src="/logo2.png" className="w-12 h-12" />
          <button onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-5 p-5 text-gray-700 font-medium">
          <Link to="/home" onClick={() => setMenuOpen(false)} className="flex gap-3"><Home size={18}/> Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="flex gap-3"><Info size={18}/> About</Link>
          <Link to="/cryptos" onClick={() => setMenuOpen(false)} className="flex gap-3"><BarChart3 size={18}/> Cryptos</Link>
          <Link to="/trending" onClick={() => setMenuOpen(false)} className="flex gap-3"><TrendingUp size={18}/> Trending</Link>
          <Link to="/watchlist" onClick={() => setMenuOpen(false)} className="flex gap-3"><Star size={18}/> Watchlist</Link>
          <Link to="/help" onClick={() => setMenuOpen(false)} className="flex gap-3"><HelpCircle size={18}/> Help</Link>

          {/* Auth */}
          <div className="mt-6 flex flex-col gap-3">
            {!currentUser ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <button className="w-full border py-2 rounded-lg flex items-center justify-center gap-2">
                    <LogIn size={16}/> Login
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <button className="w-full bg-gray-900 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                    <UserPlus size={16}/> Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <>
                <span className="text-center text-sm">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-red-500 text-white py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;