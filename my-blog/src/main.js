import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ArticleList from './ArticleList.vue'
import ArticlePage from './ArticlePage.vue'

const routes = [
  { path: '/', component: ArticleList },
  { path: '/article/:name', component: ArticlePage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
