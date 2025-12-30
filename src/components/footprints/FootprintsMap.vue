<script setup lang="ts">
import footprintsData from '~/data/footprints.yaml'
import type { FootprintsData } from '~/types'

const props = withDefaults(defineProps<{
  width?: string
  height?: string
  fullPage?: boolean
  zoom?: number
  center?: [number, number]
  autoRotate?: boolean
}>(), {
  width: '100%',
  height: '100%',
  fullPage: false,
  zoom: 2,
  center: () => [100, 30],
  autoRotate: false,
})

const data = footprintsData as FootprintsData

// 控制 footer 显示（仅全屏模式）
onMounted(() => {
  if (props.fullPage)
    document.body.classList.add('hide-footer')
})

onUnmounted(() => {
  if (props.fullPage)
    document.body.classList.remove('hide-footer')
})

// Active legend categories (default: Visited, Residence, and Wishlist)
const activeLegends = ref(new Set(['Visited', 'Residence', 'Wishlist']))

// Filtered data based on active legends
const filteredData = computed(() =>
  data.filter(category => activeLegends.value.has(category.label)),
)

function handleLegendToggle(label: string, value: boolean) {
  if (value)
    activeLegends.value.add(label)

  else
    activeLegends.value.delete(label)
}
</script>

<template>
  <div class="footprints-container">
    <MapboxWrapper :zoom="props.zoom" :center="props.center" :auto-rotate="props.autoRotate">
      <template v-for="category in filteredData" :key="category.label">
        <PlaceMarker
          v-for="(place, index) in category.places"
          :key="`${category.label}-${index}`"
          :color="category.color"
          :place="place"
        />
      </template>
    </MapboxWrapper>

    <div class="controls">
      <MapLegend
        :categories="data"
        :active-legends="activeLegends"
        @toggle="handleLegendToggle"
      />
    </div>
  </div>
</template>

<style scoped>
.footprints-container {
  position: relative;
  width: v-bind('props.width');
  height: v-bind('props.height');
  background: transparent;
}

.controls {
  position: absolute;
  bottom: 0rem;
  right: 0rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  z-index: 10;
}

@media (max-width: 640px) {
  .controls {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    align-items: stretch;
  }
}
</style>
