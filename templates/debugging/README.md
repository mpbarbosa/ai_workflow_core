# templates/debugging

This directory contains **reusable debugging checklists** for common front-end and JavaScript debugging scenarios. Each checklist is authored as a Markdown file and can be copied into any project as a starting point for systematic debugging.

## Checklists

| File | Purpose | Audience |
|------|---------|----------|
| `async-flow-debug-checklist.md` | Systematic guide for debugging asynchronous operations, Promise chains, and network request failures (e.g. CORS, timing, race conditions). | Front-end & full-stack developers |
| `browser-api-integration-checklist.md` | Step-by-step checklist for diagnosing browser API integration issues (fetch, localStorage, Web APIs, cross-origin policies). | Front-end developers |
| `data-structure-debug-checklist.md` | Guide for validating and tracing data structures through transformation pipelines, covering shape mismatches, null/undefined propagation, and serialisation issues. | Front-end & back-end developers |
| `observer-pattern-debug-checklist.md` | Checklist for debugging event-driven / observer-pattern code, including event listener leaks, subscription ordering, and notification delivery failures. | Front-end & Node.js developers |

## How to use

1. Copy the relevant checklist into your project's debugging notes or issue tracker.
2. Work through each section methodically, checking off items as you rule them out.
3. Attach the filled-in checklist to the bug report or PR for traceability.

## Adding new checklists

- Name files with the pattern `<topic>-debug-checklist.md`.
- Start with an **Evidence Collection** section, then progress to **Analysis** → **Hypothesis** → **Verification**.
- Add an entry to the table above once the checklist is merged.
