import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ArticleList from './pages/ArticleList.vue'
import ArticlePage from './pages/ArticlePage.vue'
import Write from './pages/Write.vue'

const routes = [
  { path: '/', component: ArticleList },
  { path: '/article/:name', component: ArticlePage },
  { path: '/write', component: Write }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')
