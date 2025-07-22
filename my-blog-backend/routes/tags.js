import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../auth.js'

const router = express.Router()

// 获取所有标签
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tags ORDER BY name')
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 新增标签
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, color, description } = req.body
    const result = await pool.query(
      'INSERT INTO tags (name, color, description) VALUES ($1, $2, $3) RETURNING *',
      [name, color, description]
    )
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 编辑标签
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { name, color, description } = req.body
    const result = await pool.query(
      'UPDATE tags SET name=$1, color=$2, description=$3 WHERE id=$4 RETURNING *',
      [name, color, description, id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: '未找到标签' })
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 删除标签（前端可加二次确认）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM tags WHERE id=$1', [id])
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
