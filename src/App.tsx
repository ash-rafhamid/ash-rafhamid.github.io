import { AnimatePresence, MotionConfig, motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Mail, MapPin, Menu, Moon, Send, Sun, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'

const navigation = [
  { label: 'Work', href: '#work' },
  { label: 'Profile', href: '#profile' },
  { label: 'Practice', href: '#practice' },
  { label: 'Contact', href: '#contact' },
]

const projects = [
  {
    number: '01',
    title: 'LocalFix',
    field: 'Civic technology / Android',
    statement: 'A clearer path from a local problem to collective action.',
    description: 'Residents document infrastructure problems, attach evidence, vote, and help the most urgent reports rise through a focused community workflow.',
    tools: ['Java', 'Firebase', 'Android Studio', 'Maps API'],
    motif: 'network',
  },
  {
    number: '02',
    title: 'Spam Classifier',
    field: 'Machine learning / NLP',
    statement: 'A prediction is useful only when its reasoning has been measured.',
    description: 'An end-to-end classification pipeline covering preparation, TF-IDF features, three-model comparison, evaluation, and real-time message analysis.',
    tools: ['Python', 'Scikit-learn', 'NLP', 'Streamlit'],
    motif: 'signal',
  },
  {
    number: '03',
    title: 'Hospital System',
    field: 'Systems programming / C',
    statement: 'Reliable records, built patiently from first principles.',
    description: 'A file-backed system for patient, doctor, and appointment records, designed around persistence, input validation, and dependable workflows.',
    tools: ['C', 'File handling', 'Data structures', 'Validation'],
    motif: 'records',
  },
]

const capabilities = [
  ['Intelligent systems', 'PyTorch, TensorFlow, Scikit-learn, NLP, Transformers, CNN, RNN, Pandas, NumPy'],
  ['Software engineering', 'Java, Python, C++, C, Spring Boot, REST APIs, SQL, Git'],
  ['Mobile development', 'Android Studio, Java, Firebase, XML, Google Maps API'],
]

const fieldHeights = [32, 47, 64, 81, 56, 92, 73, 44, 87, 100, 68, 38, 78, 91, 59, 42, 70, 84, 51]
const ease = [0.22, 1, 0.36, 1] as const
type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const saved = window.localStorage.getItem('ahm-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Use the system preference when storage is unavailable.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.85, delay, ease }}>
      {children}
    </motion.div>
  )
}

function SectionTitle({ index, label, children }: { index: string; label: string; children: ReactNode }) {
  return (
    <Reveal className="section-title">
      <p><span>{index}</span>{label}</p>
      <h2>{children}</h2>
    </Reveal>
  )
}

function ProjectVisual({ motif }: { motif: string }) {
  if (motif === 'network') {
    return (
      <div className="visual-scene network-scene" aria-hidden="true">
        <span className="net-line line-1" /><span className="net-line line-2" /><span className="net-line line-3" /><span className="net-line line-4" />
        <i className="net-node node-1"><b>12</b></i><i className="net-node node-2"><b>07</b></i><i className="net-node node-3"><b>24</b></i><i className="net-node node-4"><b>09</b></i>
        <em className="net-pulse" />
        <div className="visual-caption"><span>Community signal</span><b>43 open reports</b></div>
      </div>
    )
  }
  if (motif === 'signal') {
    return (
      <div className="visual-scene signal-scene" aria-hidden="true">
        <div><span>Project notes for Monday</span><i>SAFE</i></div>
        <div className="flag"><span>Claim your prize today!!!</span><i>SPAM</i></div>
        <div><span>Your application update</span><i>SAFE</i></div>
        <div><span>Meeting moved to 10:00</span><i>SAFE</i></div>
        <p><span>Model confidence</span><b>98.4%</b><i><em /></i></p>
        <strong className="signal-scan" />
      </div>
    )
  }
  return (
    <div className="visual-scene records-scene" aria-hidden="true">
      <div className="record-head"><span>ID</span><span>Patient</span><span>Status</span></div>
      <div><span>1024</span><b>Nadia Rahman</b><i>Checked in</i></div>
      <div><span>1025</span><b>Fahim Islam</b><i>Waiting</i></div>
      <div><span>1026</span><b>Samira Khan</b><i>Complete</i></div>
      <div><span>1027</span><b>Adnan Karim</b><i>Waiting</i></div>
      <em className="record-reader" />
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('work')
  const [activeProject, setActiveProject] = useState(0)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  const fieldX = useSpring(useMotionValue(0), { stiffness: 90, damping: 22 })
  const fieldY = useSpring(useMotionValue(0), { stiffness: 90, damping: 22 })

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      window.localStorage.setItem('ahm-theme', theme)
    } catch {
      // The theme still applies for this visit.
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#11100e' : '#efe8d9')
  }, [theme])

  useEffect(() => {
    const sections = navigation.map((item) => document.querySelector(item.href)).filter((item): item is Element => Boolean(item))
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting)
      if (visible?.target.id) setActiveSection(visible.target.id)
    }, { rootMargin: '-30% 0px -62%', threshold: 0.05 })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])

  const moveField = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    fieldX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 26)
    fieldY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 20)
  }

  const project = projects[activeProject]

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />

      <div className="studio-opening" aria-hidden="true">
        <div><span>ASHRAF HAMID MOJUMDER</span><i><b /></i><em>Portfolio / 2026</em></div>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Ashraf Hamid Mojumder, home"><b>AHM</b><span>Software engineer</span></a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item, index) => <a key={item.href} href={item.href} className={activeSection === item.href.slice(1) ? 'active' : ''}><span>0{index + 1}</span>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }} transition={{ duration: 0.2 }} aria-hidden="true">{theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}</motion.span>
            </AnimatePresence>
            <i>{theme === 'light' ? 'Dark' : 'Light'}</i>
          </button>
          <a className="header-mail" href="mailto:ashrafhamidmajumder@gmail.com">Let&apos;s talk <ArrowUpRight size={13} /></a>
          <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.35, ease }}>
              {navigation.map((item, index) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item.label}</a>)}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main">
        <section className="studio-hero" id="top" onPointerMove={moveField} onPointerLeave={() => { fieldX.set(0); fieldY.set(0) }}>
          <div className="hero-copy">
            <motion.p className="hero-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: .7 }}>Ashraf Hamid Mojumder <span>—</span> Dhaka, Bangladesh</motion.p>
            <h1 aria-label="Building clear systems for complex ideas.">
              {['Building clear', 'systems for'].map((line, index) => (
                <span className="hero-line" key={line}><motion.i initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: .62 + index * .11, ease }}>{line}</motion.i></span>
              ))}
              <span className="hero-line accent-line"><motion.i initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: .84, ease }}>complex ideas.</motion.i></span>
            </h1>
            <motion.div className="hero-summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: .8, ease }}>
              <p>Software engineer building intelligent systems, dependable software, and useful Android experiences.</p>
              <div><a href="#work">Explore selected work <ArrowDown size={14} /></a><a href="mailto:ashrafhamidmajumder@gmail.com">Start a conversation</a></div>
            </motion.div>
          </div>

          <div className="kinetic-wrap" aria-hidden="true">
            <motion.div className="kinetic-field" style={{ x: fieldX, y: fieldY }} initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .72, duration: 1.1, ease }}>
              <div className="field-ring"><i /><i /></div>
              <div className="field-lines">
                {fieldHeights.map((height, index) => <span key={index} style={{ '--i': index, '--height': `${height}%` } as CSSProperties} />)}
              </div>
              <b className="field-mark">AHM</b>
              <em className="field-scan" />
            </motion.div>
            <span className="field-label top">Think / Measure</span><span className="field-label bottom">Build / Return</span><span className="field-index">01</span>
          </div>
        </section>

        <section className="point-of-view">
          <p>01 / Point of view</p>
          <Reveal><blockquote>Good engineering makes complexity feel <em>calm.</em></blockquote></Reveal>
          <Reveal className="point-note" delay={.1}><p>I care about honest evaluation, careful implementation, and solutions that earn their complexity.</p></Reveal>
          <div className="moving-rule" aria-hidden="true"><span /></div>
        </section>

        <section className="work-theatre" id="work">
          <div className="theatre-shell">
            <SectionTitle index="02" label="Selected work">Three systems.<br /><em>One clear standard.</em></SectionTitle>
            <div className="project-console">
              <div className="project-selector" role="tablist" aria-label="Select a project">
                {projects.map((item, index) => (
                  <button key={item.title} type="button" role="tab" aria-selected={activeProject === index} className={activeProject === index ? 'active' : ''} onClick={() => setActiveProject(index)} onMouseEnter={() => setActiveProject(index)} onFocus={() => setActiveProject(index)}>
                    <span>{item.number}</span><strong>{item.title}</strong><i>{item.field}</i><ArrowRight size={18} />
                  </button>
                ))}
              </div>
              <div className="project-display">
                <AnimatePresence mode="wait">
                  <motion.article key={project.title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .48, ease }}>
                    <ProjectVisual motif={project.motif} />
                    <div className="display-copy">
                      <p>{project.statement}</p><span>{project.description}</span>
                      <div>{project.tools.map((tool) => <i key={tool}>{tool}</i>)}</div>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <section className="profile page-shell" id="profile">
          <SectionTitle index="03" label="Profile">Theory, tested<br />against reality.</SectionTitle>
          <div className="profile-layout">
            <Reveal className="profile-statement"><p>I work where an idea has to survive <em>real data, real constraints,</em> and real users.</p></Reveal>
            <Reveal className="profile-copy" delay={.08}><p>My foundation spans algorithms, machine learning, deep learning, backend systems, and Android development. I enjoy the patient work of turning difficult ideas into reliable tools.</p><p>Clear thinking first. Then careful execution.</p></Reveal>
            <Reveal className="profile-facts" delay={.14}>
              <div><span>Education</span><b>BSc in Computer Science</b></div><div><span>Academic record</span><b>3.90 / 4.00 CGPA</b></div><div><span>Focus</span><b>Applied AI & software systems</b></div><div><span>Based in</span><b>Bangladesh</b></div>
            </Reveal>
          </div>
          <div className="capability-list">
            {capabilities.map(([title, tools], index) => <Reveal className="capability-row" key={title} delay={index * .06}><span>0{index + 1}</span><h3>{title}</h3><p>{tools}</p><i /></Reveal>)}
          </div>
        </section>

        <section className="practice" id="practice">
          <div className="practice-title"><span>04 / Practice</span><p>Quiet repetition.<br /><em>Visible results.</em></p></div>
          <div className="practice-grid">
            <Reveal><strong>600<sup>+</sup></strong><p>LeetCode problems solved</p></Reveal>
            <Reveal delay={.07}><strong>142</strong><p>Codeforces problems solved</p></Reveal>
            <Reveal delay={.14}><strong>3.90</strong><p>Academic CGPA / 4.00</p></Reveal>
          </div>
        </section>

        <section className="contact page-shell" id="contact">
          <div className="contact-meta"><span>05 / Contact</span><span>Available for thoughtful work</span></div>
          <Reveal className="contact-title"><p>Have a difficult idea?</p><h2>Let&apos;s make it<br /><em>clear.</em></h2></Reveal>
          <div className="contact-bottom">
            <a className="contact-button" href="mailto:ashrafhamidmajumder@gmail.com?subject=Let%27s%20work%20together">Write to Ashraf <Send size={16} /></a>
            <div><a href="mailto:ashrafhamidmajumder@gmail.com"><Mail size={14} /> ashrafhamidmajumder@gmail.com</a><span><MapPin size={14} /> Bangladesh / GMT+6</span></div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><a href="#top">AHM</a><p>Software engineer / AI-ML builder / Android developer</p><div><a href="https://github.com/ash-rafhamid" target="_blank" rel="noreferrer">GitHub</a><a href="https://linkedin.com/in/ashrafhamid096" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://leetcode.com/u/ash-rafhamid" target="_blank" rel="noreferrer">LeetCode</a></div></footer>
    </MotionConfig>
  )
}

export default App
