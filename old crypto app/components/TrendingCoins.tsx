import React, { useEffect, useState } from "react";
import axios from "axios";

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    small: string;
  };
}

const TrendingCoins: React.FC = () => {
  const [trending, setTrending] = useState<TrendingCoin[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get<{ coins: TrendingCoin[] }>(
          "https://api.coingecko.com/api/v3/search/trending"
        );
        setTrending(data.coins);
      } catch (error) {
        console.error("Error fetching trending coins:", error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-yellow-400">Trending Coins</h2>
      <ul>
        {trending.map((coin) => (
          <li key={coin.item.id} className="p-2 border-b flex gap-2">
            <img src={coin.item.small} alt={coin.item.name} className="w-6 h-6" />
            {coin.item.name} ({coin.item.symbol.toUpperCase()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingCoins;
