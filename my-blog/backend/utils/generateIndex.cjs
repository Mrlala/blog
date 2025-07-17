
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const ROOT_DIR = path.resolve(__dirname, '../..')
// 文章目录
const ARTICLES_DIR = path.join(ROOT_DIR, 'public/articles')
// 索引文件
const INDEX_JSON = path.join(ARTICLES_DIR, 'index.json')

// 若目录不存在，自动创建
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true })
}

// 获取所有 md 文件
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'))

const articles = files.map(file => {
  const filePath = path.join(ARTICLES_DIR, file)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const parsed = matter(raw)
  const data = parsed.data || {}
  const content = parsed.content || ''

  // 标签字段兼容字符串/数组
  let tags = data.tags
  if (typeof tags === 'string') {
    tags = tags.split(/,|，|\s/).filter(Boolean)
  }
  // 标题优先 frontmatter，否则正文首行#，否则文件名
  let title = data.title
  if (!title) {
    const firstLine = content.split('\n')[0]
    if (firstLine.startsWith('# ')) {
      title = firstLine.replace(/^# /, '').trim()
    } else {
      title = file.replace(/\.md$/, '')
    }
  }
  let summary = data.summary
  if (!summary) {
    summary = content.replace(/[\r\n#]/g, '').trim().slice(0, 80)
  }
  let date = data.date || file.slice(0, 10)
  let cover = data.cover || ''

  return {
    file,
    title,
    date,
    summary,
    cover,
    tags: tags || []
  }
})

// 写入 index.json
fs.writeFileSync(INDEX_JSON, JSON.stringify(articles, null, 2), 'utf-8')
console.log(`已生成 ${INDEX_JSON}，共${articles.length}篇文章`)
