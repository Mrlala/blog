<template>
  <div class="search-bar">
    <input
      v-model="inputValue"
      :placeholder="placeholder"
      class="search-input"
      @input="$emit('update:modelValue', inputValue)"
      @keydown.enter="$emit('search', inputValue)"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: "搜索…" },
});
const inputValue = ref(props.modelValue || "");
watch(() => props.modelValue, v => (inputValue.value = v));
</script>

<style scoped>
.search-bar {
  width: 100%;
  margin-bottom: 1.2em;
}
.search-input {
  width: 95%;
  padding: var(--input-padding, 0.75em 1.2em);
  border-radius: var(--input-radius, 1.2em);
  border: 1.5px solid var(--input-border, #e3e8f7);
  background: var(--input-bg, #f6f8fa);
  color: var(--input-text, #274b8b);
  font-size: var(--input-font-size, 1.08em);
  outline: none;
  transition: border 0.2s, background 0.2s, color 0.2s;
}
.search-input:focus {
  border-color: var(--input-focus-border, #60a5fa);
  background: var(--input-focus-bg, #fff);
}
.search-input::placeholder {
  color: var(--input-placeholder, #b1b7c7);
  opacity: 1;
}
</style>
