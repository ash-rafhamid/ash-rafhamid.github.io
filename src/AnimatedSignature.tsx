import { useLayoutEffect, useRef, type CSSProperties } from 'react'

/** A fixed-size wordmark: only the ink moves, never the navigation. */
export default function AnimatedSignature() {
  const windowRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const window = windowRef.current
    if (!window) return
    const measure = () => {
      for (const letter of window.querySelectorAll<HTMLElement>('[data-signature-letter]')) {
        letter.style.setProperty('--signature-travel', `${window.clientWidth - letter.offsetLeft + 2}px`)
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(window)
    return () => observer.disconnect()
  }, [])

  return <a className="signature signature-animated" href="#home" aria-label="Ashraf, home">
    <span className="signature-lockup" aria-hidden="true">
      <span className="signature-letters" ref={windowRef}>
        {Array.from('ashraf.').map((letter, index) => <span
          key={index}
          data-signature-letter
          className={letter === '.' ? 'signature-dot' : 'signature-letter'}
          style={{ '--signature-delay': `${(6 - index) * .045}s` } as CSSProperties}
        >{letter}</span>)}
      </span>
      <span className="signature-slit"><i /></span>
    </span>
  </a>
}
