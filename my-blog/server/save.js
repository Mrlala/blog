import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors()) 
app.use(express.json({ limit: '5mb' }))

const ARTICLES_DIR = path.join(__dirname, '../public/articles')

app.post('/save', (req, res) => {
  const { filename, content } = req.body

  if (!filename || !content) {
    return res.status(400).json({ error: 'Missing filename or content' })
  }

  const fullPath = path.join(ARTICLES_DIR, filename)

  try {
    fs.writeFileSync(fullPath, content, 'utf-8')
    console.log(`✅ 文章已保存: ${filename}`)

    exec('node generateIndex.cjs', { cwd: path.resolve(__dirname, '..') }, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr)
        return res.status(500).json({ error: 'index.json 生成失败' })
      }
      console.log(stdout)
      res.json({ success: true })
    })
  } catch (err) {
    console.error('保存失败:', err)
    res.status(500).json({ error: '保存失败' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`🚀 写作服务启动成功： http://localhost:${PORT}`)
})
