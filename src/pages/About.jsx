import { Link } from "react-router-dom";

const stats = [
  { val: "2,400+", label: "Cryptocurrencies tracked" },
  { val: "$2.41T", label: "Total market cap covered" },
  { val: "100%", label: "Free no hidden costs" },
  { val: "Live", label: "Real-time CoinGecko data" },
];

const values = [
  {
    title: "Transparency",
    desc: "Every price, chart, and market stat on CryptoView comes directly from CoinGecko one of the world's most trusted crypto data providers. No manipulation, no estimates. Just raw, accurate market data delivered in real time.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Simplicity",
    desc: "The crypto space is complicated enough. CryptoView strips away the noise and gives you exactly what you need clean data, readable charts, and an interface that gets out of your way so you can focus on what matters.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Accessibility",
    desc: "CryptoView is and always will be completely free. No paywalls, no premium tiers, no subscriptions. Every feature live prices, charts, watchlist, trending coins is available to every user from day one.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: "Security",
    desc: "Your account is protected by Firebase Authentication the same infrastructure trusted by millions of applications globally. Whether you sign in with email or Google, your credentials are encrypted and never stored in plain text.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Speed",
    desc: "Markets move fast. CryptoView is built to keep up. Live data loads quickly, charts render smoothly, and the entire platform is optimized so you spend less time waiting and more time making decisions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Reliability",
    desc: "CryptoView is powered by CoinGecko's industry-leading API which covers thousands of coins across hundreds of exchanges. You can trust that the data you see reflects the real state of the market at all times.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

const team = [
  {
    name: "Tanveer",
    role: "Founder & Lead Developer",
    desc: "Built CryptoView from the ground up using React, Firebase, and the CoinGecko API. Passionate about making financial data accessible to everyone.",
    avatar: "AR",
    color: "#0f2d6e",
  },
  {
    name: "CoinGecko API",
    role: "Data Partner",
    desc: "CryptoView's market data is powered entirely by CoinGecko the world's largest independent cryptocurrency data aggregator with 10,000+ coins tracked.",
    avatar: "CG",
    color: "#16a34a",
  },
  {
    name: "Firebase",
    role: "Auth & Infrastructure",
    desc: "User authentication and account management is handled by Firebase, ensuring secure, fast, and reliable login for every CryptoView user.",
    avatar: "FB",
    color: "#ea580c",
  },
];

const timeline = [
  {
    year: "Idea",
    title: "The problem we saw",
    desc: "Most crypto platforms are either too complex, full of ads, or locked behind paywalls. We wanted something clean, fast, and completely free for everyone.",
  },
  {
    year: "Build",
    title: "Built with React & Firebase",
    desc: "CryptoView was built using React for the frontend, Firebase for authentication, and the CoinGecko API for live market data. Every feature was designed with simplicity in mind.",
  },
  {
    year: "Launch",
    title: "Launched CryptoView",
    desc: "CryptoView launched with live price tracking, interactive charts, a personal watchlist, and a trending coins page all free, all accessible without a subscription.",
  },
  {
    year: "Now",
    title: "Continuously improving",
    desc: "We're actively improving CryptoView with new features, better charts, more coin data, and a smoother experience based on real user feedback.",
  },
];

const About = () => {
  return (
    <div className="bg-white text-gray-900 font-sans">

      <section className="bg-blue-900 py-24 px-6 text-center">
        <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">About CryptoView</p>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Built for everyone who<br />
          <span className="text-blue-300">believes in crypto.</span>
        </h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          CryptoView is a free, open-access cryptocurrency tracking platform that gives every person
          beginner or expert the tools they need to understand, track, and navigate the crypto market
          with confidence. No cost. No complexity. No compromises.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/coin"
            className="px-8 py-3.5 bg-white text-blue-900 font-bold rounded-xl text-sm hover:bg-blue-50 transition"
          >
            Explore Coins →
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-3.5 border border-white/20 text-white font-bold rounded-xl text-sm hover:bg-white/10 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>

      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-blue-900">{s.val}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-16">
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=900&q=80"
            alt="Our mission"
            className="rounded-2xl w-full object-cover shadow-lg"
          />
        </div>
        <div className="md:w-1/2 space-y-6">
          <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">Our mission</p>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Making crypto data<br />simple and accessible<br />for everyone
          </h2>
          <p className="text-gray-500 leading-relaxed">
            The cryptocurrency market moves fast. Prices shift by the second, new tokens launch every day,
            and the amount of data available is overwhelming. Most platforms either make it too complicated,
            charge you for basic features, or bury useful information under ads and clutter.
          </p>
          <p className="text-gray-500 leading-relaxed">
            CryptoView was built to fix that. Our mission is simple: give every person regardless of their
            experience level or budget a clean, fast, and completely free way to track the crypto market.
            Whether you hold one coin or follow hundreds, CryptoView makes it easy.
          </p>
          <p className="text-gray-500 leading-relaxed">
            We believe that access to financial data should not be a privilege. It should be a right.
            That's why CryptoView will always be 100% free no subscriptions, no paywalls, no exceptions.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">What we stand for</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Our core values</h2>
          <p className="text-gray-500 mb-14 max-w-xl leading-relaxed">
            These are the principles that guide every decision we make at CryptoView
            from the features we build to the way we handle your data.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white border border-gray-200 rounded-2xl p-7 hover:border-blue-900 hover:shadow-md transition group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-16">
        <div className="md:w-1/2 space-y-6">
          <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">How it works</p>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Live data. Clean interface.<br />Zero cost.
          </h2>
          <p className="text-gray-500 leading-relaxed">
            CryptoView connects directly to the CoinGecko API to fetch live cryptocurrency market data.
            Every price, market cap, volume, and percentage change you see on the platform is pulled in
            real time from CoinGecko's comprehensive database which covers over 10,000 coins across
            hundreds of exchanges worldwide.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Our frontend is built with React, making the platform fast, responsive, and smooth across all
            devices. User accounts and authentication are handled by Firebase, ensuring your login is
            secure and your watchlist is always saved and synced.
          </p>
          <p className="text-gray-500 leading-relaxed">
            There is no backend server storing your browsing habits, no trackers following you around,
            and no data being sold to advertisers. CryptoView is clean, private, and built solely to
            help you track the market you care about.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80"
            alt="How CryptoView works"
            className="rounded-2xl w-full object-cover shadow-lg"
          />
        </div>
      </section>

      <section className="bg-blue-900 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Our story</p>
          <h2 className="text-4xl font-extrabold text-white mb-14">How CryptoView came to life</h2>
          <div className="space-y-0">
            {timeline.map((t, i) => (
              <div key={t.year} className="flex gap-8">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white text-blue-900 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                    {t.year}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-white/20 my-2" />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-10 ${i === timeline.length - 1 ? "pb-0" : ""}`}>
                  <h3 className="text-base font-bold text-white mb-2">{t.title}</h3>
                  <p className="text-sm text-blue-200 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">Built with</p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">The people and tools behind CryptoView</h2>
        <p className="text-gray-500 mb-14 max-w-xl leading-relaxed">
          CryptoView is an independent project built with a focused stack of modern tools,
          all chosen for their reliability, speed, and developer experience.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((t) => (
            <div key={t.name} className="border border-gray-200 rounded-2xl p-7 hover:shadow-md transition">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg mb-5"
                style={{ background: t.color }}
              >
                {t.avatar}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{t.name}</h3>
              <p className="text-xs font-semibold text-blue-900 mb-3">{t.role}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800&q=80"
              alt="CoinGecko data"
              className="rounded-2xl w-full object-cover shadow-lg"
            />
          </div>
          <div className="md:w-1/2 space-y-6">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">Data source</p>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Powered by<br />CoinGecko API
            </h2>
            <p className="text-gray-500 leading-relaxed">
              All cryptocurrency market data on CryptoView including live prices, market caps, 24h trading
              volumes, price change percentages, circulating supply, and historical chart data is sourced
              from the CoinGecko API.
            </p>
            <p className="text-gray-500 leading-relaxed">
              CoinGecko is the world's largest independent cryptocurrency data aggregator, tracking over
              10,000 coins across 600+ exchanges. Their data is used by thousands of applications,
              developers, and financial platforms globally.
            </p>
            <p className="text-gray-500 leading-relaxed">
              By building on CoinGecko's infrastructure, CryptoView can provide the same quality of
              market data that professional traders rely on completely free for every user.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {["10,000+ coins", "600+ exchanges", "Real-time updates", "Trusted globally"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-blue-50 text-blue-900 text-xs font-semibold rounded-full border border-blue-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">Platform overview</p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Everything CryptoView offers</h2>
        <p className="text-gray-500 mb-14 max-w-xl leading-relaxed">
          Here's a full breakdown of what you can do on CryptoView as a guest or as a logged-in user.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Browse 2,400+ Cryptocurrencies",
              desc: "The Cryptos page lists every tracked coin with live prices, market caps, 24h change percentages, and a direct link to each coin's detail page. Sort and search to find exactly what you need.",
              link: "/coin",
              linkText: "Go to Cryptos →",
            },
            {
              title: "View Interactive Price Charts",
              desc: "Every coin has a dedicated detail page with a full interactive price history chart. Toggle between 1 day, 1 week, 1 month, and 1 year views to analyze trends and performance over time.",
              link: "/coin",
              linkText: "Explore a Coin →",
            },
            {
              title: "Track Trending Coins",
              desc: "The Trending page shows the hottest coins in the market right now the tokens gaining the most traction, volume, and community attention in the last 24 hours.",
              link: "/trending",
              linkText: "See Trending →",
            },
            {
              title: "Build a Personal Watchlist",
              desc: "Sign in with your email or Google account and start adding coins to your personal watchlist. Your saved coins are always available on your dashboard whenever you log back in.",
              link: "/watchlist",
              linkText: "Go to Watchlist →",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border border-gray-200 rounded-2xl p-7 hover:border-blue-900 hover:shadow-md transition group"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{item.desc}</p>
              <Link
                to={item.link}
                className="text-sm font-bold text-blue-900 group-hover:underline"
              >
                {item.linkText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black py-24 px-6 text-center">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Ready to start?</p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
          Join CryptoView today.<br />
          <span className="text-blue-400">It's free. Always.</span>
        </h2>
        <p className="text-gray-400 text-base max-w-lg mx-auto leading-relaxed mb-12">
          No subscriptions. No paywalls. No credit card. Just real-time crypto data, interactive
          charts, and a personal watchlist completely free for every user, forever.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          
          <Link
            to="/coin"
            className="px-10 py-4 border border-white/20 text-white font-bold rounded-xl text-sm hover:bg-white/10 transition"
          >
            Browse coins without signing up
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;