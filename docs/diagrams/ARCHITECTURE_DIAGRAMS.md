# Architecture Diagrams

**Visual Guide to ai_workflow_core System Design**

**Version**: 1.0.2
**Last Updated**: 2026-02-12
**Purpose**: Visual documentation of system architecture

---

## Table of Contents

- [System Overview](#system-overview)
- [Integration Pattern](#integration-pattern)
- [Template System Flow](#template-system-flow)
- [Project Kinds Hierarchy](#project-kinds-hierarchy)
- [Configuration Cascade](#configuration-cascade)
- [Validation Pipeline](#validation-pipeline)
- [Directory Structure](#directory-structure)
- [Workflow Execution](#workflow-execution)

---

## System Overview

### Relationship to Parent Project

```
┌────────────────────────────────────────────────────────────────┐
│                     ai_workflow (Parent)                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Workflow   │  │      AI      │  │    Step      │        │
│  │  Execution   │  │ Integration  │  │ Orchestration│        │
│  │    Engine    │  │              │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│         │                  │                  │                │
│         └──────────────────┴──────────────────┘                │
│                            │                                    │
│                    Uses as foundation                           │
└────────────────────────────┼──────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                  ai_workflow_core (This Repo)                   │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Config       │  │   Project    │  │   Template   │        │
│  │ Templates    │  │    Kinds     │  │   Examples   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │    Docs      │  │   Scripts    │  │   Workflows  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────────────────────────────────────────────┘
```

### Core Components

```
ai_workflow_core
│
├─ Configuration Layer
│  ├─ Template Files (.workflow-config.yaml.template)
│  ├─ Project Kinds (project_kinds.yaml)
│  ├─ AI Helpers (ai_helpers.yaml)
│  └─ Model Selection (model_selection_rules.yaml)
│
├─ Validation Layer
│  ├─ Structure Validator (validate_structure.py)
│  ├─ Context Validator (validate_context_blocks.py)
│  └─ Project Kind Validator (embedded in project_kinds.yaml)
│
├─ Documentation Layer
│  ├─ API References (docs/api/)
│  ├─ User Guides (docs/guides/)
│  ├─ Developer Docs (docs/developers/)
│  └─ Examples (examples/)
│
└─ Integration Layer
   ├─ Git Submodule Pattern
   ├─ Placeholder Substitution
   └─ Directory Structure Templates
```

---

## Integration Pattern

### Git Submodule Integration Flow

```
Step 1: Add Submodule
┌─────────────────────┐
│  Parent Project     │
│                     │
│  $ git submodule    │
│    add <url>        │
│    .workflow_core   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  .workflow_core/    │ ◄─── Read-only reference
│  (submodule)        │      to ai_workflow_core
└─────────────────────┘

Step 2: Copy Templates
┌─────────────────────┐
│  $ cp               │
│    .workflow_core/  │
│    config/*.template│
│    ./               │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  .workflow-config   │ ◄─── Editable copy
│  .yaml              │      in project root
└─────────────────────┘

Step 3: Customize
┌─────────────────────┐
│  Replace:           │
│  {{PROJECT_NAME}}   │
│  → "My App"         │
│                     │
│  {{PROJECT_KIND}}   │
│  → "nodejs_api"     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Configured         │
│  Project            │
└─────────────────────┘
```

### File Flow Diagram

```
ai_workflow_core (submodule)
│
├─ config/
│  ├─ .workflow-config.yaml.template ──┐
│  ├─ project_kinds.yaml               │ Copy
│  └─ ai_helpers.yaml                  │
│                                       │
│                                       ▼
└─────────────────────────────────────────────────

Parent Project (editable)
│
├─ .workflow_core/ ◄───────────────── Submodule reference
│
├─ .workflow-config.yaml ◄─────────── Copied & customized
│  ({{PLACEHOLDERS}} → actual values)
│
└─ .ai_workflow/ ◄───────────────────── Created by user
   ├─ backlog/
   ├─ summaries/
   └─ logs/
```

---

## Template System Flow

### Placeholder Substitution Process

```
1. Template File
┌──────────────────────────────────┐
│ project:                         │
│   name: "{{PROJECT_NAME}}"       │
│   type: "{{PROJECT_TYPE}}"       │
│   kind: "{{PROJECT_KIND}}"       │
└──────────────┬───────────────────┘
               │
               │ User copies template
               ▼
2. User's File
┌──────────────────────────────────┐
│ project:                         │
│   name: "{{PROJECT_NAME}}"       │ ◄─ Still has placeholders
│   type: "{{PROJECT_TYPE}}"       │
│   kind: "{{PROJECT_KIND}}"       │
└──────────────┬───────────────────┘
               │
               │ User replaces placeholders
               ▼
3. Configured File
┌──────────────────────────────────┐
│ project:                         │
│   name: "My Application"         │ ◄─ Real values
│   type: "nodejs-application"     │
│   kind: "nodejs_api"             │
└──────────────┬───────────────────┘
               │
               │ Validation checks
               ▼
4. Validated Configuration
┌──────────────────────────────────┐
│ ✓ All placeholders replaced      │
│ ✓ Project kind valid             │
│ ✓ Required fields present        │
│ ✓ Values match expected format   │
└──────────────────────────────────┘
```

---

## Project Kinds Hierarchy

### 8 Project Types with Validation Rules

```
project_kinds.yaml
│
├─ shell_script_automation
│  ├─ Validation: shellcheck, shfmt
│  ├─ Testing: bash_unit/BATS
│  └─ Standards: Google Shell Style Guide
│
├─ nodejs_api
│  ├─ Validation: package.json, src/, tests/
│  ├─ Testing: jest/mocha (80% coverage)
│  └─ Quality: eslint, prettier
│
├─ client_spa
│  ├─ Validation: index.html, CSS, vanilla JS
│  ├─ Testing: jest/playwright
│  └─ Focus: No frameworks (React/Vue/Angular)
│
├─ react_spa
│  ├─ Validation: React-specific structure
│  ├─ Testing: jest + React Testing Library
│  └─ Build: Required (webpack/vite)
│
├─ static_website
│  ├─ Validation: HTML/CSS/JS files
│  ├─ Quality: htmlhint, stylelint
│  └─ Accessibility: WCAG AA required
│
├─ python_app
│  ├─ Validation: requirements.txt, src/, tests/
│  ├─ Testing: pytest/unittest
│  └─ Quality: pylint, black, mypy
│
├─ configuration_library
│  ├─ Validation: Config files, templates
│  ├─ Testing: Validation scripts
│  └─ Pattern: Git submodule deployment
│
└─ generic
   ├─ Validation: Minimal assumptions
   ├─ Testing: Project-defined
   └─ Fallback: For other project types
```

### Project Kind Validation Flow

```
Configuration File
       │
       ▼
┌─────────────────┐
│ Read kind field │
│ kind: "nodejs_api"│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Load validation │
│ rules from      │
│ project_kinds   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check required  │
│ files exist:    │
│ ✓ package.json  │
│ ✓ src/          │
│ ✓ tests/        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Verify test     │
│ framework:      │
│ ✓ jest config   │
│ ✓ test command  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validate        │
│ quality tools:  │
│ ✓ eslint config │
│ ✓ prettier      │
└────────┬────────┘
         │
         ▼
    ✅ Valid
```

---

## Configuration Cascade

### Configuration Priority & Inheritance

```
1. Core Defaults (ai_workflow_core)
   ┌──────────────────────────────┐
   │ config/project_kinds.yaml    │
   │ ├─ Default test frameworks   │
   │ ├─ Default linters           │
   │ └─ Default directory structure│
   └──────────────┬───────────────┘
                  │ Inherits from
                  ▼
2. Project Kind Specific
   ┌──────────────────────────────┐
   │ nodejs_api:                  │
   │ ├─ Test framework: jest      │
   │ ├─ Coverage: 80%             │
   │ └─ Linters: eslint, prettier │
   └──────────────┬───────────────┘
                  │ Overridden by
                  ▼
3. Project Configuration
   ┌──────────────────────────────┐
   │ .workflow-config.yaml        │
   │ ├─ test_command: "npm test"  │
   │ ├─ lint_command: "eslint ."  │
   │ └─ Custom settings           │
   └──────────────┬───────────────┘
                  │ Overridden by
                  ▼
4. Runtime Overrides
   ┌──────────────────────────────┐
   │ Command-line flags           │
   │ ├─ --force-model=opus-4.5    │
   │ ├─ --skip-tests              │
   │ └─ Environment variables     │
   └──────────────────────────────┘
```

---

## Validation Pipeline

### Multi-stage Validation Process

```
Configuration File (.workflow-config.yaml)
              │
              ▼
┌─────────────────────────────┐
│ Stage 1: YAML Syntax        │
│ ├─ Valid YAML structure     │
│ ├─ Proper indentation       │
│ └─ No syntax errors         │
└─────────────┬───────────────┘
              │ ✓ Pass
              ▼
┌─────────────────────────────┐
│ Stage 2: Placeholder Check  │
│ ├─ All {{PLACEHOLDERS}}     │
│ │   replaced?               │
│ └─ No template markers      │
└─────────────┬───────────────┘
              │ ✓ Pass
              ▼
┌─────────────────────────────┐
│ Stage 3: Required Fields    │
│ ├─ project.name present     │
│ ├─ project.kind valid       │
│ └─ tech_stack defined       │
└─────────────┬───────────────┘
              │ ✓ Pass
              ▼
┌─────────────────────────────┐
│ Stage 4: Project Kind Rules │
│ ├─ Load validation rules    │
│ ├─ Check required files     │
│ ├─ Verify directories       │
│ └─ Validate test framework  │
└─────────────┬───────────────┘
              │ ✓ Pass
              ▼
┌─────────────────────────────┐
│ Stage 5: Structure Check    │
│ ├─ Directory structure valid│
│ ├─ No empty directories     │
│ └─ No undocumented dirs     │
└─────────────┬───────────────┘
              │ ✓ Pass
              ▼
┌─────────────────────────────┐
│ Stage 6: Context Blocks     │
│ ├─ AI helpers valid format  │
│ ├─ Standard parameters      │
│ └─ Consistent structure     │
└─────────────┬───────────────┘
              │ ✓ Pass
              ▼
        ✅ Valid Configuration
```

---

## Directory Structure

### Standard Project Layout

```
project-root/
│
├─ .workflow_core/              # Submodule (read-only)
│  ├─ config/                   # Configuration templates
│  ├─ docs/                     # Documentation
│  ├─ examples/                 # Integration examples
│  ├─ scripts/                  # Utility scripts
│  └─ workflow-templates/       # GitHub Actions
│
├─ .ai_workflow/                # Workflow artifacts (gitignored)
│  ├─ backlog/                  # Execution reports
│  │  ├─ workflow_<timestamp>/
│  │  └─ reports/
│  │
│  ├─ summaries/                # AI-generated summaries
│  │  └─ workflow_<timestamp>/
│  │
│  ├─ logs/                     # Execution logs
│  │  ├─ workflow.log
│  │  └─ error.log
│  │
│  ├─ metrics/                  # Performance metrics
│  │  ├─ timing.json
│  │  └─ complexity.json
│  │
│  ├─ checkpoints/              # Resume points
│  │  └─ workflow_<timestamp>.json
│  │
│  ├─ prompts/                  # AI prompt logs
│  │  └─ workflow_<timestamp>/
│  │
│  ├─ ml_models/                # ML models (optional)
│  │  └─ complexity_model.pkl
│  │
│  └─ .incremental_cache/       # Incremental processing
│     └─ file_hashes.json
│
├─ .workflow-config.yaml        # Project configuration (edited)
├─ .gitignore                   # Git ignore (includes .ai_workflow/)
└─ README.md                    # Project documentation
```

---

## Workflow Execution

### High-level Execution Flow (Parent Project)

> **Note**: This diagram shows the parent **ai_workflow** project's execution flow, which uses ai_workflow_core as its foundation.

```
Start Workflow
       │
       ▼
┌─────────────────┐
│ Load Config     │
│ (.workflow-     │
│  config.yaml)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validate Config │
│ (project_kinds) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Analyze Changes │
│ (git diff)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Select AI Model │
│ (complexity-    │
│  based)         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Execute Steps   │
│ 1. Docs         │
│ 2. Consistency  │
│ 3. Scripts      │
│ 4. Structure    │
│ 5. Tests        │
│ ...             │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate        │
│ Artifacts       │
│ (.ai_workflow/) │
└────────┬────────┘
         │
         ▼
   End Workflow
```

---

## Related Documentation

- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Detailed architecture documentation
- **[TEMPLATE_SYSTEM.md](TEMPLATE_SYSTEM.md)** - Template system design
- **[PROJECT_KINDS_SCHEMA.md](../api/PROJECT_KINDS_SCHEMA.md)** - Project kinds reference
- **[INTEGRATION.md](../INTEGRATION.md)** - Integration guide

---

**Document Version**: 1.0.2
**Last Updated**: 2026-02-12
**Maintained By**: ai_workflow_core team
