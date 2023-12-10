<script setup lang="ts">
defineProps<{ pinned: Record<string, any[]> }>()

function slug(name: string) {
  return name.toLowerCase().replace(/[\s\\\/]+/g, '-')
}
</script>

<template>
  <div class="max-w-300 mx-auto">
    <div
      v-for="key, cidx in Object.keys(pinned)" :key="key" slide-enter
      :style="{ '--enter-stage': cidx + 1 }"
    >
      <h4 :id="slug(key)" class="mt-15 mb-2 font-bold text-center op75">
        {{ key }}
      </h4>
      <div
        class="project-grid py-2 max-w-500 w-max mx-auto"
        grid="~ cols-1 md:cols-2 gap-4"
        :class="pinned[key].length === 1 ? 'flex' : pinned[key].length > 2 ? 'lg:grid-cols-3' : ''"
      >
        <a
          v-for="item, idx in pinned[key]"
          :key="idx"
          class="item relative flex items-center"
          :href="item.link"
          target="_blank"
          :class="!item.link ? 'opacity-0 pointer-events-none h-0 -mt-8 -mb-4' : ''"
          :title="item.name"
        >
          <div v-if="item.icon" class="pt-2 pr-5">
            <div class="text-3xl opacity-50" :class="item.icon || 'i-carbon-unknown'" />
          </div>
          <div class="flex-auto">
            <div class="text-normal">{{ item.name }}</div>
            <div class="desc text-sm opacity-50 font-normal" v-html="item.desc" />
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-grid a.item {
  background: transparent;
  font-size: 1.1rem;
  width: 350px;
  max-width: 100%;
  padding: 0.5rem 0.875rem 0.875rem;
  border-radius: 6px;
}

.project-grid a.item:hover {
  background: #88888811;
}
</style>
