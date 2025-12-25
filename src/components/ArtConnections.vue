<script setup lang="ts">
import { isMobile } from '~/logics'

const el = ref<HTMLCanvasElement | null>(null)
const size = reactive(useWindowSize())

const GROW_DURATION = 8000
const MAX_DISTANCE = 100
const SPEED = 0.3
const LINE_COLOR = '#888888'
const POINT_RADIUS = 2

const minPoints = computed(() => isMobile.value ? 30 : 50)
const maxPoints = computed(() => isMobile.value ? 200 : 500)

interface Point {
  x: number
  y: number
  vx: number
  vy: number
}

const points: Point[] = []
let animationId: number | null = null
let startTime = 0
let activePointCount = 0

function initCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const ctx = canvas.getContext('2d')!
  const dpr = window.devicePixelRatio || 1

  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.width = dpr * width
  canvas.height = dpr * height
  ctx.scale(dpr, dpr)

  return ctx
}

function createPoints(width: number, height: number, count: number) {
  points.length = 0
  for (let i = 0; i < count; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * SPEED * 2,
      vy: (Math.random() - 0.5) * SPEED * 2,
    })
  }
}

function updatePoints(width: number, height: number, count: number) {
  for (let i = 0; i < count; i++) {
    const p = points[i]
    p.x += p.vx
    p.y += p.vy

    // Bounce at edges
    if (p.x < 0 || p.x > width)
      p.vx *= -1
    if (p.y < 0 || p.y > height)
      p.vy *= -1

    // Clamp to bounds
    p.x = Math.max(0, Math.min(width, p.x))
    p.y = Math.max(0, Math.min(height, p.y))
  }
}

function draw(ctx: CanvasRenderingContext2D, width: number, height: number, count: number) {
  ctx.clearRect(0, 0, width, height)

  // Draw lines between nearby points
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = points[i].x - points[j].x
      const dy = points[i].y - points[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < MAX_DISTANCE) {
        const opacity = (1 - dist / MAX_DISTANCE) * 0.5
        ctx.strokeStyle = `${LINE_COLOR}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.moveTo(points[i].x, points[i].y)
        ctx.lineTo(points[j].x, points[j].y)
        ctx.stroke()
      }
    }
  }

  // Draw points
  ctx.fillStyle = `${LINE_COLOR}25`
  for (let i = 0; i < count; i++) {
    const p = points[i]
    ctx.beginPath()
    ctx.arc(p.x, p.y, POINT_RADIUS, 0, Math.PI * 2)
    ctx.fill()
  }
}

onMounted(() => {
  const canvas = el.value!
  let ctx = initCanvas(canvas, size.width, size.height)
  createPoints(size.width, size.height, maxPoints.value)
  startTime = Date.now()

  function animate() {
    // Calculate active point count with easeOutSine
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / GROW_DURATION, 1)
    const eased = Math.sin(progress * Math.PI / 2)
    activePointCount = Math.floor(minPoints.value + (maxPoints.value - minPoints.value) * eased)

    updatePoints(size.width, size.height, activePointCount)
    draw(ctx, size.width, size.height, activePointCount)
    animationId = requestAnimationFrame(animate)
  }

  animate()

  watch([() => size.width, () => size.height], () => {
    ctx = initCanvas(canvas, size.width, size.height)
  })

  watch(isMobile, () => {
    createPoints(size.width, size.height, maxPoints.value)
    startTime = Date.now()
  })
})

onUnmounted(() => {
  if (animationId)
    cancelAnimationFrame(animationId)
})

const mask = computed(() => 'radial-gradient(circle, transparent, black)')
</script>

<template>
  <div
    class="fixed top-0 bottom-0 left-0 right-0 pointer-events-none print:hidden"
    style="z-index: -1"
    :style="`mask-image: ${mask};-webkit-mask-image: ${mask};`"
  >
    <canvas ref="el" />
  </div>
</template>
