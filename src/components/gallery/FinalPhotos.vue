<script setup lang="ts">

</script>

<template>
  <div class="aspect-ratio-square grid gap-4 sm:gap-6 justify-center grid-rows-4 grid-cols-4 lg:grid-rows-8 lg:grid-cols-8">
    <Box :rows="4" :cols="2">
      <div class="flex-row justify-center items-center">
        <img src="/images/2024final/2024-book-funny.jpg">
        <div class="flex justify-center">
          年度有趣书籍
        </div>
      </div>
    </Box>
    <Box :rows="4" :cols="2">
      <div class="flex-row justify-center items-center">
        <img src="/images/2024final/2024-book-fantasy.jpg">
        <div class="flex justify-center">
          年度烧脑推理
        </div>
      </div>
    </Box>
    <Box :rows="4" :cols="4">
      <div class="flex-row justify-center items-center">
        <img src="/images/2024final/2024-code-vim.png">
        <div class="flex justify-center">
          年度最佳编辑器
        </div>
      </div>
    </Box>
    <Box :rows="4" :cols="4">
      <div class="flex-row justify-center items-center">
        <img src="/images/2024final/2024-code-rust.png">
        <div class="flex justify-center">
          年度最爱语言
        </div>
      </div>
    </Box>
    <Map />
  </div>
</template>
