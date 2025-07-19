<template>
  <button class="back-btn" @click="$emit('click')">
    <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    返回
  </button>
</template>

<style scoped>
.back-btn {
  background: var(--btn-back-bg, #f5f6fa);
  color: var(--btn-back-text, #333);
  border: none;
  border-radius: 1em;
  font-weight: 500;
  font-size: 1em;
  padding: 0.5em 1.3em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3em;
  transition: background 0.2s, color 0.2s;
}
.back-btn:hover {
  background: var(--btn-back-hover-bg, #ececec);
}

</style>
