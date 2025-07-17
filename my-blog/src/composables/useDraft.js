import { ref } from 'vue'

// 单篇文章/全局草稿，key 可自定义
export function useDraft(key = 'blog-draft') {
  const draft = ref({
    title: '', content: '', tags: [], time: ''
  })

  function load() {
    const data = JSON.parse(localStorage.getItem(key) || '{}')
    if (data) Object.assign(draft.value, data)
    return !!(draft.value.title || draft.value.content || (draft.value.tags && draft.value.tags.length))
  }

  function save(title, content, tags) {
    draft.value.title = title
    draft.value.content = content
    draft.value.tags = tags
    draft.value.time = new Date().toLocaleTimeString()
    localStorage.setItem(key, JSON.stringify(draft.value))
  }

  function clear() {
    localStorage.removeItem(key)
    draft.value = { title: '', content: '', tags: [], time: '' }
  }

  return { draft, load, save, clear }
}
