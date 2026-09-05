import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

// Keep these deadlines aligned with the name, white wash, and handoff in CSS.
const REVEAL_AT = 2350
const FINISH_AT = 3050
const fullName = 'Ashraf Hamid Mojumder'
const nameParts = ['Ashraf Hamid', 'Mojumder']
type Phase = 'intro' | 'reveal' | 'done'

export default function OpeningSequence({ children }: { children: ReactNode }) {
  const lockup = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'done' : 'intro',
  )

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
    if (phase === 'intro') document.documentElement.setAttribute('data-opening', '')
    else document.documentElement.removeAttribute('data-opening')
    if (phase === 'done') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [phase])

  useEffect(() => {
    const reveal = window.setTimeout(() => setPhase(current => current === 'done' ? current : 'reveal'), REVEAL_AT)
    const finish = window.setTimeout(() => setPhase('done'), FINISH_AT)
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const skip = (event: KeyboardEvent) => { if (event.key === 'Escape') setPhase('done') }
    const respectPreference = () => { if (preference.matches) setPhase('done') }
    window.addEventListener('keydown', skip)
    preference.addEventListener('change', respectPreference)
    return () => {
      window.clearTimeout(reveal)
      window.clearTimeout(finish)
      window.removeEventListener('keydown', skip)
      preference.removeEventListener('change', respectPreference)
      document.documentElement.removeAttribute('data-opening')
    }
  }, [])

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

  return <>
    {phase !== 'done' && <div className={`opening-sequence${phase === 'reveal' ? ' is-revealing' : ''}`} role="status" aria-label={`Welcome to ${fullName}’s portfolio`}>
      <div className="opening-lockup" ref={lockup} aria-hidden="true">
        <span className="opening-slash"><i /></span>
        <div className="opening-name">
          {nameParts.map((part, side) => <span className="opening-name-half" key={part}>
            {Array.from(part).map((letter, index) => <span className="opening-letter" key={index} style={{ '--letter-index': index + (side === 0 ? 0 : nameParts[0].length) } as CSSProperties}>{letter === ' ' ? '\u00a0' : letter}</span>)}
          </span>)}
        </div>
      </div>
    </div>}
    {phase !== 'intro' && <div className={phase === 'reveal' ? 'portfolio-handoff' : undefined} inert={phase !== 'done'} aria-hidden={phase !== 'done' ? true : undefined}>{children}</div>}
  </>
}
