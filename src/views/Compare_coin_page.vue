<template>
    <main class="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
        <div class="min-w-0 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto xl:pr-2">
            <div class="sticky top-0 z-10 mb-4 flex flex-wrap items-center gap-3 border-b bg-base-100 pb-4">
                <div class="flex gap-2 w-full overflow-x-auto min-w-0 sm:flex-1 sm:w-auto">
                    <span v-for="coin in compareCoins" :key="coin.id" class="badge badge-lg shrink-0 gap-2">
                        <img :src="coin.image" :alt="`${coin.name} logo`" class="w-4 h-4" /> {{ coin.name }}
                        <button class="btn btn-ghost btn-xs" @click="removeSelectedCoin(coin.id)">✕</button>
                    </span>
                </div>
                <span class="text-sm opacity-70 sm:whitespace-nowrap">{{ compareCoins.length }} / {{ filtered_compareCoins.length }}</span>
                <button class="btn btn-primary w-full sm:w-auto" :disabled="!canCompare" @click="showComparisonTable">Compare</button>
            </div>
            <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label v-for="coin in filtered_compareCoins" :key="coin.id"
                    class="card min-w-0 cursor-pointer border-2 border-transparent bg-base-100 shadow-sm has-checked:border-primary">
                    <div class="card-body items-center p-4">
                        <input type="checkbox" class="checkbox checkbox-primary absolute top-3 right-3"
                            :checked="selectedIds.includes(coin.id)" @change="toggleCompare(coin.id)" />
                        <img :src="coin.image" :alt="`${coin.name} logo`" loading="lazy" class="w-12 h-12" />
                        <h3 class="card-title text-base">{{ coin.name }}</h3>
                        <span class="badge shrink-0"
                            :class="coin.price_change_percentage_24h >= 0 ? 'badge-success' : 'badge-error'">
                            <span aria-hidden="true">{{ coin.price_change_percentage_24h >= 0 ? '↑' : '↓' }}</span>
                            {{ formatPercentage(coin.price_change_percentage_24h) }}%
                        </span>
                    </div>
                </label>
            </section>

        </div>

        <div v-if="showComparison" class="w-full min-w-0 overflow-x-auto rounded-box border border-base-300 xl:min-h-112" role="region" aria-label="Coin comparison" tabindex="0">
        <table class="table table-zebra w-full min-w-[36rem] text-sm sm:text-base">
            <thead>
                <tr>
                    <th>Coin</th>
                    <th>Price</th>
                    <th>24h change</th>
                    <th>Market cap</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="coin in compareCoins" :key="coin.id">
                    <th>{{ coin.name }}</th>
                    <td>{{ coin.current_price }}</td>
                    <td>
                        <span class="badge" :class="coin.price_change_percentage_24h >= 0 ? 'badge-success' : 'badge-error'">
                            {{ coin.price_change_percentage_24h >= 0 ? '↑' : '↓' }}
                            {{ formatPercentage(coin.price_change_percentage_24h) }}%
                        </span>
                    </td>
                    <td>{{ coin.market_cap }}</td>
                </tr>
            </tbody>
        </table>
        </div>
    </main>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { useCoinsStore } from '@/stores/coins'
import { computed,ref } from 'vue';
import{onMounted} from 'vue'
const coinsStore = useCoinsStore()

const { coins, searchQuery, isLoading, error, favorites, selectedIds, compareCoins, canCompare } = storeToRefs(coinsStore)
const showComparison = ref(false)
const filtered_compareCoins = computed(() => {
    let query = searchQuery.value.trim().toLowerCase()
    let result = coins.value
    if (query) {
        return coins.value.filter(coin => coin.name.toLowerCase().includes(query))
    }
    return result;
});
function formatPercentage(value) {
    return Math.abs(Number(value ?? 0)).toFixed(2)
}
function toggleCompare(coinId) {
    coinsStore.toggleCompare(coinId)
    showComparison.value = false
}
function clearCompare() {
    coinsStore.clearCompare()
    showComparison.value = false
}
function removeSelectedCoin(coinId) {
    toggleCompare(coinId)
}
function showComparisonTable() {
    showComparison.value = true
}
onMounted(() => {
  if (!coins.value.length) {
    coinsStore.fetchCoins().catch(error => console.error(error))
  }
})




</script>