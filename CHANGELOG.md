## CHANGELOG

# Changelog

All notable changes to the AI Workflow Core project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.2/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **`CHANGELOG.md`** — Removed embedded README/reference content so release history remains changelog-only and partitioned documentation reviews no longer receive malformed changelog excerpts.
- **`config/ai_helpers/documentation_prompts.yaml`** — Broadened `doc_analysis_prompt` so the listed `doc_files` are treated as the minimum review set, with authoritative docs still in scope when the changed files imply them.
- **`src/__tests__/changelog_structure.test.ts`** — Added regression coverage to prevent embedded documentation sections from reappearing inside `CHANGELOG.md`.
- **`src/__tests__/documentation_prompt.test.ts`** — Added regression coverage for the widened documentation-analysis scope rules.
- **`.github/copilot-instructions.md`** — Corrected repository-boundary guidance so it acknowledges the configuration-focused TypeScript loader package surface (`src/index.ts` / `dist/`) while still forbidding workflow-execution claims.
- **`config/ai_helpers.yaml`** — Hardened `step12_git_commit_prompt` so partial diff context no longer justifies speculative file-specific body bullets, inferred benefits, or a forced "No breaking changes detected" line; the prompt now prefers shorter commit messages when the visible evidence is inconclusive.
- **`config/ai_helpers.yaml`** — Hardened `step2_consistency_prompt` documentation-link analysis rules so broken-reference reviews must resolve targets relative to the source file, can report `Unverified From Visible Context` when evidence is incomplete, and must not imply exhaustive success when checks remain inconclusive.
- **`package.json`** — npm publish now runs `build:helpers` via `prepublishOnly`, so the generated `config/ai_helpers.yaml` artifact is merged and validated before deployment.
- **`config/ai_helpers.yaml`** — Hardened `step5_directory_prompt` Task section (v7.0.12):
  - Rewrote the opening block so the Task section is explicitly self-contained, with the authoritative definitions for required structure and content/structure included in the same prompt block.
  - Clarified the precedence of structural evidence: prefer `.workflow-config.yaml`, then `project_kinds.yaml`, then visible project documentation.
  - Distinguished required-directory defects from best-practice recommendations so optional conventions are less likely to be reported as missing-directory errors.

## [1.6.0] — 2026-04-10

### Added

- **`src/loader.ts`** — New `validateConfig(helpersConfig, rolesConfig): ConfigValidationResult` function. Pre-flight checks that every persona's `role_ref` exists as an own-property of `rolesConfig.roles`, collecting **all** errors before returning (unlike `resolveAllPersonas` which throws on the first failure). Uses `Object.prototype.hasOwnProperty.call` to avoid prototype-chain false positives.
- **`src/types.ts`** — New `ConfigValidationResult` interface (`{ valid: boolean; errors: string[] }`).
- **`src/index.ts`** — `validateConfig` and `ConfigValidationResult` added to public exports.
- **`docs/api/PROMPT_ROLES_REFERENCE.md`** — New TypeScript Loader API Reference covering all 6 public functions, all types, type guards, custom errors, integration examples, and an error-handling guide.
- **`docs/FUNCTIONAL_REQUIREMENTS.md`** — Added `Current version` header, Module Index table, and Acceptance Criteria section.

### Fixed

- **`src/loader.ts` `resolvePersona`** — Role lookup now uses `Object.prototype.hasOwnProperty.call` instead of truthiness check, preventing false positives for prototype-inherited property names (`toString`, `constructor`, etc.).

## [1.5.0] — 2026-04-10

### Added

- **`src/loader.ts`** — New `listPersonas(config: AIHelpersConfig): string[]` function returns a sorted array of all persona key names in a loaded config, detected via `isPersonaConfig` structural type guard (consistent with `resolveAllPersonas`).
- **`src/index.ts`** — `listPersonas` added to public API exports.

### Changed

- **`docs/api/AI_HELPERS_REFERENCE.md`** — Fully expanded from 124 lines to comprehensive reference (v7.0.5): completed truncated `### Build` section, added File Structure, Token Efficiency System, YAML Anchor Pattern, full AI Persona Definitions (all 62 personas across 7 groups including specialist, library, and review groups), Language-Specific Standards, Version History, Integration Patterns, and Customization Guide sections. Updated persona count 61 → 62.
- **`README.md`** — Bumped footer version 1.0.2 → 1.5.0.
- **`docs/ARCHITECTURE.md`** — Bumped version header 1.0.2 → 1.5.0; updated ADR-004 core version; added v1.5.0 entry to version history table.

## [1.4.0] — 2026-04-09

### Added

- **`config/ai_helpers.yaml`** — New `python_developer_prompt` persona (v7.0.0): Senior Python developer (Vesper) specializing in `pyproject.toml` authoring, PEP 440 dependency management, pip-tools/Poetry lockfiles, tooling configuration (`pytest`/`mypy`/`ruff`/`black`/`coverage.py`), and `pip audit` security hygiene. Follows pyproject-first rule, supports requirements-only workflow, and includes explicit scope boundaries vs. `step9_dependencies_prompt` and `configuration_specialist_prompt`.
- **`config/prompt_roles.yaml`** — New `python_developer` role definition for Vesper; bumped to v1.7.0.

## [1.3.0] — 2026-04-09

### Changed

- **`config/ai_helpers.yaml`** — Renamed 7 step-specific prompt keys to align with JS workflow step numbering (**breaking** for consumers referencing these keys by name):
  - `step4_directory_prompt` → `step5_directory_prompt`
  - `step5_test_review_prompt` → `step6_test_review_prompt`
  - `step7_test_exec_prompt` → `step8_test_exec_prompt`
  - `step8_dependencies_prompt` → `step9_dependencies_prompt`
  - `step9_code_quality_prompt` → `step10_code_quality_prompt`
  - `step11_git_commit_prompt` → `step12_git_commit_prompt`
  - `step13_prompt_engineer_prompt` → `step14_prompt_engineer_prompt`
- **`config/prompt_roles.yaml`** — Updated inline comment reference from `step9_code_quality_prompt` → `step10_code_quality_prompt`.
- **`config/ai_helpers.yaml`** — Improved `configuration_specialist_prompt` Task section (v6.8.5):
  - Replaced vague opening sentence with explicit scope reference (`{config_count}` + `{config_files_list}`) and named the three validation dimensions (schema correctness, security hygiene, best practices).
  - Renamed sub-header "Configuration Files Changed" → "Configuration Files in Scope" for consistency with the new intro phrasing.
  - Added config-loader alignment check to "Special Handling for AI Workflow Configs": when `ai_helpers.yaml` or `prompt_roles.yaml` are in scope, verify `role_ref` resolvability via `src/loader.ts` and that the top-level YAML is a plain mapping.
  - Bumped Step 04 comment version 1.0.2 → 1.0.3; updated purpose string to "schema correctness".
- **`config/ai_helpers.yaml`** — Improved `OUTPUT FORMAT` block in `typescript_developer_prompt`:
  - Clarified that each change justification should be one sentence max.
  - Added guidance to include file path and line number (or surrounding snippet) per change.
  - Added guardrail: only suggest type changes backed by concrete evidence of unsafety or a policy violation; avoid speculative fixes.
  - Appended a short example output block so reviewers have a clear template to follow.

## [1.2.7] — 2026-04-01

### Added

- **`config/prompt_roles.yaml`** — New central configuration file containing 29 named role definitions (all `role_prefix:` values previously inline in `ai_helpers.yaml`). Each entry has a `description:` and `role_prefix:` field. This is now the **single source of truth** for AI persona role/identity text. See `docs/api/PROMPT_ROLES_REFERENCE.md`.
- **TypeScript config-loader module** (`src/`) — New typed module for loading and resolving prompt role references at runtime:
  - `src/types.ts` — Strict interfaces: `PromptRole`, `PromptRolesConfig`, `PersonaConfig`, `ResolvedPersona`, `AIHelpersConfig`, and custom errors `RoleNotFoundError` / `InvalidConfigError`. Includes type guards `isPromptRole`, `isPromptRolesConfig`, `isPersonaConfig`.
  - `src/loader.ts` — Functions: `loadPromptRoles()`, `loadPersonas()`, `resolvePersona()`, `resolveAllPersonas()`.
  - `src/index.ts` — Public API re-exports.
- **Unit tests** (`src/__tests__/loader.test.ts`) — 36 tests covering:
  - `loadPromptRoles`: happy path, missing file, bad YAML, wrong shape
  - `loadPersonas`: happy path, missing file, bad YAML
  - `resolvePersona`: resolution, field preservation, `RoleNotFoundError`
  - `resolveAllPersonas`: happy path, skips non-persona entries, throws on bad ref
  - Type guards: `isPromptRole`, `isPromptRolesConfig`, `isPersonaConfig`
  - Error classes: `InvalidConfigError`, `RoleNotFoundError`
- **`docs/api/PROMPT_ROLES_REFERENCE.md`** — Full API reference for `prompt_roles.yaml`, the `role_ref:` pattern, TypeScript interfaces, loader functions, error types, type guards, and a table of all 29 available role keys.
- **TypeScript/Jest infrastructure**: `tsconfig.json`, `jest.config.ts`. New devDependencies: `typescript`, `ts-jest`, `ts-node`, `jest`, `@types/jest`, `@types/node`, `@types/js-yaml`. New runtime dependency: `js-yaml`.

### Changed

- **`config/ai_helpers.yaml`** — All 29 inline `role_prefix:` blocks replaced with `role_ref: <key>` references pointing to `config/prompt_roles.yaml`. File size reduced by ~11.6 KB. All other fields (`behavioral_guidelines`, `task_template`, `approach`, `output_format`) are unchanged. Existing YAML-only consumers will see `role_ref:` keys instead of `role_prefix:` — use the TypeScript loader or follow the reference manually.
- **`config/README.md`** — Updated to document `prompt_roles.yaml`, the `role_ref:` pattern, and the TypeScript config-loader usage example.
- **`README.md`** — Updated version badge to 1.2.7, added TypeScript loader section, added `PROMPT_ROLES_REFERENCE.md` to API references table.
- **`package.json`** — Added `name`, `version`, `description`, `main`, `types`, `scripts`, `dependencies`, and expanded `devDependencies` with TypeScript/Jest tooling.
