<template>
  <div class="cover-select-bar">
    <div class="cover-list">
      <div
        v-for="(img, i) in defaultCovers"
        :key="i"
        :class="['cover-thumb', { active: modelValue === img }]"
        @click="choose(img)"
      >
        <img :src="img" />
        <span v-if="modelValue === img" class="cover-selected">✔</span>
      </div>
      <!-- 上传按钮 -->
      <label class="cover-thumb upload-thumb">
        <input type="file" accept="image/*" @change="onFile" hidden />
        <span>上传</span>
      </label>
      <!-- 自定义封面显示 -->
      <div v-if="isCustom" class="cover-thumb active">
        <img :src="modelValue" />
        <span class="cover-selected">✔</span>
      </div>
    </div>
    <div v-if="uploading" class="cover-uploading-tip">上传中...</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  modelValue: String,
  defaultCovers: {
    type: Array,
    default: () => [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80'
    ]
  }
})
const emit = defineEmits(['update:modelValue'])

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001'
const uploading = ref(false)
const fileInput = ref(null)

function choose(url) {
  emit('update:modelValue', url)
}

async function onFile(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (data.url) {
      emit('update:modelValue', data.url)
      // 上传完清空 input，可以连续上传同一张
      e.target.value = ''
    } else {
      alert(data.error || '上传失败')
    }
  } catch (err) {
    alert('上传异常')
  }
  uploading.value = false
}

const isCustom = computed(() =>
  props.modelValue && !props.defaultCovers.includes(props.modelValue)
)
</script>


<style scoped>
.cover-select-bar {
  margin-bottom: 0.6em;
}
.cover-list {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.cover-thumb {
  width: 84px;
  height: 56px;
  border-radius: 9px;
  overflow: hidden;
  border: 2.5px solid var(--cover-thumb-border, #e0e8f4);
  position: relative;
  cursor: pointer;
  background: var(--cover-thumb-bg, #fafbfc);
  box-shadow: var(--cover-thumb-shadow, 0 2px 8px #0001);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border 0.17s, box-shadow 0.15s;
}
.cover-thumb.active,
.cover-thumb:hover {
  border-color: var(--cover-thumb-active-border, #4f8cff);
  box-shadow: var(--cover-thumb-active-shadow, 0 2px 12px #4f8cff22);
}
.cover-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-selected {
  position: absolute;
  right: 7px;
  top: 5px;
  color: var(--cover-selected-text, #fff);
  font-size: 1.15em;
  background: var(--cover-selected-bg, #4f8cff);
  border-radius: 50%;
  padding: 0.07em 0.26em;
  box-shadow: var(--cover-selected-shadow, 0 1px 5px #4f8cff33);
}
.upload-thumb {
  border: 2.5px dashed var(--upload-thumb-border, #b5c6e0);
  background: var(--upload-thumb-bg, #f4f6fb);
  cursor: pointer;
  align-items: center;
  justify-content: center;
}
.upload-thumb span {
  color: var(--upload-thumb-text, #4f8cff);
  font-size: 0.97em;
}
.upload-thumb input {
  display: none;
}
.cover-uploading-tip {
  color: #888;
  font-size: 0.96em;
  margin-top: 0.4em;
  margin-left: 2px;
}
</style>
