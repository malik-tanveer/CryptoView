import { Link } from "react-router-dom";

const Navbar = () => {
    return (<nav className="w-full bg-[#0a192f] text-white shadow-md"> <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">


        {/* ✅ Logo */}
        <div className="flex items-center gap-2">
            <img src="/logo2.png" alt="logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-wide">
                CryptoView
            </h1>
        </div>

        {/* ✅ Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/about" className="hover:text-gray-300">About</Link>
            <Link to="/help" className="hover:text-gray-300">Help</Link>
            <Link to="/cryptos" className="hover:text-gray-300">Cryptocurrencies</Link>
            <Link to="/trending" className="hover:text-gray-300">Trending</Link>
            <Link to="/watchlist" className="hover:text-gray-300">Watchlist</Link>
        </div>

        {/* ✅ Right Side (Auth Buttons) */}
        <div className="flex items-center gap-3">
            <button className="px-4 py-1 border border-white rounded hover:bg-white hover:text-black transition">
                Login
            </button>
            <button className="px-4 py-1 bg-white text-black rounded hover:bg-gray-200 transition">
                Sign Up
            </button>
        </div>

    </div>
    </nav>


    );
};

export default Navbar;
