<script setup lang="ts">
const props = defineProps<{
  rows: number
  cols: number
}>()
</script>

<template>
  <div class="bg-coolGray bg-op-20 rounded-2xl " :style="{ gridRow: `span ${props.rows}`, gridColumn: `span ${props.cols}` }">
    <slot />
  </div>
</template>
