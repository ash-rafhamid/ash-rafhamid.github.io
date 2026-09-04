export type ProjectCategory = 'Infrastructure' | 'Product' | 'Applied ML' | 'Systems'

export type Project = {
  id: string
  index: string
  title: string
  category: ProjectCategory
  year: string
  status: string
  thesis: string
  summary: string
  contribution: string
  stack: string[]
  evidence: string[]
  chapters: Array<{ label: string; title: string; body: string }>
  visual: 'crashlens' | 'agentfence' | 'contextbridge' | 'localfix' | 'classifier' | 'hospital'
  source?: string
  live?: string
}

export const projects: Project[] = [
  {
    id: 'crashlens',
    index: '01',
    title: 'CrashLens',
    category: 'Infrastructure',
    year: '2026',
    status: 'Released system',
    thesis: 'Browser failures, made legible.',
    summary:
      'A self-hosted error-monitoring system that turns browser exceptions, breadcrumbs and runtime context into grouped, searchable incidents.',
    contribution:
      'Designed the browser SDK, ingestion API, PostgreSQL model and operational dashboard as one coherent debugging workflow.',
    stack: ['TypeScript', 'Next.js', 'Express', 'PostgreSQL'],
    evidence: ['Published browser SDK', 'Live dashboard', 'Sensitive-field redaction', 'Regression detection'],
    chapters: [
      {
        label: 'Problem',
        title: 'An error without context is barely a clue.',
        body: 'Console traces disappear, repeated failures become noise, and a developer still has to reconstruct what happened before the exception. CrashLens begins from the moment around the failure, not the stack trace alone.',
      },
      {
        label: 'System',
        title: 'Capture, group, inspect, resolve.',
        body: 'A browser SDK records exceptions and breadcrumbs, the API validates and persists each event, fingerprinting groups repetition, and the dashboard exposes the evidence needed to move from symptom to cause.',
      },
      {
        label: 'Trust',
        title: 'Useful telemetry with explicit boundaries.',
        body: 'Common sensitive fields are redacted before transport. Private workspaces and project-scoped access keep operational data separated while regression detection brings returning failures back into view.',
      },
    ],
    visual: 'crashlens',
    source: 'https://github.com/ash-rafhamid/crashlens',
    live: 'https://crashlens-dashboard-six.vercel.app',
  },
  {
    id: 'agentfence',
    index: '02',
    title: 'AgentFence',
    category: 'Applied ML',
    year: '2026',
    status: 'Interactive concept',
    thesis: 'Autonomy needs a visible permission boundary.',
    summary:
      'A security concept for inspecting an AI agent action before it crosses from reasoning into execution.',
    contribution:
      'Defined a permission model that makes scope, consequence and human approval visible at the moment an action is proposed.',
    stack: ['Policy design', 'Agent security', 'Human-in-the-loop', 'Interaction model'],
    evidence: ['Permission states', 'Action inspection', 'Decision trace', 'In-page working prototype'],
    chapters: [
      {
        label: 'Question',
        title: 'What should an agent be allowed to do next?',
        body: 'The difficult part of an autonomous system is not producing a plan. It is deciding when that plan may change external state. AgentFence treats this boundary as a first-class interface.',
      },
      {
        label: 'Model',
        title: 'Allow, require approval, or block.',
        body: 'Each proposed tool action is paired with an explicit policy state. The system exposes the resource, scope and expected consequence before a decision can be made.',
      },
      {
        label: 'Evidence',
        title: 'A concept made testable through interaction.',
        body: 'The live permission run on this portfolio lets visitors change the policy and see the resulting execution path. It is labelled as a concept, not presented as a released product.',
      },
    ],
    visual: 'agentfence',
  },
  {
    id: 'contextbridge',
    index: '03',
    title: 'Context Bridge',
    category: 'Product',
    year: '2026',
    status: 'Released extension',
    thesis: 'Your AI conversations should remain portable.',
    summary:
      'A privacy-first Chrome extension that exports visible, loaded AI conversations into Markdown, JSON or plain text.',
    contribution:
      'Built a local-only export workflow across six major AI interfaces, with format controls and warnings around sensitive conversation text.',
    stack: ['Chrome extension', 'JavaScript', 'DOM extraction', 'Privacy design'],
    evidence: ['Six supported services', 'Three export formats', 'No accounts or tracking', 'No external requests'],
    chapters: [
      {
        label: 'Need',
        title: 'Context gets trapped inside interfaces.',
        body: 'Long conversations contain decisions, drafts and working knowledge, yet moving that material elsewhere often means manual copying. Context Bridge creates a clean hand-off from the visible conversation.',
      },
      {
        label: 'Design',
        title: 'Portable without becoming extractive.',
        body: 'Exports are generated locally from content already visible in the browser. The extension requires no account and adds no analytics, trackers or network request of its own.',
      },
      {
        label: 'Coverage',
        title: 'One careful workflow across varied products.',
        body: 'The extraction layer supports ChatGPT, Claude, Gemini, DeepSeek, Grok and Perplexity while preserving a simple choice between Markdown, JSON and plain text output.',
      },
    ],
    visual: 'contextbridge',
    source: 'https://github.com/ash-rafhamid/contextbridge-extension',
  },
  {
    id: 'localfix',
    index: '04',
    title: 'LocalFix',
    category: 'Product',
    year: '2025',
    status: 'Academic product build',
    thesis: 'A local problem should have a clear path to action.',
    summary:
      'An Android civic-reporting application for documenting infrastructure problems, adding visual evidence and helping urgent reports rise through community voting.',
    contribution:
      'Designed and built the reporting flow, Firebase-backed records, image evidence and location-ready Android experience.',
    stack: ['Java', 'Android Studio', 'Firebase', 'Maps API'],
    evidence: ['Image-led reports', 'Community voting', 'Persistent records', 'Location-ready flow'],
    chapters: [
      {
        label: 'Context',
        title: 'Small civic failures are easy to notice and hard to route.',
        body: 'A damaged road or broken public fixture rarely lacks witnesses. What is missing is a simple structure for evidence, location and collective priority.',
      },
      {
        label: 'Workflow',
        title: 'Notice, document, locate, support.',
        body: 'LocalFix reduces the reporting path to a small number of understandable actions. A photograph leads the record, supporting details make it actionable, and community votes surface urgency.',
      },
      {
        label: 'Build',
        title: 'An Android system shaped around real input.',
        body: 'The application combines a Java interface with Firebase persistence and a location-ready data model designed for reports that evolve after submission.',
      },
    ],
    visual: 'localfix',
  },
  {
    id: 'spam-classifier',
    index: '05',
    title: 'Spam Classifier',
    category: 'Applied ML',
    year: '2025',
    status: 'Measured study',
    thesis: 'A prediction earns trust through evaluation.',
    summary:
      'An end-to-end message classification study covering preparation, TF-IDF features, model comparison and an interface for testing new text.',
    contribution:
      'Structured the complete experimentation path from text preprocessing to comparative evaluation and interactive inference.',
    stack: ['Python', 'Scikit-learn', 'TF-IDF', 'Streamlit'],
    evidence: ['Three-model comparison', 'Evaluation workflow', 'Interactive inference', 'Reproducible pipeline'],
    chapters: [
      {
        label: 'Problem',
        title: 'Classification is easy to demo and easy to overstate.',
        body: 'A convincing label is not enough. The study was structured to keep preparation, feature extraction, model comparison and evaluation visible as separate decisions.',
      },
      {
        label: 'Method',
        title: 'Turn language into measurable signals.',
        body: 'Messages are cleaned and transformed with TF-IDF before multiple classifiers are compared under the same evaluation workflow.',
      },
      {
        label: 'Interface',
        title: 'A small test surface for new evidence.',
        body: 'A Streamlit interface allows a visitor to submit text and inspect the resulting classification without hiding the pipeline behind the interaction.',
      },
    ],
    visual: 'classifier',
  },
  {
    id: 'hospital-system',
    index: '06',
    title: 'Hospital System',
    category: 'Systems',
    year: '2024',
    status: 'Foundational build',
    thesis: 'Reliable records begin with dependable fundamentals.',
    summary:
      'A file-backed C system for patient, doctor and appointment records, built to study persistence, validation and complete CRUD workflows.',
    contribution:
      'Implemented the record model, persistent file operations, input validation and connected management flows from first principles.',
    stack: ['C', 'File handling', 'Data structures', 'Input validation'],
    evidence: ['Complete CRUD flow', 'Persistent storage', 'Custom structures', 'Validated input'],
    chapters: [
      {
        label: 'Foundation',
        title: 'Durability before abstraction.',
        body: 'The project approaches a familiar management problem without a framework, making memory, records and persistence explicit engineering concerns.',
      },
      {
        label: 'System',
        title: 'Connected records with clear operations.',
        body: 'Patient, doctor and appointment data move through create, read, update and delete paths backed by file storage and custom structures.',
      },
      {
        label: 'Lesson',
        title: 'Validation is part of the data model.',
        body: 'Handling imperfect input and preserving state across runs made reliability tangible at a low level, where there is little abstraction to absorb a mistake.',
      },
    ],
    visual: 'hospital',
  },
]

export const researchStudies = [
  {
    index: 'R–01',
    title: 'DQN versus PPO in Flappy Bird',
    question: 'How do value-based and policy-based agents differ under the same small control environment?',
    method: 'Stable Baselines3 agents, a Gymnasium-compatible environment, normalized observations, repeatable evaluation and training visualisation.',
    evidence: 'The public repository includes training, comparison, evaluation and recording scripts. No result is claimed here without the corresponding run.',
    outcome: 'A reproducible framework for studying learning behaviour rather than a single winning score.',
    source: 'https://github.com/ash-rafhamid/flappy-bird-reinforcement-learning',
  },
  {
    index: 'R–02',
    title: 'Measured message classification',
    question: 'What changes when a familiar classification demo is treated as an evaluation problem?',
    method: 'Text preparation, TF-IDF feature construction and three models compared through one consistent pipeline.',
    evidence: 'Model comparison and interactive inference are kept as separate stages so a plausible prediction is not mistaken for validation.',
    outcome: 'A compact applied-ML study centred on measurement, repeatability and honest boundaries.',
  },
]

export const capabilityEvidence = [
  {
    index: '01',
    title: 'AI & machine learning',
    statement: 'Experiment design, evaluation and interactive inference.',
    evidence: 'DQN/PPO study · classification pipeline · AgentFence concept',
    tools: 'Python · PyTorch · TensorFlow · Scikit-learn · NLP',
  },
  {
    index: '02',
    title: 'Software systems',
    statement: 'Interfaces, APIs and data models that remain inspectable.',
    evidence: 'CrashLens SDK/API/dashboard · persistent C records',
    tools: 'TypeScript · Java · Python · C/C++ · SQL · REST',
  },
  {
    index: '03',
    title: 'Product engineering',
    statement: 'Useful flows built around human evidence and control.',
    evidence: 'Context Bridge · LocalFix · permission interaction',
    tools: 'React · Android · Firebase · Chrome extensions · Git',
  },
]
