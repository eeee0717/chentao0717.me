<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { ref } from 'vue'
import * as htmlToImage from 'html-to-image'

const props = defineProps<{
  route: string
  frontmatter: Record<string, any>
  content: HTMLDivElement
}>()
const base = 'https://chentao0717.cn'
const text = ref(`${base}${props.route}`)
const qrcode = useQRCode(text, {
  errorCorrectionLevel: 'L',
  margin: 1,

})
function save() {
  const elemment = document.getElementById('share-card')
  const filter = (node: HTMLElement) => {
    return node.id !== 'skip'
  }

  if (elemment) {
    htmlToImage.toJpeg(elemment, { filter }).then((dataUrl) => {
      const link = document.createElement('a')
      link.download = `${props.frontmatter.title}.jpeg`
      link.href = dataUrl
      link.click()
    })
  }
}
</script>

<template>
  <div id="share-card" class="relative share-card rounded-xl w-575px h-325px p-40px">
    <button id="skip" class="absolute z-10 top-4 right-4" @click="save">
      <span i-carbon-save />
    </button>
    <div class="w-full h-full grid  grid-cols-[1fr_2.5fr] gap-2">
      <div class="flex flex-col h-243px">
        <img class="h-125px w-125px rounded-xl" src="/avatar.png">
        <div class="flex flex-col h-full justify-end">
          <div class="flex flex-row text-sm items-center">
            <p>Powered by</p>
            <img class="m-1 w-16px" src="/vue.svg">
            <p>Vue</p>
          </div>
          <p class="text-sm text-gray">
            长按扫码查看内容
          </p>
        </div>
      </div>

      <div flex flex-col grid-row-span-2 gap-4>
        <div flex justify-between>
          <p class="text-xl font-bold">
            槑囿脑袋
          </p>
          <div class="flex flex-row text-sm text-gray gap-4">
            <div class="flex flex-row items-center gap-1">
              <span i-carbon-calendar />
              <p>
                {{ new Date(props.frontmatter.date).toISOString().split('T')[0] }}
              </p>
            </div>
            <div class="flex flex-row items-center gap-1">
              <span i-carbon-time />
              <p>
                {{ props.frontmatter.duration }}
              </p>
            </div>
          </div>
        </div>
        <h1 text-2xl>
          {{ props.frontmatter.title }}
        </h1>
        <p text-gray>
          {{ props.content.textContent?.slice(0, 40) }}...
        </p>
        <img v-if="text" class="rounded w-80px mt-auto self-end" :src="qrcode" alt="QR Code">
      </div>
    </div>
  </div>
</template>

<style scoped>
.share-card {
  border: 1px solid #000;
  background: #fff;
}
.dark .share-card {
  border: 1px solid #fff;
  background: #000;
}
</style>
