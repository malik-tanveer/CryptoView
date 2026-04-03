import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Info, BarChart3, TrendingUp, Star, HelpCircle, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (<nav className="w-full bg-white border-b shadow-sm relative">


        {/* TOP BAR */}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">

            {/* ✅ Logo */}
            <Link to="/" className="flex items-center gap-3">
                <img src="/logo2.png" alt="logo" className="w-14 h-14 object-contain" />
            </Link>

            {/* ✅ Desktop Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
                <Link to="/home" className="nav-link">Home</Link>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/cryptos" className="nav-link">Cryptocurrencies</Link>
                <Link to="/trending" className="nav-link">Trending</Link>
                <Link to="/watchlist" className="nav-link">Watchlist</Link>
                <Link to="/help" className="nav-link">Help</Link>
            </div>

            {/* ✅ Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
                <Link to="/login">
                    <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                        <LogIn style={{ display: "inline-block", paddingRight: "4px" }} size={16} /> Login
                    </button>
                </Link>
                <Link to="/signup">
                    <button className="px-4 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700">
                        <UserPlus style={{ display: "inline-block", paddingRight: "4px" }} size={16} /> Sign Up
                    </button>
                </Link>
            </div>

            {/* ✅ Mobile Menu Button */}
            <button
                className="md:hidden text-gray-700"
                onClick={() => setMenuOpen(true)}
            >
                <Menu size={28} />
            </button>
        </div>

        {/* 🔥 OVERLAY */}
        {menuOpen && (
            <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setMenuOpen(false)}
            />
        )}

        {/* 🔥 SIDEBAR */}
        <div
            className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 
    ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >

            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <img src="/logo2.png" alt="logo" className="w-12 h-12" />
                <button onClick={() => setMenuOpen(false)}>
                    <X />
                </button>
            </div>

            {/* Sidebar Links */}
            <div className="flex flex-col gap-5 p-5 text-gray-700 font-medium">

                <Link to="/home" className="flex items-center gap-3 nav-link" onClick={() => setMenuOpen(false)}>
                    <Home style={{ display: "inline-block", paddingRight: "4px" }} size={18} /> Home
                </Link>

                <Link to="/about" className="flex items-center gap-3 nav-link" onClick={() => setMenuOpen(false)}>
                    <Info style={{ display: "inline-block", paddingRight: "4px" }} size={18} /> About
                </Link>

                <Link to="/cryptos" className="flex items-center gap-3 nav-link" onClick={() => setMenuOpen(false)}>
                    <BarChart3 style={{ display: "inline-block", paddingRight: "4px" }} size={18} /> Cryptocurrencies
                </Link>

                <Link to="/trending" className="flex items-center gap-3 nav-link" onClick={() => setMenuOpen(false)}>
                    <TrendingUp style={{ display: "inline-block", paddingRight: "4px" }} size={18} /> Trending
                </Link>

                <Link to="/watchlist" className="flex items-center gap-3 nav-link" onClick={() => setMenuOpen(false)}>
                    <Star style={{ display: "inline-block", paddingRight: "4px" }} size={18} /> Watchlist
                </Link>

                <Link to="/help" className="flex items-center gap-3 nav-link" onClick={() => setMenuOpen(false)}>
                    <HelpCircle style={{ display: "inline-block", paddingRight: "4px" }} size={18} /> Help
                </Link>

                {/* Auth */}
                <div className="mt-6 flex flex-col gap-3">
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg">
                            <LogIn style={{ display: "inline-block", paddingRight: "4px" }} size={16} /> Login
                        </button>
                    </Link>

                    <Link to="/signup" onClick={() => setMenuOpen(false)}>
                        <button className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2 rounded-lg">
                            <UserPlus style={{ display: "inline-block", paddingRight: "4px" }} size={16} /> Sign Up
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    </nav>


    );
};

export default Navbar;
