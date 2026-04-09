import React, { useEffect, useState } from "react";
import axios from "axios";

interface GlobalStatsData {
  total_market_cap: { usd: number };
  market_cap_percentage: { btc: number };
  active_cryptocurrencies: number;
}

const GlobalStats: React.FC = () => {
  const [stats, setStats] = useState<GlobalStatsData | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get<{ data: GlobalStatsData }>(
          "https://api.coingecko.com/api/v3/global"
        );
        setStats(data.data);
      } catch (error) {
        console.error("Error fetching global stats:", error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold text-yellow-400">Global Crypto Market</h2>
      <p>Total Market Cap: ${stats.total_market_cap.usd.toLocaleString()}</p>
      <p>BTC Dominance: {stats.market_cap_percentage.btc.toFixed(2)}%</p>
      <p>Active Cryptos: {stats.active_cryptocurrencies}</p>
    </div>
  );
};

export default GlobalStats;
