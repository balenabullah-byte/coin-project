<template>
  <main id="main-content" tabindex="-1" class="page-shell">
    <header class="mb-8">
      <h1 class="text-3xl font-bold sm:text-4xl">Compare coins</h1>
      <p class="mt-3 text-base-content/75">Compare prices, daily changes, and market caps side by side.</p>
    </header>

    <section v-if="isLoading" class="state-panel" role="status" aria-busy="true">
      <span class="loading loading-spinner text-primary" aria-hidden="true"></span>
      <p>Loading coins...</p>
    </section>
    <section v-else-if="error" class="state-panel" role="alert">
      <h2 class="text-xl font-semibold">Unable to load market data</h2>
      <p class="text-base-content/75">{{ error }}</p>
      <button type="button" class="btn btn-primary min-h-11" @click="coinsStore.fetchCoins">Try again</button>
    </section>
    <template v-else>
      <div class="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5">
        <div class="min-w-0 flex-1">
          <p class="font-semibold" role="status">{{ compareCoins.length }} coins selected</p>
          <p id="compare-hint" class="mt-1 text-sm text-base-content/75">{{ canCompare ? 'Ready to compare your selected coins.' : 'Select at least 2 coins to compare.' }}</p>
        </div>
        <button type="button" class="btn btn-primary min-h-11 w-full sm:w-auto"
          :disabled="!canCompare" aria-describedby="compare-hint" @click="showComparisonTable">Compare</button>
        <ul v-if="compareCoins.length" aria-label="Selected coins" class="flex w-full flex-wrap gap-2 border-t border-base-300 pt-4">
          <li v-for="coin in compareCoins" :key="coin.id" class="flex min-w-0 max-w-full items-center gap-2 rounded-lg bg-base-200 pl-3">
            <img :src="coin.image" alt="" width="20" height="20" class="h-5 w-5 shrink-0 object-contain" />
            <span class="min-w-0 break-words text-sm font-medium">{{ coin.name }}</span>
            <button type="button" class="btn btn-ghost h-11 w-11 shrink-0 px-0"
              :aria-label="`Remove ${coin.name} from comparison`" @click="toggleCompare(coin.id)">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
            </button>
          </li>
        </ul>
      </div>

      <div class="grid items-start gap-6" :class="{ 'xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]': showComparison }">
        <section v-if="showComparison" ref="comparisonRef" tabindex="-1" aria-labelledby="comparison-title"
          class="min-w-0 scroll-mt-36 xl:col-start-2 xl:row-start-1">
          <h2 id="comparison-title" class="mb-3 text-lg font-semibold">Coin comparison</h2>
          <div role="region" aria-label="Coin comparison table" tabindex="0" class="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
            <table class="table table-zebra w-full min-w-xl text-sm">
              <caption class="sr-only">Selected coin prices and market caps in US dollars</caption>
              <thead>
                <tr>
                  <th scope="col" class="py-4 text-base-content/75">Coin</th>
                  <th scope="col" class="py-4 text-right text-base-content/75">Price</th>
                  <th scope="col" class="py-4 text-right text-base-content/75">24h change</th>
                  <th scope="col" class="py-4 text-right text-base-content/75">Market cap</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="coin in compareCoins" :key="coin.id">
                  <th scope="row" class="max-w-48 break-words py-4 font-semibold">{{ coin.name }}</th>
                  <td class="py-4 text-right whitespace-nowrap">{{ formatCurrency(coin.current_price) }}</td>
                  <td class="py-4 text-right"><PriceChange :value="coin.price_change_percentage_24h" /></td>
                  <td class="py-4 text-right whitespace-nowrap">{{ formatCurrency(coin.market_cap, { whole: true }) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section aria-label="Choose coins to compare" class="min-w-0" :class="{ 'xl:col-start-1 xl:row-start-1': showComparison }">
          <h2 class="mb-3 text-lg font-semibold">Choose coins</h2>
          <div v-if="!filteredCoins.length" class="state-panel" role="status">
            <h3 class="text-lg font-semibold">No coins found</h3>
            <p class="text-base-content/75">{{ searchQuery.trim() ? 'Try a different search term.' : 'Market data is unavailable right now.' }}</p>
            <button v-if="searchQuery.trim()" type="button" class="btn min-h-11" @click="searchQuery = ''">Clear search</button>
            <button v-else type="button" class="btn min-h-11" @click="coinsStore.fetchCoins">Try again</button>
          </div>
          <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2"
            :class="showComparison ? '' : 'lg:grid-cols-3 xl:grid-cols-4'">
            <label v-for="coin in filteredCoins" :key="coin.id"
              class="card min-w-0 cursor-pointer rounded-2xl border bg-base-100 transition-colors hover:border-primary/60 has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-primary"
              :class="selectedIds.includes(coin.id) ? 'border-primary bg-primary/5' : 'border-base-300'">
              <div class="card-body gap-3 p-5">
                <div class="flex items-center justify-between gap-3">
                  <img :src="coin.image" alt="" width="40" height="40" loading="lazy" class="h-10 w-10 object-contain" />
                  <input type="checkbox" class="checkbox checkbox-primary"
                    :aria-label="`Compare ${coin.name}`" :checked="selectedIds.includes(coin.id)" @change="toggleCompare(coin.id)" />
                </div>
                <h3 class="break-words text-base font-semibold">{{ coin.name }}</h3>
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="break-all text-sm font-medium tabular-nums">{{ formatCurrency(coin.current_price) }}</span>
                  <PriceChange :value="coin.price_change_percentage_24h" />
                </div>
              </div>
            </label>
          </div>
        </section>
      </div>
    </template>
  </main>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useCoinsStore } from '@/stores/coinStore'
import PriceChange from '@/Components/PriceChange.vue'
import { formatCurrency } from '@/utils/formatMarket'

const coinsStore = useCoinsStore()
const { coins, searchQuery, isLoading, error, selectedIds, compareCoins, canCompare } = storeToRefs(coinsStore)
const showComparison = ref(false)
const comparisonRef = ref(null)
const filteredCoins = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return query ? coins.value.filter(coin => coin.name.toLowerCase().includes(query)) : coins.value
})

function toggleCompare(coinId) {
  coinsStore.toggleCompare(coinId)
  showComparison.value = false
}

async function showComparisonTable() {
  if (!canCompare.value) return
  showComparison.value = true
  await nextTick()
  comparisonRef.value?.focus({ preventScroll: true })
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  comparisonRef.value?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' })
}

onMounted(() => {
  if (!coins.value.length) coinsStore.fetchCoins()
})
</script>
