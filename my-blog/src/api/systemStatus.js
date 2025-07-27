import { apiFetch } from '@/utils/request'

// 获取系统状态
export function fetchSystemStatus() {
  return apiFetch('/api/system/status').then(res => res.json())
}
