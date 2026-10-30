# Functional regression audit

Validation: `npm test`, `npm run build`, `npm run test:browser`.

Results: seven engine/adaptive-flow tests passed; thirteen browser audit groups passed; no unexpected JavaScript errors. Browser scenarios use isolated contexts and synthetic records. No personal prompt library was inspected or changed.

The browser audit exercises all 36 manual decision paths, the one-sentence adaptive path, downstream question changes, explicit assumptions for skipped choices, full reset with saved-library preservation, newest-input saving, repeated-save updates, reopening exact saved text, reload persistence, navigation, all starters and role/model buttons, refinement, variations, clipboard success/fallback, JSON download/import/deduplication, search/filtering, delete confirmation/cancellation, malformed or oversized imports, corrupt or blocked storage, quota failures, multiple tabs, validation, and mobile overflow checks.

Fixed defects: partial reset; stale generated inputs saved/copied/refined; duplicate records on repeated save; starters leaking prior optional values; invalid output-format option markup; saved prompt reopening overwriting its stored text; missing storage-failure visibility; clipboard fallback selecting unrelated output; malformed imported web paths crashing reopen; stale tabs potentially overwriting newer library records.

Saved prompts remain local to the browser and device, not cloud synchronized. Clearing browser data or private browsing may remove them; export backups. Adaptive suggestions are rule based, not model inference. Research/cross-model verification is requested in generated prompts and is not performed by this app.

## Optional live AI integration

Twelve engine/server tests and fifteen browser audit groups passed after adding Talk to AIM. Model-provider responses were mocked. Coverage includes server credential forwarding, code authentication, origin allowlisting, message/body validation, request limits, provider failures, conversational answer buttons, precise draft transfer to the studio/library, connection errors, blocked API-key entry in the browser, and preservation of messages after failed sends. A focused rerun also passed after adding target-model forwarding. No real OpenAI API key or hosting credentials were available. Live provider calls, real response quality, and private backend deployment remain unverified; the UI explicitly requires connection setup.
