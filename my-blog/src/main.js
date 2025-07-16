import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ArticleList from './ArticleList.vue'
import ArticlePage from './ArticlePage.vue'
import Write from './Write.vue' // ✅ 你写的新页面组件

const routes = [
  { path: '/', component: ArticleList },
  { path: '/article/:name', component: ArticlePage },
  { path: '/write', component: Write } // ✅ 添加这一行！
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')
