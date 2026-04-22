## ROADMAP

# Roadmap: `config/ai_helpers.yaml` — Persona & Prompt Set Progression

**Source File**: `config/ai_helpers.yaml`
**Current Version**: v6.8.30 (Phase 1 Refinement Complete — step key alignment + prompt improvements)
**Document Date**: 2026-04-09
**Repository**: `mpbarbosa/ai_workflow_core`

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Gap Analysis](#2-gap-analysis)
3. [Phase 1 — Refinement (v6.7.x)](#3-phase-1--refinement-v67x)
4. [Phase 2 — Expansion (v7.x.x)](#4-phase-2--expansion-v7xx)
5. [Phase 3 — Architecture Evolution (v8.x.x)](#5-phase-3--architecture-evolution-v8xx)
6. [Persona Inventory & Coverage Map](#6-persona-inventory--coverage-map)
7. [Language Coverage Matrix](#7-language-coverage-matrix)
8. [Token Efficiency Targets](#8-token-efficiency-targets)
9. [Prioritized Backlog](#9-prioritized-backlog)

---

## 1. Current State Assessment

### 1.1 Persona Inventory (v6.6.0)

**Core Personas (19 counted in header)**:

| Key | Group | Pattern | Status |
|-----|-------|---------|--------|
| `doc_analysis_prompt` | Documentation | Full (anchor) | ✅ Mature |
| `consistency_prompt` | Documentation | Full (anchor) | ✅ Mature |
| `technical_writer_prompt` | Documentation | Full (anchor + necessity gate) | ✅ Mature |
| `front_end_developer_prompt` | Front-End | Full (anchor) | ✅ Mature |
| `e2e_test_engineer_prompt` | Testing | Full (anchor) | ✅ Mature |
| `ui_ux_designer_prompt` | Design | Full (anchor) | ✅ Mature |
| `requirements_engineer_prompt` | Architecture | Full (anchor + necessity gate) | ✅ Mature |
| `test_strategy_prompt` | Testing | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `single_file_test_prompt` | Testing | Legacy `role` only — no anchor | ⚠️ Needs modernization |
| `quality_prompt` | Quality | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `issue_extraction_prompt` | DevOps | Full (anchor) + legacy `role` field | ⚠️ Thin, has legacy field |
| `step2_consistency_prompt` | Documentation | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step3_script_refs_prompt` | DevOps | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step5_directory_prompt` | Architecture | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step6_test_review_prompt` | Testing | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step8_test_exec_prompt` | Testing | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step9_dependencies_prompt` | DevOps | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step10_code_quality_prompt` | Quality | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step12_git_commit_prompt` | DevOps | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |

**Supplemental Specialists (not in 19-count)**:

| Key | Group | Pattern | Status |
|-----|-------|---------|--------|
| `markdown_lint_prompt` | Documentation | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `configuration_specialist_prompt` | DevOps | Full (anchor) | ✅ Mature |
| `step14_prompt_engineer_prompt` | Meta | Full (anchor) | ✅ Mature |
| `version_manager_prompt` | DevOps | Thin — no `task_template` field | ⚠️ Thin |
| `observer_pattern_debugger_prompt` | Debugging | Non-standard (`specific_expertise`) | ⚠️ Non-standard |
| `async_flow_debugger_prompt` | Debugging | Non-standard (`specific_expertise`) | ⚠️ Non-standard |
| `data_structure_debugger_prompt` | Debugging | Non-standard (`specific_expertise`) | ⚠️ Non-standard |
| `aws_cloud_architect_prompt` | Cloud | Full (anchor) | ✅ Mature |
| `javascript_developer_prompt` | Language | Full (anchor) | ✅ Mature |
| `typescript_developer_prompt` | Language | Full (anchor) | ✅ Mature (v6.6.0) |

**Total Defined Prompts**: 29 keys
**Behavioral Anchors**: 2 (`behavioral_actionable`, `behavioral_structured`)
**Language Tables**: 3 tables × 9 languages = 27 entries

### 1.2 Behavioral Anchor Usage

| Anchor | Purpose | Person

---

## ai_helpers_roadmap

# Roadmap: `config/ai_helpers.yaml` — Persona & Prompt Set Progression

**Source File**: `config/ai_helpers.yaml`  
**Current Version**: v6.6.0 (19 core personas, 6 supplemental specialists)  
**Document Date**: 2026-03-05  
**Repository**: `mpbarbosa/ai_workflow_core`

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Gap Analysis](#2-gap-analysis)
3. [Phase 1 — Refinement (v6.7.x)](#3-phase-1--refinement-v67x)
4. [Phase 2 — Expansion (v7.x.x)](#4-phase-2--expansion-v7xx)
5. [Phase 3 — Architecture Evolution (v8.x.x)](#5-phase-3--architecture-evolution-v8xx)
6. [Persona Inventory & Coverage Map](#6-persona-inventory--coverage-map)
7. [Language Coverage Matrix](#7-language-coverage-matrix)
8. [Token Efficiency Targets](#8-token-efficiency-targets)
9. [Prioritized Backlog](#9-prioritized-backlog)

---

## 1. Current State Assessment

### 1.1 Persona Inventory (v6.6.0)

**Core Personas (19 counted in header)**:

| Key | Group | Pattern | Status |
|-----|-------|---------|--------|
| `doc_analysis_prompt` | Documentation | Full (anchor) | ✅ Mature |
| `consistency_prompt` | Documentation | Full (anchor) | ✅ Mature |
| `technical_writer_prompt` | Documentation | Full (anchor + necessity gate) | ✅ Mature |
| `front_end_developer_prompt` | Front-End | Full (anchor) | ✅ Mature |
| `e2e_test_engineer_prompt` | Testing | Full (anchor) | ✅ Mature |
| `ui_ux_designer_prompt` | Design | Full (anchor) | ✅ Mature |
| `requirements_engineer_prompt` | Architecture | Full (anchor + necessity gate) | ✅ Mature |
| `test_strategy_prompt` | Testing | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `single_file_test_prompt` | Testing | Legacy `role` only — no anchor | ⚠️ Needs modernization |
| `quality_prompt` | Quality | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `issue_extraction_prompt` | DevOps | Full (anchor) + legacy `role` field | ⚠️ Thin, has legacy field |
| `step2_consistency_prompt` | Documentation | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step3_script_refs_prompt` | DevOps | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step4_directory_prompt` | Architecture | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step5_test_review_prompt` | Testing | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step7_test_exec_prompt` | Testing | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step8_dependencies_prompt` | DevOps | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step9_code_quality_prompt` | Quality | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `step11_git_commit_prompt` | DevOps | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |

**Supplemental Specialists (not in 19-count)**:

| Key | Group | Pattern | Status |
|-----|-------|---------|--------|
| `markdown_lint_prompt` | Documentation | Full (anchor) + legacy `role` field | ⚠️ Has legacy field |
| `configuration_specialist_prompt` | DevOps | Full (anchor) | ✅ Mature |
| `step13_prompt_engineer_prompt` | Meta | Full (anchor) | ✅ Mature |
| `version_manager_prompt` | DevOps | Thin — no `task_template` field | ⚠️ Thin |
| `observer_pattern_debugger_prompt` | Debugging | Non-standard (`specific_expertise`) | ⚠️ Non-standard |
| `async_flow_debugger_prompt` | Debugging | Non-standard (`specific_expertise`) | ⚠️ Non-standard |
| `data_structure_debugger_prompt` | Debugging | Non-standard (`specific_expertise`) | ⚠️ Non-standard |
| `aws_cloud_architect_prompt` | Cloud | Full (anchor) | ✅ Mature |
| `javascript_developer_prompt` | Language | Full (anchor) | ✅ Mature |
| `typescript_developer_prompt` | Language | Full (anchor) | ✅ Mature (v6.6.0) |

**Total Defined Prompts**: 29 keys  
**Behavioral Anchors**: 2 (`behavioral_actionable`, `behavioral_structured`)  
**Language Tables**: 3 tables × 9 languages = 27 entries

### 1.2 Behavioral Anchor Usage

| Anchor | Purpose | Persona Count |
|-------