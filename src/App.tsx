import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Code2,
  Database,
  Mail,
  MapPin,
  Menu,
  Send,
  Smartphone,
  X,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#stack' },
  { label: 'Practice', href: '#practice' },
  { label: 'Contact', href: '#contact' },
]

const projects = [
  {
    id: '01',
    slug: 'localfix',
    title: 'LocalFix',
    type: 'Civic technology / Android',
    statement: 'Turning neighbourhood problems into visible, actionable reports.',
    description:
      'A community platform for reporting damaged roads, broken streetlights, and other local issues. Residents can add evidence, support important reports, and help urgent problems get noticed.',
    features: ['Image-led reporting', 'Community voting', 'Firebase data layer', 'Location-ready architecture'],
    tools: ['Android', 'Java', 'Firebase', 'Maps API'],
  },
  {
    id: '02',
    slug: 'spam',
    title: 'Spam Classifier',
    type: 'Applied machine learning / NLP',
    statement: 'An end-to-end text classifier, measured before it is trusted.',
    description:
      'A complete machine learning pipeline for classifying messages in real time, from text preparation and TF-IDF features to model comparison, evaluation, and a usable Streamlit interface.',
    features: ['TF-IDF extraction', 'Three-model comparison', 'Evaluation pipeline', 'Live prediction UI'],
    tools: ['Python', 'Scikit-learn', 'NLP', 'Streamlit'],
  },
  {
    id: '03',
    slug: 'hospital',
    title: 'Hospital System',
    type: 'Systems programming / C',
    statement: 'Reliable record management built from first principles.',
    description:
      'A file-backed system for patient, doctor, and appointment records. Built to strengthen low-level reasoning around data structures, persistence, validation, and dependable workflows.',
    features: ['Complete CRUD flow', 'Persistent file storage', 'Custom data structures', 'Input validation'],
    tools: ['C', 'File handling', 'Data structures'],
  },
]

const stack = [
  {
    number: '01',
    title: 'Intelligence',
    icon: BrainCircuit,
    summary: 'Models, experiments, and evaluation for problems where useful predictions matter.',
    tools: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'NLP', 'Transformers', 'CNN', 'RNN'],
  },
  {
    number: '02',
    title: 'Engineering',
    icon: Code2,
    summary: 'Clear, maintainable systems shaped around strong fundamentals and practical constraints.',
    tools: ['Java', 'Python', 'C++', 'C', 'Spring Boot', 'REST APIs', 'SQL', 'Git'],
  },
  {
    number: '03',
    title: 'Mobile',
    icon: Smartphone,
    summary: 'Android experiences that make complex community workflows feel direct and simple.',
    tools: ['Android Studio', 'Java', 'Firebase', 'XML', 'Google Maps API'],
  },
]

const ease = [0.22, 1, 0.36, 1] as const

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <Reveal className="section-title">
      <div className="section-tag"><span>{index}</span>{label}</div>
      <h2>{title}</h2>
    </Reveal>
  )
}

function LocalFixVisual() {
  return (
    <div className="product-visual localfix-visual" aria-hidden="true">
      <div className="map-grid" />
      <span className="map-road road-one" />
      <span className="map-road road-two" />
      <span className="map-pin pin-one">3</span>
      <span className="map-pin pin-two">1</span>
      <div className="issue-sheet">
        <div className="sheet-top"><span>REPORT / 024</span><i>OPEN</i></div>
        <div className="issue-photo"><span /><span /></div>
        <strong>Broken streetlight</strong>
        <small>Dhanmondi, Dhaka</small>
        <div className="vote-row"><b>+ 28</b><span>Support this issue</span></div>
      </div>
    </div>
  )
}

function SpamVisual() {
  return (
    <div className="product-visual spam-visual" aria-hidden="true">
      <div className="classifier-head"><span>MESSAGE ANALYSIS</span><i>MODEL 03</i></div>
      <div className="message-card message-a">
        <span className="avatar">JD</span>
        <div><b>Project update for Monday</b><small>Attached is the latest progress...</small></div>
        <strong>SAFE</strong>
      </div>
      <div className="message-card message-b">
        <span className="avatar">?</span>
        <div><b>YOU HAVE WON $50,000!!!</b><small>Claim your reward immediately...</small></div>
        <strong>SPAM</strong>
      </div>
      <div className="score-panel">
        <span><small>Confidence</small><b>98.4%</b></span>
        <div className="score-track"><i /></div>
      </div>
    </div>
  )
}

function HospitalVisual() {
  return (
    <div className="product-visual hospital-visual" aria-hidden="true">
      <div className="hospital-sidebar"><Database size={22} /><span /><span /><span /></div>
      <div className="hospital-main">
        <div className="hospital-head"><span>HOSPITAL / RECORDS</span><i>+ NEW PATIENT</i></div>
        <div className="hospital-stats"><span><small>Patients</small><b>1,284</b></span><span><small>Doctors</small><b>42</b></span><span><small>Today</small><b>18</b></span></div>
        <div className="record-table">
          <div><b>ID</b><b>PATIENT</b><b>STATUS</b></div>
          <div><span>#1024</span><span>Nadia Rahman</span><i>CHECKED IN</i></div>
          <div><span>#1025</span><span>Fahim Islam</span><i>WAITING</i></div>
          <div><span>#1026</span><span>Samira Khan</span><i>COMPLETE</i></div>
        </div>
      </div>
    </div>
  )
}

function ProjectVisual({ slug }: { slug: string }) {
  if (slug === 'localfix') return <LocalFixVisual />
  if (slug === 'spam') return <SpamVisual />
  return <HospitalVisual />
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('work')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => Boolean(section))
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting)
        if (current?.target.id) setActiveSection(current.target.id)
      },
      { rootMargin: '-30% 0px -60%', threshold: 0.05 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="load-screen" aria-hidden="true"><span>AHM</span></div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Ashraf Hamid Mojumder, home">
          <span className="brand-mark">A</span>
          <span className="brand-name">Ashraf Hamid<br />Mojumder</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={activeSection === item.href.slice(1) ? 'active' : ''}>{item.label}</a>
          ))}
        </nav>

        <a className="header-contact" href="mailto:ashrafhamidmajumder@gmail.com">Let&apos;s talk <ArrowUpRight size={15} /></a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label="Toggle navigation">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.45, ease }}>
              {navItems.map((item, index) => (
                <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item.label}</a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <motion.div className="availability" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
            <span className="status-dot" /> Open to opportunities
          </motion.div>

          <div className="hero-headline">
            <p className="hero-label">Software engineer / AI-ML builder / Android developer</p>
            <h1 aria-label="Ashraf Hamid Mojumder">
              {['ASHRAF', 'HAMID', 'MOJUMDER'].map((word, index) => (
                <span key={word} className={index === 1 ? 'outline-word' : ''}>
                  <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.12 + index * 0.11, ease }}>{word}</motion.span>
                </span>
              ))}
            </h1>
          </div>

          <motion.div className="hero-bottom" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.7, ease }}>
            <p>I build intelligent, dependable software for problems that exist beyond the screen.</p>
            <a href="#work">See selected work <ArrowDown size={17} /></a>
          </motion.div>

          <motion.div className="system-window window-one" initial={{ opacity: 0, x: 30, rotate: 3 }} animate={{ opacity: 1, x: 0, rotate: -2 }} transition={{ delay: 0.9, duration: 0.7, ease }} aria-hidden="true">
            <div className="window-bar"><i /><i /><i /><span>learning.log</span></div>
            <pre><em>01</em> model.fit(data)<br /><em>02</em> evaluate(baseline)<br /><em>03</em> iterate(with_purpose)<br /><b>04</b> ship(what_matters)</pre>
          </motion.div>

          <motion.div className="system-window window-two" initial={{ opacity: 0, x: -20, rotate: -3 }} animate={{ opacity: 1, x: 0, rotate: 2 }} transition={{ delay: 1.02, duration: 0.7, ease }} aria-hidden="true">
            <div className="window-bar"><i /><i /><i /><span>profile.sys</span></div>
            <div className="profile-readout"><span>600+</span><small>problems solved</small><b>Dhaka / BD</b></div>
          </motion.div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div>{[...Array(2)].flatMap((_, copy) => ['Machine Learning', 'Software Engineering', 'Android Development', 'Problem Solving'].map((item) => <span key={`${copy}-${item}`}>{item}<i>+</i></span>))}</div>
        </div>

        <section className="section work" id="work">
          <SectionTitle index="01" label="Selected work" title="Things I have built." />
          <div className="projects">
            {projects.map((project, index) => (
              <Reveal className={`project project-${project.slug}`} key={project.id}>
                <div className="project-topline"><span>PROJECT / {project.id}</span><span>{project.type}</span></div>
                <div className="project-layout">
                  <div className="project-copy">
                    <h3>{project.title}</h3>
                    <p className="project-statement">{project.statement}</p>
                    <p className="project-description">{project.description}</p>
                    <ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                    <div className="tool-list">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
                  </div>
                  <ProjectVisual slug={project.slug} />
                </div>
                <span className="project-giant-number" aria-hidden="true">{index + 1}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section about" id="about">
          <SectionTitle index="02" label="About me" title="Theory in. Useful systems out." />
          <div className="about-layout">
            <Reveal className="about-main">
              <p className="about-lead">I am a software engineer who likes hard problems, clear thinking, and products that improve something real.</p>
              <p>My computer science foundation spans algorithms, machine learning, deep learning, backend systems, and Android development. I am most interested in the moment where an idea has to survive contact with real data, real constraints, and real users.</p>
            </Reveal>
            <Reveal className="about-data" delay={0.12}>
              <div><span>Education</span><strong>BSc in Computer Science</strong></div>
              <div><span>Academic record</span><strong>3.90 / 4.00 CGPA</strong></div>
              <div><span>Focus</span><strong>Applied AI + software systems</strong></div>
              <div><span>Location</span><strong>Bangladesh / GMT+6</strong></div>
            </Reveal>
          </div>
          <Reveal className="belief-line"><span>My rule</span><p>Understand the problem. Build the baseline. Measure honestly. Improve what matters.</p></Reveal>
        </section>

        <section className="section stack" id="stack">
          <SectionTitle index="03" label="Capabilities" title="A stack built for making." />
          <div className="stack-list">
            {stack.map((group, index) => (
              <Reveal className="stack-row" key={group.title} delay={index * 0.06}>
                <span className="stack-number">{group.number}</span>
                <group.icon className="stack-icon" strokeWidth={1.35} />
                <div className="stack-title"><h3>{group.title}</h3><p>{group.summary}</p></div>
                <div className="stack-tools">{group.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section practice" id="practice">
          <SectionTitle index="04" label="The numbers" title="Consistency compounds." />
          <div className="metrics">
            <Reveal className="metric metric-featured"><span>01</span><strong>600<sup>+</sup></strong><p>LeetCode problems solved across difficulty levels.</p></Reveal>
            <Reveal className="metric"><span>02</span><strong>142</strong><p>Codeforces problems and counting.</p></Reveal>
            <Reveal className="metric"><span>03</span><strong>3.90</strong><p>CGPA out of 4.00 in Computer Science.</p></Reveal>
            <Reveal className="metric metric-note"><span>Always</span><p>Learning through algorithms, Kaggle experiments, and building complete products.</p></Reveal>
          </div>
          <Reveal className="profile-links">
            <a href="https://leetcode.com/u/ash-rafhamid" target="_blank" rel="noreferrer">LeetCode <ArrowUpRight size={15} /></a>
            <a href="https://github.com/ash-rafhamid" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a>
            <a href="https://linkedin.com/in/ashrafhamid096" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} /></a>
          </Reveal>
        </section>

        <section className="contact" id="contact">
          <Reveal className="contact-inner">
            <div className="contact-meta"><span>05 / Contact</span><span><i /> Available for good work</span></div>
            <h2>Have a hard problem?<br /><em>Let&apos;s build the answer.</em></h2>
            <div className="contact-bottom">
              <a className="contact-button" href="mailto:ashrafhamidmajumder@gmail.com?subject=Let%27s%20build%20something">Start a conversation <Send size={18} /></a>
              <div className="contact-info">
                <a href="mailto:ashrafhamidmajumder@gmail.com"><Mail size={16} /> ashrafhamidmajumder@gmail.com</a>
                <span><MapPin size={16} /> Bangladesh</span>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <a href="#top" className="footer-brand">AHM<span>/26</span></a>
        <p>Software engineer / AI-ML builder / Android developer</p>
        <a href="#top">Back to top <ArrowRight size={14} /></a>
      </footer>
    </MotionConfig>
  )
}

export default App
