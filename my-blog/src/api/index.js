import axios from '@/api/axios'    // 推荐用自定义 axios 实例（见下方）
// 如果你没封装过 axios，可以直接 import axios from 'axios'

const BASE = '/api/calendar-tasks'

/**
 * 获取任务列表
 * @param {Object} params 可选过滤参数，比如 { date: '2025-07-27' }
 * @returns {Promise<Array>}
 */
export function getTasks(params = {}) {
  return axios.get(BASE, { params }).then(res => res.data)
}

/**
 * 新增任务
 * @param {Object} task 任务数据
 */
export function addTask(task) {
  return axios.post(BASE, task).then(res => res.data)
}

/**
 * 更新任务
 * @param {number|string} id 任务ID
 * @param {Object} task 修改内容
 */
export function updateTask(id, task) {
  return axios.put(`${BASE}/${id}`, task).then(res => res.data)
}

/**
 * 删除任务
 * @param {number|string} id 任务ID
 */
export function deleteTask(id) {
  return axios.delete(`${BASE}/${id}`).then(res => res.data)
}
