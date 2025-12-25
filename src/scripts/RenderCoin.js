import { getCoin } from "./Api.js";
import Handlebars from "handlebars";
import coinTemplate from "../templates/coin.hbs?raw";
const template = Handlebars.compile(coinTemplate);
Handlebars.registerHelper("price", function (value) {
  if (!value || isNaN(value)) return "$0.00";
  return (
    "$" +
    value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
});

Handlebars.registerHelper("bigNumber", function (value) {
  if (!value || isNaN(value)) return "$0";
  if (value >= 1e12) return "$" + (value / 1e12).toFixed(2) + "T";
  if (value >= 1e9) return "$" + (value / 1e9).toFixed(2) + "B";
  if (value >= 1e6) return "$" + (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3) return "$" + (value / 1e3).toFixed(2) + "K";
  return "$" + value.toLocaleString();
});

Handlebars.registerHelper("percent", function (value) {
  if (!value || isNaN(value)) return "0.00%";
  const sign = value > 0 ? "+" : "";
  return sign + Math.abs(value).toFixed(2) + "%";
});

Handlebars.registerHelper("changeColor", function (value) {
  if (value > 0) return "text-green-glow";
  if (value < 0) return "text-red-glow";
  return "";
});

Handlebars.registerHelper("trendIcon", function (value) {
  if (value > 0) return "trending-up";
  if (value < 0) return "trending-down";
  return "minus";
});

Handlebars.registerHelper("shortDesc", function (text) {
  if (!text) return "No description available.";
  const sentences = text.split(". ");
  return sentences.slice(0, 3).join(". ") + (sentences.length > 3 ? "." : "");
});
export async function RenderCoin(coinName) {
  const coin = await getCoin(coinName);
  const html = template(coin);

  document.getElementById("coinContainer").innerHTML = html;

  lucide.createIcons();
}
