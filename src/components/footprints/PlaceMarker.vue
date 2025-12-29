<script setup lang="ts">
import { type Map, Marker, Popup } from 'mapbox-gl'
import type { FootprintPlace } from '~/types'

const props = defineProps<{
  color: string
  place: FootprintPlace
}>()

const map = inject<Ref<Map | undefined>>('mapbox-map')

let marker: Marker | undefined
let popup: Popup | undefined

const position = computed(() => {
  const { coords } = props.place
  if (typeof coords === 'string') {
    // Parse "lat,lng" string and reverse to [lng, lat]
    return coords.split(',').map(Number).reverse() as [number, number]
  }
  return coords
})

function showPopup() {
  if (map?.value && popup)
    popup.setLngLat(position.value).addTo(map.value)
}

function hidePopup() {
  popup?.remove()
}

function createMarkerElement() {
  const el = document.createElement('div')
  el.className = 'marker-dot'
  if (props.place.current)
    el.classList.add('marker-current')

  el.style.setProperty('--dot-color', props.color)
  el.setAttribute('aria-label', props.place.label)
  el.setAttribute('tabindex', '0')

  el.addEventListener('mouseenter', showPopup)
  el.addEventListener('mouseleave', hidePopup)
  el.addEventListener('focus', showPopup)
  el.addEventListener('blur', hidePopup)
  el.addEventListener('click', (evt) => {
    evt.stopPropagation()
    showPopup()
  })

  return el
}

onMounted(() => {
  if (!map?.value)
    return

  popup = new Popup({
    offset: 8,
    closeButton: false,
    closeOnMove: false,
    focusAfterOpen: false,
  }).setText(props.place.label)

  const element = createMarkerElement()

  marker = new Marker({
    element,
    anchor: 'center',
  })
    .setLngLat(position.value)
    .addTo(map.value)

  // Close popup on map click
  map.value.on('click', hidePopup)
})

onUnmounted(() => {
  marker?.remove()
  if (map?.value)
    map.value.off('click', hidePopup)
})
</script>

<template>
  <div />
</template>

<style>
.marker-dot {
  width: 10px;
  height: 10px;
  cursor: pointer;
  border: 1px solid white;
  border-radius: 50%;
  background-color: var(--dot-color);
  box-shadow: 0 4px 4px var(--dot-color);
  transition: box-shadow 0.2s, filter 0.2s;
}

.marker-dot:hover,
.marker-dot:focus {
  box-shadow: 0 8px 24px var(--dot-color);
  filter: brightness(0.75);
}

.marker-current {
  width: 16px;
  height: 16px;
}
</style>
