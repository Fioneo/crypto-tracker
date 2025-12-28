import { getCoin } from "./Api.js";
import Handlebars from "handlebars";
import coinTemplate from "../templates/coin.hbs?raw";
import Chart from "chart.js/auto";
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
  return sentences.slice(0, 1).join(". ") + (sentences.length >= 1 ? "." : "");
});
export async function RenderCoin(coinName) {
  const coin = await getCoin(coinName);
  const html = template(coin);

  document.getElementById("coinContainer").innerHTML = html;
  renderPriceChart(coin);
  lucide.createIcons();
}
function renderPriceChart(coinData) {
  const prices = coinData.market_data.sparkline_7d.price;

  const canvas = document.getElementById("coin-price-chart");
  if (!canvas) return;

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  const ctx = canvas.getContext("2d");

  const totalDuration = 500;
  const delayBetweenPoints = totalDuration / prices.length;

  canvas.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: prices.map((_, i) => i),
      datasets: [
        {
          data: prices,
          borderColor: "#00ffff",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(0, 255, 255, 0.1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: "nearest",
        intersect: false,
      },

      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: () => "",
            label: (ctx) => `$${ctx.parsed.y.toFixed(2)}`,
          },
        },
      },

      elements: {
        point: {
          radius: 0,
          hitRadius: 20,
          hoverRadius: 0,
        },
      },

      animation: {
        x: {
          type: "number",
          easing: "linear",
          duration: delayBetweenPoints,
          from: NaN,
          delay(ctx) {
            if (ctx.type !== "data" || ctx.xStarted) return 0;
            ctx.xStarted = true;
            return ctx.index * delayBetweenPoints;
          },
        },
        y: {
          type: "number",
          easing: "easeOutQuart",
          duration: delayBetweenPoints,
          from: previousY,
          delay(ctx) {
            if (ctx.type !== "data" || ctx.yStarted) return 0;
            ctx.yStarted = true;
            return ctx.index * delayBetweenPoints;
          },
        },
      },

      scales: {
        x: { display: false },
        y: {
          grid: { color: "#333" },
          ticks: { color: "#666" },
        },
      },
    },
  });

  function previousY(ctx) {
    return ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(prices[0])
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;
  }
}
