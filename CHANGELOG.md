## CHANGELOG

# Changelog

All notable changes to the AI Workflow Core project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.2/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **`config/ai_helpers.yaml`** — Improved `OUTPUT FORMAT` block in `typescript_developer_prompt`:
  - Clarified that each change justification should be one sentence max.
  - Added guidance to include file path and line number (or surrounding snippet) per change.
  - Added guardrail: only suggest type changes backed by concrete evidence of unsafety or a policy violation; avoid speculative fixes.
  - Appended a short example output block so reviewers have a clear template to follow.

## [1.2.3] — 2026-04-01

### Added

- **`config/prompt_roles.yaml`** — New central configuration file containing 29 named role
  definitions (all `role_prefix:` values previously inline in `ai_helpers.yaml`). Each entry
  has a `description:` and `role_prefix:` field. This is now the **single source of truth** for
  AI persona role/identity text. See `docs/api/PROMPT_ROLES_REFERENCE.md`.

- **TypeScript config-loader module** (`src/`) — New typed module for loading and resolving
  prompt role references at runtime:
  - `src/types.ts` — Strict interfaces: `PromptRole`, `PromptRolesConfig`, `PersonaConfig`,
    `ResolvedPersona`, `AIHelpersConfig`, and custom errors `RoleNotFoundError` /
    `InvalidConfigError`. Includes type guards `isPromptRole`, `isPromptRolesConfig`,
    `isPersonaConfig`.
  - `src/loader.ts` — Functions: `loadPromptRoles()`, `loadPersonas()`, `resolvePersona()`,
    `resolveAllPersonas()`.
  - `src/index.ts` — Public API re-exports.

- **Unit tests** (`src/__tests__/loader.test.ts`) — 36 tests covering:
  - `loadPromptRoles`: happy path, missing file, bad YAML, wrong shape
  - `loadPersonas`: happy path, missing file, bad YAML
  - `resolvePersona`: resolution, field preservation, `RoleNotFoundError`
  - `resolveAllPersonas`: happy path, skips non-persona entries, throws on bad ref
  - Type guards: `isPromptRole`, `isPromptRolesConfig`, `isPersonaConfig`
  - Error classes: `InvalidConfigError`, `RoleNotFoundError`

- **`docs/api/PROMPT_ROLES_REFERENCE.md`** — Full API reference for `prompt_roles.yaml`,
  the `role_ref:` pattern, TypeScript interfaces, loader functions, error types, type guards,
  and a table of all 29 available role keys.

- **TypeScript/Jest infrastructure**: `tsconfig.json`, `jest.config.ts`. New devDependencies:
  `typescript`, `ts-jest`, `ts-node`, `jest`, `@types/jest`, `@types/node`, `@types/js-yaml`.
  New runtime dependency: `js-yaml`.

### Changed

- **`config/ai_helpers.yaml`** — All 29 inline `role_prefix:` blocks replaced with
  `role_ref: <key>` references pointing to `config/prompt_roles.yaml`. File size reduced
  by ~11.6 KB. All other fields (`behavioral_guidelines`, `task_template`, `approach`,
  `output_format`) are unchanged. Existing YAML-only consumers will see `role_ref:` keys
  instead of `role_prefix:` — use the TypeScript loader or follow the reference manually.

- **`config/README.md`** — Updated to document `prompt_roles.yaml`, the `role_ref:` pattern,
  and the TypeScript config-loader usage example.

- **`README.md`** — Updated version badge to 1.2.3, added TypeScript loader section, added
  `PROMPT_ROLES_REFERENCE.md` to API references table.

- **`package.json`** — Added `name`, `version`, `description`, `main`, `types`, `scripts`,
  `dependencies`, and expanded `devDependencies` with TypeScript/Jest tooling.

---

### Changed — Phase 1 Refinement (2026-03-06, v6.7.6)

Phase 1 of ROADMAP.md implemented: 7 backward-compatible structural improvements to `config/ai_helpers.yaml`. No new personas added. Net token savings: ~160–255 tokens/workflow (running total vs. v3.0.0: ~1,560–1,755 tokens).

- **v6.7.0 — Remove legacy `role` fields** (R-01)
  - Removed redundant `role:` field from 12 personas: `test_strategy_prompt`, `quality_prompt`, `issue_extraction_prompt`, `step2_consistency_prompt`, `step3_script_refs_prompt`, `step4_directory_prompt`, `step5_test_review_prompt`, `step7_test_exec_prompt`, `step8_dependencies_prompt`, `step9_code_quality_prompt`, `step11_git_commit_prompt`, `markdown_lint_prompt`
  - `role_prefix` is the authoritative field since v4.0.0; `role` was vestigial
  - Token savings: ~110–165 tokens/workflow

- **v6.7.1 — Modernize `single_file_test_prompt`** (R-02

---

## README

# Configuration Templates

This directory contains configuration file templates that can be customized for language-specific projects.

## Files

### `.workflow-config.yaml.template`
Main workflow configuration template. Copy to your project root as `.workflow-config.yaml` and customize with your project details.

**Placeholders:**
- `{{PROJECT_NAME}}` - Your project name
- `{{PROJECT_TYPE}}` - Project type (e.g., bash-automation-framework, nodejs-application)
- `{{PROJECT_DESCRIPTION}}` - Project description
- `{{PROJECT_KIND}}` - Project kind (e.g., shell_script_automation, nodejs_api, react_spa) - see project_kinds.yaml
- `{{VERSION}}` - Current version
- `{{LANGUAGE}}` - Primary language (bash, javascript, python, etc.)
- `{{BUILD_SYSTEM}}` - Build system (none, npm, webpack, etc.)
- `{{TEST_FRAMEWORK}}` - Test framework (shell-script, jest, pytest, etc.)
- `{{TEST_COMMAND}}` - Command to run tests
- `{{LINT_COMMAND}}` - Command to run linter

## Usage

```bash
# From your project root with ai_workflow_core as submodule
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Edit the file and replace all {{PLACEHOLDERS}} with actual values
# Or use sed for simple replacements:
sed -i 's/{{PROJECT_NAME}}/My Project/g' .workflow-config.yaml
sed -i 's/{{LANGUAGE}}/javascript/g' .workflow-config.yaml
# ... etc
```

## Gitignore Patterns

Add these patterns to your project's `.gitignore` file to exclude workflow artifacts:

```gitignore
# AI Workflow artifacts
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
```

## AI Prompt Configuration Files

### `prompt_roles.yaml` *(new in v1.2.3)*
**Single source of truth for all AI persona role definitions.**

Contains 29 named role entries, each with:
- `description` — one-line summary of the role's expertise
- `role_prefix` — the full identity/role text injected into the AI prompt

Personas in `ai_helpers.yaml` reference these roles via a `role_ref:` key instead of
inlining the role text directly. The TypeScript config-loader (`src/loader.ts`) resolves
references at load time.

**Schema:**
```yaml
roles:
  <role_key>:
    description: "One-line summary"
    role_prefix: |
      You are a senior ...
```

**Adding a new role:**
1. Add an entry under `roles:` with a unique snake_case key.
2. Provide `description:` and `role_prefix:` fields.
3. Reference it in `ai_helpers.yaml` with `role_ref: <your_key>`.
4. Run `npm test` to verify the reference resolves correctly.

See `docs/api/PROMPT_ROLES_REFERENCE.md` for the full API reference.

### `ai_helpers.yaml`
Core AI prompt templates for workflow automation. Contains 29 personas across
documentation, front-end, testing, development, debugging, and cloud categories.

As of v1.2.3, each persona uses `role_ref: <key>` to reference its role definition
from `prompt_roles.yaml`, instead of inlining the role text:

```yaml
# v1.2.3+ pattern
doc_analysis_prompt:
  role_ref: doc_analysis          # resolved from config/prompt_roles.yaml
  behavioral_guidelines: ...
  task_template: |
    ...
  approach: |
    ...
```

Uses YAML anchors (`&behavioral_actionable`, `&behavioral_structured`,
`&behavioral_generative`) for token-efficient sharing of behavioral guidelines
across personas.

**Usage Guidelines:**
- Use `technical_writer_prompt` for: New projects, major rewrites, undocumented codebases
- Use `doc_analysis_prompt` for: Incremental updates after code changes
- Use `consistency_prompt` for: Documentation audits and quality assurance
- Use `e2e_test_engineer_prompt` for: E2E testing strategy for front-end projects
- Use `test_strategy_prompt` for: Strategic test coverage analysis (WHAT to test)
- Use `front_end_developer_prompt` for: Front-end code implementation and unit testing

### `ai_prompts_project_kinds.yaml`
Language-specific prompt customizations for different project types (bash, javascript, python, etc.).

### `pro

---

## PROMPT_ROLES_REFERENCE

# PROMPT_ROLES_REFERENCE.md — Prompt Roles API Reference

**Version**: 1.0.0
**Last Updated**: 2026-04-01
**File**: `config/prompt_roles.yaml`
**Module**: `src/loader.ts`

---

## Table of Contents

1. [Overview](#overview)
2. [prompt_roles.yaml Schema](#prompt_rolesyaml-schema)
3. [role_ref Pattern in ai_helpers.yaml](#role_ref-pattern-in-ai_helpersyaml)
4. [TypeScript Interfaces](#typescript-interfaces)
5. [Loader API](#loader-api)
6. [Error Types](#error-types)
7. [Type Guards](#type-guards)
8. [Usage Examples](#usage-examples)
9. [Available Role Keys](#available-role-keys)

---

## Overview

`config/prompt_roles.yaml` is the **single source of truth** for all AI persona role
definitions in the ai_workflow_core system.

Prior to v1.2.3, each persona in `ai_helpers.yaml` carried its own inline `role_prefix:`
block, duplicating large text blobs and making cross-project reuse impossible. The new
system separates the *what* (role definitions in `prompt_roles.yaml`) from the *how*
(task templates and approach in `ai_helpers.yaml`):

```
prompt_roles.yaml       ai_helpers.yaml
─────────────────       ────────────────
roles:                  doc_analysis_prompt:
  doc_analysis:   ◄───    role_ref: doc_analysis
    description: "..."    behavioral_guidelines: ...
    role_prefix: |        task_template: |
      You are a ...         Analyse {changed_files}...
```

The TypeScript config-loader (`src/loader.ts`) resolves `role_ref:` keys to the full
`role_prefix` text at load time, producing `ResolvedPersona` objects ready for use
in prompt construction.

---

## prompt_roles.yaml Schema

```yaml
roles:
  <role_key>:                 # snake_case identifier, unique within the file
    description: "<string>"  # One-line human-readable summary (used in docs/tooling)
    role_prefix: |            # Multi-line literal block — the actual prompt identity text
      You are a senior ...
```

### Field Specifications

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | `string` | ✅ | One-line summary. Used in documentation and error messages. |
| `role_prefix` | `string` (literal block `\|`) | ✅ | The full role/identity text injected into the AI prompt at construction time. |

### Naming Convention

- Role keys use **snake_case** (e.g., `doc_analysis`, `e2e_test_engineer`)
- Role keys are the **logical role name**, not the persona key from `ai_helpers.yaml`
  (e.g., `doc_analysis` not `doc_analysis_prompt`)
- Keys must be unique within the `roles:` mapping

---

## role_ref Pattern in ai_helpers.yaml

After the v1.2.3 refactor, persona entries in `ai_helpers.yaml` use `role_ref:` instead
of the old inline `role_prefix:` block:

```yaml
# ✅ v1.2.3+ pattern
doc_analysis_prompt:
  role_ref: doc_analysis          # key into prompt_roles.yaml > roles
  behavioral_guidelines: *behavioral_actionable
  task_template: |
    **YOUR TASK**: Analyse the changed files...
  approach: |
    **Methodology**:
    1. Scan changed files...

# ❌ old v1.0.x pattern (no longer used)
doc_analysis_prompt:
  role_prefix: |
    You are a senior technical documentation specialist...
  behavioral_guidelines: *behavioral_actionable
  ...
```

### Adding a New Persona

1. Add an entry to `config/prompt_roles.yaml` under `roles:`:
   ```yaml
   my_new_role:
     description: "Brief summary"
     role_prefix: |
       You are a senior ...
   ```
2. Add (or update) the persona in `ai_helpers.yaml`:
   ```yaml
   my_persona_prompt:
     role_ref: my_new_role
     behavioral_guidelines: *behavioral_actionable
     task_template: |
       ...
   ```
3. Run `npm test` — the test suite validates all `role_ref` keys resolve correctly.

---

## TypeScript Interfaces

Defined in `src/types.ts` and re-exported from `src/index.ts`.

### `PromptRole`

Represents a single entry under `roles:` in `prompt_roles.yaml`.

```typescript
interface PromptRole {
  description: string;  // one-line summary
  role_prefix: string;  // full
