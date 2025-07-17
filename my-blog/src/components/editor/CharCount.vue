<template>
  <div class="char-count">
    字数：{{ count }}<span v-if="limit"> / {{ limit }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  content: String,
  limit: Number
})
const count = computed(() => (props.content || '').length)
</script>

<style>
.char-count {
  color: #888;
  font-size: 0.97em;
  margin-top: 0.2em;
  text-align: right;
}
</style>
