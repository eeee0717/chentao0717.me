<script setup lang="ts">
import collectionsData from '~/data/collections.yaml'

const collections = collectionsData as Record<string, any[]>

const sortedYears = computed(() => {
  return Object.keys(collections).sort((a, b) => Number(b) - Number(a))
})

function slug(name: string) {
  return name.toLowerCase().replace(/[\s\\\/]+/g, '-')
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'in_progress':
      return { text: 'In Progress', class: 'text-blue-500' }
    case 'wishlist':
      return { text: 'Wishlist', class: 'text-amber-500' }
    default:
      return null
  }
}

function formatName(name: string) {
  return name.split('_')
}
</script>

<template>
  <div class="max-w-300 mx-auto">
    <p text-center mt--6 mb5 op50 text-lg italic>
      Movies, TV shows and books I've enjoyed.
    </p>
    <div
      v-for="year, cidx in sortedYears" :key="year" slide-enter
      :style="{ '--enter-stage': cidx + 1 }"
    >
      <div
        :id="slug(year)"
        select-none relative h20 pointer-events-none slide-enter
        :style="{
          '--enter-stage': cidx - 2,
          '--enter-step': '60ms',
        }"
      >
        <span text-5em color-transparent absolute left--1rem top-0rem font-bold leading-1em text-stroke-1.5 text-stroke-hex-aaa op35 dark:op20>{{ year }}</span>
      </div>
      <div
        class="collection-grid py-2 mx-auto"
        grid="~ cols-2 sm:cols-3 md:cols-4 lg:cols-5 gap-4"
      >
        <div
          v-for="item, idx in collections[year]"
          :key="idx"
          class="item relative flex flex-col"
        >
          <div class="cover-wrapper relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-100 dark:bg-gray-800">
            <img
              :src="item.cover"
              :alt="item.name"
              class="w-full h-full object-cover"
              loading="lazy"
            >
          </div>
          <div class="info mt-2 text-center">
            <div class="name text-sm font-medium" :title="item.name.replace(/_/g, ' ')">
              <template v-for="(part, i) in formatName(item.name)" :key="i">
                <span>{{ part }}</span>
                <br v-if="i < formatName(item.name).length - 1">
              </template>
            </div>
            <div class="date text-xs op50">
              {{ item.date }}
            </div>
            <div v-if="getStatusLabel(item.status)" class="status text-xs mt-0.5" :class="getStatusLabel(item.status)?.class">
              {{ getStatusLabel(item.status)?.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="table-of-contents">
      <div class="table-of-contents-anchor">
        <div class="i-ri-menu-2-fill" />
      </div>
      <ul>
        <li v-for="year of sortedYears" :key="year">
          <a :href="`#${slug(year)}`">{{ year }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.collection-grid .item {
  transition: transform 0.2s ease;
}

.collection-grid .item:hover {
  transform: translateY(-4px);
}

.collection-grid .item .cover-wrapper {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.collection-grid .item:hover .cover-wrapper {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
</style>
