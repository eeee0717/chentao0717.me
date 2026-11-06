<script setup lang="ts">
import { createAvatarScene } from '~/logics/avatar-scene'

const canvas = ref<HTMLCanvasElement>()
const status = ref<'loading' | 'ready' | 'fallback'>('loading')
let scene: ReturnType<typeof createAvatarScene> | undefined

onMounted(() => {
  if (!canvas.value)
    return
  try {
    scene = createAvatarScene(canvas.value, {
      onReady: () => { status.value = 'ready' },
      onError: () => { status.value = 'fallback' },
    })
  }
  catch {
    status.value = 'fallback'
  }
})

onBeforeUnmount(() => scene?.destroy())
</script>

<template>
  <figure class="avatar-ascii">
    <div class="avatar-stage">
      <img
        v-show="status !== 'ready'"
        class="avatar-fallback no-preview"
        src="/avatar.png"
        alt="槑囿脑袋的头像：白发兽耳、紫色眼睛，穿着灰色连帽衫，在笔记本电脑前敲键盘"
        width="512"
        height="512"
        fetchpriority="high"
      >
      <canvas
        ref="canvas"
        :class="{ 'is-ready': status === 'ready' }"
        :aria-hidden="status !== 'ready'"
        role="img"
        aria-label="槑囿脑袋的头像动画：人物交替敲键盘，偶尔眨眼，伴随轻微呼吸"
      />
    </div>
  </figure>
</template>

<style scoped>
.avatar-ascii {
  width: 100%;
  min-width: 0;
  margin: 0;
}

.avatar-stage {
  position: relative;
  aspect-ratio: 1;
  mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, #000 46%, transparent 88%);
}

canvas,
.avatar-fallback {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

canvas {
  position: absolute;
  inset: 0;
  opacity: 0;
  touch-action: pan-y;
}

canvas.is-ready {
  opacity: 1;
}
</style>
