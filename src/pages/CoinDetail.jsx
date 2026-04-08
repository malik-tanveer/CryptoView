import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCoinDetails, getChart } from "../services/api";
import { db } from "../firebase/config";
import {
  collection, query, where, getDocs, addDoc, deleteDoc, doc,
} from "firebase/firestore";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Brush,
} from "recharts";

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
  { label: "1D", days: 1   },
  { label: "1W", days: 7   },
  { label: "1M", days: 30  },
  { label: "3M", days: 90  },
  { label: "1Y", days: 365 },
  { label: "Max",days: "max"},
];

const CHART_TYPES = [
  { value: "area",  label: "Area Chart"  },
  { value: "line",  label: "Line Chart"  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-base font-extrabold text-blue-900">
        ${Number(payload[0].value).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: payload[0].value < 1 ? 6 : 2,
        })}
      </p>
    </div>
  );
};

const StatCard = ({ label, value, sub, highlight }) => (
  <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
    <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
    <p className={`text-lg font-extrabold ${highlight || "text-gray-900"}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

const CoinDetail = () => {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { currentUser } = useAuth();

  const [coin, setCoin]             = useState(null);
  const [chartData, setChartData]   = useState([]);
  const [period, setPeriod]         = useState(7);
  const [chartType, setChartType]   = useState("area");
  const [loading, setLoading]       = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError]           = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistDocId, setWatchlistDocId] = useState(null);
  const [wlLoading, setWlLoading]   = useState(false);

  useEffect(() => {
    setLoading(true); setError(false);
    getCoinDetails(id)
      .then((res) => { setCoin(res.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  useEffect(() => {
    setChartLoading(true);
    getChart(id, period)
      .then((res) => {
        // Reduce data points for smooth rendering (max 200 points)
        const raw = res.data.prices;
        const step = Math.max(1, Math.floor(raw.length / 200));
        const sampled = raw.filter((_, i) => i % step === 0);

        setChartData(
          sampled.map(([ts, price]) => ({
            time: new Date(ts).toLocaleDateString("en-US", {
              month: "short", day: "numeric",
              ...(period === 1 ? { hour: "2-digit", minute: "2-digit" } : {}),
            }),
            price,
          }))
        );
        setChartLoading(false);
      })
      .catch(() => setChartLoading(false));
  }, [id, period]);

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
    } catch (e) { console.error(e); }
    setWlLoading(false);
  };

  const isChartUp =
    chartData.length >= 2
      ? chartData[chartData.length - 1].price >= chartData[0].price
      : true;
  const chartColor = isChartUp ? "#16a34a" : "#dc2626";
  const chartFill  = isChartUp ? "#dcfce7" : "#fee2e2";

  const periodChange = (() => {
    if (chartData.length < 2) return null;
    const open  = chartData[0].price;
    const close = chartData[chartData.length - 1].price;
    return ((close - open) / open) * 100;
  })();

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6 animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 h-80" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 h-20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
            Could not load data for "<span className="font-bold">{id}</span>". API limit may have been hit.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-black transition">
              Retry
            </button>
            <Link to="/coin"
              className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:border-blue-900 hover:text-blue-900 transition">
              Back to Coins
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const price    = coin.market_data?.current_price?.usd;
  const change24 = coin.market_data?.price_change_percentage_24h;
  const isUp24   = (change24 || 0) >= 0;

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-5">

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/dashboard" className="hover:text-blue-900 transition font-medium">Dashboard</Link>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <Link to="/coin" className="hover:text-blue-900 transition font-medium">Coins</Link>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-gray-700 font-semibold">{coin.name}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">

            {/* Left */}
            <div className="flex items-center gap-4">
              <img src={coin.image?.large} alt={coin.name} className="w-16 h-16 rounded-full flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-gray-900">{coin.name}</h1>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg uppercase tracking-wide">
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
                      <span key={cat} className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right — price + star */}
            <div className="flex flex-col sm:items-end gap-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-extrabold text-gray-900">
                  ${price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: price < 1 ? 6 : 2,
                  })}
                </span>
                <span className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-xl ${
                  isUp24 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                }`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                    style={{ transform: isUp24 ? "rotate(0deg)" : "rotate(180deg)" }}>
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  {pct(change24)} (24h)
                </span>
              </div>

              {/* ★ WATCHLIST BUTTON — yellow when active */}
              <button
                onClick={toggleWatchlist}
                disabled={wlLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  inWatchlist
                    ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500 shadow-md shadow-yellow-200"
                    : "border-2 border-gray-200 text-gray-500 hover:border-yellow-400 hover:text-yellow-500"
                }`}
              >
                <svg
                  width="17" height="17" viewBox="0 0 24 24"
                  fill={inWatchlist ? "currentColor" : "none"}
                  stroke="currentColor" strokeWidth="2"
                  className={inWatchlist ? "drop-shadow-sm" : ""}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {wlLoading
                  ? "Saving…"
                  : inWatchlist
                  ? "In Watchlist"
                  : "Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">

          {/* Chart header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Price Chart</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <p className="text-xs text-gray-400">{coin.name} / USD</p>
                {periodChange != null && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                    periodChange >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                  }`}>
                    {pct(periodChange)} this period
                  </span>
                )}
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Chart type dropdown */}
              <div className="relative">
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white text-gray-700 cursor-pointer"
                >
                  {CHART_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                  width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Period pills */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                {PERIODS.map((p) => (
                  <button
                    key={p.days}
                    onClick={() => setPeriod(p.days)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
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
          </div>

          {/* Chart body */}
          {chartLoading ? (
            <div className="h-72 bg-gray-50 rounded-xl animate-pulse flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <svg className="animate-spin text-blue-900" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <p className="text-sm text-gray-400">Loading chart…</p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-72 flex items-center justify-center">
              <p className="text-sm text-gray-400">Chart data unavailable</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "area" ? (
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={chartColor} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }}
                      tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                      tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(v < 1 ? 4 : 2)}`}
                      width={72} domain={["auto", "auto"]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2.5}
                      fill="url(#areaGrad)" dot={false}
                      activeDot={{ r: 5, strokeWidth: 0, fill: chartColor }} />
                    <Brush dataKey="time" height={24} stroke="#e5e7eb"
                      fill="#f9fafb" travellerWidth={6}
                      startIndex={Math.max(0, chartData.length - Math.floor(chartData.length * 0.8))} />
                  </AreaChart>
                ) : (
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }}
                      tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                      tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(v < 1 ? 4 : 2)}`}
                      width={72} domain={["auto", "auto"]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2.5}
                      dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: chartColor }} />
                    <Brush dataKey="time" height={24} stroke="#e5e7eb"
                      fill="#f9fafb" travellerWidth={6}
                      startIndex={Math.max(0, chartData.length - Math.floor(chartData.length * 0.8))} />
                  </LineChart>
                )}
              </ResponsiveContainer>

              {/* Chart summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
                {[
                  { label: "Period Open",
                    val: `$${chartData[0]?.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}` },
                  { label: "Period Close",
                    val: `$${chartData[chartData.length - 1]?.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}` },
                  { label: "Period Change",
                    val: pct(periodChange),
                    color: (periodChange || 0) >= 0 ? "text-green-600" : "text-red-500" },
                  { label: "Data Points", val: chartData.length.toLocaleString() },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                    <p className={`text-sm font-bold ${s.color || "text-gray-900"}`}>{s.val}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">Market Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Market Cap" value={fmt(coin.market_data?.market_cap?.usd)} sub={`Rank #${coin.market_cap_rank}`} />
            <StatCard label="24h Volume" value={fmt(coin.market_data?.total_volume?.usd)} sub="Across all exchanges" />
            <StatCard label="Circulating Supply"
              value={coin.market_data?.circulating_supply
                ? `${(coin.market_data.circulating_supply / 1e6).toFixed(2)}M ${coin.symbol?.toUpperCase()}`
                : "—"} />
            <StatCard label="Max Supply"
              value={coin.market_data?.max_supply ? `${(coin.market_data.max_supply / 1e6).toFixed(2)}M` : "Unlimited"}
              sub={coin.market_data?.max_supply ? coin.symbol?.toUpperCase() : "No hard cap"} />
            <StatCard label="All-Time High"
              value={coin.market_data?.ath?.usd ? `$${coin.market_data.ath.usd.toLocaleString()}` : "—"}
              sub={coin.market_data?.ath_date?.usd ? new Date(coin.market_data.ath_date.usd).toLocaleDateString() : ""} />
            <StatCard label="ATH Change"
              value={pct(coin.market_data?.ath_change_percentage?.usd)}
              highlight={(coin.market_data?.ath_change_percentage?.usd || 0) >= 0 ? "text-green-600" : "text-red-500"}
              sub="From all-time high" />
            <StatCard label="All-Time Low"
              value={coin.market_data?.atl?.usd ? `$${coin.market_data.atl.usd.toLocaleString()}` : "—"}
              sub={coin.market_data?.atl_date?.usd ? new Date(coin.market_data.atl_date.usd).toLocaleDateString() : ""} />
            <StatCard label="7d Change"
              value={pct(coin.market_data?.price_change_percentage_7d)}
              highlight={(coin.market_data?.price_change_percentage_7d || 0) >= 0 ? "text-green-600" : "text-red-500"}
              sub="Last 7 days" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-5">Price Change Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: "1 Hour",   val: coin.market_data?.price_change_percentage_1h_in_currency?.usd },
              { label: "24 Hours", val: coin.market_data?.price_change_percentage_24h },
              { label: "7 Days",   val: coin.market_data?.price_change_percentage_7d },
              { label: "30 Days",  val: coin.market_data?.price_change_percentage_30d },
              { label: "1 Year",   val: coin.market_data?.price_change_percentage_1y },
            ].map((item) => {
              const up = (item.val || 0) >= 0;
              return (
                <div key={item.label} className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">{item.label}</p>
                  <p className={`text-base font-extrabold ${item.val == null ? "text-gray-300" : up ? "text-green-600" : "text-red-500"}`}>
                    {pct(item.val)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

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

        {(coin.links?.homepage?.[0] || coin.links?.subreddit_url ||
          coin.links?.repos_url?.github?.[0] || coin.links?.blockchain_site?.[0]) && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Official Links</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { href: coin.links.homepage?.[0], label: "Website",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
                { href: coin.links.subreddit_url, label: "Reddit",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
                { href: coin.links.repos_url?.github?.[0], label: "GitHub",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg> },
                { href: coin.links.blockchain_site?.[0], label: "Explorer",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
              ].filter((l) => l.href).map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-blue-900 hover:text-blue-900 transition">
                  {l.icon}{l.label}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pb-4">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:border-blue-900 hover:text-blue-900 transition">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <Link to="/cryptos"
            className="px-6 py-2.5 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-black transition">
            All Coins →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CoinDetail;