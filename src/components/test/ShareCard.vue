<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { ref } from 'vue'

const props = defineProps<{
  route: string
  content: HTMLDivElement
}>()
const base = 'https://chentao0717.cn'
const text = ref(`${base}${props.route}`)
const qrcode = useQRCode(text, {
  errorCorrectionLevel: 'H',
  margin: 3,
})
</script>

<template>
  <div>
    <img v-if="text" class="mt-6 mb-2 rounded border" :src="qrcode" alt="QR Code">
  </div>
</template>
