/**
 * Builder — a swarm of cursor "agents" that assemble the page layer by layer.
 * Each element tagged with data-b="box|type|wipe" becomes a layer: an agent flies to it,
 * drags a Figma-style selection box with a W × H label, then reveals / types / sweeps it in.
 */

const COLORS = ['#ffb3c7', '#b8f5d0', '#fff3a3', '#cdb8ff', '#a8dcff', '#ffcfa8', '#9ff0ec', '#f7b0ff', '#d2ff9e', '#ffd6e0']
const START_AGENTS = 18
const MAX_AGENTS = 28
const SPEEDS = [1, 2, 4]
const ARROW = 'M3 2 L3 18 L7.6 13.8 L10.6 20.4 L13.4 19.2 L10.4 12.8 L16.4 12.8 Z'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const lerp = (a, b, t) => a + (b - a) * t
const rand = (a, b) => a + Math.random() * (b - a)

function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag)
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  return el
}

export class Builder {
  constructor({ layer, dock, onReveal = () => {}, onFinish = () => {} }) {
    this.layer = layer
    this.dockEl = dock
    this.onReveal = onReveal
    this.onFinish = onFinish
    this.tweens = new Set()
    this.agents = []
    this.tasks = []
    this.gen = 0
    this.speedIdx = 0
    this.touring = true
    this.sound = false
    this.state = 'idle'
    this.last = 0
    this.tick = this.tick.bind(this)
    this.stopTouring = this.stopTouring.bind(this)
    this.renderDock()
  }

  get speed() { return SPEEDS[this.speedIdx] }

  /* ---------------- lifecycle ---------------- */

  start() {
    const els = [...document.querySelectorAll('[data-b]')]
    const byEl = new Map()
    this.tasks = els.map((el, i) => {
      const t = { el, mode: el.dataset.b, i, state: 'pending', parent: null }
      byEl.set(el, t)
      return t
    })
    for (const t of this.tasks) {
      const p = t.el.parentElement?.closest('[data-b]')
      t.parent = p ? byEl.get(p) : null
      t.el.classList.remove('b-reveal')
      t.el.classList.add('b-pending')
    }
    this.done = 0
    this.working = 0
    this.elapsed = 0
    this.state = 'building'
    document.body.classList.add('is-building')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.finish(true)
      return
    }

    window.scrollTo(0, 0)
    this.scrollPos = 0
    this.touring = true
    this.spawnTimer = 0
    this.layer.replaceChildren()
    this.agents = []
    // Smaller screens get a smaller swarm so content stays readable.
    const small = window.innerWidth < 700
    this.maxAgents = small ? 14 : MAX_AGENTS
    this.pace = small ? 2 : 1
    for (let i = 0; i < (small ? 9 : START_AGENTS); i++) this.spawnAgent()

    ;['wheel', 'touchmove'].forEach((e) => window.addEventListener(e, this.stopTouring, { passive: true }))
    window.addEventListener('keydown', this.stopTouring)

    this.renderDock()
    this.ensureLoop()
  }

  ensureLoop() {
    if (this.looping) return
    this.looping = true
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  replay() {
    this.abort()
    this.start()
  }

  skip() {
    if (this.state !== 'building') return
    this.abort()
    for (const t of this.tasks) this.revealNow(t)
    this.finish()
  }

  // Cancels every running agent loop and pending tween.
  abort() {
    this.gen++
    for (const tw of this.tweens) tw.resolve()
    this.tweens.clear()
    this.layer.querySelectorAll('.sel, .ibeam').forEach((n) => n.remove())
    for (const t of this.tasks) {
      if (t.chars) this.restoreChars(t)
      t.el.classList.remove('b-wiping')
      t.el.style.removeProperty('clip-path')
    }
  }

  finish(instant = false) {
    this.state = 'done'
    document.body.classList.remove('is-building')
    ;['wheel', 'touchmove'].forEach((e) => window.removeEventListener(e, this.stopTouring))
    window.removeEventListener('keydown', this.stopTouring)
    for (const t of this.tasks) this.revealNow(t)
    // Stop idle agent loops so the exit flight owns every cursor.
    this.gen++
    for (const tw of this.tweens) tw.resolve()
    this.tweens.clear()
    this.onFinish()
    this.renderDock()
    if (instant) { this.layer.replaceChildren(); return }
    this.layer.querySelectorAll('.sel, .ibeam').forEach((n) => n.remove())
    this.agents.forEach((a) => (a.el.style.opacity = ''))
    this.swarmExit()
  }

  stopTouring(e) {
    if (e?.type === 'keydown' && !['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) return
    if (!this.touring) return
    this.touring = false
    this.renderDock()
  }

  /* ---------------- frame loop ---------------- */

  tick(now) {
    const dt = Math.min(50, now - this.last)
    this.last = now
    const sdt = dt * this.speed * (this.pace || 1)

    for (const tw of [...this.tweens]) {
      tw.t += sdt
      const p = Math.min(1, tw.t / tw.ms)
      tw.update(p)
      if (p >= 1) { this.tweens.delete(tw); tw.resolve() }
    }

    if (this.state === 'building') {
      this.elapsed += dt
      this.spawnTimer += sdt
      if (this.agents.length < this.maxAgents && this.spawnTimer > 1300) {
        this.spawnTimer = 0
        this.spawnAgent()
        this.renderDock()
      }
      if (this.touring) this.autoScroll(dt)
      if (this.done >= this.tasks.length) this.finish()
    }

    if (this.state === 'building' || this.tweens.size) this.raf = requestAnimationFrame(this.tick)
    else this.looping = false
  }

  // Keep the next unclaimed layer just below mid-screen, like a camera touring the build.
  autoScroll(dt) {
    const anchor = this.tasks.find((t) => t.state === 'pending' && !this.isFixed(t.el))
    if (!anchor) return
    const vh = window.innerHeight
    const max = document.documentElement.scrollHeight - vh
    const rect = anchor.el.getBoundingClientRect()
    const top = rect.top + window.scrollY
    // If the visitor scrolled past unbuilt layers, head back up to them.
    const behind = rect.bottom < 0
    let desired = clamp(top - vh * (behind ? 0.3 : 0.6), 0, max)
    // Never scroll layers that are still being built up under the nav.
    const busy = this.tasks.find((t) => t.state === 'claimed' && !this.isFixed(t.el))
    if (busy && !behind) desired = Math.min(desired, busy.el.getBoundingClientRect().top + window.scrollY - vh * 0.14)
    if (this.scrollPos == null || Math.abs(window.scrollY - this.scrollPos) > 2) this.scrollPos = window.scrollY
    if (!behind && desired <= this.scrollPos) return
    const k = 1 - Math.exp(-(dt / 1000) * 2.2 * Math.sqrt(this.speed))
    const cap = 18 * this.speed
    const step = clamp((desired - this.scrollPos) * k, -cap * 3, cap)
    this.scrollPos += step
    window.scrollTo(0, this.scrollPos)
  }

  isFixed(el) {
    return !!el.closest('.nav')
  }

  tween(ms, update = () => {}) {
    return new Promise((resolve) => {
      this.tweens.add({ t: 0, ms: Math.max(1, ms), update, resolve })
      this.ensureLoop()
    })
  }

  /* ---------------- agents ---------------- */

  spawnAgent() {
    const color = COLORS[this.agents.length % COLORS.length]
    const el = document.createElement('div')
    el.className = 'agent'
    const svg = svgEl('svg', { viewBox: '0 0 20 22' })
    svg.append(svgEl('path', { d: ARROW, fill: color, stroke: '#0b0b0b', 'stroke-width': '1.3', 'stroke-linejoin': 'round' }))
    el.append(svg)
    this.layer.append(el)

    const vw = window.innerWidth, vh = window.innerHeight
    const edge = Math.floor(Math.random() * 4)
    const x = edge === 0 ? -30 : edge === 1 ? vw + 30 : rand(0, vw)
    const y = edge === 2 ? -30 : edge === 3 ? vh + 30 : rand(0, vh)
    const agent = { el, color, x, y }
    this.place(agent, x, y)
    this.agents.push(agent)
    this.runAgent(agent, this.gen)
  }

  place(agent, x, y) {
    agent.x = x
    agent.y = y
    agent.el.style.transform = `translate(${x - 3}px, ${y - 2}px)`
  }

  async runAgent(agent, gen) {
    await this.wander(agent)
    while (gen === this.gen && this.state === 'building') {
      // Only part of the swarm builds at once; the rest hover like in a live session.
      const task = this.working < Math.round(this.agents.length * (this.maxAgents < MAX_AGENTS ? 0.65 : 0.6)) ? this.pick() : null
      if (task) {
        this.working++
        await this.perform(agent, task, gen)
        if (gen === this.gen) this.working--
      } else await this.wander(agent)
    }
  }

  pick() {
    const vh = window.innerHeight
    for (const t of this.tasks) {
      if (t.state !== 'pending') continue
      if (t.parent && t.parent.state !== 'done') continue
      const r = t.el.getBoundingClientRect()
      if (!r.width && !r.height) { this.revealNow(t); continue }
      if (r.top < vh * 0.94 && r.bottom > 0) { t.state = 'claimed'; return t }
    }
    return null
  }

  async wander(agent) {
    const vw = window.innerWidth, vh = window.innerHeight
    const sx = agent.x, sy = agent.y
    const tx = clamp(sx + rand(-260, 260), 30, vw - 30)
    const ty = clamp(sy + rand(-200, 200), 70, vh - 80)
    await this.tween(rand(600, 1200), (p) => {
      const e = easeInOut(p)
      this.place(agent, lerp(sx, tx, e), lerp(sy, ty, e))
    })
  }

  async perform(agent, task, gen) {
    const el = task.el
    const rect = () => el.getBoundingClientRect()

    // 1 — fly to the layer's top-left corner (target is live, so scrolling is tracked)
    const sx = agent.x, sy = agent.y
    const r0 = rect()
    const dist = Math.hypot(r0.left - sx, r0.top - sy)
    await this.tween(clamp(400 + dist * 0.55, 450, 1100), (p) => {
      const r = rect(), e = easeInOut(p)
      this.place(agent, lerp(sx, r.left, e), lerp(sy, r.top, e))
    })
    if (gen !== this.gen) return

    // 2 — drag the selection box to full size
    const sel = document.createElement('div')
    sel.className = 'sel'
    sel.append(document.createElement('i'), document.createElement('i'), document.createElement('i'), document.createElement('i'), document.createElement('b'))
    const label = sel.querySelector('b')
    this.layer.append(sel)
    const fit = (wf, hf) => {
      const r = rect()
      const w = Math.max(2, r.width * wf), hh = Math.max(2, r.height * hf)
      sel.style.transform = `translate(${r.left}px, ${r.top}px)`
      sel.style.width = `${w}px`
      sel.style.height = `${hh}px`
      label.textContent = `${Math.round(w)} × ${Math.round(hh)}`
      return { r, w, h: hh }
    }
    const area = Math.sqrt(r0.width * r0.height)
    await this.tween(clamp(320 + area * 0.9, 380, 900), (p) => {
      const e = easeOut(p)
      const { r, w, h } = fit(e, e)
      this.place(agent, r.left + w, r.top + h)
    })
    if (gen !== this.gen) { sel.remove(); return }

    // 3 — reveal the content
    el.classList.remove('b-pending')
    if (task.mode === 'type') await this.typeIn(agent, task, sel, fit, gen)
    else if (task.mode === 'wipe') await this.wipeIn(agent, task, sel, fit, gen)
    else {
      sel.classList.add('is-filled')
      el.classList.add('b-reveal')
      await this.tween(360, () => fit(1, 1))
    }
    if (gen !== this.gen) { sel.remove(); return }

    // 4 — release the selection
    this.complete(task)
    sel.classList.add('is-fading')
    this.tween(380, () => fit(1, 1)).then(() => sel.remove())
  }

  makeIbeam(agent) {
    const ib = document.createElement('div')
    ib.className = 'ibeam'
    ib.append(document.createElement('span'))
    this.layer.append(ib)
    agent.el.style.opacity = '0'
    return ib
  }

  dropIbeam(agent, ib) {
    ib.remove()
    agent.el.style.opacity = ''
  }

  async typeIn(agent, task, sel, fit, gen) {
    const spans = this.splitChars(task)
    const ib = this.makeIbeam(agent)
    const n = spans.length
    const ms = clamp(n * 40, 300, 1700)
    let shown = 0
    await this.tween(ms, (p) => {
      fit(1, 1)
      const target = Math.ceil(p * n)
      while (shown < target) spans[shown++].style.opacity = '1'
      const s = spans[Math.max(0, shown - 1)]
      if (!s) return
      const r = s.getBoundingClientRect()
      const h = clamp(r.height * 0.9, 12, 60)
      ib.style.height = `${h}px`
      ib.style.transform = `translate(${r.right + 1}px, ${r.top + (r.height - h) / 2}px)`
      this.place(agent, r.right, r.bottom)
    })
    this.dropIbeam(agent, ib)
    if (gen === this.gen) this.restoreChars(task)
  }

  async wipeIn(agent, task, sel, fit, gen) {
    const el = task.el
    el.style.clipPath = 'inset(0 100% 100% 0)'
    const cs = getComputedStyle(el)
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5
    const r0 = el.getBoundingClientRect()
    const lines = Math.max(1, Math.round(r0.height / lh))
    const ib = this.makeIbeam(agent)
    ib.style.height = `${clamp(lh * 0.85, 12, 70)}px`
    el.classList.add('b-wiping')
    const W = r0.width, H = r0.height
    await this.tween(clamp(lines * 300, 500, 1800), (p) => {
      fit(1, 1)
      const pos = p * lines
      const L = Math.min(lines - 1, Math.floor(pos))
      const x = (pos - L) * W
      const y0 = (L * H) / lines
      const y1 = ((L + 1) * H) / lines + 3
      el.style.clipPath = p >= 1
        ? 'none'
        : `polygon(-6px -6px, ${W + 6}px -6px, ${W + 6}px ${y0}px, ${x}px ${y0}px, ${x}px ${y1}px, -6px ${y1}px)`
      const r = el.getBoundingClientRect()
      ib.style.transform = `translate(${r.left + x}px, ${r.top + y0 + 2}px)`
      this.place(agent, r.left + x, r.top + y1)
    })
    this.dropIbeam(agent, ib)
    el.classList.remove('b-wiping')
    el.style.removeProperty('clip-path')
  }

  // Wrap every character in a span so typing never shifts layout.
  splitChars(task) {
    const walker = document.createTreeWalker(task.el, NodeFilter.SHOW_TEXT)
    const nodes = []
    while (walker.nextNode()) nodes.push(walker.currentNode)
    task.chars = []
    const spans = []
    for (const node of nodes) {
      const frag = document.createDocumentFragment()
      const group = []
      for (const ch of node.data) {
        const s = document.createElement('span')
        s.textContent = ch
        s.style.opacity = '0'
        frag.append(s)
        group.push(s)
        spans.push(s)
      }
      if (!group.length) continue
      task.chars.push({ node, group })
      node.replaceWith(frag)
    }
    return spans
  }

  restoreChars(task) {
    for (const { node, group } of task.chars || []) {
      if (!group[0].parentNode) continue
      group[0].before(node)
      group.forEach((s) => s.remove())
    }
    task.chars = null
  }

  revealNow(t) {
    if (t.state === 'done') return
    t.el.classList.remove('b-pending')
    this.complete(t)
  }

  complete(t) {
    if (t.state === 'done') return
    t.state = 'done'
    this.done++
    this.onReveal(t.el)
    this.blip()
    this.updateProgress()
  }

  // Agents fly off together in a curved formation once the site is live.
  swarmExit() {
    const vw = window.innerWidth, vh = window.innerHeight
    this.agents.forEach((a, i) => {
      const sx = a.x, sy = a.y
      const cx = vw * 0.88 + rand(-30, 30), cy = vh * 0.45 + (i - this.agents.length / 2) * 9
      const tx = vw + 60, ty = -60 - i * 6
      this.tween(i * 45).then(() => this.tween(1500, (p) => {
        const e = easeInOut(p)
        const x = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * cx + e * e * tx
        const y = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * cy + e * e * ty
        this.place(a, x, y)
      })).then(() => a.el.remove())
    })
  }

  /* ---------------- sound ---------------- */

  blip() {
    if (!this.sound || !this.audio || this.state !== 'building') return
    const ctx = this.audio
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.frequency.value = rand(1400, 2400)
    g.gain.setValueAtTime(0.025, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.05)
  }

  toggleSound() {
    this.sound = !this.sound
    if (this.sound && !this.audio) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (Ctx) this.audio = new Ctx()
    }
    this.renderDock()
  }

  /* ---------------- dock ---------------- */

  btn(label, onClick, cls = '', title = '') {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = `dock__btn ${cls}`.trim()
    if (title) { b.title = title; b.setAttribute('aria-label', title) }
    if (label instanceof Node) b.append(label)
    else b.textContent = label
    b.addEventListener('click', onClick)
    return b
  }

  soundIcon() {
    const svg = svgEl('svg', { viewBox: '0 0 24 24', width: '14', height: '14', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' })
    svg.append(svgEl('path', { d: 'M4 9h4l5-4v14l-5-4H4z', fill: 'currentColor', stroke: 'none' }))
    svg.append(svgEl('path', { d: this.sound ? 'M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12' : 'M17 9l5 6M22 9l-5 6' }))
    return svg
  }

  text(...parts) {
    const s = document.createElement('span')
    for (const p of parts) {
      if (typeof p === 'object') { const b = document.createElement('b'); b.textContent = p.b; if (p.id) b.id = p.id; s.append(b) }
      else s.append(p)
    }
    return s
  }

  renderDock() {
    const d = this.dockEl
    d.className = 'dock'
    d.replaceChildren()
    const x = document.createElement('button')
    x.type = 'button'
    x.className = 'dock__x'
    x.textContent = '×'

    if (this.state === 'live') {
      d.classList.add('dock--mini')
      d.append(this.btn('↻ Replay build', () => this.replay(), '', 'Replay the agent build'))
      return
    }

    const bar = document.createElement('div')
    bar.className = 'dock__bar'
    bar.append(document.createElement('i'))
    this.barFill = bar.firstChild

    if (this.state === 'done') {
      const secs = (this.elapsed / 1000).toFixed(1)
      d.append(this.text('Rebuilt by ', { b: String(this.agents.length || MAX_AGENTS) }, ' agents in ', { b: `${secs}s` }), bar,
        this.btn(this.soundIcon(), () => this.toggleSound(), 'dock__sound', 'Toggle sound'),
        this.btn('Go live', () => this.goLive(), 'dock__btn--blue'),
        this.btn('Replay', () => this.replay()))
      x.title = 'Close'
      x.setAttribute('aria-label', 'Close')
      x.addEventListener('click', () => this.goLive())
      d.append(x)
      this.barFill.style.width = '100%'
      return
    }

    const av = document.createElement('div')
    av.className = 'dock__avatars'
    COLORS.slice(0, 5).forEach((c) => { const i = document.createElement('i'); i.style.background = c; av.append(i) })
    d.append(av,
      this.text({ b: String(this.agents.length) }, ' agents'),
      this.text({ b: String(this.done || 0), id: 'dock-done' }, ` / ${this.tasks.length || '—'} layers`),
      bar,
      this.btn(this.touring ? 'Touring' : 'Tour', () => { this.touring = !this.touring; this.scrollPos = window.scrollY; this.renderDock() }, this.touring ? 'is-on' : '', 'Auto-scroll with the build'),
      this.btn(`${this.speed}x`, () => { this.speedIdx = (this.speedIdx + 1) % SPEEDS.length; this.renderDock() }, '', 'Build speed'),
      this.btn(this.soundIcon(), () => this.toggleSound(), 'dock__sound', 'Toggle sound'))
    x.title = 'Skip build'
    x.setAttribute('aria-label', 'Skip build')
    x.addEventListener('click', () => this.skip())
    d.append(x)
    this.updateProgress()
  }

  updateProgress() {
    const n = document.getElementById('dock-done')
    if (n) n.textContent = String(this.done)
    if (this.barFill && this.tasks.length) this.barFill.style.width = `${(this.done / this.tasks.length) * 100}%`
  }

  goLive() {
    this.state = 'live'
    this.layer.replaceChildren()
    this.renderDock()
  }
}
