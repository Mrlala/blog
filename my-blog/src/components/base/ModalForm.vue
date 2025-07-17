<template>
  <div v-if="show" class="modal-form-mask">
    <div class="modal-form-box">
      <div class="modal-form-title">{{ title }}</div>
      <form @submit.prevent="$emit('submit')">
        <slot />
        <div class="modal-form-actions">
          <button type="submit">提交</button>
          <button type="button" @click="$emit('close')">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ show: Boolean, title: String })
</script>
<style>
.modal-form-mask {
  position: fixed; left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(60,70,90,0.11); z-index: 999;
  display: flex; align-items: center; justify-content: center;
}
.modal-form-box {
  min-width: 350px; background: #fff; border-radius: 13px;
  box-shadow: 0 6px 36px rgba(30,30,30,0.15);
  padding: 2.8em 2em 1.5em 2em;
}
.modal-form-title { font-size: 1.15em; font-weight: bold; color: #646cff; margin-bottom: 1.5em;}
.modal-form-actions { margin-top: 1.7em; text-align: right;}
.modal-form-actions button {
  padding: 0.44em 1.4em; border-radius: 7px; border: none; background: #646cff;
  color: #fff; font-size: 1em; cursor: pointer; margin-left: 0.8em;
}
.modal-form-actions button:last-child { background: #bbb; color: #444;}
</style>
