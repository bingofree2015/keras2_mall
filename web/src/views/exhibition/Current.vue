<template>
  <div class="exhibition-page">
    <!-- 顶部横幅图片 -->
    <img :src="exhibitBanner" class="exhibit-banner" alt="展览横幅" />

    <!-- 轮播区 -->
    <el-carousel class="exhibit-carousel" height="400px" indicator-position="outside" arrow="always">
      <el-carousel-item v-for="img in slideImgs" :key="img">
        <img :src="img" class="carousel-img" />
      </el-carousel-item>
    </el-carousel>

    <!-- 正在展览区标题 -->
    <div class="exhibit-section-title">
      正在展览
      <span class="exhibit-section-divider"></span>
    </div>

    <!-- 正在展览卡片列表 -->
    <div class="exhibit-list">
      <div class="exhibit-card" v-for="item in exhibits" :key="item.title">
        <img :src="item.cover" class="exhibit-cover" />
        <div class="exhibit-info">
          <div class="exhibit-title">{{ item.title }}</div>
          <div class="exhibit-date">{{ item.date }}</div>
          <div class="exhibit-desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import exhibitBanner from '@/assets/exhibit/exhibit-banner.jpg'
import exhibitSlide1 from '@/assets/exhibit/exhibit-slide1.jpg'
import exhibitSlide2 from '@/assets/exhibit/exhibit-slide2.jpg'
import exhibitSlide3 from '@/assets/exhibit/exhibit-slide3.jpg'
import exhibitCover1 from '@/assets/exhibit/exhibit-cover1.jpg'
import exhibitCover2 from '@/assets/exhibit/exhibit-cover2.jpg'
import exhibitCover3 from '@/assets/exhibit/exhibit-cover3.jpg'

const slideImgs = [exhibitSlide1, exhibitSlide2, exhibitSlide3]
const exhibits = [
  {
    cover: exhibitCover1,
    title: '紫禁城与凡尔赛宫——17、18世纪的中法交往',
    date: '2024年6月1日-2024年8月31日',
    desc: '本展览通过丰富的文物和历史资料，展现了17、18世纪中法两国在政治、文化、艺术等领域的交流与碰撞，呈现紫禁城与凡尔赛宫之间的独特联系。'
  },
  {
    cover: exhibitCover2,
    title: '雕塑馆——中国古代雕塑艺术展',
    date: '2024年5月10日-2024年9月10日',
    desc: '展览系统梳理中国古代雕塑的发展脉络，展出院藏重要雕塑文物，涵盖佛教、道教、陵墓等多种题材，展现中华雕塑艺术的辉煌成就。'
  },
  {
    cover: exhibitCover3,
    title: '青铜器馆——青铜文明的辉煌',
    date: '2024年4月20日-2024年10月20日',
    desc: '本展览集中展示院藏青铜器精品，介绍中国青铜文化的起源、发展与影响，带领观众领略古代青铜文明的独特魅力。'
  }
]
</script>

<style scoped>
.exhibition-page {
  background: #f8f6f2;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 48px 0;
}
.exhibit-banner {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 18px;
  margin: 32px 0 24px 0;
  box-shadow: 0 4px 24px #0001;
}
.exhibit-carousel {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px #0001;
}
.carousel-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}
.exhibit-section-title {
  font-size: 2rem;
  color: #a67c52;
  font-weight: bold;
  text-align: center;
  margin: 40px 0 24px 0;
  position: relative;
}
.exhibit-section-divider {
  display: block;
  width: 64px;
  height: 4px;
  background: linear-gradient(90deg, #e0c097 0%, #c8a165 100%);
  margin: 16px auto 0 auto;
  border-radius: 2px;
}
.exhibit-list {
  display: flex;
  flex-wrap: wrap;
  gap: 32px 24px;
  justify-content: center;
}
.exhibit-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px #0001;
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 18px 18px 18px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.exhibit-card:hover {
  box-shadow: 0 8px 32px #0002;
  transform: translateY(-4px) scale(1.03);
}
.exhibit-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 16px;
}
.exhibit-info {
  width: 100%;
  text-align: left;
}
.exhibit-title {
  font-size: 1.15rem;
  font-weight: bold;
  color: #7c4a03;
  margin-bottom: 6px;
}
.exhibit-date {
  color: #a67c52;
  font-size: 1rem;
  margin-bottom: 8px;
}
.exhibit-desc {
  color: #444;
  font-size: 1rem;
  line-height: 1.7;
}
</style>
