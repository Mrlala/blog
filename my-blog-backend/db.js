// db.js
import { Pool, types } from 'pg'

// 1082 是 Postgres date 类型的 OID
const DATE_OID = 1082
types.setTypeParser(DATE_OID, str => str)

const pool = new Pool({
  user: 'myblog',         // 你的数据库用户名
  host: 'localhost',
  database: 'myblog',     // 数据库名
  password: 'Zhenghao123.',    // 填你的密码
  port: 5432,
})

export default pool
