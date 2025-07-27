// src/api/dashboard.js
import { apiFetch } from '@/utils/request'

export function fetchDashboardInfo() {
  return apiFetch('/api/dashboard/info').then(res => res.json())
}
