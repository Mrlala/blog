<template>
  <footer class="footer">
    <div class="container">
      <p>© {{ year }} 边城小仙的博客 · 越努力越幸运</p>
      <!-- <p>苏ICP备xxxx号</p> 可选备案号/邮箱等 -->
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--footer-bg-color, #fff);
  color: var(--footer-text-color, #1e293b);
  text-align: center;
  padding: 1.1rem 1.5rem 1.2rem 1.5rem;
  border-top: 1px solid var(--footer-border-color, #e5eaf3);
  font-size: 0.97rem;
  opacity: 0.87;
  letter-spacing: 0.07em;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.footer p {
  margin: 0;
  line-height: 1.85;
  font-weight: 500;
}
</style>
