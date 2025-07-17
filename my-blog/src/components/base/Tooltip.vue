<template>
  <div class="tooltip-wrapper" @mouseenter="show=true" @mouseleave="show=false">
    <slot />
    <div v-if="show" class="tooltip-pop">{{ text }}</div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({ text: String })
const show = ref(false)
</script>
<style>
.tooltip-wrapper { position: relative; display: inline-block;}
.tooltip-pop {
  position: absolute; left: 110%; top: 50%; transform: translateY(-50%);
  background: #333; color: #fff; border-radius: 6px;
  padding: 0.45em 1em; white-space: nowrap; z-index: 222;
  font-size: 0.97em;
  box-shadow: 0 2px 10px rgba(30,30,30,0.13);
}
</style>
