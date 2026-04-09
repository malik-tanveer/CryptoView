import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

const CryptoList: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get<Coin[]>(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: { vs_currency: "usd", order: "market_cap_desc", per_page: 100 },
          }
        );
        setCoins(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCoins();
  }, []);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-yellow-400">Top 100 Cryptos</h2>
      <ul>
        {coins.map((coin) => (
          <li key={coin.id} className="flex justify-between p-2 border-b">
            <Link to={`/coin/${coin.id}`} className="hover:text-yellow-300 flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="w-6 h-6" />
              {coin.name} ({coin.symbol.toUpperCase()})
            </Link>
            <span>${coin.current_price.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CryptoList;
