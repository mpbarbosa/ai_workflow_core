# src/__tests__

This directory contains the **Jest unit-test suite** for the `ai_workflow_core` TypeScript library.

## Structure

```
src/__tests__/
├── README.md          — This file
├── loader.test.ts     — Unit tests for the config-loader module
└── fixtures/          — YAML test-data files used by the test suite
```

## How tests are discovered

Tests are picked up via the `roots` setting in `jest.config.ts`, which points Jest at `src/`. Any file matching `**/*.test.ts` inside `src/` is treated as a test file.

## Relationship to `test/`

The top-level `test/` directory holds **YAML specification stubs** that describe expected behaviour in a human-readable format. Those files are *not* run by Jest; they serve as living documentation and may be processed by separate validation scripts.

## Running the tests

```bash
npm test              # run all tests once
npm run test:coverage # run with coverage report
```
