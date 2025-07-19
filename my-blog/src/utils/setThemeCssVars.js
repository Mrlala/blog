export function setThemeCssVars(vars = {}) {
  const root = document.documentElement
  Object.entries(vars).forEach(([k, v]) => {
    if (typeof v === 'string') {
      const cssVar = '--' + k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
      root.style.setProperty(cssVar, v)
    }
  })
}
