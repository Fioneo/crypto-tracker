import { renderSkeletonRows, renderSkeletonCoin } from "./skeletons.js";
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const headers = {
  accept: "application/json",
  "x-cg-demo-api-key": API_KEY,
};
const CACHE_KEY = "top100_coins";
const CACHE_DURATION = 60 * 1000;
export async function getTopCoins() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  const tbody = document.querySelector("#topTable tbody");
  tbody.innerHTML = renderSkeletonRows(10);
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&price_change_percentage=24h&sparkline=false`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
  return data;
}
export async function getCoin(coinName) {
  const CACHE_KEY_COIN = `coin_detail_${coinName}`;
  const cached = localStorage.getItem(CACHE_KEY_COIN);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  const coinContainer = document.getElementById("coinContainer");
  coinContainer.innerHTML = renderSkeletonCoin();
  const url = `https://api.coingecko.com/api/v3/coins/${coinName}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  localStorage.setItem(
    CACHE_KEY_COIN,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
  return data;
}
