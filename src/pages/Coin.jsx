import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getCoins } from "../services/api";

const fmt = (n) => {
  if (n == null || isNaN(n)) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
};

const pct = (n) =>
  n == null ? "—" : n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`;

const ITEMS_PER_PAGE = 50;

const SkeletonRow = () => (
  <div className="grid grid-cols-12 gap-3 px-5 py-4 items-center border-b border-gray-100 animate-pulse">
    <div className="col-span-1 h-3 bg-gray-100 rounded" />
    <div className="col-span-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
      <div className="space-y-1.5 flex-1">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="h-2 w-12 bg-gray-100 rounded" />
      </div>
    </div>
    <div className="col-span-2 h-3 bg-gray-100 rounded" />
    <div className="col-span-2 h-6 w-16 bg-gray-100 rounded-lg" />
    <div className="col-span-2 h-3 bg-gray-100 rounded hidden md:block" />
    <div className="col-span-1 h-3 bg-gray-100 rounded hidden lg:block" />
    <div className="col-span-1 h-7 w-12 bg-gray-100 rounded-lg ml-auto" />
  </div>
);

const CoinRow = ({ coin, rank }) => {
  const up = coin.price_change_percentage_24h > 0;
  const isNeutral = coin.price_change_percentage_24h == null || coin.price_change_percentage_24h === 0;

  return (
    <div className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center border-b border-gray-100 last:border-0 hover:bg-blue-50/40 transition-colors group">
      {/* Rank */}
      <span className="col-span-1 text-sm text-gray-400 font-medium tabular-nums">{rank}</span>

      {/* Coin */}
      <div className="col-span-4 flex items-center gap-3">
        <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-900 transition-colors leading-tight">
            {coin.name}
          </p>
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">{coin.symbol}</p>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2">
        <p className="text-sm font-bold text-gray-900 tabular-nums">
          ${coin.current_price?.toLocaleString(undefined, {
            minimumFractionDigits: coin.current_price < 1 ? 4 : 2,
            maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
          })}
        </p>
      </div>

      {/* 24h change */}
      <div className="col-span-2">
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg tabular-nums ${isNeutral
            ? "bg-gray-100 text-gray-400"
            : up
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}>
          {!isNeutral && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
              style={{ transform: up ? "rotate(0deg)" : "rotate(180deg)" }}>
              <polyline points="18 15 12 9 6 15" />
            </svg>
          )}
          {pct(coin.price_change_percentage_24h)}
        </span>
      </div>

      {/* Market cap */}
      <div className="col-span-2 hidden md:block">
        <p className="text-sm text-gray-600 font-medium tabular-nums">{fmt(coin.market_cap)}</p>
      </div>

      {/* Volume */}
      <div className="col-span-1 hidden lg:block">
        <p className="text-xs text-gray-400 tabular-nums">{fmt(coin.total_volume)}</p>
      </div>

      {/* View */}
      <div className="col-span-1 flex justify-end">
        <Link
          to={`/coin/${coin.id}`}
          onClick={(e) => e.stopPropagation()}
          className="px-3 py-1.5 bg-blue-50 text-blue-900 text-xs font-bold rounded-lg hover:bg-blue-900 hover:text-white transition-colors whitespace-nowrap"
        >
          View
        </Link>
      </div>
    </div>
  );
};

const Coin = () => {
  const [coins, setCoins] = useState([]);
  const [fetchedPages, setFetchedPages] = useState(0);
  const [totalFetching, setTotalFetching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState("all");
  const [changeFilter, setChangeFilter] = useState("all");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(false);
      setCoins([]);
      setFetchedPages(0);

      try {
        // Fetch first page immediately to show data fast
        const first = await getCoins(1);
        setCoins(first.data);
        setFetchedPages(1);
        setLoading(false);

        // Then fetch pages 2–10 in background (2500 coins total)
        setTotalFetching(true);
        for (let p = 2; p <= 10; p++) {
          try {
            const res = await getCoins(p);
            if (!res.data || res.data.length === 0) break;
            setCoins((prev) => {
              const existingIds = new Set(prev.map((c) => c.id));
              const newCoins = res.data.filter((c) => !existingIds.has(c.id));
              return [...prev, ...newCoins];
            });
            setFetchedPages(p);
            // Small delay to respect rate limits
            await new Promise((r) => setTimeout(r, 1200));
          } catch {
            break;
          }
        }
      } catch {
        setError(true);
        setLoading(false);
      } finally {
        setTotalFetching(false);
      }
    };

    fetchAll();
  }, []);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, sortBy, sortDir, priceRange, changeFilter]);

  const filtered = useMemo(() => {
    let list = [...coins];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }

    if (priceRange === "under1") list = list.filter((c) => c.current_price < 1);
    else if (priceRange === "1to100") list = list.filter((c) => c.current_price >= 1 && c.current_price <= 100);
    else if (priceRange === "100to1k") list = list.filter((c) => c.current_price > 100 && c.current_price <= 1000);
    else if (priceRange === "over1k") list = list.filter((c) => c.current_price > 1000);

    if (changeFilter === "gainers") list = list.filter((c) => c.price_change_percentage_24h > 0);
    else if (changeFilter === "losers") list = list.filter((c) => c.price_change_percentage_24h < 0);

    list.sort((a, b) => {
      let av, bv;
      if (sortBy === "price") { av = a.current_price; bv = b.current_price; }
      else if (sortBy === "change") { av = a.price_change_percentage_24h || 0; bv = b.price_change_percentage_24h || 0; }
      else if (sortBy === "volume") { av = a.total_volume; bv = b.total_volume; }
      else { av = a.market_cap; bv = b.market_cap; }
      return sortDir === "desc" ? bv - av : av - bv;
    });

    return list;
  }, [coins, search, sortBy, sortDir, priceRange, changeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const gainers = useMemo(() => coins.filter((c) => c.price_change_percentage_24h > 0).length, [coins]);
  const losers = useMemo(() => coins.filter((c) => c.price_change_percentage_24h < 0).length, [coins]);

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

  const clearFilters = () => {
    setSearch(""); setSortBy("market_cap"); setSortDir("desc");
    setPriceRange("all"); setChangeFilter("all"); setPage(1);
  };

  const hasFilters = search || priceRange !== "all" || changeFilter !== "all" || sortBy !== "market_cap";

  return (
    <div className="bg-gray-50 min-h-screen font-sans">

      <div className="bg-blue-900 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Live Market Data</p>
          <h1 className="text-4xl font-extrabold text-white mb-3">Cryptocurrency Prices</h1>
          <p className="text-blue-200 text-base max-w-xl leading-relaxed">
            Live prices, market caps, and 24h changes powered by CoinGecko.
            Click any coin to view its full chart and stats.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-white/10 rounded-xl px-4 py-2 text-sm flex items-center gap-2">
              <span className="text-blue-200">Loaded:</span>
              <span className="text-white font-bold">{coins.length.toLocaleString()} coins</span>
              {totalFetching && (
                <svg className="animate-spin ml-1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              )}
            </div>
            {!loading && (
              <>
                <div className="bg-white/10 rounded-xl px-4 py-2 text-sm">
                  <span className="text-blue-200">Gainers: </span>
                  <span className="text-green-400 font-bold">{gainers}</span>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 text-sm">
                  <span className="text-blue-200">Losers: </span>
                  <span className="text-red-400 font-bold">{losers}</span>
                </div>
              </>
            )}
            {totalFetching && (
              <div className="bg-white/10 rounded-xl px-4 py-2 text-sm">
                <span className="text-blue-200 text-xs">Loading more coins in background…</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-5">

        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex flex-col lg:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or symbol… Bitcoin, ETH, SOL"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Price range */}
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white text-gray-700 font-medium">
              <option value="all">All Prices</option>
              <option value="under1">Under $1</option>
              <option value="1to100">$1 — $100</option>
              <option value="100to1k">$100 — $1,000</option>
              <option value="over1k">Over $1,000</option>
            </select>

            {/* Change filter */}
            <select value={changeFilter} onChange={(e) => setChangeFilter(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white text-gray-700 font-medium">
              <option value="all">All 24h Change</option>
              <option value="gainers">Gainers Only</option>
              <option value="losers">Losers Only</option>
            </select>

            {/* Direction */}
            <button onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:border-blue-900 hover:text-blue-900 transition font-medium text-gray-700">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transform: sortDir === "asc" ? "rotate(180deg)" : "rotate(0deg)" }}>
                <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
              </svg>
              {sortDir === "desc" ? "High → Low" : "Low → High"}
            </button>

            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition font-medium">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Clear
              </button>
            )}
          </div>

          {/* Active tags */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded-lg">
                  "{search}" <button onClick={() => setSearch("")} className="ml-0.5 hover:text-blue-900">×</button>
                </span>
              )}
              {priceRange !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded-lg">
                  {priceRange === "under1" ? "< $1" : priceRange === "1to100" ? "$1–$100" : priceRange === "100to1k" ? "$100–$1K" : "> $1K"}
                  <button onClick={() => setPriceRange("all")} className="ml-0.5 hover:text-blue-900">×</button>
                </span>
              )}
              {changeFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded-lg">
                  {changeFilter === "gainers" ? "Gainers" : "Losers"}
                  <button onClick={() => setChangeFilter("all")} className="ml-0.5 hover:text-blue-900">×</button>
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">{filtered.length.toLocaleString()} coins found</span>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-bold uppercase tracking-wide">
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
            <button className="col-span-1 text-left hover:text-blue-900 transition hidden lg:block" onClick={() => handleSort("volume")}>
              Volume <SortIcon col="volume" />
            </button>
            <span className="col-span-1" />
          </div>

          {/* Body */}
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => <SkeletonRow key={i} />)
          ) : error ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-700 mb-1">Failed to load</p>
              <p className="text-xs text-gray-400 mb-4">CoinGecko API rate limit hit. Try again in a moment.</p>
              <button onClick={() => window.location.reload()}
                className="px-5 py-2 bg-blue-900 text-white text-sm font-bold rounded-xl hover:bg-black transition">
                Retry
              </button>
            </div>
          ) : paginated.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-700 mb-1">No coins found</p>
              <p className="text-xs text-gray-400 mb-4">Try different search terms or clear your filters.</p>
              <button onClick={clearFilters}
                className="px-5 py-2 bg-blue-900 text-white text-sm font-bold rounded-xl hover:bg-black transition">
                Clear filters
              </button>
            </div>
          ) : (
            paginated.map((coin, i) => (
              <Link to={`/coin/${coin.id}`} key={coin.id} className="block">
                <CoinRow coin={coin} rank={(page - 1) * ITEMS_PER_PAGE + i + 1} />
              </Link>
            ))
          )}
        </div>

        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-4">
            <p className="text-xs text-gray-500 font-medium">
              Showing{" "}
              <span className="font-bold text-gray-800">
                {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)}
              </span>{" "}
              of <span className="font-bold text-gray-800">{filtered.length.toLocaleString()}</span> coins
              {totalFetching && <span className="text-blue-400 ml-1">(loading more…)</span>}
            </p>

            <div className="flex items-center gap-1.5">
              <button onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-blue-900 hover:text-blue-900 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
                return (
                  <button key={p} onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition ${page === p ? "bg-blue-900 text-white" : "border border-gray-200 text-gray-600 hover:border-blue-900 hover:text-blue-900"
                      }`}>
                    {p}
                  </button>
                );
              })}

              <button onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-blue-900 hover:text-blue-900 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Coin;