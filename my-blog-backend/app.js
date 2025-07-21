import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv'
import articlesRouter from './routes/articles.js';
import uploadRouter from './routes/upload.js';
import { signToken } from './auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // 用 .env 管理账号密码
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = signToken({ username });
    res.json({ token });
  } else {
    res.status(401).json({ error: '用户名或密码错误' });
  }
});

// ...后面代码不变


// 静态文件服务：图片可直接访问
app.use('/uploads', express.static(path.resolve('uploads')));

// 路由
app.use('/api/articles', articlesRouter);
app.use('/api/upload', uploadRouter);

// 404处理
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});
