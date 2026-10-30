import { useRef, type CSSProperties } from 'react'
import { anchor, clamp, drawSignal, easeInOut, traceCurve, useFlowCanvas, type Point } from './flow'

// OtosFiNet as its abstract describes it: two networks read the image side by side, their features
// are merged, the merged features give one of five categories, and Grad-CAM shows what mattered.
type Node = { id: string; label: string; sub?: string; col: number }
const nodes: Node[] = [
  { id: 'image', label: 'Otoscopic image', col: 0 },
  { id: 'inception', label: 'InceptionV3', sub: 'Spatial factorization', col: 1 },
  { id: 'nasnet', label: 'NASNetMobile', sub: 'Searched blocks', col: 1 },
  { id: 'merge', label: 'Merged features', col: 2 },
  { id: 'predict', label: '5 diagnostic categories', col: 3 },
  { id: 'cam', label: 'Grad-CAM', sub: 'Which regions mattered', col: 4 },
]
const edges: [string, string, number][] = [
  ['image', 'inception', 0], ['image', 'nasnet', 0],
  ['inception', 'merge', 1], ['nasnet', 'merge', 1],
  ['merge', 'predict', 2], ['predict', 'cam', 3],
]
const BEGIN = 0.6
const STEP = 0.95
const TRAVEL = 0.75
const FADE_AT = 7.3
const LOOP = 8.4
const columns = [0, 1, 2, 3, 4]

const begins = (stage: number) => BEGIN + stage * STEP
const arrival = (id: string) => {
  const incoming = edges.find(edge => edge[1] === id)
  return incoming ? begins(incoming[2]) + TRAVEL : 0.25
}

export default function ArchitectureFlow() {
  const board = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const refs = useRef(new Map<string, HTMLElement>())
  const engine = useRef({
    clock: 0,
    vertical: false,
    levels: new Map<string, number>(),
    applied: new Map<string, number>(),
    anchors: new Map<string, { in: Point; out: Point }>(),
  })
  const fadeAt = (clock: number, still: boolean) => (still ? 1 : 1 - easeInOut(clamp((clock - FADE_AT) / 0.9)))

  useFlowCanvas(board, canvas, {
    measure: (rect, vertical) => {
      const e = engine.current
      e.vertical = vertical
      refs.current.forEach((el, id) => e.anchors.set(id, { in: anchor(el, rect, 'in', vertical), out: anchor(el, rect, 'out', vertical) }))
    },
    update: (dt, still) => {
      const e = engine.current
      e.clock = still ? 99 : (e.clock + dt) % LOOP
      const fade = fadeAt(e.clock, still)
      for (const node of nodes) {
        const target = (e.clock >= arrival(node.id) ? 1 : 0) * fade
        const current = e.levels.get(node.id) ?? 0
        const next = still ? target : current + (target - current) * (1 - Math.exp(-dt * (target > current ? 8 : 6)))
        e.levels.set(node.id, next)
        if (Math.abs(next - (e.applied.get(node.id) ?? -1)) > 0.003) {
          refs.current.get(node.id)?.style.setProperty('--level', next.toFixed(3))
          e.applied.set(node.id, next)
        }
      }
    },
    draw: (ctx, palette, still) => {
      const e = engine.current
      const fade = fadeAt(e.clock, still)
      ctx.strokeStyle = palette.line
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.95
      ctx.beginPath()
      for (const [from, to] of edges) { const a = e.anchors.get(from); const b = e.anchors.get(to); if (a && b) traceCurve(ctx, a.out, b.in, e.vertical) }
      ctx.stroke()
      ctx.strokeStyle = palette.ink
      ctx.fillStyle = palette.ink
      for (const [from, to, stage] of edges) {
        const a = e.anchors.get(from)
        const b = e.anchors.get(to)
        const begin = begins(stage)
        if (!a || !b || e.clock < begin) continue
        const p = clamp((e.clock - begin) / TRAVEL)
        drawSignal(ctx, a.out, b.in, e.vertical, p, fade, still ? 1 : Math.exp(-Math.max(0, e.clock - begin - TRAVEL) * 0.8))
      }
    },
  })

  const setNode = (id: string) => (el: HTMLElement | null) => { if (el) refs.current.set(id, el); else refs.current.delete(id) }

  return <figure className="flow">
    <figcaption className="flow-head"><span>How OtosFiNet works</span><span>From the paper’s abstract</span></figcaption>
    <div className="flow-board" ref={board} style={{ '--cols': 5 } as CSSProperties}>
      <canvas ref={canvas} aria-hidden="true" />
      {columns.map(col => <div className="flow-col flow-center" key={col}>
        <ul>{nodes.filter(node => node.col === col).map(node => <li key={node.id}>
          <span className="flow-node" ref={setNode(node.id)}>{node.label}{node.sub && <small>{node.sub}</small>}</span>
        </li>)}</ul>
      </div>)}
    </div>
    <p className="visually-hidden">The otoscopic image goes through two networks, InceptionV3 and NASNetMobile, in parallel. Their features are merged and classified into five diagnostic categories, and Grad-CAM highlights the regions that mattered.</p>
  </figure>
}
