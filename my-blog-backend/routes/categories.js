import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../auth.js'

const router = express.Router()

// 获取分类树（带 children）
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY  id')
    const list = result.rows
    function buildTree(pid = null) {
      return list
        .filter(c => (c.parent_id === pid || (c.parent_id == null && pid == null)))
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
    const { name, parent_id, sort, icon } = req.body
    if (parent_id && req.body.id && String(parent_id) === String(req.body.id)) {
      return res.status(400).json({ error: 'parent_id 不能等于自身 id' })
    }
    const result = await pool.query(
      'INSERT INTO categories (name, parent_id, sort, icon) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, parent_id || null, sort || 0, icon || null]
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
    const { name, parent_id, sort, icon } = req.body
    if (parent_id && String(parent_id) === String(id)) {
      return res.status(400).json({ error: 'parent_id 不能等于自身 id' })
    }
    const result = await pool.query(
      'UPDATE categories SET name=$1, parent_id=$2, sort=$3, icon=$4 WHERE id=$5 RETURNING *',
      [name, parent_id || null, sort || 0, icon || null, id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: '未找到分类' })
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})


// 删除分类（可选优化：禁止有子分类/文章时删除）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    // 检查有无子分类
    const subRes = await pool.query('SELECT COUNT(*) FROM categories WHERE parent_id=$1', [id])
    if (parseInt(subRes.rows[0].count) > 0) {
      return res.status(400).json({ error: '请先删除该分类下的子分类' })
    }
    // 检查有无文章
    const artRes = await pool.query('SELECT COUNT(*) FROM articles WHERE category_id=$1', [id])
    if (parseInt(artRes.rows[0].count) > 0) {
      return res.status(400).json({ error: '请先删除该分类下的所有文章' })
    }
    await pool.query('DELETE FROM categories WHERE id=$1', [id])
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
