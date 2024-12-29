<script setup lang="ts">
import type { GridItem } from './FinalPhotos.vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  gridItems: GridItem[]
}>()
</script>

<template>
  <template v-for="item in props.gridItems" :key="item.id">
    <Box
      class="bg-coolGray bg-op-20" :class="[
        `col-span-${item.cols}`,
        `row-span-${item.rows}`,
      ]"
    >
      <div class="flex-row justify-center items-center h-full">
        <img
          :src="item.image"
          :alt="item.id"
          loading="lazy"
          :class="cn('rounded-2xl  w-full object-cover', item.title ? '' : 'h-full')"
        >
        <div v-if="item.title" class="flex justify-center">
          {{ item.title }}
        </div>
      </div>
    </Box>
  </template>
</template>
