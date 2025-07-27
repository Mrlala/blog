<template>
  <n-card title="快捷入口" class="quick-entry-card">
    <n-space class="quick-btns" wrap>
      <n-button strong secondary type="primary" size="large" round @click="$router.push('/admin/write')">
        <template #icon>
          <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
            <path d="M16.5 4a2.121 2.121 0 1 1 3 3L7.5 19.5l-4 1 1-4L16.5 4Z" stroke="currentColor" stroke-width="1.6"/>
          </svg>
        </template>
        写新文章
      </n-button>
      <n-button strong type="info" size="large" round @click="$router.push('/admin/article')">
        <template #icon>
          <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="7" width="16" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/>
            <path d="M8 3h8v4" stroke="currentColor" stroke-width="1.6"/>
          </svg>
        </template>
        文章管理
      </n-button>
      <n-button strong type="success" size="large" round @click="$router.push('/admin/category')">
        <template #icon>
          <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/>
            <path d="M7 3h10v4" stroke="currentColor" stroke-width="1.6"/>
          </svg>
        </template>
        分类管理
      </n-button>
      <n-button strong type="warning" size="large" round @click="$router.push('/admin/tag')">
        <template #icon>
          <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
            <path d="M5 7V5a2 2 0 0 1 2-2h2" stroke="currentColor" stroke-width="1.6"/>
            <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/>
          </svg>
        </template>
        标签管理
      </n-button>
      <!-- 其它可加 -->
    </n-space>
  </n-card>
</template>

<style scoped>



.quick-btns {
  gap: 1.2em 1.6em;
  padding-top: 0.1em;
  padding-bottom: 0.3em;
}

.n-button {
  min-width: 124px;
  font-size: 1.09em;
  font-weight: 600;
  letter-spacing: .02em;
  box-shadow: 0 2px 10px rgba(50,100,200,0.08);
  transition: box-shadow 0.18s;
}
.n-button:hover {
  box-shadow: 0 6px 16px rgba(80,140,255,0.16);
  filter: brightness(1.07);
}
</style>
