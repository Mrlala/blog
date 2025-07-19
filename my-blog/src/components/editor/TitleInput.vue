<template>
  <div class="title-input-wrapper mb-block">
    <input
      type="text"
      :value="modelValue"
      :maxlength="60"
      placeholder="请输入标题"
      class="title-input"
      @input="$emit('update:modelValue', $event.target.value)"
      autocomplete="off"
      spellcheck="false"
    />
    <div class="count">{{ modelValue.length }} / 60</div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.title-input-wrapper {
  position: relative;
  width: 100%;
}
.title-input {
  width: 100%;
  box-sizing: border-box;
  font-size: 1.13em;
  font-weight: 700;
  color: var(--input-text, #1e293b);
  background: var(--input-bg, #f8faff);
  border: 1.5px solid var(--input-border, #e3e8f7);
  border-radius: var(--input-radius, 10px);
  padding: 0.62em 1.15em;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  font-family: inherit;
}
.title-input:focus {
  border-color: var(--input-focus-border, #60a5fa);
  background: var(--input-focus-bg, #fff);
}
.title-input::placeholder {
  color: var(--input-placeholder, #b1b7c7);
  opacity: 1;
}
.count {
  position: absolute;
  right: 1.15em;
  bottom: 0.35em;
  font-size: 0.85em;
  color: var(--input-placeholder, #b1b7c7);
  user-select: none;
  pointer-events: none;
}
</style>
