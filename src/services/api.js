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
    },
  });

export const getCoinDetails = (id) =>
  API.get(`/coins/${id}`);

export const getChart = (id) =>
  API.get(`/coins/${id}/market_chart`, {
    params: { vs_currency: "usd", days: 7 },
  });