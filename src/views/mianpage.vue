<template>
    <main class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header class="mb-8">
            <p class="text-sm font-semibold uppercase tracking-wider text-primary">Market overview</p>
            <h1 class="mt-2 text-3xl font-bold sm:text-4xl">Explore cryptocurrencies</h1>
            <p class="mt-2 text-base-content/70">Track prices and daily movement across the market.</p>
        </header>
        <button class="btn btn-sm" :class="showOnlyFavorites ? 'btn-primary' : 'btn-ghost'"
            @click="showOnlyFavorites = !showOnlyFavorites">
            ★ My watchlist
        </button>

        <section v-if="isLoading" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Loading coins">
            <article v-for="card in skeletonCards" :key="card" class="card bg-base-100 shadow-sm">
                <div class="card-body gap-4">
                    <div class="skeleton h-16 w-16 rounded-full"></div>
                    <div class="skeleton h-5 w-32"></div>
                    <div class="skeleton h-4 w-24"></div>
                    <div class="skeleton h-10 w-full"></div>
                </div>
            </article>
        </section>

        <section v-else-if="error" class="flex flex-col items-center gap-4 py-16 text-center">
            <h2 class="text-2xl font-semibold">Unable to load market data</h2>
            <p class="text-base-content/70">{{ error }}</p>
            <button type="button" class="btn btn-primary" @click="loadCoins">Try again</button>
        </section>

        <section v-else-if="!filteredCoins.length" class="py-16 text-center">
            <h2 class="text-2xl font-semibold">No coins found</h2>
            <p class="mt-2 text-base-content/70">Try a different search term.</p>
        </section>

        <section v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <article v-for="coin in filteredCoins" :key="coin.id"
                class="card bg-base-100 shadow-sm transition-shadow hover:shadow-md">
                <figure class="px-6 pt-6">
                    <img class="h-16 w-16" :src="coin.image" :alt="`${coin.name} logo`" loading="lazy" />
                </figure>
                <div class="card-body">
                    <div class="flex items-start justify-between gap-3">
                        <h2 class="card-title">{{ coin.name }}</h2>
                        <span class="badge shrink-0"
                            :class="coin.price_change_percentage_24h >= 0 ? 'badge-success' : 'badge-error'">
                            <span aria-hidden="true">{{ coin.price_change_percentage_24h >= 0 ? '↑' : '↓' }}</span>
                            {{ formatPercentage(coin.price_change_percentage_24h) }}%
                        </span>
                    </div>
                    <div class="flex flex-row justify-between">

                        <div class="card-actions mt-2 justify-end">
                            <router-link :to="`/coin/${coin.id}`" class="btn btn-primary">View details</router-link>
                        </div>
                        <button class="btn btn-ghost btn-circle" @click="coinsStore.toggleFavorite(coin.id)">
                            <span
                                :class="favorites.includes(coin.id) ? 'text-warning' : 'text-base-content/30'">★</span>
                        </button>
                    </div>
                </div>
            </article>
        </section>
    </main>
</template>
<script setup>
import { RouterLink } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCoinsStore } from '@/stores/coins'

const coinsStore = useCoinsStore()
const { coins, searchQuery, isLoading, error, favorites } = storeToRefs(coinsStore)

const skeletonCards = Array.from({ length: 8 }, (_, index) => index)

const showOnlyFavorites = ref(false)

const filteredCoins = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    let result = coins.value
    if (query) result = result.filter(coin => coin.name.toLowerCase().includes(query))
    if (showOnlyFavorites.value) result = result.filter(coin => favorites.value.includes(coin.id))
    return result
})

function formatPercentage(value) {
    return Number(value ?? 0).toFixed(2)
}

function loadCoins() {
    return coinsStore.fetchCoins()
}

onMounted(() => {
    if (!coins.value.length) loadCoins()
})

</script>