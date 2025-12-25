<script setup lang="ts">
import { isMobile } from '~/logics'

interface TocItem {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  contentRef: HTMLElement | null
}>()

const headings = ref<TocItem[]>([])
const activeId = ref('')

function extractHeadings() {
  if (!props.contentRef)
    return
  const elements = props.contentRef.querySelectorAll('h1, h2, h3')
  headings.value = Array.from(elements)
    .filter(el => el.id)
    .map(el => ({
      id: el.id,
      text: el.textContent?.replace('#', '').trim() || '',
      level: Number(el.tagName[1]),
    }))
}

function updateActiveHeading() {
  for (const h of headings.value) {
    const el = document.getElementById(h.id)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 100)
        activeId.value = h.id
    }
  }
}

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    const y = window.scrollY + el.getBoundingClientRect().top - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
    window.history.replaceState({}, '', `#${id}`)
  }
}

onMounted(() => {
  extractHeadings()
  window.addEventListener('scroll', updateActiveHeading)
  updateActiveHeading()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})

watch(() => props.contentRef, extractHeadings)
</script>

<template>
  <nav v-if="headings.length && !isMobile" class="toc-right">
    <ul>
      <li
        v-for="h in headings"
        :key="h.id"
        :class="[`toc-level-${h.level}`, { active: activeId === h.id }]"
      >
        <a :href="`#${h.id}`" @click.prevent="scrollTo(h.id)">
          {{ h.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
