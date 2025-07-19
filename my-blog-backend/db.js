// db.js
import { Pool } from 'pg';

const pool = new Pool({
  user: 'myblog',         // 你的数据库用户名
  host: 'localhost',
  database: 'myblog',     // 数据库名
  password: 'Zhenghao123.',    // 填你的密码
  port: 5432,
});

export default pool;
