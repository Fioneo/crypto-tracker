export default class Navigation {
  constructor({
    topLinkId,
    dashLinkId,
    logoLinkId,
    backButtonSelector,
    topContainerId,
    dashContainerId,
    coinsContainerId,
    coinsTopId,
  }) {
    this.topLink = document.getElementById(topLinkId);
    this.dashLink = document.getElementById(dashLinkId);
    this.logoLink = document.getElementById(logoLinkId);
    this.backButtons = document.querySelectorAll(backButtonSelector);

    this.topContainer = document.getElementById(topContainerId);
    this.dashContainer = document.getElementById(dashContainerId);
    this.coinsContainer = document.getElementById(coinsContainerId);
    this.coinsTop = document.getElementById(coinsTopId);

    this.init();
  }

  init() {
    this.topLink?.addEventListener("click", this.goToTop100.bind(this));
    this.dashLink?.addEventListener("click", this.goToDashboard.bind(this));
    this.logoLink?.addEventListener("click", this.goToDashboard.bind(this));

    this.backButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.goToDashboard();
      });
    });

    this.coinsTop?.addEventListener("click", this.handleCoinClick.bind(this));

    window.addEventListener("popstate", this.handlePopState.bind(this));
    this.handleInitialLoad();
  }
  scroll() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  goToDashboard(e) {
    if (e) e.preventDefault();
    history.pushState({ view: "dashboard" }, "", "/");
    this.scroll();
    this.showDashboard();
  }

  goToTop100(e) {
    if (e) e.preventDefault();
    history.pushState({ view: "top100" }, "", "/top100");
    this.showTop100();
    this.scroll();
  }

  handleCoinClick(e) {
    const link = e.target.closest("a");
    if (!link) return;

    e.preventDefault();
    const coinPath = link.getAttribute("href");

    history.pushState({ view: "coin-detail" }, "", coinPath);
    this.scroll();
    this.showCoinDetail();
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

  handlePopState(e) {
    const state = e.state || { view: "dashboard" };
    switch (state.view) {
      case "top100":
        this.showTop100();
        break;
      case "coin-detail":
        this.showCoinDetail();
        break;
      case "dashboard":
      default:
        this.showDashboard();
        break;
    }
  }

  handleInitialLoad() {
    const path = window.location.pathname;

    if (path.startsWith("/coins/")) {
      this.showCoinDetail();
    } else if (path === "/top100") {
      this.showTop100();
    } else {
      this.showDashboard();
    }
  }
}
