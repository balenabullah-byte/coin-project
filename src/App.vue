<script setup>
import { useTheme } from '@/composables/useTheme';
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import Navbar from '@/components/navbar.vue'
import { storeToRefs } from 'pinia';
import { useCoinsStore } from '@/stores/coinStore';

const route = useRoute()
const coinsStore = useCoinsStore()
const { searchQuery } = storeToRefs(coinsStore)
useTheme().initTheme()
</script>
<template>
    <Navbar v-if="route.name === 'home' || route.name === 'compare-coins'" v-model="searchQuery" />
  <RouterView />
</template>
<style scoped></style>