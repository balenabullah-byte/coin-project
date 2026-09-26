<template>
    <nav class="navbar sticky top-0 z-50 grid min-h-0 grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2 bg-base-100 px-3 py-2 shadow-sm sm:flex sm:min-h-16 sm:flex-nowrap sm:gap-3 sm:px-4">
        <div class="min-w-0">
            <router-link to="/" class="btn btn-ghost max-w-full truncate px-2 text-lg sm:text-xl" @click="scrollToTop">
                CoinTracker
            </router-link>
        </div>
        <label class="swap swap-rotate col-start-2 row-start-1 justify-self-end">
            <input v-model="isDarkMode" type="checkbox" class="theme-controller" value="dark"
                aria-label="Toggle dark mode" @change="applyTheme" />
            <svg class="swap-off h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            <svg class="swap-on h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
        </label>
        <div class="col-span-2 grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:ml-auto sm:flex sm:flex-1 sm:justify-end">
            <select class="select select-ghost select-sm w-32 min-w-0 sm:w-36" aria-label="Services" @change="navigateToService">
                <option value="" selected>Services</option>
                <option value="/compare-coins">Compare coins</option>
                <option value="" disabled>Ask AI (coming soon)</option>
                <option value="" disabled>Coin News (coming soon)</option>
            </select>
            <input type="text" placeholder="Search" class="input input-sm w-full min-w-0 sm:w-40 md:w-56 lg:w-64" :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)" />
        </div>
    </nav>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
defineProps(['modelValue'])
defineEmits(['update:modelValue'])

const router = useRouter()
const isDarkMode = ref(false)

function scrollToTop() {
    window.scrollTo(0, 0)
}

function navigateToService(event) {
    const path = event.target.value
    event.target.value = ''
    if (path) router.push(path)
}

function applyTheme() {
    const theme = isDarkMode.value ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
}

onMounted(() => {
    isDarkMode.value = localStorage.getItem('theme') === 'dark'
})
</script>