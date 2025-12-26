<script setup lang="ts">
import type { PersonalityData } from '~/types'

defineProps<PersonalityData>()
</script>

<template>
  <Box class="bg-coolGray bg-op-20 relative overflow-visible text-right text-end w-full h-full">
    <img class="absolute left-0 bottom-0 w-[100%] h-[140%] object-cover" :src="image">
    <div class="absolute bottom-4 right-4 text-2xl" :style="{ color }">
      {{ type }}
    </div>
  </Box>
</template>
