import { apiFetch } from '@/utils/request'
import { getVisitorId } from '@/utils/visitor'
// 列表
export function fetchArticleList(params = {}) {
  // 默认加 status=published，除非调用时特别指定

  const url = '/api/articles?' + new URLSearchParams(params)
  return apiFetch(url).then(res => res.json())
}
export function fetchPublishedArticles(params = {}) {
  return fetchArticleList({ ...params, status: 'published' })
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

export function updateArticleStatus(id, status) {
  return apiFetch(`/api/articles/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(res => res.json())
}
export function addArticleView(id) {
  return apiFetch(`/api/articles/${id}/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: getVisitorId(), // 访客唯一ID
      referer: document.referrer,
      user_agent: navigator.userAgent
    })
  }).then(res => res.json())
}