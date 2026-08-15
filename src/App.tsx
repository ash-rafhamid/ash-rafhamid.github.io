import { AnimatePresence, MotionConfig, motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Mail, MapPin, Menu, Send, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'

const navigation = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
]

const projects = [
  {
    number: '01',
    title: 'LocalFix',
    field: 'Android / Civic technology',
    thesis: 'A clearer route from a local problem to collective action.',
    description: 'Residents document infrastructure problems, attach evidence, vote, and help the most urgent reports rise through a focused community workflow.',
    tools: ['JAVA', 'FIREBASE', 'ANDROID STUDIO', 'MAPS API'],
    visual: 'actions',
    className: 'case-blue',
  },
  {
    number: '02',
    title: 'Spam Classifier',
    field: 'Machine learning / NLP',
    thesis: 'A prediction is useful only when its reasoning has been measured.',
    description: 'An end-to-end text classification pipeline covering preparation, TF-IDF features, three-model comparison, evaluation, and real-time analysis.',
    tools: ['PYTHON', 'SCIKIT-LEARN', 'NLP', 'STREAMLIT'],
    visual: 'confidence',
    className: 'case-white',
  },
  {
    number: '03',
    title: 'Hospital System',
    field: 'Systems programming / C',
    thesis: 'Reliable records, built patiently from first principles.',
    description: 'A file-backed system for patient, doctor, and appointment records, designed around persistence, input validation, and dependable workflows.',
    tools: ['C', 'FILE HANDLING', 'DATA STRUCTURES', 'VALIDATION'],
    visual: 'records',
    className: 'case-black',
  },
]

const capabilities = [
  ['01', 'Intelligent systems', 'PyTorch · TensorFlow · Scikit-learn · NLP · Transformers · CNN · RNN · Pandas · NumPy'],
  ['02', 'Software engineering', 'Java · Python · C++ · C · Spring Boot · REST APIs · SQL · Git'],
  ['03', 'Mobile development', 'Android Studio · Java · Firebase · XML · Google Maps API'],
]

const ease = [0.22, 1, 0.36, 1] as const
type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const saved = window.localStorage.getItem('ahm-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Follow the system preference when storage is unavailable.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .75, delay, ease }}>
      {children}
    </motion.div>
  )
}

function CaseVisual({ type }: { type: string }) {
  if (type === 'actions') {
    return (
      <div className="case-visual actions-visual" aria-hidden="true">
        {['REPORT →', 'DOCUMENT →', 'VOTE →', 'RESOLVE →'].map((word, index) => <div key={word} style={{ '--row': index } as CSSProperties}><span>{word} {word} {word}</span></div>)}
        <b>LOCAL ACTION / COLLECTIVE SIGNAL</b>
      </div>
    )
  }
  if (type === 'confidence') {
    return (
      <div className="case-visual confidence-visual" aria-hidden="true">
        <div className="confidence-top"><span>MEASURED<br />CONFIDENCE</span><b>98.4<sup>%</sup></b></div>
        <div className="message-band"><span>PROJECT NOTES FOR MONDAY</span><i>SAFE</i></div>
        <div className="message-band danger"><span>CLAIM YOUR PRIZE TODAY!!!</span><i>SPAM</i></div>
        <div className="confidence-bar"><span /></div>
      </div>
    )
  }
  return (
    <div className="case-visual records-visual" aria-hidden="true">
      <div className="records-title"><span>PERSIST</span><span>VALIDATE</span><span>RETRIEVE</span></div>
      {['1024 / NADIA RAHMAN / CHECKED IN', '1025 / FAHIM ISLAM / WAITING', '1026 / SAMIRA KHAN / COMPLETE', '1027 / ADNAN KARIM / WAITING'].map((row, index) => <div className="record-line" key={row} style={{ '--record': index } as CSSProperties}><span>{row}</span></div>)}
      <b className="record-block" />
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('work')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: .001 })
  const blockX = useSpring(useMotionValue(0), { stiffness: 110, damping: 20 })
  const blockY = useSpring(useMotionValue(0), { stiffness: 110, damping: 20 })

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      window.localStorage.setItem('ahm-theme', theme)
    } catch {
      // The choice still applies for this visit.
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#090a0c' : '#f1f3f5')
  }, [theme])

  useEffect(() => {
    const sections = navigation.map((item) => document.querySelector(item.href)).filter((item): item is Element => Boolean(item))
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting)
      if (visible?.target.id) setActiveSection(visible.target.id)
    }, { rootMargin: '-30% 0px -62%', threshold: .05 })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', closeMenu)
    return () => window.removeEventListener('keydown', closeMenu)
  }, [])

  const moveBlock = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    blockX.set(((event.clientX - bounds.left) / bounds.width - .5) * 30)
    blockY.set(((event.clientY - bounds.top) / bounds.height - .5) * 22)
  }

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />

      <div className="signal-opening" aria-hidden="true"><div><b>FORM</b><i>/</i><b>FUNCTION</b></div><span /></div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Ashraf Hamid Mojumder, home"><b>AHM</b><span>©26</span></a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => <a key={item.href} href={item.href} className={activeSection === item.href.slice(1) ? 'active' : ''}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="invert-button" type="button" onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}><i />INVERT</button>
          <a className="header-mail" href="mailto:ashrafhamidmajumder@gmail.com">EMAIL <ArrowUpRight size={13} /></a>
          <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
        <AnimatePresence>
          {menuOpen && <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: .28, ease }}>{navigation.map((item, index) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item.label}</a>)}</motion.nav>}
        </AnimatePresence>
      </header>

      <main id="main">
        <section className="poster-hero" id="top" onPointerMove={moveBlock} onPointerLeave={() => { blockX.set(0); blockY.set(0) }}>
          <div className="poster-meta"><span>ASHRAF HAMID MOJUMDER</span><span>DHAKA / BANGLADESH</span><span>SOFTWARE ENGINEER</span></div>
          <div className="poster-copy">
            <h1 aria-label="I turn hard problems into clear software.">
              {['I TURN HARD', 'PROBLEMS INTO', 'CLEAR SOFTWARE.'].map((line, index) => <span key={line}><motion.i initial={{ x: index % 2 ? '105%' : '-105%' }} animate={{ x: 0 }} transition={{ duration: 1, delay: .52 + index * .11, ease }}>{line}</motion.i></span>)}
            </h1>
            <motion.div className="poster-summary" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: .7, ease }}>
              <p>Building intelligent systems, dependable software, and useful Android experiences.</p>
              <a href="#work">SEE THE WORK <ArrowDown size={15} /></a>
            </motion.div>
          </div>
          <motion.div className="blue-block" style={{ x: blockX, y: blockY }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1, delay: .62, ease }} aria-hidden="true">
            <div className="block-grid">{Array.from({ length: 12 }, (_, index) => <span key={index} style={{ '--tile': index } as CSSProperties} />)}</div>
            <b>A</b><i>ENGINEERING<br />AI / ML<br />ANDROID</i>
          </motion.div>
          <div className="hero-ticker" aria-hidden="true"><span>RESEARCH — ENGINEERING — ANDROID — MACHINE LEARNING — BUILD — TEST — IMPROVE — RESEARCH — ENGINEERING — ANDROID — MACHINE LEARNING — </span></div>
        </section>

        <section className="manifesto-block">
          <span>01 / BELIEF</span>
          <Reveal><p>Complex work deserves a <b>simple answer.</b></p></Reveal>
          <Reveal delay={.08}><i>I value evidence over noise, clarity over decoration, and software that earns its place.</i></Reveal>
        </section>

        <section className="case-section" id="work">
          <div className="case-heading"><span>02 / SELECTED WORK</span><h2>THREE BUILDS.<br />THREE PROBLEMS.<br /><b>ZERO FLUFF.</b></h2></div>
          {projects.map((project, index) => (
            <motion.article className={`case-study ${project.className}`} key={project.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .65 }}>
              <div className="case-copy">
                <div className="case-label"><span>{project.number}</span><i>{project.field}</i></div>
                <h3>{project.title}</h3>
                <p className="case-thesis">{project.thesis}</p>
                <p className="case-description">{project.description}</p>
                <div className="case-tools">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
              </div>
              <CaseVisual type={project.visual} />
              <span className="case-giant-number" aria-hidden="true">{project.number}</span>
            </motion.article>
          ))}
        </section>

        <section className="about-section" id="about">
          <div className="about-top"><span>03 / ABOUT</span><span>BASED IN BANGLADESH / GMT+6</span></div>
          <Reveal className="about-statement"><p>CURIOUS ENOUGH<br />TO ASK <b>WHY.</b><br />DISCIPLINED ENOUGH<br />TO <b>PROVE IT.</b></p></Reveal>
          <div className="about-bottom">
            <Reveal className="about-copy"><p>My foundation spans algorithms, machine learning, deep learning, backend systems, and Android development. I enjoy turning difficult ideas into reliable tools for real people.</p><p>Clear thinking first. Careful execution next.</p></Reveal>
            <Reveal className="about-facts" delay={.08}><div><span>EDUCATION</span><b>BSc in Computer Science</b></div><div><span>ACADEMIC RECORD</span><b>3.90 / 4.00 CGPA</b></div><div><span>FOCUS</span><b>Applied AI & software systems</b></div></Reveal>
          </div>
        </section>

        <section className="stack-section" id="stack">
          <div className="stack-title"><span>04 / CAPABILITY</span><h2>THE STACK<br />IS A TOOL.<br /><b>JUDGEMENT IS THE SKILL.</b></h2></div>
          <div className="stack-list">
            {capabilities.map(([number, title, tools], index) => <Reveal className="stack-row" key={title} delay={index * .06}><span>{number}</span><h3>{title}</h3><p>{tools}</p><ArrowRight size={22} /></Reveal>)}
          </div>
        </section>

        <section className="numbers-section">
          <div className="numbers-intro"><span>05 / PRACTICE</span><p>REPETITION<br />BUILDS RANGE.</p></div>
          <div className="numbers-grid"><Reveal><strong>600<sup>+</sup></strong><p>LEETCODE PROBLEMS</p></Reveal><Reveal delay={.07}><strong>142</strong><p>CODEFORCES PROBLEMS</p></Reveal><Reveal delay={.14}><strong>3.90</strong><p>ACADEMIC CGPA</p></Reveal></div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-meta"><span>06 / CONTACT</span><span>AVAILABLE FOR THOUGHTFUL WORK</span></div>
          <Reveal className="contact-copy"><p>HAVE A HARD PROBLEM?</p><h2>LET'S<br />MAKE IT<br /><b>CLEAR.</b></h2></Reveal>
          <div className="contact-foot"><a href="mailto:ashrafhamidmajumder@gmail.com?subject=Let%27s%20work%20together">WRITE TO ASHRAF <Send size={17} /></a><div><span><Mail size={14} /> ashrafhamidmajumder@gmail.com</span><span><MapPin size={14} /> Bangladesh / GMT+6</span></div></div>
        </section>
      </main>

      <footer className="site-footer"><a href="#top">AHM / ©26</a><p>SOFTWARE ENGINEER — AI/ML BUILDER — ANDROID DEVELOPER</p><div><a href="https://github.com/ash-rafhamid" target="_blank" rel="noreferrer">GITHUB</a><a href="https://linkedin.com/in/ashrafhamid096" target="_blank" rel="noreferrer">LINKEDIN</a><a href="https://leetcode.com/u/ash-rafhamid" target="_blank" rel="noreferrer">LEETCODE</a></div></footer>
    </MotionConfig>
  )
}

export default App
