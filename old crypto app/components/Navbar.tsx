import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-yellow-400">
          CryptoView
        </Link>
        <ul className="flex gap-4">
          <li>
            <Link to="/" className="hover:text-yellow-300">Home</Link>
          </li>
          <li>
            <Link to="/exchanges" className="hover:text-yellow-300">Exchanges</Link>
          </li>
          <li>
            <Link to="/watchlist" className="hover:text-yellow-300">Watchlist</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
