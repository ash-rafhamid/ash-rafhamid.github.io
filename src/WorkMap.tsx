import { useRef, useState, type CSSProperties } from 'react'
import { anchor, clamp, drawSignal, traceCurve, useFlowCanvas, type Point } from './flow'
import { needs, skills, works } from './workMap'

// One pass, in seconds: the need lights up, its signal reaches the skills, then the work behind them.
const NEED_AT = 0.15
const SKILL_AT = 1.0
const SKILL_PULSE = 1.15
const WORK_AT = 2.0
const TRAVEL = 0.8
const CYCLE = 6.6
const IDLE = 10
/** Below this width the faint background connections fade almost away and only the active path shows. */
const COMPACT_BELOW = 420

type Anchors = { in: Point; out: Point }

const skillLabel = (id: string) => skills.find(skill => skill.id === id)?.label ?? id

export default function WorkMap() {
  const board = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const nodes = useRef(new Map<string, HTMLElement>())
  const [selected, setSelected] = useState(0)
  const engine = useRef({
    selected: 0,
    clock: 0,
    time: 0,
    lastInteract: -IDLE,
    over: false,
    hover: null as string | null,
    vertical: false,
    compact: false,
    levels: new Map<string, number>(),
    applied: new Map<string, number>(),
    anchors: new Map<string, Anchors>(),
  })

  const choose = (index: number, manual: boolean) => {
    const e = engine.current
    e.selected = index
    e.clock = 0
    if (manual) e.lastInteract = e.time
    setSelected(index)
  }

  const { redraw } = useFlowCanvas(board, canvas, {
    measure: (rect, vertical) => {
      const e = engine.current
      e.vertical = vertical
      e.compact = rect.width < COMPACT_BELOW
      nodes.current.forEach((el, id) => e.anchors.set(id, { in: anchor(el, rect, 'in', vertical), out: anchor(el, rect, 'out', vertical) }))
    },

    update: (dt, still) => {
      const e = engine.current
      e.time += dt
      e.clock = still ? 99 : e.clock + dt
      const lit = new Set(needs[e.selected].skills)
      const ease = (id: string, target: number) => {
        const current = e.levels.get(id) ?? 0
        const next = still ? target : current + (target - current) * (1 - Math.exp(-dt * (target > current ? 8 : 12)))
        e.levels.set(id, next)
        if (Math.abs(next - (e.applied.get(id) ?? -1)) > 0.003) {
          nodes.current.get(id)?.style.setProperty('--level', next.toFixed(3))
          e.applied.set(id, next)
        }
      }
      needs.forEach((need, i) => ease(need.id, i === e.selected ? 1 : 0))
      skills.forEach(skill => ease(skill.id, lit.has(skill.id) && e.clock >= SKILL_AT ? 1 : 0))
      works.forEach(work => ease(work.id, e.clock >= WORK_AT ? work.skills.filter(id => lit.has(id)).length / work.skills.length : 0))
      // Left alone, it walks through the needs. A click or a hover pauses that for a while.
      if (!still && e.clock > CYCLE && !e.over && e.time - e.lastInteract > IDLE) choose((e.selected + 1) % needs.length, false)
    },

    draw: (ctx, palette, still) => {
      const e = engine.current
      const v = e.vertical
      const at = (id: string) => e.anchors.get(id)
      const need = needs[e.selected]
      const lit = new Set(need.skills)

      // Every real connection, drawn quietly.
      ctx.strokeStyle = palette.line
      ctx.lineWidth = 1
      ctx.globalAlpha = e.compact ? 0.25 : 0.95
      ctx.beginPath()
      for (const n of needs) for (const id of n.skills) { const a = at(n.id); const b = at(id); if (a && b) traceCurve(ctx, a.out, b.in, v) }
      for (const w of works) for (const id of w.skills) { const a = at(id); const b = at(w.id); if (a && b) traceCurve(ctx, a.out, b.in, v) }
      ctx.stroke()

      // Hovering a box follows everything that touches it.
      if (e.hover) {
        ctx.strokeStyle = palette.ink
        ctx.lineWidth = 1.2
        ctx.globalAlpha = 0.55
        ctx.beginPath()
        for (const n of needs) for (const id of n.skills) if (n.id === e.hover || id === e.hover) { const a = at(n.id); const b = at(id); if (a && b) traceCurve(ctx, a.out, b.in, v) }
        for (const w of works) for (const id of w.skills) if (w.id === e.hover || id === e.hover) { const a = at(id); const b = at(w.id); if (a && b) traceCurve(ctx, a.out, b.in, v) }
        ctx.stroke()
      }

      // The signal: from the chosen need to its skills, then on to the work that uses them.
      ctx.strokeStyle = palette.ink
      ctx.fillStyle = palette.ink
      const settled = (begin: number) => (still ? 1 : Math.exp(-Math.max(0, e.clock - begin - TRAVEL) * 0.8))
      if (e.clock >= NEED_AT) {
        const p = clamp((e.clock - NEED_AT) / TRAVEL)
        for (const id of need.skills) { const a = at(need.id); const b = at(id); if (a && b) drawSignal(ctx, a.out, b.in, v, p, 1, settled(NEED_AT)) }
      }
      if (e.clock >= SKILL_PULSE) {
        const p = clamp((e.clock - SKILL_PULSE) / TRAVEL)
        for (const w of works) for (const id of w.skills) if (lit.has(id)) { const a = at(id); const b = at(w.id); if (a && b) drawSignal(ctx, a.out, b.in, v, p, 1, settled(SKILL_PULSE)) }
      }
    },
  }, 0)

  const setNode = (id: string) => (el: HTMLElement | null) => { if (el) nodes.current.set(id, el); else nodes.current.delete(id) }
  const hover = (id: string | null) => ({
    onPointerEnter: () => { engine.current.hover = id },
    onPointerLeave: () => { engine.current.hover = null },
    onFocus: () => { engine.current.hover = id },
    onBlur: () => { engine.current.hover = null },
  })

  const need = needs[selected]
  const reached = works.filter(work => work.skills.some(id => need.skills.includes(id))).map(work => work.label)
  const summary = `${need.label}: uses ${need.skills.map(skillLabel).join(', ')}. Leads to ${reached.join(', ')}.`

  return <figure className="map">
    <figcaption className="flow-head"><span>How my work connects</span><span>Pick what you need</span></figcaption>
    <div className="flow-board" ref={board} style={{ '--cols': 3 } as CSSProperties}
      onPointerEnter={() => { engine.current.over = true }} onPointerLeave={() => { engine.current.over = false }}>
      <canvas ref={canvas} aria-hidden="true" />
      <div className="flow-col">
        <h3>You need</h3>
        <ul>{needs.map((n, i) => <li key={n.id}>
          <button type="button" className="flow-node" ref={setNode(n.id)} aria-pressed={selected === i} {...hover(n.id)} onClick={() => { choose(i, true); redraw() }}>{n.label}</button>
        </li>)}</ul>
      </div>
      <div className="flow-col">
        <h3>I use</h3>
        <ul>{skills.map(s => <li key={s.id}><span className="flow-node" ref={setNode(s.id)} {...hover(s.id)}>{s.label}</span></li>)}</ul>
      </div>
      <div className="flow-col">
        <h3>I’ve built</h3>
        <ul>{works.map(w => <li key={w.id}>
          <a className="flow-node" href={w.href} ref={setNode(w.id)} {...hover(w.id)}>{w.label}<small>{w.kind}</small></a>
        </li>)}</ul>
      </div>
    </div>
    <p className="flow-note">Skills and work light up where they are really connected.</p>
    <p className="visually-hidden" aria-live="polite">{summary}</p>
  </figure>
}
