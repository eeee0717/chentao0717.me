<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import PhotoData from '../../script/photo.json'

let map: any = null

function loadPugins(AMap: any, map: any) {
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

function loadMarker(AMap: any, map: any, photos: any) {
  const markers: any[] = []
  photos.forEach((p: any) => {
    const icon = new AMap.Icon({
      size: new AMap.Size(36, 36), // 图标尺寸
      image: p.file_path, // Icon 的图像
    })
    const marker = new AMap.Marker({
      position: new AMap.LngLat(p.gps[0], p.gps[1]), // 点标记的位置
      icon, // 添加 Icon 实例
      title: p.file_name,
      zooms: [2, 20], // 点标记显示的层级范围，超过范围不显示
    })
    markers.push(marker)
  })
  markers.forEach((m) => {
    map.add(m)
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
    plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Geolocation'],
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        viewMode: '2D',
        zoom: 4, // 改变地图显示的默认级别
        center: [116.397428, 39.90923],
      })
      loadPugins(AMap, map)
      loadMarker(AMap, map, photos)
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
</style>
