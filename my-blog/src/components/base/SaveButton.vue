<template>
  <button
    class="save-btn"
    :disabled="loading || disabled"
    @click="$emit('click')"
  >
    <span v-if="loading">保存中...</span>
    <span v-else>{{ text || '保存' }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  loading: Boolean,
  disabled: Boolean,
  text: String
})
</script>

<style>
.save-btn {
  font-size: 1em;
  background: #646cff;
  color: #fff;
  padding: 0.7em 2em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.save-btn:disabled { background: #bbb; cursor: not-allowed; }
.save-btn:not(:disabled):hover { background: #535bf2; }
</style>
