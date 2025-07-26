import { apiFetch } from '@/utils/request'

export function getCategoryTree() {
  return apiFetch('/api/categories').then(res => res.json())
}
export function addCategory(data) {
  return apiFetch('/api/categories', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(res => res.json())
}
export function updateCategory(id, data) {
  return apiFetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(res => res.json())
}
export function deleteCategory(id) {
  return apiFetch(`/api/categories/${id}`, {
    method: 'DELETE'
  }).then(res => res.json())
}
