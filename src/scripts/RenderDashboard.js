import { loadDashboardData } from "./Api.js";
import dashboardTemplate from "../templates/dashboard.hbs?raw";
import Handlebars from "handlebars";
import { registerHelpers } from "./Handlebars-helper.js";
import { dashboardChart } from "./Chart.js";
const template = Handlebars.compile(dashboardTemplate);
registerHelpers();
const dashContainer = document.getElementById("dashContainer");
export async function RenderDashboard() {
  const response = await loadDashboardData();
  const dataForTemplate = {
    global: response.global,
    fng: response.fng,
    top10: response.top10,
    solanaPrice: response.solana,
    gainerslosers: response.gainerslosers,
  };
  const html = template(dataForTemplate);
  dashContainer.innerHTML = html;
  dashboardChart(dataForTemplate.solanaPrice);
  lucide.createIcons();
  const progressBar = document.querySelector(".fng-progress-bar");
  if (progressBar && response.fngData) {
    progressBar.style.width = "0%";

    requestAnimationFrame(() => {
      progressBar.style.width = `${response.fngData.value}%`;
    });
  }
}
