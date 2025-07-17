<template>
  <div class="table-insert">
    <input v-model="rows" type="number" min="2" max="20" style="width:3em" /> 行
    <input v-model="cols" type="number" min="2" max="10" style="width:3em" /> 列
    <button @click="insert">插入表格</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const emit = defineEmits(['insert'])
const rows = ref(3)
const cols = ref(3)
function insert() {
  // 生成 markdown 表格文本
  let head = '| ' + Array(cols.value).fill('头').join(' | ') + ' |\n'
  let sep = '| ' + Array(cols.value).fill('---').join(' | ') + ' |\n'
  let body = ''
  for (let i = 0; i < rows.value - 1; i++) {
    body += '| ' + Array(cols.value).fill('内容').join(' | ') + ' |\n'
  }
  emit('insert', head + sep + body)
}
</script>
<style>
.table-insert { margin-bottom: 1em; background: #f5f6fa; padding: 1em; border-radius: 8px; }
.table-insert input { margin: 0 0.4em 0 0.5em; border-radius: 5px; border: 1px solid #ccc; padding: 0.2em 0.5em; }
.table-insert button { margin-left: 0.8em; border-radius: 6px; border: none; padding: 0.28em 1.1em; background: #646cff; color: #fff; cursor: pointer; }
.table-insert button:hover { background: #4754be; }
</style>
