import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowRight, Check, Pause, Play, RotateCcw, Trophy, X, Zap } from 'lucide-react'
import { createQuestion, initialPace, learnPace, modes, predictPace, ROUND_COUNT, scoreAnswer, type Mode, type Question, type RoundResult } from './duelEngine'

type Phase = 'ready' | 'countdown' | 'playing' | 'paused' | 'result' | 'finished'
type BestScores = Record<Mode, number>
const bestKey = 'ashraf-duel-best-v2'

function readBest(): BestScores {
  const scores: BestScores = { sprint: 0, expert: 0, practice: 0 }
  try {
    const stored = JSON.parse(localStorage.getItem(bestKey) ?? '{}')
    for (const mode of modes) if (Number.isFinite(stored?.[mode.id]) && stored[mode.id] >= 0) scores[mode.id] = stored[mode.id]
  } catch { /* Play works when device storage is unavailable. */ }
  return scores
}

export default function HumanMachineStudy() {
  const [phase, setPhase] = useState<Phase>('ready')
  const [mode, setMode] = useState<Mode>('sprint')
  const [countdown, setCountdown] = useState(3)
  const [question, setQuestion] = useState<Question | null>(null)
  const [results, setResults] = useState<RoundResult[]>([])
  const [budget, setBudget] = useState(3600)
  const [elapsed, setElapsed] = useState(0)
  const [best, setBest] = useState<BestScores>(readBest)
  const [record, setRecord] = useState(false)
  const arena = useRef<HTMLDivElement>(null)
  const nextButton = useRef<HTMLButtonElement>(null)
  const model = useRef(initialPace())
  const running = useRef(false)
  const clock = useRef({ started: 0, carried: 0 })
  const points = results.reduce((sum, result) => sum + result.earned, 0)
  const wins = results.filter(result => result.correct).length
  const latest = results[results.length - 1]
  const streak = latest?.streak ?? 0
  const progress = mode === 'practice' ? 0 : Math.min(1, elapsed / budget)
  const choosingMode = phase === 'ready' || phase === 'finished'

  function beginRound() {
    const next = createQuestion(results.length + 1, mode)
    setQuestion(next)
    setBudget(predictPace(model.current, next.difficulty, mode))
    clock.current.carried = 0
    setElapsed(0)
    setPhase('playing')
    arena.current?.focus({ preventScroll: true })
  }

  function finishRound(value: number | null, duration: number) {
    if (!running.current || !question) return
    running.current = false
    const timedOut = mode !== 'practice' && duration >= budget
    const correct = !timedOut && value === question.answer
    const nextStreak = correct ? streak + 1 : 0
    const earned = correct ? scoreAnswer(mode, duration, budget, nextStreak) : 0
    // Only completed, correct answers are measured training samples.
    // A timeout is a lower bound, not an observed response time.
    if (correct) model.current = learnPace(model.current, question.difficulty, duration)
    setElapsed(duration)
    setResults(previous => [...previous, { correct, timedOut, answer: timedOut ? null : value, elapsed: duration, earned, streak: nextStreak }])
    setPhase('result')
  }

  function answer(value: number) {
    if (!running.current) return
    finishRound(value, clock.current.carried + performance.now() - clock.current.started)
  }

  function pause() {
    if (!running.current) return
    const duration = clock.current.carried + performance.now() - clock.current.started
    if (mode !== 'practice' && duration >= budget) { finishRound(null, budget); return }
    running.current = false
    clock.current.carried = duration
    setElapsed(duration)
    setPhase('paused')
  }

  function startMatch() {
    running.current = false
    model.current = initialPace()
    clock.current.carried = 0
    setResults([])
    setQuestion(null)
    setRecord(false)
    setCountdown(3)
    setPhase('countdown')
    arena.current?.focus({ preventScroll: true })
  }

  function advance() {
    if (results.length < ROUND_COUNT) { beginRound(); return }
    setPhase('finished')
    if (points > best[mode]) {
      const updated = { ...best, [mode]: points }
      setBest(updated)
      setRecord(true)
      try { localStorage.setItem(bestKey, JSON.stringify(updated)) } catch { /* Keep the record for this visit. */ }
    }
  }

  useEffect(() => {
    if (phase !== 'countdown') return
    const timer = window.setTimeout(() => {
      if (countdown > 1) setCountdown(countdown - 1)
      else beginRound()
    }, 650)
    return () => window.clearTimeout(timer)
  }, [phase, countdown])

  useEffect(() => {
    if (phase !== 'playing') return
    clock.current.started = performance.now()
    running.current = true
    let frame = 0
    let lastPaint = 0
    const tick = (now: number) => {
      if (!running.current) return
      const duration = clock.current.carried + now - clock.current.started
      if (mode !== 'practice' && duration >= budget) { finishRound(null, budget); return }
      if (now - lastPaint >= 40) { setElapsed(duration); lastPaint = now }
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => { running.current = false; window.cancelAnimationFrame(frame) }
  }, [phase, question, budget])

  useEffect(() => {
    const onHidden = () => {
      if (!document.hidden) return
      if (phase === 'playing') pause()
      else if (phase === 'countdown') setPhase('ready')
    }
    document.addEventListener('visibilitychange', onHidden)
    return () => document.removeEventListener('visibilitychange', onHidden)
  }, [phase, budget, question, results])

  useEffect(() => {
    if (phase === 'result') nextButton.current?.focus({ preventScroll: true })
  }, [phase])

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return
    if (phase === 'playing' && /^[1-4]$/.test(event.key) && question) {
      event.preventDefault()
      answer(question.choices[Number(event.key) - 1])
    } else if (phase === 'playing' && event.key.toLowerCase() === 'p') {
      event.preventDefault()
      pause()
    }
  }

  return <div className={`duel-game game-${phase}`} ref={arena} tabIndex={-1} onKeyDown={onKeyDown} aria-label="Human versus Machine math game">
    <div className="game-top"><div><span className="game-kicker">The adaptive math duel</span><h3>Human <span>vs.</span> Machine</h3></div><div className="game-best"><Trophy size={17} /><span>Your best<strong>{best[mode].toLocaleString()} <small>pts</small></strong></span></div></div>
    <div className="game-mode-row"><div className="game-modes" role="group" aria-label="Game mode">{modes.map(item => <button type="button" disabled={!choosingMode} aria-pressed={mode === item.id} className={mode === item.id ? 'selected' : ''} key={item.id} onClick={() => { model.current = initialPace(); setMode(item.id); setPhase('ready'); setResults([]); setRecord(false) }}>{item.label}</button>)}</div><span>{modes.find(item => item.id === mode)?.detail}</span></div>
    <div className="game-scoreboard"><div><span>Score</span><strong>{points.toLocaleString()}<small>pts</small></strong></div><div className={`game-streak ${streak > 1 ? 'streak-active' : ''}`}><Zap size={17} /><span>{streak > 1 ? `${streak} in a row` : 'Build a streak'}</span></div><div className="game-rounds" aria-label={`${results.length} of ${ROUND_COUNT} rounds complete`}>{Array.from({ length: ROUND_COUNT }, (_, index) => <span key={index} className={results[index] ? results[index].correct ? 'won' : 'lost' : phase === 'playing' && results.length === index ? 'current' : ''}>{results[index] ? results[index].correct ? <Check size={12} /> : <X size={12} /> : index + 1}</span>)}</div></div>
    <div className="game-arena">
      {phase === 'ready' && <div className="game-welcome"><span className="game-intro-icon"><Zap size={27} strokeWidth={1.5} /></span><h4>How quick is your thinking?</h4><p>You solve the equations. The opponent learns your pace.<br />Fast answers earn more. Streaks make them count.</p><button className="game-primary" type="button" onClick={startMatch}>Let’s play <Play size={16} fill="currentColor" /></button><span className="game-key-hint">Tap an answer or use keys 1–4. Press P to pause.</span></div>}
      {phase === 'countdown' && <div className="game-countdown" aria-live="polite"><span>Get ready</span><strong key={countdown}>{countdown}</strong><p>Five rounds. Find your rhythm.</p></div>}
      {(phase === 'playing' || phase === 'paused' || phase === 'result') && question && <>
        <div className="game-clock-row"><span>{mode === 'practice' ? 'Take your time' : `Beat ${(budget / 1000).toFixed(1)} seconds`}</span><div>{phase === 'playing' && <button className="game-pause" type="button" onClick={pause} aria-label="Pause round"><Pause size={15} /></button>}<span aria-hidden="true">{mode === 'practice' ? (elapsed / 1000).toFixed(1) : Math.max(0, (budget - elapsed) / 1000).toFixed(1)}s</span></div></div>
        <div className={`game-clock ${progress > .75 ? 'clock-urgent' : ''}`} aria-hidden="true"><span style={{ transform: `scaleX(${mode === 'practice' ? 0 : progress})` }} /></div>
        {phase === 'paused' ? <div className="game-paused"><Pause size={30} /><h4>Take a breath.</h4><p>Your round is paused.</p><button className="game-primary" type="button" onClick={() => setPhase('playing')}>Resume <Play size={16} /></button></div> : <>
          <p className="game-equation" aria-live="polite">{question.text}<span> = ?</span></p>
          <div className="game-answers" aria-label="Choose an answer">{question.choices.map((choice, index) => <button key={index} type="button" disabled={phase !== 'playing'} className={phase === 'result' ? choice === question.answer ? 'answer-correct' : choice === latest?.answer ? 'answer-wrong' : '' : ''} onClick={() => answer(choice)}><kbd>{index + 1}</kbd><strong>{choice}</strong>{phase === 'result' && choice === question.answer && <Check size={16} />}</button>)}</div>
          {phase === 'result' && latest && <div className={`game-feedback ${latest.correct ? 'feedback-correct' : ''}`}><div aria-live="polite"><strong>{latest.correct ? `+${latest.earned} points` : latest.timedOut ? 'The clock got there first.' : 'Not quite. Try the next one.'}</strong><p>{latest.correct ? `${(latest.elapsed / 1000).toFixed(2)}s${latest.streak > 1 ? ` · ${latest.streak}-answer streak bonus` : ' · Nice work.'}` : `The answer is ${question.answer}.`}</p></div><button ref={nextButton} className="game-primary" type="button" onClick={advance}>{results.length === ROUND_COUNT ? 'See results' : 'Next round'}<ArrowRight size={16} /></button></div>}
        </>}
      </>}
      {phase === 'finished' && <div className="game-finished"><span className="game-intro-icon"><Trophy size={28} strokeWidth={1.5} /></span><p className="game-finish-label">{record ? 'A new personal best' : mode === 'practice' ? 'Practice complete' : wins >= 3 ? 'You won the duel' : 'Every round is a new chance'}</p><h4>{points.toLocaleString()}<span>points</span></h4><p>{wins} of {ROUND_COUNT} correct · Best streak: {Math.max(0, ...results.map(result => result.streak))}</p><button type="button" className="game-primary" onClick={startMatch}>One more match <RotateCcw size={16} /></button></div>}
    </div>
    <div className="game-foot"><span>{model.current.samples ? `Pace learned from ${model.current.samples} correct ${model.current.samples === 1 ? 'answer' : 'answers'}` : 'A fresh opponent for every match'}</span><span>{mode === 'practice' ? 'No timer · streak bonuses only' : 'Speed + accuracy + streaks'}</span></div>
  </div>
}
