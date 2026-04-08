import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCoins } from "../services/api";
import { db } from "../firebase/config.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

const fmt = (n) => {
  if (n == null) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
};

const pct = (n) =>
  n == null ? "—" : n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`;

const SkeletonRow = () => (
  <div className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-gray-100 animate-pulse">
    <div className="col-span-1 h-3 bg-gray-100 rounded" />
    <div className="col-span-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gray-100" />
      <div className="space-y-1.5">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="h-2 w-12 bg-gray-100 rounded" />
      </div>
    </div>
    <div className="col-span-2 h-3 bg-gray-100 rounded" />
    <div className="col-span-2 h-5 w-16 bg-gray-100 rounded-lg" />
    <div className="col-span-2 h-3 bg-gray-100 rounded hidden md:block" />
    <div className="col-span-1 h-7 bg-gray-100 rounded-lg" />
  </div>
);

const Watchlist = () => {
  const { currentUser } = useAuth();

  const [allCoins, setAllCoins] = useState([]);
  const [watchlistDocs, setWatchlistDocs] = useState([]); // {id, coinId}
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    getCoins()
      .then((res) => setAllCoins(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "watchlists"),
      where("userId", "==", currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      setWatchlistDocs(snap.docs.map((d) => ({ id: d.id, coinId: d.data().coinId })));
    });
    return () => unsub();
  }, [currentUser]);

  const removeFromWatchlist = async (docId) => {
    setRemoving(docId);
    try {
      await deleteDoc(doc(db, "watchlists", docId));
    } catch (e) {
      console.error(e);
    }
    setRemoving(null);
  };

  const watchlistCoinIds = watchlistDocs.map((d) => d.coinId);
  let watchlistCoins = allCoins
    .filter((c) => watchlistCoinIds.includes(c.id))
    .map((c) => ({
      ...c,
      docId: watchlistDocs.find((d) => d.coinId === c.id)?.id,
    }));

  if (search.trim()) {
    const q = search.toLowerCase();
    watchlistCoins = watchlistCoins.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }

  watchlistCoins.sort((a, b) => {
    let aVal, bVal;
    if (sortBy === "price") { aVal = a.current_price; bVal = b.current_price; }
    else if (sortBy === "change") { aVal = a.price_change_percentage_24h || 0; bVal = b.price_change_percentage_24h || 0; }
    else { aVal = a.market_cap; bVal = b.market_cap; }
    return sortDir === "desc" ? bVal - aVal : aVal - bVal;
  });

  const totalValue = watchlistCoins.reduce((sum, c) => sum + (c.market_cap || 0), 0);
  const gainers = watchlistCoins.filter((c) => c.price_change_percentage_24h > 0).length;
  const losers = watchlistCoins.filter((c) => c.price_change_percentage_24h < 0).length;

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortBy(col); setSortDir("desc"); }
  };

  const SortIcon = ({ col }) => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
      className={`inline ml-1 ${sortBy === col ? "opacity-100" : "opacity-25"}`}
      style={{ transform: sortBy === col && sortDir === "asc" ? "rotate(180deg)" : "rotate(0deg)" }}>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">

      <div className="bg-blue-900 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">My Portfolio</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">My Watchlist</h1>
          <p className="text-blue-200 text-base leading-relaxed max-w-lg">
            All the coins you're following in one place. Click any coin to view its full chart and details.
          </p>

          {/* Summary badges */}
          {!loading && watchlistDocs.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="bg-white/10 rounded-xl px-4 py-2 text-sm">
                <span className="text-blue-200">Watching: </span>
                <span className="text-white font-bold">{watchlistDocs.length} coins</span>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 text-sm">
                <span className="text-blue-200">Gainers: </span>
                <span className="text-green-400 font-bold">{gainers}</span>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 text-sm">
                <span className="text-blue-200">Losers: </span>
                <span className="text-red-400 font-bold">{losers}</span>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 text-sm">
                <span className="text-blue-200">Combined Market Cap: </span>
                <span className="text-white font-bold">{fmt(totalValue)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {!loading && watchlistDocs.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl py-24 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Your watchlist is empty</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
              You haven't added any coins yet. Browse the full coin list and click the star icon
              on any coin's detail page to add it here.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/coin"
                className="px-7 py-3 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-black transition"
              >
                Browse Coins →
              </Link>
              <Link
                to="/trending"
                className="px-7 py-3 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:border-blue-900 hover:text-blue-900 transition"
              >
                See Trending
              </Link>
            </div>
          </div>
        )}

        {(loading || watchlistDocs.length > 0) && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search your watchlist…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
              {/* Sort */}
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
                onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:border-blue-900 hover:text-blue-900 transition font-medium text-gray-700"
              >
                {sortDir === "desc" ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                  </svg>
                )}
                {sortDir === "desc" ? "High → Low" : "Low → High"}
              </button>
            </div>
          </div>
        )}

        {(loading || watchlistDocs.length > 0) && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-bold uppercase tracking-wide">
              <span className="col-span-1">#</span>
              <span className="col-span-4">Coin</span>
              <button className="col-span-2 text-left hover:text-blue-900 transition" onClick={() => handleSort("price")}>
                Price <SortIcon col="price" />
              </button>
              <button className="col-span-2 text-left hover:text-blue-900 transition" onClick={() => handleSort("change")}>
                24h % <SortIcon col="change" />
              </button>
              <button className="col-span-2 text-left hover:text-blue-900 transition hidden md:block" onClick={() => handleSort("market_cap")}>
                Market Cap <SortIcon col="market_cap" />
              </button>
              <span className="col-span-1 text-right">Remove</span>
            </div>

            {/* Rows */}
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : watchlistCoins.length === 0 && search ? (
              <div className="py-16 text-center">
                <p className="text-sm text-gray-500">No coins match "<span className="font-semibold">{search}</span>"</p>
                <button onClick={() => setSearch("")} className="mt-3 text-xs font-bold text-blue-900 hover:underline">
                  Clear search
                </button>
              </div>
            ) : (
              watchlistCoins.map((coin, i) => {
                const up = coin.price_change_percentage_24h >= 0;
                return (
                  <div
                    key={coin.id}
                    className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-gray-100 last:border-0 hover:bg-blue-50/30 transition"
                  >
                    <span className="col-span-1 text-sm text-gray-400">{i + 1}</span>

                    {/* Coin info */}
                    <Link to={`/coin/${coin.id}`} className="col-span-4 flex items-center gap-3 group">
                      <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-900 transition leading-tight">
                          {coin.name}
                        </p>
                        <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                      </div>
                    </Link>

                    {/* Price */}
                    <div className="col-span-2">
                      <p className="text-sm font-bold text-gray-900">
                        ${coin.current_price?.toLocaleString()}
                      </p>
                    </div>

                    {/* 24h change */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                          style={{ transform: up ? "rotate(0deg)" : "rotate(180deg)" }}>
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                        {pct(coin.price_change_percentage_24h)}
                      </span>
                    </div>

                    {/* Market cap */}
                    <div className="col-span-2 hidden md:block">
                      <p className="text-sm text-gray-600 font-medium">{fmt(coin.market_cap)}</p>
                    </div>

                    {/* Remove */}
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => removeFromWatchlist(coin.docId)}
                        disabled={removing === coin.docId}
                        title="Remove from watchlist"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                      >
                        {removing === coin.docId ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {!loading && watchlistDocs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-5">
            <div>
              <p className="text-sm font-bold text-gray-900">
                Tracking {watchlistDocs.length} coin{watchlistDocs.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Add more coins from the Cryptos page or Trending page.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/coin"
                className="px-5 py-2.5 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-black transition"
              >
                Add More Coins →
              </Link>
              <Link
                to="/trending"
                className="px-5 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:border-blue-900 hover:text-blue-900 transition"
              >
                See Trending
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Watchlist;