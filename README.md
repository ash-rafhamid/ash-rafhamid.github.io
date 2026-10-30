# Ashraf Hamid Mojumder

[Visit the portfolio](https://ash-rafhamid.github.io/)

A personal portfolio presenting software projects, publications and a practical development toolkit. Built with React, TypeScript, Vite, Framer Motion and custom CSS.

## Selected projects

- **Ternyx** — an open, model-agnostic coding agent for the terminal, published on npm.
- **Context Bridge** — a privacy-first Chrome extension for exporting visible AI conversations locally.
- **CrashLens** — a self-hosted browser error monitoring SDK, API and dashboard.

## Research

- **FD-Loss: Supervised Feature Decorrelation as a Scale-Invariant Replacement for Random Dropout** — ICML 2026, MusIML workshop. [ICML](https://icml.cc/virtual/2026/80194) · [OpenReview](https://openreview.net/forum?id=A5D2DVEM8U)
- **An Explainable Ensemble Machine Learning Framework for Predicting IVIG Resistance in Kawasaki Disease** — accepted journal article. [DOI](https://doi.org/10.1016/j.meadig.2026.100056)
- **Explaining Compound-Covariant Degradation in Gait Recognition through Feature-Space Collapse** — COMPAS 2026 manuscript; public link forthcoming.
- **OtosFiNet: An Explainable Deep Learning-Based Approach for Automated Ear Disease Classification Using Otoscopic Images** — SPICSCON 2026 manuscript; public link forthcoming.

Paper titles, manuscript abstracts and acceptance information are supplied by the author. Private conference submission pages are not used as public paper links.

## Experience

- Warm light and dark themes built on DM Sans and DM Mono, with every colour defined as a design token.
- A short opening: a stationary tilted line releases the name and the letters return into it. On a first visit the line then grows into a tilted divider between a light and a dark half; hovering a side brightens it, and choosing one sweeps it across the screen. The choice is remembered, so returning visitors go straight into their theme.
- A theme toggle in the header cross-fades between light and dark at any time.
- A hero map that shows how the work connects. Pick what you need (a dev tool, a web app, image analysis, an explainable model) and a signal follows the skills I use to the projects and papers behind them. Every connection joins a skill to work that really uses it, taken from the project tags and paper topics on the page. Each node is a round shape. It cycles through the options on its own and hovering a node follows its connections. The same design is used on phones, where the faint background connections fade away and only the active path shows.
- An animated diagram of OtosFiNet in the research list, drawn only from the paper's abstract: two networks read the image in parallel, their features are merged, five categories come out, and Grad-CAM shows what mattered.
- Both diagrams pause when off screen and hold still for reduced-motion users. The header also compacts and the headline lifts slightly on scroll.
- A featured Ternyx case study with an example terminal session, project cards for Context Bridge and CrashLens, and a publication list with venues, status, key results and expandable abstracts.
- Subtle scroll entrances, keyboard-accessible navigation and theme chooser, and reduced-motion support throughout.

## Development

```bash
npm install
npm run dev
npx tsc --noEmit
npm run build
```

GitHub Actions builds the `dist/` directory and publishes it to GitHub Pages on updates to `main`.

## Contact

- [Email](mailto:ashrafhamidmajumder@gmail.com)
- [GitHub](https://github.com/ash-rafhamid)
- [LinkedIn](https://linkedin.com/in/ashrafhamid096)

Copyright 2026 Ashraf Hamid Mojumder. All rights reserved.
