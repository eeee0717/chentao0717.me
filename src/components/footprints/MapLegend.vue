<script setup lang="ts">
import type { FootprintCategory } from '~/types'

const props = defineProps<{
  categories: FootprintCategory[]
  activeLegends: Set<string>
}>()

const emit = defineEmits<{
  (e: 'toggle', label: string, value: boolean): void
}>()

function toggle(label: string) {
  emit('toggle', label, !props.activeLegends.has(label))
}
</script>

<template>
  <div class="legend-container">
    <div
      v-for="category in categories"
      :key="category.label"
      class="legend-item"
      :class="{ inactive: !activeLegends.has(category.label) }"
      @click="toggle(category.label)"
    >
      <span
        class="legend-dot"
        :style="{ background: category.color }"
        aria-hidden="true"
      />
      <span>{{ category.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.legend-container {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.5rem 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  font-size: 0.875rem;
}

html.dark .legend-container {
  background: rgba(0, 0, 0, 0.3);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.legend-item.inactive {
  opacity: 0.3;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border: 1px solid white;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
