import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../auth.js'

const router = express.Router()

// 获取标签列表，支持分页和搜索
router.get('/', async (req, res) => {
  try {
    let { page = 1, pageSize = 10, keyword } = req.query
    page = parseInt(page)
    pageSize = parseInt(pageSize)
    const offset = (page - 1) * pageSize

    let sql = 'SELECT * FROM tags'
    let countSql = 'SELECT COUNT(*) FROM tags'
    let params = []
    let countParams = []

    if (keyword && keyword.trim()) {
      sql += ' WHERE name ILIKE $1'
      countSql += ' WHERE name ILIKE $1'
      params.push(`%${keyword.trim()}%`)
      countParams = params.slice()
    }
    sql += ' ORDER BY name LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
    params.push(pageSize, offset)

    // 查询总数
    const countResult = await pool.query(countSql, countParams)
    const total = parseInt(countResult.rows[0].count, 10)

    // 查询分页数据
    const result = await pool.query(sql, params)

    res.json({
      list: result.rows,
      total
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 新增标签（需要登录）
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

// 编辑标签（需要登录）
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

// 删除标签（需要登录），有文章引用时阻止删除
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    // 检查引用
    const ref = await pool.query('SELECT COUNT(*) FROM article_tags WHERE tag_id=$1', [id])
    if (parseInt(ref.rows[0].count) > 0) {
      return res.status(400).json({ error: '该标签已被文章引用，请先移除引用后再删除' })
    }
    await pool.query('DELETE FROM tags WHERE id=$1', [id])
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
