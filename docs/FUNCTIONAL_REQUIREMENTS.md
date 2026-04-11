# Functional Requirements

**Current version**: 1.6.0
**Last Updated**: 2026-04-10

This document tracks functional requirements and module structure for `ai_workflow_core`,
as well as minor issue resolutions from the `fix-log-issues` workflow.

---

## Module Index

| Module | Source | Public API | Reference doc |
|---|---|---|---|
| Config Loader | `src/loader.ts` | `loadPromptRoles`, `loadPersonas`, `validateConfig`, `listPersonas`, `resolvePersona`, `resolveAllPersonas` | [PROMPT_ROLES_REFERENCE.md](api/PROMPT_ROLES_REFERENCE.md) |
| Types & Guards | `src/types.ts` | `PersonaConfig`, `PromptRolesConfig`, `AIHelpersConfig`, `ResolvedPersona`, `ConfigValidationResult`, `isPersonaConfig`, `isPromptRole`, `isPromptRolesConfig` | [PROMPT_ROLES_REFERENCE.md](api/PROMPT_ROLES_REFERENCE.md) |
| Public Entry Point | `src/index.ts` | Re-exports all of the above | [PROMPT_ROLES_REFERENCE.md](api/PROMPT_ROLES_REFERENCE.md) |
| AI Helpers Config | `config/ai_helpers.yaml` | 62 AI personas across 7 groups | [AI_HELPERS_REFERENCE.md](api/AI_HELPERS_REFERENCE.md) |
| Prompt Roles Config | `config/prompt_roles.yaml` | Role prefix definitions referenced by personas | [PROMPT_ROLES_REFERENCE.md](api/PROMPT_ROLES_REFERENCE.md) |
| Project Kinds | `config/project_kinds.yaml` | 8 project kind schemas with validation rules | [PROJECT_KINDS_SCHEMA.md](api/PROJECT_KINDS_SCHEMA.md) |
| Workflow Config | `config/.workflow-config.yaml.template` | Template with `{{PLACEHOLDER}}` substitution | [CONFIG_REFERENCE.md](api/CONFIG_REFERENCE.md) |

---

## Acceptance Criteria

### Config Loader (`src/`)

- `loadPromptRoles(filePath)` returns a `PromptRolesConfig` for valid YAML; throws `InvalidConfigError` for missing file, bad YAML, or wrong shape.
- `loadPersonas(filePath)` returns an `AIHelpersConfig` for valid YAML; throws `InvalidConfigError` for missing file or bad YAML.
- `resolvePersona(persona, key, roles)` returns a `ResolvedPersona` with `role_prefix` populated; throws `RoleNotFoundError` when the `role_ref` is not an own-property of `roles.roles`.
- `resolveAllPersonas(config, roles)` resolves all persona entries; skips non-persona entries; throws `RoleNotFoundError` on the first unresolvable reference.
- `listPersonas(config)` returns a sorted `string[]` of all persona keys detected via `isPersonaConfig`.
- `validateConfig(helpersConfig, rolesConfig)` returns `{ valid: true, errors: [] }` when all `role_ref` values are own-properties of `rolesConfig.roles`; returns `{ valid: false, errors: [...] }` with all failures when any are missing. Non-persona entries are ignored.

### Configuration Templates

- `config/.workflow-config.yaml.template` — all `{{PLACEHOLDER}}` patterns documented in [PLACEHOLDER_REFERENCE.md](api/PLACEHOLDER_REFERENCE.md).
- `config/project_kinds.yaml` — 8 supported project kinds; validation rules documented in [PROJECT_KINDS_SCHEMA.md](api/PROJECT_KINDS_SCHEMA.md).
- `config/ai_helpers.yaml` — 62 personas regenerable via `python3 scripts/build_ai_helpers.py`; all referenced `role_ref` values exist as own-properties in `config/prompt_roles.yaml`.

---

## Roadmap — Minor Issues

> Populated by the `fix-log-issues` skill. Each item was verified against
> the live codebase before being marked done.

| ID | Source step | Description | File / Path | Priority | Status |
|----|------------|-------------|-------------|----------|--------|
| RI-001 | step_05 | Undocumented directory src/__tests__ | src/__tests__/README.md | Medium | done |
| RI-002 | step_05 | Undocumented directory src/__tests__/fixtures | src/__tests__/fixtures/README.md | Medium | done |
| RI-003 | step_05 | docs/workflow-automation not cross-referenced in top-level navigation | README.md, docs/ARCHITECTURE.md | Medium | done |
| RI-004 | step_02 | Broken link: docs/architecture/OVERVIEW.md → INTEGRATION_PATTERNS.md | docs/architecture/INTEGRATION_PATTERNS.md | Medium | done |
| RI-005 | step_02 | Broken link: docs/architecture/OVERVIEW.md → ADR.md | docs/architecture/ADR.md | Medium | done |
| RI-006 | step_05 | Undocumented directory templates/debugging | templates/debugging/README.md | Low | done |
| RI-007 | step_06 | DRY violations in src/__tests__/loader.test.ts | src/__tests__/loader.test.ts | Low | done |
| RI-008 | step_13 | CHANGELOG.md missing final newline (MD047) | CHANGELOG.md | Low | done |
| RI-009 | step_13 | docs/api/SCRIPT_API_REFERENCE.md missing final newline (MD047) | docs/api/SCRIPT_API_REFERENCE.md | Low | done |
| RI-010 | step_13 | Widespread trailing spaces in markdown files (MD009) | docs/ (40+ files), root .md files | Low | done |
| RI-011 | step_02 | Broken links to non-existent PROMPT_ROLES_REFERENCE.md in README.md | README.md | Medium | done |
| RI-012 | step_02 | Broken link to TROUBLESHOOTING.md in docs/TESTING.md (line 965) | docs/TESTING.md | Low | done |
| RI-013 | step_05 | templates/ directory not listed in ARCHITECTURE.md directory tree | docs/ARCHITECTURE.md | Low | done |
| RI-014 | step_02 | validate_context_blocks.py fails — multi-line context bullet in step2_consistency_prompt | config/ai_helpers.yaml | Low | done |
| RI-015 | step_13 | MD007/MD005 list indentation violations in AI_HELPERS_REFERENCE.md | docs/api/AI_HELPERS_REFERENCE.md | Low | done |
| RI-016 | step_05 | src/__tests__/ not listed in ARCHITECTURE.md directory tree | docs/ARCHITECTURE.md | Low | done |
| RI-017 | step_02 | Broken relative links in docs/misc/DOCUMENTATION_INDEX.md (~30 links) | docs/misc/DOCUMENTATION_INDEX.md | Medium | done |
| RI-018 | step_23 | readFileSync blocks event loop in src/loader.ts readYamlFile | src/loader.ts | Medium | done |
| RI-019 | step_13 | Missing final newline (MD047) in 3 files | docs/CODE_OF_CONDUCT.md, docs/api/AI_HELPERS_REFERENCE.md, docs/misc/documentation_analysis_parallel.md | Low | done |
| RI-020 | step_13 | Trailing whitespace (MD009) in docs/api/AI_HELPERS_REFERENCE.md line 124 | docs/api/AI_HELPERS_REFERENCE.md | Low | done |
| RI-021 | step_13 | Trailing punctuation in markdown headers (MD026) across 11 files | docs/ (11 files) | Low | done |
| RI-022 | step_02 | Broken relative links in docs/reference/QUICK_REFERENCE_CARD.md lines 170-171 | docs/reference/QUICK_REFERENCE_CARD.md | Medium | done |
| RI-023 | step_02 | Broken relative link in docs/misc/documentation_analysis_parallel.md line 416 | docs/misc/documentation_analysis_parallel.md | Low | done |
| RI-024 | step_02 | Broken workflow templates link in workflow automation docs | docs/workflow-automation/README.md | Medium | done |
| RI-025 | step_08 | Workflow config still targeted YAML-only validation instead of the repo's TypeScript/npm workflow | .workflow-config.yaml | Medium | done |
