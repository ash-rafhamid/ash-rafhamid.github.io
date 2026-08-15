import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  Braces,
  Code2,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Moon,
  Send,
  Smartphone,
  Sun,
  X,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

const navigation = [
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Work', href: '#work' },
  { label: 'Practice', href: '#practice' },
  { label: 'Contact', href: '#contact' },
]

const expertise = [
  {
    icon: BrainCircuit,
    index: 'I',
    title: 'Intelligent Systems',
    description:
      'Machine learning and deep learning systems grounded in sound evaluation—not just a convincing demo.',
    skills: ['PyTorch', 'TensorFlow', 'NLP', 'Transformers', 'CNN & RNN', 'Scikit-learn'],
  },
  {
    icon: Braces,
    index: 'II',
    title: 'Software Engineering',
    description:
      'Dependable software shaped by careful data structures, clear interfaces, and pragmatic engineering choices.',
    skills: ['Java', 'Python', 'C++', 'Spring Boot', 'REST APIs', 'SQL'],
  },
  {
    icon: Smartphone,
    index: 'III',
    title: 'Mobile Experiences',
    description:
      'Purposeful Android applications that turn real community needs into simple, usable digital tools.',
    skills: ['Android', 'Java', 'Firebase', 'XML', 'Google Maps API'],
  },
]

const projects = [
  {
    number: '01',
    title: 'LocalFix',
    category: 'Civic technology · Android',
    description:
      'A community issue-reporting application for documenting local infrastructure problems, gathering support, and helping the most urgent concerns rise to the surface.',
    details: ['Image-based issue reporting', 'Community voting', 'Firebase data layer', 'Location-aware foundation'],
    tools: 'Android Studio · Java · Firebase · Maps API',
  },
  {
    number: '02',
    title: 'Email Spam Classifier',
    category: 'Applied machine learning · NLP',
    description:
      'An end-to-end text classification system covering preparation, feature extraction, model comparison, evaluation, and an interface for real-time predictions.',
    details: ['TF-IDF feature extraction', 'Three-model comparison', 'Evaluation pipeline', 'Streamlit interface'],
    tools: 'Python · Scikit-learn · NLP · Streamlit',
  },
  {
    number: '03',
    title: 'Hospital Management System',
    category: 'Systems programming · C',
    description:
      'A file-backed management system for patient, doctor, and appointment records, built to practice durable data structures and careful input handling.',
    details: ['Complete CRUD workflow', 'Persistent file storage', 'Custom data structures', 'Input validation'],
    tools: 'C · File handling · Data structures',
  },
]

const principles = ['Thoughtful systems', 'Measured progress', 'Useful intelligence', 'Enduring craft']

const revealEase = [0.22, 1, 0.36, 1] as const

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, delay, ease: revealEase }}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <Reveal className="section-heading">
      <p className="eyebrow"><span>{eyebrow}</span></p>
      <div className="section-heading-row">
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </div>
    </Reveal>
  )
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('portfolio-theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('about')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const sections = navigation
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => Boolean(section))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-30% 0px -55%', threshold: [0.05, 0.25, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const toggleTheme = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'))

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="page-reveal" aria-hidden="true" />

      <header className="site-header">
        <a className="monogram" href="#top" aria-label="Ashraf Hamid Mojumder, home">
          <span>AH</span>
          <span className="monogram-dot">·</span>
          <span>M</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className={activeSection === item.href.slice(1) ? 'active' : ''}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }} transition={{ duration: 0.2 }}>
                {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label="Toggle navigation">
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-navigation"
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {navigation.map((item, index) => (
                <motion.a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
                  <span>0{index + 1}</span>{item.label}
                </motion.a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <motion.p className="hero-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.65 }}>
              Software engineer · Dhaka, Bangladesh
            </motion.p>
            <h1 className="hero-title" aria-label="I build intelligent systems with enduring purpose.">
              {['I build intelligent', 'systems with', 'enduring purpose.'].map((line, index) => (
                <span className={index === 2 ? 'accent-line' : ''} key={line}>
                  <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.18 + index * 0.14, ease: revealEase }}>
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div className="hero-intro" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9, ease: revealEase }}>
              <p>
                I’m <strong>Ashraf Hamid Mojumder</strong>, an engineer working across applied AI, dependable software, and thoughtful Android experiences.
              </p>
              <div className="hero-actions">
                <a className="primary-link" href="#work">Explore selected work <ArrowDownRight size={17} /></a>
                <a className="text-link" href="mailto:ashrafhamidmajumder@gmail.com">Start a conversation</a>
              </div>
            </motion.div>
          </div>

          <motion.aside className="hero-plate" aria-label="Professional profile summary" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.7, ease: revealEase }}>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="plate-axis plate-axis-horizontal" />
            <div className="plate-axis plate-axis-vertical" />
            <div className="plate-core">
              <span>AHM</span>
              <small>Est. 2024</small>
            </div>
            <span className="plate-mark mark-one">AI</span>
            <span className="plate-mark mark-two">01</span>
            <span className="plate-mark mark-three">ML</span>
            <span className="plate-caption">Engineer · Researcher · Builder</span>
          </motion.aside>

          <motion.a className="scroll-cue" href="#about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35, duration: 0.6 }}>
            <span>Read onward</span><ArrowDownRight size={16} />
          </motion.a>
        </section>

        <div className="principles-strip" aria-hidden="true">
          <div className="principles-track">
            {[...principles, ...principles].map((principle, index) => (
              <span key={`${principle}-${index}`}>{principle}<i>✦</i></span>
            ))}
          </div>
        </div>

        <section className="section about" id="about">
          <SectionHeading eyebrow="Chapter I · About" title="Curiosity, disciplined by craft." note="A concise portrait" />
          <div className="about-grid">
            <Reveal className="about-lead">
              <p className="drop-cap">
                I approach engineering as a patient act of translation: turning difficult ideas into systems that feel clear, useful, and trustworthy.
              </p>
              <p>
                My computer science foundation spans algorithms, machine learning, deep learning, and mobile development. I am especially drawn to the point where theory becomes a working product—where models are evaluated honestly and software earns its place in someone’s day.
              </p>
            </Reveal>
            <Reveal className="about-aside" delay={0.12}>
              <blockquote>
                “The goal is not complexity. The goal is a useful answer, carefully made.”
              </blockquote>
              <dl className="fact-list">
                <div><dt>Education</dt><dd>BSc in Computer Science</dd></div>
                <div><dt>Academic record</dt><dd>3.90 / 4.00 CGPA</dd></div>
                <div><dt>Primary interests</dt><dd>Applied AI & software systems</dd></div>
                <div><dt>Based in</dt><dd>Bangladesh</dd></div>
              </dl>
            </Reveal>
          </div>
        </section>

        <section className="section expertise" id="expertise">
          <SectionHeading eyebrow="Chapter II · Expertise" title="A considered technical practice." note="Three fields of focus" />
          <div className="expertise-list">
            {expertise.map((item, index) => (
              <Reveal className="expertise-item" key={item.title} delay={index * 0.08}>
                <div className="expertise-index">{item.index}</div>
                <item.icon className="expertise-icon" strokeWidth={1.35} />
                <div className="expertise-copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ul>
                    {item.skills.map((skill) => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="method-note">
            <span className="method-symbol">∴</span>
            <p><strong>Method over fashion.</strong> Understand the problem, establish a baseline, measure honestly, and refine with purpose.</p>
          </Reveal>
        </section>

        <section className="section work" id="work">
          <SectionHeading eyebrow="Chapter III · Selected work" title="Projects built to be useful." note="A selected index" />
          <div className="projects-list">
            {projects.map((project, index) => (
              <Reveal className="project" key={project.number} delay={index * 0.08}>
                <div className="project-heading">
                  <span className="project-number">{project.number}</span>
                  <p>{project.category}</p>
                </div>
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                </div>
                <div className="project-meta">
                  <ul>{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                  <p>{project.tools}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="work-footer">
            <p>For source code, experiments, and works in progress—</p>
            <a className="text-link arrow-link" href="https://github.com/ash-rafhamid" target="_blank" rel="noreferrer">Visit my GitHub archive <ArrowUpRight size={16} /></a>
          </Reveal>
        </section>

        <section className="section practice" id="practice">
          <SectionHeading eyebrow="Chapter IV · Practice" title="Progress, kept in motion." note="The working discipline" />
          <div className="practice-grid">
            <Reveal className="practice-statement">
              <GraduationCap strokeWidth={1.25} />
              <p>
                I believe fluency comes from returning to the fundamentals: solving, testing, reading, and building—again and again.
              </p>
            </Reveal>
            <div className="stats" aria-label="Practice statistics">
              <Reveal className="stat" delay={0.05}><strong>600<span>+</span></strong><p>LeetCode problems solved</p></Reveal>
              <Reveal className="stat" delay={0.1}><strong>142</strong><p>Codeforces problems solved</p></Reveal>
              <Reveal className="stat" delay={0.15}><strong>3.90</strong><p>Academic CGPA out of 4.00</p></Reveal>
              <Reveal className="stat" delay={0.2}><strong>∞</strong><p>Capacity to keep learning</p></Reveal>
            </div>
          </div>
          <Reveal className="practice-links">
            <a href="https://leetcode.com/u/ash-rafhamid" target="_blank" rel="noreferrer">LeetCode <ArrowUpRight size={15} /></a>
            <a href="https://github.com/ash-rafhamid" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a>
            <a href="https://linkedin.com/in/ashrafhamid096" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} /></a>
          </Reveal>
        </section>

        <section className="section contact" id="contact">
          <Reveal className="contact-card">
            <div className="contact-copy">
              <p className="eyebrow"><span>Final note · Contact</span></p>
              <h2>Let’s make something worth keeping.</h2>
              <p>
                I’m open to thoughtful software, applied AI, and Android opportunities. If you have a problem that deserves careful engineering, I’d be glad to hear about it.
              </p>
              <a className="contact-cta" href="mailto:ashrafhamidmajumder@gmail.com?subject=Let%27s%20work%20together">
                Write to Ashraf <Send size={17} />
              </a>
            </div>
            <div className="contact-details">
              <div><Mail size={18} /><span><small>Email</small><a href="mailto:ashrafhamidmajumder@gmail.com">ashrafhamidmajumder@gmail.com</a></span></div>
              <div><MapPin size={18} /><span><small>Location</small>Bangladesh · GMT+6</span></div>
              <div className="contact-socials">
                <a href="https://github.com/ash-rafhamid" target="_blank" rel="noreferrer" aria-label="GitHub"><span>GH</span></a>
                <a href="https://linkedin.com/in/ashrafhamid096" target="_blank" rel="noreferrer" aria-label="LinkedIn"><span>in</span></a>
                <a href="https://leetcode.com/u/ash-rafhamid" target="_blank" rel="noreferrer" aria-label="LeetCode"><Code2 size={19} /></a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Ashraf Hamid Mojumder</p>
        <p>Designed with restraint. Built with care.</p>
        <a href="#top">Back to the beginning ↑</a>
      </footer>
    </MotionConfig>
  )
}

export default App
