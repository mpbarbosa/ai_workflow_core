# Architecture Overview

**Version**: 1.0.1  
**Last Updated**: 2026-02-09  
**Status**: Stable

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [System Architecture](#system-architecture)
- [Component Overview](#component-overview)
- [Data Flow](#data-flow)
- [Integration Architecture](#integration-architecture)
- [Design Philosophy](#design-philosophy)
- [Technology Stack](#technology-stack)
- [Deployment Model](#deployment-model)

---

## Executive Summary

**ai_workflow_core** is a configuration and template library that provides the foundational building blocks for AI-powered workflow automation across any programming language. It is designed as a **Git submodule** that projects integrate to standardize their configuration, directory structure, and automation workflows.

### Key Characteristics

- **Type**: Configuration & Template Library (not an execution engine)
- **Integration**: Git submodule
- **Language Support**: Language-agnostic (YAML-based configuration)
- **Primary Artifacts**: Templates, schemas, examples, documentation
- **Target Users**: Project maintainers integrating workflow automation

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ai_workflow_core Repository                   │
│                    (Git Submodule Source)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐   ┌──────────────────┐                   │
│  │  Configuration   │   │  Documentation   │                   │
│  │    Templates     │   │    & Guides      │                   │
│  │                  │   │                  │                   │
│  │  • .yaml.template│   │  • Integration   │                   │
│  │  • Schemas       │   │  • API Reference │                   │
│  │  • Validation    │   │  • Examples      │                   │
│  └──────────────────┘   └──────────────────┘                   │
│                                                                  │
│  ┌──────────────────┐   ┌──────────────────┐                   │
│  │ Workflow         │   │  Utility         │                   │
│  │ Templates        │   │  Scripts         │                   │
│  │                  │   │                  │                   │
│  │  • GitHub Actions│   │  • Validators    │                   │
│  │  • CI/CD         │   │  • Cleanup       │                   │
│  │  • Quality Gates │   │  • Health Checks │                   │
│  └──────────────────┘   └──────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Git submodule integration
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Consumer Project                            │
│                      (Any Language)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  .workflow_core/  ──┐                                           │
│  (submodule)        │                                           │
│                     │ copy templates                            │
│                     │ replace placeholders                      │
│                     ▼                                           │
│  .workflow-config.yaml  ──┐                                     │
│  (customized config)      │                                     │
│                           │ drives workflow execution           │
│                           ▼                                     │
│  .ai_workflow/  ─────────────────────────────────              │
│  (workflow artifacts)                                           │
│   ├── logs/                                                     │
│   ├── summaries/                                                │
│   ├── metrics/                                                  │
│   └── checkpoints/                                              │
│                                                                  │
│  Project Source Code                                            │
│  (bash, JavaScript, Python, etc.)                               │
└─────────────────────────────────────────────────────────────────┘
```

### Component Layers

1. **Template Layer**: Configuration templates with placeholder substitution
2. **Schema Layer**: Validation rules and project kind definitions
3. **Documentation Layer**: Integration guides, API references, examples
4. **Automation Layer**: GitHub Actions workflows and utility scripts
5. **Artifact Layer**: Standard directory structure for workflow outputs

---

## Component Overview

### 1. Configuration System (`config/`)

**Purpose**: Provide reusable configuration templates and schemas

**Components**:
- `.workflow-config.yaml.template` - Main configuration template (10KB)
- `project_kinds.yaml` - 8 project type definitions with validation rules (28KB)
- `ai_helpers.yaml` - AI persona definitions and prompts (120KB, 2000+ lines)
- `ai_prompts_project_kinds.yaml` - Project-specific AI prompts (45KB)
- `model_selection_rules.yaml` - AI model selection logic (6.5KB)

**Key Features**:
- Placeholder-based customization (`{{PLACEHOLDER}}` syntax)
- Schema validation for configuration correctness
- Language-agnostic configuration format
- Version compatibility tracking

### 2. Documentation System (`docs/`)

**Purpose**: Comprehensive guides for integration and usage

**Structure**:
```
docs/
├── Core Documents (root level)
│   ├── ARCHITECTURE.md        # System architecture
│   ├── INTEGRATION.md         # Integration guide
│   ├── CONTRIBUTING.md        # Contribution guidelines
│   ├── AI_WORKFLOW_DIRECTORY.md  # Artifact directory structure
│   └── TESTING.md             # Testing approach
├── api/                       # API references (8 files, 6861 lines)
├── guides/                    # User guides (13 files)
├── developers/                # Developer documentation
├── architecture/              # Detailed architecture docs
├── reference/                 # Quick reference materials
├── testing/                   # Testing documentation
├── advanced/                  # Advanced topics
└── diagrams/                  # Visual documentation
```

### 3. Workflow Templates (`workflow-templates/`)

**Purpose**: GitHub Actions workflows for CI/CD

**Templates**:
- `code-quality.yml` - Linting and code quality checks
- `validate-docs.yml` - Documentation validation
- `validate-tests.yml` - Test execution and coverage
- `validate-structure.yml` - Directory structure validation
- `integration-health.yml` - Integration health checks

**Features**:
- Language-agnostic workflow definitions
- Customizable for project-specific needs
- Best practices for CI/CD automation

### 4. Integration Examples (`examples/`)

**Purpose**: Reference implementations for different languages

**Examples**:
- `shell/` - Shell script integration (comprehensive, 645+ lines)
- `nodejs/` - Node.js integration (compact, 320+ lines)

**Each Example Includes**:
- Complete project structure
- Customized `.workflow-config.yaml`
- Comprehensive README with setup instructions
- Working code samples
- Troubleshooting guide

### 5. Utility Scripts (`scripts/`)

**Purpose**: Reusable automation scripts

**Scripts**:
- `validate_context_blocks.py` - Documentation validator
- `validate_structure.py` - Directory structure validator
- `cleanup_artifacts.sh.template` - Artifact cleanup template
- `check_integration_health.sh.template` - Health check template

### 6. Artifact System (`.ai_workflow/`)

**Purpose**: Standard structure for workflow execution artifacts

**Directory Structure**:
```
.ai_workflow/
├── backlog/              # Execution reports and development artifacts
├── summaries/            # AI-generated summaries
├── logs/                 # Execution logs
├── metrics/              # Performance metrics
├── checkpoints/          # Resume points for long workflows
├── prompts/              # AI prompt logs (optional commit)
├── ml_models/            # ML models (optional commit)
└── .incremental_cache/   # Incremental processing cache
```

---

## Data Flow

### Template Integration Flow

```
1. ADD SUBMODULE
   Project maintainer adds ai_workflow_core as Git submodule
   
   $ git submodule add \
     https://github.com/mpbarbosa/ai_workflow_core.git \
     .workflow_core

2. COPY TEMPLATE
   Copy configuration template to project root
   
   $ cp .workflow_core/config/.workflow-config.yaml.template \
        .workflow-config.yaml

3. REPLACE PLACEHOLDERS
   Edit configuration with project-specific values
   
   {{PROJECT_NAME}}       → "My Application"
   {{PROJECT_KIND}}       → "nodejs_api"
   {{TEST_COMMAND}}       → "npm test"
   {{LINT_COMMAND}}       → "eslint ."

4. CREATE ARTIFACT DIRECTORY
   Set up standard workflow artifact structure
   
   $ mkdir -p .ai_workflow/{backlog,summaries,logs,metrics}

5. CUSTOMIZE WORKFLOWS
   Copy and adapt GitHub Actions workflows
   
   $ cp .workflow_core/workflow-templates/workflows/*.yml \
        .github/workflows/

6. USE IN PROJECT
   Configuration drives workflow execution and CI/CD
```

### Configuration Processing Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Template File                                             │
│    (.workflow-config.yaml.template)                          │
│                                                              │
│    project:                                                  │
│      name: "{{PROJECT_NAME}}"                               │
│      kind: "{{PROJECT_KIND}}"                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ copy & customize
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Project Configuration                                     │
│    (.workflow-config.yaml)                                   │
│                                                              │
│    project:                                                  │
│      name: "My API"                                         │
│      kind: "nodejs_api"                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ validate against schema
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Schema Validation                                         │
│    (project_kinds.yaml)                                      │
│                                                              │
│    nodejs_api:                                              │
│      validation:                                            │
│        required_files: [package.json]                       │
│        test_framework: [jest, mocha, vitest]                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ if valid
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Workflow Execution                                        │
│    (Driven by configuration)                                 │
│                                                              │
│    - Run tests: npm test                                    │
│    - Run linter: eslint .                                   │
│    - Generate documentation                                 │
│    - Produce artifacts in .ai_workflow/                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration Architecture

### Submodule Integration Pattern

**Benefits**:
- ✅ **Version Control**: Pin to specific versions
- ✅ **Updates**: Pull latest improvements with `git submodule update`
- ✅ **Isolation**: No code duplication
- ✅ **Consistency**: Shared standards across projects

**Integration Steps**:
1. Add as submodule to `.workflow_core/` directory
2. Copy templates to project root
3. Customize configuration
4. Create artifact directory structure
5. Add `.ai_workflow/` to `.gitignore` (artifacts are ephemeral)

### Multi-Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               ai_workflow_core (GitHub)                      │
│               v1.0.1 (stable release)                        │
└────────┬────────────────────────────────────────────┬───────┘
         │                                             │
         │ git submodule                              │ git submodule
         ▼                                             ▼
┌─────────────────────┐                    ┌─────────────────────┐
│  Project A          │                    │  Project B          │
│  (Shell Script)     │                    │  (Node.js API)      │
│                     │                    │                     │
│  .workflow_core/    │                    │  .workflow_core/    │
│  .workflow-config   │                    │  .workflow-config   │
│   └─ kind:          │                    │   └─ kind:          │
│      shell_script   │                    │      nodejs_api     │
└─────────────────────┘                    └─────────────────────┘

Common benefits:
- Same configuration structure
- Consistent validation rules
- Shared documentation patterns
- Unified CI/CD workflows
```

---

## Design Philosophy

### 1. Separation of Concerns

- **ai_workflow_core**: Templates, schemas, documentation (this repo)
- **ai_workflow**: Execution engine, orchestration (parent project)
- **Consumer Projects**: Application-specific code and configuration

### 2. Language-Agnostic Design

No language-specific code in core library:
- Configuration uses YAML (universal format)
- Schemas define language-specific settings
- Examples demonstrate language-specific integration

### 3. Configuration as Code

- All settings in version-controlled YAML files
- Schema validation ensures correctness
- Explicit over implicit configuration

### 4. Template-First Approach

- Start with working templates
- Customize through placeholder substitution
- Minimal manual configuration required

### 5. Dogfooding

This repository uses its own templates:
- `.workflow-config.yaml` validates against `project_kinds.yaml`
- Project kind: `configuration_library`
- Tests validate template correctness

---

## Technology Stack

### Core Technologies

- **Configuration Format**: YAML
- **Version Control**: Git (submodule pattern)
- **CI/CD**: GitHub Actions
- **Documentation**: Markdown
- **Validation**: Python scripts

### Language Support (via Configuration)

- Shell/Bash
- JavaScript/Node.js
- TypeScript
- Python
- Generic (extensible to any language)

### Tools & Standards

- **Linters**: yamllint, shellcheck, eslint, pylint (language-specific)
- **Testing**: Validation scripts, schema validation
- **Documentation**: Markdown with consistent conventions
- **Versioning**: Semantic Versioning (SemVer)

---

## Deployment Model

### Distribution

**Method**: Git submodule  
**Repository**: https://github.com/mpbarbosa/ai_workflow_core  
**Versioning**: Git tags (v1.0.1, v1.1.0, etc.)

### Integration Workflow

```bash
# Add to project
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core

# Initialize and update
git submodule update --init --recursive

# Update to latest version
cd .workflow_core
git pull origin main
cd ..
git add .workflow_core
git commit -m "chore: update ai_workflow_core to v1.1.0"
```

### Update Strategy

- **Pin to specific versions**: Stability for production
- **Update periodically**: Pull new features and fixes
- **Test before committing**: Validate in your project first
- **Review CHANGELOG**: Understand breaking changes

---

## Related Documentation

- [Template System Architecture](TEMPLATE_SYSTEM.md) - Detailed template processing
- [Integration Patterns](INTEGRATION_PATTERNS.md) - How projects integrate
- [Architecture Decision Records](ADR.md) - Design decisions and rationale
- [API Reference](../api/README.md) - Complete API documentation
- [Integration Guide](../INTEGRATION.md) - Step-by-step integration

---

**Last Updated**: 2026-02-09  
**Document Version**: 1.0.1  
**Related Version**: ai_workflow_core v1.0.1
