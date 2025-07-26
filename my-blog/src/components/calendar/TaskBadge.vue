<template>
  <span v-if="count > 0" class="calendar-badge">{{ count }} 项</span>
</template>
<script setup>
const props = defineProps({ count: Number })
</script>
<style scoped>
.calendar-badge {
  margin-top: 2px;
  background: var(--primary-color, #2563eb);
  color: #fff;
  border-radius: 8px;
  font-size: 0.75em;
  padding: 0.05em 0.5em;
  display: inline-block;
  min-width: 2.2em;
  text-align: center;
}
</style>
