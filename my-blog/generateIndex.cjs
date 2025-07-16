const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const articlesDir = path.join(__dirname, 'public', 'articles')
const outputFile = path.join(articlesDir, 'index.json')

const result = []

const files = fs.readdirSync(articlesDir)

files.forEach(file => {
  if (!file.endsWith('.md')) return

  const fullPath = path.join(articlesDir, file)
  const content = fs.readFileSync(fullPath, 'utf-8')

  const { data, content: body } = matter(content)

  // fallback 标题：从正文第一行找 # 开头的行
  const fallbackTitle = body.split('\n').find(line => line.trim().startsWith('#')) || ''
  const title = data.title || fallbackTitle.replace(/^#\s*/, '').trim() || file

  // fallback 日期：用文件创建时间
  const stats = fs.statSync(fullPath)
  const date = data.date || stats.birthtime.toISOString().split('T')[0]

  // fallback 摘要：截取正文前100字
  const summary = data.summary || body.replace(/[#>\-*`\s]/g, '').slice(0, 100)

  const item = {
    file,
    title,
    date,
    summary,
    cover: data.cover || ''
  }

  result.push(item)
})

// 按时间倒序排
result.sort((a, b) => b.date.localeCompare(a.date))

fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8')
console.log(`✅ 成功生成 index.json，共 ${result.length} 篇文章`)
