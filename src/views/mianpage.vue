<template>
    
    <section class="flex flex-wrap justify-center gap-4 px-4 py-10 sm:px-6">
        <div class="card bg-base-100 w-full max-w-96 shadow-sm px-4 py-10 sm:px-10" v-for="coin in filteredCoins" :key="coin.id">
            <figure>
                <img :src="coin.image" :alt="coin.name" />
            </figure>
            <div class="card-body">
                <h2 class="card-title">
                    {{ coin.name }}
                    <div class="badge" :class="coin.price_change_percentage_24h > 0 ? 'badge-success' : 'badge-error'">
                        <span aria-hidden="true">{{ coin.price_change_percentage_24h > 0 ? '↑' : '↓' }}</span>
                        {{ coin.price_change_percentage_24h.toFixed(2) }}%
                    </div>
                </h2>
                <div class="card-actions justify-end">
                    <router-link :to="`/coin/${coin.id}`" class="btn btn-primary">Info</router-link>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCoinsStore } from '@/stores/coins'

const coinsStore = useCoinsStore()
const { coins, searchQuery } = storeToRefs(coinsStore)

coinsStore.fetchCoins().catch(error => console.error(error))

const filteredCoins = computed(() => {
  if (!searchQuery.value) return coins.value
  return coins.value.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

</script>