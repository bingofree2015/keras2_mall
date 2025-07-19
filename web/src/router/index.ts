import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  // 导览
  { path: '/guide/open', name: 'guide-open', component: () => import('../views/guide/Open.vue') },
  { path: '/guide/ticket', name: 'guide-ticket', component: () => import('../views/guide/Ticket.vue') },
  { path: '/guide/traffic', name: 'guide-traffic', component: () => import('../views/guide/Traffic.vue') },
  { path: '/guide/notice', name: 'guide-notice', component: () => import('../views/guide/Notice.vue') },
  { path: '/guide/panorama', name: 'guide-panorama', component: () => import('../views/guide/Panorama.vue') },
  // 展览
  { path: '/exhibition/current', name: 'exhibition-current', component: () => import('../views/exhibition/Current.vue') },
  { path: '/exhibition/hall', name: 'exhibition-hall', component: () => import('../views/exhibition/Hall.vue') },
  { path: '/exhibition/original', name: 'exhibition-original', component: () => import('../views/exhibition/Original.vue') },
  { path: '/exhibition/abroad', name: 'exhibition-abroad', component: () => import('../views/exhibition/Abroad.vue') },
  // 教育
  { path: '/education/news', name: 'education-news', component: () => import('../views/education/News.vue') },
  { path: '/education/forum', name: 'education-forum', component: () => import('../views/education/Forum.vue') },
  { path: '/education/grade', name: 'education-grade', component: () => import('../views/education/Grade.vue') },
  { path: '/education/center', name: 'education-center', component: () => import('../views/education/Center.vue') },
  { path: '/education/volunteer', name: 'education-volunteer', component: () => import('../views/education/Volunteer.vue') },
  // 探索
  { path: '/explore/architecture', name: 'explore-architecture', component: () => import('../views/explore/Architecture.vue') },
  { path: '/explore/collection', name: 'explore-collection', component: () => import('../views/explore/Collection.vue') },
  { path: '/explore/ancient', name: 'explore-ancient', component: () => import('../views/explore/Ancient.vue') },
  { path: '/explore/history', name: 'explore-history', component: () => import('../views/explore/History.vue') },
  { path: '/explore/hospital', name: 'explore-hospital', component: () => import('../views/explore/Hospital.vue') },
  { path: '/explore/topic', name: 'explore-topic', component: () => import('../views/explore/Topic.vue') },
  { path: '/explore/digital-treasure', name: 'explore-digital-treasure', component: () => import('../views/explore/DigitalTreasure.vue') },
  { path: '/explore/digital-collection', name: 'explore-digital-collection', component: () => import('../views/explore/DigitalCollection.vue') },
  // 学术
  { path: '/academic/news', name: 'academic-news', component: () => import('../views/academic/News.vue') },
  { path: '/academic/experts', name: 'academic-experts', component: () => import('../views/academic/Experts.vue') },
  { path: '/academic/institute', name: 'academic-institute', component: () => import('../views/academic/Institute.vue') },
  { path: '/academic/college', name: 'academic-college', component: () => import('../views/academic/College.vue') },
  { path: '/academic/journal', name: 'academic-journal', component: () => import('../views/academic/Journal.vue') },
  // 文创
  { path: '/culture/publish', name: 'culture-publish', component: () => import('../views/culture/Publish.vue') },
  { path: '/culture/product', name: 'culture-product', component: () => import('../views/culture/Product.vue') },
  { path: '/culture/wallpaper', name: 'culture-wallpaper', component: () => import('../views/culture/Wallpaper.vue') },
  { path: '/culture/app', name: 'culture-app', component: () => import('../views/culture/App.vue') },
  { path: '/culture/game', name: 'culture-game', component: () => import('../views/culture/Game.vue') },
  // 关于
  { path: '/about/summary', name: 'about-summary', component: () => import('../views/about/Summary.vue') },
  { path: '/about/leader', name: 'about-leader', component: () => import('../views/about/Leader.vue') },
  { path: '/about/news', name: 'about-news', component: () => import('../views/about/News.vue') },
  { path: '/about/history', name: 'about-history', component: () => import('../views/about/History.vue') },
  { path: '/about/jingren', name: 'about-jingren', component: () => import('../views/about/Jingren.vue') },
  { path: '/about/org', name: 'about-org', component: () => import('../views/about/Org.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
