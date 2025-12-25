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
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&price_change_percentage=24h&sparkline=false`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.error("Ошибка загрузки топ-100");
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
