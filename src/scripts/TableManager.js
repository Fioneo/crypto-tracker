const SORT_MAP = {
  rank: "coinRank",
  name: "coinName",
  price: "coinPrice",
  change24h: "coinPercent",
  marketCap: "coinCap",
  volume: "coinVolume",
};
export default class TableManager {
  constructor(inputId, table) {
    this.input = document.getElementById(inputId);
    this.table = document.getElementById(table);
    this.tbody = this.table.querySelector("tbody");
    this.allRows = [];
    this.originalRows = [];
    this.init();
  }
  init() {
    this.allRows = Array.from(this.tbody.querySelectorAll("tr"));
    this.originalRows = [...this.allRows];
    this.input.addEventListener("input", this.onInput.bind(this));
    this.table
      .querySelector("thead")
      .addEventListener("click", this.onButtonClick.bind(this));
    this.currentSort = "rank";
    this.sortAsc = true;
    const defaultTh = this.table.querySelector('th[data-sort="rank"]');
    if (defaultTh) {
      this.updateSortIndicators(defaultTh);
    }
    this.isMobile = () => window.innerWidth < 768;
  }
  onInput(e) {
    const inputvalue = e.target.value.trim().toLowerCase();
    const url = new URL(window.location);
    if (inputvalue) {
      url.searchParams.set("search", inputvalue);
    } else {
      url.searchParams.delete("search");
    }
    history.replaceState({ view: "top100" }, "", url);
    if (this.isMobile()) {
      const mobileRows = Array.from(document.querySelectorAll(".mobileEl"));
      if (!inputvalue && this.isMobile()) this.showRows(mobileRows);
      mobileRows.forEach((row) => row.classList.add("hidden"));

      const filteredRows = mobileRows.filter((row) => {
        const rowName = row.dataset.coinName.toLowerCase();
        const coinSymbol = row.dataset.coinSymbol.toLowerCase();
        return rowName.includes(inputvalue) || coinSymbol.includes(inputvalue);
      });

      filteredRows.forEach((row) => row.classList.remove("hidden"));
    }
    const filteredInputRows = this.originalRows.filter((row) => {
      const rowName = row.dataset.coinName.toLowerCase();
      const coinSymbol = row.dataset.coinSymbol.toLowerCase();
      return rowName.includes(inputvalue) || coinSymbol.includes(inputvalue);
    });
    this.showRows(filteredInputRows);
  }
  showRows(rows) {
    this.allRows.forEach((row) => row.classList.add("hidden"));

    rows.forEach((row) => row.classList.remove("hidden"));
  }
  onButtonClick(e) {
    const th = e.target.closest("th[data-sort]");
    if (!th) return;
    const field = th.dataset.sort;
    if (this.currentSort === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.currentSort = field;
      this.sortAsc = true;
    }
    this.sortRows(field);

    this.updateSortIndicators(th);
  }
  updateSortIndicators(th) {
    this.table.querySelectorAll(".sort-icon").forEach((icon) => {
      icon.dataset.lucide = "arrow-up-down";
      icon.classList.add("opacity-50");
      icon.closest("button").classList.remove("text-cyan-neon");
    });
    const activeIcon = th.querySelector(".sort-icon");
    const activeButton = th.querySelector("button");

    activeButton.classList.add("text-cyan-neon");
    activeIcon.classList.remove("opacity-50");

    if (this.sortAsc) {
      activeIcon.dataset.lucide = "arrow-up";
    } else {
      activeIcon.dataset.lucide = "arrow-down";
    }
    lucide.createIcons();
  }
  sortRows(field) {
    const datasetKey = SORT_MAP[field];

    const rows = [...this.allRows].sort((a, b) => {
      let aVal = a.dataset[datasetKey];
      let bVal = b.dataset[datasetKey];

      if (!isNaN(aVal) && !isNaN(bVal)) {
        return this.sortAsc ? aVal - bVal : bVal - aVal;
      }

      return this.sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    const fragment = document.createDocumentFragment();

    rows.forEach((row) => fragment.appendChild(row));

    this.tbody.innerHTML = "";
    this.tbody.appendChild(fragment);
    this.allRows = rows;
  }
}
