import express from 'express'
import cors from 'cors'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'
import articleRouter from './routes/article.js'

// 路径相关
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 自动在启动时生成 index.json
exec('node ./utils/generateIndex.cjs', { cwd: __dirname }, (err, stdout, stderr) => {
  if (err) {
    console.error('服务启动时生成 index.json 失败:', stderr)
  } else {
    console.log('服务启动时已生成 index.json')
    if (stdout) console.log(stdout)
  }
})

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

// 路由分离，所有文章相关接口用 /api/article/ 开头
app.use('/api/article', articleRouter)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`🚀 博客服务启动成功： http://localhost:${PORT}`)
})
