import express from 'express'
import os from 'os'
import checkDiskSpace from 'check-disk-space'
import pool from '../db.js'  // 你的数据库连接池

const router = express.Router()

router.get('/status', async (req, res) => {
  try {
    // CPU 使用率计算（平均负载）
    // os.loadavg() 返回过去1、5、15分钟的平均负载，Linux/Mac适用，Windows通常返回0
    const loadavg = os.loadavg()[0]  // 1分钟平均负载

    // CPU 核数
    const cpus = os.cpus().length

    // 内存使用
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(1)

    // 磁盘空间（检查根目录）
    const diskSpace = await checkDiskSpace('J:\\') // mac/linux 根目录
    // Windows 下用 'C:\\'

    // 数据库连接数
    // PostgreSQL 统计当前活动连接数
    const dbConnRes = await pool.query('SELECT count(*) FROM pg_stat_activity')
    const dbConnections = parseInt(dbConnRes.rows[0].count, 10)

    res.json({
      cpuLoad: loadavg.toFixed(2),          // 负载
      cpuCount: cpus,
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usedPercent: memUsagePercent
      },
      disk: {
        free: diskSpace.free,
        size: diskSpace.size,
        freePercent: ((diskSpace.free / diskSpace.size) * 100).toFixed(1)
      },
      dbConnections
    })
  } catch (error) {
    console.error('获取系统状态失败', error)
    res.status(500).json({ error: '获取系统状态失败' })
  }
})

export default router
