# Template System Architecture

**Version**: 1.0.2  
**Last Updated**: 2026-02-09  
**Status**: Stable

---

## Table of Contents

- [Overview](#overview)
- [Template Design](#template-design)
- [Placeholder System](#placeholder-system)
- [Processing Pipeline](#processing-pipeline)
- [Schema Validation](#schema-validation)
- [Project Kinds System](#project-kinds-system)
- [Template Categories](#template-categories)
- [Best Practices](#best-practices)

---

## Overview

The template system is the core mechanism that makes ai_workflow_core language-agnostic and reusable. It allows a single set of configuration templates to be customized for any project through **placeholder substitution**.

### Key Concepts

1. **Templates**: Files with `.template` extension containing placeholders
2. **Placeholders**: `{{VARIABLE_NAME}}` markers to be replaced
3. **Schemas**: Validation rules in `project_kinds.yaml`
4. **Customization**: Projects copy templates and replace placeholders
5. **Validation**: Schemas ensure configuration correctness

---

## Template Design

### Template File Structure

**Naming Convention**:
- Source: `filename.ext.template` (in ai_workflow_core)
- Target: `filename.ext` (in consumer project)

**Example**:
```
Source:  config/.workflow-config.yaml.template
Target:  .workflow-config.yaml (in project root)
```

### Template Anatomy

```yaml
# Template file: .workflow-config.yaml.template
# Lines with placeholders are customized by users

project:
  name: "{{PROJECT_NAME}}"              # User replaces
  type: "{{PROJECT_TYPE}}"              # User replaces
  description: "{{PROJECT_DESCRIPTION}}" # User replaces
  kind: "{{PROJECT_KIND}}"              # User replaces (validated against schema)
  version: "{{VERSION}}"                # User replaces

tech_stack:
  primary_language: "{{LANGUAGE}}"      # User replaces
  build_system: "{{BUILD_SYSTEM}}"      # User replaces (validated)
  test_framework: "{{TEST_FRAMEWORK}}"  # User replaces (validated)
  test_command: "{{TEST_COMMAND}}"      # User replaces
  lint_command: "{{LINT_COMMAND}}"      # User replaces

structure:
  source_dirs:                          # User can modify list
    - src
  test_dirs:
    - tests
  docs_dirs:
    - docs

workflow:
  smart_execution: true                 # Pre-configured defaults
  parallel_execution: true              # User can modify
  ai_cache_enabled: true
  # ... more configuration
```

### After Customization

```yaml
# Customized file: .workflow-config.yaml
# Placeholders replaced with actual values

project:
  name: "My REST API"
  type: "nodejs-application"
  description: "RESTful API for user management"
  kind: "nodejs_api"
  version: "1.0.2"

tech_stack:
  primary_language: "javascript"
  build_system: "npm"
  test_framework: "jest"
  test_command: "npm test"
  lint_command: "eslint ."

structure:
  source_dirs:
    - src
    - lib
  test_dirs:
    - tests
    - __tests__
  docs_dirs:
    - docs
    - api-docs

workflow:
  smart_execution: true
  parallel_execution: true
  ai_cache_enabled: true
```

---

## Placeholder System

### Placeholder Syntax

**Format**: `{{PLACEHOLDER_NAME}}`

**Rules**:
- All uppercase with underscores
- Wrapped in double curly braces
- No spaces inside braces
- Descriptive names

### Core Placeholders

| Placeholder | Type | Example Value | Validation |
|------------|------|---------------|------------|
| `{{PROJECT_NAME}}` | String | "My Application" | Human-readable |
| `{{PROJECT_TYPE}}` | String | "nodejs-application" | Hyphenated format |
| `{{PROJECT_KIND}}` | Enum | "nodejs_api" | Must exist in project_kinds.yaml |
| `{{PROJECT_DESCRIPTION}}` | String | "API for..." | Brief description |
| `{{VERSION}}` | SemVer | "1.0.2" | No 'v' prefix |
| `{{LANGUAGE}}` | String | "javascript" | Lowercase |
| `{{BUILD_SYSTEM}}` | String | "npm" | Must be valid for project kind |
| `{{TEST_FRAMEWORK}}` | String | "jest" | Must be valid for project kind |
| `{{TEST_COMMAND}}` | String | "npm test" | Executable command |
| `{{LINT_COMMAND}}` | String | "eslint ." | Executable command |

### Terminology Standards

**PROJECT_TYPE vs PROJECT_KIND**:
- `PROJECT_TYPE`: Hyphenated, human-readable (`"nodejs-application"`)
- `PROJECT_KIND`: Underscored, schema key (`"nodejs_api"`)

**Example**:
```yaml
project:
  type: "nodejs-application"   # Hyphenated (human-readable)
  kind: "nodejs_api"           # Underscored (schema key)
```

### Placeholder Categories

**1. Project Metadata**:
- `{{PROJECT_NAME}}` - Display name
- `{{PROJECT_TYPE}}` - Human-readable type
- `{{PROJECT_DESCRIPTION}}` - Brief description
- `{{VERSION}}` - Semantic version

**2. Technical Configuration**:
- `{{PROJECT_KIND}}` - Schema validation key
- `{{LANGUAGE}}` - Primary programming language
- `{{BUILD_SYSTEM}}` - Build tool (npm, maven, etc.)

**3. Testing & Quality**:
- `{{TEST_FRAMEWORK}}` - Testing library
- `{{TEST_COMMAND}}` - Command to run tests
- `{{LINT_COMMAND}}` - Command to run linter

**4. Paths & Directories**:
- `{{PROJECT_ROOT}}` - Project root directory
- `{{ARTIFACT_DIR}}` - `.ai_workflow/` directory
- `{{CONFIG_FILE}}` - `.workflow-config.yaml`

---

## Processing Pipeline

### Template Integration Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Add Submodule                                            │
├─────────────────────────────────────────────────────────────────┤
│ $ git submodule add \                                            │
│     https://github.com/mpbarbosa/ai_workflow_core.git \          │
│     .workflow_core                                               │
│                                                                   │
│ Result: .workflow_core/ directory with all templates             │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Copy Template                                            │
├─────────────────────────────────────────────────────────────────┤
│ $ cp .workflow_core/config/.workflow-config.yaml.template \      │
│      .workflow-config.yaml                                       │
│                                                                   │
│ Result: Template copied to project root with placeholders        │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Replace Placeholders                                     │
├─────────────────────────────────────────────────────────────────┤
│ Manual editing or script-based replacement:                      │
│                                                                   │
│ {{PROJECT_NAME}}       → "My Application"                        │
│ {{PROJECT_KIND}}       → "nodejs_api"                            │
│ {{TEST_COMMAND}}       → "npm test"                              │
│ {{LINT_COMMAND}}       → "eslint ."                              │
│                                                                   │
│ Result: Customized configuration file                            │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Schema Validation                                        │
├─────────────────────────────────────────────────────────────────┤
│ Configuration validated against project_kinds.yaml schema:       │
│                                                                   │
│ ✓ project.kind exists in schema                                 │
│ ✓ test_framework valid for project kind                         │
│ ✓ required files present (package.json for nodejs_api)          │
│ ✓ directory structure matches expectations                       │
│                                                                   │
│ Result: Validated configuration ready for use                    │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Workflow Execution                                       │
├─────────────────────────────────────────────────────────────────┤
│ Configuration drives workflow behavior:                          │
│                                                                   │
│ • Run test_command                                               │
│ • Run lint_command                                               │
│ • Generate documentation                                         │
│ • Create artifacts in .ai_workflow/                              │
│                                                                   │
│ Result: Automated workflows configured for project              │
└─────────────────────────────────────────────────────────────────┘
```

### Automated Substitution (Optional)

Projects can automate placeholder substitution:

```bash
#!/bin/bash
# scripts/customize_config.sh

CONFIG_TEMPLATE=".workflow_core/config/.workflow-config.yaml.template"
CONFIG_OUTPUT=".workflow-config.yaml"

# Read values from environment or prompt user
read -p "Project Name: " PROJECT_NAME
read -p "Project Kind (nodejs_api, shell_script_automation, etc.): " PROJECT_KIND
read -p "Test Command: " TEST_COMMAND

# Replace placeholders
sed -e "s|{{PROJECT_NAME}}|$PROJECT_NAME|g" \
    -e "s|{{PROJECT_KIND}}|$PROJECT_KIND|g" \
    -e "s|{{TEST_COMMAND}}|$TEST_COMMAND|g" \
    "$CONFIG_TEMPLATE" > "$CONFIG_OUTPUT"

echo "Configuration created: $CONFIG_OUTPUT"
```

---

## Schema Validation

### Project Kinds Schema

Schema defined in `config/project_kinds.yaml`:

```yaml
project_kinds:
  nodejs_api:
    description: "Node.js backend APIs and services"
    
    validation:
      required_files:
        - package.json
        - README.md
      required_directories:
        - src
        - tests
      file_patterns:
        source:
          - "src/**/*.js"
          - "src/**/*.ts"
        tests:
          - "tests/**/*.test.js"
          - "__tests__/**/*.js"
    
    testing:
      frameworks: [jest, mocha, vitest, ava]
      coverage_threshold: 80
      test_patterns:
        - "*.test.js"
        - "*.spec.js"
    
    quality:
      linters:
        - eslint
        - prettier
      required_docs:
        - README.md
        - API.md
```

### Validation Process

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Load Configuration                                            │
│    Parse .workflow-config.yaml                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Identify Project Kind                                         │
│    Read project.kind field → "nodejs_api"                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Load Schema                                                   │
│    Load project_kinds.nodejs_api from project_kinds.yaml         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Validate Required Files                                       │
│    ✓ package.json exists                                         │
│    ✓ README.md exists                                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Validate Required Directories                                 │
│    ✓ src/ directory exists                                       │
│    ✓ tests/ directory exists                                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Validate Test Framework                                       │
│    test_framework: "jest"                                        │
│    ✓ "jest" in allowed frameworks [jest, mocha, vitest, ava]    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Validation Result                                             │
│    ✅ Configuration is valid                                     │
│    OR                                                            │
│    ❌ Validation errors with detailed messages                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Kinds System

### Supported Project Kinds (8 Total)

1. **shell_script_automation**: Bash/shell script projects
2. **nodejs_api**: Node.js backend APIs
3. **client_spa**: Vanilla JS SPAs with Bootstrap
4. **react_spa**: React single-page applications
5. **static_website**: HTML/CSS/JavaScript static sites
6. **python_app**: Python applications
7. **configuration_library**: Template/config repositories (meta-type)
8. **generic**: Fallback for other project types

### Project Kind Structure

Each project kind defines:

```yaml
project_kinds:
  example_kind:
    description: "Human-readable description"
    
    validation:
      required_files: []      # Must exist files
      required_directories: [] # Must exist directories
      file_patterns: {}       # Expected file patterns
    
    testing:
      frameworks: []          # Allowed test frameworks
      coverage_threshold: 0   # Min coverage percentage
      test_patterns: []       # Test file patterns
    
    quality:
      linters: []            # Recommended linters
      required_docs: []       # Required documentation
    
    dependencies:
      package_files: []       # Package management files
      security_audit_cmd: ""  # Security audit command
    
    build:
      required: false         # Is build step required?
      build_command: ""       # Build command
      output_dirs: []         # Build output directories
    
    deployment:
      type: ""               # Deployment type
      artifact_patterns: []   # Deployment artifacts
    
    ai_guidance:
      testing_standards: ""   # Testing best practices
      style_guide: ""        # Code style guide
      best_practices: []     # Recommended practices
      directory_standards: "" # Directory structure guide
```

### Example: nodejs_api Project Kind

```yaml
nodejs_api:
  description: "Node.js backend APIs and services"
  
  validation:
    required_files:
      - package.json
      - README.md
    required_directories:
      - src
      - tests
    file_patterns:
      source:
        - "src/**/*.js"
        - "src/**/*.ts"
      tests:
        - "tests/**/*.test.js"
        - "__tests__/**/*.js"
  
  testing:
    frameworks: [jest, mocha, vitest, ava]
    coverage_threshold: 80
    test_patterns:
      - "*.test.js"
      - "*.spec.js"
      - "*.test.ts"
  
  quality:
    linters:
      - eslint
      - prettier
    required_docs:
      - README.md
      - API.md
      - CONTRIBUTING.md
  
  dependencies:
    package_files:
      - package.json
      - package-lock.json
    security_audit_cmd: "npm audit"
  
  build:
    required: false
    build_command: ""
    output_dirs: []
  
  deployment:
    type: "containerized"
    artifact_patterns:
      - "dist/**/*"
      - "node_modules/**/*"
  
  ai_guidance:
    testing_standards: "Jest with >80% coverage"
    style_guide: "Airbnb JavaScript Style Guide"
    best_practices:
      - "Use async/await over callbacks"
      - "Implement proper error handling"
      - "Use environment variables for config"
    directory_standards: "src/ for source, tests/ for tests"
```

---

## Template Categories

### 1. Configuration Templates

**Files**:
- `.workflow-config.yaml.template` (Main configuration)

**Purpose**: Define project configuration with placeholders

**Usage**:
```bash
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
# Edit .workflow-config.yaml and replace placeholders
```

### 2. Script Templates

**Files**:
- `cleanup_artifacts.sh.template`
- `check_integration_health.sh.template`

**Purpose**: Reusable utility scripts

**Usage**:
```bash
cp .workflow_core/scripts/cleanup_artifacts.sh.template scripts/cleanup_artifacts.sh
chmod +x scripts/cleanup_artifacts.sh
# Replace {{PROJECT_ROOT}}, {{ARTIFACT_DIR}} placeholders
```

### 3. Workflow Templates

**Files**:
- `workflow-templates/workflows/*.yml`

**Purpose**: GitHub Actions workflows

**Usage**:
```bash
mkdir -p .github/workflows
cp .workflow_core/workflow-templates/workflows/code-quality.yml .github/workflows/
# Customize for project-specific needs
```

### 4. Schema Templates (Non-Template Files)

**Files**:
- `project_kinds.yaml`
- `ai_helpers.yaml`
- `ai_prompts_project_kinds.yaml`
- `model_selection_rules.yaml`

**Purpose**: Define validation rules and AI configurations

**Usage**: Referenced directly from submodule, not copied

---

## Best Practices

### Template Authoring

**DO**:
- ✅ Use clear, descriptive placeholder names
- ✅ Document all placeholders in comments
- ✅ Provide example values in comments
- ✅ Group related configuration sections
- ✅ Include validation-friendly defaults

**DON'T**:
- ❌ Use ambiguous placeholder names
- ❌ Leave placeholders undocumented
- ❌ Mix placeholder formats
- ❌ Hardcode project-specific values in templates

### Placeholder Naming

**Good**:
```yaml
project_name: "{{PROJECT_NAME}}"           # Clear and specific
test_command: "{{TEST_COMMAND}}"           # Action-oriented
lint_command: "{{LINT_COMMAND}}"           # Descriptive
```

**Bad**:
```yaml
project_name: "{{NAME}}"                   # Too generic
test_command: "{{CMD}}"                    # Ambiguous
lint_command: "{{LINTER_ARGS}}"            # Confusing scope
```

### Template Documentation

Always include header documentation:

```yaml
# ============================================================================
# AI Workflow Automation Configuration Template
# ============================================================================
# 
# INSTRUCTIONS:
#   1. Copy this file to your project root as .workflow-config.yaml
#   2. Replace all {{PLACEHOLDER}} values with your project-specific values
#   3. Validate against your project kind schema
#   4. Commit to version control
# 
# PLACEHOLDERS:
#   {{PROJECT_NAME}}   - Human-readable project name
#   {{PROJECT_KIND}}   - Project type from project_kinds.yaml
#   {{TEST_COMMAND}}   - Command to execute tests
#   {{LINT_COMMAND}}   - Command to run linter
# 
# For detailed documentation, see:
#   - docs/api/CONFIG_REFERENCE.md
#   - docs/api/PLACEHOLDER_REFERENCE.md
#   - docs/INTEGRATION.md
# 
# ============================================================================

project:
  name: "{{PROJECT_NAME}}"
  # ... rest of configuration
```

### Validation Integration

Always validate customized configurations:

```bash
# Run validation script
python .workflow_core/scripts/validate_structure.py

# Check against schema
# (Assumes validation tool that checks against project_kinds.yaml)
```

---

## Related Documentation

- [Placeholder Reference](../api/PLACEHOLDER_REFERENCE.md) - Complete placeholder list
- [Project Kinds Schema](../api/PROJECT_KINDS_SCHEMA.md) - Schema definitions
- [Config Reference](../api/CONFIG_REFERENCE.md) - Configuration fields
- [Integration Guide](../INTEGRATION.md) - Step-by-step integration

---

**Last Updated**: 2026-02-09  
**Document Version**: 1.0.2  
**Related Version**: ai_workflow_core v1.0.2
