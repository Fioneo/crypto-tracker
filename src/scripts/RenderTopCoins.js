import { getTopCoins } from "./Api.js";
import TableManager from "./TableManager.js";
export async function RenderTopCoins() {
  const tbody = document.querySelector("#topTable tbody");
  const coins = await getTopCoins();
  let rowsHTML = "";

  coins.forEach((coin) => {
    const changeDisplay = Math.abs(coin.price_change_percentage_24h).toFixed(2);
    const changeColor =
      coin.price_change_percentage_24h > 0
        ? "text-green-glow"
        : "text-red-glow";
    const changeIcon =
      coin.price_change_percentage_24h > 0 ? "trending-up" : "trending-down";
    rowsHTML += ` <tr
                    class="border-b border-border-color hover:bg-[#1a1a3166] transition-colors coin-row opacity-0  cursor-pointer" data-coin-name="${coin.name.toLowerCase()}" data-coin-rank='${
      coin.market_cap_rank
    }'
    data-coin-symbol="${coin.symbol.toLowerCase()}"
    data-coin-price="${coin.current_price}"
    data-coin-percent="${changeDisplay}"
    data-coin-cap="${coin.market_cap}"
    data-coin-volume="${coin.total_volume}"> 
                  
                    <td class="p-3 lg:p-4  text-sm">${coin.market_cap_rank}</td>

                    <td class="p-3 lg:p-4">
                      <a
                        href="/coins/${coin.id}"
                        class="flex items-center gap-2 sm:gap-3 group " data-coin-id="${
                          coin.id
                        }"
                      >
                        <img
                          src="${coin.image}"
                          alt="${coin.id} logo"
                          loading="lazy"
                          class="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0"
                        />
                        <div>
                          <div
                            class="text-glow group-hover:text-cyan-neon transition-colors text-sm"
                          >
                            ${coin.name}
                          </div>
                          <div class="text-muted-foreground text-xs">${coin.symbol.toUpperCase()}</div>
                        </div>
                      </a>
                    </td>

                    <td class="p-3 lg:p-4 text-right text-glow text-sm">
                      $${coin.current_price.toLocaleString()}
                    </td>

                    <td class="p-3 lg:p-4 text-right">
                      <div
                        class="flex items-center justify-end gap-1 text-sm ${changeColor}"
                      >
                        <i
                          data-lucide="${changeIcon}"
                          class=" w-3 h-3 sm:w-4 sm:h-4"
                        ></i>
                        <span>${changeDisplay}%</span>
                      </div>
                    </td>

                    <td class="p-3 lg:p-4 text-right  text-glow text-sm">
                      $${coin.market_cap.toLocaleString()}
                    </td>

                    <td
                      class="p-3 lg:p-4 text-right text-glow text-sm "
                    >
                      $${coin.total_volume.toLocaleString()}
                    </td>
                  </tr>`;
  });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const row = entry.target;
          row.classList.remove("opacity-0");
          observer.unobserve(row);
        }
      });
    },
    {
      rootMargin: "0px 0px 0px 0px",
      threshold: 0.1,
    }
  );
  if (coins.length > 0) {
    tbody.innerHTML = rowsHTML;
    lucide.createIcons();
    new TableManager("tableInput", "topTable");
    document.querySelectorAll(".coin-row").forEach((row) => {
      observer.observe(row);
    });
  }
}
