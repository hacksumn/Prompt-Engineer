# AIM Studio

A responsive, dependency-free prompt workspace for ChatGPT, Claude, and Grok. Create prompts using Actor, Input, and Mission; answer three clarification questions; switch between precision and exploration; save, search, copy, import, and export your library.

## Run

Requires Node.js 20 or later. No installation or API keys required.

```sh
npm start
npm test
```

The server listens on port 3000, or `PORT` when set. Use the existing checkout; no worktree is needed.

## Verification and privacy

Generation is deterministic local template composition, not an AI inference service. Evidence and cross-model checks are instructions for the receiving model, not checks executed by this app. No sources or claims are certified. The app asks for reasoning summaries and explanations, not private chain-of-thought.

Prompts are stored in this browser's localStorage. They are not encrypted or synced. Export JSON backups. Avoid entering secrets. Google Fonts is optional; system fonts work offline.

## HTTPS hosting

Deploy `index.html`, `styles.css`, `app.js`, and `engine.js` to an HTTPS static host (for example GitHub Pages, Netlify, or Cloudflare Pages). No build command is required; publish the repository root. Files use root-relative paths, so host at the domain root. Alternatively run `npm start` behind your host's HTTPS reverse proxy. This repository does not include a live deployment, account authentication, shared storage, model APIs, or research retrieval.

## Quick start and library behavior

Type one sentence in the quick-start box. The app suggests an expert and asks three clickable, context-sensitive follow-ups. Later questions branch based on earlier choices. You can build immediately using explicitly labeled provisional defaults. This is local rule-based guidance, not model inference or live research. The manual decision web and full editor remain available.

Start over clears the entire draft, both input flows, refinements, generated output, model/format defaults, and library filters. It never deletes saved prompts. Save captures your latest editor inputs (or latest web-field edits), reports success or failure, and updates an already opened/saved prompt rather than duplicating it on every click. To create a separate prompt, start over or choose a starter. Saved prompts use the existing storage key; export/import transfers them between browsers or devices. Private browsing and clearing browser data can erase them.

## Build and browser regression audit

`npm run build` regenerates the standalone `dist/AIM-Studio.html`. `npm test` runs the seven engine/adaptive-flow tests. The browser audit requires Playwright and Chromium; install Playwright separately in your development environment with `npm install --no-save --package-lock=false playwright` and `npx playwright install chromium`, then run `npm run test:browser`. An existing `/usr/bin/chromium` is reused; `CHROMIUM_PATH` can override the executable. The audit intercepts network requests, uses isolated browser contexts and synthetic prompt records, and covers 36 manual paths plus the quick-start flow, reset, latest-input saving, reload persistence, multi-tab updates, import/export, deletion, clipboard fallback, malformed data, storage failures, and mobile layouts. It does not inspect or modify a user's saved library.
