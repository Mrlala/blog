import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ArticleList from './pages/ArticleList.vue'
import ArticlePage from './pages/ArticlePage.vue'
import Write from './pages/Write.vue'

import naive from 'naive-ui'
import themeOverrides from './theme/theme-overrides.js' // 你存 theme-overrides.js 的路径

const routes = [
  { path: '/', component: ArticleList },
  { path: '/article/:id', component: ArticlePage },
  { path: '/write', component: Write }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

app.use(router)
app.use(naive)
app.mount('#app')
