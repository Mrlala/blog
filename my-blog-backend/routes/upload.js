// routes/upload.js
import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()
const uploadDir = path.resolve('uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

// 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + '-' + Math.random().toString(36).substr(2, 6) + ext)
  }
})
const upload = multer({ storage })

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  // 自动识别host（兼容本地/线上）
  const host = req.headers.origin || `http://${req.headers.host}`
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  res.json({ url })

})

export default router
