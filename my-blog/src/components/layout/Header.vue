<template>
  <header class="header">
    <div class="container">
      <div class="logo-row">
        <h1 class="logo">边城小仙的博客</h1>
        <span class="sub-title">越努力越幸运</span>
      </div>
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
        <router-link to="/archives" class="nav-link">归档</router-link>
        <router-link to="/tools" class="nav-link">小工具</router-link>
      </nav>
      <ThemeSwitcher />
      <button
        v-if="isLoggedIn()"
        class="logout-btn"
        @click="logout"
      >退出</button>
    </div>
  </header>
</template>

<script setup>
import ThemeSwitcher from '@/components/layout/ThemeSwitcher.vue'
import { isLoggedIn, removeToken } from '@/utils/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
function logout() {
  removeToken()
  router.replace('/')
  window.location.reload()
}
</script>

<style scoped>
.header {
  background: var(--header-bg-color, #fff);
  color: var(--header-text-color, #1e293b);
  padding: 0.4rem 1.5rem;   /* 上下padding变小！ */
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.07);
  position: sticky;
  top: 0;
  z-index: 999;
  transition: background 0.32s, color 0.32s;
}
.container {
  max-width: 1200px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
}
.logo-row {
  display: flex;
  align-items: baseline;
  gap: 0.8em;
  flex-shrink: 0;
}
.logo {
  font-weight: 900;
  font-size: 1.2rem;  /* 字体略小 */
  user-select: none;
  letter-spacing: 0.04em;
  margin: 0;
  padding: 0;
}
.sub-title {
  font-size: 0.97em;
  font-weight: 500;
  color: var(--primary-color, #2563eb);
  letter-spacing: 0.07em;
  opacity: 0.90;
  margin-left: 0.12em;
  background: linear-gradient(90deg, #60a5fa 0%, #2563eb 70%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}
.nav {
  display: flex;
  gap: 1.1rem;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
}
.nav-link {
  color: inherit;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.02rem;
  padding: 0.23rem 0.58rem;
  border-radius: 6px;
  transition: background-color 0.25s, color 0.25s;
}
.nav-link.router-link-active,
.nav-link:hover,
.nav-link:focus {
  background: var(--header-text-color, #2563eb);
  color: var(--header-bg-color, #fff);
  outline: none;
}
.logout-btn {
  margin-left: 1.1rem;
  background: var(--btn-bg, linear-gradient(90deg, #2563eb, #60a5fa));
  color: var(--btn-text, #fff);
  border: none;
  border-radius: 1em;
  padding: 0.37em 1em;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px #60a5fa13;
  transition: background 0.22s, color 0.18s, transform 0.13s;
}
.logout-btn:hover {
  background: var(--btn-hover-bg, linear-gradient(90deg, #1e40af, #3b82f6));
  color: var(--btn-hover-text, #fff);
  transform: scale(1.03);
}
</style>
