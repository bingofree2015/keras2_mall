<script setup lang="ts">
import { ref } from 'vue'
import slide1 from '@/assets/slide-1.jpg'
import slide2 from '@/assets/slide-2.jpg'
import slide3 from '@/assets/slide-3.jpg'
const navItems = ref([
  { title: '导览', path: '/guide', desc: '开放时间、在线订票、交通路线等' },
  { title: '展览', path: '/exhibition', desc: '近期展览、专馆、原状陈列等' },
  { title: '教育', path: '/education', desc: '教育新闻、讲坛、考级、志愿者等' },
  { title: '探索', path: '/explore', desc: '建筑、藏品、古籍、历史等' },
  { title: '学术', path: '/academic', desc: '学术资讯、专家名录、研究院等' },
  { title: '文创', path: '/culture', desc: '出版、文创产品、壁纸、APP等' },
  { title: '关于', path: '/about', desc: '总说、领导、资讯、院史等' },
])
const slides = [slide1, slide2, slide3]
</script>

<template>
  <div class="home-container">
    <div class="hero">
      <h1>西藏革命纪念馆 DEMO</h1>
      <p>灵感源自故宫博物院官网，极简风格，体验数字化纪念馆之美。</p>
    </div>
    <el-carousel class="home-carousel" height="600px" indicator-position="outside" arrow="always">
      <el-carousel-item v-for="(img, i) in slides" :key="i">
        <div class="carousel-img-wrapper">
          <img :src="img" class="carousel-img" alt="slide" />
        </div>
      </el-carousel-item>
    </el-carousel>
    <el-row class="nav-quick-links" :gutter="20">
      <el-col v-for="item in navItems" :key="item.title" :span="6">
        <router-link :to="item.path" class="nav-link">
          <el-card shadow="hover">
            <h2>{{ item.title }}</h2>
            <p>{{ item.desc }}</p>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 40px 16px 0 16px;
}
.hero {
  text-align: center;
  margin-bottom: 40px;
}
.hero h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.hero p {
  color: #888;
  font-size: 1.1rem;
}
.nav-quick-links {
  margin-top: 32px;
}
.nav-link {
  text-decoration: none;
}
.el-card {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.el-card h2 {
  font-size: 1.2rem;
  margin: 0 0 8px 0;
  color: #222;
}
.el-card p {
  color: #888;
  font-size: 0.95rem;
}
.home-carousel {
  width: 100%;
  height: 600px;
  margin: 0 auto 32px auto;
  background: transparent;
}
.carousel-img-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
