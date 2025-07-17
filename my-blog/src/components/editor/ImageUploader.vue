<template>
  <div class="img-uploader" @paste="onPaste" @drop.prevent="onDrop" @dragover.prevent>
    <input type="file" accept="image/*" @change="onSelect" />
    <div class="uploader-hint">可粘贴、拖拽或选择图片上传</div>
  </div>
</template>

<script setup>
const emit = defineEmits(['uploaded', 'error'])

function onSelect(e) {
  const file = e.target.files[0]
  if (file) upload(file)
}
function onPaste(e) {
  const items = e.clipboardData && e.clipboardData.items
  if (!items) return
  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      upload(item.getAsFile())
      break
    }
  }
}
function onDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) upload(file)
}
async function upload(file) {
  const form = new FormData()
  form.append('file', file)
  try {
    // 此处需有实际后端图片上传接口，返回图片url
    const res = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: form })
    const data = await res.json()
    if (data.url) emit('uploaded', data.url)
    else emit('error', data.error || '上传失败')
  } catch (e) {
    emit('error', '上传异常')
  }
}
</script>

<style>
.img-uploader {
  background: #f6f8fb;
  border: 1.5px dashed #bbb;
  border-radius: 8px;
  padding: 1.1em 1em;
  margin-bottom: 1em;
  text-align: center;
}
.uploader-hint {
  color: #888;
  font-size: 0.97em;
  margin-top: 0.5em;
}
.img-uploader input[type="file"] {
  margin-top: 0.5em;
}
</style>
