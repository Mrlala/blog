<template>
  <div class="confirm-modal" v-if="show">
    <div class="confirm-box">
      <div>{{ message }}</div>
      <button @click="onOk">确定</button>
      <button @click="onCancel">取消</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,          // 是否显示弹窗
  message: String         // 弹窗消息内容
})
const emit = defineEmits(['ok', 'cancel'])
function onOk() { emit('ok') }
function onCancel() { emit('cancel') }
</script>

<style>
.confirm-modal {
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(30,30,30,0.18);
  display: flex; align-items: center; justify-content: center;
  z-index: 99;
}
.confirm-box {
  background: #fff;
  padding: 2em 2.5em;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.13);
  text-align: center;
}
.confirm-box button {
  margin: 1.5em 0.8em 0 0.8em;
  padding: 0.5em 1.5em;
  border-radius: 8px;
  border: none;
  font-size: 1em;
  background: #646cff;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.confirm-box button:last-child {
  background: #bbb;
  color: #444;
}
</style>
