import { apiFetch } from '@/utils/request'

// 列表
export function fetchArticleList(params = {}) {
  const url = '/api/articles?' + new URLSearchParams(params)
  return apiFetch(url).then(res => res.json())
}

// 单篇
export function fetchArticle(id) {
  return apiFetch(`/api/articles/${id}`).then(res => res.json())
}

// 新建
export function addArticle(data) {
  return apiFetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json())
}

// 更新
export function updateArticle(id, data) {
  return apiFetch(`/api/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json())
}

// 删除
export function deleteArticle(id) {
  return apiFetch(`/api/articles/${id}`, {
    method: 'DELETE'
  }).then(res => res.json())
}
