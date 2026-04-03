import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white mt-10 border-t">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">

        <div className="flex flex-col md:flex-row md:justify-between gap-8">

          {/* Left: Logo + Description */}
          <div className="flex flex-col gap-4 max-w-sm">
            <img src="/logo2.png" alt="logo" className="w-16 h-16" />
             <p className="text-gray-600 text-sm">
              Stay updated with real-time cryptocurrency prices, market trends, and in-depth charts analysis. CryptoView helps you track top coins. All your crypto insights in one place.
            </p>
          </div>

          {/* Right: Nav Links + Contact */}
          <div className="flex flex-col gap-4">
            <div className="text-gray-800 font-bold text-2xl mb-2">Nav Links</div>

            {/* Nav Links 2 lines */}
            <div className="grid grid-cols-2 gap-2 text-gray-700 font-medium">
              <Link to="/home" className="hover:text-gray-900">Home</Link>
              <Link to="/trending" className="hover:text-gray-900">Trending</Link>
              <Link to="/about" className="hover:text-gray-900">About</Link>
              <Link to="/cryptos" className="hover:text-gray-900">Cryptocurrencies</Link>
              <Link to="/watchlist" className="hover:text-gray-900">Watchlist</Link>
              <Link to="/help" className="hover:text-gray-900">Help</Link>
            </div>

            </div>
            {/* Contact / Connect Section */}
            <div className="mt-4 text-gray-600 text-sm flex flex-col gap-2">
              <span>Contact us at:</span>
              <a href="mailto:mtanveerdev.33@gmail.com" className="hover:text-gray-900">
                mtanveerdev.33@gmail.com
              </a>
              <div className="flex gap-4 mt-1">
                <a href="https://github.com/malik-tanveer" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                  <FaGithub size={25} />
                </a>
                <a href="https://www.linkedin.com/in/malik-tanveer-8bbaa13b2" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                  <FaLinkedin size={25} />
                </a>
              </div>

          </div>

        </div>

        <div className="w-10/12 mx-auto border-t border-gray-300"></div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center px-2">
          <p className="text-gray-500 text-sm mb-2 md:mb-0">
            © 2026 CryptoView. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm md:text-right">
            Designed & Developed by Malik Tanveer
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;