<template>
  <transition name="fade">
    <div v-if="show" :class="['message-tip', type]">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { watch, ref } from 'vue'
const props = defineProps({
  show: Boolean,
  message: String,
  type: { type: String, default: 'success' } // 'success' | 'error' | 'info'
})
const localShow = ref(props.show)

watch(() => props.show, v => {
  localShow.value = v
})
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.message-tip {
  position: fixed;
  right: 2em; top: 2em;
  z-index: 200;
  padding: 0.8em 2.2em;
  border-radius: 8px;
  color: #fff;
  font-size: 1.1em;
  box-shadow: 0 2px 12px rgba(30,30,30,0.13);
}
.message-tip.success { background: #4caf50; }
.message-tip.error   { background: #e93f3f; }
.message-tip.info    { background: #646cff; }
</style>
