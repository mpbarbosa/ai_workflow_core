## README

# config/ai_helpers/

These are the **source sub-files** for `config/ai_helpers.yaml`.

## Structure

| File | Contents |
|---|---|
| `_anchors.yaml` | 3 shared behavioral YAML anchors (`*behavioral_actionable`, `*behavioral_structured`, `*behavioral_generative`) |
| `documentation_prompts.yaml` | `doc_analysis_prompt`, `consistency_prompt`, `technical_writer_prompt` |
| `frontend_ux_prompts.yaml` | `front_end_developer_prompt`, `e2e_test_engineer_prompt`, `ui_ux_designer_prompt`, `tui_ux_designer_prompt` |
| `engineering_prompts.yaml` | `requirements_engineer_prompt`, `test_strategy_prompt`, `single_file_test_prompt`, `quality_prompt`, `issue_extraction_prompt` |
| `workflow_steps.yaml` | `step2_*` … `step14_*` + `error_resilience_prompt`, `markdown_lint_prompt`, `configuration_specialist_prompt` |
| `language_tables.yaml` | `language_specific_documentation`, `language_specific_quality`, `language_specific_testing` |
| `specialist_prompts.yaml` | `version_manager_prompt`, `aws_cloud_architect_prompt`, `javascript_developer_prompt`, `typescript_developer_prompt`, debugger personas, and other specialists |
| `library_prompts.yaml` | `library_architect_prompt`, `pattern_engineer_prompt`, `library_release_engineer_prompt`, `core_fetch_engineer_prompt`, `api_type_system_engineer_prompt`, `framework_integration_engineer_prompt`, `spec_architect_prompt` |
| `review_prompts.yaml` | `security_analyst_prompt`, `api_contract_reviewer_prompt`, `cli_tui_engineer_prompt`, `llm_integration_engineer_prompt`, `devx_engineer_prompt`, `core_pipeline_engineer_prompt`, `accessibility_review_prompt`, `performance_review_prompt` |

## Editing

Edit sub-files directly. **Do not edit `config/ai_helpers.yaml` directly** — it is a generated artifact.

After editing, regenerate the artifact:

```bash
python3 scripts/build_ai_helpers.py --validate
```

Or via npm:

```bash
npm run build:helpers
```

## Merge Order

The build script merges sub-files in the order listed above (`_anchors.yaml` first, always).
`_anchors.yaml` **must** be first because YAML aliases (`*behavioral_*`) are resolved at parse
time and must follow their anchor definitions in the document.

## Backward Compatibility

Consumer projects (`ai_workflow.js`, `olinda_prompter`) load `config/ai_helpers.yaml` via
hardcoded paths. The generated artifact keeps those integrations working without any changes.


---

## AI_HELPERS_REFERENCE

# AI Helpers Reference

**Version**: 7.0.5
**Last Updated**: 2026-04-10
**Schema File**: `config/ai_helpers.schema.json`
**Artifact**: `config/ai_helpers.yaml` *(generated — see [Source Structure](#source-structure))*

> **Purpose**: Complete reference for the `ai_helpers.yaml` configuration file. This document explains the AI persona system, YAML anchor patterns for token efficiency, language-specific standards injection, and prompt builder integration patterns.

---

## Table of Contents

- [Overview](#overview)
- [Source Structure](#source-structure)
- [File Structure (Generated Artifact)](#file-structure-generated-artifact)
- [Token Efficiency System](#token-efficiency-system)
- [YAML Anchor Pattern](#yaml-anchor-pattern)
- [AI Persona Definitions](#ai-persona-definitions)
   - [Documentation Personas](#documentation-personas)
      - [doc_analysis_prompt](#doc_analysis_prompt)
      - [consistency_prompt](#consistency_prompt)
      - [technical_writer_prompt](#technical_writer_prompt)
   - [Front-End & UX Personas](#front-end--ux-personas)
      - [front_end_developer_prompt](#front_end_developer_prompt)
      - [e2e_test_engineer_prompt](#e2e_test_engineer_prompt)
      - [ui_ux_designer_prompt](#ui_ux_designer_prompt)
      - [tui_ux_designer_prompt](#tui_ux_designer_prompt)
   - [Engineering Personas](#engineering-personas)
      - [requirements_engineer_prompt](#requirements_engineer_prompt)
      - [test_strategy_prompt](#test_strategy_prompt)
      - [quality_prompt](#quality_prompt)
      - [issue_extraction_prompt](#issue_extraction_prompt)
   - [Workflow Step Personas](#workflow-step-personas)
      - [configuration_specialist_prompt](#configuration_specialist_prompt)
      - [markdown_lint_prompt](#markdown_lint_prompt)
      - [version_manager_prompt](#version_manager_prompt)
   - [Specialist Personas](#specialist-personas)
      - [aws_cloud_architect_prompt](#aws_cloud_architect_prompt) (NEW v6.4.0)
      - [javascript_developer_prompt](#javascript_developer_prompt) (NEW v6.5.0)
      - [typescript_developer_prompt](#typescript_developer_prompt) (NEW v6.7.0)
      - [python_developer_prompt](#python_developer_prompt) (NEW v7.0.0)
   - [Library & Framework Personas](#library--framework-personas)
      - [library_architect_prompt](#library_architect_prompt)
      - [pattern_engineer_prompt](#pattern_engineer_prompt)
      - [library_release_engineer_prompt](#library_release_engineer_prompt)
      - [core_fetch_engineer_prompt](#core_fetch_engineer_prompt)
      - [api_type_system_engineer_prompt](#api_type_system_engineer_prompt)
      - [framework_integration_engineer_prompt](#framework_integration_engineer_prompt)
      - [spec_architect_prompt](#spec_architect_prompt)
      - [security_analyst_prompt](#security_analyst_prompt)
   - [Review & Automation Personas](#review--automation-personas)
      - [api_contract_reviewer_prompt](#api_contract_reviewer_prompt)
      - [cli_tui_engineer_prompt](#cli_tui_engineer_prompt)
      - [llm_integration_engineer_prompt](#llm_integration_engineer_prompt)
      - [devx_engineer_prompt](#devx_engineer_prompt)
      - [core_pipeline_engineer_prompt](#core_pipeline_engineer_prompt)
      - [accessibility_review_prompt](#accessibility_review_prompt)
      - [performance_review_prompt](#performance_review_prompt)
- [Language-Specific Standards](#language-specific-standards)
- [Version History](#version-history)
- [Integration Patterns](#integration-patterns)
- [Customization Guide](#customization-guide)

---

## Overview

The `config/ai_helpers.yaml` file defines **AI persona templates** used by workflow automation systems. Each persona represents a specialized AI role (documentation specialist, test engineer, code reviewer, etc.) with specific expertise, behavioral guidelines, and task templates.

**Key Features:**
- **62 AI personas** across 9 domain groups
- **Token efficiency optimization** (~1,560-1,755 tokens saved per workflow vs. v3.0.0)
- **YAML anchors** for DRY principle (`*behavioral_actionable`, `*behavioral_structured`, `*behavioral_generative`)
- **Language-specific injection** for polyglot support (11 languages)
- **Prompt builder integration** for dynamic composition

> ⚠️ **`config/ai_helpers.yaml` is a generated artifact.** The authoritative sources are the sub-files in `config/ai_helpers/`. Edit those and regenerate with `python3 scripts/build_ai_helpers.py`.

---

## Source Structure

The `config/ai_helpers/` directory contains the authoritative source sub-files:

| Sub-file | Personas | Contents |
|---|---|---|
| `_anchors.yaml` | — | 3 shared behavioral YAML anchors |
| `documentation_prompts.yaml` | 3 | `doc_analysis_prompt`, `consistency_prompt`, `technical_writer_prompt` |
| `frontend_ux_prompts.yaml` | 4 | `front_end_developer_prompt`, `e2e_test_engineer_prompt`, `ui_ux_designer_prompt`, `tui_ux_designer_prompt` |
| `engineering_prompts.yaml` | 5 | `requirements_engineer_prompt`, `test_strategy_prompt`, `single_file_test_prompt`, `quality_prompt`, `issue_extraction_prompt` |
| `workflow_steps.yaml` | 12 | `step2_*` … `step14_*` + `error_resilience_prompt`, `markdown_lint_prompt`, `configuration_specialist_prompt` |
| `language_tables.yaml` | — | `language_specific_documentation`, `language_specific_quality`, `language_specific_testing` |
| `specialist_prompts.yaml` | 22 | `version_manager_prompt`, `aws_cloud_architect_prompt`, `javascript_developer_prompt`, debugger personas, and others |
| `library_prompts.yaml` | 8 | `library_architect_prompt` … `spec_architect_prompt` |
| `review_prompts.yaml` | 7 | `security_analyst_prompt`, `api_contract_reviewer_prompt`, `cli_tui_engineer_prompt`, and others |

**`index.yaml`** (also in `config/ai_helpers/`) is a machine-readable map of `persona_key → sub-file`, auto-generated by the build script.

### Build

Regenerate `config/ai_helpers.yaml` after editing any sub-file:

```bash
python3 scripts/build_ai_helpers.py --validate
# or
npm run build:helpers
```

The `--validate` flag runs `isPersonaConfig` structural checks on every merged key
and aborts with a non-zero exit if any entry is malformed.

---

## File Structure (Generated Artifact)

`config/ai_helpers.yaml` opens with a version header comment followed by a flat
YAML mapping. All keys belong to one of three categories:

| Category | Key pattern | Example |
|---|---|---|
| Persona | `<name>_prompt` | `doc_analysis_prompt` |
| Language table | `language_specific_*` | `language_specific_quality` |
| YAML anchor | `_behavioral_*` | `_behavioral_actionable` |

Only **persona** entries have a `role_ref` field and are returned by
`listPersonas()` / `resolveAllPersonas()`.

---

## Token Efficiency System

Personas are split into two layers to avoid repeating the same text
for every workflow step:

1. **`role_prefix`** — identity + behavioral stance, loaded once from
   `config/prompt_roles.yaml` via `role_ref`.
2. **`behavioral_guidelines`** — shared anchor (e.g. `*behavioral_actionable`)
   that provides output-format rules without duplicating them per persona.
3. **`task_template`** — the step-specific instructions with `{placeholders}`.

This saves approximately **1,560 – 1,755 tokens per workflow run** compared to
inlining the full role text in every prompt (measured against v3.0.0).

---

## YAML Anchor Pattern

Three behavioral anchors are defined in `config/ai_helpers/_anchors.yaml` and
referenced throughout the sub-files:

| Anchor | Alias | Purpose |
|---|---|---|
| `&behavioral_actionable` | `*behavioral_actionable` | "Give concrete changes, not descriptions" |
| `&behavioral_structured` | `*behavioral_structured` | "Use structured tables / numbered lists" |
| `&behavioral_generative` | `*behavioral_generative` | "Write complete output, do not truncate" |

`_anchors.yaml` **must** be the first file merged so that YAML aliases resolve
before they are referenced in later sub-files.

---

## AI Persona Definitions

### Documentation Personas

Source file: `config/ai_helpers/documentation_prompts.yaml`

#### doc_analysis_prompt

**Role**: Incremental documentation auditor.
**Use case**: Step 02 of the workflow — scans existing docs for broken links,
stale references, and structural issues. Produces a machine-readable issue list.
**Behavioral anchor**: `*behavioral_structured`

#### consistency_prompt

**Role**: Documentation consistency reviewer (step 2 variant).
**Use case**: Cross-file terminology, style, and naming-convention check.
Flags deviations from the project's established vocabulary.
**Behavioral anchor**: `*behavioral_structured`

#### technical_writer_prompt

**Role**: Comprehensive from-scratch documentation writer.
**Use case**: Authoring new documentation files, restructuring existing docs,
or producing full API reference sections.
**Version**: v4.1.0

---

### Front-End & UX Personas

Source file: `config/ai_helpers/frontend_ux_prompts.yaml`

#### front_end_developer_prompt

**Role**: Front-end code implementation and architecture specialist.
**Use case**: UI component implementation, performance optimization, unit tests
for client-side code. **Not** for E2E or browser-automation work.
**Version**: v4.2.0 (NEW v5.0.0)

#### e2e_test_engineer_prompt

**Role**: End-to-end test automation engineer.
**Use case**: Designing and implementing E2E test suites (Playwright, Cypress,
Selenium), visual regression (Percy, Chromatic), accessibility automation, and
Core Web Vitals testing. Distinct from `test_strategy_prompt` (WHAT to test)
and `front_end_developer_prompt` (implementation + unit tests).
**Version**: v6.3.0

#### ui_ux_designer_prompt

**Role**: UI/UX design and interaction pattern specialist.
**Use case**: Design review, interaction pattern recommendations, component
hierarchy decisions, and accessibility guidance at the design level.
**Version**: v6.0.1 (NEW v6.0.1)

#### tui_ux_designer_prompt

**Role**: Terminal UI / text-based interface designer.
**Use case**: TUI layout, keyboard routing, ANSI colour schemes, and
accessibility for terminal applications.

---

### Engineering Personas

Source file: `config/ai_helpers/engineering_prompts.yaml`

#### requirements_engineer_prompt

**Role**: Requirements engineering specialist.
**Use case**: Extracting, clarifying, and structuring functional requirements
from narrative descriptions or issue trackers. Produces structured requirement
sets with acceptance criteria.
**Version**: v6.1.0 (NEW v6.1.0)

#### test_strategy_prompt

**Role**: Strategic test coverage analyst.
**Use case**: Determines WHAT to test (coverage gaps, risk areas, test pyramid
balance). Produces a prioritised test plan. Distinct from
`e2e_test_engineer_prompt` (HOW to automate E2E) and
`step6_test_review_prompt` (code quality review of existing tests).

#### quality_prompt

**Role**: Code quality reviewer.
**Use case**: General-purpose static analysis, SOLID principles, DRY
violations, complexity metrics, and code-smell identification.

#### issue_extraction_prompt

**Role**: Issue extraction specialist.
**Use case**: Parses workflow output or log text and extracts structured issue
records suitable for `plan.md` or issue trackers.

---

### Workflow Step Personas

Source file: `config/ai_helpers/workflow_steps.yaml`

These personas map 1:1 to numbered workflow steps (`step2_*` … `step14_*`)
plus three cross-cutting personas used at multiple steps.

| Persona key | Workflow step | Purpose |
|---|---|---|
| `step2_consistency_prompt` | Step 02 | Doc consistency audit |
| `step3_script_refs_prompt` | Step 03 | Shell script reference validation |
| `step5_directory_prompt` | Step 05 | Directory structure documentation |
| `step6_test_review_prompt` | Step 06 | Test code quality review |
| `step8_test_exec_prompt` | Step 08 | Test execution and failure triage |
| `step9_dependencies_prompt` | Step 09 | Dependency audit and CVE triage |
| `step10_code_quality_prompt` | Step 10 | Source-code quality analysis |
| `step12_git_commit_prompt` | Step 12 | Commit message generation |
| `step14_prompt_engineer_prompt` | Step 14 | Prompt quality review |
| `error_resilience_prompt` | Multiple | Error-recovery guidance |
| `markdown_lint_prompt` | Multiple | Markdown lint violation fixes |
| `configuration_specialist_prompt` | Step 04 | Config schema and security review |

#### configuration_specialist_prompt

**Role**: Configuration schema, security, and best-practices reviewer.
**Scope**: `ai_helpers.yaml`, `prompt_roles.yaml`, `.workflow-config.yaml`,
and any project config files in scope. Checks schema correctness, security
hygiene, and best practices. When `ai_helpers.yaml` or `prompt_roles.yaml`
are in scope, verifies `role_ref` resolvability via `src/loader.ts`.
**Version**: v1.0.3

#### markdown_lint_prompt

**Role**: Markdownlint violation fixer.
**Use case**: Given a list of MD-rule violations, produces the minimal edits
needed to reach zero violations.

#### version_manager_prompt

**Role**: Semantic versioning and changelog specialist (Step 15).
**Use case**: Determines the correct semver bump (major/minor/patch),
drafts CHANGELOG entries, and updates version references across config files.

---

### Specialist Personas

Source file: `config/ai_helpers/specialist_prompts.yaml`

#### aws_cloud_architect_prompt

**Role**: Senior AWS Cloud Architect.
**Use case**: Cloud architecture design/review, infrastructure-as-code
(Terraform / CloudFormation / CDK), security (GuardDuty, WAF, KMS),
cost optimisation, Well-Architected reviews, location-based services
(Amazon Location Service, Route 53 geo-routing, CloudFront geo-restriction),
and migration planning (6 R's).
**Version**: v6.4.0 (NEW v6.4.0)

#### javascript_developer_prompt

**Role**: JavaScript Developer — package manifest specialist (Vesper).
**Use case**: Auditing or authoring `package.json`; dependency classification
(`dependencies` vs `devDependencies`); semver strategies; npm/yarn/pnpm
scripts (`start`, `test`, `build`, `lint`, `format`); project metadata;
security hygiene (`npm audit`, lockfile, overrides); workspaces/monorepo.
**Scope boundary**: package.json management only. For UI components →
`front_end_developer_prompt`. For broader config → `configuration_specialist_prompt`.
**Version**: v6.5.0 (NEW v6.5.0)

#### typescript_developer_prompt

**Role**: TypeScript Developer — type-safety and idiomatic TS specialist.
**Use case**: Review, implement, or refactor TypeScript source under `src/`.
Produces change justifications with file path + line number per finding.
Only suggests type changes backed by concrete evidence of unsafety.
**Scope**: `src/types.ts`, `src/loader.ts`, `src/index.ts`, `src/__tests__/`.
**Version**: v6.7.0

#### python_developer_prompt

**Role**: Senior Python Developer — packaging manifest specialist (Vesper).
**Use case**: Authoring and optimising `pyproject.toml`, `requirements*.txt`,
`setup.cfg`, `tox.ini`; PEP 440 dependency management; pip-tools/Poetry
lockfiles; tooling configuration (`pytest`, `mypy`, `ruff`, `black`,
`coverage.py`); `pip audit` security hygiene.
**Scope boundary**: manifest layer only. CVE triage without audit data →
`step9_dependencies_prompt`. Generic YAML/TOML syntax validation →
`configuration_specialist_prompt`.
**Version**: v7.0.0 (NEW v7.0.0)

---

### Library & Framework Personas

Source file: `config/ai_helpers/library_prompts.yaml`

Designed for TypeScript library projects. All personas in this group assume
a library architecture context (`project_kind: configuration_library` or
similar).

| Persona key | Covers |
|---|---|
| `library_architect_prompt` | Public API design, module graph, tree-shaking, semver contract |
| `pattern_engineer_prompt` | Design patterns, composability, extensibility review |
| `library_release_engineer_prompt` | Release pipeline, version tags, dist bundle, publishing |
| `core_fetch_engineer_prompt` | HTTP client internals, retry logic, streaming, error boundaries |
| `api_type_system_engineer_prompt` | Generic type constraints, conditional types, branded types |
| `framework_integration_engineer_prompt` | Framework adapters (React, Vue, Angular, Express) |
| `spec_architect_prompt` | Spec review, step-kind compliance, review-gate assessment |
| `security_analyst_prompt` | OWASP Top 10, secret scanning, injection vectors, CVE triage, STRIDE |

---

### Review & Automation Personas

Source file: `config/ai_helpers/review_prompts.yaml`

Specialised review personas for specific technical domains.

| Persona key | Covers |
|---|---|
| `api_contract_reviewer_prompt` | OpenAPI/JSON Schema/GraphQL drift, breaking changes, type-safe boundary audit |
| `cli_tui_engineer_prompt` | Ink/React TUI components, keyboard routing, scroll state, panel layout |
| `llm_integration_engineer_prompt` | SDK session lifecycle, streaming generators, error recovery, token/cost tracking |
| `devx_engineer_prompt` | Jest/Vitest ESM test infrastructure, CI/CD pipelines, TypeScript build tooling |
| `core_pipeline_engineer_prompt` | Parsers, analyzers, pipeline orchestration, type system, reporters |
| `accessibility_review_prompt` | WCAG 2.1 AA/AAA, ARIA patterns, keyboard navigation, colour contrast, semantic HTML |
| `performance_review_prompt` | Algorithmic complexity, CPU hotspots, memory leaks, bundle size, build performance |

---

## Language-Specific Standards

Source file: `config/ai_helpers/language_tables.yaml`

Three lookup tables inject language-specific guidance into persona prompts
using the `{language_specific_*}` placeholder variables:

| Table key | Injected via | Content |
|---|---|---|
| `language_specific_documentation` | `{language_specific_documentation}` | Docstring formats, doc tooling per language |
| `language_specific_quality` | `{language_specific_quality}` | Linters, style guides, code quality standards per language |
| `language_specific_testing` | `{language_specific_testing}` | Test frameworks, coverage tools per language |

Supported languages: JavaScript, TypeScript, Python, Bash/Shell, YAML,
Ruby, Go, Rust, Java, C#, PHP (11 total).

---

## Version History

| Version | Date | Summary |
|---|---|---|
| v7.0.5 | 2026-04-10 | Added `python_developer_prompt` (Vesper); reference doc updated to reflect 62 personas |
| v7.0.0 | 2026-04-09 | Added `python_developer_prompt` persona |
| v6.8.5 | 2026-04-09 | Improved `configuration_specialist_prompt` Task section; renamed step-specific keys |
| v6.7.0 | 2026-04-09 | Added `typescript_developer_prompt` |
| v6.5.0 | 2026-04-09 | Added `javascript_developer_prompt` (Vesper) |
| v6.4.0 | 2026-04-09 | Added `aws_cloud_architect_prompt` |
| v6.3.0 | 2026-02-14 | Added `e2e_test_engineer_prompt` |
| v6.1.0 | 2026-02-01 | Added `requirements_engineer_prompt` |
| v6.0.1 | 2026-02-01 | Added `ui_ux_designer_prompt` |
| v5.0.0 | 2026-01-31 | Added `front_end_developer_prompt` |
| v3.0.0 | 2026-01-30 | Initial token-efficiency split (role_ref + behavioral_guidelines) |

---

## Integration Patterns

### Loading all personas

```typescript
import { loadPersonas, loadPromptRoles, resolveAllPersonas } from 'ai_workflow_core';

const roles   = await loadPromptRoles('config/prompt_roles.yaml');
const config  = await loadPersonas('config/ai_helpers.yaml');
const personas = resolveAllPersonas(config, roles);
// personas['doc_analysis_prompt'].role_prefix  → full role text
```

### Listing available persona keys

```typescript
import { listPersonas, loadPersonas } from 'ai_workflow_core';

const config = await loadPersonas('config/ai_helpers.yaml');
const keys   = listPersonas(config);
// ['accessibility_review_prompt', 'api_contract_reviewer_prompt', ...]
```

### Resolving a single persona

```typescript
import { loadPersonas, loadPromptRoles, resolvePersona } from 'ai_workflow_core';

const roles  = await loadPromptRoles('config/prompt_roles.yaml');
const config = await loadPersonas('config/ai_helpers.yaml');
const persona = resolvePersona(config['aws_cloud_architect_prompt'], 'aws_cloud_architect_prompt', roles);
```

---

## Customization Guide

### Adding a new persona

1. Choose the appropriate source sub-file in `config/ai_helpers/`.
2. Add a role entry to `config/prompt_roles.yaml` under `roles:`.
3. Add the persona entry to the sub-file with `role_ref:` pointing to the new role key.
4. Regenerate: `python3 scripts/build_ai_helpers.py --validate`.
5. Add a reference entry to this document under the appropriate group section.
6. Bump the version in `scripts/build_ai_helpers.py` HEADER constant and update CHANGELOG.md.

### Creating a new persona group

1. Create `config/ai_helpers/<group>_prompts.yaml` following the existing sub-file structure.
2. Add the filename to the merge order in `scripts/build_ai_helpers.py`.
3. Add a row to the Source Structure table in this document.
4. Regenerate and verify with `npm run build:helpers && npm test`.

