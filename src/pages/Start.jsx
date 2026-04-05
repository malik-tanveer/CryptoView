import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCoins } from "../services/api";

const faqs = [
  {
    q: "What is CryptoView and who is it for?",
    a: "CryptoView is a free cryptocurrency tracking platform designed for everyone from curious beginners exploring the crypto space for the first time, to seasoned traders who need fast, reliable market data. Whether you want to browse coin prices, analyze trends, or build a personal watchlist, CryptoView has everything you need without any cost or sign-up barrier.",
  },
  {
    q: "Do I need to sign up to use CryptoView?",
    a: "Not at all! You can browse all 2,400+ coins, view live price charts, explore trending tokens, and read detailed market data as a guest. Creating a free account simply unlocks extra features like a personal watchlist, a customized dashboard, and the ability to save your favorite coins across sessions.",
  },
  {
    q: "How often is the price data updated?",
    a: "Price data is powered by the CoinGecko API one of the most trusted sources for crypto market data globally. Live prices on the dashboard refresh automatically so you always have the most accurate numbers. Historical chart data is available for 1 day, 7 days, 1 month, and 1 year timeframes.",
  },
  {
    q: "How do I add coins to my Watchlist?",
    a: "Once you're logged in, navigate to any coin's detail page and click the star icon or the 'Add to Watchlist' button. The coin is saved to your account instantly. You can manage your entire watchlist from the dedicated Watchlist page available in the main navigation.",
  },
  {
    q: "Can I view historical price charts for any coin?",
    a: "Yes! Click on any coin to open its full detail page. You'll find an interactive price chart where you can toggle between 1 day, 1 week, 1 month, and 1 year views. These charts help you spot trends, understand volatility, and make smarter investment decisions.",
  },
  {
    q: "How many cryptocurrencies does CryptoView support?",
    a: "CryptoView tracks over 2,400 cryptocurrencies including all major coins like Bitcoin, Ethereum, Solana, BNB, XRP, and thousands of altcoins and emerging tokens. The data is sourced directly from CoinGecko and updated continuously as the market evolves.",
  },
  {
    q: "Is CryptoView completely free?",
    a: "Yes 100% free, forever. There are no subscriptions, no premium tiers, and absolutely no hidden charges. Every feature on CryptoView, including live charts, the watchlist, trending coins, and detailed coin pages, is available to all users at zero cost.",
  },
  {
    q: "How secure is my CryptoView account?",
    a: "Your account is secured using Firebase Authentication, a platform trusted by millions of apps worldwide. We support both email/password login and Google Sign-In. Your password is never stored in plain text Firebase handles all authentication with industry-standard encryption and security protocols.",
  },
];

// ─── FEATURES DATA ───────────────────────────────────────────
const features = [
  {
    title: "Live Price Tracking",
    desc: "Get real-time prices for 2,400+ cryptocurrencies. Every number you see is pulled directly from CoinGecko's market API accurate, fast, and always up to date.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Interactive Charts",
    desc: "Visualize price history with beautiful line charts. Switch between 1D, 1W, 1M, and 1Y timeframes to understand trends and spot the right entry points.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: "Personal Watchlist",
    desc: "Curate your own list of coins to follow. Your watchlist is saved to your account and syncs automatically so your picks are always one click away.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "Trending Coins",
    desc: "See which coins are surging right now. The Trending page highlights the biggest movers and most searched tokens in the last 24 hours.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    title: "Deep Coin Details",
    desc: "Each coin has a full detail page market cap, circulating supply, all-time high, volume, and more. Everything you need to research a coin in one place.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "Search & Filter",
    desc: "Search any coin by name or ticker symbol. Sort by price, market cap, or 24h change to find exactly what you're looking for in seconds.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
];

const CoinRow = ({ coin, rank }) => {
  const isUp = coin.price_change_percentage_24h >= 0;
  return (
    <div className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
      <span className="col-span-1 text-sm text-gray-400">{rank}</span>
      <div className="col-span-4 flex items-center gap-3">
        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{coin.name}</p>
          <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
        </div>
      </div>
      <span className="col-span-3 text-sm font-semibold text-gray-900">
        ${coin.current_price.toLocaleString()}
      </span>
      <span className={`col-span-2 text-sm font-semibold ${isUp ? "text-green-600" : "text-red-500"}`}>
        {isUp ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
      </span>
      <div className="col-span-2 flex justify-end">
        <Link
          to={`/coin/${coin.id}`}
          className="px-4 py-1.5 bg-blue-50 text-blue-900 text-xs font-semibold rounded-lg hover:bg-blue-900 hover:text-white transition"
        >
          View
        </Link>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────
const Start = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [coins, setCoins] = useState([]);
  const [loadingCoins, setLoadingCoins] = useState(true);

  useEffect(() => {
    getCoins()
      .then((res) => {
        setCoins(res.data.slice(0, 6));
        setLoadingCoins(false);
      })
      .catch(() => setLoadingCoins(false));
  }, []);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="bg-white text-gray-900 font-sans">

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col-reverse md:flex-row items-center gap-14">
        <div className="md:w-1/2 space-y-7">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-900 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            Live market data powered by CoinGecko
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1]">
            Your Crypto.<br />
            <span className="text-blue-900">Your Dashboard.</span><br />
            Always Live.
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed max-w-md">
            CryptoView brings you real-time prices, interactive price history charts, and a personal
            watchlist for over 2,400 cryptocurrencies all in one fast, free, and beautifully simple platform.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/dashboard"
              className="px-8 py-3.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-black transition text-sm shadow-md shadow-blue-900/20"
            >
              Go to Dashboard →
            </Link>
            <Link
              to="/cryptos"
              className="px-8 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-blue-900 hover:text-blue-900 transition text-sm"
            >
              Explore All Coins
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-2">
            {[
              { val: "2,400+", label: "Coins tracked" },
              { val: "100%", label: "Free forever" },
              { val: "Live", label: "Real-time data" },
            ].map((s, i, arr) => (
              <div key={s.label} className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-gray-900">{s.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
                {i < arr.length - 1 && <div className="w-px h-10 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=900&q=80"
              alt="Crypto market dashboard"
              className="rounded-2xl w-full object-cover shadow-xl"
            />
            <div className="absolute -bottom-4 -left-4 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">₿</div>
              <div>
                <p className="text-xs text-gray-400">Bitcoin</p>
                <p className="text-sm font-bold text-gray-900">
                  {coins[0] ? `$${coins[0].current_price.toLocaleString()}` : "Loading..."}
                </p>
              </div>
              {coins[0] && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${coins[0].price_change_percentage_24h >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                  {coins[0].price_change_percentage_24h >= 0 ? "+" : ""}
                  {coins[0].price_change_percentage_24h?.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-blue-900">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-8 md:gap-0 md:justify-between">
          {[
            { label: "Total Crypto Market Cap", val: "$2.41 Trillion" },
            { label: "BTC Dominance", val: "52.3%" },
            { label: "Coins Tracked", val: "2,400+" },
            { label: "24h Global Volume", val: "$94.2B" },
            { label: "Data Source", val: "CoinGecko API" },
          ].map((s) => (
            <div key={s.label} className="text-center px-4">
              <p className="text-xl font-extrabold text-white">{s.val}</p>
              <p className="text-xs text-blue-200 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">Live market data</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Top cryptocurrencies right now</h2>
            <p className="text-gray-500 mt-2 max-w-lg">
              Real prices pulled live from CoinGecko. Click any coin to see its full chart, stats, and history.
            </p>
          </div>
          <Link to="/cryptos" className="text-sm font-semibold text-blue-900 hover:underline whitespace-nowrap">
            View all 2400+ coins →
          </Link>
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-xs text-gray-400 font-bold uppercase tracking-wide border-b border-gray-200">
            <span className="col-span-1">#</span>
            <span className="col-span-4">Coin</span>
            <span className="col-span-3">Price (USD)</span>
            <span className="col-span-2">24h Change</span>
            <span className="col-span-2 text-right">Action</span>
          </div>
          {loadingCoins ? (
            <div className="py-16 text-center text-gray-400 text-sm">Loading live data from CoinGecko...</div>
          ) : (
            coins.map((coin, i) => <CoinRow key={coin.id} coin={coin} rank={i + 1} />)
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/cryptos"
            className="inline-block px-10 py-3.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-blue-900 transition shadow"
          >
            Explore all coins with charts & data →
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80"
              alt="Crypto analytics platform"
              className="rounded-2xl w-full object-cover shadow-lg"
            />
          </div>
          <div className="md:w-1/2 space-y-6">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">What is CryptoView?</p>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
              The simplest way to track the crypto market
            </h2>
            <p className="text-gray-500 leading-relaxed">
              CryptoView is a free, open-access cryptocurrency tracking platform that gives you everything you
              need to understand and navigate the digital asset market. Whether you're tracking Bitcoin for the
              first time or monitoring a portfolio of altcoins, CryptoView makes it effortless.
            </p>
            <p className="text-gray-500 leading-relaxed">
              We pull live data directly from CoinGecko one of the world's most trusted crypto data providers
              and present it in a clean, fast, and intuitive interface. No noise. No subscriptions. No complexity.
              Just the data you need, when you need it.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { val: "2,400+", label: "Coins tracked" },
                { val: "Free", label: "No cost ever" },
                { val: "Live", label: "Real-time prices" },
                { val: "Secure", label: "Firebase Auth" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                  <p className="text-xl font-extrabold text-blue-900">{s.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">Platform features</p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Everything in one place</h2>
        <p className="text-gray-500 mb-14 max-w-xl leading-relaxed">
          CryptoView is packed with tools to help you track, analyze, and manage the coins you care about.
          Here's what you get all completely free.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="border border-gray-200 rounded-2xl p-7 hover:border-blue-900 hover:shadow-md transition group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-900 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">Getting started</p>
          <h2 className="text-4xl font-extrabold text-white mb-14">Up and running in 4 steps</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: "01", title: "Create your free account", desc: "Sign up with your email or Google account in under 30 seconds. No credit card. No subscription." },
              { n: "02", title: "Browse 2,400+ coins", desc: "Explore the full coin list. Search by name or symbol, sort by market cap, price, or 24h change." },
              { n: "03", title: "Open any coin detail page", desc: "Click a coin to see its full price history chart, market stats, circulating supply, and more." },
              { n: "04", title: "Build your watchlist", desc: "Star the coins you care about. Your watchlist lives in your account always ready on your dashboard." },
            ].map((s) => (
              <div key={s.n} className="border border-white/10 rounded-2xl p-6">
                <p className="text-4xl font-extrabold text-white/10 mb-4">{s.n}</p>
                <h4 className="font-bold text-white text-base mb-2">{s.title}</h4>
                <p className="text-sm text-blue-200 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">Who uses CryptoView?</p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-14">Built for every type of crypto user</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              img: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=600&q=80",
              title: "Beginners",
              desc: "Just getting into crypto? CryptoView makes it easy to understand prices, market caps, and coin history without any technical knowledge. Start exploring no sign-up needed.",
            },
            {
              img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
              title: "Active Traders",
              desc: "Need fast data? CryptoView gives you live prices, 24h change percentages, and interactive charts so you can monitor positions and react quickly to market moves.",
            },
            {
              img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
              title: "Long-Term Investors",
              desc: "Holding for the long run? Use historical charts and market cap data to track your coins over time. Build a watchlist of your portfolio and check in whenever you need.",
            },
          ].map((u) => (
            <div key={u.title} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition">
              <img src={u.img} alt={u.title} className="w-full h-44 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{u.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{u.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 space-y-6">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">Your personal watchlist</p>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Track only the coins<br />that matter to you
            </h2>
            <p className="text-gray-500 leading-relaxed">
              With a free CryptoView account, you can star any coin and add it to your personal watchlist.
              Your watchlist is saved to your account, so it's always there when you log back in
              whether you're on your phone, laptop, or desktop.
            </p>
            <p className="text-gray-500 leading-relaxed">
              No more scrolling through 2,400 coins to find the 10 you actually follow. Your watchlist puts
              your most important coins front and center every time you open your dashboard.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3.5 bg-blue-900 text-white rounded-xl font-bold text-sm hover:bg-black transition shadow-md shadow-blue-900/20"
            >
              Create free account to start →
            </Link>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80"
              alt="Watchlist feature"
              className="rounded-2xl w-full object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800&q=80"
              alt="Trending coins"
              className="rounded-2xl w-full object-cover shadow-lg"
            />
          </div>
          <div className="md:w-1/2 space-y-6">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">Trending page</p>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Know what's moving<br />before everyone else
            </h2>
            <p className="text-gray-500 leading-relaxed">
              The CryptoView Trending page shows you the hottest coins in the market right now. Discover which
              tokens are gaining the most attention, see their 24h price changes, and jump straight into their
              detail pages to learn more.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Whether it's a sudden altcoin surge or a major coin making headlines, the Trending page keeps
              you informed without you having to search for anything manually.
            </p>
            <Link
              to="/trending"
              className="inline-block px-8 py-3.5 border border-blue-900 text-blue-900 rounded-xl font-bold text-sm hover:bg-blue-900 hover:text-white transition"
            >
              See what's trending now →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2 text-center">Support</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Frequently asked questions</h2>
          <p className="text-gray-500 text-center mb-12 leading-relaxed">
            Everything you need to know about CryptoView. Can't find an answer? Visit our Help page.
          </p>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`bg-white border rounded-2xl overflow-hidden transition-all ${openFaq === i ? "border-blue-900" : "border-gray-200"}`}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-sm font-bold text-gray-900 pr-4">{faq.q}</span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-light transition-all duration-300 ${
                      openFaq === i ? "bg-blue-900 text-white rotate-45" : "bg-blue-50 text-blue-900"
                    }`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/help"
              className="inline-block px-8 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm font-semibold hover:border-blue-900 hover:text-blue-900 transition"
            >
              Visit Help & Support page →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-black py-24 px-6 text-center">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Get started today</p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
          The crypto market<br />never sleeps. Neither does<br />
          <span className="text-blue-400">CryptoView.</span>
        </h2>
        <p className="text-gray-400 text-base max-w-lg mx-auto leading-relaxed mb-12">
          Real-time prices. Interactive charts. A personal watchlist. Everything you need to stay on top
          of the crypto market completely free, forever.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link
            to="/signup"
            className="px-10 py-4 bg-blue-900 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-900/40"
          >
            Create your free account
          </Link>
          <Link
            to="/cryptos"
            className="px-10 py-4 border border-white/20 text-white font-bold rounded-xl text-sm hover:bg-white/10 transition"
          >
            Browse coins without signing up
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {[
            { val: "2,400+", label: "Cryptocurrencies" },
            { val: "Free", label: "No subscription" },
            { val: "Live", label: "Real-time data" },
            { val: "Secure", label: "Firebase Auth" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold text-white">{s.val}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Start;