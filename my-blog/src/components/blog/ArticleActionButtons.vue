<template>
  <div class="action-buttons" @click.stop>
    <button @click.stop="$emit('edit')" class="edit-btn">编辑</button>
    <button @click.stop="showConfirm = true" class="delete-btn">删除</button>

    <div v-if="showConfirm" class="confirm-modal" @click.self="showConfirm = false">
      <div class="confirm-box" @click.stop>
        <div><slot>确定要删除吗？</slot></div>
        <button @click.stop="confirmDelete">确定</button>
        <button @click.stop="showConfirm = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['edit', 'delete'])
const showConfirm = ref(false)

function confirmDelete(event) {
  event.stopPropagation()
  showConfirm.value = false
  emit('delete')
}
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-btn {
  background: var(--btn-edit-bg);
  border: none;
  color: var(--btn-edit-text);
  border-radius: 0.4em;
  padding: 0.3em 0.8em;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}
.edit-btn:hover {
  background: var(--btn-edit-hover-bg);
}

.delete-btn {
  background: var(--btn-delete-bg);
  border: none;
  color: var(--btn-delete-text);
  border-radius: 0.4em;
  padding: 0.3em 0.8em;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: var(--btn-delete-hover-bg);
}

/* 确认弹窗 */
.confirm-modal {
  position: fixed;
  inset: 0;
  background: var(--modal-overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.confirm-box {
  background: var(--modal-bg);
  padding: 2em 2.5em;
  border-radius: 16px;
  box-shadow: var(--modal-shadow);
  text-align: center;
  color: var(--modal-text-color);
}
.confirm-box button {
  margin: 1.5em 0.8em 0 0.8em;
  padding: 0.5em 1.5em;
  border-radius: 8px;
  border: none;
  font-size: 1em;
  background: var(--modal-btn-confirm-bg);
  color: var(--modal-btn-confirm-text);
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}
.confirm-box button:hover {
  background: var(--modal-btn-confirm-hover-bg);
}
.confirm-box button:last-child {
  background: var(--modal-btn-cancel-bg);
  color: var(--modal-btn-cancel-text);
}
.confirm-box button:last-child:hover {
  background: var(--modal-btn-cancel-hover-bg);
}
</style>
