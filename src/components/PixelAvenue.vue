<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Masonry from './Masonry.vue'

const items = ref<{ id: string, img: string, url: string, ratio: number }[]>([])
const loading = ref(true)

const photoFiles = [
  '20220725_185547.jpg',
  '20240717_103101.jpg',
  '20240717_184806.jpg',
  '20240906_122024.jpg',
  '20240915_135637.jpg',
  '20240915_140049.jpg',
  '20240915_140836.jpg',
  '20240915_150544.jpg',
  '20241103_143853.jpg',
  '20241103_144307.jpg',
  '20241103_150732.jpg',
  '20241103_151025.jpg',
  '20241112_150117.jpg',
  '20241112_150139.jpg',
  '20241112_155730.jpg',
  '20241112_160625.jpg',
  '20241112_160734.jpg',
  '20241112_163211.jpg',
  '20241112_164219.jpg',
  '20241201_152402.jpg',
  '20241201_154241.jpg',
  '20241201_155717.jpg',
  '20241201_162150.jpg',
  '20241217_131904.jpg',
  '20241224_134736.jpg',
  '20241230_111843.jpg',
  '20241230_115956.jpg',
  '20241230_140602.jpg',
  '20250105_141829.jpg',
  '20250105_144000.jpg',
  '20250113_093421.jpg',
  '20250113_104952.jpg',
  '20250114_163815.jpg',
  '20250114_164003.jpg',
  '20250114_164925.jpg',
  '20250114_165032.jpg',
  '20250115_122129.jpg',
  '20250120_145450.jpg',
  '20250120_145547.jpg',
  '20250120_165009.jpg',
  '20250120_165213.jpg',
  '20250121_095103.jpg',
  '20250121_095105.jpg',
]

async function loadImages() {
  const results = await Promise.all(
    photoFiles.map(file =>
      new Promise<{ id: string, img: string, url: string, ratio: number } | null>((resolve) => {
        const img = new Image()
        img.src = `/photos/${file}`
        img.onload = () => resolve({ id: file, img: `/photos/${file}`, url: '', ratio: img.naturalHeight / img.naturalWidth })
        img.onerror = () => resolve(null)
      }),
    ),
  )
  items.value = results.filter((r): r is NonNullable<typeof r> => r !== null)
  loading.value = false
}

onMounted(loadImages)
</script>

<template>
  <div class="flex">
    <div v-if="loading" class="flex items-center justify-center w-full op50">
      Loading photos...
    </div>
    <Masonry v-else :items="items" />
  </div>
</template>
