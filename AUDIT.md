# Functional regression audit

Validation: `npm test`, `npm run build`, `npm run test:browser`.

Results: seven engine/adaptive-flow tests passed; thirteen browser audit groups passed; no unexpected JavaScript errors. Browser scenarios use isolated contexts and synthetic records. No personal prompt library was inspected or changed.

The browser audit exercises all 36 manual decision paths, the one-sentence adaptive path, downstream question changes, explicit assumptions for skipped choices, full reset with saved-library preservation, newest-input saving, repeated-save updates, reopening exact saved text, reload persistence, navigation, all starters and role/model buttons, refinement, variations, clipboard success/fallback, JSON download/import/deduplication, search/filtering, delete confirmation/cancellation, malformed or oversized imports, corrupt or blocked storage, quota failures, multiple tabs, validation, and mobile overflow checks.

Fixed defects: partial reset; stale generated inputs saved/copied/refined; duplicate records on repeated save; starters leaking prior optional values; invalid output-format option markup; saved prompt reopening overwriting its stored text; missing storage-failure visibility; clipboard fallback selecting unrelated output; malformed imported web paths crashing reopen; stale tabs potentially overwriting newer library records.

Saved prompts remain local to the browser and device, not cloud synchronized. Clearing browser data or private browsing may remove them; export backups. Adaptive suggestions are rule based, not model inference. Research/cross-model verification is requested in generated prompts and is not performed by this app.

## Optional live AI integration

Twelve engine/server tests and fifteen browser audit groups passed after adding Talk to AIM. Model-provider responses were mocked. Coverage includes server credential forwarding, code authentication, origin allowlisting, message/body validation, request limits, provider failures, conversational answer buttons, precise draft transfer to the studio/library, connection errors, blocked API-key entry in the browser, and preservation of messages after failed sends. A focused rerun also passed after adding target-model forwarding. No real OpenAI API key or hosting credentials were available. Live provider calls, real response quality, and private backend deployment remain unverified; the UI explicitly requires connection setup.

## Output contract, model-native structure, and inference fixes

Twenty engine, adaptive-flow, and server tests passed, and all fifteen browser audit groups passed in Chromium with mocked provider responses. Added coverage: explicit-role extraction, an improve-my-own-work task type, inflection handling (for example "symptoms", "cars"), model-specific structure with the task last, tag-injection neutralization, and fallback for an unknown target model. Not verified: live provider calls, real response quality of the new prompt structure against the old one, and Render deployment. The prompt layouts follow published vendor guidance but have not been A/B tested; see the report for the proposed evaluation.

## Automatic saving

Reproduced in Chromium: generating a prompt stored nothing until Save was clicked, and the Talk to AIM button labeled "Use in studio & save" did not save. All generation paths now save automatically and update one record instead of duplicating. Sixteen browser audit groups pass, including a new one covering auto-save, no duplicate on explicit Save, variant switching, new-record-on-start-over, and persistence after reload. Not covered: behavior in private browsing or with site data blocked (the existing storage-failure groups cover the failure messages).

## Neon chat redesign

Implemented a purple/pink/blue desktop conversation workspace, a collapsible A.I.M. brief, in-memory conversation switching/search, message suggestions, Enter-to-send preference, Stop control, reader-preserving arrival behavior, keyboard focus handling, and reduced-motion styles. Existing automatic library saving, model-specific prompt formats, inference improvements, and the 6000-token live assistant cap were retained from upstream.

Validation on the combined code: all 20 engine/server tests and all 18 browser audit groups passed. axe-core reported zero automated WCAG A/AA violations in four states: desktop welcome, open connection settings, desktop conversation with suggestions/drafts, and mobile conversation with reduced motion. A 320-pixel-wide reflow check found no horizontal overflow. This is automated and keyboard validation, not comprehensive assistive-technology certification. Chat provider responses in UI tests were mocked; no private access codes or real user conversations were used.
