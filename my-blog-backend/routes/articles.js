import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../auth.js'

const router = express.Router()

// 获取全部文章（支持关键词/标签/分类筛选+分页）
router.get('/', async (req, res) => {
  try {
    const { keyword, tag, category_id, page = 1, pageSize = 10 } = req.query
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
    if (category_id) {
      where.push(`category_id = $${params.length + 1}`)
      params.push(category_id)
    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ')
    sql += ' ORDER BY created_at DESC'

    // 分页
    const pageInt = Math.max(1, parseInt(page))
    const pageSizeInt = Math.max(1, parseInt(pageSize))
    const offset = (pageInt - 1) * pageSizeInt

    // 统计总数
    let countSql = 'SELECT COUNT(*) FROM articles'
    if (where.length) countSql += ' WHERE ' + where.join(' AND ')
    const countResult = await pool.query(countSql, params)
    const total = parseInt(countResult.rows[0].count, 10)

    // 查询分页数据
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(pageSizeInt, offset)

    const result = await pool.query(sql, params)
    res.json({
      list: result.rows,
      total,
      page: pageInt,
      pageSize: pageSizeInt
    })
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
    const { title, summary, content, tags, cover, category_id } = req.body
    const safeTags = Array.isArray(tags) ? tags : []
    const result = await pool.query(
      'INSERT INTO articles (title, summary, content, tags, cover, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, summary, content, safeTags, cover, category_id]
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
    const { title, summary, content, tags, cover, category_id } = req.body
    const safeTags = Array.isArray(tags) ? tags : []
    const result = await pool.query(
      `UPDATE articles SET
        title=$1, summary=$2, content=$3, tags=$4, cover=$5, category_id=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [title, summary, content, safeTags, cover, category_id, id]
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
