export function renderSkeletonRows(count = 10) {
  return Array.from({ length: count })
    .map(
      () => `
      <tr class="border-b border-border-color">
        <!-- Rank -->
        <td class="p-3 lg:p-4">
          <div class="h-4 w-6 bg-gray-700 rounded animate-pulse-shimmer"></div>
        </td>

        <!-- Name + Symbol + Image -->
        <td class="p-3 lg:p-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-gray-700 animate-pulse-shimmer"></div>
            <div class="space-y-1 flex-1">
              <div class="h-4 w-24 bg-gray-700 rounded animate-pulse-shimmer"></div>
              <div class="h-3 w-12 bg-gray-600 rounded animate-pulse-shimmer"></div>
            </div>
          </div>
        </td>

        <!-- Price -->
        <td class="p-3 lg:p-4 text-right">
          <div class="h-4 w-16 bg-gray-700 rounded ml-auto animate-pulse-shimmer"></div>
        </td>

        <!-- 24h Change -->
        <td class="p-3 lg:p-4 text-right">
          <div class="h-4 w-12 bg-gray-700 rounded ml-auto animate-pulse-shimmer"></div>
        </td>

        <!-- Market Cap -->
        <td class="p-3 lg:p-4 text-right">
          <div class="h-4 w-20 bg-gray-700 rounded ml-auto animate-pulse-shimmer"></div>
        </td>

        <!-- Volume -->
        <td class="p-3 lg:p-4 text-right">
          <div class="h-4 w-20 bg-gray-700 rounded ml-auto animate-pulse-shimmer"></div>
        </td>
      </tr>
    `
    )
    .join("");
}
export function renderSkeletonCoin() {
  return `
<button
  type="button"
  class="flex gap-2 items-center w-48 h-10 skeleton animate-pulse-shimmer border-none"
  disabled
></button>

<div class="flex gap-4 items-center mt-6">
  <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full skeleton animate-pulse-shimmer"></div>
  <div class="flex flex-col gap-2 w-40">
    <div class="h-4 w-32 skeleton animate-pulse-shimmer"></div>
    <div class="h-3 w-20 skeleton animate-pulse-shimmer"></div>
  </div>
</div>

<ul class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mt-6">
  <li class="p-6 flex flex-col gap-2 box-shadow ">
    <div class="h-4 w-24 skeleton animate-pulse-shimmer"></div>
    <div class="h-6 w-20 skeleton animate-pulse-shimmer"></div>
  </li>
  <li class="p-6 flex flex-col gap-2 box-shadow ">
    <div class="h-4 w-24 skeleton animate-pulse-shimmer"></div>
    <div class="h-6 w-20 skeleton animate-pulse-shimmer"></div>
  </li>
  <li class="p-6 flex flex-col gap-2 box-shadow ">
    <div class="h-4 w-24 skeleton animate-pulse-shimmer"></div>
    <div class="h-6 w-24 skeleton animate-pulse-shimmer"></div>
  </li>
  <li class="p-6 flex flex-col gap-2 box-shadow ">
    <div class="h-4 w-24 skeleton animate-pulse-shimmer"></div>
    <div class="h-6 w-24 skeleton animate-pulse-shimmer"></div>
  </li>
</ul>

<div class="flex flex-col gap-6 box-shadow p-6 mt-6">
  <div class="h-6 w-48 skeleton animate-pulse-shimmer mb-4"></div>
  <div class="w-full h-64 skeleton animate-pulse-shimmer"></div>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
  <div class="p-6 flex flex-col gap-4 box-shadow">
    <div class="h-6 w-32 skeleton animate-pulse-shimmer"></div>
    <div class="flex flex-col gap-4 mt-2">
      <div class="h-4 w-full skeleton animate-pulse-shimmer"></div>
      <div class="h-4 w-full skeleton animate-pulse-shimmer"></div>
      <div class="h-4 w-2/3 skeleton animate-pulse-shimmer"></div>
    </div>
  </div>

  <div class="p-6 flex flex-col gap-4 box-shadow ">
    <div class="h-6 w-32 skeleton animate-pulse-shimmer mb-2"></div>
    <div class="h-20 w-full skeleton animate-pulse-shimmer"></div>
  </div>
</div>
    `;
}
