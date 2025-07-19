<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { ElContainer, ElHeader, ElMain, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { ref } from 'vue'

const navs = [
  { label: '首页', path: '/' },
  { label: '导览', path: '/guide', children: [
    { label: '开放时间', path: '/guide/open' },
    { label: '在线订票', path: '/guide/ticket' },
    { label: '交通路线', path: '/guide/traffic' },
    { label: '参观须知', path: '/guide/notice' },
    { label: '全景故宫', path: '/guide/panorama' },
  ]},
  { label: '展览', path: '/exhibition', children: [
    { label: '近期展览', path: '/exhibition/current' },
    { label: '专馆', path: '/exhibition/hall' },
    { label: '原状陈列', path: '/exhibition/original' },
    { label: '赴外展览', path: '/exhibition/abroad' },
  ]},
  { label: '教育', path: '/education', children: [
    { label: '教育新闻', path: '/education/news' },
    { label: '故宫讲坛', path: '/education/forum' },
    { label: '书画考级', path: '/education/grade' },
    { label: '教育中心', path: '/education/center' },
    { label: '志愿者', path: '/education/volunteer' },
  ]},
  { label: '探索', path: '/explore', children: [
    { label: '建筑', path: '/explore/architecture' },
    { label: '藏品', path: '/explore/collection' },
    { label: '古籍', path: '/explore/ancient' },
    { label: '宫廷历史', path: '/explore/history' },
    { label: '文物医院', path: '/explore/hospital' },
    { label: '文化专题', path: '/explore/topic' },
    { label: '数字多宝阁', path: '/explore/digital-treasure' },
    { label: '数字文物库', path: '/explore/digital-collection' },
  ]},
  { label: '学术', path: '/academic', children: [
    { label: '学术资讯', path: '/academic/news' },
    { label: '专家名录', path: '/academic/experts' },
    { label: '研究院', path: '/academic/institute' },
    { label: '学院', path: '/academic/college' },
    { label: '院刊', path: '/academic/journal' },
  ]},
  { label: '文创', path: '/culture', children: [
    { label: '出版', path: '/culture/publish' },
    { label: '文创产品', path: '/culture/product' },
    { label: '壁纸', path: '/culture/wallpaper' },
    { label: 'APP', path: '/culture/app' },
    { label: '游戏', path: '/culture/game' },
  ]},
  { label: '关于', path: '/about', children: [
    { label: '总说', path: '/about/summary' },
    { label: '领导', path: '/about/leader' },
    { label: '资讯', path: '/about/news' },
    { label: '院史编年', path: '/about/history' },
    { label: '景仁榜', path: '/about/jingren' },
    { label: '机构设置', path: '/about/org' },
  ]},
]

const sidebarOpen = ref(true)

function onMessageClick() {
  alert('留言功能待实现');
}
</script>

<template>
  <el-container class="app-container">
    <el-header height="64px" class="main-header">
      <div class="logo">西藏革命纪念馆</div>
      <el-menu mode="horizontal" :ellipsis="false" class="main-menu" :default-active="$route.path">
        <template v-for="item in navs" :key="item.label">
          <el-sub-menu v-if="item.children" :index="item.path" :popper-offset="0">
            <template #title>
              <router-link :to="item.path">{{ item.label }}</router-link>
            </template>
            <el-menu-item v-for="sub in item.children" :key="sub.path" :index="sub.path">
              <router-link :to="sub.path">{{ sub.label }}</router-link>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path">
            <router-link :to="item.path">{{ item.label }}</router-link>
          </el-menu-item>
        </template>
      </el-menu>
    </el-header>
    <el-main class="main-content">
      <RouterView />
    </el-main>
    <footer class="main-footer">
      <div class="footer-content">© 2024 西藏革命纪念馆 | 某某公司 版权所有 | v1.0.0</div>
    </footer>

    <!-- 悬浮按钮组 -->
    <div class="floating-sidebar">
      <template v-if="sidebarOpen">
        <button class="sidebar-btn">肤</button>
        <button class="sidebar-btn">享</button>
        <button class="sidebar-btn">VR</button>
        <button class="sidebar-btn">景</button>
        <button class="sidebar-btn">创</button>
        <button class="sidebar-btn">听</button>
        <button class="sidebar-btn">书</button>
        <button class="sidebar-btn close-btn" @click="sidebarOpen = false">×</button>
      </template>
      <template v-else>
        <button class="sidebar-btn open-btn" @click="sidebarOpen = true">导</button>
      </template>
    </div>
    <div class="floating-message-btn" @click="onMessageClick">
      <div class="icon-text">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="16" width="32" height="20" rx="3" stroke="#fff" stroke-width="3" fill="none"/>
          <path d="M8 16l16 13L40 16" stroke="#fff" stroke-width="3" fill="none"/>
          <rect x="30" y="28" width="8" height="8" rx="1.5" stroke="#fff" stroke-width="2" fill="none"/>
          <path d="M34 32l4-4" stroke="#fff" stroke-width="2"/>
        </svg>
        <span>我要留言</span>
      </div>
    </div>
  </el-container>
</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: 98vw;
  min-width: inherit;
  padding-top: 64px;
}
.main-header {
  display: flex;
  align-items: center;
  background: #002746;
  border-bottom: 1px solid #eee;
  padding: 0 32px;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.main-menu {
  flex: 1;
  background: transparent;
  border: none;
}
.main-content {
  min-height: 80vh;
  background: #fafafa;
  padding: 0;
  display: flex;
  justify-content: center;
}
.main-content > * {
  width: 100%;
  box-sizing: border-box;
  padding: 0 24px;
}
@media (max-width: 1200px) {
  .main-content > * {
    padding: 0 16px;
  }
}
@media (max-width: 900px) {
  .main-content > * {
    max-width: 100%;
    padding: 0 8px;
  }
  .main-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 12px;
  }
  .logo {
    margin: 12px 0 0 0;
  }
}
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #fff !important;
}
:deep(.el-menu-item.is-active),
:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: #fff !important;
  background-color: #f5f7fa00 !important; /* 保持背景透明 */
  font-weight: bold;
}
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  color: #fff !important;
  background-color: #e6f0fa00 !important; /* 保持背景透明 */
}
:deep(.el-menu--horizontal.el-menu) {
  background: transparent;
  border-bottom: none;
  min-height: 48px;
}
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  font-size: 1.1rem;
  padding: 0 20px;
  transition: background 0.2s, color 0.2s;
}
:deep(.el-menu-item.is-active) .router-link-active,
:deep(.el-sub-menu.is-active > .el-sub-menu__title) .router-link-active {
  color: inherit !important;
}
:deep(.main-menu),
:deep(.el-menu--horizontal.el-menu),
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #fff !important;
}
:deep(.main-header a),
:deep(.main-header a:visited),
:deep(.main-header a:hover),
:deep(.main-header a:active),
:deep(.main-header .router-link-active),
:deep(.main-header .router-link-exact-active) {
  background-color: transparent !important;
  color: #fff !important;
  text-decoration: none;
}
.main-footer {
  width: 100%;
  min-height: 56px;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-content {
  width: 100%;
  text-align: center;
  color: #888;
  font-size: 1rem;
  padding: 12px 0;
}

/* 悬浮按钮组样式 */
.floating-sidebar {
  position: fixed;
  bottom: 160px;
  right: 36px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: bottom 0.3s;
}

.floating-sidebar.collapsed {
  /* 不再需要top/bottom切换，保留以防后续扩展 */
  gap: 0;
}

.sidebar-btn {
  width: 40px;
  height: 40px;
  background: #6b2c23;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  cursor: pointer;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sidebar-btn:hover {
  background: #a94442;
  transform: scale(1.08);
}
.close-btn {
  background: #a94442;
  font-size: 1.3rem;
}
.open-btn {
  background: #6b2c23;
  font-size: 1.3rem;
}

.floating-message-btn {
  position: fixed;
  right: 8px;
  bottom: 40px;
  width: 100px;
  height: 100px;
  background: #a60000;
  border-radius: 50%;
  box-shadow: 0 2px 12px #0003;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2001;
  transition: background 0.2s, transform 0.2s;
}
.floating-message-btn:hover {
  background: #b71c1c;
  transform: scale(1.05);
}
.floating-message-btn .icon-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}
.floating-message-btn span {
  margin-top: -6px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  white-space: nowrap;
}
.floating-message-btn svg {
  display: block;
}
@media (max-width: 600px) {
  .floating-sidebar {
    bottom: 120px;
    right: 8px;
    gap: 8px;
  }
  .floating-message-btn {
    width: 64px;
    height: 64px;
    bottom: 16px;
  }
  .floating-message-btn span {
    font-size: 0.85rem;
  }
  .floating-message-btn svg {
    width: 32px;
    height: 32px;
  }
}
</style>
