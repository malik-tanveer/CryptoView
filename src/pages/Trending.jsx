import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getCoins } from "../services/api";

const fmt = (n) => {
  if (n == null) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
};

const pct = (n) =>
  n == null ? "—" : n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`;

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-gray-100" />
      <div className="space-y-1.5">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="h-2 w-12 bg-gray-100 rounded" />
      </div>
    </div>
    <div className="h-4 w-20 bg-gray-100 rounded mb-2" />
    <div className="h-3 w-16 bg-gray-100 rounded" />
  </div>
);

const SkeletonRow = () => (
  <div className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-gray-100 animate-pulse">
    <div className="col-span-1 h-3 bg-gray-100 rounded" />
    <div className="col-span-4 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100" />
      <div className="space-y-1.5">
        <div className="h-3 w-20 bg-gray-100 rounded" />
        <div className="h-2 w-10 bg-gray-100 rounded" />
      </div>
    </div>
    <div className="col-span-2 h-3 bg-gray-100 rounded" />
    <div className="col-span-2 h-5 w-14 bg-gray-100 rounded-lg" />
    <div className="col-span-2 h-3 bg-gray-100 rounded hidden md:block" />
    <div className="col-span-1 h-7 bg-gray-100 rounded-lg" />
  </div>
);

const Trending = () => {
  const [trending, setTrending]     = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [activeTab, setActiveTab]   = useState("trending");
  const [error, setError]           = useState(false);

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/search/trending")
      .then((res) => {
        setTrending(res.data.coins || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getCoins()
      .then((res) => {
        const sorted = [...res.data].sort(
          (a, b) =>
            (b.price_change_percentage_24h || 0) -
            (a.price_change_percentage_24h || 0)
        );
        setTopGainers(sorted.slice(0, 10));
        setTopLosers([...sorted].reverse().slice(0, 10));
        setCoinsLoading(false);
      })
      .catch(() => setCoinsLoading(false));
  }, []);

  const tabs = [
    { key: "trending", label: "🔥 Trending" },
    { key: "gainers",  label: "📈 Top Gainers" },
    { key: "losers",   label: "📉 Top Losers" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="bg-blue-900 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">
            Real-Time Market Pulse
          </p>
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Trending Cryptocurrencies
          </h1>
          <p className="text-blue-200 text-base max-w-xl leading-relaxed">
            Discover the hottest coins right now most searched on CoinGecko, biggest 24h gainers,
            and the steepest losers. Updated continuously.
          </p>

          {/* Live indicator */}
          <div className="flex items-center gap-2 mt-5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-blue-200 font-medium">
              Live data CoinGecko API
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-1.5 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
                activeTab === tab.key
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "trending" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Most Searched on CoinGecko</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Top 15 most searched coins in the last 24 hours
                </p>
              </div>
              {!loading && (
                <span className="text-xs font-bold text-gray-400">
                  {trending.length} coins
                </span>
              )}
            </div>

            {error ? (
              <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Failed to load trending data</p>
                <p className="text-xs text-gray-400 mb-4">CoinGecko API rate limit may have been hit.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2.5 bg-blue-900 text-white text-sm font-bold rounded-xl hover:bg-black transition"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading
                  ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
                  : trending.map((item, i) => {
                      const coin = item.item;
                      const priceUsd = coin.data?.price
? parseFloat(String(coin.data.price).replace(/[^0-9.]/g, ""))
                        : null;
                      const change = coin.data?.price_change_percentage_24h?.usd;
                      const isUp = (change || 0) >= 0;

                      return (
                        <Link
                          to={`/coin/${coin.id}`}
                          key={coin.id}
                          className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-900 hover:shadow-md transition group"
                        >
                          {/* Rank + coin */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-extrabold text-gray-300 w-5">
                                #{i + 1}
                              </span>
                              <img
                                src={coin.thumb}
                                alt={coin.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-900 transition">
                                  {coin.name}
                                </p>
                                <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                              </div>
                            </div>
                            {/* Market cap rank */}
                            {coin.market_cap_rank && (
                              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">
                                #{coin.market_cap_rank}
                              </span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Price (USD)</p>
                              <p className="text-lg font-extrabold text-gray-900">
                                {coin.data?.price || "—"}
                              </p>
                            </div>
                            {change != null && (
                              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl ${isUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                                  style={{ transform: isUp ? "rotate(0deg)" : "rotate(180deg)" }}>
                                  <polyline points="18 15 12 9 6 15" />
                                </svg>
                                {pct(change)}
                              </span>
                            )}
                          </div>

                          {/* Sparkline */}
                          {coin.data?.sparkline && (
                            <div className="mt-3">
                              <img
                                src={coin.data.sparkline}
                                alt="sparkline"
                                className="w-full h-10 object-contain opacity-70"
                              />
                            </div>
                          )}
                        </Link>
                      );
                    })}
              </div>
            )}
          </>
        )}

        {activeTab === "gainers" && (
          <>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Top Gainers Last 24 Hours</h2>
              <p className="text-xs text-gray-400 mt-1">
                Coins with the highest price increase in the last 24 hours
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-bold uppercase tracking-wide">
                <span className="col-span-1">#</span>
                <span className="col-span-4">Coin</span>
                <span className="col-span-2">Price</span>
                <span className="col-span-2">24h Gain</span>
                <span className="col-span-2 hidden md:block">Market Cap</span>
                <span className="col-span-1" />
              </div>

              {coinsLoading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : topGainers.map((coin, i) => (
                    <div
                      key={coin.id}
                      className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-gray-100 last:border-0 hover:bg-green-50/30 transition"
                    >
                      <span className="col-span-1 text-sm text-gray-400">{i + 1}</span>
                      <Link to={`/coin/${coin.id}`} className="col-span-4 flex items-center gap-3 group">
                        <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-blue-900 transition">
                            {coin.name}
                          </p>
                          <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                        </div>
                      </Link>
                      <div className="col-span-2">
                        <p className="text-sm font-bold text-gray-900">
                          ${coin.current_price?.toLocaleString()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-green-50 text-green-700">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                          {pct(coin.price_change_percentage_24h)}
                        </span>
                      </div>
                      <div className="col-span-2 hidden md:block">
                        <p className="text-sm text-gray-600 font-medium">{fmt(coin.market_cap)}</p>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Link
                          to={`/coin/${coin.id}`}
                          className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-600 hover:text-white transition"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
            </div>
          </>
        )}

        {activeTab === "losers" && (
          <>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Top Losers Last 24 Hours</h2>
              <p className="text-xs text-gray-400 mt-1">
                Coins with the steepest price drop in the last 24 hours
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-bold uppercase tracking-wide">
                <span className="col-span-1">#</span>
                <span className="col-span-4">Coin</span>
                <span className="col-span-2">Price</span>
                <span className="col-span-2">24h Drop</span>
                <span className="col-span-2 hidden md:block">Market Cap</span>
                <span className="col-span-1" />
              </div>

              {coinsLoading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : topLosers.map((coin, i) => (
                    <div
                      key={coin.id}
                      className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-gray-100 last:border-0 hover:bg-red-50/20 transition"
                    >
                      <span className="col-span-1 text-sm text-gray-400">{i + 1}</span>
                      <Link to={`/coin/${coin.id}`} className="col-span-4 flex items-center gap-3 group">
                        <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-blue-900 transition">
                            {coin.name}
                          </p>
                          <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                        </div>
                      </Link>
                      <div className="col-span-2">
                        <p className="text-sm font-bold text-gray-900">
                          ${coin.current_price?.toLocaleString()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-red-50 text-red-600">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                            style={{ transform: "rotate(180deg)" }}>
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                          {pct(coin.price_change_percentage_24h)}
                        </span>
                      </div>
                      <div className="col-span-2 hidden md:block">
                        <p className="text-sm text-gray-600 font-medium">{fmt(coin.market_cap)}</p>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Link
                          to={`/coin/${coin.id}`}
                          className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-5">
          <div>
            <p className="text-sm font-bold text-gray-900">Want to track these coins?</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Open any coin and click the star to add it to your personal watchlist.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/coin"
              className="px-5 py-2.5 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-black transition"
            >
              All Coins →
            </Link>
            <Link
              to="/watchlist"
              className="px-5 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:border-blue-900 hover:text-blue-900 transition"
            >
              My Watchlist
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Trending;