import { apiFetch } from '@/utils/request'

const BASE = '/api/calendar-tasks'

/**
 * 获取任务列表（支持传入 params 过滤，比如 { date: '2025-07-28' }）
 * @param {Object} params
 * @returns {Promise<Array>}
 */
export async function getTasks(params = {}) {
  let url = BASE
  const q = new URLSearchParams(params).toString()
  if (q) url += '?' + q
  const res = await apiFetch(url)
  if (!res.ok) throw new Error('获取任务失败')
  return await res.json()
}

/**
 * 新增任务
 * @param {Object} task
 * @returns {Promise<Object>}
 */
export async function addTask(task) {
  const res = await apiFetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  })
  if (!res.ok) throw new Error('新增任务失败')
  return await res.json()
}

/**
 * 更新任务
 * @param {number|string} id
 * @param {Object} task
 * @returns {Promise<Object>}
 */
export async function updateTask(id, task) {
  const res = await apiFetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  })
  if (!res.ok) throw new Error('更新任务失败')
  return await res.json()
}

/**
 * 删除任务
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function deleteTask(id) {
  const res = await apiFetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('删除任务失败')
  return await res.json()
}
