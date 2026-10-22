<template>
  <main id="main-content" tabindex="-1" class="page-shell">
    <header class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div class="min-w-0">
        <h1 class="text-3xl font-bold sm:text-4xl">Explore cryptocurrencies</h1>
        <p class="mt-3 text-base-content/75">Track prices and daily movement across the market.</p>
      </div>
      <label class="flex shrink-0 flex-col gap-2 text-sm font-medium">
        Show
        <select class="select min-h-11 w-full bg-base-100 sm:w-44" v-model="selectedFilter">
          <option value="all">All coins</option>
          <option value="favorites">Favorites</option>
          <option value="price_up">Price up</option>
          <option value="price_down">Price down</option>
        </select>
      </label>
    </header>

    <section v-if="isLoading" aria-label="Loading coins" aria-busy="true">
      <p role="status" class="sr-only">Loading market data...</p>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
        <article v-for="card in 8" :key="card" class="card rounded-2xl border border-base-300 bg-base-100">
          <div class="card-body gap-4 p-5">
            <div class="skeleton h-12 w-12 rounded-full"></div>
            <div class="skeleton h-6 w-32"></div>
            <div class="skeleton h-7 w-40"></div>
            <div class="skeleton mt-2 h-11 w-full"></div>
          </div>
        </article>
      </div>
    </section>

    <section v-else-if="error" class="state-panel" role="alert">
      <h2 class="text-xl font-semibold">Unable to load market data</h2>
      <p class="text-base-content/75">{{ error }}</p>
      <button type="button" class="btn btn-primary min-h-11" @click="loadCoins">Try again</button>
    </section>

    <section v-else-if="!filteredCoins.length" class="state-panel" role="status">
      <h2 class="text-xl font-semibold">{{ emptyTitle }}</h2>
      <p class="max-w-md text-base-content/75">{{ emptyDescription }}</p>
      <button v-if="searchQuery.trim() || selectedFilter !== 'all'" type="button" class="btn min-h-11" @click="resetFilters">Show all coins</button>
      <button v-else type="button" class="btn min-h-11" @click="loadCoins">Try again</button>
    </section>

    <section v-else aria-label="Cryptocurrencies" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <article v-for="coin in filteredCoins" :key="coin.id" class="card min-w-0 rounded-2xl border border-base-300 bg-base-100">
        <div class="card-body gap-4 p-5">
          <div class="flex items-center justify-between gap-3">
            <img class="h-12 w-12 object-contain" :src="coin.image" alt="" width="48" height="48" loading="lazy" />
            <button type="button" class="btn btn-ghost btn-circle h-11 w-11"
              @click="coinsStore.toggleFavorite(coin.id)" :aria-pressed="coinsStore.isFavorite(coin.id)"
              :aria-label="`${coinsStore.isFavorite(coin.id) ? 'Remove' : 'Add'} ${coin.name} ${coinsStore.isFavorite(coin.id) ? 'from' : 'to'} favorites`">
              <svg viewBox="0 0 24 24" :fill="coinsStore.isFavorite(coin.id) ? 'currentColor' : 'none'"
                stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" class="h-5 w-5"
                :class="coinsStore.isFavorite(coin.id) ? 'text-primary' : 'text-base-content/65'" aria-hidden="true">
                <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </button>
          </div>
          <h2 class="text-lg font-semibold">{{ coin.name }}</h2>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="break-all text-xl font-semibold tabular-nums">{{ formatCurrency(coin.current_price) }}</p>
            <PriceChange :value="coin.price_change_percentage_24h" />
          </div>
          <div class="mt-auto pt-2">
            <RouterLink :to="`/coin/${coin.id}`" class="btn btn-primary min-h-11 w-full">
              View details<span class="sr-only"> for {{ coin.name }}</span>
            </RouterLink>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCoinsStore } from '@/stores/coinStore'
import PriceChange from './Components/PriceChange.vue'
import { formatCurrency } from '@/utils/formatMarket'

const coinsStore = useCoinsStore()
const { coins, searchQuery, isLoading, error, favorites } = storeToRefs(coinsStore)
const selectedFilter = ref('all')
const filteredCoins = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  let result = coins.value
  if (query) result = result.filter(coin => coin.name.toLowerCase().includes(query))
  if (selectedFilter.value === 'favorites') result = result.filter(coin => favorites.value.includes(coin.id))
  if (selectedFilter.value === 'price_up') result = result.filter(coin => coin.price_change_percentage_24h > 0)
  if (selectedFilter.value === 'price_down') result = result.filter(coin => coin.price_change_percentage_24h < 0)
  return result
})
const emptyTitle = computed(() => selectedFilter.value === 'favorites' && !favorites.value.length ? 'No favorites yet' : 'No coins found')
const emptyDescription = computed(() => {
  if (selectedFilter.value === 'favorites' && !favorites.value.length) return 'Use the star on a coin to save it to your favorites.'
  if (searchQuery.value.trim() || selectedFilter.value !== 'all') return 'Try a different search or show all coins.'
  return 'Market data is unavailable right now. Please try again.'
})

function resetFilters() {
  searchQuery.value = ''
  selectedFilter.value = 'all'
}

function loadCoins() { return coinsStore.fetchCoins() }

onMounted(() => {
  if (!coins.value.length) loadCoins()
})
</script>
