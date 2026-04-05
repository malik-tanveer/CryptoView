import axios from "axios";

const API = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
});

export const getCoins = () =>
  API.get("/coins/markets", {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 50,
      price_change_percentage: "1h,24h,7d",
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