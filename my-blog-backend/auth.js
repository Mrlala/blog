import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const SECRET = process.env.JWT_SECRET || 'default_secret'

export function authMiddleware(req, res, next) {
  const auth = req.headers['authorization']
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' })
  }
  try {
    const token = auth.slice(7)
    const payload = jwt.verify(token, SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: '登录已过期或无效' })
  }
}

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '2h' })
}
