<script setup lang="ts">
import * as htmlToImage from 'html-to-image'
import type { GithubData, GridItem, LayoutItem, PersonalityData, RecapData, TravelMapData } from '~/types'

const props = defineProps<{
  data: RecapData
}>()

const posterRef = ref<HTMLElement>()

async function exportPNG() {
  if (!posterRef.value)
    return

  const dataUrl = await htmlToImage.toPng(posterRef.value, {
    pixelRatio: 2,
  })

  const link = document.createElement('a')
  link.download = `${props.data.year}-recap.png`
  link.href = dataUrl
  link.click()
}

// 计算需要的行数
const rowCount = computed(() => {
  let maxRow = 0
  for (const item of props.data.layout) {
    if (item.gridRow) {
      maxRow = Math.max(maxRow, item.gridRow + item.rows - 1)
    }
    else {
      // 估算自动流式布局的行数
      maxRow += item.rows
    }
  }
  return Math.max(maxRow, 5)
})

// 生成 grid 定位样式
function getGridStyle(item: LayoutItem) {
  return {
    gridColumn: item.gridCol
      ? `${item.gridCol} / span ${item.cols}`
      : `span ${item.cols}`,
    gridRow: item.gridRow
      ? `${item.gridRow} / span ${item.rows}`
      : `span ${item.rows}`,
  }
}

// 类型守卫
function isGridItem(data: LayoutItem['data']): data is GridItem {
  return !!data && 'image' in data && 'id' in data
}
function isTravelMapData(data: LayoutItem['data']): data is TravelMapData {
  return !!data && 'locations' in data && 'backgroundImage' in data
}
function isPersonalityData(data: LayoutItem['data']): data is PersonalityData {
  return !!data && 'type' in data && 'color' in data
}
function isGithubData(data: LayoutItem['data']): data is GithubData {
  return !!data && 'rank' in data && 'subtitle' in data
}
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mb-4">
      <h1 class="!mb-0">
        {{ data.year }}年终总结海报
      </h1>
      <button class="hidden lg:block btn" @click="exportPNG">
        <span class="i-carbon-save" />
      </button>
    </div>
    <div
      ref="posterRef"
      class="hidden lg:grid lg:gap-6 justify-center lg:grid-cols-8"
      :style="{ gridTemplateRows: `repeat(${rowCount}, 4rem)` }"
    >
      <template v-for="(item, index) in data.layout" :key="index">
        <!-- Grid Item -->
        <template v-if="item.type === 'grid' && isGridItem(item.data)">
          <Box
            class="bg-coolGray bg-op-20"
            :style="getGridStyle(item)"
          >
            <div class="flex-row justify-center h-full">
              <img
                class="rounded-2xl"
                :class="item.data.title ? '' : 'h-full'"
                :src="item.data.image"
              >
              <div v-if="item.data.title" class="flex justify-center">
                {{ item.data.title }}
              </div>
            </div>
          </Box>
        </template>

        <!-- Travel Map -->
        <template v-else-if="item.type === 'travel' && isTravelMapData(item.data)">
          <div :style="getGridStyle(item)">
            <TravelMap v-bind="item.data" />
          </div>
        </template>

        <!-- Personality -->
        <template v-else-if="item.type === 'personality' && isPersonalityData(item.data)">
          <div :style="getGridStyle(item)">
            <Personality v-bind="item.data" />
          </div>
        </template>

        <!-- Github -->
        <template v-else-if="item.type === 'github' && isGithubData(item.data)">
          <div :style="getGridStyle(item)">
            <Github v-bind="item.data" />
          </div>
        </template>

        <!-- Empty placeholder -->
        <template v-else-if="item.type === 'empty'">
          <Box
            class="bg-coolGray bg-op-20"
            :style="getGridStyle(item)"
          />
        </template>
      </template>
    </div>
    <div class="lg:hidden">
      手机分辨率过低，请使用电脑查看！
    </div>
  </div>
</template>
