<script setup lang="ts">
import type { TravelMapData } from '~/types'

const props = defineProps<TravelMapData>()

const planePosition = ref({ x: 0, y: 0 })
const planeRotation = ref(0)
const currentSegment = ref(0)
const isFlying = ref(false)

function getAngle(from: { x: number, y: number }, to: { x: number, y: number }) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  return Math.atan2(dy, dx) * (180 / Math.PI) + 40
}

const fromIndex = computed(() => currentSegment.value)
const toIndex = computed(() => (currentSegment.value + 1) % props.locations.length)

const currentPath = computed(() => {
  if (props.locations.length < 2)
    return null
  const from = props.locations[fromIndex.value]
  const to = props.locations[toIndex.value]
  return {
    x1: from.position.x,
    y1: from.position.y,
    x2: to.position.x,
    y2: to.position.y,
  }
})

onMounted(() => {
  if (props.locations.length < 2)
    return

  planePosition.value = { ...props.locations[0].position }

  function rotateToNext() {
    isFlying.value = false
    const from = props.locations[currentSegment.value]
    const toIndex = (currentSegment.value + 1) % props.locations.length
    const to = props.locations[toIndex]

    planeRotation.value = getAngle(from.position, to.position)

    setTimeout(flyToNext, 500)
  }

  function flyToNext() {
    isFlying.value = true
    const toIndex = (currentSegment.value + 1) % props.locations.length
    const to = props.locations[toIndex]

    planePosition.value = { ...to.position }

    // 飞行结束后再更新 currentSegment，这样虚线才能显示正确的航段
    setTimeout(() => {
      currentSegment.value = toIndex
      setTimeout(rotateToNext, 500)
    }, 2000)
  }

  setTimeout(rotateToNext, 1000)
})
</script>

<template>
  <Box class="w-full h-full">
    <div
      class="travel-map relative w-full h-full rounded-2xl bg-center bg-cover"
      :style="{ backgroundImage: `url('${backgroundImage}')` }"
    >
      <div class="absolute top-0 left-0 flex items-center text-white m-2">
        <div i-carbon-airplane class="mr-1" />
        <span>旅行足迹</span>
      </div>

      <!-- 地点标记 -->
      <div
        v-for="(loc, index) in locations"
        :key="index"
        class="location-marker absolute"
        :style="{ left: `${loc.position.x}%`, top: `${loc.position.y}%` }"
      >
        <div class="marker-dot" />
        <div
          class="marker-label"
          :class="{ show: index === fromIndex || index === toIndex }"
        >
          {{ loc.location }}
        </div>
      </div>

      <!-- 飞行路线虚线 -->
      <svg v-if="currentPath" class="flight-path absolute inset-0 w-full h-full">
        <line
          class="flight-line"
          :x1="`${currentPath.x1}%`"
          :y1="`${currentPath.y1}%`"
          :x2="`${currentPath.x2}%`"
          :y2="`${currentPath.y2}%`"
        />
      </svg>

      <!-- 飞机动画 -->
      <div
        v-if="locations.length >= 2"
        class="plane absolute"
        :class="isFlying ? 'flying' : 'rotating'"
        :style="{
          left: `${planePosition.x}%`,
          top: `${planePosition.y}%`,
          transform: `translate(-50%, -50%) rotate(${planeRotation}deg)`,
        }"
      >
        ✈️
      </div>
    </div>
  </Box>
</template>

<style scoped>
.travel-map {
  @apply bg-blend-overlay transition-all;
}

.dark .travel-map {
  background-color: rgba(0, 0, 0, 0.5);
}

.location-marker {
  transform: translate(-50%, -50%);
}

.marker-dot {
  @apply w-3 h-3 bg-blue rounded-full;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
  animation: pulse 2s infinite;
}

.marker-label {
  @apply absolute left-4 top-1/2 -translate-y-1/2;
  @apply text-white text-sm whitespace-nowrap;
  @apply opacity-0 transition-opacity;
}

.location-marker:hover .marker-label {
  @apply opacity-100;
}

.marker-label.show {
  opacity: 1;
}

.plane {
  font-size: 1.2rem;
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.plane.rotating {
  transition: transform 0.5s ease-in-out;
}

.plane.flying {
  transition: left 2s ease-in-out, top 2s ease-in-out, transform 0.5s ease-in-out;
}

.flight-path {
  pointer-events: none;
  z-index: 5;
}

.flight-line {
  stroke: white;
  stroke-width: 2;
  stroke-dasharray: 8 4;
  stroke-opacity: 0.4;
  stroke-linecap: round;
  animation: dash-flow 0.5s linear infinite;
}

@keyframes dash-flow {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -12;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}
</style>
