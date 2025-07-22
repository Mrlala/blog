// main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'




// 博客相关页面
import ArticleList from './pages/ArticleList.vue'
import ArticlePage from './pages/ArticlePage.vue'
import Write from './pages/Write.vue'
import Login from './pages/Login.vue'
// 工具主页（工具中心列表页）
import ToolsHome from './pages/ToolsHome.vue'

// 动态工具页
import ToolPage from './pages/ToolPage.vue'

// 后台
import AdminDashboard from './pages/admin/Dashboard.vue'
import CategoryManager from './pages/admin/CategoryManager.vue'
import TagManager from './pages/admin/TagManager.vue'

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
  { path: '/tools/:tool', component: ToolPage },

    // -------- 后台管理路由 --------
  { path: '/admin', component: AdminDashboard },
  { path: '/admin/category', component: CategoryManager },
  { path: '/admin/tag', component: TagManager }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ============= 2. 新增全局守卫 ===============
router.beforeEach((to, from, next) => {
  // 管理后台页面都需要登录
  if (to.path.startsWith('/admin') && !isLoggedIn()) {
    next('/login')
  } else if (to.path === '/write' && !isLoggedIn()) {
    next('/')
  } else {
    next()
  }
})

// ============= 守卫写在app.use(router)之前即可 =============

const app = createApp(App)
app.use(router)
app.use(naive)
app.use(ElementPlus)
app.mount('#app')
