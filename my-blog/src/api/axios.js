import axios from 'axios'
import { API_BASE_URL } from '@/api/config'

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
  // 你可以加 headers/拦截器等
})

export default instance
