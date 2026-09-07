<script setup>
import { RouterView } from 'vue-router';
import Navbar from '@/Components/navbar.vue'
import { storeToRefs } from 'pinia';
import { useCoinsStore } from '@/stores/coins';

const coinsStore = useCoinsStore()
const { searchQuery } = storeToRefs(coinsStore)
</script>
<template>
    <Navbar v-model="searchQuery" />
  <RouterView />
</template>
<style scoped></style>