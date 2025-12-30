<script setup lang="ts">
import mapboxgl from 'mapbox-gl'
import type { Map } from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import 'mapbox-gl/dist/mapbox-gl.css'
import { isDark } from '~/logics'

const props = withDefaults(defineProps<{
  zoom?: number
  center?: [number, number]
  autoRotate?: boolean
}>(), {
  zoom: 2,
  center: () => [100, 30],
  autoRotate: false,
})

const mapContainer = ref<HTMLDivElement>()
const map = shallowRef<Map>()
const isLoaded = ref(false)

// Auto-rotate state
let animationId: number | null = null
let resumeTimeoutId: ReturnType<typeof setTimeout> | null = null
const isUserInteracting = ref(false)
const rotationSpeed = 0.05 // degrees per frame
const resumeDelay = 5000 // ms to wait before resuming rotation

// Provide map instance to child components
provide('mapbox-map', map)
provide('mapbox-loaded', isLoaded)

const mapStyle = computed(() =>
  `mapbox://styles/mapbox/${isDark.value ? 'dark' : 'light'}-v10`,
)

onMounted(() => {
  if (!mapContainer.value)
    return

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

  const mapInstance = new Map({
    container: mapContainer.value,
    style: mapStyle.value,
    center: props.center,
    zoom: props.zoom,
    projection: 'globe',
    dragRotate: true,
    touchPitch: true,
    attributionControl: false,
  })

  // Add language support
  const lang = navigator.language.toLowerCase()
  const defaultLanguage = {
    'zh-cn': 'zh-Hans',
    'zh-hk': 'zh-Hant',
    'zh-tw': 'zh-Hant',
  }[lang] || (lang.startsWith('zh') ? 'zh-Hans' : undefined)

  if (defaultLanguage) {
    mapInstance.addControl(
      new MapboxLanguage({ defaultLanguage }),
    )
  }

  mapInstance.on('style.load', () => {
    isLoaded.value = true
    // Configure fog for globe effect
    mapInstance.setFog({
      'color': 'rgba(0,0,0,0)',
      'high-color': 'rgba(255,255,255,0.1)',
      'space-color': 'rgba(0,0,0,0)',
      'horizon-blend': 0,
    })

    // Start auto-rotate if enabled
    if (props.autoRotate)
      startRotation()
  })

  // Handle user interaction for auto-rotate
  if (props.autoRotate) {
    const startInteraction = () => {
      isUserInteracting.value = true
      // Clear any pending resume timeout
      if (resumeTimeoutId !== null) {
        clearTimeout(resumeTimeoutId)
        resumeTimeoutId = null
      }
    }

    const endInteraction = () => {
      // Delay resuming rotation by 5 seconds
      resumeTimeoutId = setTimeout(() => {
        isUserInteracting.value = false
        resumeTimeoutId = null
      }, resumeDelay)
    }

    mapInstance.on('mousedown', startInteraction)
    mapInstance.on('mouseup', endInteraction)
    mapInstance.on('touchstart', startInteraction)
    mapInstance.on('touchend', endInteraction)
  }

  map.value = mapInstance
})

// Auto-rotate animation
function startRotation() {
  function rotate() {
    if (!map.value || !props.autoRotate)
      return

    if (!isUserInteracting.value) {
      const center = map.value.getCenter()
      center.lng += rotationSpeed
      map.value.setCenter(center)
    }

    animationId = requestAnimationFrame(rotate)
  }

  rotate()
}

// React to style changes (dark mode)
watch(mapStyle, (newStyle) => {
  if (map.value?.loaded())
    map.value.setStyle(newStyle)
})

onUnmounted(() => {
  // Stop auto-rotate
  if (animationId !== null)
    cancelAnimationFrame(animationId)

  // Clear resume timeout
  if (resumeTimeoutId !== null)
    clearTimeout(resumeTimeoutId)

  map.value?.remove()
  map.value = undefined
  isLoaded.value = false

  // 清理 Mapbox 可能残留的全局元素
  document.querySelectorAll('.mapboxgl-map, .mapboxgl-canvas-container, .mapboxgl-canvas').forEach(el => el.remove())
})
</script>

<template>
  <div ref="mapContainer" class="w-full h-full" />
  <slot v-if="isLoaded" />
</template>
