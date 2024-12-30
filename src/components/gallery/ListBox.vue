<script setup lang="ts">
import type { GridItem } from './FinalPhotos.vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  gridItems: GridItem[]
}>()
</script>

<template>
  <template v-for="item in props.gridItems" :key="item.id">
    <Box :class="cn('bg-coolGray bg-op-20', `row-span-${item.rows}`, `col-span-${item.cols}`) ">
      <div class="flex-row justify-center h-full">
        <img :class="cn('rounded-2xl', item.title ? '' : 'h-full')" :src="item.image">
        <div v-if="item.title" class="flex justify-center">
          {{ item.title }}
        </div>
      </div>
    </Box>
  </template>
</template>
