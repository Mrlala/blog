import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../auth.js'

const router = express.Router()

// 获取全部文章（支持关键词/标签筛选）
router.get('/', async (req, res) => {
  try {
    const { keyword, tag } = req.query
    let sql = 'SELECT * FROM articles'
    const params = []
    const where = []

    if (keyword) {
      where.push(`(title ILIKE $${params.length + 1} OR summary ILIKE $${params.length + 1})`)
      params.push(`%${keyword}%`)
    }
    if (tag) {
      where.push(`$${params.length + 1} = ANY(tags)`)
      params.push(tag)
    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ')
    sql += ' ORDER BY created_at DESC'

    const result = await pool.query(sql, params)
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 获取单篇
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM articles WHERE id=$1', [id])
    if (!result.rows[0]) return res.status(404).json({ error: '未找到该文章' })
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 新增文章（需要登录）
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, summary, content, tags, cover } = req.body
    const safeTags = Array.isArray(tags) ? tags : []
    const result = await pool.query(
      'INSERT INTO articles (title, summary, content, tags, cover) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, summary, content, safeTags, cover]
    )
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 编辑文章（需要登录）
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { title, summary, content, tags, cover } = req.body
    const safeTags = Array.isArray(tags) ? tags : []
    const result = await pool.query(
      `UPDATE articles SET
        title=$1, summary=$2, content=$3, tags=$4, cover=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [title, summary, content, safeTags, cover, id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: '未找到该文章' })
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 删除文章（需要登录）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM articles WHERE id=$1', [id])
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
