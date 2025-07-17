<template>
  <header class="main-header">
    <router-link to="/" class="logo">My Blog</router-link>
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/write">写新文章</router-link>
      <!-- 你可以继续加导航项 -->
    </nav>
  </header>
</template>

<style>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5em 2em;
  background: #646cff;
  color: #fff;
  border-radius: 12px;
  margin-bottom: 2em;
}
.logo {
  font-weight: bold;
  font-size: 1.5em;
  color: #fff;
  text-decoration: none;
}
nav a {
  color: #fff;
  margin-left: 2em;
  text-decoration: none;
  font-size: 1.1em;
  transition: color 0.2s;
}
nav a:hover {
  color: #ffeb3b;
}
</style>
