<template>
  <main v-if="coin || isLoading || error"
    class="flex min-h-screen w-full flex-col items-center justify-center gap-8 p-4">
    <section class="hero w-full bg-base-200">
      <div class="hero-content flex-col lg:flex-row">
        <img :src="coin.image" :alt="coin.name" class="w-full max-w-sm rounded-lg shadow-2xl" />
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
            <tr v-if="isLoading">
              <th><span class="loading loading-dots loading-xl"></span>
              </th>
              <td><span class="loading loading-dots loading-xl"></span>
              </td>
            </tr>
            <tr v-else-if="error">
              <td colspan="2">
                <div role="alert" class="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span>{{ error }}</span>
                </div>
              </td>
            </tr>
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
const { coins, isLoading, error } = storeToRefs(coinsStore)

const coin = computed(() => coins.value.find(item => item.id === route.params.id))
const coinKeys = computed(() => coin.value
  ? Object.keys(coin.value).filter(key => {
      if (key === 'image' || key === 'name') return false
      const value = coin.value[key]
      return typeof value !== 'object' || value === null
    })
  : [])

onMounted(() => {
  if (!coins.value.length) {
    coinsStore.fetchCoins().catch(error => console.error(error))
  }
})
</script>