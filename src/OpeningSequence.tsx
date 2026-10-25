import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import ThemeChooser from './ThemeChooser'
import { applyTheme, storedTheme, type Theme } from './theme'

// Keep these deadlines aligned with the name, wash, chooser, and handoff in CSS.
const CHOOSE_AT = 2350
const REVEAL_AT = 2550
const FINISH_AT = 3250
const HANDOFF_MS = 700
const fullName = 'Ashraf Hamid Mojumder'
const nameParts = ['Ashraf Hamid', 'Mojumder']
type Phase = 'intro' | 'choose' | 'reveal' | 'done'

export default function OpeningSequence({ children }: { children: ReactNode }) {
  const lockup = useRef<HTMLDivElement>(null)
  const handoff = useRef<number | null>(null)
  // First-time visitors pick a theme once the name has returned into the line.
  const [needsChoice] = useState(() => storedTheme() === null)
  const [phase, setPhase] = useState<Phase>(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'intro'
    return needsChoice ? 'choose' : 'done'
  })
  const afterIntro: Phase = needsChoice ? 'choose' : 'done'

  useLayoutEffect(() => {
    if (!lockup.current) return
    // Offset geometry is unaffected by the letters' animated transforms.
    // Both halves start at the same stationary slash, behind their clipping edge.
    lockup.current.querySelectorAll<HTMLElement>('.opening-name-half').forEach((half, side) => {
      half.querySelectorAll<HTMLElement>('.opening-letter').forEach(letter => {
        const distance = side === 0
          ? half.clientWidth - letter.offsetLeft + 12
          : -letter.offsetLeft - letter.offsetWidth - 12
        letter.style.setProperty('--letter-origin', `${distance}px`)
      })
    })
  }, [])

  useLayoutEffect(() => {
    if (phase === 'intro' || phase === 'choose') document.documentElement.setAttribute('data-opening', '')
    else document.documentElement.removeAttribute('data-opening')
    if (phase === 'done') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [phase])

  useEffect(() => {
    const timers = needsChoice
      ? [window.setTimeout(() => setPhase(current => current === 'intro' ? 'choose' : current), CHOOSE_AT)]
      : [
        window.setTimeout(() => setPhase(current => current === 'intro' ? 'reveal' : current), REVEAL_AT),
        window.setTimeout(() => setPhase(current => current === 'reveal' ? 'done' : current), FINISH_AT),
      ]
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const skip = (event: KeyboardEvent) => { if (event.key === 'Escape') setPhase(current => current === 'intro' ? afterIntro : current) }
    const respectPreference = () => { if (preference.matches) setPhase(current => current === 'intro' ? afterIntro : current) }
    window.addEventListener('keydown', skip)
    preference.addEventListener('change', respectPreference)
    return () => {
      timers.forEach(window.clearTimeout)
      if (handoff.current !== null) window.clearTimeout(handoff.current)
      window.removeEventListener('keydown', skip)
      preference.removeEventListener('change', respectPreference)
      document.documentElement.removeAttribute('data-opening')
    }
  }, [needsChoice, afterIntro])

  const choose = (theme: Theme) => {
    applyTheme(theme)
    setPhase('reveal')
    handoff.current = window.setTimeout(() => setPhase('done'), HANDOFF_MS)
  }

  // Mount the portfolio only at the handoff, so its own entrances start then too.
  useEffect(() => {
    if (phase !== 'done' || !window.location.hash) return
    let id = window.location.hash.slice(1)
    try { id = decodeURIComponent(id) } catch { /* Keep malformed fragments harmless. */ }
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [phase])

  const showOpening = phase === 'intro' || (phase === 'reveal' && !needsChoice)
  const showChooser = needsChoice && (phase === 'choose' || phase === 'reveal')
  const showSite = phase === 'reveal' || phase === 'done'

  return <>
    {showOpening && <div className={`opening-sequence${needsChoice ? ' leads-to-choice' : ''}${phase === 'reveal' ? ' is-revealing' : ''}`} role="status" aria-label={`Welcome to ${fullName}’s portfolio`}>
      <div className="opening-lockup" ref={lockup} aria-hidden="true">
        <span className="opening-slash"><i /></span>
        <div className="opening-name">
          {nameParts.map((part, side) => <span className="opening-name-half" key={part}>
            {Array.from(part).map((letter, index) => {
              const order = index + (side === 0 ? 0 : nameParts[0].length)
              return <span className="opening-letter" key={index} style={{ '--letter-index': order, '--letter-return-delay': `${1.72 + (19 - order) * .012}s` } as CSSProperties}>{letter === ' ' ? ' ' : letter}</span>
            })}
          </span>)}
        </div>
      </div>
    </div>}
    {showChooser && <ThemeChooser leaving={phase === 'reveal'} onChoose={choose} />}
    {showSite && <div className={phase === 'reveal' ? 'portfolio-handoff' : undefined} inert={phase !== 'done'} aria-hidden={phase !== 'done' ? true : undefined}>{children}</div>}
  </>
}
