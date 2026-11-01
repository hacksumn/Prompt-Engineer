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

`npm run build` regenerates the standalone `dist/AIM-Studio.html`. `npm test` runs the engine, adaptive-flow, and mocked-server tests (20 at last run). The browser audit requires Playwright and Chromium; install Playwright separately in your development environment with `npm install --no-save --package-lock=false playwright` and `npx playwright install chromium`, then run `npm run test:browser`. An existing `/usr/bin/chromium` is reused; `CHROMIUM_PATH` can override the executable. The audit intercepts network requests, uses isolated browser contexts and synthetic prompt records, and covers 36 manual paths plus the quick-start flow, reset, latest-input saving, reload persistence, multi-tab updates, import/export, deletion, clipboard fallback, malformed data, storage failures, and mobile layouts. It does not inspect or modify a user's saved library.

## Live AI conversation (requires backend setup)

The **Talk to AIM** view connects to the OpenAI Responses API through this repository's Node server. It is a new API assistant, not the existing ChatGPT session or subscription. It uses `gpt-4.1-mini` by default, asks context-dependent follow-ups, offers clickable choices, and drafts two prompt variations. No browsing tools are enabled; it cannot certify sources or cross-model agreement.

Set **AIM_OPENAI_API_KEY** securely in your server hosting settings. Set **AIM_ACCESS_TOKEN** to a strong random personal access code; this protects your paid endpoint. Never put the OpenAI key in HTML, JavaScript, Git, chat, or the app's browser connection form. Set **AIM_ALLOWED_ORIGINS** to a comma-separated list of permitted web origins; the default includes `https://hacksumn.github.io`. `AIM_MODEL` optionally selects a supported Responses API model with structured outputs. Production needs HTTPS in front of Node. The app retains only the backend address and personal access code in browser sessionStorage for that tab; conversations live in memory and are sent to your server and OpenAI. Requests set `store:false`; provider retention policies still apply. Saved prompts remain in browser localStorage.

Deploy the included `render.yaml` from the **main** branch using a Render Blueprint (or run the Node service on another HTTPS host). The blueprint generates AIM_ACCESS_TOKEN and asks you for AIM_OPENAI_API_KEY. Access to the OpenAI API is billed separately from ChatGPT subscriptions. Retrieve the generated personal access code in Render's environment settings, then enter the service's HTTPS address and that code under **Talk to AIM → Connect**. The hosted Node app also serves the full dashboard, so you can use its HTTPS address directly instead of GitHub Pages. GitHub Pages alone cannot execute this backend.

The backend enforces access-code authentication, an origin allowlist, a 20-request/minute per-instance limit, bounded request/history size, a server-side model instruction, structured-output validation, and timeout/error handling. For multi-user or scaled deployment, add proper user authentication, a shared rate-limit store, and operational monitoring. Do not publish without the access code configured.

`npm test` includes mocked provider tests for authentication, request forwarding, origin restrictions, validation, quota failures, and request limits. The browser audit includes mocked live-chat success/error flows. Passing these tests does not establish live API billing, model access, hosting readiness, or actual model-response quality; those require real credentials and deployment validation.

## Output contract and model-native structure

Every generated prompt ends its instructions with an **output contract**: a short bottom line first with a High, Moderate, or Low confidence level and the main remaining uncertainty; each material claim tagged Verified, Established, Assumption, or Opinion; and a closing self-check against the mission. The prompt also asks the receiving model to use every relevant tool actually enabled in that session and to name the ones it used, without claiming any tool exists.

Structure follows the selected target, based on each vendor's published guidance: **Claude** gets descriptive XML tags with the task last; **ChatGPT** gets Markdown sections (identity, instructions, output contract, context, task) with an XML wrapper only around supplied context; **Grok** gets a compact, directly stated layout with less scaffolding. User text cannot close or forge the structural tags. Requests to analyze or improve the user's own work (software, prompts, resumes, writing) get an audit-oriented path, honor a role the user states explicitly, and instruct the receiving model to inspect the real material before judging it.

## Automatic saving

Generating a prompt (quick start, the manual form, the decision web, refinement, or a Talk to AIM draft) saves it to the library automatically. Further generations from the same draft update that one saved record instead of adding duplicates, and switching between Precision and Deep exploration on a saved prompt updates it too. **Start over** or loading a starter begins a new record. The Save button remains for explicit updates. Saved prompts live in the browser's localStorage for the exact site address you use, so the GitHub Pages site and a Render address keep separate libraries; use Export library and Import JSON to move prompts between them.

## Neon chat workspace

Open `/#chat` for the conversation workspace: electric purple, pink, and blue accents; text-based assistant replies; a collapsible A.I.M. brief; in-tab conversation search/switching; and suggested-answer buttons. New conversation preserves earlier conversations in this tab. Refreshing clears that conversation history; saved prompts stay in the existing library. Connection settings and the API credential boundary are unchanged.

Enter sends by default; Shift+Enter inserts a newline. Uncheck Enter sends to use Enter for newlines. A Stop response control cancels a pending browser request and preserves the message. A new-response button appears when an answer arrives while you are reading earlier messages. Keyboard focus returns to the composer when appropriate, without taking it away from another active control. Escape closes connection settings. Reduced-motion preferences disable movement and smooth scrolling.

The automated accessibility audit uses Playwright and axe-core. Install those development tools separately with `npm install --no-save --package-lock=false playwright axe-core`, then run `npm run test:a11y` after building. `AXE_CORE_PATH` can point to an existing `axe.min.js`; `CHROMIUM_PATH` can select an existing browser. The audit checks WCAG A/AA rules in welcome, connection, populated desktop, and populated mobile/reduced-motion states. Automated checks supplement keyboard testing and do not establish full screen-reader certification or comprehensive WCAG conformance.
