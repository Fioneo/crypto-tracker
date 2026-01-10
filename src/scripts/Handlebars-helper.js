import Handlebars from "handlebars";

export function registerHelpers() {
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
    return (
      sentences.slice(0, 1).join(". ") + (sentences.length >= 1 ? "." : "")
    );
  });

  Handlebars.registerHelper("fngClass", function (value) {
    if (value <= 25) return "text-red-glow";
    if (value <= 45) return "text-orange-glow";
    if (value <= 55) return "text-yellow-glow";
    if (value <= 75) return "text-green-glow";
    return "text-cyan-neon";
  });

  Handlebars.registerHelper("shortCoinName", function (name) {
    if (!name) return "";
    const words = name.split(" ");
    const firstWords = words.slice(0, 3);
    return firstWords.join(" ");
  });
}
