<template>
  <div class="file-attachment">
    <!-- 多文件选择，支持任何类型附件 -->
    <input type="file" multiple @change="onSelect" />
    <!-- 文件列表展示，每个文件可删除 -->
    <div class="files">
      <span v-for="(f, i) in files" :key="i" class="file-item">
        {{ f.name }}
        <span class="remove" @click="remove(i)">×</span>
      </span>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const files = ref([])

// 选中文件后，更新文件列表
function onSelect(e) {
  files.value = Array.from(e.target.files)
  // 实际项目可 emit('change', files.value)
}

// 移除已选中的文件
function remove(i) {
  files.value.splice(i, 1)
}
</script>
<style>
.file-attachment { margin-bottom: 1em; }
.file-attachment input[type="file"] { margin-bottom: 0.7em; }
.files { margin-top: 0.2em; }
.file-item { background: #f3f3f9; border-radius: 6px; padding: 0.18em 1em; margin-right: 0.6em; font-size: 0.99em; display: inline-block; }
.remove { color: #e93f3f; margin-left: 0.6em; cursor: pointer; }
</style>
