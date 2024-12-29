<script setup lang="ts">
export interface GridItem {
  id: string
  image: string
  title?: string
  cols: number
  rows: number
}

const gridItems: GridItem[] = [
  {
    id: 'music',
    image: '/images/2024final/2024-music.png',
    cols: 2,
    rows: 2,
  },
  {
    id: 'mainPhoto',
    image: '/images/2024final/2024-photo.jpg',
    cols: 4,
    rows: 2,
  },
  {
    id: 'avatar',
    image: '/avatar.png',
    cols: 2,
    rows: 2,
  },
  {
    id: 'funnyBook',
    image: '/images/2024final/2024-book-funny.jpg',
    title: '年度有趣书籍',
    cols: 2,
    rows: 3,
  },
  {
    id: 'photos',
    image: '/images/2024final/2024-photos2.jpg',
    cols: 2,
    rows: 3,
  },
  {
    id: 'editor',
    image: '/images/2024final/2024-code-vim.png',
    title: '年度最佳编辑器',
    cols: 4,
    rows: 3,
  },
  {
    id: 'language',
    image: '/images/2024final/2024-code-rust.png',
    title: '年度最爱语言',
    cols: 4,
    rows: 3,
  },
  {
    id: 'podcast',
    image: '/images/2024final/2024-podcast.jpg',
    cols: 2,
    rows: 3,
  },
  {
    id: 'book',
    image: '/images/2024final/2024-book-fantasy.jpg',
    title: '年度烧脑推理',
    cols: 2,
    rows: 3,
  },
  {
    id: 'chess',
    image: '/images/2024final/2024-chess.png',
    cols: 4,
    rows: 2,
  },
]
</script>

<template>
  <div>
    <h1>2024年终总结海报</h1>
    <div class="hidden lg:grid lg:gap-6  justify-center lg:grid-rows-[repeat(13,4rem)] lg:grid-cols-8">
      <ListBox :grid-items="gridItems.slice(0, 7)" />
      <Map />
      <Box class="col-span-4 row-span-1" />
      <ListBox :grid-items="[gridItems[7]]" />
      <Infj />
      <ListBox :grid-items="[gridItems[8]]" />
      <Github />
      <ListBox :grid-items="[gridItems[9]]" />
    </div>
    <div class="lg:hidden">
      手机分辨率过低，请使用电脑查看！
    </div>
  </div>
</template>
