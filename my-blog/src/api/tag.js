// src/api/tag.js
// 标签管理接口封装（支持分页、搜索、增删改查）

import { apiFetch } from '@/utils/request'

/**
 * 获取标签列表（分页、模糊搜索）
 * @param {Object} params 
 *   page {number} 页码（默认1）
 *   pageSize {number} 每页条数（默认10）
 *   keyword {string} 可选，按名称模糊搜索
 * @returns {Promise<{list: Array, total: number}>}
 * 
 * 用法：
 *   const { list, total } = await getTags({ page: 1, pageSize: 20, keyword: 'vue' })
 */
export function getTags(params = {}) {
  return apiFetch('/api/tags?' + new URLSearchParams(params)).then(res => res.json())
}

/**
 * 新增标签（需登录）
 * @param {Object} tag 
 *   name {string} 标签名（必填）
 *   color {string} 颜色（可选，推荐用 HEX 或主题色如 #2563eb）
 *   description {string} 描述（可选）
 * @returns {Promise<Object>} 新增成功的标签对象
 */
export function addTag(tag) {
  return apiFetch('/api/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tag)
  }).then(res => res.json())
}

/**
 * 编辑标签（需登录）
 * @param {number|string} id 标签ID
 * @param {Object} tag 更新内容（同新增）
 * @returns {Promise<Object>} 更新后的标签对象
 */
export function updateTag(id, tag) {
  return apiFetch(`/api/tags/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tag)
  }).then(res => res.json())
}

/**
 * 删除标签（需登录）
 * @param {number|string} id 标签ID
 * @returns {Promise<Object>} { success: true }
 * @throws {Error} 该标签被文章引用时会返回400和错误信息
 */
export function deleteTag(id) {
  return apiFetch(`/api/tags/${id}`, {
    method: 'DELETE'
  }).then(res => res.json())
}
