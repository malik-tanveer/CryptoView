import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCoins } from "../services/api";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const fmt = (n) =>
  n >= 1e12
    ? `$${(n / 1e12).toFixed(2)}T`
    : n >= 1e9
    ? `$${(n / 1e9).toFixed(2)}B`
    : n >= 1e6
    ? `$${(n / 1e6).toFixed(2)}M`
    : `$${n?.toLocaleString()}`;

const pct = (n) => (n >= 0 ? `+${n?.toFixed(2)}%` : `${n?.toFixed(2)}%`);

const CoinRow = ({ coin, rank }) => {
  const up = coin.price_change_percentage_24h >= 0;
  return (
    <div className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
      <span className="col-span-1 text-sm text-gray-400">{rank}</span>
      <div className="col-span-4 flex items-center gap-3">
        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">{coin.name}</p>
          <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
        </div>
      </div>
      <span className="col-span-3 text-sm font-semibold text-gray-900">
        ${coin.current_price.toLocaleString()}
      </span>
      <span className={`col-span-2 text-sm font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
        {pct(coin.price_change_percentage_24h)}
      </span>
      <span className="col-span-2 text-xs text-gray-500 hidden md:block">
        {fmt(coin.market_cap)}
      </span>
    </div>
  );
};

const Home = () => {
  const { currentUser } = useAuth();

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [filterDir, setFilterDir] = useState("desc");

  useEffect(() => {
    getCoins()
      .then((res) => {
        setCoins(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "watchlists"),
      where("userId", "==", currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      setWatchlistIds(snap.docs.map((d) => d.data().coinId));
    });
    return () => unsub();
  }, [currentUser]);

  const totalMarketCap = useMemo(
    () => coins.reduce((a, c) => a + (c.market_cap || 0), 0),
    [coins]
  );
  const btcDominance = useMemo(() => {
    const btc = coins.find((c) => c.id === "bitcoin");
    if (!btc || !totalMarketCap) return null;
    return ((btc.market_cap / totalMarketCap) * 100).toFixed(1);
  }, [coins, totalMarketCap]);
  const topGainer = useMemo(
    () =>
      [...coins].sort(
        (a, b) =>
          (b.price_change_percentage_24h || 0) -
          (a.price_change_percentage_24h || 0)
      )[0],
    [coins]
  );
  const topLoser = useMemo(
    () =>
      [...coins].sort(
        (a, b) =>
          (a.price_change_percentage_24h || 0) -
          (b.price_change_percentage_24h || 0)
      )[0],
    [coins]
  );

  const watchlistCoins = useMemo(
    () => coins.filter((c) => watchlistIds.includes(c.id)),
    [coins, watchlistIds]
  );

  const trending = useMemo(
    () =>
      [...coins]
        .sort(
          (a, b) =>
            (b.price_change_percentage_24h || 0) -
            (a.price_change_percentage_24h || 0)
        )
        .slice(0, 6),
    [coins]
  );

  const filtered = useMemo(() => {
    let list = [...coins];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const val = (x) => {
        if (sortBy === "price") return x.current_price;
        if (sortBy === "change") return x.price_change_percentage_24h || 0;
        return x.market_cap || 0;
      };
      return filterDir === "desc" ? val(b) - val(a) : val(a) - val(b);
    });
    return list.slice(0, 10);
  }, [coins, search, sortBy, filterDir]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name =
    currentUser?.displayName?.split(" ")[0] ||
    currentUser?.email?.split("@")[0] ||
    "Trader";

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {greeting}, {name} 
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Here's what's happening in the crypto market right now.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-600">Live CoinGecko API</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Market Cap",
              val: loading ? "—" : fmt(totalMarketCap),
              sub: "All tracked coins",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              ),
            },
            {
              label: "BTC Dominance",
              val: loading ? "—" : `${btcDominance}%`,
              sub: "Of total market cap",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              ),
            },
            {
              label: "Top Gainer 24h",
              val: loading ? "—" : pct(topGainer?.price_change_percentage_24h),
              sub: loading ? "—" : topGainer?.name,
              valColor: "text-green-600",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                </svg>
              ),
            },
            {
              label: "Top Loser 24h",
              val: loading ? "—" : pct(topLoser?.price_change_percentage_24h),
              sub: loading ? "—" : topLoser?.name,
              valColor: "text-red-500",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
                </svg>
              ),
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                <p className={`text-xl font-extrabold mt-0.5 ${s.valColor || "text-gray-900"}`}>
                  {s.val}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Search & Filter Coins</h2>
              <p className="text-xs text-gray-400 mt-0.5">Search any coin and sort by market cap, price, or 24h change</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or symbol… e.g. Bitcoin, ETH"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white text-gray-700 font-medium"
            >
              <option value="market_cap">Sort: Market Cap</option>
              <option value="price">Sort: Price</option>
              <option value="change">Sort: 24h Change</option>
            </select>

            {/* Direction */}
            <button
              onClick={() => setFilterDir((d) => (d === "desc" ? "asc" : "desc"))}
              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:border-blue-900 hover:text-blue-900 transition font-medium text-gray-700 bg-white"
            >
              {filterDir === "desc" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                  </svg>
                  High → Low
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                  </svg>
                  Low → High
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-3 px-5 py-2.5 bg-gray-50 text-xs text-gray-400 font-bold uppercase tracking-wide border-b border-gray-100">
              <span className="col-span-1">#</span>
              <span className="col-span-4">Coin</span>
              <span className="col-span-3">Price</span>
              <span className="col-span-2">24h %</span>
              <span className="col-span-2 hidden md:block">Market Cap</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                Loading live data...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                No coins found for "<span className="font-semibold">{search}</span>"
              </div>
            ) : (
              filtered.map((coin, i) => (
                <Link to={`/coin/${coin.id}`} key={coin.id} className="block">
                  <CoinRow coin={coin} rank={i + 1} />
                </Link>
              ))
            )}
          </div>

          {!search && (
            <div className="mt-4 text-center">
              <Link
                to="/cryptos"
                className="text-sm font-bold text-blue-900 hover:underline"
              >
                View all 2,400+ coins →
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Your Watchlist</h2>
                <p className="text-xs text-gray-400 mt-0.5">Coins you're following</p>
              </div>
              <Link
                to="/watchlist"
                className="text-xs font-bold text-blue-900 hover:underline"
              >
                Manage →
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
            ) : watchlistCoins.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">No coins saved yet</p>
                <p className="text-xs text-gray-400 mb-4">
                  Go to any coin's detail page and click the star to add it here.
                </p>
                <Link
                  to="/cryptos"
                  className="text-xs font-bold text-blue-900 hover:underline"
                >
                  Browse coins →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {watchlistCoins.slice(0, 5).map((coin) => {
                  const up = coin.price_change_percentage_24h >= 0;
                  return (
                    <Link
                      to={`/coin/${coin.id}`}
                      key={coin.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{coin.name}</p>
                          <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ${coin.current_price.toLocaleString()}
                        </p>
                        <p className={`text-xs font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
                          {pct(coin.price_change_percentage_24h)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
                {watchlistCoins.length > 5 && (
                  <Link
                    to="/watchlist"
                    className="block text-center text-xs font-bold text-blue-900 hover:underline pt-1"
                  >
                    +{watchlistCoins.length - 5} more coins → View all
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Trending Now</h2>
                <p className="text-xs text-gray-400 mt-0.5">Top gainers in the last 24h</p>
              </div>
              <Link
                to="/trending"
                className="text-xs font-bold text-blue-900 hover:underline"
              >
                See all →
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
            ) : (
              <div className="space-y-3">
                {trending.map((coin, i) => {
                  const up = coin.price_change_percentage_24h >= 0;
                  return (
                    <Link
                      to={`/coin/${coin.id}`}
                      key={coin.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-xs font-bold text-gray-300">
                          {i + 1}
                        </span>
                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{coin.name}</p>
                          <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ${coin.current_price.toLocaleString()}
                        </p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                          {pct(coin.price_change_percentage_24h)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Top 10 by Market Cap</h2>
              <p className="text-xs text-gray-400 mt-0.5">Largest cryptocurrencies ranked by market capitalization</p>
            </div>
            <Link to="/cryptos" className="text-xs font-bold text-blue-900 hover:underline">
              View all →
            </Link>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-3 px-5 py-2.5 bg-gray-50 text-xs text-gray-400 font-bold uppercase tracking-wide border-b border-gray-100">
              <span className="col-span-1">#</span>
              <span className="col-span-4">Coin</span>
              <span className="col-span-3">Price</span>
              <span className="col-span-2">24h %</span>
              <span className="col-span-2 hidden md:block">Market Cap</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-400 text-sm">Loading live data...</div>
            ) : (
              coins
                .slice(0, 10)
                .map((coin, i) => (
                  <Link to={`/coin/${coin.id}`} key={coin.id} className="block">
                    <CoinRow coin={coin} rank={i + 1} />
                  </Link>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;