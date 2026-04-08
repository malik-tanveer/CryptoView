import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu, X, Home, Info, BarChart3,
  TrendingUp, Star, HelpCircle, LogIn, UserPlus, LogOut,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/dashboard", label: "Home",      icon: Home      },
  { to: "/about",     label: "About",     icon: Info      },
  { to: "/coin",      label: "Coins",     icon: BarChart3 },
  { to: "/trending",  label: "Trending",  icon: TrendingUp},
  { to: "/watchlist", label: "Watchlist", icon: Star      },
  { to: "/help",      label: "Help",      icon: HelpCircle},
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-100 shadow-sm fixed top-0 left-0 right-0 z-30 h-16">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-6">

          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img src="/logo2.png" alt="CryptoView" className="w-10 h-10 object-contain" />
            <span className="text-base font-extrabold text-blue-900 hidden sm:block">CryptoView</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(to)
                    ? "bg-blue-50 text-blue-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
            {!currentUser ? (
              <>
                <Link to="/login">
                  <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition">
                    <LogIn size={14} /> Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition">
                    <UserPlus size={14} /> Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <>
                {/* User pill */}
                <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-900 text-white text-xs font-bold flex-shrink-0">
                    {(currentUser.displayName || currentUser.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] text-gray-400 font-medium">Welcome back</span>
                    <span className="text-xs font-bold text-gray-800 max-w-[120px] truncate">
                      {currentUser.displayName || currentUser.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 transition"
                >
                  <LogOut size={14} /> Logout
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <img src="/logo2.png" alt="CryptoView" className="w-9 h-9 object-contain" />
            <span className="text-base font-extrabold text-blue-900">CryptoView</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isActive(to)
                  ? "bg-blue-900 text-white"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={17} /> {label}
            </Link>
          ))}
        </div>

        {/* Auth section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          {!currentUser ? (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                  <LogIn size={15} /> Login
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition">
                  <UserPlus size={15} /> Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {(currentUser.displayName || currentUser.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-gray-400">Logged in as</span>
                  <span className="text-xs font-bold text-gray-800 truncate">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-16" />
    </>
  );
};

export default Navbar;