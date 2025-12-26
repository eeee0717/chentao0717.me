<script setup lang="ts">
import type { GithubData, GridItem, LayoutItem, MapData, PersonalityData, RecapData } from '~/types'

const props = defineProps<{
  data: RecapData
}>()

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
function isMapData(data: LayoutItem['data']): data is MapData {
  return !!data && 'location' in data && 'backgroundImage' in data
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
    <h1>{{ data.year }}年终总结海报</h1>
    <div
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

        <!-- Map -->
        <template v-else-if="item.type === 'map' && isMapData(item.data)">
          <div :style="getGridStyle(item)">
            <Map v-bind="item.data" />
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
