// main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// 博客相关页面
import ArticleList from './pages/ArticleList.vue'
import ArticlePage from './pages/ArticlePage.vue'
import Write from './pages/Write.vue'
import Login from './pages/Login.vue'
// 工具主页（工具中心列表页）
import ToolsHome from './pages/ToolsHome.vue'

// 动态工具页
import ToolPage from './pages/ToolPage.vue'

// Naive UI
import naive from 'naive-ui'

// ============ 1. 新增引入 isLoggedIn ===============
import { isLoggedIn } from './utils/auth'

const routes = [
  { path: '/', component: ArticleList },
  { path: '/article/:id', component: ArticlePage },
  { path: '/write', component: Write },
  { path: '/login', component: Login }, // 加这行
  // 工具中心入口页
  { path: '/tools', component: ToolsHome },
  // 所有小工具页面走同一个 ToolPage，通过路由参数区分
  { path: '/tools/:tool', component: ToolPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ============= 2. 新增全局守卫 ===============
router.beforeEach((to, from, next) => {
  // 只保护 /write
  if (to.path === '/write' && !isLoggedIn()) {
    next('/')
  } else {
    next()
  }
})
// ============= 守卫写在app.use(router)之前即可 =============

const app = createApp(App)
app.use(router)
app.use(naive)
app.mount('#app')
