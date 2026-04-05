import { useState } from "react";
import { Link } from "react-router-dom";

const faqCategories = [
  {
    category: "Getting Started",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    faqs: [
      {
        q: "What is CryptoView?",
        a: "CryptoView is a free, open-access cryptocurrency tracking platform. It gives you live prices, interactive charts, trending coins, and a personal watchlist for over 2,400 cryptocurrencies — all powered by the CoinGecko API. No subscription required, no hidden costs, and no sign-up needed to browse.",
      },
      {
        q: "Do I need an account to use CryptoView?",
        a: "No. You can browse all coins, view price charts, and explore trending tokens without creating an account. However, signing up (free) gives you access to a personal watchlist and a customized dashboard that saves your preferences across sessions.",
      },
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' in the top navigation bar. You can register using your email address and a password, or sign in instantly with your Google account. The process takes under 30 seconds and requires no credit card or payment details.",
      },
      {
        q: "Can I use CryptoView on my phone?",
        a: "Yes! CryptoView is fully responsive and works on all screen sizes — mobile, tablet, and desktop. Simply open your browser, navigate to the site, and enjoy the full experience on any device.",
      },
    ],
  },
  {
    category: "Live Prices & Data",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    faqs: [
      {
        q: "Where does CryptoView get its data?",
        a: "All market data — live prices, market caps, 24h trading volumes, price changes, and historical charts — is sourced from the CoinGecko API. CoinGecko is the world's largest independent crypto data aggregator, tracking 10,000+ coins across 600+ exchanges. It is one of the most trusted sources of cryptocurrency market data globally.",
      },
      {
        q: "How often do prices update?",
        a: "Live price data on CryptoView is fetched from CoinGecko and refreshes automatically. The CoinGecko free-tier API updates data every few minutes. For the most accurate, second-by-second prices, we recommend verifying with a real-time exchange directly.",
      },
      {
        q: "How many cryptocurrencies does CryptoView track?",
        a: "CryptoView tracks over 2,400 cryptocurrencies. This includes all major coins like Bitcoin (BTC), Ethereum (ETH), Solana (SOL), BNB, XRP, Cardano (ADA), and thousands of altcoins and emerging tokens. The list is sourced from CoinGecko's market rankings.",
      },
      {
        q: "Why is a coin's price slightly different from what I see on an exchange?",
        a: "CryptoView displays the average market price aggregated by CoinGecko across hundreds of exchanges. Individual exchanges may show slightly different prices due to their own order books and liquidity. The difference is usually very small and reflects normal market variance.",
      },
    ],
  },
  {
    category: "Charts & Coin Details",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    faqs: [
      {
        q: "How do I view a coin's price chart?",
        a: "Navigate to the Cryptos page and click on any coin. This opens the coin's full detail page, which includes an interactive price history chart. You can toggle between 1 day, 1 week, 1 month, and 1 year timeframes to analyze the coin's performance over different periods.",
      },
      {
        q: "What data is shown on a coin's detail page?",
        a: "Each coin's detail page shows: current price, 24h price change percentage, market capitalization, 24h trading volume, circulating supply, all-time high price, and an interactive historical price chart with multiple timeframe options.",
      },
      {
        q: "What does '24h change' mean?",
        a: "The '24h change' shows how much a coin's price has moved in the last 24 hours, expressed as a percentage. A green positive percentage means the price is up compared to 24 hours ago. A red negative percentage means the price has dropped. This is one of the most commonly used indicators of short-term market movement.",
      },
      {
        q: "What is market cap and why does it matter?",
        a: "Market cap (market capitalization) is calculated by multiplying a coin's current price by its circulating supply. It represents the total value of all coins currently in circulation. Market cap is important because it gives a better picture of a coin's size and stability than price alone — a coin priced at $1 can have a higher market cap than one priced at $1,000 if enough coins are in circulation.",
      },
    ],
  },
  {
    category: "Watchlist",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    faqs: [
      {
        q: "How do I add a coin to my Watchlist?",
        a: "First, make sure you are logged in to your CryptoView account. Then navigate to any coin's detail page and click the star icon or the 'Add to Watchlist' button. The coin will be saved to your personal watchlist immediately. You can add as many coins as you like.",
      },
      {
        q: "How do I remove a coin from my Watchlist?",
        a: "Go to your Watchlist page from the navigation bar. Next to each coin, you will see a remove button (trash icon or star toggle). Click it to remove the coin from your watchlist. The change takes effect immediately and your updated watchlist will be saved automatically.",
      },
      {
        q: "Is my Watchlist saved between sessions?",
        a: "Yes! Your watchlist is tied to your CryptoView account and saved securely via Firebase. As long as you are logged in, your watchlist will be the same whether you open CryptoView on your phone, laptop, or any other device.",
      },
      {
        q: "Can I use the Watchlist without an account?",
        a: "No — the Watchlist feature requires a free CryptoView account to save and sync your coins. However, signing up is free and takes under a minute. Once you have an account, your watchlist will always be there whenever you log back in.",
      },
    ],
  },
  {
    category: "Account & Security",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    faqs: [
      {
        q: "How is my account secured?",
        a: "CryptoView uses Firebase Authentication, a secure and industry-standard authentication platform trusted by millions of apps worldwide. Your password is never stored in plain text. Firebase encrypts all credentials and handles authentication using the same infrastructure used by major tech companies.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "On the Login page, click the 'Forgot Password' link below the login form. Enter your registered email address and CryptoView will send you a password reset link via Firebase. Check your inbox (and spam folder), click the link, and follow the instructions to set a new password.",
      },
      {
        q: "Can I sign in with Google?",
        a: "Yes! CryptoView supports Google Sign-In. On the Login or Sign Up page, click the 'Continue with Google' button. You will be redirected to Google's authentication flow, and once approved, you will be signed in to CryptoView instantly — no password needed.",
      },
      {
        q: "How do I delete my account?",
        a: "To delete your CryptoView account, please contact us at mtanveerdev.33@gmail.com with your registered email address and a request to delete your account. We will process the request and permanently remove your account and associated data within 48 hours.",
      },
    ],
  },
  {
    category: "Trending Page",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    faqs: [
      {
        q: "What is the Trending page?",
        a: "The Trending page on CryptoView shows the cryptocurrencies that are gaining the most attention, search volume, and market movement in the last 24 hours. It is powered by CoinGecko's trending data and is a great way to discover emerging coins and tokens before they break into the mainstream.",
      },
      {
        q: "How are trending coins determined?",
        a: "Trending coins are determined by CoinGecko based on search volume, community activity, and price movement across their platform over the past 24 hours. CryptoView displays this data directly — we do not modify or filter the trending results in any way.",
      },
      {
        q: "How often does the Trending page update?",
        a: "The Trending page fetches the latest data from CoinGecko each time you visit or refresh the page. CoinGecko updates their trending rankings every few hours based on real-time activity across their platform.",
      },
    ],
  },
];

const guides = [
  {
    title: "How to track a coin's price history",
    steps: [
      "Go to the Cryptos page from the navigation bar.",
      "Use the search bar to find the coin you want, or scroll through the list.",
      "Click on the coin's name or row to open its detail page.",
      "On the detail page, you will see an interactive price chart.",
      "Click the timeframe buttons (1D, 1W, 1M, 1Y) to switch between different historical views.",
    ],
  },
  {
    title: "How to build and manage your Watchlist",
    steps: [
      "Sign up for a free CryptoView account or log in if you already have one.",
      "Navigate to the Cryptos page and find a coin you want to track.",
      "Click on the coin to open its detail page.",
      "Click the star icon or 'Add to Watchlist' button on the detail page.",
      "Go to the Watchlist page from the navigation to see all your saved coins.",
      "To remove a coin, click the remove button next to it on the Watchlist page.",
    ],
  },
  {
    title: "How to find trending cryptocurrencies",
    steps: [
      "Click on 'Trending' in the top navigation bar.",
      "The Trending page loads the top trending coins from CoinGecko automatically.",
      "Browse the list to see which coins are gaining attention right now.",
      "Click on any trending coin to view its full detail page with charts and stats.",
      "If you find a coin interesting, add it to your Watchlist directly from its detail page.",
    ],
  },
];

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [openGuide, setOpenGuide] = useState(null);

  const toggleFaq = (key) => setOpenFaq(openFaq === key ? null : key);
  const toggleGuide = (i) => setOpenGuide(openGuide === i ? null : i);

  return (
    <div className="bg-white text-gray-900 font-sans">

      <section className="bg-blue-900 py-20 px-6 text-center">
        <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">Help & Support</p>
        <h1 className="text-5xl font-extrabold text-white mb-5 leading-tight">
          How can we help you?
        </h1>
        <p className="text-blue-200 text-lg max-w-xl mx-auto leading-relaxed">
          Find answers to common questions, step-by-step guides, and everything you need
          to get the most out of CryptoView.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {faqCategories.map((cat, i) => (
            <button
              key={cat.category}
              onClick={() => {
                setActiveCategory(i);
                document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/10 transition"
            >
              {cat.icon}
              {cat.category}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Browse all coins",
              desc: "View live prices, market caps, and 24h changes for 2,400+ cryptocurrencies.",
              link: "/cryptos",
              linkText: "Go to Cryptos →",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              ),
            },
            {
              title: "Your Watchlist",
              desc: "Save your favorite coins to a personal watchlist and track them from your dashboard.",
              link: "/watchlist",
              linkText: "Go to Watchlist →",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ),
            },
            {
              title: "Trending right now",
              desc: "Discover the hottest coins gaining the most traction and search volume today.",
              link: "/trending",
              linkText: "See Trending →",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                </svg>
              ),
            },
          ].map((card) => (
            <div
              key={card.title}
              className="border border-gray-200 rounded-2xl p-7 hover:border-blue-900 hover:shadow-md transition group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition">
                {card.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{card.desc}</p>
              <Link to={card.link} className="text-sm font-bold text-blue-900 group-hover:underline">
                {card.linkText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">Step-by-step</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">How-to guides</h2>
          <p className="text-gray-500 mb-12 leading-relaxed">
            New to CryptoView? Follow these step-by-step guides to get started quickly.
          </p>
          <div className="space-y-4">
            {guides.map((guide, i) => (
              <div
                key={i}
                className={`bg-white border rounded-2xl overflow-hidden transition-all ${openGuide === i ? "border-blue-900" : "border-gray-200"}`}
              >
                <button
                  onClick={() => toggleGuide(i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{guide.title}</span>
                  </div>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-light transition-all duration-300 ${openGuide === i ? "bg-blue-900 text-white rotate-45" : "bg-blue-50 text-blue-900"}`}>
                    +
                  </span>
                </button>
                {openGuide === i && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-5">
                    <ol className="space-y-3">
                      {guide.steps.map((step, si) => (
                        <li key={si} className="flex gap-4">
                          <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-900 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {si + 1}
                          </span>
                          <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq-section" className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">FAQ</p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-12">Frequently asked questions</h2>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Category sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="space-y-2 lg:sticky lg:top-24">
              {faqCategories.map((cat, i) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition ${
                    activeCategory === i
                      ? "bg-blue-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className={activeCategory === i ? "text-white" : "text-blue-900"}>
                    {cat.icon}
                  </span>
                  {cat.category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ list */}
          <div className="flex-1 space-y-3">
            {faqCategories[activeCategory].faqs.map((faq, i) => {
              const key = `${activeCategory}-${i}`;
              return (
                <div
                  key={key}
                  className={`border rounded-2xl overflow-hidden transition-all ${openFaq === key ? "border-blue-900" : "border-gray-200"}`}
                >
                  <button
                    onClick={() => toggleFaq(key)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="text-sm font-bold text-gray-900 pr-4">{faq.q}</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-light transition-all duration-300 ${openFaq === key ? "bg-blue-900 text-white rotate-45" : "bg-blue-50 text-blue-900"}`}>
                      +
                    </span>
                  </button>
                  {openFaq === key && (
                    <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">Still need help?</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Get in touch</h2>
          <p className="text-gray-500 mb-14 max-w-xl leading-relaxed">
            Can't find what you're looking for? Our support team is here to help.
            Reach out and we'll get back to you as soon as possible.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Email Support",
                desc: "Send us an email and we'll respond within 24–48 hours with a detailed answer to your question.",
                detail: "mtanveerdev.33@gmail.com",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
              },
              {
                title: "Response Time",
                desc: "We typically respond to all support requests within one business day. Urgent issues are prioritized.",
                detail: "Within 24–48 hours",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f2d6e" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
              },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-gray-200 rounded-2xl p-7 hover:border-blue-900 hover:shadow-md transition group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition">
                  {c.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{c.desc}</p>
                <p className="text-sm font-bold text-blue-900">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-24 px-6 text-center">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Ready to explore?</p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
          Everything you need is<br />
          <span className="text-blue-400">already on CryptoView.</span>
        </h2>
        <p className="text-gray-400 text-base max-w-lg mx-auto leading-relaxed mb-12">
          Real-time prices, interactive charts, trending coins, and a personal watchlist —
          all free, all in one place. Start exploring now.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/dashboard"
            className="px-10 py-4 bg-blue-900 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-900/40"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/cryptos"
            className="px-10 py-4 border border-white/20 text-white font-bold rounded-xl text-sm hover:bg-white/10 transition"
          >
            Explore all coins
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Help;