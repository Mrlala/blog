import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import articlesRouter from './routes/articles.js'
import categoriesRouter from './routes/categories.js'
import tagsRouter from './routes/tags.js'
import uploadRouter from './routes/upload.js'
import calendarTasksRouter from './routes/calendarTasks.js'  // 新增这一行
import { signToken } from './auth.js'
import dashboardRouter from './routes/dashboard.js'
import systemStatusRouter from './routes/systemStatus.js'


dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

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

app.use('/uploads', express.static(path.resolve('uploads')))

app.use('/api/articles', articlesRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/calendar-tasks', calendarTasksRouter) // 新增这一行
app.use('/api/dashboard', dashboardRouter)
app.use('/api/system', systemStatusRouter)
app.use((req, res) => res.status(404).json({ error: 'Not found' }))

const PORT = 3001
app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT)
})
