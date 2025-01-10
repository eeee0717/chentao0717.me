<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import PhotoData from '../../script/photo.json'

let map: any = null

function loadPugins(AMap: any) {
  const toolbar = new AMap.ToolBar({
    offset: [10, 60],
    position: 'RB',
  })
  map.addControl(toolbar)
  const geolocation = new AMap.Geolocation(
    {
      enableHighAccuracy: true, // 是否使用高精度定位，默认：true
      timeout: 10000, // 设置定位超时时间，默认：无穷大
      offset: [10, 20], // 定位按钮的停靠位置的偏移量
      zoomToAccuracy: true, //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      position: 'RB', //  定位按钮的排放位置,  RB表示右下
    },
  )
  map.addControl(geolocation)
}

function loadMarker(AMap: any, photos: any) {
  const groupedPoints: { [key: string]: any[] } = {}

  photos.forEach((p: any) => {
    const key = `${p.gps[0]},${p.gps[1]}`
    if (!groupedPoints[key])
      groupedPoints[key] = []
    groupedPoints[key].push(p)
  })
  Object.keys(groupedPoints).forEach((key) => {
    const p = groupedPoints[key]
    const markerContent
      = `<div class="w-48px h-36px b b-3 b-amber rounded-sm">
          <img class="w-full h-full" src="${p[0].file_path}">
        </div>`
    const marker = new AMap.Marker({
      position: new AMap.LngLat(p[0].gps[0], p[0].gps[1]), // 点标记的位置
      // icon,
      content: markerContent,
      title: p[0].file_name,
      offset: new AMap.Pixel(-13, -30), // 相对于基点的偏移位置
    })
    map.add(marker)
    marker.on('click', () => {
      console.log(p)
    })
  })
}

onMounted(() => {
  const photos = PhotoData

  window._AMapSecurityConfig = {
    securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
  }
  AMapLoader.load({
    key: import.meta.env.VITE_AMAP_KEY,
    version: '2.0',
    plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Geolocation', 'AMap.MarkerCluster'],
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        viewMode: '2D',
        zoom: 4, // 改变地图显示的默认级别
        center: [116.397428, 39.90923],
      })
      loadPugins(AMap)
      loadMarker(AMap, photos)
    })
    .catch((e) => {
      console.log(e)
    })
})
onUnmounted(() => {
  map?.destroy()
})
</script>

<template>
  <div id="container" />
</template>

<style scoped>
#container {
  width: 100%;
  height: 400px;
}
.custom-content-marker {
  width: 64px;
  height: 64px;
}
.custom-content-marker img {
  width: 100%;
  height: 100%;
}
.custom-content-marker .close-btn {
  position: absolute;
  top: -6px;
  right: -8px;
  width: 15px;
  height: 15px;
  font-size: 12px;
  background: #ccc;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  line-height: 15px;
  box-shadow: -1px 1px 1px rgba(10, 10, 10, 0.2);
}

.custom-content-marker .close-btn:hover {
  background: red;
}
</style>
