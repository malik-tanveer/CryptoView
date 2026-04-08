import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center px-6">

      <div className="bg-white border border-gray-200 rounded-2xl p-10 md:p-14 max-w-lg w-full text-center shadow-sm">

        {/* Icon */}
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* 404 */}
        <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-3">
          Error 404
        </p>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 text-base leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to tracking crypto.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:border-blue-900 hover:text-blue-900 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-black transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go to Home
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-4">Or jump to a page:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/coin",      label: "Coins"     },
              { to: "/trending",  label: "Trending"  },
              { to: "/watchlist", label: "Watchlist" },
              { to: "/help",      label: "Help"      },
            ].map(({ to, label }) => (
              <Link
                key={to} to={to}
                className="px-3.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:border-blue-900 hover:text-blue-900 transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Brand */}
      <p className="mt-8 text-xs text-gray-400">
        <Link to="/" className="font-bold text-gray-500 hover:text-blue-900 transition">CryptoView</Link>
        {" "} Real-time crypto tracking
      </p>

    </div>
  );
};

export default NotFound;