<script setup lang="ts">

</script>

<template>
  <div>
    <h1>2024年终总结海报</h1>
    <div class="hidden lg:grid lg:gap-6  justify-center lg:grid-rows-[repeat(13,4rem)] lg:grid-cols-8">
      <Box class="bg-coolGray bg-op-20 col-span-2 row-span-2 ">
        <img class="rounded-2xl h-full" src="/images/2024final/2024-music.png">
      </Box>
      <Box class="bg-coolGray bg-op-20 col-span-4 row-span-2">
        <img class="rounded-2xl h-full" src="/images/2024final/2024-photo.jpg">
      </Box>

      <Box class="bg-coolGray bg-op-20 col-span-2 row-span-2 ">
        <img class="rounded-2xl h-full" src="/avatar.png">
      </Box>
      <Box class="bg-coolGray bg-op-20 col-span-2 row-span-3 ">
        <div class="flex-row justify-center ">
          <img class="rounded-2xl" src="/images/2024final/2024-book-funny.jpg">
          <div class="flex justify-center">
            年度有趣书籍
          </div>
        </div>
      </Box>
      <Box class="bg-coolGray bg-op-20 col-span-2 row-span-3">
        <img class="rounded-2xl h-full" src="/images/2024final/2024-photos2.jpg">
      </Box>
      <Box class="bg-coolGray bg-op-20 col-span-4 row-span-3 flex items-center justify-center">
        <div class="flex-row justify-center items-center">
          <img src="/images/2024final/2024-code-vim.png">
          <div class="flex justify-center">
            年度最佳编辑器
          </div>
        </div>
      </Box>
      <Box class="bg-coolGray bg-op-20 col-span-4 row-span-3 flex items-center justify-center">
        <div class="flex-row justify-center items-center">
          <img src="/images/2024final/2024-code-rust.png">
          <div class="flex justify-center">
            年度最爱语言
          </div>
        </div>
      </Box>
      <Map />
      <Box class="col-span-4 row-span-1" />
      <Box class="bg-coolGray bg-op-20 col-span-2 row-span-3">
        <img class="rounded-2xl h-full" src="/images/2024final/2024-podcast.jpg">
      </Box>
      <Box class=" bg-coolGray bg-op-20 col-span-4 row-span-3 relative overflow-visible text-right text-end">
        <img class="absolute left-0 bottom-0 w-[100%] h-[140%] object-cover" src="/images/infj.svg">
        <div class="absolute bottom-4 right-4 text-2xl text-[#33a474]">
          INFJ
        </div>
      </Box>
      <Box class="bg-coolGray bg-op-20 col-span-2 row-span-3">
        <div class="flex-row justify-center items-center">
          <img class="rounded-2xl" src="/images/2024final/2024-book-fantasy.jpg">
          <div class="flex justify-center">
            年度烧脑推理
          </div>
        </div>
      </Box>
      <Box class="col-span-4 row-span-2 bg-amber  bg-op-20">
        <div m-5>
          <div flex flex-row items-center gap-2>
            <div w-24px h-24px i-twemoji-crown />
            <div text-lg>
              Universal Rank
            </div>
          </div>
          <div m-t-5 text-2xl font-bold text-orange>
            Top 5%
          </div>
          <div m-t-5 text-gray text-op-70>
            *Github Commit > 500
          </div>
        </div>
      </Box>
      <Box class="bg-coolGray bg-op-20 col-span-4 row-span-2 ">
        <img class="rounded-2xl h-full" src="/images/2024final/2024-chess.png">
      </Box>
    </div>

    <div class="lg:hidden">
      手机分辨率过低，请使用电脑查看！
    </div>
  </div>
</template>
