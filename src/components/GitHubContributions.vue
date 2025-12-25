<script setup lang="ts">
import { drawContributions } from 'github-contributions-canvas'
import { isDark } from '~/logics'

const props = withDefaults(defineProps<{
  username?: string
}>(), {
  username: 'eeee0717',
})

const canvas = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Color mapping for contribution levels
const COLOR_MAP: Record<number, string> = {
  0: '#ebedf0',
  1: '#9be9a8',
  2: '#40c463',
  3: '#30a14e',
  4: '#216e39',
}

// Transform public API data to github-contributions-canvas format
function transformPublicApiData(rawData: {
  total: Record<string, number>
  contributions: Array<{ date: string, count: number, level: number }>
}) {
  const currentYear = new Date().getFullYear().toString()
  const allContributions = rawData.contributions || []

  // Filter contributions for current year only
  const contributions = allContributions.filter(c =>
    c.date && c.date.startsWith(currentYear),
  )

  // Find date range for current year
  const dates = contributions.map(c => c.date).filter(Boolean).sort()
  const startDate = dates[0] || `${currentYear}-01-01`
  const endDate = dates[dates.length - 1] || `${currentYear}-12-31`

  return {
    years: [{
      year: currentYear,
      total: rawData.total?.[currentYear] || 0,
      range: { start: startDate, end: endDate },
    }],
    contributions: contributions.map(c => ({
      date: c.date,
      count: c.count,
      color: COLOR_MAP[c.level] || COLOR_MAP[0],
      intensity: c.level,
    })),
  }
}

async function fetchAndDraw() {
  try {
    loading.value = true
    error.value = null

    // Use public API for dev, Cloudflare Function for production
    const isDev = import.meta.env.DEV
    const apiUrl = isDev
      ? `https://github-contributions-api.jogruber.de/v4/${props.username}`
      : `/api/github-contributions?username=${props.username}`

    const res = await fetch(apiUrl)

    if (!res.ok)
      throw new Error(`HTTP error: ${res.status}`)

    const rawData = await res.json()

    if (rawData.error)
      throw new Error(rawData.error)

    // Transform data if from public API (dev mode)
    const data = isDev ? transformPublicApiData(rawData) : rawData

    if (canvas.value) {
      drawContributions(canvas.value, {
        data,
        username: props.username,
        themeName: isDark.value ? 'githubDark' : 'standard',
        skipHeader: true,
        skipAxisLabel: false,
      })
    }
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load contributions'
  }
  finally {
    loading.value = false
  }
}

// Fetch on mount
onMounted(() => {
  fetchAndDraw()
})

// Redraw when theme changes
watch(isDark, () => {
  if (!loading.value && !error.value)
    fetchAndDraw()
})
</script>

<template>
  <div class="github-contributions">
    <!-- Loading State -->
    <div v-if="loading" class="loading-skeleton">
      <div class="skeleton-grid">
        <div
          v-for="i in 52 * 7"
          :key="i"
          class="skeleton-cell"
        />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <i-ri-error-warning-line class="error-icon" />
      <span>{{ error }}</span>
      <button class="retry-btn" @click="fetchAndDraw">
        Retry
      </button>
    </div>

    <!-- Canvas -->
    <canvas
      v-show="!loading && !error"
      ref="canvas"
      class="contributions-canvas"
    />
  </div>
</template>

<style scoped>
.github-contributions {
  width: 100%;
  overflow-x: auto;
}

.contributions-canvas {
  max-width: 100%;
  height: auto;
}

.loading-skeleton {
  padding: 1rem;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(52, 10px);
  grid-template-rows: repeat(7, 10px);
  gap: 3px;
}

.skeleton-cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: var(--c-bg-mute, #f0f0f0);
  animation: pulse 1.5s ease-in-out infinite;
}

.dark .skeleton-cell {
  background-color: #21262d;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--c-text-2, #666);
}

.error-icon {
  font-size: 2rem;
  color: #f87171;
}

.retry-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--c-border, #e5e7eb);
  border-radius: 0.375rem;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: var(--c-bg-mute, #f3f4f6);
}
</style>
