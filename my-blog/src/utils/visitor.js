// utils/visitor.js
export function getVisitorId() {
  let id = localStorage.getItem('visitor_id')
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
    localStorage.setItem('visitor_id', id)
  }
  return id
}
