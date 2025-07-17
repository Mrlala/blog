<template>
  <div class="alert" :class="type" v-if="show">
    <slot>{{ message }}</slot>
    <span class="close" @click="close">×</span>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ show: Boolean, message: String, type: { default: 'info' } })
const emit = defineEmits(['close'])
function close() { emit('close') }
</script>
<style>
.alert { padding: 1em 2.1em; border-radius: 8px; margin: 1.2em 0; position: relative; font-size: 1.07em;}
.alert.info { background: #f2f5fa; color: #4754be;}
.alert.success { background: #e2ffe5; color: #277b4f;}
.alert.error { background: #ffeaea; color: #d04c4c;}
.alert .close { position: absolute; right: 1em; top: 1em; cursor: pointer; font-size: 1.3em;}
</style>
