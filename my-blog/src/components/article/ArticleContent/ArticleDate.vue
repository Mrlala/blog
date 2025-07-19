<template>
  <div class="article-date">
    <svg width="1em" height="1em" style="margin-right: 0.3em;opacity:0.82" fill="none" viewBox="0 0 24 24">
      <path d="M7 3v2m10-2v2M4.5 7h15M6 21h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
            stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    {{ date }}
  </div>
</template>
<script setup>
defineProps({ date: String })
</script>
<style scoped>
.article-date {
  color: var(--article-date-color, #888);
  font-size: 1em;
  display: flex;
  align-items: center;
  margin-bottom: 1.8em;
}
</style>
