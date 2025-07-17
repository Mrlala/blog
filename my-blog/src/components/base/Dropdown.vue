<template>
  <div v-if="show" class="dialog-mask">
    <div class="dialog-box">
      <div class="dialog-title" v-if="title">{{ title }}</div>
      <div class="dialog-content"><slot /></div>
      <div class="dialog-actions">
        <slot name="actions">
          <button @click="$emit('close')">关闭</button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ show: Boolean, title: String })
</script>
<style>
.dialog-mask {
  position: fixed; left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(60,70,90,0.11); z-index: 999;
  display: flex; align-items: center; justify-content: center;
}
.dialog-box {
  min-width: 340px; background: #fff; border-radius: 13px;
  box-shadow: 0 6px 36px rgba(30,30,30,0.15);
  padding: 2.5em 2em 1.5em 2em; text-align: center;
}
.dialog-title { font-size: 1.18em; font-weight: bold; color: #646cff; margin-bottom: 1.3em;}
.dialog-actions { margin-top: 1.5em;}
.dialog-actions button {
  padding: 0.4em 1.7em; border-radius: 7px; border: none; background: #646cff;
  color: #fff; font-size: 1em; cursor: pointer; margin: 0 0.6em;
}
.dialog-actions button:hover { background: #4754be; }
</style>
