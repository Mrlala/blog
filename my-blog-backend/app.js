import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import articlesRouter from './routes/articles.js'
import categoriesRouter from './routes/categories.js'
import tagsRouter from './routes/tags.js'
import uploadRouter from './routes/upload.js'
import { signToken } from './auth.js'

dotenv.config()

const app = express()

// CORS配置
app.use(cors({
  origin: 'http://localhost:5173',  // 前端页面地址
  credentials: true                 // 允许带cookie/session
}))

app.use(express.json())

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = signToken({ username })
    res.json({ token })
  } else {
    res.status(401).json({ error: '用户名或密码错误' })
  }
})

// 静态文件服务（如图片上传）
app.use('/uploads', express.static(path.resolve('uploads')))

// 注册主要路由
app.use('/api/articles', articlesRouter)
app.use('/api/categories', categoriesRouter)  // 分类路由
app.use('/api/tags', tagsRouter)              // 标签路由
app.use('/api/upload', uploadRouter)

// 404处理
app.use((req, res) => res.status(404).json({ error: 'Not found' }))

const PORT = 3001
app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT)
})
