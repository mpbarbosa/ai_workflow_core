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

**Version**: 6.8.29
**Last Updated**: 2026-04-09
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
   - [doc_analysis_prompt](#doc_analysis_prompt)
   - [consistency_prompt](#consistency_prompt)
   - [technical_writer_prompt](#technical_writer_prompt)
   - [requirements_engineer_prompt](#requirements_engineer_prompt) (NEW v6.1.0)
   - [test_strategy_prompt](#test_strategy_prompt)
   - [quality_prompt](#quality_prompt)
   - [issue_extraction_prompt](#issue_extraction_prompt)
   - [markdown_lint_prompt](#markdown_lint_prompt)
   - [version_manager_prompt](#version_manager_prompt)
   - [front_end_developer_prompt](#front_end_developer_prompt) (NEW v5.0.0)
   - [ui_ux_designer_prompt](#ui_ux_designer_prompt) (NEW v6.0.1)
   - [configuration_specialist_prompt](#configuration_specialist_prompt)
- [Language-Specific Standards](#language-specific-standards)
- [Version History](#version-history)
- [Integration Patterns](#integration-patterns)
- [Customization Guide](#customization-guide)

---

## Overview

The `config/ai_helpers.yaml` file defines **AI persona templates** used by workflow automation systems. Each persona represents a specialized AI role (documentation specialist, test engineer, code reviewer, etc.) with specific expertise, behavioral guidelines, and task templates.

**Key Features:**
- **61 AI personas** across 9 domain groups
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
