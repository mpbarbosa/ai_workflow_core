# AI Workflow Core - Architecture

**Version**: 1.0.2  
**Last Updated**: 2026-01-31  
**Status**: Stable

> **Purpose**: This document provides a high-level architectural overview of ai_workflow_core as a configuration and template library. For AI-specific guidance, see [.github/copilot-instructions.md](../.github/copilot-instructions.md).

---

## Table of Contents

- [System Overview](#system-overview)
- [Core Concepts](#core-concepts)
- [Template System Design](#template-system-design)
- [Git Submodule Integration Pattern](#git-submodule-integration-pattern)
- [Directory Structure](#directory-structure)
- [Placeholder Substitution System](#placeholder-substitution-system)
- [Project Kinds System](#project-kinds-system)
- [Architectural Decision Records](#architectural-decision-records)
- [Design Principles](#design-principles)

---

## System Overview

### What is ai_workflow_core?

**ai_workflow_core** is a **language-agnostic configuration and template library** designed to be integrated into projects as a Git submodule. It provides:

- **Configuration Templates**: YAML templates with placeholder patterns
- **Project Schemas**: Validation rules for 8 different project types
- **Integration Examples**: Reference implementations for shell and Node.js
- **Workflow Templates**: GitHub Actions workflows for CI/CD
- **AI Prompts**: Project-specific prompts for AI assistants
- **Documentation Standards**: Consistent patterns and conventions

### System Context

```
┌─────────────────────────────────────────────────────────────┐
│                    User Project                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  .workflow_core/         (Git submodule)          │     │
│  │  ├── config/             (Templates & schemas)    │     │
│  │  ├── workflow-templates/ (GitHub Actions)         │     │
│  │  ├── examples/           (Reference implementations)│   │
│  │  └── docs/               (Integration guides)      │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌─────────────────────────┐     ┌────────────────────┐    │
│  │ .workflow-config.yaml   │     │ .ai_workflow/      │    │
│  │ (Customized from        │────▶│ (Workflow artifacts)│   │
│  │  template)              │     │                    │    │
│  └─────────────────────────┘     └────────────────────┘    │
│                                                              │
│  Project-specific code, tests, documentation                │
└─────────────────────────────────────────────────────────────┘
```

### Dual Nature

This repository has a **dual nature**:
1. **As a Template Library**: Provides templates for other projects
2. **As a Self-Contained Project**: Uses its own templates (dogfooding)

---

## Core Concepts

### 1. Configuration as Code

All project configuration is defined in YAML files with:
- **Schema validation**: `config/project_kinds.yaml` defines rules
- **Type safety**: Project kinds enforce structure
- **Versioning**: Explicit version tracking for compatibility

### 2. Template-Based Customization

Templates use placeholder substitution:
- **Source**: `.workflow-config.yaml.template`
- **Placeholders**: `{{PROJECT_NAME}}`, `{{TEST_COMMAND}}`, etc.
- **Output**: `.workflow-config.yaml` (project-specific)

### 3. Language-Agnostic Design

No language-specific code in core library:
- Configuration defines language settings
- Templates work across languages
- Examples show language-specific integration

### 4. Git Submodule Integration

Projects consume this library as a submodule:
- **Versioned**: Pin to specific commits
- **Updatable**: Pull latest improvements
- **Isolated**: No code duplication

---

## Template System Design

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Template System Components                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐      ┌───────────────┐              │
│  │  .template   │      │ Placeholder   │              │
│  │    Files     │─────▶│ Substitution  │              │
│  │              │      │    Engine     │              │
│  └──────────────┘      └───────┬───────┘              │
│        │                        │                       │
│        │                        ▼                       │
│        │               ┌───────────────┐               │
│        │               │  Customized   │               │
│        └──────────────▶│     Files     │               │
│                        │ (Project-     │               │
│                        │  specific)    │               │
│                        └───────────────┘               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Template File Types

1. **Configuration Templates** (`.yaml.template`)
   - Purpose: Project configuration
   - Example: `.workflow-config.yaml.template`
   - Placeholders: `{{PROJECT_NAME}}`, `{{PROJECT_KIND}}`

2. **Script Templates** (`.sh.template`, `.py.template`)
   - Purpose: Executable scripts
   - Example: `cleanup_artifacts.sh.template`
   - Placeholders: `{{PROJECT_ROOT}}`, `{{ARTIFACT_DIR}}`

3. **Workflow Templates** (`.yml` in `workflow-templates/`)
   - Purpose: GitHub Actions workflows
   - Example: `code-quality.yml`
   - Customization: Manual editing after copy

### Placeholder Format

```yaml
# Standard format: {{PLACEHOLDER_NAME}}
project:
  name: "{{PROJECT_NAME}}"           # User-visible name
  type: "{{PROJECT_TYPE}}"           # Hyphenated type
  kind: "{{PROJECT_KIND}}"           # Underscored kind
  version: "{{VERSION}}"             # Semantic version
```

**Rules:**

- UPPERCASE with underscores
- Descriptive names
- Self-documenting
- Consistent across templates

---

## Git Submodule Integration Pattern

### Integration Flow

```
Step 1: Add Submodule
┌─────────────────┐
│ Parent Project  │
│   git submodule add <url> .workflow_core
│                 │
└─────────────────┘
         │
         ▼
Step 2: Copy Templates
┌─────────────────┐
│ cp .workflow_core/config/.workflow-config.yaml.template \
│    .workflow-config.yaml
└─────────────────┘
         │
         ▼
Step 3: Customize
┌─────────────────┐
│ Replace placeholders with project-specific values
│ {{PROJECT_NAME}} → "My Project"
└─────────────────┘
         │
         ▼
Step 4: Create Artifacts Directory
┌─────────────────┐
│ mkdir -p .ai_workflow/{logs,metrics,backlog,...}
└─────────────────┘
         │
         ▼
Step 5: Commit
┌─────────────────┐
│ git add .workflow-config.yaml
│ git add .workflow_core  # Submodule reference
│ git commit -m "feat: integrate ai_workflow_core"
└─────────────────┘
```

### Update Strategy

```bash
# Update submodule to latest
cd .workflow_core
git pull origin main
cd ..
git add .workflow_core
git commit -m "chore: update ai_workflow_core submodule"
```

### Advantages

- ✅ **Version Control**: Pin to specific commits
- ✅ **Updates**: Pull improvements without breaking changes
- ✅ **No Duplication**: Single source of truth
- ✅ **Isolation**: Core library changes don't affect projects

---

## Directory Structure

### Core Library Structure

```
ai_workflow_core/
├── .github/                 # GitHub metadata
│   ├── copilot-instructions.md
│   └── DESCRIPTION.md
├── config/                  # Configuration templates & schemas
│   ├── .workflow-config.yaml.template
│   ├── project_kinds.yaml   # Schema definitions (8 project types)
│   ├── ai_helpers.yaml      # AI helper configurations
│   └── ai_prompts_project_kinds.yaml
├── workflow-templates/      # GitHub Actions workflows
│   └── workflows/
│       ├── code-quality.yml
│       ├── validate-docs.yml
│       └── validate-tests.yml
├── examples/                # Reference implementations
│   ├── shell/
│   └── nodejs/
├── docs/                    # Documentation
│   ├── guides/
│   └── misc/
└── scripts/                 # Utility scripts
    └── validate_context_blocks.py
```

### Integrated Project Structure

```
user_project/
├── .workflow_core/          # This repository (submodule)
├── .ai_workflow/            # Workflow artifacts (gitignored)
│   ├── logs/
│   ├── metrics/
│   ├── backlog/
│   └── summaries/
├── .workflow-config.yaml    # Customized configuration
├── src/                     # Project-specific source
├── tests/                   # Project-specific tests
└── docs/                    # Project-specific docs
```

---

## Placeholder Substitution System

### Substitution Patterns

| Placeholder | Format | Example Value | Usage |
|------------|--------|---------------|-------|
| `{{PROJECT_NAME}}` | Human-readable | "My Application" | Display name |
| `{{PROJECT_TYPE}}` | Hyphenated | "nodejs-application" | Technical type |
| `{{PROJECT_KIND}}` | Underscored | "nodejs_api" | Schema reference |
| `{{VERSION}}` | Semver | "1.0.2" | Version number |
| `{{LANGUAGE}}` | Lowercase | "javascript" | Primary language |
| `{{TEST_COMMAND}}` | Command | "npm test" | Test execution |

### Substitution Methods

**Manual (sed/awk):**
```bash
sed -i 's/{{PROJECT_NAME}}/My Project/g' .workflow-config.yaml
```

**Script-based:**
```bash
#!/bin/bash
CONFIG=".workflow-config.yaml"
sed -i "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" "$CONFIG"
sed -i "s/{{PROJECT_TYPE}}/$PROJECT_TYPE/g" "$CONFIG"
```

**Editor-based:**
- Find & Replace in VSCode, vim, etc.
- Interactive replacement

---

## Project Kinds System

### Supported Project Kinds (8 total)

```
project_kinds.yaml
├── shell_script_automation  # Bash/shell automation
├── nodejs_api              # Node.js backend APIs
├── static_website          # HTML/CSS/JS sites
├── client_spa              # Vanilla JS SPAs
├── react_spa               # React applications
├── python_app              # Python applications
├── configuration_library   # Template repositories (meta)
└── generic                 # Fallback type
```

### Schema Structure

Each project kind defines:

```yaml
project_kind_name:
  validation:
    required_files: [...]      # Must exist
    required_directories: [...] # Must exist
    file_patterns: [...]        # Expected patterns
    
  testing:
    test_framework: "..."       # Framework name
    test_command: "..."         # Command to run
    coverage_threshold: N       # Min coverage %
    
  quality:
    linters: [...]             # Linting tools
    documentation_required: bool
    
  ai_guidance:
    testing_standards: [...]   # Best practices
    style_guides: [...]        # Style references
    best_practices: [...]      # Language patterns
```

### Validation Flow

```
User Creates Config
       │
       ▼
Declares PROJECT_KIND
       │
       ▼
project_kinds.yaml
Defines Rules
       │
       ▼
Validation Engine
Checks:
- Required files exist
- Test framework matches
- Linters configured
- Directory structure
       │
       ▼
   Pass/Fail
```

---

## Architectural Decision Records

### ADR-001: Use Git Submodules for Distribution

**Status**: Accepted  
**Date**: 2026-01-29

**Context**: Need a way to distribute templates to multiple projects.

**Options Considered:**
1. NPM package (requires Node.js)
2. Git submodule (language-agnostic)
3. Copy-paste (no updates)

**Decision**: Use Git submodules

**Rationale:**
- Language-agnostic
- Version control built-in
- Easy updates
- No package manager dependency

---

### ADR-002: Separate `.github/` and `workflow-templates/` Directories

**Status**: Accepted  
**Date**: 2026-01-31

**Context**: Prevent confusion between GitHub metadata and workflow templates.

**Decision**: 
- `.github/` in ai_workflow_core = GitHub metadata for THIS repository (DO NOT COPY)
  - Contains: copilot-instructions.md, DESCRIPTION.md
- `workflow-templates/` = Workflow templates for OTHER projects to copy (COPY THESE)
  - Contains: workflows/*.yml files
- Projects copy from `workflow-templates/workflows/` to their own `.github/workflows/`

**Rationale:**
- Clear separation of concerns
- Follows GitHub Actions conventions
- Eliminates accidental copying of ai_workflow_core metadata
- Standard workflow location in consuming projects

---

### ADR-003: Placeholder Format `{{UPPERCASE}}`

**Status**: Accepted  
**Date**: 2026-01-29

**Context**: Need consistent placeholder format.

**Decision**: Use `{{PLACEHOLDER_NAME}}` format

**Rationale:**
- High visibility in templates
- Common convention (Mustache, Jinja2)
- Easy to search/replace
- Self-documenting

---

### ADR-004: Version Schemas Separately from Core

**Status**: Accepted  
**Date**: 2026-01-30

**Context**: Schema changes vs. core library changes.

**Decision**: 
- `project_kinds.yaml` version: 1.2.0
- `ai_prompts_project_kinds.yaml` version: 1.2.0
- Core repository version: 1.0.2

**Rationale:**
- Schemas evolve independently
- Clear compatibility tracking
- Breaking changes isolated

---

### ADR-005: Use Underscores for PROJECT_KIND, Hyphens for PROJECT_TYPE

**Status**: Accepted  
**Date**: 2026-01-30

**Context**: Naming convention for project identifiers.

**Decision**: 
- `PROJECT_TYPE`: hyphenated ("nodejs-application")
- `PROJECT_KIND`: underscored ("nodejs_api")

**Rationale:**
- TYPE = human-readable, URL-safe
- KIND = matches YAML keys, Python-style
- Clear distinction between concepts

---

## Design Principles

### 1. Language-Agnostic First

**Principle**: Core library contains no language-specific code.

**Implementation:**
- Configuration defines language settings
- Templates use placeholders, not hardcoded values
- Examples demonstrate language integration

**Benefit**: Works with any programming language.

---

### 2. Single Source of Truth

**Principle**: One authoritative definition for each concept.

**Implementation:**
- `project_kinds.yaml` defines all project types
- `ai_prompts_project_kinds.yaml` defines all AI prompts
- Documentation references schemas, not duplicates

**Benefit**: Consistency, easier maintenance.

---

### 3. Fail Early, Fail Clearly

**Principle**: Validate early and provide clear error messages.

**Implementation:**
- YAML syntax validation
- Required files/directories checked
- Placeholder documentation

**Benefit**: Better developer experience.

---

### 4. Convention Over Configuration

**Principle**: Provide sensible defaults, allow customization.

**Implementation:**
- Standard directory structure
- Default workflows
- Customizable via configuration

**Benefit**: Fast setup, flexible adaptation.

---

### 5. Documentation as Code

**Principle**: Documentation lives with code, versioned together.

**Implementation:**
- README.md, CONTRIBUTING.md, INTEGRATION.md
- Inline documentation in configs
- Examples as executable documentation

**Benefit**: Always up-to-date, discoverable.

---

## Integration Patterns

### Pattern 1: Basic Integration

```bash
# Add submodule
git submodule add <url> .workflow_core

# Copy and customize
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
# Edit placeholders

# Create artifacts
mkdir -p .ai_workflow/{logs,metrics,backlog,summaries}

# Commit
git add .workflow-config.yaml .workflow_core
git commit -m "feat: integrate ai_workflow_core"
```

### Pattern 2: With GitHub Actions

```bash
# Basic integration +
# Copy workflow templates from ai_workflow_core to your project
mkdir -p .github/workflows
cp -r .workflow_core/workflow-templates/workflows/*.yml .github/workflows/

# Customize workflows for your language and project
# Edit .github/workflows/*.yml

git add .github/
git commit -m "feat: add CI/CD workflows"
```

**⚠️ Note**: Copy from `workflow-templates/workflows/` (the templates), NOT from `.github/` (ai_workflow_core's metadata).

### Pattern 3: Fork and Customize

```bash
# Fork repository on GitHub
git clone <your-fork-url> custom-workflow-core

# Make customizations
# Commit changes

# Use custom fork in projects
git submodule add <your-fork-url> .workflow_core
```

---

## Future Architecture

### Planned Enhancements

1. **Template Validation Tool**
   - Validate placeholder usage
   - Check for missing substitutions
   - Detect invalid patterns

2. **CLI Tool**
   - Interactive setup wizard
   - Automated placeholder replacement
   - Project kind detection

3. **Plugin System**
   - Custom project kinds
   - Extended validation rules
   - Additional templates

---

## References

- **Integration Guide**: [docs/INTEGRATION.md](INTEGRATION.md)
- **Contributing Guide**: [docs/CONTRIBUTING.md](CONTRIBUTING.md)
- **Project Kinds Schema**: [config/project_kinds.yaml](../config/project_kinds.yaml)
- **AI Prompts**: [config/ai_prompts_project_kinds.yaml](../config/ai_prompts_project_kinds.yaml)

---

**Version History:**
- v1.0.2 (2026-01-31): Initial architecture documentation
