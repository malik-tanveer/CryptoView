import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const LINKS_COL1 = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/help", label: "Help" },
];

const LINKS_COL2 = [
  { to: "/coin", label: "Coins" },
  { to: "/trending", label: "Trending" },
  { to: "/watchlist", label: "Watchlist" },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo2.png" alt="CryptoView" className="w-10 h-10 object-contain" />
              <span className="text-base font-extrabold text-blue-900">CryptoView</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Real-time cryptocurrency prices, interactive charts, and a personal watchlist —
              all in one free platform powered by CoinGecko.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://github.com/malik-tanveer"
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-blue-900 hover:text-blue-900 transition"
              >
                <FaGithub size={17} />
              </a>
              <a
                href="https://www.linkedin.com/in/malik-tanveer-8bbaa13b2"
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-blue-900 hover:text-blue-900 transition"
              >
                <FaLinkedin size={17} />
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Platform</h4>
            <div className="flex flex-col gap-2.5">
              {LINKS_COL1.map(({ to, label }) => (
                <Link
                  key={to} to={to}
                  className="text-sm text-gray-600 font-medium hover:text-blue-900 transition w-fit"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Market links */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Market</h4>
            <div className="flex flex-col gap-2.5">
              {LINKS_COL2.map(({ to, label }) => (
                <Link
                  key={to} to={to}
                  className="text-sm text-gray-600 font-medium hover:text-blue-900 transition w-fit"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <a
                  href="mailto:mtanveerdev.33@gmail.com"
                  className="text-sm text-gray-700 font-medium hover:text-blue-900 transition break-all"
                >
                  mtanveerdev.33@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Data source</p>
                <a
                  href="https://www.coingecko.com"
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-gray-700 font-medium hover:text-blue-900 transition"
                >
                  CoinGecko API
                </a>
              </div>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live market data
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © 2026 CryptoView. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Designed & Developed by{" "}
            <a
              href="https://www.linkedin.com/in/malik-tanveer-8bbaa13b2"
              target="_blank" rel="noopener noreferrer"
              className="font-semibold text-gray-600 hover:text-blue-900 transition"
            >
              Malik Tanveer
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;