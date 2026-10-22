<template>
  <span class="badge shrink-0 gap-1 whitespace-nowrap font-medium tabular-nums"
    :class="direction === 'up' ? 'badge-success' : direction === 'down' ? 'badge-error' : 'badge-ghost'">
    <template v-if="hasValue">
      <svg v-if="direction !== 'unchanged'" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path :d="direction === 'up' ? 'M12 19V5m-6 6 6-6 6 6' : 'M12 5v14m-6-6 6 6 6-6'" />
      </svg>
      <span class="sr-only">{{ direction === 'up' ? 'Up' : direction === 'down' ? 'Down' : 'Unchanged' }}</span>
      {{ Math.abs(value).toFixed(2) }}%<span class="sr-only"> over 24 hours</span>
    </template>
    <template v-else><span class="sr-only">24-hour change unavailable: </span>N/A</template>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ value: { type: Number, default: null } })
const hasValue = computed(() => typeof props.value === 'number' && Number.isFinite(props.value))
const direction = computed(() => !hasValue.value || props.value === 0 ? 'unchanged' : props.value > 0 ? 'up' : 'down')
</script>
