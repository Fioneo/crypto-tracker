import { RenderTopCoins } from "./RenderTopCoins.js";
import { RenderCoin } from "./RenderCoin.js";
import { RenderDashboard } from "./RenderDashboard.js";
export default class Navigation {
  constructor({
    topLinkId,
    dashLinkId,
    logoLinkId,
    backButtonSelector,
    topContainerId,
    dashContainerId,
    coinsContainerId,
  }) {
    this.topLink = document.getElementById(topLinkId);
    this.dashLink = document.getElementById(dashLinkId);
    this.logoLink = document.getElementById(logoLinkId);
    this.backButtons = document.querySelectorAll(backButtonSelector);

    this.topContainer = document.getElementById(topContainerId);
    this.dashContainer = document.getElementById(dashContainerId);
    this.coinsContainer = document.getElementById(coinsContainerId);

    this.init();
  }

  init() {
    this.topLink?.addEventListener("click", this.goToTop100.bind(this));
    this.dashLink?.addEventListener("click", this.goToDashboard.bind(this));
    this.logoLink?.addEventListener("click", this.goToDashboard.bind(this));

    document.addEventListener("click", async (e) => {
      const backBtn = e.target.closest(".backButton");
      if (!backBtn) return;

      e.preventDefault();
      console.log("возвращение");
      await this.goToDashboard(e);
    });

    document.addEventListener("click", this.handleCoinClick.bind(this));

    window.addEventListener("popstate", this.handlePopState.bind(this));
    this.handleInitialLoad();
  }
  scroll() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async route(view, payload) {
    this.hideAll();

    switch (view) {
      case "dashboard":
        this.showDashboard();
        await RenderDashboard();
        break;

      case "top100":
        this.showTop100();
        await RenderTopCoins();
        break;

      case "coin-detail":
        this.showCoinDetail();
        await RenderCoin(payload);
        break;

      default:
        this.showDashboard();
        await RenderDashboard();
    }
  }
  async goToDashboard(e) {
    e.preventDefault();
    this.scroll();
    history.pushState({ view: "dashboard" }, "", "/");
    await this.route("dashboard");
  }

  async goToTop100(e) {
    e.preventDefault();
    this.scroll();
    history.pushState({ view: "top100" }, "", "/top100");
    await this.route("top100");
  }

  async handleCoinClick(e) {
    const link = e.target.closest("a[data-coin-id]");
    if (!link) return;
    e.preventDefault();
    this.scroll();
    const coinId = link.dataset.coinId;
    const path = link.getAttribute("href");

    history.pushState({ view: "coin-detail", coinId }, "", path);

    await this.route("coin-detail", coinId);
  }

  showDashboard() {
    this.hideAll();
    this.dashContainer.classList.remove("hidden");
    this.setActiveNav(this.dashLink);
  }

  showTop100() {
    this.hideAll();
    this.topContainer.classList.remove("hidden");
    this.setActiveNav(this.topLink);
  }

  showCoinDetail() {
    this.hideAll();
    this.coinsContainer.classList.remove("hidden");
    this.setActiveNav(null);
  }

  hideAll() {
    this.topContainer.classList.add("hidden");
    this.dashContainer.classList.add("hidden");
    this.coinsContainer.classList.add("hidden");
  }

  setActiveNav(activeLink) {
    this.topLink?.classList.remove("button-active");
    this.dashLink?.classList.remove("button-active");
    if (activeLink) activeLink.classList.add("button-active");
  }

  async handlePopState(e) {
    const state = e.state || { view: "dashboard" };
    await this.route(state.view, state.coinId);
  }

  async handleInitialLoad() {
    const path = window.location.pathname;

    if (path.startsWith("/coins/")) {
      const coinId = path.split("/")[2];
      await this.route("coin-detail", coinId);
    } else if (path === "/top100") {
      await this.route("top100");
    } else {
      await this.route("dashboard");
    }
  }
}
