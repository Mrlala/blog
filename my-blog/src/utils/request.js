import { API_BASE_URL } from '@/api/config'
import { getToken } from '@/utils/auth'

export async function apiFetch(url, options = {}) {
  if (!/^https?:\/\//.test(url)) {
    url = API_BASE_URL.replace(/\/$/, '') + (url.startsWith('/') ? url : '/' + url)
  }
  options.headers = options.headers || {}
  const token = getToken && getToken()
  if (token) {
    options.headers['Authorization'] = 'Bearer ' + token
  }
  return fetch(url, options)
}
