import axios from "axios";

const API = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
});

// 20 per page — max allowed on CoinGecko free tier
// Call with page=1,2,3... to get more coins
export const getCoins = (page = 1) =>
  API.get("/coins/markets", {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 20,
      page,
      price_change_percentage: "1h,24h,7d",
      sparkline: false,
    },
  });

export const getCoinDetails = (id) =>
  API.get(`/coins/${id}`, {
    params: {
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false,
    },
  });

export const getChart = (id, days = 7) =>
  API.get(`/coins/${id}/market_chart`, {
    params: {
      vs_currency: "usd",
      days,
    },
  });