import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Mail, MapPin, Menu, Moon, Send, Sun, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

const navigation = [
  { label: 'Selected work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Practice', href: '#practice' },
  { label: 'Duel', href: '#duel' },
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

type DuelStatus = 'idle' | 'racing' | 'resolved' | 'complete'
type DuelQuestion = { text: string; answer: number; choices: number[] }

function HumanMachineDuel() {
  const [status, setStatus] = useState<DuelStatus>('idle')
  const [round, setRound] = useState(0)
  const [humanScore, setHumanScore] = useState(0)
  const [modelScore, setModelScore] = useState(0)
  const [question, setQuestion] = useState<DuelQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [predictedMs, setPredictedMs] = useState(2850)
  const [learningCount, setLearningCount] = useState(0)
  const [accuracy, setAccuracy] = useState<string>('—')
  const [verdict, setVerdict] = useState({
    title: '',
    detail: 'The model learns your speed after every answer, then tries to finish just before you.',
  })

  const roundRef = useRef(0)
  const humanScoreRef = useRef(0)
  const modelScoreRef = useRef(0)
  const correctCountRef = useRef(0)
  const answeredCountRef = useRef(0)
  const questionRef = useRef<DuelQuestion | null>(null)
  const activeRef = useRef(false)
  const startedAtRef = useRef(0)
  const biasRef = useRef(2850)
  const difficultyWeightRef = useRef(430)
  const difficultyRef = useRef(1)
  const raceTimerRef = useRef<number | null>(null)
  const advanceTimerRef = useRef<number | null>(null)

  const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value))
  const randomInt = (low: number, high: number) => Math.floor(Math.random() * (high - low + 1)) + low

  function createQuestion(difficulty: number): DuelQuestion {
    let text = ''
    let answer = 0

    if (difficulty <= 1) {
      const a = randomInt(8, 29)
      const b = randomInt(7, 26)
      answer = a + b
      text = `${a} + ${b}`
    } else if (difficulty === 2) {
      const a = randomInt(4, 12)
      const b = randomInt(3, 11)
      answer = a * b
      text = `${a} × ${b}`
    } else {
      const a = randomInt(5, 13)
      const b = randomInt(4, 11)
      const c = randomInt(4, 18)
      answer = a * b - c
      text = `${a} × ${b} − ${c}`
    }

    const choices = new Set([answer])
    while (choices.size < 4) {
      const offset = randomInt(-9, 9) || 2
      choices.add(answer + offset)
    }

    return { text, answer, choices: [...choices].sort(() => Math.random() - 0.5) }
  }

  function getPredictedTime(difficulty: number) {
    return clamp(biasRef.current + difficultyWeightRef.current * (difficulty - 1), 1450, 5200)
  }

  function trainSpeedModel(observedMs: number, difficulty: number) {
    const prediction = getPredictedTime(difficulty)
    const error = clamp(observedMs - prediction, -1800, 1800)
    biasRef.current = clamp(biasRef.current + error * 0.22, 1300, 4500)
    difficultyWeightRef.current = clamp(
      difficultyWeightRef.current + error * 0.07 * (difficulty - 1),
      140,
      950,
    )
    setLearningCount(roundRef.current)
  }

  function endMatch() {
    activeRef.current = false
    setStatus('complete')
    setQuestion(null)
    setSelectedAnswer(null)
    const human = humanScoreRef.current
    const machine = modelScoreRef.current
    if (human > machine) {
      setVerdict({ title: 'You beat the model.', detail: 'Fast, accurate and difficult to predict.' })
    } else if (human === machine) {
      setVerdict({ title: 'Perfectly balanced.', detail: 'The model learned your pace, but could not pass you.' })
    } else {
      setVerdict({ title: 'The machine adapted.', detail: 'It learned your response time and won the match.' })
    }
  }

  function beginRound() {
    const nextRound = roundRef.current + 1
    roundRef.current = nextRound
    setRound(nextRound)
    const difficulty = clamp(
      1 + Math.floor((nextRound - 1) / 2) + (humanScoreRef.current > modelScoreRef.current ? 1 : 0),
      1,
      3,
    )
    difficultyRef.current = difficulty
    const nextQuestion = createQuestion(difficulty)
    questionRef.current = nextQuestion
    setQuestion(nextQuestion)
    setSelectedAnswer(null)
    setVerdict({ title: '', detail: 'Choose the correct answer before the red line reaches the end.' })
    const prediction = getPredictedTime(difficulty)
    setPredictedMs(prediction)
    setStatus('racing')
    activeRef.current = true
    startedAtRef.current = performance.now()
    raceTimerRef.current = window.setTimeout(() => {
      finishRound('model', prediction + 450, null)
    }, prediction)
  }

  function finishRound(winner: 'human' | 'model', observedMs: number, selected: number | null) {
    if (!activeRef.current || !questionRef.current) return
    activeRef.current = false
    if (raceTimerRef.current !== null) window.clearTimeout(raceTimerRef.current)
    setSelectedAnswer(selected)
    setStatus('resolved')
    trainSpeedModel(observedMs, difficultyRef.current)

    if (winner === 'human') {
      humanScoreRef.current += 1
      setHumanScore(humanScoreRef.current)
      setVerdict({
        title: 'Human wins the round.',
        detail: `Answered in ${(observedMs / 1000).toFixed(2)} seconds.`,
      })
    } else {
      modelScoreRef.current += 1
      setModelScore(modelScoreRef.current)
      setVerdict({
        title: 'Machine wins the round.',
        detail: `The answer was ${questionRef.current.answer}.`,
      })
    }

    setAccuracy(
      answeredCountRef.current
        ? `${Math.round((correctCountRef.current / answeredCountRef.current) * 100)}%`
        : '—',
    )
    advanceTimerRef.current = window.setTimeout(() => {
      if (roundRef.current >= 5) endMatch()
      else beginRound()
    }, 1250)
  }

  function chooseAnswer(value: number) {
    if (!activeRef.current || !questionRef.current) return
    const elapsed = performance.now() - startedAtRef.current
    answeredCountRef.current += 1
    if (value === questionRef.current.answer) {
      correctCountRef.current += 1
      finishRound('human', elapsed, value)
    } else {
      finishRound('model', elapsed, value)
    }
  }

  function startMatch() {
    if (raceTimerRef.current !== null) window.clearTimeout(raceTimerRef.current)
    if (advanceTimerRef.current !== null) window.clearTimeout(advanceTimerRef.current)
    roundRef.current = 0
    humanScoreRef.current = 0
    modelScoreRef.current = 0
    correctCountRef.current = 0
    answeredCountRef.current = 0
    biasRef.current = 2850
    difficultyWeightRef.current = 430
    setHumanScore(0)
    setModelScore(0)
    setAccuracy('—')
    setLearningCount(0)
    beginRound()
  }

  useEffect(() => () => {
    if (raceTimerRef.current !== null) window.clearTimeout(raceTimerRef.current)
    if (advanceTimerRef.current !== null) window.clearTimeout(advanceTimerRef.current)
  }, [])

  const finalEyebrow = humanScore > modelScore
    ? 'Humanity prevails'
    : humanScore === modelScore
      ? 'A measured draw'
      : 'The model adapted'

  return (
    <div
      className={`duel-shell ${status === 'racing' ? 'is-racing' : ''}`}
      style={{ '--duel-race-time': `${predictedMs}ms` } as CSSProperties}
    >
      <div className="duel-top"><strong>Human / Machine</strong><span>Adaptive mathematics duel</span></div>
      <div className="duel-scoreboard">
        <div className="duel-score"><span>You</span><output>{humanScore}</output></div>
        <div className="duel-round">{round ? (status === 'complete' ? 'Match complete' : `Round ${round} / 5`) : 'Five-round match'}</div>
        <div className="duel-score"><span>Model</span><output>{modelScore}</output></div>
      </div>

      <div className="duel-arena">
        <div className="duel-model-line">
          <span>Model predicts your response time</span>
          <div className="duel-race-track" aria-hidden="true"><div className="duel-race-bar" /></div>
          <span>{(predictedMs / 1000).toFixed(1)} sec</span>
        </div>

        <div className="duel-question-wrap" aria-live="polite">
          <p className="duel-eyebrow">
            {status === 'idle' ? 'Machine-learning speed trial' : status === 'complete' ? finalEyebrow : 'Answer before the model'}
          </p>
          <p className="duel-question" key={question?.text ?? status}>
            {status === 'idle' ? 'Ready?' : status === 'complete' ? `${humanScore} — ${modelScore}` : `${question?.text} = ?`}
          </p>
        </div>

        <div className="duel-answers" aria-label="Answer choices">
          {question?.choices.map((choice) => {
            const isCorrect = status === 'resolved' && choice === question.answer
            const isWrong = status === 'resolved' && choice === selectedAnswer && choice !== question.answer
            return (
              <button
                className={`duel-answer ${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''}`}
                type="button"
                key={choice}
                onClick={() => chooseAnswer(choice)}
                disabled={status !== 'racing'}
              >
                {choice}
              </button>
            )
          })}
        </div>

        <div className="duel-verdict" aria-live="polite">
          {verdict.title && <strong>{verdict.title}</strong>}
          <span>{verdict.detail}</span>
        </div>

        {(status === 'idle' || status === 'complete') && (
          <button className="duel-start" type="button" onClick={startMatch}>
            {status === 'complete' ? 'Play another match' : 'Begin the duel'} <ArrowRight size={16} />
          </button>
        )}
      </div>

      <div className="duel-foot">
        <span>Online regression model: <strong>{learningCount ? `${learningCount} observations` : 'untrained'}</strong></span>
        <span>Accuracy: <strong>{accuracy}</strong></span>
      </div>
    </div>
  )
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
          {navigation.map((item) => {
            const isDuel = item.href === '#duel'
            return (
              <a
                key={item.href}
                href={item.href}
                className={`${activeSection === item.href.slice(1) ? 'active' : ''}${isDuel ? ' nav-duel' : ''}`.trim()}
                aria-label={isDuel ? 'Play Human versus Machine duel' : undefined}
              >
                {item.label}
                {isDuel && <span className="nav-duel-cue" aria-hidden="true"><i />Play</span>}
              </a>
            )
          })}
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
              {navigation.map((item, index) => {
                const isDuel = item.href === '#duel'
                return (
                  <a key={item.href} href={item.href} className={isDuel ? 'nav-duel' : undefined} aria-label={isDuel ? 'Play Human versus Machine duel' : undefined} onClick={() => setMenuOpen(false)}>
                    <span className="mobile-nav-number">0{index + 1}</span>
                    {item.label}
                    {isDuel && <span className="nav-duel-cue" aria-hidden="true"><i />Play</span>}
                  </a>
                )
              })}
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

        <section className="duel section-shell" id="duel">
          <SectionHeading number="06" label="Interactive model" title="Can your instinct outrun a learning machine?" />
          <Reveal>
            <HumanMachineDuel />
          </Reveal>
        </section>

        <section className="contact" id="contact">
          <Reveal className="contact-inner">
            <div className="contact-top"><span>07 / Correspondence</span><span>Available for thoughtful work</span></div>
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
