<template>
  <footer class="footer">
    <div class="container">
      <p>© 2025 My Blog 版权所有</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--footer-bg-color, #fff);
  color: var(--footer-text-color, #1e293b);
  text-align: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--footer-border-color, #e5eaf3);
  font-size: 0.9rem;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
