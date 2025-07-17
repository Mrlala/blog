import express from 'express'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ARTICLES_DIR = path.join(__dirname, '../../public/articles')

// 保存文章
router.post('/save', (req, res) => {
  const { filename, content } = req.body
  if (!filename || !content) {
    return res.status(400).json({ error: 'Missing filename or content' })
  }
  const fullPath = path.join(ARTICLES_DIR, filename)
  try {
    fs.writeFileSync(fullPath, content, 'utf-8')
    console.log(`✅ 文章已保存: ${filename}`)
    exec('node ./backend/utils/generateIndex.cjs', { cwd: path.resolve(__dirname, '../..') }, (err, stdout, stderr) => {
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

// 删除文章
router.post('/delete', (req, res) => {
  const { filename } = req.body
  if (!filename) {
    return res.status(400).json({ error: 'Missing filename' })
  }
  const fullPath = path.join(ARTICLES_DIR, filename)
  try {
    fs.unlinkSync(fullPath)
    console.log(`🗑️ 文章已删除: ${filename}`)
    exec('node ./backend/utils/generateIndex.cjs', { cwd: path.resolve(__dirname, '../..') }, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr)
        return res.status(500).json({ error: 'index.json 生成失败' })
      }
      console.log(stdout)
      res.json({ success: true })
    })
  } catch (err) {
    console.error('删除失败:', err)
    res.status(500).json({ error: '删除失败' })
  }
})

export default router

