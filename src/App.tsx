import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Copy, Menu, Moon, Plus, Sun, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { contact, publications, skills, type Publication } from './portfolio'
import OpeningSequence from './OpeningSequence'
import AnimatedSignature from './AnimatedSignature'
import { switchTheme, useTheme } from './theme'

const ease = [0.22, 1, 0.36, 1] as const
const nav = [
  { label: 'Work', id: 'work' },
  { label: 'Research', id: 'publications' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
]
const observedSections = ['home', ...nav.map(item => item.id)]
const profiles = [
  { label: 'GitHub', href: contact.github },
  { label: 'LinkedIn', href: contact.linkedin },
  { label: 'LeetCode', href: 'https://leetcode.com/u/ash-rafhamid' },
]

function Reveal({ children, className, delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' }) {
  const reduced = useReducedMotion()
  const Tag = as === 'li' ? motion.li : motion.div
  return <Tag className={className} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.75, delay, ease }}>{children}</Tag>
}

const arrows = { 'up-right': ArrowUpRight, down: ArrowDown, up: ArrowUp }

/** Two copies of the arrow: on hover the first leaves in its direction and the second takes its place. */
function Arrow({ dir = 'up-right', size = 16 }: { dir?: keyof typeof arrows; size?: number }) {
  const Icon = arrows[dir]
  return <span className="swap-icon" data-dir={dir} aria-hidden="true"><Icon size={size} /><Icon size={size} /></span>
}

function MetaList({ items, label, className }: { items: string[]; label?: string; className?: string }) {
  return <ul className={`meta-list${className ? ` ${className}` : ''}`} aria-label={label}>{items.map(item => <li key={item}>{item}</li>)}</ul>
}

function useCopy(text: string) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const reset = useRef<number | null>(null)
  useEffect(() => () => { if (reset.current !== null) window.clearTimeout(reset.current) }, [])
  async function copy() {
    try { await navigator.clipboard.writeText(text); setState('copied') }
    catch { setState('failed') }
    if (reset.current !== null) window.clearTimeout(reset.current)
    reset.current = window.setTimeout(() => setState('idle'), 2500)
  }
  return [state, copy] as const
}

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
    }, { rootMargin: '-45% 0px -50% 0px' })
    observedSections.forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section) })
    return () => observer.disconnect()
  }, [])
  return active
}

function ThemeToggle() {
  const theme = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return <button type="button" className="icon-button theme-toggle" onClick={() => switchTheme(next)} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`}>
    <Sun className="icon-sun" size={16} aria-hidden="true" />
    <Moon className="icon-moon" size={16} aria-hidden="true" />
  </button>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection()
  const toggle = useRef<HTMLButtonElement>(null)
  const navigation = useRef<HTMLElement>(null)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    navigation.current?.querySelector('a')?.focus()
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return
      const links = Array.from(navigation.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])
      if (!event.shiftKey && document.activeElement === links[links.length - 1]) { event.preventDefault(); toggle.current?.focus() }
      else if (event.shiftKey && document.activeElement === toggle.current) { event.preventDefault(); links[links.length - 1]?.focus() }
    }
    window.addEventListener('keydown', close)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', close); toggle.current?.focus() }
  }, [open])
  return <header className={`site-header${scrolled || open ? ' is-raised' : ''}`}>
    <div className="header-inner container">
      <AnimatedSignature />
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(item => <a href={`#${item.id}`} key={item.id} aria-current={active === item.id ? 'location' : undefined}>{item.label}</a>)}</nav>
      <div className="header-tools">
        <ThemeToggle />
        <button ref={toggle} className="icon-button menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </div>
    <AnimatePresence>{open && <motion.nav ref={navigation} id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease }}>
      <div className="container">
        {nav.map(item => <a href={`#${item.id}`} key={item.id} onClick={() => setOpen(false)}>{item.label}<ArrowUpRight size={20} aria-hidden="true" /></a>)}
        <p>Dhaka, Bangladesh</p>
      </div>
    </motion.nav>}</AnimatePresence>
  </header>
}

function Words({ text, offset = 0 }: { text: string; offset?: number }) {
  const reduced = useReducedMotion()
  return text.split(' ').map((word, index) => <span key={index}>
    {index > 0 && ' '}
    <motion.span className="word" initial={reduced ? false : { opacity: 0, y: '0.4em' }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 + (offset + index) * 0.04, ease }}>{word}</motion.span>
  </span>)
}

const highlights = [
  { meta: 'ICML 2026 · Workshop paper', title: 'FD-Loss: supervised feature decorrelation as a replacement for random dropout', href: 'https://icml.cc/virtual/2026/80194' },
  { meta: 'Journal article · 2026', title: 'Explainable ensemble learning for predicting IVIG resistance in Kawasaki disease', href: 'https://doi.org/10.1016/j.meadig.2026.100056' },
  { meta: 'Open source · npm', title: 'Ternyx, a model-agnostic coding agent for the terminal', href: 'https://www.npmjs.com/package/ternyx-agent' },
]

function Hero() {
  return <section className="hero container" id="home" aria-labelledby="hero-title">
    <Reveal><p className="label">Software engineer & machine learning researcher</p></Reveal>
    <h1 id="hero-title" className="hero-title">
      <span className="hero-line"><Words text="I turn ideas into software" /></span>
      <span className="hero-line"><Words text="and questions into research." offset={5} /></span>
    </h1>
    <div className="hero-bottom">
      <Reveal delay={0.4}><p className="hero-lede">I’m <strong>Ashraf Hamid Mojumder</strong>, a Computer Science and Engineering student in Dhaka. I build developer tools, and I research how machine learning models behave, where they fail, and how to explain the difference.</p></Reveal>
      <Reveal className="hero-actions" delay={0.48}>
        <a className="button button-primary" href="#work">View my work <Arrow dir="down" /></a>
        <a className="text-link" href="#publications">Read my research <Arrow dir="down" /></a>
      </Reveal>
    </div>
    <Reveal delay={0.56}>
      <ul className="highlights" aria-label="Recent highlights">{highlights.map(item => <li key={item.href}>
        <a className="highlight" href={item.href} target="_blank" rel="noreferrer">
          <span className="highlight-meta">{item.meta}</span>
          <span className="highlight-title">{item.title}</span>
          <Arrow size={17} />
        </a>
      </li>)}</ul>
    </Reveal>
  </section>
}

function SectionHead({ label, id, title, note }: { label: string; id: string; title: ReactNode; note?: string }) {
  return <Reveal className="section-head">
    <p className="label">{label}</p>
    <h2 id={id}>{title}</h2>
    {note && <p className="section-note">{note}</p>}
  </Reveal>
}

const terminalLines: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.32, delayChildren: 0.25 } } }
const terminalLine: Variants = { hidden: { opacity: 0, y: 6 }, shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }
const ternyxSteps = [
  { tool: 'read_file', target: 'server.js', note: 'context' },
  { tool: 'edit_file', target: 'server.js', note: 'focused edit' },
  { tool: 'run_command', target: 'node test.js', note: 'approved' },
]

function TernyxTerminal() {
  const reduced = useReducedMotion()
  return <figure className="terminal">
    <div className="terminal-bar" aria-hidden="true"><span className="terminal-dots"><i /><i /><i /></span><span>~/my-api — ternyx</span></div>
    <motion.ol className="terminal-body" variants={terminalLines} initial={reduced ? false : 'hidden'} whileInView="shown" viewport={{ once: true, amount: 0.4 }}>
      <motion.li variants={terminalLine}><span className="term-prompt">ternyx ›</span> Add error handling to server.js</motion.li>
      <motion.li variants={terminalLine} className="term-plan"><span className="term-muted">plan</span> Inspect the route handlers, then edit and verify.</motion.li>
      {ternyxSteps.map(step => <motion.li variants={terminalLine} className="term-step" key={step.tool}>
        <Check size={14} className="term-ok" aria-hidden="true" /><span className="term-tool">{step.tool}</span><span className="term-target">{step.target}</span><span className="term-muted term-note">{step.note}</span>
      </motion.li>)}
      <motion.li variants={terminalLine} className="term-done">Done. Changes are ready for your review.<span className="caret" aria-hidden="true" /></motion.li>
    </motion.ol>
    <figcaption>Example session</figcaption>
  </figure>
}

function TernyxFeature() {
  const command = 'npm install -g ternyx-agent'
  const [state, copy] = useCopy(command)
  return <Reveal>
    <article className="feature-card" aria-labelledby="ternyx-title">
      <div className="feature-copy">
        <MetaList items={['Featured project', 'AI coding agent', 'v0.4.0', 'MIT']} />
        <h3 id="ternyx-title">Ternyx</h3>
        <p className="feature-tagline">An open, model-agnostic coding agent for your terminal.</p>
        <p className="feature-text">Ternyx explores a repository, plans before it edits, makes focused changes and runs checks, using whichever local or cloud model you choose.</p>
        <ul className="feature-list" aria-label="Capabilities">{['Read-only planning mode', 'Workspace-scoped file tools', 'Resumable sessions', 'Built-in MCP server', 'Local or cloud models', 'No runtime dependencies'].map(item => <li key={item}>{item}</li>)}</ul>
        <div className="feature-actions">
          <button type="button" className="install" onClick={copy} aria-label={`Copy install command: ${command}`}>
            <code><span aria-hidden="true">$</span>{command}</code>
            {state === 'copied' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
          </button>
          <span className="visually-hidden" aria-live="polite">{state === 'copied' ? 'Install command copied' : state === 'failed' ? 'Copy failed' : ''}</span>
          <a className="text-link" href="https://www.npmjs.com/package/ternyx-agent" target="_blank" rel="noreferrer">View on npm <Arrow /></a>
        </div>
        <MetaList className="stack" label="Built with" items={['JavaScript', 'Node.js 20+', 'LLM tool calling', 'MCP']} />
      </div>
      <TernyxTerminal />
    </article>
  </Reveal>
}

function CrashLensIllustration() {
  const bars = [3, 5, 4, 6, 4, 7, 5, 9, 6, 12, 8, 6, 5, 4]
  return <div className="crash">
    <div className="crash-bar"><span className="crash-logo" />crashlens<span className="crash-path">/ issues</span><span className="crash-label">Illustration</span></div>
    <div className="crash-main">
      <div className="crash-summary">
        <div><span>Unresolved</span><strong>3</strong></div>
        <div className="crash-chart">{bars.map((height, index) => <i key={index} style={{ height: `${height * 7}%` }} />)}</div>
      </div>
      <ul className="crash-issues">
        <li><span className="severity is-high" /><div><strong>TypeError</strong><span>Cannot read properties of undefined</span></div><code>checkout.tsx:42</code></li>
        <li><span className="severity" /><div><strong>ReferenceError</strong><span>user is not defined</span></div><code>profile.tsx:18</code></li>
        <li><span className="severity is-low" /><div><strong>Unhandled rejection</strong><span>Failed to fetch /api/orders</span></div><code>orders.ts:77</code></li>
      </ul>
    </div>
  </div>
}

type ProjectLink = { label: string; href: string }

function ProjectCard({ category, name, tagline, description, tags, links, media, delay = 0 }: { category: string; name: string; tagline: string; description: string; tags: string[]; links: ProjectLink[]; media: ReactNode; delay?: number }) {
  const titleId = `${name.toLowerCase().replace(/\s/g, '-')}-title`
  return <Reveal className="project-card" delay={delay}>
    <article aria-labelledby={titleId}>
      <a className="project-media" href={links[0].href} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">{media}</a>
      <div className="project-body">
        <p className="project-category">{category}</p>
        <h3 id={titleId}>{name}</h3>
        <p className="project-tagline">{tagline}</p>
        <p className="project-description">{description}</p>
        <MetaList label="Built with" items={tags} />
        <div className="project-links">{links.map(link => <a className="text-link" href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} <Arrow /></a>)}</div>
      </div>
    </article>
  </Reveal>
}

function Work() {
  return <section id="work" className="section container" aria-labelledby="work-title">
    <SectionHead label="Selected work" id="work-title" title="Tools I’ve designed, built and shipped." note="Three projects with one shared idea: take something complicated and make it feel simple." />
    <TernyxFeature />
    <div className="project-grid">
      <ProjectCard
        category="Browser extension"
        name="Context Bridge"
        tagline="Keep the conversation. Carry the context."
        description="A privacy-first Chrome extension that exports your visible AI conversations to Markdown, JSON or plain text. Everything happens locally, with no accounts, tracking or uploads."
        tags={['JavaScript', 'Chrome extension', 'Privacy']}
        links={[{ label: 'View on GitHub', href: 'https://github.com/ash-rafhamid/contextbridge-extension' }]}
        media={<img className="shot" src="/projects/contextbridge.png" alt="" loading="lazy" width="1280" height="800" />}
      />
      <ProjectCard
        category="Developer tool"
        name="CrashLens"
        tagline="Every error has a story."
        description="A self-hosted browser error monitor. An SDK, an API and a dashboard bring exceptions, breadcrumbs and context together in one debugging workflow."
        tags={['TypeScript', 'Next.js', 'PostgreSQL']}
        links={[{ label: 'Live demo', href: 'https://crashlens-dashboard-six.vercel.app' }, { label: 'Source code', href: 'https://github.com/ash-rafhamid/crashlens' }]}
        media={<CrashLensIllustration />}
        delay={0.08}
      />
    </div>
  </section>
}

function Paper({ paper }: { paper: Publication }) {
  const [open, setOpen] = useState(false)
  return <Reveal as="li" className="paper">
    <div className="paper-meta">
      <span className="paper-year">{paper.year}</span>
      <span>{paper.venue}</span>
      <span className={`status${paper.accepted ? ' is-accepted' : ''}`}><i aria-hidden="true" />{paper.status}</span>
    </div>
    <article className="paper-main">
      <h3>{paper.title}</h3>
      <p className="paper-description">{paper.description}</p>
      {paper.results && <dl className="results">{paper.results.map(result => <div key={result.label}><dt>{result.label}</dt><dd>{result.value}</dd></div>)}</dl>}
      <div className="paper-footer">
        <MetaList label="Topics" items={paper.topics} />
        <div className="paper-actions">
          {paper.links.map(link => <a className="text-link" href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} <Arrow /></a>)}
          {paper.abstract && <button className="text-link abstract-toggle" type="button" aria-expanded={open} aria-controls={`abstract-${paper.id}`} onClick={() => setOpen(!open)}>{open ? 'Hide abstract' : 'Read abstract'}<Plus size={16} className={open ? 'is-open' : undefined} aria-hidden="true" /></button>}
        </div>
      </div>
      {paper.abstract && <div className={`abstract${open ? ' is-open' : ''}`} id={`abstract-${paper.id}`} inert={!open}>
        <div><div className="abstract-body"><h4>Abstract</h4><p>{paper.abstract}</p><span>Public paper link forthcoming.</span></div></div>
      </div>}
    </article>
  </Reveal>
}

function Research() {
  return <section id="publications" className="section research" aria-labelledby="research-title">
    <div className="container">
      <SectionHead label="Research" id="research-title" title="How learning systems behave, where they fail, and why." note="My research spans explainable machine learning, computer vision and medical imaging." />
      <ol className="papers">{publications.map(paper => <Paper key={paper.id} paper={paper} />)}</ol>
    </div>
  </section>
}

function About() {
  return <section id="about" className="section container" aria-labelledby="about-title">
    <SectionHead label="About" id="about-title" title="Built on curiosity, kept going by craft." />
    <div className="about-grid">
      <Reveal className="about-copy">
        <p className="about-lead">I’m Ashraf, a Computer Science and Engineering student in Dhaka, Bangladesh. I enjoy moving between the practical work of building software and the open questions of machine learning.</p>
        <p>Some days that means making a browser extension feel effortless. On others, it means investigating why a model loses its footing. The part I enjoy most is turning what I learn into something clear and useful.</p>
        <dl className="facts">
          <div><dt>Based in</dt><dd>Dhaka, Bangladesh</dd></div>
          <div><dt>Studying</dt><dd>Computer Science & Engineering</dd></div>
          <div><dt>Focus</dt><dd>Explainable AI, computer vision and developer tools</dd></div>
        </dl>
        <div className="profile-links">{profiles.map(profile => <a className="text-link" href={profile.href} target="_blank" rel="noreferrer" key={profile.label}>{profile.label} <Arrow /></a>)}</div>
      </Reveal>
      <Reveal className="toolkit" delay={0.08}>
        <h3>Toolkit</h3>
        <dl>{skills.map(group => <div className="toolkit-row" key={group.title}><dt>{group.title}</dt><dd>{group.items.join(', ')}</dd></div>)}</dl>
      </Reveal>
    </div>
  </section>
}

function Contact() {
  const [state, copy] = useCopy(contact.email)
  const [user, domain] = contact.email.split('@')
  return <section id="contact" className="contact container" aria-labelledby="contact-title">
    <Reveal className="contact-inner">
      <p className="label">Contact</p>
      <h2 id="contact-title">Have a project or a research question? Let’s talk.</h2>
      <p className="contact-text">A collaboration, a research question, or simply a good conversation. I’d love to hear from you.</p>
      <a className="contact-email" href={`mailto:${contact.email}`}><span>{user}@<wbr />{domain}</span><Arrow size={28} /></a>
      <div className="contact-actions">
        <button type="button" className="button button-secondary" onClick={copy}>{state === 'copied' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}<span aria-live="polite">{state === 'copied' ? 'Email copied' : state === 'failed' ? 'Couldn’t copy' : 'Copy email'}</span></button>
        <div className="contact-links">{profiles.map(profile => <a className="text-link" href={profile.href} target="_blank" rel="noreferrer" key={profile.label}>{profile.label} <Arrow /></a>)}</div>
      </div>
    </Reveal>
  </section>
}

export default function App() {
  return <MotionConfig reducedMotion="user"><OpeningSequence><div className="folio">
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main"><Hero /><Work /><Research /><About /><Contact /></main>
    <footer className="container"><div className="footer"><a className="signature" href="#home">ashraf<span>.</span></a><p>© {new Date().getFullYear()} Ashraf Hamid Mojumder</p><a className="text-link" href="#home">Back to top <Arrow dir="up" size={15} /></a></div></footer>
  </div></OpeningSequence></MotionConfig>
}
