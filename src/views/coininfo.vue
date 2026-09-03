<template>
<main v-if="coin" class="flex min-h-screen w-full flex-col items-center justify-center gap-8 p-4">
  <section class="hero w-full bg-base-200">
    <div class="hero-content flex-col lg:flex-row">
      <img
        :src="coin.image"
        :alt="coin.name"
        class="w-full max-w-sm rounded-lg shadow-2xl"
      />
      <h1 class="text-center text-3xl font-bold sm:text-5xl lg:text-left">{{ coin.name }}</h1>
    </div>
  </section>
  <section class="flex w-full justify-center">
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="key in coinKeys" :key="key">
            <th>{{ key }}</th>
            <td class="break-all">{{ coin[key] }}</td>
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
import { useRoute } from 'vue-router';
import { useCoinsStore } from '@/stores/coins';

const route = useRoute()
const coinsStore = useCoinsStore()
const { coins } = storeToRefs(coinsStore)

const coin = computed(() => coins.value.find(item => item.id === route.params.id))
const coinKeys = computed(() => coin.value
  ? Object.keys(coin.value).filter(key => key !== 'image' && key !== 'name')
  : [])

onMounted(() => {
  if (!coins.value.length) {
    coinsStore.fetchCoins().catch(error => console.error(error))
  }
})
</script>