<template>
  <div class="about-page">
    <h2>关于本站</h2>
    <p>本博客系统为个人项目，支持文章发布、分类、标签、归档和后台管理。<br>
      你可以在这里查看我的开发记录和各种技术文章。</p>
    <ul>
      <li>前端：Vue3、Naive UI、Element Plus</li>
      <li>后端：Node.js + PostgreSQL (假设)</li>
      <li>源码地址：<a href="https://github.com/你的github" target="_blank">GitHub</a></li>
    </ul>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 760px;
  margin: 3em auto;
  background: #fff;
  border-radius: 1.2em;
  box-shadow: 0 4px 24px #2563eb12;
  padding: 2.8em 2em 2.6em 2em;
  font-size: 1.14em;
  color: #222c3a;
  line-height: 1.76;
}
.about-page h2 {
  font-size: 1.45em;
  color: #2563eb;
  margin-bottom: 1em;
}
.about-page ul {
  margin: 1.7em 0 0 1.1em;
  color: #3c5ea3;
}
.about-page a {
  color: #2563eb;
  text-decoration: underline;
}
</style>
