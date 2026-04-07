import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getCoins } from "../services/api";

const fmt = (n) =>
  n >= 1e12
    ? `$${(n / 1e12).toFixed(2)}T`
    : n >= 1e9
    ? `$${(n / 1e9).toFixed(2)}B`
    : n >= 1e6
    ? `$${(n / 1e6).toFixed(2)}M`
    : `$${n?.toLocaleString()}`;

const pct = (n) =>
  n == null ? "—" : n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`;

const ITEMS_PER_PAGE = 20;

// ─── SKELETON ROW ─────────────────────────────────────────────
const SkeletonRow = () => (
  <div className="grid grid-cols-12 gap-3 px-5 py-4 items-center border-b border-gray-100 animate-pulse">
    <div className="col-span-1 h-3 bg-gray-100 rounded" />
    <div className="col-span-4 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100" />
      <div className="space-y-1.5">
        <div className="h-3 w-20 bg-gray-100 rounded" />
        <div className="h-2 w-10 bg-gray-100 rounded" />
      </div>
    </div>
    <div className="col-span-2 h-3 bg-gray-100 rounded" />
    <div className="col-span-2 h-3 bg-gray-100 rounded" />
    <div className="col-span-2 h-3 bg-gray-100 rounded hidden md:block" />
    <div className="col-span-1 h-6 bg-gray-100 rounded-lg" />
  </div>
);

const CoinRow = ({ coin, rank }) => {
  const up = coin.price_change_percentage_24h >= 0;
  const isNeutral = coin.price_change_percentage_24h == null;

  return (
    <div className="grid grid-cols-12 gap-3 px-5 py-4 items-center border-b border-gray-100 last:border-0 hover:bg-blue-50/30 transition group">
      <span className="col-span-1 text-sm text-gray-400 font-medium">{rank}</span>

      {/* Coin info */}
      <div className="col-span-4 flex items-center gap-3">
        <img
          src={coin.image}
          alt={coin.name}
          className="w-9 h-9 rounded-full flex-shrink-0"
        />
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-blue-900 transition">
            {coin.name}
          </p>
          <p className="text-xs text-gray-400 uppercase font-medium">{coin.symbol}</p>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2">
        <p className="text-sm font-bold text-gray-900">
          ${coin.current_price?.toLocaleString()}
        </p>
      </div>

      {/* 24h change */}
      <div className="col-span-2">
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
            isNeutral
              ? "bg-gray-100 text-gray-400"
              : up
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {!isNeutral && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              style={{ transform: up ? "rotate(0deg)" : "rotate(180deg)" }}
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          )}
          {pct(coin.price_change_percentage_24h)}
        </span>
      </div>

      {/* Market cap */}
      <div className="col-span-2 hidden md:block">
        <p className="text-sm text-gray-600 font-medium">{fmt(coin.market_cap)}</p>
      </div>

      {/* Volume */}
      <div className="col-span-1 hidden lg:block">
        <p className="text-xs text-gray-400">{fmt(coin.total_volume)}</p>
      </div>

      {/* Action */}
      <div className="col-span-1 flex justify-end">
        <Link
          to={`/coin/${coin.id}`}
          className="px-3 py-1.5 bg-blue-50 text-blue-900 text-xs font-bold rounded-lg hover:bg-blue-900 hover:text-white transition whitespace-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          View
        </Link>
      </div>
    </div>
  );
};

const Coin = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState("all");
  const [changeFilter, setChangeFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    setError(false);
    getCoins()
      .then((res) => {
        setCoins(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, sortBy, sortDir, priceRange, changeFilter]);

  // ── Filter + Sort ─────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...coins];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q)
      );
    }

    // Price range filter
    if (priceRange === "under1") list = list.filter((c) => c.current_price < 1);
    else if (priceRange === "1to100") list = list.filter((c) => c.current_price >= 1 && c.current_price <= 100);
    else if (priceRange === "100to1000") list = list.filter((c) => c.current_price > 100 && c.current_price <= 1000);
    else if (priceRange === "over1000") list = list.filter((c) => c.current_price > 1000);

    // 24h change filter
    if (changeFilter === "gainers") list = list.filter((c) => c.price_change_percentage_24h > 0);
    else if (changeFilter === "losers") list = list.filter((c) => c.price_change_percentage_24h < 0);

    // Sort
    list.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "price") { aVal = a.current_price; bVal = b.current_price; }
      else if (sortBy === "change") { aVal = a.price_change_percentage_24h || 0; bVal = b.price_change_percentage_24h || 0; }
      else if (sortBy === "volume") { aVal = a.total_volume; bVal = b.total_volume; }
      else { aVal = a.market_cap; bVal = b.market_cap; }
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });

    return list;
  }, [coins, search, sortBy, sortDir, priceRange, changeFilter]);

  // ── Pagination ────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ── Summary stats ─────────────────────────────────────────
  const gainers = useMemo(() => coins.filter((c) => c.price_change_percentage_24h > 0).length, [coins]);
  const losers  = useMemo(() => coins.filter((c) => c.price_change_percentage_24h < 0).length, [coins]);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortBy(col); setSortDir("desc"); }
  };

  const SortIcon = ({ col }) => (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      className={`inline ml-1 transition-opacity ${sortBy === col ? "opacity-100" : "opacity-30"}`}
      style={{ transform: sortBy === col && sortDir === "asc" ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );

  const clearFilters = () => {
    setSearch("");
    setSortBy("market_cap");
    setSortDir("desc");
    setPriceRange("all");
    setChangeFilter("all");
    setPage(1);
  };

  const hasActiveFilters = search || priceRange !== "all" || changeFilter !== "all" || sortBy !== "market_cap";

  return (
    <div className="bg-gray-50 min-h-screen font-sans">

      {/* ════════════════════════════════════════
          HERO HEADER
      ════════════════════════════════════════ */}
      <div className="bg-blue-900 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">
            Live Market Data
          </p>
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Cryptocurrency Prices
          </h1>
          <p className="text-blue-200 text-base max-w-xl leading-relaxed">
            Live prices, market caps, and 24h changes for {coins.length > 0 ? coins.length.toLocaleString() : "2,400+"}+ cryptocurrencies —
            powered by CoinGecko. Click any coin to view its full chart and details.
          </p>

          {/* Mini stats */}
          {!loading && coins.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/10 rounded-xl px-4 py-2 text-sm">
                <span className="text-blue-200">Total coins: </span>
                <span className="text-white font-bold">{coins.length}</span>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 text-sm">
                <span className="text-blue-200">Gainers: </span>
                <span className="text-green-400 font-bold">{gainers}</span>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 text-sm">
                <span className="text-blue-200">Losers: </span>
                <span className="text-red-400 font-bold">{losers}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">

        {/* ════════════════════════════════════════
            SEARCH + FILTERS
        ════════════════════════════════════════ */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex flex-col lg:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search coins by name or symbol… e.g. Bitcoin, ETH, SOL"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Price range */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white text-gray-700 font-medium"
            >
              <option value="all">All Prices</option>
              <option value="under1">Under $1</option>
              <option value="1to100">$1 — $100</option>
              <option value="100to1000">$100 — $1,000</option>
              <option value="over1000">Over $1,000</option>
            </select>

            {/* Change filter */}
            <select
              value={changeFilter}
              onChange={(e) => setChangeFilter(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white text-gray-700 font-medium"
            >
              <option value="all">All 24h Change</option>
              <option value="gainers">Gainers Only</option>
              <option value="losers">Losers Only</option>
            </select>

            {/* Sort direction */}
            <button
              onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:border-blue-900 hover:text-blue-900 transition font-medium text-gray-700"
            >
              {sortDir === "desc" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
              )}
              {sortDir === "desc" ? "High → Low" : "Low → High"}
            </button>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 text-sm border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition font-medium"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Clear
              </button>
            )}
          </div>

          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium self-center">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded-lg">
                  "{search}"
                  <button onClick={() => setSearch("")} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              {priceRange !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded-lg">
                  Price: {priceRange === "under1" ? "< $1" : priceRange === "1to100" ? "$1–$100" : priceRange === "100to1000" ? "$100–$1K" : "> $1K"}
                  <button onClick={() => setPriceRange("all")} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              {changeFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded-lg">
                  {changeFilter === "gainers" ? "Gainers only" : "Losers only"}
                  <button onClick={() => setChangeFilter("all")} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              <span className="text-xs text-gray-400 self-center ml-auto">
                {filtered.length} coin{filtered.length !== 1 ? "s" : ""} found
              </span>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════
            COIN TABLE
        ════════════════════════════════════════ */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* Table header */}
          <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-bold uppercase tracking-wide">
            <span className="col-span-1">#</span>
            <span className="col-span-4">Coin</span>
            <button
              className="col-span-2 text-left hover:text-blue-900 transition"
              onClick={() => handleSort("price")}
            >
              Price <SortIcon col="price" />
            </button>
            <button
              className="col-span-2 text-left hover:text-blue-900 transition"
              onClick={() => handleSort("change")}
            >
              24h % <SortIcon col="change" />
            </button>
            <button
              className="col-span-2 text-left hover:text-blue-900 transition hidden md:block"
              onClick={() => handleSort("market_cap")}
            >
              Market Cap <SortIcon col="market_cap" />
            </button>
            <button
              className="col-span-1 text-left hover:text-blue-900 transition hidden lg:block"
              onClick={() => handleSort("volume")}
            >
              Volume <SortIcon col="volume" />
            </button>
            <span className="col-span-1" />
          </div>

          {/* Rows */}
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
          ) : error ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Failed to load data</p>
              <p className="text-xs text-gray-400 mb-4">CoinGecko API rate limit hit. Please try again in a moment.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-blue-900 text-white text-sm font-bold rounded-xl hover:bg-black transition"
              >
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
              <p className="text-sm font-semibold text-gray-700 mb-1">No coins found</p>
              <p className="text-xs text-gray-400 mb-4">Try a different search term or adjust your filters.</p>
              <button
                onClick={clearFilters}
                className="px-5 py-2 bg-blue-900 text-white text-sm font-bold rounded-xl hover:bg-black transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            paginated.map((coin, i) => (
              <Link to={`/coin/${coin.id}`} key={coin.id} className="block">
                <CoinRow
                  coin={coin}
                  rank={(page - 1) * ITEMS_PER_PAGE + i + 1}
                />
              </Link>
            ))
          )}
        </div>

        {/* ════════════════════════════════════════
            PAGINATION
        ════════════════════════════════════════ */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-4">
            <p className="text-xs text-gray-500 font-medium">
              Showing{" "}
              <span className="font-bold text-gray-800">
                {(page - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(page * ITEMS_PER_PAGE, filtered.length)}
              </span>{" "}
              of <span className="font-bold text-gray-800">{filtered.length}</span> coins
            </p>

            <div className="flex items-center gap-1.5">
              {/* Prev */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-blue-900 hover:text-blue-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition ${
                      page === p
                        ? "bg-blue-900 text-white border border-blue-900"
                        : "border border-gray-200 text-gray-600 hover:border-blue-900 hover:text-blue-900"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-blue-900 hover:text-blue-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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