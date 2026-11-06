<script setup lang="ts">
const FootprintsMap = defineAsyncComponent(() => import('./footprints/FootprintsMap.vue'))

const trigger = ref<HTMLButtonElement>()
const card = ref<HTMLElement>()
const mode = ref<'closed' | 'hover' | 'pinned'>('closed')
const isOpen = computed(() => mode.value !== 'closed')
const reducedMotion = usePreferredReducedMotion()
const { width: viewportWidth, height: viewportHeight } = useWindowSize()
const bounds = useElementBounding(trigger)

const { start: scheduleOpen, stop: cancelOpen } = useTimeoutFn(() => {
  if (mode.value === 'closed')
    mode.value = 'hover'
}, 140, { immediate: false })

const { start: scheduleClose, stop: cancelClose } = useTimeoutFn(() => {
  if (mode.value === 'hover')
    mode.value = 'closed'
}, 220, { immediate: false })

const cardLayout = computed(() => {
  const margin = 16
  const gap = 12
  const width = Math.min(420, viewportWidth.value - margin * 2)
  const spaceAbove = bounds.top.value - margin - gap
  const spaceBelow = viewportHeight.value - bounds.bottom.value - margin - gap
  const above = spaceAbove >= 420 || spaceAbove > spaceBelow
  const height = Math.max(0, Math.min(420, above ? spaceAbove : spaceBelow))
  const top = above
    ? bounds.top.value - height - gap
    : bounds.bottom.value + gap
  const left = (bounds.left.value + bounds.right.value - width) / 2

  return {
    style: {
      width: `${width}px`,
      height: `${height}px`,
      top: `${Math.max(margin, Math.min(top, viewportHeight.value - height - margin))}px`,
      left: `${Math.max(margin, Math.min(left, viewportWidth.value - width - margin))}px`,
    },
    // Fit the globe's diameter (world size / pi) to the available card space.
    zoom: Math.log2(Math.max(120, Math.min(width, height) - 24) * Math.PI / 512),
  }
})

function enterTrigger(event: PointerEvent) {
  if (event.pointerType !== 'mouse')
    return
  cancelClose()
  scheduleOpen()
}

function leave() {
  cancelOpen()
  scheduleClose()
}

function close() {
  cancelOpen()
  cancelClose()
  mode.value = 'closed'
}

function closeAndFocus() {
  close()
  trigger.value?.focus({ preventScroll: true })
}

async function toggle(event: MouseEvent) {
  cancelOpen()
  cancelClose()
  if (mode.value === 'pinned') {
    close()
    return
  }
  mode.value = 'pinned'
  if (event.detail === 0) {
    await nextTick()
    card.value?.focus({ preventScroll: true })
  }
}

onClickOutside(card, close, { ignore: [trigger] })
onKeyStroke('Escape', (event) => {
  if (!isOpen.value)
    return
  event.preventDefault()
  closeAndFocus()
})
</script>

<template>
  <button
    ref="trigger"
    type="button"
    class="travel-trigger"
    aria-haspopup="dialog"
    :aria-expanded="isOpen"
    :aria-controls="isOpen ? 'travel-footprints' : undefined"
    @pointerenter="enterTrigger"
    @pointerleave="leave"
    @click="toggle"
  >
    <span>TRAVELING</span>
  </button>
  <Teleport to="body">
    <Transition name="travel-card">
      <section
        v-if="isOpen"
        id="travel-footprints"
        ref="card"
        class="travel-card"
        :style="cardLayout.style"
        role="dialog"
        aria-modal="false"
        aria-label="Travel map"
        tabindex="-1"
        @pointerenter="cancelClose"
        @pointerleave="leave"
      >
        <div class="travel-card-map">
          <FootprintsMap :zoom="cardLayout.zoom" :auto-rotate="reducedMotion !== 'reduce'" />
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

<style scoped>
.travel-trigger {
  display: inline;
  padding: 0;
  color: var(--fg-deeper);
  font: inherit;
  font-weight: 600;
  letter-spacing: 0.025em;
  border-bottom: 1px solid rgb(125 125 125 / 45%);
  cursor: pointer;
  transition: border-color 0.2s;
}

.travel-trigger:hover,
.travel-trigger[aria-expanded='true'] {
  border-color: currentColor;
}

.travel-trigger:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 4px;
}

.travel-card {
  position: fixed;
  z-index: 100;
  color: #262626;
  background: #fafaf8;
  border: 1px solid rgb(125 125 125 / 25%);
  border-radius: 18px;
  box-shadow: 0 16px 60px rgb(0 0 0 / 16%);
  overflow: hidden;
}

:global(html.dark .travel-card) {
  color: #ededeb;
  background: #111110;
  box-shadow: 0 16px 60px rgb(0 0 0 / 45%);
}

.travel-card-map {
  height: 100%;
}

.travel-card-map :deep(.controls) {
  right: 14px;
  bottom: 14px;
  left: 14px;
  align-items: center;
  pointer-events: none;
}

.travel-card-map :deep(.legend-container) {
  --uno: font-mono;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 16px;
  padding: 10px 12px;
  background: rgb(250 250 248 / 70%);
  border: 1px solid rgb(125 125 125 / 15%);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
  font-size: 11px;
  pointer-events: auto;
}

:global(html.dark .travel-card .legend-container) {
  background: rgb(17 17 16 / 70%);
}

.travel-card-enter-active,
.travel-card-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.travel-card-enter-from,
.travel-card-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 480px) {
  .travel-card-map :deep(.legend-container) {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: 4px 24px;
  }

  .travel-card-map :deep(.legend-item) {
    min-height: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .travel-card-enter-active,
  .travel-card-leave-active {
    transition: none;
  }
}
</style>
