import { AnimatePresence, MotionConfig, motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Mail, MapPin, Menu, Moon, Send, Sun, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'

const navigation = [
  { label: 'Works', href: '#works' },
  { label: 'About', href: '#about' },
  { label: 'Craft', href: '#craft' },
  { label: 'Contact', href: '#contact' },
]

const projects = [
  {
    roman: 'I',
    number: '01',
    title: 'LocalFix',
    discipline: 'Android / Civic technology',
    thesis: 'A clearer route from a local problem to collective action.',
    description: 'A community issue-reporting application where residents document infrastructure problems, add evidence, vote, and help urgent reports rise.',
    tools: ['Java', 'Firebase', 'Android Studio', 'Maps API'],
    motif: 'map',
    tone: 'burgundy',
  },
  {
    roman: 'II',
    number: '02',
    title: 'Spam Classifier',
    discipline: 'Machine learning / NLP',
    thesis: 'A prediction is useful only when its reasoning has been measured.',
    description: 'An end-to-end text classification pipeline covering preparation, TF-IDF features, model comparison, evaluation, and real-time analysis.',
    tools: ['Python', 'Scikit-learn', 'NLP', 'Streamlit'],
    motif: 'classifier',
    tone: 'forest',
  },
  {
    roman: 'III',
    number: '03',
    title: 'Hospital System',
    discipline: 'Systems programming / C',
    thesis: 'Reliable records, built patiently from first principles.',
    description: 'A file-backed management system for patient, doctor, and appointment records, built around persistence, validation, and dependable workflows.',
    tools: ['C', 'File handling', 'Data structures', 'Validation'],
    motif: 'ledger',
    tone: 'ink',
  },
]

const crafts = [
  { title: 'Intelligent systems', note: 'Models tested before they are trusted.', tools: 'PyTorch · TensorFlow · Scikit-learn · NLP · Transformers · CNN · RNN' },
  { title: 'Software engineering', note: 'Clear systems built on dependable fundamentals.', tools: 'Java · Python · C++ · C · Spring Boot · REST APIs · SQL · Git' },
  { title: 'Mobile development', note: 'Useful Android experiences for real workflows.', tools: 'Android Studio · Java · Firebase · XML · Google Maps API' },
]

const ease = [0.22, 1, 0.36, 1] as const
type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const saved = window.localStorage.getItem('ahm-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Use the visitor's system preference when storage is unavailable.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 1, delay, ease }}>
      {children}
    </motion.div>
  )
}

function Chapter({ number, label, children }: { number: string; label: string; children: ReactNode }) {
  return (
    <Reveal className="chapter-heading">
      <p><span>{number}</span>{label}</p>
      <h2>{children}</h2>
    </Reveal>
  )
}

function ProjectMotif({ motif }: { motif: string }) {
  if (motif === 'map') {
    return (
      <div className="room-motif map-room" aria-hidden="true">
        <span className="road road-a" /><span className="road road-b" /><span className="road road-c" />
        <i className="pin pin-a"><b>12</b></i><i className="pin pin-b"><b>07</b></i><i className="pin pin-c"><b>24</b></i>
        <em className="map-ripple" />
        <div className="motif-note"><span>Issue density</span><b>43 open reports</b></div>
      </div>
    )
  }
  if (motif === 'classifier') {
    return (
      <div className="room-motif classifier-room" aria-hidden="true">
        <div><span>Project notes for Monday</span><i>SAFE</i></div>
        <div className="flagged"><span>Claim your prize today!!!</span><i>SPAM</i></div>
        <div><span>Your application update</span><i>SAFE</i></div>
        <p><span>Measured confidence</span><b>98.4%</b><i><em /></i></p>
        <strong className="reading-beam" />
      </div>
    )
  }
  return (
    <div className="room-motif ledger-room" aria-hidden="true">
      <div className="ledger-head"><span>ID</span><span>Patient</span><span>Status</span></div>
      <div><span>1024</span><b>Nadia Rahman</b><i>Checked in</i></div>
      <div><span>1025</span><b>Fahim Islam</b><i>Waiting</i></div>
      <div><span>1026</span><b>Samira Khan</b><i>Complete</i></div>
      <div><span>1027</span><b>Adnan Karim</b><i>Waiting</i></div>
      <em className="ledger-beam" />
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('works')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  const lightX = useSpring(useMotionValue(0), { stiffness: 70, damping: 24 })
  const lightY = useSpring(useMotionValue(0), { stiffness: 70, damping: 24 })

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      window.localStorage.setItem('ahm-theme', theme)
    } catch {
      // The preference still applies for this visit.
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#15120f' : '#f2ebdd')
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

  const moveLight = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    lightX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 38)
    lightY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 24)
  }

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />

      <div className="curtain-opening" aria-hidden="true">
        <span className="curtain curtain-left" /><span className="curtain curtain-right" />
        <div className="opening-title"><b>AHM</b><i>Portfolio / MMXXVI</i></div>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Ashraf Hamid Mojumder, home"><b>AHM</b><i>Folio MMXXVI</i></a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item, index) => <a key={item.href} href={item.href} className={activeSection === item.href.slice(1) ? 'active' : ''}><span>0{index + 1}</span>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }} transition={{ duration: .2 }} aria-hidden="true">{theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}</motion.span>
            </AnimatePresence>
            <i>{theme === 'light' ? 'Dark' : 'Light'}</i>
          </button>
          <a className="header-mail" href="mailto:ashrafhamidmajumder@gmail.com">Correspondence <ArrowUpRight size={13} /></a>
          <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .35, ease }}>
              {navigation.map((item, index) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item.label}</a>)}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main">
        <section className="atrium" id="top" onPointerMove={moveLight} onPointerLeave={() => { lightX.set(0); lightY.set(0) }}>
          <motion.div className="sunlight" style={{ x: lightX, y: lightY }} aria-hidden="true" />
          <div className="side-arch side-arch-left" aria-hidden="true" /><div className="side-arch side-arch-right" aria-hidden="true" />
          <motion.div className="grand-arch" initial={{ clipPath: 'inset(100% 0 0)' }} animate={{ clipPath: 'inset(0% 0 0)' }} transition={{ duration: 1.35, delay: .58, ease }}>
            <span className="arch-letter" aria-hidden="true">A</span>
            <motion.p className="arch-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15, duration: .8 }}>Software engineer / Dhaka, Bangladesh</motion.p>
            <h1 aria-label="Ashraf Hamid Mojumder">
              <span className="name-mask"><motion.i initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: .7, ease }}>Ashraf</motion.i></span>
              <span className="name-mask name-italic"><motion.i initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: .82, ease }}>Hamid</motion.i></span>
              <span className="name-mask"><motion.i initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: .94, ease }}>Mojumder</motion.i></span>
            </h1>
            <motion.div className="arch-foot" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: .8, ease }}>
              <p>Intelligent systems<br />Dependable software<br />Useful Android experiences</p>
              <a href="#works">Enter the gallery <ArrowDown size={14} /></a>
            </motion.div>
          </motion.div>
          <span className="atrium-index left">Selected works / 2026</span><span className="atrium-index right">Est. 2024 / Bangladesh</span>
        </section>

        <section className="threshold">
          <Reveal className="threshold-label"><span>01</span><p>Principle</p></Reveal>
          <Reveal className="threshold-statement" delay={.06}><p>The best engineering feels <em>inevitable:</em> complex beneath the surface, calm in the hands of the person using it.</p></Reveal>
          <Reveal className="threshold-note" delay={.12}><p>I build by observing carefully, measuring honestly, and giving difficult ideas a clear form.</p></Reveal>
          <div className="threshold-light" aria-hidden="true" />
        </section>

        <section className="works page-shell" id="works">
          <Chapter number="02" label="Selected works">Three rooms for<br /><em>useful software.</em></Chapter>
          <div className="gallery-list">
            {projects.map((project, index) => (
              <motion.article className={`gallery-piece tone-${project.tone}`} key={project.title} initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: 1.05, delay: index * .05, ease }}>
                <div className="piece-visual">
                  <div className="portal">
                    <div className="portal-meta"><span>Gallery room {project.roman}</span><span>{project.discipline}</span></div>
                    <ProjectMotif motif={project.motif} />
                    <span className="portal-number">{project.number}</span>
                  </div>
                  <span className="portal-shadow" aria-hidden="true" />
                </div>
                <div className="piece-copy">
                  <p className="piece-index"><span>{project.number}</span>Selected study</p>
                  <h3>{project.title}</h3>
                  <p className="piece-thesis">{project.thesis}</p>
                  <p className="piece-description">{project.description}</p>
                  <div className="piece-tools">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
                  <p className="piece-signature">Designed & built by Ashraf Hamid Mojumder</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="about-hall" id="about">
          <div className="hall-arch" aria-hidden="true" />
          <div className="hall-content">
            <Chapter number="03" label="About">Patient with problems.<br /><em>Precise with proof.</em></Chapter>
            <div className="about-grid">
              <Reveal className="about-lead"><p>I work where theory has to become something <em>real.</em></p></Reveal>
              <Reveal className="about-copy" delay={.08}><p>My foundation spans algorithms, machine learning, deep learning, backend systems, and Android development. I am most interested in the moment when an idea has to survive real data, real constraints, and real users.</p><p>I care about honest evaluation, careful implementation, and solutions that earn their complexity.</p></Reveal>
              <Reveal className="about-facts" delay={.14}><div><span>Education</span><b>BSc in Computer Science</b></div><div><span>Academic record</span><b>3.90 / 4.00 CGPA</b></div><div><span>Primary focus</span><b>Applied AI & software systems</b></div><div><span>Based in</span><b>Bangladesh</b></div></Reveal>
            </div>
          </div>
        </section>

        <section className="craft page-shell" id="craft">
          <Chapter number="04" label="Craft">Three pillars.<br /><em>One practice.</em></Chapter>
          <div className="pillar-row">
            {crafts.map((craft, index) => (
              <Reveal className="pillar" key={craft.title} delay={index * .08}>
                <span className="pillar-cap" aria-hidden="true" /><span className="pillar-number">0{index + 1}</span><h3>{craft.title}</h3><p>{craft.note}</p><i>{craft.tools}</i><span className="pillar-base" aria-hidden="true" />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="practice-court">
          <div className="court-label"><span>05 / Practice</span><p>The quiet repetition behind the finished work.</p></div>
          <div className="court-numbers">
            <Reveal><strong>600<sup>+</sup></strong><p>LeetCode problems solved</p></Reveal>
            <Reveal delay={.07}><strong>142</strong><p>Codeforces problems solved</p></Reveal>
            <Reveal delay={.14}><strong>3.90</strong><p>Academic CGPA / 4.00</p></Reveal>
          </div>
        </section>

        <section className="final-room" id="contact">
          <div className="final-arch" aria-hidden="true" />
          <div className="final-meta"><span>06 / Correspondence</span><span>Available for thoughtful work</span></div>
          <Reveal className="final-title"><p>Have a difficult idea?</p><h2>Let&apos;s make<br /><em>something enduring.</em></h2></Reveal>
          <div className="final-foot">
            <a className="write-button" href="mailto:ashrafhamidmajumder@gmail.com?subject=Let%27s%20work%20together">Write to Ashraf <Send size={16} /></a>
            <div><a href="mailto:ashrafhamidmajumder@gmail.com"><Mail size={14} /> ashrafhamidmajumder@gmail.com</a><span><MapPin size={14} /> Bangladesh / GMT+6</span></div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><a href="#top">AHM</a><p>Software engineer / AI-ML builder / Android developer</p><div><a href="https://github.com/ash-rafhamid" target="_blank" rel="noreferrer">GitHub</a><a href="https://linkedin.com/in/ashrafhamid096" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://leetcode.com/u/ash-rafhamid" target="_blank" rel="noreferrer">LeetCode</a></div></footer>
    </MotionConfig>
  )
}

export default App
