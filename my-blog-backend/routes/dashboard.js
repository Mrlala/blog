import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.get('/info', async (req, res) => {
  try {
    // 基础统计数据
    const [articlesResult, categoriesResult, tagsResult, viewsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM articles'),
      pool.query('SELECT COUNT(*) FROM categories'),
      pool.query('SELECT COUNT(*) FROM tags'),
      pool.query('SELECT COALESCE(SUM(views),0) AS total_views FROM articles')
    ])

    // 最近发布的5篇文章，含浏览量和发布时间
    const recentArticlesResult = await pool.query(`
      SELECT id, title, views, created_at FROM articles
      WHERE status = 'published'
      ORDER BY created_at DESC
      LIMIT 5
    `)

    // 最近7天阅读趋势（假设有 article_views 表记录访问日志）
    const readingTrendResult = await pool.query(`
      SELECT
        to_char(created_at::date, 'YYYY-MM-DD') AS day,
        COUNT(*) AS views
      FROM article_views
      WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY day
      ORDER BY day ASC
    `)

    // 可根据实际情况加入 loginRecords 字段，或者空数组占位
    const loginRecords = []

    res.json({
      articles: parseInt(articlesResult.rows[0].count, 10) || 0,
      categories: parseInt(categoriesResult.rows[0].count, 10) || 0,
      tags: parseInt(tagsResult.rows[0].count, 10) || 0,
      views: parseInt(viewsResult.rows[0].total_views, 10) || 0,
      recentArticles: recentArticlesResult.rows,
      readingTrend: readingTrendResult.rows,
      loginRecords
    })
  } catch (error) {
    console.error('获取仪表盘统计失败:', error)
    res.status(500).json({ error: '获取统计数据失败' })
  }
})

export default router
