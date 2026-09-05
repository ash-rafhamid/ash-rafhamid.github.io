import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, RotateCcw } from 'lucide-react'

type DuelQuestion = { text: string; answer: number; choices: number[]; level: number }
type DuelState = 'idle' | 'racing' | 'resolved' | 'complete'

export default function HumanMachineStudy() {
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
    setMessage('Choose the correct answer before the blue timer finishes.')
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

