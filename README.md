# Hemanth. — portfolio

Personal site of Hemanth Vankudoth, AI/ML engineer (IIT BHU '26).
Live at https://vhemanth45.github.io/HemanthPortfolio/

The whole page is one training run: the hero is a loss curve of my learning so far, every
section is an epoch, projects are written up as experiments, the about section is a model card,
skills are a `requirements.txt`, and contact is "inference". A small monitor in the nav draws the
loss curve as you scroll and converges when you reach the end.

Things to poke at:

- **The agents.** Claude and Codex (two pixel sprites, `src/components/herd/`) ride the hero
  curves, follow your cursor, comment on whatever you hover (`data-herd` attributes), and spend a
  usage limit as they go. A page-sized version of [herdr_agents_tracker](https://github.com/VHemanth45/herdr_agents_tracker)
  tracks them: the live figure in the first experiment and the dock in the bottom-left corner.
  "Hide" puts them to sleep (remembered per browser). With reduced motion they sit still.
- **The hero plot.** Hover, drag or arrow-key along it to read train/val loss and milestones.
- **The training log.** Click any `[tag]` to grep the log for it.
- **The REPL.** The terminal in the contact section takes input; try `help()`.

## Editing content

Everything the site says lives in [`src/data/content.js`](src/data/content.js): profile, hero
notes, featured experiments, the runs table, model card, training log, writing and stack.
Numbers there are quoted from each project's own README or committed outputs — keep it that way.
Copy is in sentence case; code, package names, tags and file names stay as they are typed.

Images live in `public/img/` (WebP, ~1600px wide). `public/og.png` is the 1200×630 link preview.

## Stack

React 18 + Vite 5, Tailwind CSS 3, Framer Motion. Fonts are self-hosted via Fontsource:
Instrument Serif (display), Geist (body), Geist Mono (labels), Kalam (margin notes).
The only colours are matplotlib's tab10 palette, on engineering-pad paper.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173/HemanthPortfolio/
npm run build     # production build into dist/
npm run preview   # serve the build locally
npm run deploy    # build and publish dist/ to the gh-pages branch
```

The old static template site is kept in `legacy/` for reference; it isn't part of the build.
