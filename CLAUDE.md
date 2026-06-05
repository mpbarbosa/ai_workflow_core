# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install                          # install dependencies
npm test                             # run unit tests (jest, ~90% coverage threshold)
npm run test:coverage                # run tests with coverage report
npm run build                        # compile TypeScript → dist/
npm run lint                         # eslint on src/**/*.ts
npm run test:all                     # build + test + build:helpers + validate:helpers
python3 scripts/validate_context_blocks.py   # validate YAML context block structure
python3 scripts/validate_structure.py        # check directory structure
python3 scripts/validate_prompt_files.py     # validate *.prompt.md frontmatter and variable syntax
pre-commit run --all-files           # run all pre-commit hooks
```

Run a single test file:
```bash
npx jest src/__tests__/loader.test.ts
```

## Architecture

### Dual nature

This repo is both a **template library** (consumed as a Git submodule by other projects) and a **self-contained project** that dogfoods its own templates. The TypeScript module is the library portion; the `config/`, `workflow-templates/`, and `templates/` trees are the template portion.

### TypeScript config-loader module (`src/`)

The public API (`src/index.ts`) exposes a typed config-loading system built around two YAML files:

| File | Loader | Type |
|------|--------|------|
| `config/prompt_roles.yaml` | `loadPromptRoles()` | `PromptRolesConfig` |
| `config/ai_helpers.yaml` | `loadPersonas()` | `AIHelpersConfig` |

**Key pattern — `role_ref` resolution**: Personas in `ai_helpers.yaml` carry a `role_ref: <name>` pointer instead of inline `role_prefix` text. `resolveAllPersonas(config, roles)` replaces each `role_ref` with the concrete `role_prefix` string from `prompt_roles.yaml`, producing `ResolvedPersona` objects. This indirection keeps role text DRY across many personas.

Core functions in `src/loader.ts`:
- `loadPromptRoles` / `loadPersonas` — async YAML readers with shape validation
- `resolvePersona` / `resolveAllPersonas` — resolve `role_ref` → `role_prefix`
- `listPersonas` — returns sorted persona keys (only entries that satisfy `isPersonaConfig`)
- `validateConfig` — collects all broken `role_ref` links (used in CI; does not throw)

Non-persona entries in `ai_helpers.yaml` (language lookup tables, YAML anchor scalars) lack a `role_ref` field and are silently skipped by all resolution functions.

### Config files (`config/`)

- `prompt_roles.yaml` — canonical role definitions; each entry has `description` + `role_prefix`
- `ai_helpers.yaml` — persona definitions; each persona points to a role via `role_ref`
- `project_kinds.yaml` — schema for 8 project types; used by validation scripts
- `ai_prompts_project_kinds.yaml` — project-type-specific AI prompt templates
- `.workflow-config.yaml.template` — template consumers copy and customize with `{{PLACEHOLDER}}` substitution

### Tests

Unit tests live in `src/__tests__/` (jest runs only that directory). The `test/` directory at root contains additional integration-style tests outside jest's configured `roots`.

## Copilot prompts

Prompt files in `.github/prompts/` are invocable from Copilot Chat with `/name`:

| Prompt | Description |
|--------|-------------|
| `/add-role` | Scaffold a new role entry in `config/prompt_roles.yaml` |
| `/add-persona` | Scaffold a new persona in the right `config/ai_helpers/` sub-file and regenerate the monolith |

Note: `config/ai_helpers.yaml` is a **generated file** — always edit sub-files in `config/ai_helpers/` and run `python3 scripts/build_ai_helpers.py` to rebuild it.

## Design constraints

- **Placeholder syntax**: Templates use `{{PLACEHOLDER}}` (double braces). Never substitute project-specific values in core template files.
- **Language-agnostic**: Config schemas and templates must not assume any specific language or runtime.
- **Documentation sync**: User-facing changes to templates or schemas must be reflected in `README.md`, `docs/ARCHITECTURE.md`, and `CHANGELOG.md`.
- **Coverage floor**: jest enforces 90% branches/functions/lines/statements; don't let it drop.
