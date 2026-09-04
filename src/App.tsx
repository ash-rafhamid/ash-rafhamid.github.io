import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  Menu,
  RotateCcw,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import {
  capabilityEvidence,
  projects,
  researchStudies,
  type Project,
  type ProjectCategory,
} from './portfolio'

const ease = [0.22, 1, 0.36, 1] as const
const categories: Array<'All' | ProjectCategory> = ['All', 'Infrastructure', 'Product', 'Applied ML', 'Systems']

const navigation = [
  { label: 'Systems', href: '#systems' },
  { label: 'Research', href: '#research' },
  { label: 'Experiments', href: '#experiments' },
  { label: 'About', href: '#about' },
]

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.72, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) {
      onComplete()
      return
    }
    const timer = window.setTimeout(onComplete, 2160)
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onComplete()
    }
    window.addEventListener('keydown', dismiss)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', dismiss)
    }
  }, [onComplete, reduceMotion])

  if (reduceMotion) return null

  return (
    <motion.div
      className="intro-sequence"
      initial={{ y: 0 }}
      exit={{ y: '-102%' }}
      transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <div className="intro-axis">
        <motion.i
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.42, ease }}
        />
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.52, ease }}
        />
      </div>
      <div className="intro-name">
        {['Ashraf', 'Hamid', 'Mojumder'].map((word, index) => (
          <span key={word}>
            <motion.b
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.45 + index * 0.075, duration: 0.62, ease }}
            >
              {word}
            </motion.b>
          </span>
        ))}
      </div>
      <motion.div
        className="intro-sweep"
        initial={{ x: '-62vw' }}
        animate={{ x: '62vw' }}
        transition={{ delay: 1.05, duration: 0.82, ease: [0.76, 0, 0.24, 1] }}
      />
      <p>Research in motion / Portfolio 2026</p>
    </motion.div>
  )
}

function Header({ activeSection }: { activeSection: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const firstMenuLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstMenuLink.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Ashraf Hamid Mojumder, return to the beginning">
        <strong>AHM</strong>
        <span>Research in motion</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item, index) => (
          <a
            href={item.href}
            className={activeSection === item.href.slice(1) ? 'is-active' : ''}
            key={item.href}
          >
            <small>0{index + 1}</small>{item.label}
          </a>
        ))}
      </nav>
      <div className="header-end">
        <a href="#contact" className="header-contact">Let’s talk <ArrowUpRight size={14} /></a>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="mobile-menu-label"><span>Index</span><span>Dhaka / BD</span></div>
            {[...navigation, { label: 'Contact', href: '#contact' }].map((item, index) => (
              <a
                ref={index === 0 ? firstMenuLink : undefined}
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                <small>0{index + 1}</small><span>{item.label}</span><ArrowRight size={21} />
              </a>
            ))}
            <p>Intelligent systems / Software engineering / Applied research</p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function Hero({ ready }: { ready: boolean }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-meta">
        <span>Ashraf Hamid Mojumder</span>
        <span>Software engineer & student researcher</span>
        <span>Dhaka, Bangladesh / 23.81° N</span>
      </div>
      <div className="hero-title" id="hero-title">
        {['Research', 'in', 'motion.'].map((line, index) => (
          <span className={`hero-line hero-line-${index + 1}`} key={line}>
            <motion.i
              initial={{ y: '112%' }}
              animate={ready ? { y: 0 } : { y: '112%' }}
              transition={{ delay: index * 0.075, duration: 0.82, ease }}
            >
              {line}
            </motion.i>
          </span>
        ))}
      </div>
      <motion.div
        className="hero-orbit"
        initial={{ opacity: 0, scale: 0.84 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.84 }}
        transition={{ delay: 0.25, duration: 0.9, ease }}
        aria-hidden="true"
      >
        <span /><i /><b>AHM / 26</b>
      </motion.div>
      <div className="hero-bottom">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.32, duration: 0.7, ease }}
        >
          I build intelligent systems that can be <em>tested, trusted and explained.</em>
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.7, ease }}
        >
          <a href="#systems">Explore selected systems <ArrowDown size={15} /></a>
          <a href="mailto:ashrafhamidmajumder@gmail.com?subject=Portfolio%20conversation">Start a conversation</a>
        </motion.div>
      </div>
      <span className="hero-folio">Folio / Twenty twenty-six</span>
    </section>
  )
}

function Thesis() {
  return (
    <section className="thesis" aria-label="Working philosophy">
      <Reveal className="thesis-index"><span>00</span><span>Thesis</span></Reveal>
      <Reveal className="thesis-copy" delay={0.05}>
        <p>
          I am interested in the space between a system that <em>works</em> and one that deserves to be
          <em> relied upon.</em>
        </p>
        <span>That means building the interface, testing the model, tracing the evidence and making uncertainty visible.</span>
      </Reveal>
    </section>
  )
}

function SectionHeading({
  index,
  eyebrow,
  title,
  side,
}: {
  index: string
  eyebrow: string
  title: ReactNode
  side: string
}) {
  return (
    <Reveal className="section-heading">
      <div className="section-code"><span>{index}</span><span>{eyebrow}</span></div>
      <h2>{title}</h2>
      <p>{side}</p>
    </Reveal>
  )
}

function ProjectVisual({ project, expanded = false }: { project: Project; expanded?: boolean }) {
  if (project.visual === 'crashlens') {
    return (
      <div className={`system-visual crashlens-visual ${expanded ? 'is-expanded' : ''}`} aria-label="CrashLens dashboard abstraction">
        <div className="visual-toolbar"><i /><i /><i /><span>crashlens / production</span></div>
        <div className="crash-sidebar"><b>CL</b><i /><i /><i /></div>
        <div className="crash-main">
          <div className="crash-label"><span>Unresolved errors</span><strong>12</strong></div>
          <div className="crash-event"><i>NEW</i><b>TypeError: Failed to fetch</b><span>checkout.tsx · 42 occurrences</span></div>
          <div className="crash-event"><i>REG</i><b>Cannot read properties of null</b><span>auth.ts · returned 18m ago</span></div>
          <div className="crash-chart"><span style={{ height: '28%' }} /><span style={{ height: '45%' }} /><span style={{ height: '32%' }} /><span style={{ height: '72%' }} /><span style={{ height: '58%' }} /><span style={{ height: '88%' }} /><span style={{ height: '66%' }} /></div>
        </div>
      </div>
    )
  }

  if (project.visual === 'agentfence') {
    return (
      <div className={`system-visual fence-visual ${expanded ? 'is-expanded' : ''}`} aria-label="AgentFence policy path abstraction">
        <div className="fence-request"><small>Agent request</small><b>write_file</b><span>/workspace/report.md</span></div>
        <div className="fence-path"><span /><i /><b /></div>
        <div className="fence-decision"><ShieldCheck size={22} /><small>Policy decision</small><b>Require approval</b></div>
        <div className="fence-stamp">Human boundary / active</div>
      </div>
    )
  }

  if (project.visual === 'contextbridge') {
    return (
      <div className={`system-visual context-visual ${expanded ? 'is-expanded' : ''}`}>
        <img src="/projects/contextbridge.png" alt="Context Bridge extension export interface" loading="lazy" />
        <span>Local export / No external request</span>
      </div>
    )
  }

  if (project.visual === 'localfix') {
    return (
      <div className={`system-visual localfix-visual ${expanded ? 'is-expanded' : ''}`} aria-label="LocalFix civic issue map abstraction">
        <div className="map-street street-a" /><div className="map-street street-b" /><div className="map-street street-c" />
        <span className="map-point point-a"><i />12</span>
        <span className="map-point point-b"><i />07</span>
        <span className="map-point point-c"><i />24</span>
        <div className="map-report"><small>Selected report</small><b>Unsafe road surface</b><span>23 community votes</span></div>
      </div>
    )
  }

  if (project.visual === 'classifier') {
    return (
      <div className={`system-visual classifier-visual ${expanded ? 'is-expanded' : ''}`} aria-label="Text classifier evaluation abstraction">
        <div className="classifier-query"><small>Incoming message</small><b>Project notes for Monday</b></div>
        <div className="classifier-axis"><span>0.00</span><i><b /></i><span>1.00</span></div>
        <div className="classifier-result"><span>Prediction</span><b>Legitimate</b><strong>0.984</strong></div>
        <div className="classifier-models"><span>NB</span><span>SVM</span><span>LR</span></div>
      </div>
    )
  }

  return (
    <div className={`system-visual hospital-visual ${expanded ? 'is-expanded' : ''}`} aria-label="Hospital record system abstraction">
      <div className="record-head"><span>ID</span><span>Patient</span><span>State</span></div>
      {[
        ['1024', 'Nadia Rahman', 'Checked in'],
        ['1025', 'Fahim Islam', 'Waiting'],
        ['1026', 'Samira Khan', 'Complete'],
        ['1027', 'Adnan Karim', 'Waiting'],
      ].map((row) => <div className="record-row" key={row[0]}><span>{row[0]}</span><b>{row[1]}</b><i>{row[2]}</i></div>)}
      <div className="record-cursor" />
    </div>
  )
}

function SelectedSystems({ onOpen }: { onOpen: (project: Project) => void }) {
  const [filter, setFilter] = useState<(typeof categories)[number]>('All')
  const visibleProjects = useMemo(
    () => filter === 'All' ? projects : projects.filter((project) => project.category === filter),
    [filter],
  )

  return (
    <section className="systems section-shell" id="systems">
      <SectionHeading
        index="01"
        eyebrow="Selected systems"
        title={<>Work that turns <em>questions into evidence.</em></>}
        side="Released tools, applied studies and one clearly labelled systems concept."
      />
      <div className="project-filter" aria-label="Filter selected systems">
        <span>View by field</span>
        <div>
          {categories.map((category) => (
            <button
              type="button"
              className={filter === category ? 'is-selected' : ''}
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
              key={category}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <motion.div className="project-list" layout>
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project) => (
            <motion.article
              className={`project-entry ${project.index === '01' ? 'project-lead' : ''}`}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease }}
              key={project.id}
            >
              <div className="project-entry-head">
                <span>{project.index}</span>
                <span>{project.category}</span>
                <span>{project.year}</span>
              </div>
              <button className="project-open" type="button" onClick={() => onOpen(project)}>
                <span className="project-title-wrap"><strong>{project.title}</strong><i>{project.thesis}</i></span>
                <span className="project-arrow"><ArrowUpRight size={22} /></span>
              </button>
              <div className="project-entry-grid">
                <ProjectVisual project={project} />
                <div className="project-summary">
                  <p>{project.summary}</p>
                  <span>{project.status}</span>
                  <ul>{project.evidence.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
                  <button type="button" onClick={() => onOpen(project)}>Read system story <ArrowRight size={14} /></button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

function ResearchSection() {
  return (
    <section className="research section-shell" id="research">
      <SectionHeading
        index="02"
        eyebrow="Research practice"
        title={<>Questions first. <em>Claims second.</em></>}
        side="Experiments are described by their method and available evidence—not by invented certainty."
      />
      <div className="research-ledger">
        {researchStudies.map((study, studyIndex) => (
          <Reveal className="research-record" delay={studyIndex * 0.06} key={study.index}>
            <div className="research-record-title">
              <span>{study.index}</span>
              <h3>{study.title}</h3>
              {study.source && <a href={study.source} target="_blank" rel="noreferrer">View source <ArrowUpRight size={14} /></a>}
            </div>
            <dl>
              <div><dt>Question</dt><dd>{study.question}</dd></div>
              <div><dt>Method</dt><dd>{study.method}</dd></div>
              <div><dt>Evidence</dt><dd>{study.evidence}</dd></div>
              <div><dt>Outcome</dt><dd>{study.outcome}</dd></div>
            </dl>
          </Reveal>
        ))}
      </div>
      <div className="research-note">
        <span>Research direction / 2026</span>
        <p>Learning systems, trustworthy automation, explainable decisions and software that exposes how it behaves.</p>
      </div>
    </section>
  )
}

type PermissionState = 'allow' | 'approval' | 'block'

function PermissionRun() {
  const [decision, setDecision] = useState<PermissionState>('approval')
  const decisionCopy = {
    allow: { label: 'Allowed', detail: 'The write proceeds and the decision is recorded.', code: '200 / EXECUTED' },
    approval: { label: 'Approval required', detail: 'Execution pauses until a person confirms the exact write.', code: '102 / WAITING' },
    block: { label: 'Blocked', detail: 'The request is denied before any external state changes.', code: '403 / DENIED' },
  }[decision]

  return (
    <div className={`permission-lab decision-${decision}`}>
      <div className="permission-console">
        <div className="console-head"><span>AgentFence / Permission run</span><span>Live concept</span></div>
        <div className="console-request">
          <span>01 / Proposed action</span>
          <code><b>write_file</b>('/reports/model-audit.md')</code>
          <p>Scope: one new Markdown file<br />Effect: changes workspace state</p>
        </div>
        <div className="console-flow" aria-hidden="true">
          <motion.span layoutId="decision-signal" transition={{ duration: 0.42, ease }} />
          <i /><i /><i />
        </div>
        <div className="console-result" aria-live="polite">
          <motion.div key={decision} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <small>Policy result</small><strong>{decisionCopy.label}</strong><p>{decisionCopy.detail}</p><code>{decisionCopy.code}</code>
          </motion.div>
        </div>
      </div>
      <div className="permission-controls">
        <span>Choose the boundary</span>
        <div role="group" aria-label="Select AgentFence permission">
          {([
            ['allow', 'Allow'],
            ['approval', 'Require approval'],
            ['block', 'Block'],
          ] as const).map(([value, label]) => (
            <button
              type="button"
              className={decision === value ? 'is-active' : ''}
              aria-pressed={decision === value}
              onClick={() => setDecision(value)}
              key={value}
            >
              <span>{decision === value && <Check size={13} />}</span>{label}
            </button>
          ))}
        </div>
        <p>This interaction demonstrates the policy idea. AgentFence is presented as a systems concept, not a released product.</p>
      </div>
    </div>
  )
}

type DuelQuestion = { text: string; answer: number; choices: number[]; level: number }
type DuelState = 'idle' | 'racing' | 'resolved' | 'complete'

function HumanMachineStudy() {
  const [state, setState] = useState<DuelState>('idle')
  const [round, setRound] = useState(0)
  const [humanScore, setHumanScore] = useState(0)
  const [modelScore, setModelScore] = useState(0)
  const [question, setQuestion] = useState<DuelQuestion | null>(null)
  const [prediction, setPrediction] = useState(2900)
  const [message, setMessage] = useState('The predictor starts untrained. Your answers become its evidence.')
  const [observations, setObservations] = useState<number[]>([])
  const active = useRef(false)
  const startedAt = useRef(0)
  const timer = useRef<number | null>(null)
  const advanceTimer = useRef<number | null>(null)
  const roundRef = useRef(0)
  const humanRef = useRef(0)
  const modelRef = useRef(0)
  const questionRef = useRef<DuelQuestion | null>(null)
  const predictionRef = useRef(2900)
  const observationsRef = useRef<number[]>([])

  const randomInt = (low: number, high: number) => Math.floor(Math.random() * (high - low + 1)) + low

  function makeQuestion(nextRound: number): DuelQuestion {
    const level = nextRound < 3 ? 1 : nextRound < 5 ? 2 : 3
    let answer = 0
    let text = ''
    if (level === 1) {
      const a = randomInt(9, 31); const b = randomInt(7, 28)
      answer = a + b; text = `${a} + ${b}`
    } else if (level === 2) {
      const a = randomInt(4, 12); const b = randomInt(4, 11)
      answer = a * b; text = `${a} × ${b}`
    } else {
      const a = randomInt(5, 12); const b = randomInt(4, 10); const c = randomInt(3, 17)
      answer = a * b - c; text = `${a} × ${b} − ${c}`
    }
    const choices = new Set<number>([answer])
    while (choices.size < 4) choices.add(answer + (randomInt(-10, 10) || 3))
    return { text, answer, choices: [...choices].sort(() => Math.random() - 0.5), level }
  }

  function predictedTime(level: number) {
    if (!observationsRef.current.length) return 2900 + (level - 1) * 360
    const average = observationsRef.current.reduce((sum, item) => sum + item, 0) / observationsRef.current.length
    return Math.max(1350, Math.min(5200, average + (level - 1) * 260 - 120))
  }

  function finishRound(winner: 'human' | 'model', elapsed: number) {
    if (!active.current || !questionRef.current) return
    active.current = false
    if (timer.current !== null) window.clearTimeout(timer.current)
    observationsRef.current = [...observationsRef.current, Math.min(elapsed, 6000)]
    setObservations(observationsRef.current)
    setState('resolved')
    if (winner === 'human') {
      humanRef.current += 1
      setHumanScore(humanRef.current)
      setMessage(`Human response: ${(elapsed / 1000).toFixed(2)}s. The predictor updates.`)
    } else {
      modelRef.current += 1
      setModelScore(modelRef.current)
      setMessage(`Prediction window closed. Correct answer: ${questionRef.current.answer}.`)
    }
    advanceTimer.current = window.setTimeout(() => {
      if (roundRef.current >= 5) {
        setState('complete')
        setQuestion(null)
        const result = humanRef.current > modelRef.current ? 'You stayed ahead of the model.' : humanRef.current === modelRef.current ? 'The study ends level.' : 'The model adapted to your pace.'
        setMessage(result)
      } else beginRound()
    }, 1050)
  }

  function beginRound() {
    const nextRound = roundRef.current + 1
    roundRef.current = nextRound
    const nextQuestion = makeQuestion(nextRound)
    questionRef.current = nextQuestion
    const nextPrediction = predictedTime(nextQuestion.level)
    predictionRef.current = nextPrediction
    setPrediction(nextPrediction)
    setQuestion(nextQuestion)
    setRound(nextRound)
    setState('racing')
    setMessage('Solve before the terracotta signal reaches the boundary.')
    startedAt.current = performance.now()
    active.current = true
    timer.current = window.setTimeout(() => finishRound('model', nextPrediction), nextPrediction)
  }

  function start() {
    if (timer.current !== null) window.clearTimeout(timer.current)
    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current)
    roundRef.current = 0; humanRef.current = 0; modelRef.current = 0
    observationsRef.current = []
    setRound(0); setHumanScore(0); setModelScore(0); setObservations([])
    beginRound()
  }

  function answer(value: number) {
    if (!active.current || !questionRef.current) return
    const elapsed = performance.now() - startedAt.current
    finishRound(value === questionRef.current.answer ? 'human' : 'model', elapsed)
  }

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current)
  }, [])

  return (
    <div
      className={`duel-study duel-${state}`}
      style={{ '--prediction-time': `${prediction}ms` } as CSSProperties}
    >
      <div className="duel-header"><span>Latency study / 02</span><span>Online response predictor</span></div>
      <div className="duel-score"><div><small>Human</small><strong>{humanScore}</strong></div><span>{round ? `${Math.min(round, 5)} / 5` : 'Five rounds'}</span><div><small>Model</small><strong>{modelScore}</strong></div></div>
      <div className="duel-stage">
        <div className="duel-track"><span /><i /></div>
        <p>{state === 'idle' ? 'Ready?' : state === 'complete' ? `${humanScore} — ${modelScore}` : `${question?.text} = ?`}</p>
        <div className="duel-options">
          {question?.choices.map((choice) => <button type="button" disabled={state !== 'racing'} onClick={() => answer(choice)} key={choice}>{choice}</button>)}
        </div>
        {(state === 'idle' || state === 'complete') && <button className="duel-start" type="button" onClick={start}>{state === 'complete' ? <RotateCcw size={15} /> : <ArrowRight size={15} />}{state === 'complete' ? 'Run again' : 'Begin study'}</button>}
        <span className="duel-message" aria-live="polite">{message}</span>
      </div>
      <div className="duel-data"><span>Observations <b>{observations.length}</b></span><span>Next estimate <b>{(prediction / 1000).toFixed(2)}s</b></span><span>Model <b>Adaptive mean / difficulty offset</b></span></div>
    </div>
  )
}

function ExperimentsSection() {
  return (
    <section className="experiments section-shell" id="experiments">
      <SectionHeading
        index="03"
        eyebrow="Living experiments"
        title={<>Do not just read it. <em>Change the state.</em></>}
        side="Two small interactions expose a decision model and a learning signal directly in the portfolio."
      />
      <Reveal className="experiment-intro">
        <span>E–01 / Permission boundary</span>
        <h3>Can the agent proceed?</h3>
        <p>Choose a policy and watch the same proposed action take a different route.</p>
      </Reveal>
      <PermissionRun />
      <Reveal className="experiment-intro duel-intro">
        <span>E–02 / Human–machine latency</span>
        <h3>Can it learn your pace?</h3>
        <p>Solve five short equations while a lightweight online predictor adapts to your response time.</p>
      </Reveal>
      <HumanMachineStudy />
    </section>
  )
}

function CapabilitiesSection() {
  return (
    <section className="capabilities section-shell" aria-labelledby="capabilities-title">
      <div className="capability-head"><span>04 / Capability evidence</span><h2 id="capabilities-title">Tools matter.<br /><em>Proof matters more.</em></h2></div>
      <div className="capability-list">
        {capabilityEvidence.map((capability) => (
          <Reveal className="capability-row" key={capability.index}>
            <span>{capability.index}</span>
            <div><h3>{capability.title}</h3><p>{capability.statement}</p></div>
            <div><small>Evidence</small><p>{capability.evidence}</p></div>
            <div><small>Working set</small><p>{capability.tools}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="about section-shell" id="about">
      <div className="about-aside"><span>05 / About</span><span>Dhaka, Bangladesh</span></div>
      <Reveal className="about-statement">
        <p>I am Ashraf, a fourth-year Computer Science and Engineering student working across <em>machine learning, software systems and useful product engineering.</em></p>
      </Reveal>
      <div className="about-grid">
        <Reveal className="about-copy">
          <p>My strongest work begins with a practical question and stays close to the evidence. I like building the complete path—from data and logic to the interface where a person decides whether the system is useful.</p>
          <p>I am especially interested in trustworthy AI, agent safety, applied learning systems and engineering that makes complex behaviour easier to inspect.</p>
        </Reveal>
        <Reveal className="about-facts" delay={0.07}>
          <div><small>Academic record</small><strong>3.90 / 4.00 CGPA</strong></div>
          <div><small>Deliberate practice</small><strong>600+ LeetCode problems</strong></div>
          <div><small>Current direction</small><strong>AI systems & research</strong></div>
          <div><small>Résumé</small><a href="mailto:ashrafhamidmajumder@gmail.com?subject=Resume%20request">Request by email <ArrowUpRight size={14} /></a></div>
        </Reveal>
      </div>
      <div className="profile-links">
        <a href="https://github.com/ash-rafhamid" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
        <a href="https://linkedin.com/in/ashrafhamid096" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a>
        <a href="https://leetcode.com/u/ash-rafhamid" target="_blank" rel="noreferrer">LeetCode <ArrowUpRight size={13} /></a>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="contact" id="contact">
      <div className="contact-meta"><span>06 / Contact</span><span>Available for thoughtful work and research conversations</span></div>
      <Reveal className="contact-title">
        <p>Have a difficult system<br />worth making <em>clear?</em></p>
      </Reveal>
      <div className="contact-bottom">
        <a className="contact-action" href="mailto:ashrafhamidmajumder@gmail.com?subject=Let%27s%20build%20something%20clear">Write to Ashraf <Send size={17} /></a>
        <div>
          <a href="mailto:ashrafhamidmajumder@gmail.com"><Mail size={15} /> ashrafhamidmajumder@gmail.com</a>
          <span><MapPin size={15} /> Dhaka, Bangladesh</span>
        </div>
      </div>
    </section>
  )
}

function ProjectCaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeButton.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>('.case-study button:not([disabled]), .case-study a[href]'),
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <motion.div
      className="case-study"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
    >
      <header className="case-header">
        <button ref={closeButton} type="button" onClick={onClose}><ArrowLeft size={15} />Return to index</button>
        <span>{project.index} / {project.category}</span>
        <span>{project.year}</span>
      </header>
      <main className="case-main">
        <div className="case-hero">
          <div className="case-title">
            <span>{project.status}</span>
            <h2 id="case-title">{project.title}</h2>
            <p>{project.thesis}</p>
          </div>
          <ProjectVisual project={project} expanded />
        </div>
        <div className="case-abstract">
          <span>Abstract</span><p>{project.summary}</p>
          <span>Contribution</span><p>{project.contribution}</p>
        </div>
        <div className="case-chapters">
          {project.chapters.map((chapter, index) => (
            <section key={chapter.label}>
              <span>{String(index + 1).padStart(2, '0')} / {chapter.label}</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.body}</p>
            </section>
          ))}
        </div>
        <div className="case-evidence">
          <div><span>Evidence</span>{project.evidence.map((item) => <p key={item}><Check size={13} />{item}</p>)}</div>
          <div><span>Working set</span><p>{project.stack.join(' · ')}</p></div>
          <div className="case-links">
            {project.live && <a href={project.live} target="_blank" rel="noreferrer">Open live system <ArrowUpRight size={15} /></a>}
            {project.source && <a href={project.source} target="_blank" rel="noreferrer">Inspect source <ArrowUpRight size={15} /></a>}
            {!project.live && !project.source && <p>Private or conceptual work / details available in this case study.</p>}
          </div>
        </div>
      </main>
      <footer className="case-footer"><span>Ashraf Hamid Mojumder</span><button type="button" onClick={onClose}>Back to selected systems <ArrowRight size={14} /></button></footer>
    </motion.div>
  )
}

function App() {
  const [introVisible, setIntroVisible] = useState(true)
  const [activeSection, setActiveSection] = useState('systems')
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 28, restDelta: 0.001 })

  useEffect(() => {
    const parseProjectHash = () => {
      const match = window.location.hash.match(/^#project\/(.+)$/)
      setActiveProject(match ? projects.find((project) => project.id === match[1]) ?? null : null)
    }
    parseProjectHash()
    window.addEventListener('hashchange', parseProjectHash)
    return () => window.removeEventListener('hashchange', parseProjectHash)
  }, [])

  useEffect(() => {
    const sections = ['systems', 'research', 'experiments', 'about']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting)
      if (visible?.target.id) setActiveSection(visible.target.id)
    }, { rootMargin: '-34% 0px -58%', threshold: 0.05 })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const shouldLock = introVisible || Boolean(activeProject)
    if (!shouldLock) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [activeProject, introVisible])

  function openProject(project: Project) {
    setActiveProject(project)
    window.history.pushState(null, '', `#project/${project.id}`)
  }

  function closeProject() {
    setActiveProject(null)
    window.history.replaceState(null, '', '#systems')
  }

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <AnimatePresence>{introVisible && <IntroSequence onComplete={() => setIntroVisible(false)} />}</AnimatePresence>
      <Header activeSection={activeSection} />
      <main id="main">
        <Hero ready={!introVisible} />
        <Thesis />
        <SelectedSystems onOpen={openProject} />
        <ResearchSection />
        <ExperimentsSection />
        <CapabilitiesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <footer className="site-footer">
        <a href="#top">AHM / 26</a>
        <p>Designed around evidence, restraint and motion with purpose.</p>
        <a href="#top">Return to beginning <ArrowRight size={13} /></a>
      </footer>
      <AnimatePresence>{activeProject && <ProjectCaseStudy project={activeProject} onClose={closeProject} />}</AnimatePresence>
    </MotionConfig>
  )
}

export default App
