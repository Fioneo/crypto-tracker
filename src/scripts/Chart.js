import Chart from "chart.js/auto";
export function renderPriceChart(coinData) {
  const prices = coinData.market_data.sparkline_7d.price;
  const pricesDay = coinData.market_data.price_change_percentage_24h;

  const isDown = pricesDay < 0;

  const lineColor = isDown ? "#ff0054" : "#00ffff";
  const fillColor = isDown
    ? "rgba(255, 77, 77, 0.2)"
    : "rgba(0, 255, 255, 0.1)";

  const canvas = document.getElementById("coin-price-chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const totalDuration = 500;
  const delayBetweenPoints = totalDuration / prices.length;

  function createChart(hideYAxis = false) {
    if (canvas.chart) canvas.chart.destroy();

    canvas.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: prices.map((_, i) => i),
        datasets: [
          {
            data: prices,
            borderColor: lineColor,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
            backgroundColor: fillColor,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "nearest", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            callbacks: {
              title: () => "",
              label: (ctx) => {
                const value = ctx.parsed.y;
                if (value < 0.1) {
                  const decimals = Math.max(8, -Math.floor(Math.log10(value)));
                  return `$${value.toFixed(decimals)}`;
                } else if (value < 10) {
                  return `$${value.toFixed(5)}`;
                } else {
                  return `$${value.toFixed(2)}`;
                }
              },
            },
          },
        },
        elements: { point: { radius: 0, hitRadius: 20, hoverRadius: 0 } },
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
            display: !hideYAxis,
            grid: { color: "#333" },
            ticks: {
              color: "#666",
              callback: function (value) {
                if (Math.abs(value) >= 1) {
                  return Number(value.toFixed(6));
                } else if (Math.abs(value) >= 0.01) {
                  return value.toFixed(4);
                } else if (Math.abs(value) >= 0.0001) {
                  return value.toFixed(6);
                } else {
                  return value.toFixed(8);
                }
              },
            },
          },
        },
      },
    });
  }

  function previousY(ctx) {
    return ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(prices[0])
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;
  }

  createChart(window.innerWidth <= 560);

  window.addEventListener("resize", () => {
    createChart(window.innerWidth <= 560);
  });
}
export function dashboardChart(coinData) {
  const prices = coinData.market_data.sparkline_7d.price;
  const pricesDay = coinData.market_data.price_change_percentage_24h;
  const isDown = pricesDay < 0;

  const lineColor = isDown ? "#ff0054" : "#00ffff";
  const fillColor = isDown
    ? "rgba(255, 77, 77, 0.2)"
    : "rgba(0, 255, 255, 0.1)";

  const canvas = document.getElementById("solana-price-chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const totalDuration = 500;
  const delayBetweenPoints = totalDuration / prices.length;

  if (canvas.chart) canvas.chart.destroy();

  canvas.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: prices.map((_, i) => i),
      datasets: [
        {
          data: prices,
          borderColor: lineColor,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
          backgroundColor: fillColor,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: () => "",
            label: (ctx) => {
              const value = ctx.parsed.y;
              if (value < 0.1) {
                const decimals = Math.max(8, -Math.floor(Math.log10(value)));
                return `$${value.toFixed(decimals)}`;
              } else if (value < 10) {
                return `$${value.toFixed(5)}`;
              } else {
                return `$${value.toFixed(2)}`;
              }
            },
          },
        },
      },
      elements: { point: { radius: 0, hitRadius: 20, hoverRadius: 0 } },
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
          ticks: {
            color: "#666",
            callback: function (value) {
              if (Math.abs(value) >= 1) {
                return Number(value.toFixed(6));
              } else if (Math.abs(value) >= 0.01) {
                return value.toFixed(4);
              } else if (Math.abs(value) >= 0.0001) {
                return value.toFixed(6);
              } else {
                return value.toFixed(8);
              }
            },
          },
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
