<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import PhotoData from '../../script/photo.json'
import type { GroupedPhotos, MapInstance, Photo } from '../types/map'

const mapInstance = ref<MapInstance>({ map: null, AMap: null })

// 地图配置
const MAP_CONFIG = {
  zoom: 4,
  center: [116.397428, 39.90923],
  viewMode: '2D',
}

// 工具栏配置
const TOOLBAR_CONFIG = {
  offset: [10, 60],
  position: 'RB',
}

// 定位配置
const GEOLOCATION_CONFIG = {
  enableHighAccuracy: true,
  timeout: 10000,
  offset: [10, 20],
  zoomToAccuracy: true,
  position: 'RB',
}

// 加载地图插件
function initPlugins(): void {
  const { map, AMap } = mapInstance.value

  const toolbar = new AMap.ToolBar(TOOLBAR_CONFIG)
  const geolocation = new AMap.Geolocation(GEOLOCATION_CONFIG)

  map.addControl(toolbar)
  map.addControl(geolocation)
}

// 创建标记内容
function createMarkerContent(photo: Photo): string {
  return `
    <div class="w-48px h-36px b b-3 b-emerald rounded-sm">
      <img class="w-full h-full" 
        style="pointer-events: none" 
        src="${photo.file_path}" 
        crossorigin="anonymous" 
        @click.prevent
      />
    </div>`
}

// 创建信息窗口内容
function createInfoWindowContent(photos: Photo[]): string {
  return `
    <div class="w-auto h-auto overflow-auto">
      <div class="flex flex-wrap gap-2">
        ${photos.map(photo => `
          <div>
            <img class="w-64px h-36px object-cover rounded" 
              src="${photo.file_path}" 
              alt="${photo.file_name}"
              crossorigin="anonymous"
            />
          </div>
        `).join('')}
      </div>
    </div>
  `
}

// 加载标记
function initMarkers(photos: Photo[]): void {
  const { map, AMap } = mapInstance.value
  const groupedPoints: GroupedPhotos = {}

  // test
  // const marker = new AMap.Marker({
  //   position: new AMap.LngLat(photos[0].gps[0], photos[0].gps[1]),
  //   content: `<div class="w-48px h-36px b b-3 b-emerald rounded-sm">
  //     <img class="w-full h-full"
  //       style="pointer-events: none"
  //       src="/photos/20250105_174114_2.jpg"
  //       crossorigin="anonymous"
  //       @click.prevent
  //     />
  //   </div>`,
  //   title: 'test1.jpg',
  //   offset: new AMap.Pixel(-13, -30),
  // })
  // map.add(marker)
  // 按位置分组照片
  photos.forEach((photo: Photo) => {
    const key = `${photo.gps[0]},${photo.gps[1]}`
    if (!groupedPoints[key])
      groupedPoints[key] = []
    groupedPoints[key].push(photo)
  })

  // 创建标记
  Object.entries(groupedPoints).forEach(([_, photos]) => {
    const firstPhoto = photos[0]
    const marker = new AMap.Marker({
      position: new AMap.LngLat(firstPhoto.gps[0], firstPhoto.gps[1]),
      content: createMarkerContent(firstPhoto),
      title: firstPhoto.file_name,
      offset: new AMap.Pixel(-13, -30),
    })

    map.add(marker)

    // 点击事件处理
    marker.on('click', () => {
      const infoWindow = new AMap.InfoWindow({
        isCustom: true,
        content: createInfoWindowContent(photos),
        anchor: 'bottom-center',
        offset: new AMap.Pixel(0, -35),
      })
      infoWindow.open(map, firstPhoto.gps)
    })
  })
}

// 初始化地图
async function initMap(): Promise<void> {
  try {
    const AMap = await AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Geolocation', 'AMap.MarkerCluster'],
    })

    mapInstance.value.AMap = AMap
    mapInstance.value.map = new AMap.Map('container', MAP_CONFIG)

    initPlugins()
    initMarkers(PhotoData as Photo[])
  }
  catch (error) {
    console.error('地图初始化失败:', error)
  }
}

const closeInfoWindow = () => mapInstance.value.map?.clearInfoWindow()

onMounted(() => {
  if (typeof window !== 'undefined') {
    window._AMapSecurityConfig = {
      securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
    }
  }
  initMap()
})

onUnmounted(() => {
  mapInstance.value.map?.destroy()
})
</script>

<template>
  <div class="map-container">
    <div id="container" />
    <button
      class="close-button b b-0.1 b-black"
      @click="closeInfoWindow"
    >
      <div class="bg-black" i-carbon-close-outline />
    </button>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
}

#container {
  width: 100%;
  height: 600px;
}

.close-button {
  position: absolute;
  width: 30px;
  height: 30px;
  bottom: 130px;
  right: 10px;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #f0f0f0;
}
</style>
