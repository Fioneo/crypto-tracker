import {
  renderSkeletonRows,
  renderSkeletonCoin,
  renderSkeletonDashboard,
  renderSkeletonList,
} from "./skeletons.js";
import { apiFetch } from "./apiFetch.js";
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const headers = {
  accept: "application/json",
  "x-cg-demo-api-key": API_KEY,
};
const coinContainer = document.getElementById("coinContainer");
const dashContainer = document.getElementById("dashContainer");
const tbody = document.querySelector("#topTable tbody");
const topContainerMobile = document.getElementById("topContainerMobile");
const CACHE_KEY_DASHBOARD = "dashboard_data";
const CACHE_KEY = "top100_coins";
const CACHE_DURATION = 60 * 3000;
export async function getTopCoins() {
  const isMobile = () => window.innerWidth < 768;
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  if (isMobile()) {
    topContainerMobile.innerHTML = renderSkeletonList();
  } else {
    tbody.innerHTML = renderSkeletonRows(10);
  }
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
  coinContainer.innerHTML = renderSkeletonCoin();
  const url = `https://api.coingecko.com/api/v3/coins/${coinName}?sparkline=true`;
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
export async function loadDashboardData() {
  const cached = localStorage.getItem(CACHE_KEY_DASHBOARD);
  if (cached) {
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp < CACHE_DURATION) {
      return data;
    }
  }

  dashContainer.innerHTML = renderSkeletonDashboard();

  const globalRes = await apiFetch("https://api.coingecko.com/api/v3/global", {
    headers,
  });

  const fngRes = await apiFetch("https://api.alternative.me/fng/?limit=1");

  const top10Res = await apiFetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true",
    { headers }
  );

  const solanaRes = await apiFetch(
    "https://api.coingecko.com/api/v3/coins/solana?sparkline=true",
    { headers }
  );

  if (!globalRes.ok || !fngRes.ok || !top10Res.ok || !solanaRes.ok) {
    throw new Error("API limit");
  }

  const globalJson = await globalRes.json();
  const fngJson = await fngRes.json();
  const top10Json = await top10Res.json();
  const solanaPrice = await solanaRes.json();

  const gainerslosers = await getGainersLosers();

  const dashboardData = {
    global: globalJson.data,
    fng: fngJson.data[0],
    top10: top10Json,
    solana: solanaPrice,
    gainerslosers,
    timestamp: Date.now(),
  };

  localStorage.setItem(CACHE_KEY_DASHBOARD, JSON.stringify(dashboardData));

  return dashboardData;
}
async function getGainersLosers() {
  const pages = 4;
  const allCoins = [];

  for (let i = 1; i <= pages; i++) {
    const res = await apiFetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${i}&price_change_percentage=24h`,
      { headers }
    );

    if (!res.ok) break;

    const coins = await res.json();
    allCoins.push(...coins);
  }

  let gainers = 0;
  let losers = 0;

  for (const coin of allCoins) {
    if (coin.price_change_percentage_24h > 0) gainers++;
    else if (coin.price_change_percentage_24h < 0) losers++;
  }

  return {
    gainers,
    losers,
  };
}
