// app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import articlesRouter from './routes/articles.js';
import uploadRouter from './routes/upload.js';

const app = express();
app.use(cors());
app.use(express.json());

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
