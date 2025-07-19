<template>
  <button class="edit-btn" @click="$emit('click')">
    <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
      <path d="M5 19l1.5-5.5 9-9a1.5 1.5 0 112.1 2.1l-9 9L5 19z" stroke="#2765bf" stroke-width="2"/>
    </svg>
    编辑
  </button>
</template>

<style scoped>
.edit-btn {
  background: var(--btn-edit-bg, #60a5fa);
  color: var(--btn-edit-text, #fff);
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
.edit-btn:hover {
  background: var(--btn-edit-hover-bg, #3b82f6);
}

</style>
