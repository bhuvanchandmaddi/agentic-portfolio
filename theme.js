/** Corner theme switcher: accent colour, background mode and typeface, persisted in localStorage. */

const KEY = 'bcm-theme'

const ACCENTS = [
  { id: 'crimson', label: 'Crimson', color: '#ec3b2f' },
  { id: 'amber', label: 'Amber', color: '#f59e0b' },
  { id: 'emerald', label: 'Emerald', color: '#10b981' },
  { id: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { id: 'cobalt', label: 'Cobalt', color: '#2f6bff' },
  { id: 'violet', label: 'Violet', color: '#8b5cf6' },
  { id: 'rose', label: 'Rose', color: '#ec4899' },
]
const BACKGROUNDS = [
  { id: 'noir', label: 'Noir', color: '#070707' },
  { id: 'midnight', label: 'Midnight', color: '#060a14' },
  { id: 'graphite', label: 'Graphite', color: '#18181b' },
  { id: 'paper', label: 'Paper', color: '#f6f4ef' },
]
const FONTS = [
  { id: 'jakarta', label: 'Jakarta', family: "'Plus Jakarta Sans'" },
  { id: 'grotesk', label: 'Grotesk', family: "'Space Grotesk'" },
  { id: 'sora', label: 'Sora', family: "'Sora'" },
  { id: 'mono', label: 'Mono', family: "'JetBrains Mono'" },
]
const DEFAULTS = { accent: 'crimson', bg: 'noir', font: 'jakarta' }

function load() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') } }
  catch { return { ...DEFAULTS } }
}

function el(tag, cls, text) {
  const n = document.createElement(tag)
  if (cls) n.className = cls
  if (text) n.textContent = text
  return n
}

export function initTheme({ onChange = () => {} } = {}) {
  let theme = load()
  const root = document.documentElement
  const meta = document.querySelector('meta[name="theme-color"]')

  const apply = () => {
    for (const k of Object.keys(DEFAULTS)) {
      if (theme[k] === DEFAULTS[k]) root.removeAttribute(`data-${k}`)
      else root.setAttribute(`data-${k}`, theme[k])
    }
    meta?.setAttribute('content', BACKGROUNDS.find((b) => b.id === theme.bg)?.color || '#070707')
    try { localStorage.setItem(KEY, JSON.stringify(theme)) } catch { /* private mode */ }
    panel.querySelectorAll('[data-k]').forEach((b) => {
      const on = theme[b.dataset.k] === b.dataset.v
      b.classList.toggle('is-active', on)
      b.setAttribute('aria-pressed', String(on))
    })
  }

  const set = (k, v) => {
    theme = { ...theme, [k]: v }
    apply()
    const font = FONTS.find((f) => f.id === theme.font)
    // Re-fit hero text once the newly chosen typeface has loaded.
    document.fonts.load(`800 40px ${font.family}`).finally(onChange)
  }

  const btn = el('button', 'theme-btn')
  btn.type = 'button'
  btn.setAttribute('aria-label', 'Customize colours and font')
  btn.setAttribute('aria-expanded', 'false')
  btn.setAttribute('aria-controls', 'theme-panel')
  btn.append(el('span'))

  const panel = el('div', 'theme-panel')
  panel.id = 'theme-panel'
  panel.setAttribute('role', 'dialog')
  panel.setAttribute('aria-label', 'Theme settings')

  const option = (k, item, cls) => {
    const b = el('button', cls)
    b.type = 'button'
    b.dataset.k = k
    b.dataset.v = item.id
    b.title = item.label
    b.setAttribute('aria-label', `${item.label} ${k}`)
    b.addEventListener('click', () => set(k, item.id))
    return b
  }

  const accents = el('div', 'swatches')
  for (const a of ACCENTS) {
    const b = option('accent', a, 'swatch')
    b.style.background = a.color
    accents.append(b)
  }
  const bgs = el('div', 'opts')
  for (const g of BACKGROUNDS) {
    const b = option('bg', g, 'opt')
    const sw = el('i')
    sw.style.background = g.color
    b.append(sw, g.label)
    bgs.append(b)
  }
  const fonts = el('div', 'opts')
  for (const f of FONTS) {
    const b = option('font', f, 'opt')
    b.style.fontFamily = f.family
    b.append(`Aa ${f.label}`)
    fonts.append(b)
  }
  const reset = el('button', 'theme-reset', 'Reset to default')
  reset.type = 'button'
  reset.addEventListener('click', () => { theme = { ...DEFAULTS }; set('font', DEFAULTS.font) })

  panel.append(el('h3', '', 'Accent colour'), accents, el('h3', '', 'Background'), bgs, el('h3', '', 'Typeface'), fonts, reset)
  document.body.append(btn, panel)

  const toggle = (open) => {
    panel.classList.toggle('is-open', open)
    btn.setAttribute('aria-expanded', String(open))
  }
  btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(!panel.classList.contains('is-open')) })
  document.addEventListener('click', (e) => { if (!panel.contains(e.target)) toggle(false) })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false) })

  apply()
}
