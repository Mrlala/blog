import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../auth.js'

const router = express.Router()

// 工具函数：查文章的标签
async function getTagsByArticleId(articleId) {
  const tagRows = await pool.query(
    `SELECT t.id, t.name, t.color FROM article_tags at
     JOIN tags t ON at.tag_id = t.id
     WHERE at.article_id = $1`, [articleId]
  )
  return tagRows.rows
}

// 工具函数：查文章的分类
async function getCategoryById(categoryId) {
  if (!categoryId) return null
  const result = await pool.query('SELECT id, name FROM categories WHERE id = $1', [categoryId])
  return result.rows[0] || null
}

// 工具函数：批量查重+新建标签，返回所有 id，且过滤空/非法标签
async function ensureTagsExist(client, tagNames) {
  tagNames = (Array.isArray(tagNames) ? tagNames : []).filter(
    name => typeof name === 'string' && name.trim()
  )
  if (!tagNames.length) return []
  // 查已有
  const existRows = await client.query(
    'SELECT id, name FROM tags WHERE name = ANY($1)', [tagNames]
  )
  const existNameToId = Object.fromEntries(existRows.rows.map(t => [t.name, t.id]))
  // 新建不存在
  const needInsert = tagNames.filter(name => !existNameToId[name])
  if (needInsert.length) {
    const valuesClause = needInsert.map((_, i) => `($${i + 1})`).join(',')
    await client.query(
      `INSERT INTO tags (name) VALUES ${valuesClause} ON CONFLICT (name) DO NOTHING`, needInsert
    )
  }
  // 查全部 id
  const allRows = await client.query(
    'SELECT id, name FROM tags WHERE name = ANY($1)', [tagNames]
  )
  return allRows.rows.map(t => t.id)
}

// 递归查所有子分类 id（含自己）
async function getAllSubCategoryIds(categoryId) {
  const result = await pool.query(`
    WITH RECURSIVE sub_categories AS (
      SELECT id FROM categories WHERE id = $1
      UNION ALL
      SELECT c.id FROM categories c
      INNER JOIN sub_categories sc ON c.parent_id = sc.id
    )
    SELECT id FROM sub_categories
  `, [categoryId])
  return result.rows.map(r => r.id)
}

// 查询文章列表（分页、筛选、带标签和分类名，支持分类树递归筛选）
router.get('/', async (req, res) => {
  try {
    const {
      keyword,
      tag,
      category_id,
      page = 1,
      pageSize = 10,
      sort,
      status // 新增：文章状态筛选
    } = req.query

    let where = []
    let params = []

    // 处理状态筛选
    if (status) {
      where.push(`status = $${params.length + 1}`)
      params.push(status)
    } else {
      // 默认过滤下架文章
      where.push(`status != 'offline'`)
    }

    // 关键词
    if (keyword) {
      where.push(`(title ILIKE $${params.length + 1} OR summary ILIKE $${params.length + 1})`)
      params.push(`%${keyword}%`)
    }

    // 分类递归筛选
    if (category_id) {
      const catIds = await getAllSubCategoryIds(category_id)
      if (catIds.length) {
        where.push(`category_id = ANY($${params.length + 1})`)
        params.push(catIds)
      }
    }

    // 排序
    let orderSql = 'ORDER BY created_at DESC'
    if (sort === 'views_desc') {
      orderSql = 'ORDER BY views DESC'
    } else if (sort === 'views_asc') {
      orderSql = 'ORDER BY views ASC'
    } else if (sort === 'updated_at_desc') {
      orderSql = 'ORDER BY updated_at DESC'
    } else if (sort === 'updated_at_asc') {
      orderSql = 'ORDER BY updated_at ASC'
    } else if (sort === 'created_at_asc') {
      orderSql = 'ORDER BY created_at ASC'
    }

    // 拼接查询条件
    let sql = 'SELECT * FROM articles'
    if (where.length) {
      sql += ' WHERE ' + where.join(' AND ')
    }
    sql += ' ' + orderSql

    // 统计总数
    let countSql = 'SELECT COUNT(*) FROM articles'
    if (where.length) countSql += ' WHERE ' + where.join(' AND ')
    const countResult = await pool.query(countSql, params)
    const total = parseInt(countResult.rows[0].count, 10)

    // 分页
    const pageInt = Math.max(1, parseInt(page))
    const pageSizeInt = Math.max(1, parseInt(pageSize))
    const offset = (pageInt - 1) * pageSizeInt

    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(pageSizeInt, offset)

    const result = await pool.query(sql, params)

    // 查询标签和分类，同时做tag筛选
    const list = await Promise.all(result.rows.map(async article => {
      let tags = await getTagsByArticleId(article.id)
      let category = await getCategoryById(article.category_id)
      if (tag && !tags.find(t => String(t.id) === String(tag))) return null
      return { ...article, tags, category }
    }))

    res.json({
      list: list.filter(Boolean),
      total,
      page: pageInt,
      pageSize: pageSizeInt
    })
  } catch (e) {
    console.error('文章列表查询失败:', e)
    res.status(500).json({ error: e.message })
  }
})



// 获取单篇文章（带标签和分类）
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM articles WHERE id=$1', [id])
    if (!result.rows[0]) return res.status(404).json({ error: '未找到该文章' })
    const article = result.rows[0]
    article.tags = await getTagsByArticleId(article.id)
    article.category = await getCategoryById(article.category_id)
    res.json(article)
  } catch (e) {
    console.error('获取单篇文章失败:', e)
    res.status(500).json({ error: e.message })
  }
})

// 新增文章（标签传名字自动查重新建）
router.post('/', authMiddleware, async (req, res) => {
  const client = await pool.connect()
  try {
    const { title, summary, content, tags = [], cover, category_id } = req.body
    await client.query('BEGIN')
    // 1. 插入文章
    const safeCategoryId = category_id === undefined || category_id === '' ? null : category_id
    const result = await client.query(
      'INSERT INTO articles (title, summary, content, cover, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, summary, content, cover, safeCategoryId]
    )
    const article = result.rows[0]
    // 2. 处理标签
    const tagIds = await ensureTagsExist(client, tags)
    // 3. 建立关联
    for (const tagId of tagIds) {
      await client.query(
        'INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [article.id, tagId]
      )
    }
    await client.query('COMMIT')
    // 查询带标签、分类
    article.tags = await getTagsByArticleId(article.id)
    article.category = await getCategoryById(article.category_id)
    res.json(article)
  } catch (e) {
    console.error('新增文章失败:', e)
    await client.query('ROLLBACK')
    res.status(500).json({ error: e.message })
  } finally {
    client.release()
  }
})

// 编辑文章（标签传名字自动查重新建）
router.put('/:id', authMiddleware, async (req, res) => {
  const client = await pool.connect()
  try {
    const { id } = req.params
    const { title, summary, content, tags = [], cover, category_id } = req.body
    await client.query('BEGIN')
    // 1. 更新文章内容
    const safeCategoryId = category_id === undefined || category_id === '' ? null : category_id
    const result = await client.query(
      `UPDATE articles SET
        title=$1, summary=$2, content=$3, cover=$4, category_id=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [title, summary, content, cover, safeCategoryId, id]
    )
    if (!result.rows[0]) throw new Error('未找到该文章')
    // 2. 处理标签
    await client.query('DELETE FROM article_tags WHERE article_id=$1', [id])
    const tagIds = await ensureTagsExist(client, tags)
    for (const tagId of tagIds) {
      await client.query(
        'INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [id, tagId]
      )
    }
    await client.query('COMMIT')
    const article = result.rows[0]
    article.tags = await getTagsByArticleId(article.id)
    article.category = await getCategoryById(article.category_id)
    res.json(article)
  } catch (e) {
    console.error('编辑文章失败:', e)
    await client.query('ROLLBACK')
    res.status(500).json({ error: e.message })
  } finally {
    client.release()
  }
})

// 删除文章（自动级联删除关联标签）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM articles WHERE id=$1', [id])
    res.json({ success: true })
  } catch (e) {
    console.error('删除文章失败:', e)
    res.status(500).json({ error: e.message })
  }
})
// 仅需要写一次，作用于全文件
const lastViewMap = new Map()

// routes/articles.js 里 POST /:id/view 接口里
router.post('/:id/view', async (req, res) => {
  const { id } = req.params

  // 获取 ip
  const rawIp = req.headers['x-forwarded-for'] || req.ip || 'unknown'
  const ip = rawIp.split(',')[0].trim()

  // 从前端 body 获取 user_agent, session_id, referer（可选）
  // 前端应主动传这几个字段，没有就自动 fallback
  const user_agent = req.body.user_agent || req.headers['user-agent'] || ''
  const session_id = req.body.session_id || null
  const referer = req.body.referer || req.headers['referer'] || null

  // 防刷
  const key = `${id}_${ip}`
  const now = Date.now()
  const cooldown = 10 * 60 * 1000
  if (lastViewMap.has(key) && now - lastViewMap.get(key) < cooldown) {
    return res.json({ success: false, reason: 'duplicate' })
  }

  try {
    // 主表 views +1
    await pool.query('UPDATE articles SET views = views + 1 WHERE id = $1', [id])

    // 明细表插入（带全字段）
    await pool.query(
      `INSERT INTO article_views (article_id, created_at, ip, user_agent, session_id, referer)
       VALUES ($1, NOW(), $2, $3, $4, $5)`,
      [id, ip, user_agent, session_id, referer]
    )

    lastViewMap.set(key, now)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})



// 修改文章状态
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    // 仅允许指定值
    if (!['published', 'draft', 'offline'].includes(status)) {
      return res.status(400).json({ error: '不支持的状态' })
    }
    const result = await pool.query(
      'UPDATE articles SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    )
    if (!result.rows[0]) throw new Error('未找到该文章')
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
