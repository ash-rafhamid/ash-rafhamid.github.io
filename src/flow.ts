import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { useTheme } from './theme'

// Shared by the diagrams: boxes laid out by CSS, connections and pulses drawn on a canvas behind them.
export type Point = { x: number; y: number }
export type Palette = { ink: string; muted: string; line: string; bg: string }
export type FlowApi = {
  /** Called when the layout changes: recompute connection anchors from the boxes' positions. */
  measure: (board: DOMRect, vertical: boolean) => void
  /** Advance the animation. `still` means reduced motion: jump to the finished state. */
  update: (dt: number, still: boolean) => void
  draw: (ctx: CanvasRenderingContext2D, palette: Palette, still: boolean) => void
}

/** Below this board width the boxes stack in rows and connections run top to bottom. */
export const VERTICAL_BELOW = 560

export const clamp = (value: number) => Math.min(1, Math.max(0, value))
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Where a connection leaves (`out`) or enters (`in`) a box, relative to the board. */
export function anchor(el: HTMLElement, board: DOMRect, side: 'in' | 'out', vertical: boolean): Point {
  const r = el.getBoundingClientRect()
  const left = r.left - board.left
  const top = r.top - board.top
  if (vertical) return { x: left + r.width / 2, y: side === 'out' ? top + r.height : top }
  return { x: side === 'out' ? left + r.width : left, y: top + r.height / 2 }
}

export function curvePoint(a: Point, b: Point, vertical: boolean, u: number): Point {
  const c1 = vertical ? { x: a.x, y: a.y + (b.y - a.y) / 2 } : { x: a.x + (b.x - a.x) / 2, y: a.y }
  const c2 = vertical ? { x: b.x, y: b.y - (b.y - a.y) / 2 } : { x: b.x - (b.x - a.x) / 2, y: b.y }
  const v = 1 - u
  return {
    x: v * v * v * a.x + 3 * v * v * u * c1.x + 3 * v * u * u * c2.x + u * u * u * b.x,
    y: v * v * v * a.y + 3 * v * v * u * c1.y + 3 * v * u * u * c2.y + u * u * u * b.y,
  }
}

/** Adds part of a connection to the current path; the caller strokes it. */
export function traceCurve(ctx: CanvasRenderingContext2D, a: Point, b: Point, vertical: boolean, from = 0, to = 1) {
  const steps = Math.max(2, Math.ceil((to - from) * 24))
  const start = curvePoint(a, b, vertical, from)
  ctx.moveTo(start.x, start.y)
  for (let i = 1; i <= steps; i++) {
    const point = curvePoint(a, b, vertical, from + ((to - from) * i) / steps)
    ctx.lineTo(point.x, point.y)
  }
}

/** A pulse travelling along a connection, with a short tail and a faint trace left behind. */
export function drawSignal(ctx: CanvasRenderingContext2D, a: Point, b: Point, vertical: boolean, p: number, strength: number, settled: number) {
  const head = easeInOut(p)
  ctx.globalAlpha = strength * (0.12 + 0.33 * settled)
  ctx.lineWidth = 1.3
  ctx.beginPath(); traceCurve(ctx, a, b, vertical, 0, head); ctx.stroke()
  if (p >= 1) return
  for (let k = 0; k < 6; k++) {
    ctx.globalAlpha = strength * (1 - k / 6) * 0.9
    ctx.lineWidth = 1.9
    ctx.beginPath(); traceCurve(ctx, a, b, vertical, Math.max(0, head - (k + 1) * 0.045), Math.max(0, head - k * 0.045)); ctx.stroke()
  }
  const tip = curvePoint(a, b, vertical, head)
  ctx.globalAlpha = strength
  ctx.beginPath(); ctx.arc(tip.x, tip.y, 2.4, 0, Math.PI * 2); ctx.fill()
}

/**
 * Runs a canvas that sits behind a board of boxes. It sizes the canvas, switches the board to
 * rows on narrow widths, and runs the animation only while visible and motion is allowed.
 */
export function useFlowCanvas(boardRef: RefObject<HTMLElement | null>, canvasRef: RefObject<HTMLCanvasElement | null>, api: FlowApi, verticalBelow = VERTICAL_BELOW) {
  const apiRef = useRef(api)
  apiRef.current = api
  const palette = useRef<Palette>({ ink: '#0a0a0a', muted: '#666666', line: '#d4d4d4', bg: '#ffffff' })
  const redraw = useRef<() => void>(() => {})
  const theme = useTheme()

  const readPalette = () => {
    const el = canvasRef.current
    if (!el) return
    const style = getComputedStyle(el)
    const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback
    palette.current = { ink: read('--ink', '#0a0a0a'), muted: read('--muted', '#666666'), line: read('--line-strong', '#d4d4d4'), bg: read('--bg', '#ffffff') }
  }

  useLayoutEffect(() => {
    const board = boardRef.current
    const cv = canvasRef.current
    const ctx = cv?.getContext('2d')
    if (!board || !cv || !ctx) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let last = 0
    let frame = 0
    let visible = true

    const paint = (still: boolean) => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      apiRef.current.draw(ctx, palette.current, still)
      ctx.globalAlpha = 1
    }
    const running = () => visible && !document.hidden && !motion.matches
    const tick = (now: number) => {
      apiRef.current.update(Math.min(0.05, (now - last) / 1000), false)
      last = now
      paint(false)
      frame = running() ? requestAnimationFrame(tick) : 0
    }
    const sync = () => {
      if (running()) {
        if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick) }
      } else {
        if (frame) { cancelAnimationFrame(frame); frame = 0 }
        if (motion.matches) { apiRef.current.update(0, true); paint(true) }
      }
    }
    const resize = () => {
      const ratio = Math.min(2, window.devicePixelRatio || 1)
      width = board.clientWidth
      const vertical = width < verticalBelow
      board.toggleAttribute('data-vertical', vertical)
      height = board.clientHeight
      cv.width = Math.round(width * ratio)
      cv.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      apiRef.current.measure(board.getBoundingClientRect(), vertical)
      apiRef.current.update(0, motion.matches)
      paint(motion.matches)
    }

    const sizeObserver = new ResizeObserver(resize)
    const viewObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    readPalette()
    sizeObserver.observe(board)
    viewObserver.observe(board)
    document.addEventListener('visibilitychange', sync)
    motion.addEventListener('change', sync)
    redraw.current = () => { apiRef.current.update(0, motion.matches); paint(motion.matches) }
    resize()
    sync()
    // Fonts change the size of the boxes, so measure again once they have loaded.
    document.fonts?.ready.then(resize)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      sizeObserver.disconnect()
      viewObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      motion.removeEventListener('change', sync)
      redraw.current = () => {}
    }
  }, [])

  // The diagram takes its colours from the page tokens, so both themes stay in step.
  useEffect(() => {
    readPalette()
    redraw.current()
  }, [theme])

  return { redraw: () => redraw.current() }
}
