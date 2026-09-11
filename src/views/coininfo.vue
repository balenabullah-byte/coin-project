<template>
  <main class="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 p-4 sm:p-8">
    <div class="w-full max-w-7xl">
      <RouterLink to="/" class="btn btn-ghost">Go Back</RouterLink>
    </div>
    <section v-if="coin" class="hero w-full bg-base-200">
      <div class="hero-content flex-col lg:flex-row">
        <img :src="coin.image" :alt="coin.name" class="w-full max-w-sm rounded-lg shadow-2xl" />
        <h1 class="text-center text-3xl font-bold sm:text-5xl lg:text-left">{{ coin.name }}</h1>
      </div>
    </section>
    <section class="w-full">
      <div v-if="isLoading" class="flex justify-center py-16">
        <span class="loading loading-dots loading-xl" aria-label="Loading coin details"></span>
      </div>
      <div v-else-if="error" role="alert" class="alert alert-error">
        <span>{{ error }}</span>
      </div>
      <div v-else-if="coin" class="overflow-x-auto rounded-box bg-base-100 shadow-sm">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="metric in metrics" :key="metric.label">
              <th>{{ metric.label }}</th>
              <td class="font-medium">{{ metric.format(coin[metric.key]) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute } from 'vue-router';
import { useCoinsStore } from '@/stores/coins';

const route = useRoute()
const coinsStore = useCoinsStore()
const { coins, isLoading, error } = storeToRefs(coinsStore)

const coin = computed(() => coins.value.find(item => item.id === route.params.id))
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})
const integerFormatter = new Intl.NumberFormat('en-US')

const metrics = [
  { label: 'Price', key: 'current_price', format: formatCurrency },
  { label: 'Market cap', key: 'market_cap', format: formatCurrency },
  { label: '24h high', key: 'high_24h', format: formatCurrency },
  { label: '24h low', key: 'low_24h', format: formatCurrency },
  { label: 'All-time high', key: 'ath', format: formatCurrency },
  { label: 'Market cap rank', key: 'market_cap_rank', format: formatRank },
]

function formatCurrency(value) {
  return value == null ? 'N/A' : currencyFormatter.format(value)
}

function formatRank(value) {
  return value == null ? 'N/A' : `#${integerFormatter.format(value)}`
}

onMounted(() => {
  if (!coins.value.length) {
    coinsStore.fetchCoins().catch(error => console.error(error))
  }
})
</script>