import { getCoin } from "./Api.js";
import Handlebars from "handlebars";
import coinTemplate from "./../templates/coin.hbs?raw";
import { renderPriceChart } from "./Chart.js";
import { registerHelpers } from "./Handlebars-helper.js";
const template = Handlebars.compile(coinTemplate);
registerHelpers();
export async function RenderCoin(coinName) {
  const coin = await getCoin(coinName);
  const html = template(coin);

  document.getElementById("coinContainer").innerHTML = html;
  renderPriceChart(coin);
  lucide.createIcons();
}
