import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCoinDetails, getChart } from "../services/api";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ─── HELPERS ─────────────────────────────────────────────────
const fmt = (n) => {
  if (n == null) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
};

const pct = (n) =>
  n == null ? "—" : n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`;

const PERIODS = [
  { label: "1D",  days: 1  },
  { label: "1W",  days: 7  },
  { label: "1M",  days: 30 },
  { label: "1Y",  days: 365},
];

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-base font-extrabold text-blue-900">
          ${Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
        </p>
      </div>
    );
  }
  return null;
};

// ─── STAT CARD ────────────────────────────────────────────────
const StatCard = ({ label, value, sub, highlight }) => (
  <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
    <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
    <p className={`text-lg font-extrabold ${highlight || "text-gray-900"}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────
const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [coin, setCoin]           = useState(null);
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod]       = useState(7);
  const [loading, setLoading]     = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError]         = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistDocId, setWatchlistDocId] = useState(null);
  const [wlLoading, setWlLoading] = useState(false);

  // ── Fetch coin details ────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(false);
    getCoinDetails(id)
      .then((res) => {
        setCoin(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // ── Fetch chart data ──────────────────────────────────────
  useEffect(() => {
    setChartLoading(true);
    getChart(id, period)
      .then((res) => {
        const formatted = res.data.prices.map(([ts, price]) => ({
          time: new Date(ts).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            ...(period === 1 ? { hour: "2-digit", minute: "2-digit" } : {}),
          }),
          price,
        }));
        setChartData(formatted);
        setChartLoading(false);
      })
      .catch(() => setChartLoading(false));
  }, [id, period]);

  // ── Check watchlist ───────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    const check = async () => {
      const q = query(
        collection(db, "watchlists"),
        where("userId", "==", currentUser.uid),
        where("coinId", "==", id)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setInWatchlist(true);
        setWatchlistDocId(snap.docs[0].id);
      } else {
        setInWatchlist(false);
        setWatchlistDocId(null);
      }
    };
    check();
  }, [currentUser, id]);

  // ── Toggle watchlist ──────────────────────────────────────
  const toggleWatchlist = async () => {
    if (!currentUser) return;
    setWlLoading(true);
    try {
      if (inWatchlist && watchlistDocId) {
        await deleteDoc(doc(db, "watchlists", watchlistDocId));
        setInWatchlist(false);
        setWatchlistDocId(null);
      } else {
        const ref = await addDoc(collection(db, "watchlists"), {
          userId: currentUser.uid,
          coinId: id,
          addedAt: new Date(),
        });
        setInWatchlist(true);
        setWatchlistDocId(ref.id);
      }
    } catch (e) {
      console.error(e);
    }
    setWlLoading(false);
  };

  // ── Chart color ───────────────────────────────────────────
  const chartColor = (() => {
    if (chartData.length < 2) return "#0f2d6e";
    return chartData[chartData.length - 1].price >= chartData[0].price
      ? "#16a34a"
      : "#dc2626";
  })();

  // ── Loading skeleton ──────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6 animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 h-72" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 h-20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (error || !coin) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">Coin not found</h2>
          <p className="text-gray-500 text-sm mb-6">
            We couldn't load data for <span className="font-bold">"{id}"</span>. It may not exist or the API limit was hit.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-black transition"
            >
              Retry
            </button>
            <Link
              to="/cryptos"
              className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:border-blue-900 hover:text-blue-900 transition"
            >
              Back to Cryptos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const price   = coin.market_data?.current_price?.usd;
  const change24 = coin.market_data?.price_change_percentage_24h;
  const isUp    = change24 >= 0;

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">

        {/* ── Breadcrumb ──────────────────────────────────── */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/dashboard" className="hover:text-blue-900 transition font-medium">Dashboard</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <Link to="/cryptos" className="hover:text-blue-900 transition font-medium">Cryptos</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-gray-700 font-semibold">{coin.name}</span>
        </div>

        {/* ── Coin Header ─────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

            {/* Left — coin identity */}
            <div className="flex items-center gap-4">
              <img
                src={coin.image?.large}
                alt={coin.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-gray-900">{coin.name}</h1>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg uppercase">
                    {coin.symbol}
                  </span>
                  {coin.market_cap_rank && (
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-900 text-xs font-bold rounded-lg">
                      Rank #{coin.market_cap_rank}
                    </span>
                  )}
                </div>
                {coin.categories?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {coin.categories.slice(0, 3).map((cat) => (
                      <span key={cat} className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right — price + watchlist */}
            <div className="flex flex-col sm:items-end gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                </span>
                <span className={`flex items-center gap-1 text-base font-bold px-3 py-1 rounded-xl ${isUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ transform: isUp ? "rotate(0deg)" : "rotate(180deg)" }}>
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  {pct(change24)}
                </span>
              </div>

              {/* Watchlist button */}
              <button
                onClick={toggleWatchlist}
                disabled={wlLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition ${
                  inWatchlist
                    ? "bg-blue-900 text-white hover:bg-black"
                    : "border border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                }`}
              >
                <svg
                  width="16" height="16" viewBox="0 0 24 24"
                  fill={inWatchlist ? "currentColor" : "none"}
                  stroke="currentColor" strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {wlLoading ? "Saving..." : inWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Price Chart ──────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Price Chart</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {coin.name} / USD — Historical price data
              </p>
            </div>
            {/* Period selector */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {PERIODS.map((p) => (
                <button
                  key={p.days}
                  onClick={() => setPeriod(p.days)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${
                    period === p.days
                      ? "bg-blue-900 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {chartLoading ? (
            <div className="h-64 bg-gray-50 rounded-xl animate-pulse flex items-center justify-center">
              <p className="text-sm text-gray-400">Loading chart...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm text-gray-400">Chart data unavailable</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(v < 1 ? 4 : 2)}`
                  }
                  width={70}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={chartColor}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: chartColor }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {/* Chart summary */}
          {chartData.length > 1 && (
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
              {[
                { label: "Period Open", val: `$${chartData[0]?.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}` },
                { label: "Period Close", val: `$${chartData[chartData.length - 1]?.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}` },
                {
                  label: "Period Change",
                  val: (() => {
                    const open  = chartData[0]?.price;
                    const close = chartData[chartData.length - 1]?.price;
                    const diff  = ((close - open) / open) * 100;
                    return pct(diff);
                  })(),
                  color: (() => {
                    const open  = chartData[0]?.price;
                    const close = chartData[chartData.length - 1]?.price;
                    return close >= open ? "text-green-600" : "text-red-500";
                  })(),
                },
                { label: "Data Points", val: chartData.length.toLocaleString() },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-xs text-gray-400">{s.label}</span>
                  <span className={`text-sm font-bold ${s.color || "text-gray-900"}`}>{s.val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Market Stats Grid ────────────────────────────── */}
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">Market Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Market Cap"
              value={fmt(coin.market_data?.market_cap?.usd)}
              sub={`Rank #${coin.market_cap_rank}`}
            />
            <StatCard
              label="24h Trading Volume"
              value={fmt(coin.market_data?.total_volume?.usd)}
              sub="Across all exchanges"
            />
            <StatCard
              label="Circulating Supply"
              value={coin.market_data?.circulating_supply
                ? `${(coin.market_data.circulating_supply / 1e6).toFixed(2)}M ${coin.symbol?.toUpperCase()}`
                : "—"}
            />
            <StatCard
              label="Max Supply"
              value={coin.market_data?.max_supply
                ? `${(coin.market_data.max_supply / 1e6).toFixed(2)}M`
                : "Unlimited"}
              sub={coin.market_data?.max_supply ? coin.symbol?.toUpperCase() : "No cap"}
            />
            <StatCard
              label="All-Time High"
              value={coin.market_data?.ath?.usd
                ? `$${coin.market_data.ath.usd.toLocaleString()}`
                : "—"}
              sub={coin.market_data?.ath_date?.usd
                ? new Date(coin.market_data.ath_date.usd).toLocaleDateString()
                : ""}
            />
            <StatCard
              label="ATH Change"
              value={pct(coin.market_data?.ath_change_percentage?.usd)}
              highlight={
                (coin.market_data?.ath_change_percentage?.usd || 0) >= 0
                  ? "text-green-600"
                  : "text-red-500"
              }
              sub="From all-time high"
            />
            <StatCard
              label="All-Time Low"
              value={coin.market_data?.atl?.usd
                ? `$${coin.market_data.atl.usd.toLocaleString()}`
                : "—"}
              sub={coin.market_data?.atl_date?.usd
                ? new Date(coin.market_data.atl_date.usd).toLocaleDateString()
                : ""}
            />
            <StatCard
              label="7d Change"
              value={pct(coin.market_data?.price_change_percentage_7d)}
              highlight={
                (coin.market_data?.price_change_percentage_7d || 0) >= 0
                  ? "text-green-600"
                  : "text-red-500"
              }
              sub="Last 7 days"
            />
          </div>
        </div>

        {/* ── Price Change Overview ────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-5">Price Change Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { label: "1 Hour",  val: coin.market_data?.price_change_percentage_1h_in_currency?.usd },
              { label: "24 Hours", val: coin.market_data?.price_change_percentage_24h },
              { label: "7 Days",  val: coin.market_data?.price_change_percentage_7d },
              { label: "30 Days", val: coin.market_data?.price_change_percentage_30d },
              { label: "1 Year",  val: coin.market_data?.price_change_percentage_1y },
            ].map((item) => {
              const up = (item.val || 0) >= 0;
              return (
                <div key={item.label} className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">{item.label}</p>
                  <p className={`text-lg font-extrabold ${item.val == null ? "text-gray-300" : up ? "text-green-600" : "text-red-500"}`}>
                    {pct(item.val)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── About ────────────────────────────────────────── */}
        {coin.description?.en && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">About {coin.name}</h2>
            <div
              className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none prose-a:text-blue-900"
              dangerouslySetInnerHTML={{
                __html: coin.description.en.split(". ").slice(0, 6).join(". ") + ".",
              }}
            />
          </div>
        )}

        {/* ── Links ────────────────────────────────────────── */}
        {(coin.links?.homepage?.[0] ||
          coin.links?.blockchain_site?.[0] ||
          coin.links?.subreddit_url ||
          coin.links?.repos_url?.github?.[0]) && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Official Links</h2>
            <div className="flex flex-wrap gap-3">
              {coin.links.homepage?.[0] && (
                <a
                  href={coin.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-blue-900 hover:text-blue-900 transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Website
                </a>
              )}
              {coin.links.subreddit_url && (
                <a
                  href={coin.links.subreddit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-blue-900 hover:text-blue-900 transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Reddit
                </a>
              )}
              {coin.links.repos_url?.github?.[0] && (
                <a
                  href={coin.links.repos_url.github[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-blue-900 hover:text-blue-900 transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  GitHub
                </a>
              )}
              {coin.links.blockchain_site?.[0] && (
                <a
                  href={coin.links.blockchain_site[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-blue-900 hover:text-blue-900 transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  Explorer
                </a>
              )}
            </div>
          </div>
        )}

        {/* ── Back button ──────────────────────────────────── */}
        <div className="flex gap-3 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:border-blue-900 hover:text-blue-900 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <Link
            to="/cryptos"
            className="px-6 py-2.5 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-black transition"
          >
            All Coins →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CoinDetail;