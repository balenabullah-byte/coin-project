<template>
    <div class="navbar sticky top-0 z-50 gap-2 bg-base-100 px-2 shadow-sm sm:px-4">
        <div class="min-w-0 flex-1">
            <router-link to="/" class="btn btn-ghost max-w-full truncate text-lg sm:text-xl" @click="scrollToTop">
                CoinTracker
            </router-link>
        </div>
        <div class="flex min-w-0 flex-1 justify-end gap-2">
            <input type="text" placeholder="Search" class="input w-24 sm:w-40 md:w-56 lg:w-64" :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)" />
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <img alt="Wile E. Coyote"
                            src="https://upload.wikimedia.org/wikipedia/commons/b/b8/Roadrunner_and_Wile_E._Coyote_%283645510220%29.jpg" />
                    </div>
                </div>
                <ul tabindex="-1"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li>
                        <a class="justify-between">
                            Profile
                            <span class="badge">New</span>
                        </a>
                    </li>
                    <li><a>Settings</a></li>
                    <li><a>Logout</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>
import { RouterLink } from 'vue-router';
defineProps(['modelValue'])
defineEmits(['update:modelValue'])

function scrollToTop() {
    window.scrollTo(0, 0)
}
</script>