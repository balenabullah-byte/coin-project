<template>
  <main id="main-content" tabindex="-1" class="page-shell max-w-4xl!">
    <RouterLink to="/" class="btn btn-ghost mb-6 min-h-11 gap-2">
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7m-7 7h14" /></svg>
      Back to coins
    </RouterLink>

    <section v-if="isLoading" class="state-panel" aria-busy="true" role="status">
      <span class="loading loading-spinner text-primary" aria-hidden="true"></span>
      <h1 class="text-xl font-semibold">Loading coin details...</h1>
    </section>
    <section v-else-if="error" role="alert" class="state-panel">
      <h1 class="text-xl font-semibold">Unable to load coin details</h1>
      <p class="text-base-content/75">{{ error }}</p>
      <button type="button" class="btn btn-primary min-h-11" @click="coinsStore.fetchCoins">Try again</button>
    </section>
    <template v-else-if="coin">
      <header class="mb-8 flex items-center gap-5">
        <img :src="coin.image" alt="" width="80" height="80" class="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20" />
        <h1 class="min-w-0 text-3xl font-bold sm:text-4xl">{{ coin.name }}</h1>
      </header>
      <div class="overflow-hidden rounded-2xl border border-base-300 bg-base-100">
        <table class="table table-zebra w-full text-sm sm:text-base">
          <caption class="sr-only">{{ coin.name }} market details in US dollars</caption>
          <thead>
            <tr>
              <th scope="col" class="px-4 py-4 text-base-content/75 sm:px-6">Metric</th>
              <th scope="col" class="px-4 py-4 text-right text-base-content/75 sm:px-6">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="metric in metrics" :key="metric.key">
              <th scope="row" class="px-4 py-4 font-medium sm:px-6">{{ metric.label }}</th>
              <td class="break-all px-4 py-4 text-right font-semibold tabular-nums sm:px-6">{{ metric.format(coin[metric.key]) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <section v-else class="state-panel" role="status">
      <h1 class="text-xl font-semibold">Coin not found</h1>
      <p class="max-w-md text-base-content/75">This coin isn't available in the current market list.</p>
      <RouterLink to="/" class="btn btn-primary min-h-11">Browse coins</RouterLink>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'
import { useCoinsStore } from '@/stores/coinStore'
import { formatCurrency } from '@/utils/formatMarket'

const route = useRoute()
const coinsStore = useCoinsStore()
const { coins, isLoading, error } = storeToRefs(coinsStore)
const coin = computed(() => coins.value.find(item => item.id === route.params.id))
const integerFormatter = new Intl.NumberFormat('en-US')
const metrics = [
  { label: 'Price', key: 'current_price', format: formatCurrency },
  { label: 'Market cap', key: 'market_cap', format: value => formatCurrency(value, { whole: true }) },
  { label: '24h high', key: 'high_24h', format: formatCurrency },
  { label: '24h low', key: 'low_24h', format: formatCurrency },
  { label: 'All-time high', key: 'ath', format: formatCurrency },
  { label: 'Market cap rank', key: 'market_cap_rank', format: value => typeof value === 'number' && Number.isFinite(value) ? `#${integerFormatter.format(value)}` : 'N/A' },
]

onMounted(() => {
  if (!coins.value.length) coinsStore.fetchCoins()
})
</script>
