import { AnimatePresence, MotionConfig, motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Mail, MapPin, Menu, Moon, Send, Sun, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'

const navigation = [
  { label: 'Selected work', href: '#work' },
  { label: 'Profile', href: '#profile' },
  { label: 'Discipline', href: '#discipline' },
  { label: 'Contact', href: '#contact' },
]

const projects = [
  {
    number: 'I',
    title: 'LocalFix',
    field: 'Civic technology / Android',
    thesis: 'Giving neighbourhood problems a clear route to collective action.',
    description:
      'A community issue-reporting application where residents document infrastructure problems, add evidence, vote, and help urgent reports rise.',
    tools: ['Java', 'Firebase', 'Android', 'Maps API'],
    motif: 'map',
    annotation: 'Notice · document · gather · resolve',
  },
  {
    number: 'II',
    title: 'Spam Classifier',
    field: 'Machine learning / NLP',
    thesis: 'A useful prediction begins with evidence, not confidence alone.',
    description:
      'An end-to-end text classification study spanning preparation, TF-IDF features, three-model comparison, measured evaluation, and real-time analysis.',
    tools: ['Python', 'Scikit-learn', 'NLP', 'Streamlit'],
    motif: 'classifier',
    annotation: 'Prepare · compare · measure · explain',
  },
  {
    number: 'III',
    title: 'Hospital System',
    field: 'Systems programming / C',
    thesis: 'Reliable records, built patiently from first principles.',
    description:
      'A file-backed management system for patient, doctor, and appointment records, designed around persistence, validation, and dependable workflows.',
    tools: ['C', 'File handling', 'Data structures', 'Validation'],
    motif: 'ledger',
    annotation: 'Record · validate · persist · retrieve',
  },
]

const disciplines = [
  ['Intelligent systems', 'PyTorch · TensorFlow · Scikit-learn · NLP · Transformers · CNN · RNN'],
  ['Software engineering', 'Java · Python · C++ · C · Spring Boot · REST APIs · SQL · Git'],
  ['Mobile development', 'Android Studio · Java · Firebase · XML · Google Maps API'],
]

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
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.95, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function TypesetLine({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="typeset-line" aria-label={text}>
      {text.split('').map((letter, index) => (
        <span className="letter-mask" aria-hidden="true" key={`${letter}-${index}`}>
          <motion.i
            initial={{ y: '112%', rotate: index % 2 ? 2 : -2 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 1.05, delay: delay + index * 0.045, ease }}
          >
            {letter}
          </motion.i>
        </span>
      ))}
    </span>
  )
}

function Chapter({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return (
    <Reveal className="chapter">
      <p><span>{number}</span>{eyebrow}</p>
      <h2>{title}</h2>
      <i aria-hidden="true" />
    </Reveal>
  )
}

function ProjectPlate({ motif, number }: { motif: string; number: string }) {
  return (
    <div className={`project-plate plate-${motif}`} aria-hidden="true">
      <div className="plate-head"><span>Working study</span><span>Plate {number}</span></div>
      {motif === 'map' && (
        <div className="map-study">
          <span className="route route-one" /><span className="route route-two" /><span className="route route-three" />
          <i className="map-node node-one"><b>12</b></i><i className="map-node node-two"><b>07</b></i><i className="map-node node-three"><b>24</b></i>
          <em className="map-focus" />
        </div>
      )}
      {motif === 'classifier' && (
        <div className="classifier-study">
          <div><span>Project notes for Monday</span><i>SAFE</i></div>
          <div className="flagged"><span>Claim your prize today</span><i>SPAM</i></div>
          <div><span>Your application update</span><i>SAFE</i></div>
          <p><span>Measured confidence</span><b>98.4%</b></p>
          <em className="reading-line" />
        </div>
      )}
      {motif === 'ledger' && (
        <div className="ledger-study">
          <div className="ledger-label"><span>ID</span><span>Patient</span><span>Status</span></div>
          <div><span>1024</span><span>Nadia Rahman</span><i>Checked in</i></div>
          <div><span>1025</span><span>Fahim Islam</span><i>Waiting</i></div>
          <div><span>1026</span><span>Samira Khan</span><i>Complete</i></div>
          <div><span>1027</span><span>Adnan Karim</span><i>Waiting</i></div>
          <em className="ledger-reader" />
        </div>
      )}
      <div className="plate-foot"><span>Ashraf Hamid Mojumder</span><span>Dhaka / 2026</span></div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('work')
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  const orbitX = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 })
  const orbitY = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 })

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      window.localStorage.setItem('ahm-theme', theme)
    } catch {
      // The choice still applies for the current visit.
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#11100e' : '#f1eadc')
  }, [theme])

  useEffect(() => {
    const sections = navigation
      .map((item) => document.querySelector(item.href))
      .filter((item): item is Element => Boolean(item))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-30% 0px -62%', threshold: 0.05 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', closeMenu)
    return () => window.removeEventListener('keydown', closeMenu)
  }, [])

  const moveOrbit = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    orbitX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 22)
    orbitY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 16)
  }

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />

      <div className="folio-opening" aria-hidden="true">
        {[0, 1, 2, 3].map((panel) => <span key={panel} style={{ '--panel': panel } as CSSProperties}><i>AHM</i></span>)}
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Ashraf Hamid Mojumder, home">
          <b>AHM</b><span>Selected works</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} className={activeSection === item.href.slice(1) ? 'active' : ''}>
              <span>0{index + 1}</span>{item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }} transition={{ duration: 0.2 }} aria-hidden="true">
                {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              </motion.span>
            </AnimatePresence>
            <i>{theme === 'light' ? 'Dark' : 'Light'}</i>
          </button>
          <a className="header-mail" href="mailto:ashrafhamidmajumder@gmail.com">Correspondence <ArrowUpRight size={13} /></a>
          <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation">
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
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
        <section className="title-page" id="top" onPointerMove={moveOrbit} onPointerLeave={() => { orbitX.set(0); orbitY.set(0) }}>
          <div className="page-frame" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="title-meta">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15, duration: 0.8 }}>A digital folio / Volume I</motion.span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.22, duration: 0.8 }}>Dhaka, Bangladesh / MMXXVI</motion.span>
          </div>

          <motion.div className="monogram-orbit" style={{ x: orbitX, y: orbitY }} initial={{ opacity: 0, scale: 0.72 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.65, ease }} aria-hidden="true">
            <span className="orbit-ring" />
            <span className="orbit-word north">Think</span><span className="orbit-word east">Measure</span><span className="orbit-word south">Build</span><span className="orbit-word west">Return</span>
            <b>AHM</b>
          </motion.div>

          <div className="hero-name">
            <h1>
              <TypesetLine text="ASHRAF" delay={0.62} />
              <span className="name-interlude">
                <motion.i initial={{ opacity: 0, scaleX: 0.4 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.9, delay: 1.02, ease }} />
                <motion.em initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.12, ease }}>Hamid</motion.em>
                <motion.small initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.25 }}>Software engineer<br />AI / ML builder</motion.small>
              </span>
              <TypesetLine text="MOJUMDER" delay={0.82} />
            </h1>
          </div>

          <motion.div className="title-foot" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.52, duration: 0.8, ease }}>
            <p>Intelligent systems, dependable software,<br />and useful Android experiences.</p>
            <a href="#work">Enter the folio <ArrowDown size={14} /></a>
          </motion.div>
          <span className="edition-mark" aria-hidden="true">No. 01<br />Est. 2024</span>
        </section>

        <section className="prologue">
          <div className="prologue-index"><span>Prologue</span><i /></div>
          <Reveal className="prologue-copy">
            <p>Engineering should feel <em>quietly inevitable</em>—complex beneath the surface, clear in the hands of the person using it.</p>
          </Reveal>
          <div className="prologue-marquee" aria-hidden="true"><span>Clarity · Evidence · Patience · Utility · Clarity · Evidence · Patience · Utility · </span></div>
        </section>

        <section className="selected-work page-shell" id="work">
          <Chapter number="01" eyebrow="Selected work" title="Studies in useful software." />
          <div className="work-list">
            {projects.map((project, index) => (
              <motion.article
                className="work-item"
                key={project.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.14 }}
                transition={{ duration: 1, delay: index * 0.06, ease }}
              >
                <div className="work-copy">
                  <div className="work-label"><span>{project.number}</span><p>{project.field}</p></div>
                  <h3>{project.title}</h3>
                  <p className="work-thesis">{project.thesis}</p>
                  <p className="work-description">{project.description}</p>
                  <div className="work-tools">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
                  <p className="work-annotation">{project.annotation}</p>
                </div>
                <ProjectPlate motif={project.motif} number={project.number} />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="profile page-shell" id="profile">
          <Chapter number="02" eyebrow="Profile" title="Patient with problems. Precise with proof." />
          <div className="profile-grid">
            <Reveal className="profile-lead"><p>I work where theory has to become something <em>real.</em></p></Reveal>
            <Reveal className="profile-body" delay={0.08}>
              <p>My foundation spans algorithms, machine learning, deep learning, backend systems, and Android development. I am most interested in the moment when an idea has to survive real data, real constraints, and real users.</p>
              <p>I care about honest evaluation, careful implementation, and solutions that earn their complexity.</p>
            </Reveal>
            <Reveal className="profile-facts" delay={0.14}>
              <div><span>Education</span><b>BSc in Computer Science</b></div>
              <div><span>Academic record</span><b>3.90 / 4.00 CGPA</b></div>
              <div><span>Primary focus</span><b>Applied AI & software systems</b></div>
              <div><span>Based in</span><b>Bangladesh</b></div>
            </Reveal>
          </div>
        </section>

        <section className="discipline" id="discipline">
          <div className="discipline-frame">
            <Chapter number="03" eyebrow="Discipline" title="Tools change. Judgement endures." />
            <div className="discipline-list">
              {disciplines.map(([title, tools], index) => (
                <Reveal className="discipline-row" key={title} delay={index * 0.08}>
                  <span>0{index + 1}</span><h3>{title}</h3><p>{tools}</p><i aria-hidden="true" />
                </Reveal>
              ))}
            </div>
            <div className="practice-register">
              <Reveal className="register-intro"><span>Practice register</span><p>The quiet repetition behind every finished thing.</p></Reveal>
              <div className="register-numbers">
                <Reveal><strong>600<sup>+</sup></strong><p>LeetCode problems</p></Reveal>
                <Reveal delay={0.06}><strong>142</strong><p>Codeforces problems</p></Reveal>
                <Reveal delay={0.12}><strong>3.90</strong><p>Academic CGPA</p></Reveal>
              </div>
            </div>
          </div>
        </section>

        <section className="correspondence" id="contact">
          <div className="correspondence-rule"><span>04 / Correspondence</span><span>Available for thoughtful work</span></div>
          <Reveal className="correspondence-title"><p>Have a difficult idea?</p><h2>Let&apos;s give it<br /><em>good form.</em></h2></Reveal>
          <div className="correspondence-foot">
            <a className="write-button" href="mailto:ashrafhamidmajumder@gmail.com?subject=Let%27s%20work%20together">Write to Ashraf <Send size={16} /></a>
            <div>
              <a href="mailto:ashrafhamidmajumder@gmail.com"><Mail size={14} /> ashrafhamidmajumder@gmail.com</a>
              <span><MapPin size={14} /> Bangladesh / GMT+6</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a href="#top">AHM</a>
        <p>Software engineer / AI-ML builder / Android developer</p>
        <div><a href="https://github.com/ash-rafhamid" target="_blank" rel="noreferrer">GitHub</a><a href="https://linkedin.com/in/ashrafhamid096" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://leetcode.com/u/ash-rafhamid" target="_blank" rel="noreferrer">LeetCode</a></div>
      </footer>
    </MotionConfig>
  )
}

export default App
