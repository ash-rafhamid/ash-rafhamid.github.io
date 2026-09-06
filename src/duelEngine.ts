export type Mode = 'sprint' | 'expert' | 'practice'
export type Question = { text: string; answer: number; choices: number[]; difficulty: number }
export type PaceModel = { base: number; complexity: number; samples: number }
export type RoundResult = { correct: boolean; timedOut: boolean; answer: number | null; elapsed: number; earned: number; streak: number }

export const ROUND_COUNT = 5
export const modes: { id: Mode; label: string; detail: string }[] = [
  { id: 'sprint', label: 'Sprint', detail: 'Five rounds. Beat the adaptive clock.' },
  { id: 'expert', label: 'Expert', detail: 'Harder equations. Bigger score bonuses.' },
  { id: 'practice', label: 'Practice', detail: 'No deadline. Take your time and warm up.' },
]
export const initialPace = (): PaceModel => ({ base: 3600, complexity: 750, samples: 0 })
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value))

export function createQuestion(round: number, mode: Mode, random = Math.random): Question {
  const integer = (low: number, high: number) => low + Math.floor(random() * (high - low + 1))
  const difficulty = Math.min(4, 1 + Math.floor((round - 1) / 2) + (mode === 'expert' ? 1 : 0))
  const a = integer(4, 12), b = integer(3, 10), c = integer(2, 15)
  let text: string, answer: number
  if (difficulty === 1) {
    const x = integer(12, 37), y = integer(6, 25)
    const addition = random() > .4
    text = addition ? `${x} + ${y}` : `${x + y} − ${y}`
    answer = addition ? x + y : x
  } else if (difficulty === 2) {
    const multiply = random() > .35
    text = multiply ? `${a} × ${b}` : `${a * b} ÷ ${b}`
    answer = multiply ? a * b : a
  } else if (difficulty === 3) {
    text = `${a} × ${b} − ${c}`
    answer = a * b - c
  } else {
    text = `(${a} + ${b}) × ${c}`
    answer = (a + b) * c
  }
  // Fixed distinct offsets guarantee four options even with a constant random source.
  const offsets = [0, -integer(1, 7), integer(1, 7), integer(8, 14)]
  const choices = offsets.map(offset => answer + offset)
  for (let i = choices.length - 1; i > 0; i--) {
    const j = integer(0, i)
    ;[choices[i], choices[j]] = [choices[j], choices[i]]
  }
  return { text, answer, choices, difficulty }
}

export function predictPace(model: PaceModel, difficulty: number, mode: Mode): number {
  const prediction = model.base + model.complexity * (difficulty - 1)
  return clamp(prediction * (mode === 'expert' ? .88 : 1), 2300, 7200)
}

export function learnPace(model: PaceModel, difficulty: number, elapsed: number): PaceModel {
  const feature = difficulty - 1
  const error = clamp(elapsed - (model.base + model.complexity * feature), -2000, 2500)
  const step = .2 / (1 + feature * feature)
  return {
    base: clamp(model.base + step * error, 2100, 5800),
    complexity: clamp(model.complexity + step * error * feature, 250, 1600),
    samples: model.samples + 1,
  }
}

export function scoreAnswer(mode: Mode, elapsed: number, budget: number, streak: number): number {
  const speedBonus = mode === 'practice' ? 0 : Math.round(100 * clamp(1 - elapsed / budget, 0, 1))
  const streakBonus = Math.min(4, Math.max(0, streak - 1)) * 25
  return Math.round((100 + speedBonus + streakBonus) * (mode === 'expert' ? 1.25 : 1))
}
