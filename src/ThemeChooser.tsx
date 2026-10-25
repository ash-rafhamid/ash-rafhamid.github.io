import { ArrowRight, Moon, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { systemTheme, type Theme } from './theme'

// The chosen side sweeps across the screen before the portfolio arrives.
const SWEEP_MS = 760
const READY_MS = 900

const sides: { theme: Theme; label: string; note: string; Icon: typeof Sun }[] = [
  { theme: 'light', label: 'Light', note: 'Bright and airy', Icon: Sun },
  { theme: 'dark', label: 'Dark', note: 'Calm and focused', Icon: Moon },
]

export default function ThemeChooser({ leaving, onChoose }: { leaving: boolean; onChoose: (theme: Theme) => void }) {
  const [focus, setFocus] = useState<Theme | null>(null)
  const [chosen, setChosen] = useState<Theme | null>(null)
  const [ready, setReady] = useState(false)
  const buttons = useRef<Partial<Record<Theme, HTMLButtonElement | null>>>({})
  const timer = useRef<number | null>(null)
  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const wait = window.setTimeout(() => setReady(true), reduced.current ? 0 : READY_MS)
    return () => {
      window.clearTimeout(wait)
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  const choose = (theme: Theme) => {
    if (chosen) return
    setChosen(theme)
    setFocus(theme)
    timer.current = window.setTimeout(() => onChoose(theme), reduced.current ? 0 : SWEEP_MS)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const theme: Theme = event.key === 'ArrowLeft' ? 'light' : 'dark'
        setFocus(theme)
        buttons.current[theme]?.focus()
      }
      if (event.key === 'Escape') choose(systemTheme())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return <div
    className={`theme-chooser${leaving ? ' is-leaving' : ''}`}
    data-focus={focus ?? undefined}
    data-chosen={chosen ?? undefined}
    data-ready={ready || undefined}
    role="dialog"
    aria-modal="true"
    aria-labelledby="chooser-title"
    aria-describedby="chooser-hint"
    onPointerLeave={() => { if (!chosen) setFocus(null) }}
  >
    {sides.map(({ theme, label, note, Icon }) => <button
      key={theme}
      ref={element => { buttons.current[theme] = element }}
      type="button"
      className={`chooser-side chooser-${theme}`}
      onPointerEnter={() => { if (!chosen) setFocus(theme) }}
      onFocus={() => { if (!chosen) setFocus(theme) }}
      onClick={() => choose(theme)}
    >
      <span className="chooser-label">
        <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
        <strong>{label}</strong>
        <span className="chooser-note">{note}</span>
        <span className="chooser-cta" aria-hidden="true">Choose {label.toLowerCase()} <ArrowRight size={14} /></span>
      </span>
    </button>)}
    <span className="chooser-line" aria-hidden="true" />
    <div className="chooser-heading">
      <p>Welcome</p>
      <h2 id="chooser-title">Light or dark?</h2>
    </div>
    <p className="chooser-hint" id="chooser-hint">Pick how you’d like to see the portfolio. You can switch anytime from the top bar.</p>
  </div>
}
