import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Code2, Copy, FileText, Menu, Plus, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { contact, publications, skills, type Publication } from './portfolio'
import HumanMachineStudy from './HumanMachineStudy'
import OpeningSequence from './OpeningSequence'

const ease = [0.22, 1, 0.36, 1] as const
const nav = [{ label: 'Work', href: '#work' }, { label: 'Publications', href: '#publications' }, { label: 'About', href: '#about' }]

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay, ease }}>{children}</motion.div>
}

function Header() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const navigation = useRef<HTMLElement>(null)
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
  return <header className="navigation">
    <a className="signature" href="#home" aria-label="Ashraf, home">ashraf<span aria-hidden="true">.</span></a>
    <nav className="desktop-navigation" aria-label="Main navigation">{nav.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
    <a className="nav-contact" href="#contact">Let’s talk <ArrowUpRight size={16} /></a>
    <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <AnimatePresence>{open && <motion.nav ref={navigation} id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.24 }}>
      <p>Take a look around.</p>{[...nav, { label: 'Get in touch', href: '#contact' }].map((item, index) => <a href={item.href} key={item.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}<ArrowUpRight /></a>)}<span className="menu-location">Dhaka, Bangladesh</span>
    </motion.nav>}</AnimatePresence>
  </header>
}

function Hero() {
  const reduced = useReducedMotion()
  return <section className="introduction" id="home" aria-labelledby="hero-title">
    <div className="hero-layout">
      <div className="intro-copy">
        <Reveal><p className="eyebrow"><span className="status-dot" />Hello, I’m Ashraf Hamid Mojumder</p></Reveal>
        <h1 id="hero-title">{['A curious mind.', 'A builder at heart.'].map((line, index) => <span className="headline-clip" key={line}><motion.span initial={reduced ? false : { y: '110%', rotate: 3 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.95, delay: 0.1 + index * 0.12, ease }}>{index ? <em>{line}</em> : line}</motion.span></span>)}</h1>
        <Reveal delay={0.28}><p className="hero-description">I turn ideas into software and questions into research. Working at the intersection of <strong>engineering, machine learning,</strong> and the people who use them.</p></Reveal>
        <Reveal className="hero-actions" delay={0.36}><a className="primary-link" href="#work">Explore my work <ArrowDown size={17} /></a><a className="text-link" href="#publications">Read my research <ArrowUpRight size={16} /></a></Reveal>
      </div>
      <motion.aside className="desk-index" initial={reduced ? false : { opacity: 0, y: 25, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.42, duration: 1, ease }} aria-label="Portfolio at a glance">
        <div className="desk-heading"><span>On my desk</span><span className="desk-year">2026</span></div>
        <a className="desk-item" href="#work"><span className="desk-number">01</span><div><strong>Things I’ve built</strong><span>Context Bridge & CrashLens</span></div><ArrowUpRight size={18} /></a>
        <a className="desk-item" href="#publications"><span className="desk-number">02</span><div><strong>Questions I’m exploring</strong><span>Learning, vision & explainability</span></div><ArrowUpRight size={18} /></a>
        <a className="desk-item" href="#skills"><span className="desk-number">03</span><div><strong>The tools behind it</strong><span>Python, React, PyTorch & more</span></div><ArrowUpRight size={18} /></a>
        <div className="desk-note"><span className="handwritten">Small details. Real purpose.</span><span className="note-line" /></div>
      </motion.aside>
    </div>
    <Reveal className="intro-notes" delay={0.45}><span>Based in Dhaka, Bangladesh</span><a href="#work">Scroll to discover <ArrowDown size={14} /></a><span>Software engineering & applied AI</span></Reveal>
  </section>
}

function CrashLensPreview() {
  return <div className="crash-window" aria-label="Illustrative CrashLens error monitoring interface">
    <div className="window-bar"><span className="window-dots"><i /><i /><i /></span><span>crashlens / overview</span><span className="demo-label">Sample view</span></div>
    <div className="crash-body"><aside className="crash-sidebar"><span className="crash-monogram">c<span>l</span></span><span className="sidebar-active">Overview</span><span>Issues</span><span>Projects</span></aside>
      <div className="crash-content"><div className="crash-content-heading"><strong>Good visibility.<br />Faster fixes.</strong><span className="live-status"><i />Monitoring</span></div><div className="error-summary"><span>Unresolved issue</span><strong>TypeError</strong><p>Cannot read properties of undefined</p><div><code>checkout.tsx:42</code><span>Investigate <ArrowUpRight size={12} /></span></div></div><div className="breadcrumb"><span className="breadcrumb-line" /><span>Page load</span><span>Button click</span><span className="error-step">Exception</span></div></div>
    </div>
  </div>
}

function Work() {
  return <section id="work" className="work-section section-width" aria-labelledby="work-title">
    <Reveal className="section-top"><div><p className="eyebrow">Selected work</p><h2 id="work-title">Made to be <em>useful.</em></h2></div><p>Two projects. A shared idea:<br />make complicated things easier.</p></Reveal>
    <div className="work-grid">
      <Reveal className="project" delay={0.04}>
        <a className="project-stage context-stage" href="https://github.com/ash-rafhamid/contextbridge-extension" target="_blank" rel="noreferrer" aria-label="Explore Context Bridge on GitHub">
          <div className="stage-heading"><span className="project-symbol"><Copy size={19} /></span><span>Context Bridge</span><ArrowUpRight size={20} /></div>
          <p className="stage-title">Keep the conversation.<br /><em>Carry the context.</em></p>
          <div className="context-screenshot"><img src="/projects/contextbridge.png" alt="Context Bridge’s conversation export interface" loading="lazy" width="1280" height="800" /></div>
          <span className="stage-caption">Your conversations. Your files.</span>
        </a>
        <div className="project-detail"><div className="project-name"><h3>Context Bridge</h3><span>01 / Browser extension</span></div><p>A privacy-first extension that exports your visible AI conversations to Markdown, JSON, or plain text. Everything happens locally.</p><div className="project-tags"><span>JavaScript</span><span>Chrome extension</span><span>Privacy</span></div><a className="text-link" href="https://github.com/ash-rafhamid/contextbridge-extension" target="_blank" rel="noreferrer">Explore the project <ArrowUpRight size={16} /></a></div>
      </Reveal>
      <Reveal className="project" delay={0.12}>
        <a className="project-stage crash-stage" href="https://crashlens-dashboard-six.vercel.app" target="_blank" rel="noreferrer" aria-label="Open the CrashLens dashboard">
          <div className="stage-heading"><span className="project-symbol"><Code2 size={20} /></span><span>CrashLens</span><ArrowUpRight size={20} /></div>
          <p className="stage-title">Every error<br /><em>has a story.</em></p><CrashLensPreview /><span className="stage-caption">From browser exception to a clearer next step.</span>
        </a>
        <div className="project-detail"><div className="project-name"><h3>CrashLens</h3><span>02 / Developer tool</span></div><p>A self-hosted browser error monitor. An SDK, API, and dashboard bring exceptions, breadcrumbs, and context into one debugging workflow.</p><div className="project-tags"><span>TypeScript</span><span>Next.js</span><span>PostgreSQL</span></div><div className="project-links"><a className="text-link" href="https://crashlens-dashboard-six.vercel.app" target="_blank" rel="noreferrer">View live <ArrowUpRight size={16} /></a><a className="text-link secondary-link" href="https://github.com/ash-rafhamid/crashlens" target="_blank" rel="noreferrer">Source code <ArrowUpRight size={16} /></a></div></div>
      </Reveal>
    </div>
  </section>
}

function Paper({ paper, index }: { paper: Publication; index: number }) {
  const [expanded, setExpanded] = useState(false)
  return <Reveal className="paper-row" delay={index * 0.025}>
    <div className="paper-marker"><span>0{index + 1}</span><FileText size={21} strokeWidth={1.5} /></div>
    <article className="paper-content"><div className="paper-meta"><span>{paper.venue}</span><span className={paper.type === 'Accepted' ? 'accepted-status' : ''}>{paper.type === 'Accepted' && <Check size={12} />}{paper.type}</span></div><h3>{paper.title}</h3><p className="paper-description">{paper.description}</p><div className="paper-footer"><div className="paper-topics">{paper.topics.map(topic => <span key={topic}>{topic}</span>)}</div>{paper.href ? <a className="text-link" href={paper.href} target="_blank" rel="noreferrer">{paper.linkLabel}<ArrowUpRight size={16} /></a> : <button className="abstract-toggle" type="button" aria-expanded={expanded} aria-controls={`abstract-${paper.id}`} onClick={() => setExpanded(!expanded)}>{expanded ? 'Close abstract' : 'Read abstract'}<Plus size={16} className={expanded ? 'is-expanded' : ''} /></button>}</div>
      {paper.secondaryHref && <a className="paper-secondary" href={paper.secondaryHref} target="_blank" rel="noreferrer">Also on OpenReview <ArrowUpRight size={13} /></a>}
      {paper.abstract && <div className={`abstract-panel ${expanded ? 'is-expanded' : ''}`} id={`abstract-${paper.id}`} aria-hidden={!expanded}><div><div className="abstract-body"><h4>Abstract</h4><p>{paper.abstract}</p><span className="publication-note">Public paper link forthcoming.</span></div></div></div>}
    </article>
  </Reveal>
}

function Publications() {
  return <section className="publications-section" id="publications" aria-labelledby="publications-title"><div className="section-width publications-layout">
    <Reveal className="research-intro"><p className="eyebrow">Publications & research</p><h2 id="publications-title">A little deeper.<br /><em>A little further.</em></h2><p>I’m interested in how learning systems behave, where they fail, and how we can explain the difference.</p><div className="research-fields"><span>Machine learning</span><span>Computer vision</span><span>Explainable AI</span></div><span className="research-year">Selected research / 2026</span></Reveal>
    <div className="papers">{publications.map((paper, index) => <Paper key={paper.id} paper={paper} index={index} />)}</div>
  </div></section>
}

function About() {
  const [showDuel, setShowDuel] = useState(false)
  useEffect(() => {
    const revealHash = () => { if (window.location.hash === '#duel') setShowDuel(true) }
    revealHash()
    window.addEventListener('hashchange', revealHash)
    return () => window.removeEventListener('hashchange', revealHash)
  }, [])
  return <section className="about-section section-width" id="about" aria-labelledby="about-title">
    <Reveal className="about-layout"><div className="about-heading"><p className="eyebrow">A bit about me</p><h2 id="about-title">Built on curiosity.<br /><em>Kept going by craft.</em></h2></div><div className="about-copy"><p>I’m Ashraf, a Computer Science and Engineering student in Dhaka. I enjoy moving between the practical work of building software and the open questions of machine learning.</p><p>Some days that means making a browser extension feel effortless. On others, it means investigating why a model loses its footing. The part I enjoy most is turning what I learn into something clear and useful.</p><div className="about-links"><a href={contact.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} /></a><a href="https://leetcode.com/u/ash-rafhamid" target="_blank" rel="noreferrer">LeetCode <ArrowUpRight size={15} /></a></div></div></Reveal>
    <div className="skills-section" id="skills"><Reveal className="skills-heading"><h3>My working toolkit<span>.</span></h3><p>The right tool for the question in front of me.</p></Reveal><div className="skills-grid">{skills.map((group, index) => <Reveal className="skill-group" delay={index * 0.04} key={group.title}><span className="skill-number">0{index + 1}</span><h4>{group.title}</h4><p>{group.description}</p><div className="skill-tags">{group.items.map(skill => <span key={skill}>{skill}</span>)}</div></Reveal>)}</div></div>
    <div className="play-detour" id="duel"><button type="button" className="duel-disclosure" onClick={() => setShowDuel(!showDuel)} aria-expanded={showDuel} aria-controls="math-duel"><span><span className="play-label">A small detour</span><strong>You, a little maths, and an adaptive opponent.</strong></span><span>{showDuel ? 'Close' : 'Play a round'}<ChevronDown className={showDuel ? 'is-expanded' : ''} size={18} /></span></button><div id="math-duel" hidden={!showDuel}>{showDuel && <HumanMachineStudy />}</div></div>
  </section>
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const reset = useRef<number | null>(null)
  useEffect(() => () => { if (reset.current !== null) window.clearTimeout(reset.current) }, [])
  async function copyEmail() {
    try { await navigator.clipboard.writeText(contact.email); setCopied(true); setCopyFailed(false); if (reset.current !== null) window.clearTimeout(reset.current); reset.current = window.setTimeout(() => setCopied(false), 2500) }
    catch { setCopyFailed(true) }
  }
  return <section className="contact-section" id="contact"><Reveal className="contact-inner section-width"><p className="eyebrow">Have something in mind?</p><h2>Let’s make<br /><em>something matter.</em></h2><div className="contact-bottom"><p>A project, a research question,<br />or simply a good conversation.</p><div className="contact-actions"><a className="email-link" href={`mailto:${contact.email}`}>Say hello <ArrowUpRight size={25} /></a><button type="button" onClick={copyEmail} className="copy-email" aria-label="Copy email address">{copied ? <Check size={15} /> : <Copy size={15} />}<span aria-live="polite">{copied ? 'Email copied' : copyFailed ? contact.email : 'Copy email address'}</span></button></div></div></Reveal></section>
}

export default function App() {
  return <MotionConfig reducedMotion="user"><OpeningSequence><div className="folio"><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main"><Hero /><Work /><Publications /><About /><Contact /></main><footer className="footer section-width"><a className="signature" href="#home">ashraf<span>.</span></a><p>© {new Date().getFullYear()} Ashraf Hamid Mojumder</p><a href="#home">Back to top <ArrowRight size={15} /></a></footer></div></OpeningSequence></MotionConfig>
}
