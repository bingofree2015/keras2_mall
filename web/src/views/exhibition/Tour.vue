<template>
  <div class="tour-container">
    <div id="pano" class="pano-viewer"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

let scriptEl = null

onMounted(() => {
  // 动态加载 krpano.js
  scriptEl = document.createElement('script')
  scriptEl.src = '/krpano/krpano.js'
  scriptEl.onload = () => {
    if (window.embedpano) {
      window.embedpano({
        swf: null, // 不用flash
        xml: '/krpano/tour.xml', // krpano配置
        target: 'pano',
        html5: 'only',
        mobilescale: 1.0,
        passQueryParameters: true,
        webglsettings: { preserveDrawingBuffer: true }
      })
    }
  }
  document.body.appendChild(scriptEl)
})

onBeforeUnmount(() => {
  // 页面卸载时销毁krpano实例
  if (window.removePanoViewer) {
    window.removePanoViewer()
  }
  if (scriptEl && scriptEl.parentNode) {
    scriptEl.parentNode.removeChild(scriptEl)
  }
})
</script>

<style scoped>
.tour-container, .pano-viewer {
  width: 100vw;
  height: 100vh;
  min-height: 400px;
  background: #000;
}
</style> 