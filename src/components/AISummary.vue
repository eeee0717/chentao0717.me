<script setup lang='ts'>
import { nextTick, ref } from 'vue'

defineProps<{
  summary: string
}>()

type State = 'idle' | 'animating' | 'revealed'
const state = ref<State>('idle')
const pixelCardRef = ref()

async function handleClick() {
  if (state.value !== 'idle')
    return
  state.value = 'animating'
  await nextTick()
  setTimeout(() => {
    pixelCardRef.value?.triggerAnimation()
  }, 50)
}

function onAnimationComplete() {
  // 像素已自动静止为背景，只需显示内容
  state.value = 'revealed'
}
</script>

<template>
  <!-- idle: 按钮 -->
  <button
    v-if="state === 'idle'"
    class="flex items-center gap-1 text-sm op70 hover:op100 transition-opacity cursor-pointer"
    @click="handleClick"
  >
    <div i-ri-robot-3-line />
    <span>展示摘要</span>
  </button>

  <!-- animating/revealed: PixelCard -->
  <PixelCard
    v-else
    ref="pixelCardRef"
    variant="default"
    width="100%"
    height="auto"
    :gap="5"
    :speed="55"
    colors="#f8fafc,#f1f5f9,#cbd5e1"
    :no-focus="false"
    :disable-hover="state === 'revealed'"
    class-name="rounded-lg"
    @animation-complete="onAnimationComplete"
  >
    <!-- 内容始终存在，通过 opacity 控制显示 -->
    <div
      class="relative z-10 p-3 flex flex-col gap-1 transition-opacity duration-300"
      :class="state === 'revealed' ? 'opacity-100' : 'opacity-0'"
    >
      <div class="flex items-center justify-between gap-1 text-sm">
        <div class="flex items-center gap-1 text-sm">
          <div i-ri-robot-3-line />
          <span>TLDR</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="breathing-dot w-2 h-2 rounded-full bg-green-500" />
          <span class="text-xs">AI-GEN</span>
        </div>
      </div>
      <span class="text-sm op90">
        {{ summary }}
      </span>
    </div>
  </PixelCard>
</template>

<style scoped>
.breathing-dot {
  animation: breathing 3s ease-in-out infinite;
}

@keyframes breathing {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
