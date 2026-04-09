import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
  };
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

const CoinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [showTradingView, setShowTradingView] = useState<boolean>(false);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get<CoinData>(
          `https://api.coingecko.com/api/v3/coins/${id}`
        );
        setCoin(data);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };

    const fetchChart = async () => {
      try {
        const { data } = await axios.get<{ prices: [number, number][] }>(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
          { params: { vs_currency: "usd", days: "7" } }
        );

        setChartData({
          labels: data.prices.map(price => new Date(price[0]).toLocaleDateString()),
          datasets: [
            {
              label: `${id?.toUpperCase()} Price (USD)`,
              data: data.prices.map(price => price[1]),
              borderColor: "#facc15",
              backgroundColor: "rgba(250, 204, 21, 0.2)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchCoin();
    fetchChart();
  }, [id]);

  useEffect(() => {
    if (showTradingView) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        width: "100%",
        height: 500,
        symbol: `BINANCE:${id?.toUpperCase()}USDT`,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: "tradingview-chart",
      });

      document.getElementById("tradingview-container")?.appendChild(script);
    }
  }, [showTradingView, id]);

  if (!coin) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{coin.name} ({coin.symbol.toUpperCase()})</h1>
      <p>Current Price: ${coin.market_data.current_price.usd.toLocaleString()}</p>
      <p>Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}</p>
      <p>Total Volume: ${coin.market_data.total_volume.usd.toLocaleString()}</p>

      <div className="mt-6">
        {chartData ? <Line data={chartData} /> : <p>Loading Chart...</p>}
      </div>

      {/* TradingView Show/Hide Button */}
      <button
        onClick={() => setShowTradingView(!showTradingView)}
        className="mt-6 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400"
      >
        {showTradingView ? "Hide TradingView Chart" : "Show TradingView Chart"}
      </button>

      {/* TradingView Chart (Hidden by Default) */}
      {showTradingView && (
        <div id="tradingview-container" className="mt-6">
          <div id="tradingview-chart"></div>
        </div>
      )}
    </div>
  );
};

export default CoinDetails;
