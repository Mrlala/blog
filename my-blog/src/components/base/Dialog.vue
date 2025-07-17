<template>
  <div class="dropdown" @mouseenter="open=true" @mouseleave="open=false">
    <slot name="trigger">
      <button class="dropdown-trigger">菜单</button>
    </slot>
    <div v-if="open" class="dropdown-menu">
      <slot />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>
<style>
.dropdown { position: relative; display: inline-block;}
.dropdown-trigger { border: none; border-radius: 7px; background: #f4f5fa; color: #646cff; padding: 0.4em 1.2em;}
.dropdown-menu {
  position: absolute; left: 0; top: 120%; min-width: 100px;
  background: #fff; border: 1.5px solid #e9edff; border-radius: 7px;
  box-shadow: 0 2px 12px rgba(60,60,60,0.08); z-index: 100;
  padding: 0.2em 0;
}
.dropdown-menu ::v-deep > * { padding: 0.65em 1.2em; cursor: pointer;}
.dropdown-menu ::v-deep > *:hover { background: #f3f5fd; color: #4754be;}
</style>
