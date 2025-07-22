import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../auth.js'

const router = express.Router()

// 获取分类树
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY sort, id')
    // 递归组装树
    const list = result.rows
    function buildTree(pid = null) {
      return list
        .filter(c => c.parent_id === pid)
        .map(c => ({ ...c, children: buildTree(c.id) }))
    }
    res.json(buildTree(null))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 新增分类
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, parent_id, sort } = req.body
    const result = await pool.query(
      'INSERT INTO categories (name, parent_id, sort) VALUES ($1, $2, $3) RETURNING *',
      [name, parent_id || null, sort || 0]
    )
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 编辑分类
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { name, parent_id, sort } = req.body
    const result = await pool.query(
      'UPDATE categories SET name=$1, parent_id=$2, sort=$3 WHERE id=$4 RETURNING *',
      [name, parent_id || null, sort || 0, id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: '未找到分类' })
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 删除分类（强烈建议前端先检查该分类下是否还有文章）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM categories WHERE id=$1', [id])
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
