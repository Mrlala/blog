<template>
  <div class="collapse">
    <div class="collapse-title" @click="open=!open">
      <slot name="title"></slot>
      <span class="arrow">{{ open ? '▼' : '►' }}</span>
    </div>
    <div v-if="open" class="collapse-content">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>
<style>
.collapse { margin-bottom: 1.2em; background: #f5f6fa; border-radius: 9px;}
.collapse-title { cursor: pointer; font-weight: bold; color: #4754be; padding: 0.85em 1em; user-select: none; display: flex; justify-content: space-between; align-items: center;}
.collapse-content { padding: 0.9em 1em; color: #555;}
.arrow { font-size: 0.96em; margin-left: 0.9em; }
</style>
