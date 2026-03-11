<script setup lang="ts">
import { englishOnly } from '../logics'

const activeStyle = 'opacity-100 underline'
</script>

<template>
  <div class="prose m-auto mb-8 select-none animate-none! op100!">
    <div mb-0 flex="~ col gap-1 sm:row sm:gap-3 wrap" text-3xl>
      <RouterLink to="/diary" class="!border-none" :class="activeStyle">
        Diary
      </RouterLink>
    </div>
  </div>
</template>
