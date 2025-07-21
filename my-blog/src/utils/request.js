// src/utils/request.js
import { getToken } from './auth'

export async function apiFetch(url, options = {}) {
  options.headers = options.headers || {}
  const token = getToken()
  if (token) {
    options.headers['Authorization'] = 'Bearer ' + token
  }
  return fetch(url, options)
}
