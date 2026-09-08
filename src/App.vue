<script setup>
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import Navbar from '@/Components/navbar.vue'
import { storeToRefs } from 'pinia';
import { useCoinsStore } from '@/stores/coins';

const route = useRoute()
const coinsStore = useCoinsStore()
const { searchQuery } = storeToRefs(coinsStore)
</script>
<template>
    <Navbar v-if="route.name === 'mianpage'" v-model="searchQuery" />
  <RouterView />
</template>
<style scoped></style>