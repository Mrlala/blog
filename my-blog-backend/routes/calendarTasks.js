import express from 'express'
import pool from '../db.js'

const router = express.Router()

// 获取所有任务或按日期过滤
router.get('/', async (req, res) => {
  const { date } = req.query
  try {
    let result
    if (date) {
      result = await pool.query(
        'SELECT * FROM calendar_tasks WHERE date = $1 ORDER BY id',
        [date]
      )
    } else {
      result = await pool.query('SELECT * FROM calendar_tasks ORDER BY date DESC, id')
    }
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 新建任务
router.post('/', async (req, res) => {
  const { title, date, description, icon, priority } = req.body
  if (!title || !date) return res.status(400).json({ error: 'title和date必填' })
  try {
    const result = await pool.query(
      `INSERT INTO calendar_tasks (title, date, description, icon, priority)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, date, description || '', icon || '', priority || '']
    )
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 更新任务（部分字段可选）
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const { title, description, icon, priority, done, date } = req.body
  try {
    const fields = []
    const values = []
    let i = 1
    if (title !== undefined)        { fields.push(`title = $${i++}`);        values.push(title) }
    if (description !== undefined)  { fields.push(`description = $${i++}`);  values.push(description) }
    if (icon !== undefined)         { fields.push(`icon = $${i++}`);         values.push(icon) }
    if (priority !== undefined)     { fields.push(`priority = $${i++}`);     values.push(priority) }
    if (done !== undefined)         { fields.push(`done = $${i++}`);         values.push(done) }
    if (date !== undefined)         { fields.push(`date = $${i++}`);         values.push(date) }
    if (!fields.length) return res.status(400).json({ error: '无更新内容' })
    values.push(id)
    const sql = `UPDATE calendar_tasks SET ${fields.join(', ')}, updated_at=NOW() WHERE id = $${i} RETURNING *`
    const result = await pool.query(sql, values)
    if (result.rowCount === 0) return res.status(404).json({ error: '任务不存在' })
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 删除任务
router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const result = await pool.query('DELETE FROM calendar_tasks WHERE id = $1 RETURNING *', [id])
    if (result.rowCount === 0) return res.status(404).json({ error: '任务不存在' })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
