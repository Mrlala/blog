<template>
  <div style="padding: 20px; max-width: 800px; margin: auto;">
    <h1>✍️ 写新文章</h1>

    <input v-model="title" placeholder="文章标题" />
    <input v-model="date" type="date" />
    <input v-model="summary" placeholder="文章摘要" />
    <input v-model="cover" placeholder="封面图片 URL（可选）" />
    <textarea v-model="content" placeholder="Markdown 正文..."></textarea>

    <button @click="submit">💾 保存文章</button>

    <p style="margin-top: 1em; color: green;" v-if="successMsg">{{ successMsg }}</p>
    <p style="margin-top: 1em; color: red;" v-if="errorMsg">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const date = ref('')
const summary = ref('')
const cover = ref('')
const content = ref('')
const successMsg = ref('')
const errorMsg = ref('')

function submit() {
  if (!title.value || !date.value || !content.value) {
    errorMsg.value = '❌ 标题、日期、正文不能为空'
    return
  }

  const frontmatter = [
    '---',
    `title: ${title.value}`,
    `date: ${date.value}`,
    `summary: ${summary.value}`,
    cover.value ? `cover: ${cover.value}` : '',
    '---\n'
  ].filter(Boolean).join('\n')

  const fullContent = `${frontmatter}\n${content.value}`
  const safeTitle = title.value.trim().replace(/\s+/g, '-').replace(/[^\w\-]/g, '')
  const filename = `${date.value}-${safeTitle}.md`

  fetch('http://localhost:3001/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, content: fullContent })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        successMsg.value = `✅ 成功保存文章：${filename}`
        errorMsg.value = ''
        // 可选：清空表单
        // title.value = ''; content.value = ''; ...
      } else {
        errorMsg.value = `❌ 保存失败：${data.error || '未知错误'}`
        successMsg.value = ''
      }
    })
    .catch(err => {
      console.error(err)
      errorMsg.value = '❌ 无法连接保存服务'
      successMsg.value = ''
    })
}
</script>

<style scoped>
input,
textarea {
  width: 100%;
  margin-bottom: 1em;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
textarea {
  height: 300px;
  font-family: monospace;
}
button {
  padding: 12px 20px;
  font-size: 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #36996e;
}
</style>
