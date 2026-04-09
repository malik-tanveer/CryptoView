import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

const CryptoTable: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<Coin[]>(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 30,
              page: page,
            },
          }
        );
        setCoins(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchCoins();
  }, [page]);

  return (
    <div className="bg-gray-900 text-white p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-yellow-400 text-center">
        Crypto Market
      </h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Coin..."
        className="p-3 mb-6 w-full bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      {/* Table Container */}
      <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700 text-yellow-400 text-lg">
              <th className="p-4">#</th>
              <th className="p-4">Coin</th>
              <th className="p-4">Price</th>
              <th className="p-4">24h Change</th>
              <th className="p-4">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-lg">
                  Loading...
                </td>
              </tr>
            ) : (
              coins
                .filter((coin) => coin.name.toLowerCase().includes(search))
                .map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="border-b border-gray-700 hover:bg-gray-900 transition"
                  >
                    <td className="p-4 text-lg">{index + 1 + (page - 1) * 10}</td>
                    <td className="p-4 flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                      <Link
                        to={`/coin/${coin.id}`}
                        className="hover:text-yellow-300 text-lg"
                      >
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </Link>
                    </td>
                    <td className="p-4 text-lg">${coin.current_price.toLocaleString()}</td>
                    <td
                      className={`p-4 text-lg ${
                        coin.price_change_percentage_24h < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                    <td className="p-4 text-lg">${coin.market_cap.toLocaleString()}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          className="px-5 py-3 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 text-lg"
        >
          Previous
        </button>
        <span className="text-yellow-400 text-xl font-semibold">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-5 py-3 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 text-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CryptoTable;
