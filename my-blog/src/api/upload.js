// src/api/upload.js
import { apiFetch } from '@/utils/request'

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiFetch('/api/upload', {
    method: 'POST',
    body: formData
    // headers 不要手动加 'Content-Type'，让浏览器自动带 boundary
  })
  const data = await res.json()
  if (!data.url) throw new Error(data.error || '上传失败')
  return data.url
}
