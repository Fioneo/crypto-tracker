import {
  renderSkeletonRows,
  renderSkeletonCoin,
  renderSkeletonDashboard,
} from "./skeletons.js";
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const headers = {
  accept: "application/json",
  "x-cg-demo-api-key": API_KEY,
};
const coinContainer = document.getElementById("coinContainer");
const dashContainer = document.getElementById("dashContainer");
const tbody = document.querySelector("#topTable tbody");
const CACHE_KEY_DASHBOARD = "dashboard_data";
const CACHE_KEY = "top100_coins";
const CACHE_DURATION = 60 * 3000;
export async function getTopCoins() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
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
    const { global, fng, top10, solana, gainerslosers, timestamp } =
      JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return { global, fng, top10, solana, gainerslosers };
    }
  }
  dashContainer.innerHTML = renderSkeletonDashboard();
  const [globalRes, fngRes, top10Res, solanaRes] = await Promise.all([
    fetch("https://api.coingecko.com/api/v3/global", { headers }),
    fetch("https://api.alternative.me/fng/?limit=1"),
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true",
      { headers }
    ),
    fetch("https://api.coingecko.com/api/v3/coins/solana?sparkline=true", {
      headers,
    }),
  ]);
  if (!globalRes.ok || !fngRes.ok || !top10Res.ok || !solanaRes.ok) {
    return null;
  }

  const globalJson = await globalRes.json();
  const fngJson = await fngRes.json();
  const top10Json = await top10Res.json();
  const solanaPrice = await solanaRes.json();
  const gainersLosers = await getGainersLosers();
  const dashboardData = {
    global: globalJson.data,
    fng: fngJson.data[0],
    top10: top10Json,
    solana: solanaPrice,
    gainerslosers: gainersLosers,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY_DASHBOARD, JSON.stringify(dashboardData));
  return dashboardData;
}
async function getGainersLosers() {
  const pages = 4;

  const requests = Array.from({ length: pages }, (_, i) =>
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${
        i + 1
      }&price_change_percentage=24h`,
      { headers }
    )
  );

  const responses = await Promise.all(requests);

  const coinsArrays = await Promise.all(
    responses.map(async (res) => (res.ok ? res.json() : []))
  );

  const allCoins = coinsArrays.flat();

  const { gainers, losers } = allCoins.reduce(
    (acc, coin) => {
      if (coin.price_change_percentage_24h > 0) acc.gainers++;
      else if (coin.price_change_percentage_24h < 0) acc.losers++;
      return acc;
    },
    { gainers: 0, losers: 0 }
  );

  return { gainers, losers, total: gainers + losers };
}
