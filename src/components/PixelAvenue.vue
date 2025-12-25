<script setup lang="ts">
import { photos } from '../../photos/data'
import Masonry from './Masonry.vue'

const items = photos
</script>

<template>
  <div class="flex">
    <Masonry :items="items" />
  </div>
</template>
