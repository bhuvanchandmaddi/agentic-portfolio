import {
  profile, social, about, stats, skillGroups, experience, projects, certifications,
  education, marquee, hero, quote, principles, flagship, systems, personal, contactCopy,
} from './content.js'
import { Builder } from './builder.js'
import { initTheme } from './theme.js'

/* ---------- tiny DOM helpers (no innerHTML, so content is always escaped) ---------- */

function h(tag, props = {}, ...children) {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue
    if (k === 'class') el.className = v
    else if (k === 'b') el.dataset.b = v
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v)
    else el.setAttribute(k, v)
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue
    el.append(c instanceof Node ? c : document.createTextNode(String(c)))
  }
  return el
}

// Turns "a **b** c" into [text, <strong>, text].
function rich(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) =>
    part.startsWith('**') ? h('strong', {}, part.slice(2, -2)) : part,
  )
}

const pad = (n) => String(n).padStart(2, '0')
const initials = (profile.firstName[0] + profile.lastName[0]).toUpperCase()

const ICONS = {
  github: 'M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z',
  linkedin: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
  phone: 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z',
  mail: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z',
}
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('fill', 'currentColor')
  svg.setAttribute('aria-hidden', 'true')
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  p.setAttribute('d', ICONS[name])
  svg.append(p)
  return svg
}

const sectionHead = (label, title, lede) => [
  h('span', { class: 'eyebrow', b: 'type' }, label),
  h('br'),
  h('h2', { class: 'h2', b: 'wipe' }, title),
  lede && h('p', { class: 'lede', b: 'wipe' }, lede),
]

/* ---------- Sections ---------- */

function renderNav() {
  const nav = document.getElementById('nav')
  nav.append(
    h('a', { class: 'nav__brand', href: '#home', b: 'box' },
      h('span', { class: 'nav__logo' }, initials), `${hero.shortName}.`),
    h('nav', { class: 'nav__links', 'aria-label': 'Primary' },
      [['About', 'about'], ['Flagships', 'flagships'], ['Matrix', 'matrix'], ['Journey', 'journey'], ['Contact', 'contact']]
        .map(([label, id]) => h('a', { href: `#${id}`, b: 'type' }, label))),
    h('div', { class: 'nav__status', b: 'box' },
      h('span', { class: 'nav__avail' }, 'Available'),
      h('a', { class: 'nav__dispatch', href: `mailto:${social.email}` }, 'DISPATCH →')),
  )
}

function renderHero() {
  const word = h('h1', { class: 'hero__word', 'aria-label': hero.bigWord },
    h('span', { class: 'hero__word-inner' },
      [...hero.bigWord].map((ch) => h('span', { b: 'box', 'aria-hidden': 'true' }, ch))))
  word.querySelectorAll('span').forEach((s) => (s.style.display = 'inline-block'))

  const pods = (n) => h('div', { class: 'pods' }, Array.from({ length: n }, () => h('i', { class: 'pod' })))
  const cluster = h('div', { class: 'card cluster', b: 'box' },
    h('div', { class: 'cluster__head' },
      h('div', { class: 'cluster__dots' }, h('i'), h('i'), h('i')),
      h('span', {}, 'ctx: ', h('b', {}, 'prod-aks-multizone'))),
    h('div', { class: 'cluster__nodes' },
      ['zone-1', 'zone-2', 'zone-3', 'spot-a', 'spot-b', 'gpu-x'].map((z) =>
        h('div', { class: 'node', b: 'box' },
          h('div', { class: 'node__name' }, z, h('em', {}, 'Ready')), pods(8)))),
    h('div', { class: 'cluster__log', b: 'wipe' },
      h('div', {}, h('span', {}, '✔'), ' argocd sync ', h('b', {}, 'platform-core'), ' → Healthy'),
      h('div', {}, h('span', {}, '✔'), ' karpenter provisioned ', h('b', {}, '3 spot nodes')),
      h('div', {}, h('span', {}, '✔'), ' agent opened PR ', h('b', {}, '#4821 fix(CVE)'))),
  )

  const coreCard = (c, body) => h('div', { class: 'card core', b: 'box' },
    h('div', { class: 'core__top' }, h('span', {}, c.index), h('span', {}, c.status)),
    h('div', { class: 'core__title', b: 'type' }, c.title),
    body)

  const app = document.getElementById('app')
  app.append(h('section', { id: 'home', class: 'hero' },
    h('div', { class: 'wrap' },
      word,
      h('div', { class: 'hero__grid' },
        h('div', {},
          h('span', { class: 'hero__hello', b: 'type' }, hero.greeting), h('br'),
          h('span', { class: 'hero__name', b: 'box' }, `${hero.shortName}.`), h('br'),
          h('span', { class: 'hero__badge', b: 'type' }, hero.badge),
          h('p', { class: 'hero__intro', b: 'wipe' }, rich(hero.intro)),
          h('div', { class: 'hero__ctas' },
            h('a', { class: 'btn btn--ghost', href: '#contact', b: 'box' }, hero.primaryCta, ' →'),
            h('a', { class: 'btn btn--dark', href: '#flagships', b: 'box' }, hero.secondaryCta)),
        ),
        cluster,
        h('div', { class: 'hero__side' },
          coreCard(hero.core, h('div', { class: 'core__field', b: 'type' }, hero.core.typed)),
          coreCard(hero.now, h('p', { class: 'core__text', b: 'wipe' }, hero.now.text)),
          h('div', { class: 'card core', b: 'box' },
            h('div', { class: 'core__top' }, h('span', {}, '03.'), h('span', {}, 'LOCATION')),
            h('div', { class: 'core__title', b: 'type' }, profile.location),
            h('p', { class: 'core__text', b: 'wipe' }, profile.availability)),
        ),
      ),
      h('div', { class: 'hero__stats' },
        hero.heroStats.map((s) => h('div', { b: 'box' },
          h('div', { class: 'stat__v' }, s.value), h('div', { class: 'stat__l' }, s.label)))),
    ),
  ))

  // Pods flicker like a live scheduler.
  const all = [...cluster.querySelectorAll('.pod')]
  all.forEach((p) => p.classList.add(Math.random() > 0.45 ? 'on' : 'warm'))
  setInterval(() => {
    const p = all[(Math.random() * all.length) | 0]
    p.classList.toggle('on')
    p.classList.toggle('warm', !p.classList.contains('on'))
  }, 260)
}

function renderMarquee() {
  const items = [...marquee, ...marquee].map((m) => h('span', {}, m))
  document.getElementById('app').append(
    h('div', { class: 'marquee', b: 'box' }, h('div', { class: 'marquee__track' }, items)))
}

function renderAbout() {
  const facts = [
    ['Role', `${profile.role}`],
    ['Company', profile.company],
    ['Education', `${education.degree.split(',')[0]} · ${education.school}`],
    ['Languages', about.languages.join(' · ')],
  ]
  document.getElementById('app').append(h('section', { id: 'about' },
    h('div', { class: 'wrap' },
      sectionHead('Engineer Profile', 'Background & Philosophy'),
      h('div', { class: 'about__grid' },
        h('div', {},
          about.paragraphs.map((p) => h('p', { class: 'about__p', b: 'wipe' }, p)),
          h('blockquote', { class: 'quote', b: 'wipe' }, `“${quote}”`)),
        h('div', {},
          principles.map((p, i) => h('div', { class: 'principle', b: 'box' },
            h('span', { class: 'principle__i' }, pad(i + 1)),
            h('div', {}, h('div', { class: 'principle__t' }, p.title), h('div', { class: 'principle__d' }, p.text)))),
          h('div', { class: 'facts' },
            facts.map(([k, v]) => h('div', { class: 'card fact', b: 'box' },
              h('div', { class: 'fact__k' }, k), h('div', { class: 'fact__v' }, v))))),
      ),
    ),
  ))
}

function renderFlagship() {
  const detail = h('div', { class: 'stack__detail', b: 'box', 'aria-live': 'polite' })
  const showLayer = (i) => {
    const l = flagship.layers[i]
    detail.replaceChildren(
      h('h4', {}, `${l.id} · ${l.name}`),
      h('p', {}, l.detail),
      h('div', { class: 'chips' }, l.tools.map((t) => h('span', { class: 'chip' }, t))))
    layerBtns.forEach((b, j) => b.classList.toggle('is-active', i === j))
  }
  const layerBtns = flagship.layers.map((l, i) =>
    h('button', { class: 'layer', type: 'button', b: 'type', onclick: () => showLayer(i) }, `${l.id}: ${l.name}`))
  showLayer(0)

  const accents = ['Containers // Delivery', 'Cloud // Autoscaling', 'Observability // Metrics']
  document.getElementById('app').append(h('section', { id: 'flagships' },
    h('div', { class: 'wrap' },
      sectionHead('Architectural Showcase', 'Flagship Deployments',
        'Production-grade platforms running 24/7 across AWS, Azure and Kubernetes — from GitOps delivery to autonomous AI operations.'),
      h('article', { class: 'card flag', b: 'box' },
        h('span', { class: 'tag', b: 'type' }, `◆ ${flagship.tag}`),
        h('span', { class: 'flag__meta' }, flagship.meta),
        h('br'),
        h('h3', { class: 'flag__title', b: 'wipe' }, flagship.title),
        h('p', { class: 'flag__text', b: 'wipe' }, flagship.text),
        h('div', { class: 'flag__stats' },
          flagship.stats.map((s) => h('div', { class: 'fstat', b: 'box' },
            h('div', { class: 'fstat__v' }, s.value), h('div', { class: 'fstat__l' }, s.label)))),
        h('div', { class: 'stack__head', b: 'type' }, '7-Layer Platform Stack'),
        h('div', { class: 'stack__sub' }, 'Click a layer to inspect implementation'),
        h('div', { class: 'stack__layers' }, layerBtns),
        detail,
      ),
      h('div', { class: 'flag__row' },
        projects.slice(0, 3).map((p, i) => h('article', { class: 'card mini', b: 'box' },
          h('span', { class: 'tag', b: 'type' }, accents[i]),
          h('h3', { class: 'mini__title', b: 'wipe' }, p.title),
          h('p', { class: 'mini__text', b: 'wipe' }, p.blurb),
          h('ul', { b: 'wipe' }, p.highlights.map((x) => h('li', {}, x))),
          h('div', { class: 'chips' }, p.tags.slice(0, 3).map((t) => h('span', { class: 'chip', b: 'type' }, t)))))),
    ),
  ))
}

function renderMatrix() {
  const cats = ['All Systems', ...new Set(systems.map((s) => s.category))]
  const cards = systems.map((s, i) => {
    const el = h('article', { class: 'card sys', b: 'box', 'data-cat': s.category },
      h('div', { class: 'sys__top' }, h('span', { class: 'tag' }, s.category), h('span', { class: 'sys__id' }, `#SYS-${pad(i + 1)}`)),
      h('h3', { class: 'sys__title', b: 'wipe' }, s.title),
      h('p', { class: 'sys__text', b: 'wipe' }, s.text),
      h('div', { class: 'chips' }, s.tags.map((t) => h('span', { class: 'chip' }, t))))
    return el
  })
  const filters = cats.map((c, i) => h('button', {
    class: `filter${i === 0 ? ' is-active' : ''}`, type: 'button', b: 'type',
    onclick: (e) => {
      filters.forEach((f) => f.classList.toggle('is-active', f === e.currentTarget))
      cards.forEach((card) => card.classList.toggle('is-hidden', i !== 0 && card.dataset.cat !== c))
    },
  }, i === 0 ? `${c} (${systems.length})` : c))

  document.getElementById('app').append(h('section', { id: 'matrix' },
    h('div', { class: 'wrap' },
      sectionHead('Engineering Index', 'The Systems Matrix',
        'Specialised systems spanning AI-driven automation, GitOps delivery, multi-cloud infrastructure and deep observability.'),
      h('div', { class: 'filters' }, filters),
      h('div', { class: 'matrix' }, cards),
    ),
  ))
}

function renderToolchain() {
  document.getElementById('app').append(h('section', { id: 'stack' },
    h('div', { class: 'wrap' },
      sectionHead('Operating Stack', 'The Toolchain', 'Battle-tested tools I reach for to ship, scale, secure and observe production systems.'),
      h('div', { class: 'tools' },
        skillGroups.map((g) => h('div', { class: 'card tool', b: 'box' },
          h('div', { class: 'tool__head', b: 'type' }, h('span', { class: 'tool__icon' }, g.icon), g.title),
          g.skills.map((s) => h('div', { class: 'bar' },
            h('div', { class: 'bar__row' }, h('span', {}, s.name), h('span', {}, `${s.level}%`)),
            h('div', { class: 'bar__track' }, h('div', { class: 'bar__fill', 'data-fill': s.level }))))))),
    ),
  ))
}

function renderJourney() {
  document.getElementById('app').append(h('section', { id: 'journey' },
    h('div', { class: 'wrap' },
      sectionHead('Career Log', 'Deployment History',
        `${stats[0].value}${stats[0].suffix} years across ${new Set(experience.map((e) => e.company)).size} companies — from intern to platform lead.`),
      h('div', { class: 'log' },
        experience.map((e) => h('div', { class: `job${e.current ? ' is-current' : ''}` },
          h('div', { class: 'job__when', b: 'type' }, e.current ? h('b', {}, 'LIVE') : null, e.period),
          h('span', { class: 'job__dot' }),
          h('article', { class: 'card job__card', b: 'box' },
            h('div', { class: 'job__role', b: 'type' }, e.role),
            h('div', { class: 'job__co' }, h('b', {}, e.company), ` · ${e.location}`),
            h('ul', { b: 'wipe' }, e.points.map((p) => h('li', {}, p))),
            h('div', { class: 'chips' }, e.tags.map((t) => h('span', { class: 'chip' }, t))))))),
    ),
  ))
}

function renderCreds() {
  document.getElementById('app').append(h('section', { id: 'credentials' },
    h('div', { class: 'wrap' },
      sectionHead('Credentials', 'Verified & Certified'),
      h('div', { class: 'creds' },
        certifications.map((c) => h('div', { class: 'card cred', b: 'box' },
          h('div', { class: 'cred__issuer' }, c.issuer),
          h('div', { class: 'cred__name', b: 'wipe' }, c.name),
          h('div', { class: 'cred__note' }, c.note)))),
      h('div', { class: 'card edu', b: 'box' },
        h('div', {}, h('div', { class: 'edu__school', b: 'type' }, education.school), h('div', { class: 'edu__deg' }, education.degree)),
        h('div', { class: 'edu__when' }, education.period, h('br'), education.location)),
    ),
  ))
}

function renderPersonal() {
  document.getElementById('app').append(h('section', { id: 'personal' },
    h('div', { class: 'wrap' },
      sectionHead('Off-Duty', 'Beyond the Terminal'),
      h('div', { class: 'personal' },
        personal.map((p) => h('div', { class: 'card per', b: 'box' },
          h('div', { class: 'per__icon' }, p.icon),
          h('div', { class: 'per__t', b: 'type' }, p.title),
          h('p', { class: 'per__d', b: 'wipe' }, p.text)))),
    ),
  ))
}

function renderContact() {
  const copy = h('button', { class: 'btn btn--red', type: 'button', b: 'box', onclick: async () => {
    try { await navigator.clipboard.writeText(social.email); toast('Email address copied') }
    catch { window.location.href = `mailto:${social.email}` }
  } }, '⧉ Copy Email Address')

  document.getElementById('app').append(h('section', { id: 'contact', class: 'contact' },
    h('div', { class: 'wrap' },
      h('span', { class: 'eyebrow', b: 'type' }, contactCopy.label),
      h('h2', { class: 'contact__title' },
        h('span', { b: 'wipe' }, contactCopy.titleTop), h('br'), h('span', { b: 'wipe' }, contactCopy.titleBottom)),
      h('p', { class: 'contact__text', b: 'wipe' }, contactCopy.text),
      h('div', { class: 'contact__mail' }, h('a', { class: 'contact__addr', href: `mailto:${social.email}`, b: 'type' }, social.email), copy),
      h('div', { class: 'socials' },
        h('a', { class: 'social', href: social.github, target: '_blank', rel: 'noopener noreferrer', b: 'box' }, icon('github'), social.github.replace('https://', '')),
        h('a', { class: 'social', href: social.linkedin, target: '_blank', rel: 'noopener noreferrer', b: 'box' }, icon('linkedin'), 'linkedin.com/in/bhuvanchand-maddi'),
        h('a', { class: 'social', href: `tel:${social.phone.replace(/\s/g, '')}`, b: 'box' }, icon('phone'), social.phone)),
      h('p', { class: 'footer', b: 'wipe' },
        `© ${new Date().getFullYear()} ${profile.name}. Designed in Noir & Crimson.`, h('br'),
        'Built from first principles — assembled live by a swarm of agents.'),
    ),
  ))
}

let toastTimer
function toast(msg) {
  let t = document.querySelector('.toast')
  if (!t) document.body.append((t = h('div', { class: 'toast', role: 'status' })))
  t.textContent = msg
  t.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => t.classList.remove('show'), 1800)
}

function fillBars(root = document) {
  root.querySelectorAll('.bar__fill').forEach((b) => (b.style.width = `${b.dataset.fill}%`))
}

// Scale the giant word and the name block so they always sit on one line.
function fitHero() {
  const word = document.querySelector('.hero__word')
  const inner = word.firstElementChild
  word.style.fontSize = '100px'
  const wordSize = (100 * word.clientWidth) / inner.offsetWidth
  word.style.fontSize = `${Math.min(300, Math.floor(wordSize * 0.97))}px`

  const name = document.querySelector('.hero__name')
  const pad = 36
  name.style.fontSize = '100px'
  const nameSize = (100 * (name.parentElement.clientWidth - pad)) / (name.offsetWidth - pad)
  name.style.fontSize = `${Math.max(26, Math.min(76, Math.floor(nameSize * 0.97)))}px`
}

/* ---------- Boot ---------- */
renderNav()
renderHero()
renderMarquee()
renderAbout()
renderFlagship()
renderMatrix()
renderToolchain()
renderJourney()
renderCreds()
renderPersonal()
renderContact()

const builder = new Builder({
  layer: document.getElementById('agent-layer'),
  dock: document.getElementById('dock'),
  onReveal: (el) => fillBars(el),
  onFinish: () => fillBars(),
})

// Wait for fonts so selection boxes match final glyph metrics.
document.fonts.ready.then(() => {
  fitHero()
  builder.start()
})

initTheme({ onChange: fitHero })

let resizeTimer
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(fitHero, 120)
})
