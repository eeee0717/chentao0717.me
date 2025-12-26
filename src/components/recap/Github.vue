<script setup lang="ts">
import type { GithubData } from '~/types'

defineProps<GithubData>()
</script>

<template>
  <Box class="w-full h-full bg-amber bg-op-20">
    <div p-5>
      <div flex flex-row items-center gap-2>
        <div w-24px h-24px i-twemoji-crown />
        <div text-lg>
          {{ title }}
        </div>
      </div>
      <div m-t-5 text-2xl font-bold text-orange>
        {{ rank }}
      </div>
      <div m-t-5 text-gray text-op-70>
        {{ subtitle }}
      </div>
    </div>
  </Box>
</template>
