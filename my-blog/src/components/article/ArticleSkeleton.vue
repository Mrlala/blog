<template>
  <div class="article-skeleton">
    <div class="skeleton-title"></div>
    <div class="skeleton-date"></div>
    <div class="skeleton-paragraph"></div>
    <div class="skeleton-paragraph"></div>
    <div class="skeleton-paragraph short"></div>
  </div>
</template>

<style scoped>
.article-skeleton .skeleton-title {
  height: 2.3em;
  width: 52%;
  margin: 1em 0;
  background: var(--skeleton-bg, linear-gradient(90deg, #eee 25%, #f6f7fb 75%));
  border-radius: 0.8em;
  animation: skeleton 1.2s infinite linear;
}
.skeleton-date {
  height: 1em;
  width: 32%;
  background: var(--skeleton-bg, #eee);
  border-radius: 0.5em;
  margin: 0.7em 0;
}
.skeleton-paragraph {
  height: 1.1em;
  width: 100%;
  background: var(--skeleton-bg, #ececec);
  border-radius: 0.4em;
  margin: 1em 0;
}
.skeleton-paragraph.short { width: 60%; }
@keyframes skeleton { to { background-position-x: 200%; } }

</style>
