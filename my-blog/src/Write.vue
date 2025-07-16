<!-- Write.vue 最下方按钮 -->
<button @click="submit">💾 保存文章</button>

<script setup>
import { ref } from 'vue'

const title = ref('')
const date = ref('')
const summary = ref('')
const cover = ref('')
const content = ref('')
const output = ref('')

function submit() {
  if (!title.value || !date.value || !content.value) {
    alert('标题、日期、正文不能为空')
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

  const full = `${frontmatter}\n${content.value}`
  const filename = `${date.value}-${title.value.replace(/\s+/g, '-')}.md`

  fetch('http://localhost:3001/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename,
      content: full
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(`✅ 成功保存文章：${filename}`)
      } else {
        alert(`❌ 保存失败：${data.error || '未知错误'}`)
      }
    })
    .catch(err => {
      console.error(err)
      alert('❌ 网络或服务出错')
    })
}
</script>
