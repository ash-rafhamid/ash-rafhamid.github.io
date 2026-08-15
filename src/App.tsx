import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Mail, MapPin, Menu, Moon, Send, Sun, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react'

const navigation = [
  { label: 'Selected work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Practice', href: '#practice' },
  { label: 'Contact', href: '#contact' },
]

const projects = [
  {
    number: '01',
    title: 'LocalFix',
    discipline: 'Android / Civic technology',
    thesis: 'A clearer path from a local problem to collective action.',
    description:
      'A community issue-reporting application designed around the simple act of noticing what needs attention. Residents document infrastructure problems, add evidence, vote, and help urgent reports rise.',
    contributions: ['Image-led reports', 'Community voting', 'Firebase data layer', 'Location-ready design'],
    tools: 'Android Studio, Java, Firebase, Maps API',
    motif: 'map',
    tone: 'paper',
  },
  {
    number: '02',
    title: 'Spam Classifier',
    discipline: 'Machine learning / NLP',
    thesis: 'A prediction is only useful when its reasoning has been measured.',
    description:
      'An end-to-end text classification pipeline covering preparation, TF-IDF feature extraction, model comparison, evaluation, and an interface for real-time message analysis.',
    contributions: ['TF-IDF features', 'Three-model comparison', 'Measured evaluation', 'Streamlit interface'],
    tools: 'Python, Scikit-learn, NLP, Streamlit',
    motif: 'classifier',
    tone: 'ink',
  },
  {
    number: '03',
    title: 'Hospital System',
    discipline: 'Systems programming / C',
    thesis: 'Reliable records, built patiently from first principles.',
    description:
      'A file-backed management system for patient, doctor, and appointment records, created to strengthen low-level reasoning around persistence, validation, and durable workflows.',
    contributions: ['Complete CRUD flow', 'Persistent storage', 'Custom structures', 'Input validation'],
    tools: 'C, File handling, Data structures',
    motif: 'ledger',
    tone: 'paper-deep',
  },
]

const capabilities = [
  {
    label: 'Intelligent systems',
    note: 'Models that are tested before they are trusted.',
    items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'NLP', 'Transformers', 'CNN', 'RNN', 'Pandas', 'NumPy'],
  },
  {
    label: 'Software engineering',
    note: 'Clear systems built on dependable fundamentals.',
    items: ['Java', 'Python', 'C++', 'C', 'Spring Boot', 'REST APIs', 'SQL', 'Git'],
  },
  {
    label: 'Mobile development',
    note: 'Useful Android experiences for real workflows.',
    items: ['Android Studio', 'Java', 'Firebase', 'XML', 'Google Maps API'],
  },
]

const ease = [0.22, 1, 0.36, 1] as const
type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const storedTheme = window.localStorage.getItem('ahm-theme')
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  } catch {
    // Fall back to the portfolio's light default when storage is unavailable.
  }
  return 'light'
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({ number, label, title }: { number: string; label: string; title: string }) {
  return (
    <Reveal className="section-heading">
      <div className="chapter-label"><span>{number}</span><span>{label}</span></div>
      <h2>{title}</h2>
    </Reveal>
  )
}

function MapMotif() {
  return (
    <div className="project-motif map-motif" aria-hidden="true">
      <span className="map-line line-a" /><span className="map-line line-b" /><span className="map-line line-c" />
      <i className="location location-a"><b>12</b></i>
      <i className="location location-b"><b>07</b></i>
      <i className="location location-c"><b>24</b></i>
      <div className="map-caption"><span>Issue density</span><strong>43 open reports</strong></div>
    </div>
  )
}

function ClassifierMotif() {
  return (
    <div className="project-motif classifier-motif" aria-hidden="true">
      <div className="message-line"><span>Project notes for Monday</span><i>SAFE</i></div>
      <div className="message-line flagged"><span>Claim your prize today!!!</span><i>SPAM</i></div>
      <div className="message-line"><span>Your application update</span><i>SAFE</i></div>
      <div className="confidence"><span>Model confidence</span><strong>98.4%</strong><div><i /></div></div>
      <b className="scan-line" />
    </div>
  )
}

function LedgerMotif() {
  return (
    <div className="project-motif ledger-motif" aria-hidden="true">
      <div className="ledger-head"><span>ID</span><span>Patient</span><span>Status</span></div>
      <div><span>1024</span><span>Nadia Rahman</span><i>Checked in</i></div>
      <div><span>1025</span><span>Fahim Islam</span><i>Waiting</i></div>
      <div><span>1026</span><span>Samira Khan</span><i>Complete</i></div>
      <div><span>1027</span><span>Adnan Karim</span><i>Waiting</i></div>
      <b className="ledger-cursor" />
    </div>
  )
}

function ProjectMotif({ motif }: { motif: string }) {
  if (motif === 'map') return <MapMotif />
  if (motif === 'classifier') return <ClassifierMotif />
  return <LedgerMotif />
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('work')
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      window.localStorage.setItem('ahm-theme', theme)
    } catch {
      // The theme still works for this visit when storage is unavailable.
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#12110f' : '#eee9df')
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
      { rootMargin: '-32% 0px -60%', threshold: 0.05 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />

      <div className="opening" aria-hidden="true">
        {['I', 'II', 'III', 'IV'].map((number, index) => <span key={number} style={{ '--panel': index } as CSSProperties}><i>{number}</i></span>)}
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Ashraf Hamid Mojumder, home">
          <span>AHM</span><i>Portfolio</i>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => <a key={item.href} href={item.href} className={activeSection === item.href.slice(1) ? 'active' : ''}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')}
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
          <a className="header-link" href="mailto:ashrafhamidmajumder@gmail.com">Write to me <ArrowUpRight size={14} /></a>
          <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
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
        <section className="hero" id="top">
          <div className="hero-rule" aria-hidden="true"><span /></div>
          <motion.p className="hero-overline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: 0.7 }}>A digital folio / Dhaka, Bangladesh</motion.p>
          <div className="hero-title">
            <h1 aria-label="Ashraf Hamid Mojumder">
              {['Ashraf Hamid', 'Mojumder'].map((line, index) => (
                <span key={line} className={index === 1 ? 'title-italic' : ''}>
                  <motion.i initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ duration: 1.05, delay: 0.58 + index * 0.13, ease }}>{line}</motion.i>
                </span>
              ))}
            </h1>
            <motion.span className="hero-edition" initial={{ opacity: 0, rotate: -8 }} animate={{ opacity: 1, rotate: -3 }} transition={{ delay: 1.15, duration: 0.7 }}>Est.<br />2024</motion.span>
          </div>

          <motion.div className="hero-statement" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.12, duration: 0.8, ease }}>
            <p>Software engineer building intelligent systems, dependable software, and useful Android experiences.</p>
            <div className="hero-actions">
              <a href="#work">Selected work <ArrowDown size={15} /></a>
              <a href="mailto:ashrafhamidmajumder@gmail.com">Start a conversation</a>
            </div>
          </motion.div>

          <div className="hero-aside" aria-hidden="true">
            <span>Think</span><span>Measure</span><span>Build</span>
          </div>
          <span className="hero-folio" aria-hidden="true">Folio No. 01</span>
        </section>

        <section className="manifesto">
          <Reveal className="manifesto-inner">
            <p className="manifesto-index">01 / Point of view</p>
            <p>I believe the best engineering feels <em>inevitable</em>: complex beneath the surface, clear in the hands of the person using it.</p>
          </Reveal>
          <div className="manifesto-line" aria-hidden="true"><span /></div>
        </section>

        <section className="work" id="work">
          <div className="section-shell">
            <SectionHeading number="02" label="Selected work" title="Three studies in useful software." />
          </div>
          <div className="project-stack">
            {projects.map((project, index) => (
              <motion.article
                className={`project-page tone-${project.tone}`}
                style={{ '--page-index': index } as CSSProperties}
                key={project.number}
                initial={{ opacity: 0.6, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.9, ease }}
              >
                <div className="page-head"><span>Case study / {project.number}</span><span>{project.discipline}</span></div>
                <div className="page-grid">
                  <div className="project-copy">
                    <span className="project-number">{project.number}</span>
                    <h3>{project.title}</h3>
                    <p className="project-thesis">{project.thesis}</p>
                    <p className="project-description">{project.description}</p>
                  </div>
                  <ProjectMotif motif={project.motif} />
                  <div className="project-notes">
                    <div><span>Contribution</span><ul>{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul></div>
                    <div><span>Tools</span><p>{project.tools}</p></div>
                  </div>
                </div>
                <div className="page-foot"><span>Ashraf Hamid Mojumder</span><span>{String(index + 1).padStart(2, '0')} / 03</span></div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="about section-shell" id="about">
          <SectionHeading number="03" label="About" title="A patient approach to difficult problems." />
          <div className="about-grid">
            <Reveal className="about-lead">
              <p>I work where theory must become something real.</p>
            </Reveal>
            <Reveal className="about-copy" delay={0.1}>
              <p>My foundation spans algorithms, machine learning, deep learning, backend systems, and Android development. I am most interested in the moment when an idea has to survive real data, real constraints, and real users.</p>
              <p>I care about honest evaluation, careful implementation, and solutions that earn their complexity.</p>
            </Reveal>
            <Reveal className="about-facts" delay={0.16}>
              <div><span>Education</span><strong>BSc in Computer Science</strong></div>
              <div><span>Academic record</span><strong>3.90 / 4.00 CGPA</strong></div>
              <div><span>Primary focus</span><strong>Applied AI & software systems</strong></div>
              <div><span>Based in</span><strong>Bangladesh</strong></div>
            </Reveal>
          </div>
        </section>

        <section className="capabilities" id="capabilities">
          <div className="section-shell">
            <SectionHeading number="04" label="Capabilities" title="Tools change. Good judgement endures." />
            <div className="capability-list">
              {capabilities.map((capability, index) => (
                <Reveal className="capability-row" key={capability.label} delay={index * 0.07}>
                  <span className="capability-number">0{index + 1}</span>
                  <div className="capability-title"><h3>{capability.label}</h3><p>{capability.note}</p></div>
                  <div className="capability-tools">{capability.items.map((item) => <span key={item}>{item}</span>)}</div>
                  <i className="capability-line" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="practice section-shell" id="practice">
          <SectionHeading number="05" label="Practice" title="The quiet work behind the work." />
          <div className="practice-ledger">
            <Reveal className="practice-intro"><p>Progress is less dramatic than it looks. It is built through repetition: solve, test, read, make, return.</p></Reveal>
            <div className="practice-stats">
              <Reveal className="practice-stat"><span>01</span><strong>600<sup>+</sup></strong><p>LeetCode problems solved</p></Reveal>
              <Reveal className="practice-stat" delay={0.05}><span>02</span><strong>142</strong><p>Codeforces problems solved</p></Reveal>
              <Reveal className="practice-stat" delay={0.1}><span>03</span><strong>3.90</strong><p>Academic CGPA / 4.00</p></Reveal>
            </div>
          </div>
          <Reveal className="archive-links">
            <span>Public archives</span>
            <a href="https://leetcode.com/u/ash-rafhamid" target="_blank" rel="noreferrer">LeetCode <ArrowUpRight size={14} /></a>
            <a href="https://github.com/ash-rafhamid" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
            <a href="https://linkedin.com/in/ashrafhamid096" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
          </Reveal>
        </section>

        <section className="contact" id="contact">
          <Reveal className="contact-inner">
            <div className="contact-top"><span>06 / Correspondence</span><span>Available for thoughtful work</span></div>
            <h2>Let&apos;s make something<br /><em>worth remembering.</em></h2>
            <div className="contact-bottom">
              <a className="contact-button" href="mailto:ashrafhamidmajumder@gmail.com?subject=Let%27s%20work%20together">Write to Ashraf <Send size={17} /></a>
              <div className="contact-details">
                <a href="mailto:ashrafhamidmajumder@gmail.com"><Mail size={15} /> ashrafhamidmajumder@gmail.com</a>
                <span><MapPin size={15} /> Bangladesh / GMT+6</span>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <a href="#top" className="footer-mark">AHM</a>
        <p>Software engineer / AI-ML builder / Android developer</p>
        <a href="#top">Return to the beginning <ArrowRight size={14} /></a>
      </footer>
    </MotionConfig>
  )
}

export default App
