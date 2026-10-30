// What the hero map shows. Every link between a skill and a piece of work comes from the project
// tags and paper topics elsewhere on this page. Only the needs on the left are editorial.
export type Skill = { id: string; label: string }
export type Need = { id: string; label: string; skills: string[] }
export type Work = { id: string; label: string; kind: 'Project' | 'Paper'; href: string; skills: string[] }

export const skills: Skill[] = [
  { id: 'extensions', label: 'Chrome extensions' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'node', label: 'Node.js' },
  { id: 'llm', label: 'LLM tool calling' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'next', label: 'Next.js' },
  { id: 'deep', label: 'Deep learning' },
  { id: 'vision', label: 'Computer vision' },
  { id: 'xai', label: 'Explainable AI' },
  { id: 'ensemble', label: 'Ensemble learning' },
]

export const needs: Need[] = [
  { id: 'tool', label: 'Build a dev tool', skills: ['extensions', 'javascript', 'node', 'llm', 'typescript'] },
  { id: 'web', label: 'Ship a web app', skills: ['typescript', 'next', 'javascript'] },
  { id: 'images', label: 'Analyse images', skills: ['deep', 'vision', 'xai'] },
  { id: 'explain', label: 'Explain a model', skills: ['xai', 'vision', 'ensemble'] },
]

export const works: Work[] = [
  { id: 'context', label: 'Context Bridge', kind: 'Project', href: '#context-bridge-title', skills: ['extensions', 'javascript'] },
  { id: 'ternyx', label: 'Ternyx', kind: 'Project', href: '#ternyx-title', skills: ['javascript', 'node', 'llm'] },
  { id: 'crashlens', label: 'CrashLens', kind: 'Project', href: '#crashlens-title', skills: ['typescript', 'next'] },
  { id: 'fd', label: 'FD-Loss', kind: 'Paper', href: '#paper-icml', skills: ['deep'] },
  { id: 'otos', label: 'OtosFiNet', kind: 'Paper', href: '#paper-otosfinet', skills: ['deep', 'vision', 'xai'] },
  { id: 'gait', label: 'Gait recognition', kind: 'Paper', href: '#paper-gait', skills: ['vision', 'xai'] },
  { id: 'kawasaki', label: 'Kawasaki IVIG', kind: 'Paper', href: '#paper-journal', skills: ['ensemble', 'xai'] },
]
