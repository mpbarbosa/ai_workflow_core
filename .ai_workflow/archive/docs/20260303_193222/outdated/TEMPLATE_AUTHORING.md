# Template Authoring Guide

**Version**: 2.0.0  
**Last Updated**: 2026-02-07  
**Audience**: Developers creating or modifying template files

> **Purpose**: Learn how to create and maintain template files in ai_workflow_core. This guide covers placeholder patterns, YAML best practices, and template conventions.

---

## Table of Contents

- [Overview](#overview)
- [Template Types](#template-types)
- [Placeholder System](#placeholder-system)
- [YAML Templates](#yaml-templates)
- [Script Templates](#script-templates)
- [Workflow Templates](#workflow-templates)
- [Testing Templates](#testing-templates)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Validation](#validation)

---

## Overview

### What is a Template?

Templates in ai_workflow_core are files with **placeholders** that users replace with project-specific values. They serve as the foundation for consistent configuration across projects.

**Template Characteristics**:
- ✅ Use `{{PLACEHOLDER}}` syntax for customizable values
- ✅ Include `.template` extension (for scripts/config files)
- ✅ Provide sensible defaults where possible
- ✅ Document all placeholders in comments or README
- ✅ Validate syntax (YAML, shell, etc.)

### Template Lifecycle

```
1. Create template → 2. Add placeholders → 3. Document → 4. Test → 5. Commit
                                                                      ↓
                      7. User replaces ← 6. User copies ← 5. User discovers
```

---

## Template Types

### 1. Configuration Templates

**Location**: `config/*.yaml.template`  
**Extension**: `.template`  
**Purpose**: Main configuration files users customize

**Example**: `.workflow-config.yaml.template`

```yaml
# Metadata
project:
  name: "{{PROJECT_NAME}}"              # User project name
  type: "{{PROJECT_TYPE}}"              # Project classification (hyphenated)
  description: "{{PROJECT_DESCRIPTION}}" # Brief description
  kind: "{{PROJECT_KIND}}"              # From project_kinds.yaml (underscored)
  version: "{{VERSION}}"                # Semantic version (no 'v' prefix)

# Technology stack
tech_stack:
  primary_language: "{{LANGUAGE}}"      # javascript, python, bash, etc.
  build_system: "{{BUILD_SYSTEM}}"      # npm, maven, none, etc.
  test_framework: "{{TEST_FRAMEWORK}}"  # jest, pytest, bats, etc.
  test_command: "{{TEST_COMMAND}}"      # Command to run tests
  lint_command: "{{LINT_COMMAND}}"      # Command to run linter

# Optional sections with defaults
structure:
  source_dirs:
    - src                                # Default: src/
  test_dirs:
    - tests                              # Default: tests/
  docs_dirs:
    - docs                               # Default: docs/
```

**Key Principles**:
- Use YAML for structured configuration
- Quote all string values
- Provide inline comments explaining each field
- Group related fields into sections
- Use consistent indentation (2 spaces)

### 2. Script Templates

**Location**: `scripts/*.sh.template`, `scripts/*.py.template`  
**Extension**: `.template`  
**Purpose**: Utility scripts users copy and customize

**Example**: `cleanup_artifacts.sh.template`

```bash
#!/bin/bash
# cleanup_artifacts.sh - Clean workflow artifacts
# Version: 2.0.0
# Date: 2026-02-01

set -euo pipefail

# ============================================================================
# Configuration - Replace these placeholders
# ============================================================================

REPO_ROOT="{{REPO_ROOT}}"              # Project root directory
WORKFLOW_DIR="{{WORKFLOW_DIR}}"        # Artifact directory (.ai_workflow)
DEFAULT_AGE="${DEFAULT_AGE:-30}"       # Default age in days

# ============================================================================
# Script Logic (should work without modification)
# ============================================================================

function cleanup_logs() {
  local age=${1:-$DEFAULT_AGE}
  echo "Cleaning logs older than $age days..."
  find "$WORKFLOW_DIR/logs" -type f -mtime +$age -delete 2>/dev/null || true
}

# ... rest of script
```

**Key Principles**:
- Include shebang (`#!/bin/bash`, `#!/usr/bin/env python3`)
- Set strict error handling (`set -euo pipefail`)
- Separate configuration (placeholders) from logic
- Use functions for modularity
- Add version and date comments
- Provide usage documentation in header

### 3. Schema Templates

**Location**: `config/*.yaml` (no .template)  
**Extension**: `.yaml`  
**Purpose**: Define structure and validation rules

**Example**: `project_kinds.yaml` (excerpt)

```yaml
# Project Kinds Schema
# Version: 1.2.0
# Last Updated: 2026-01-30

project_kinds:
  # ============================================================================
  # Shell Script Automation
  # ============================================================================
  shell_script_automation:
    metadata:
      name: "Shell Script Automation"
      description: "Bash/shell script projects with automated testing"
      
    validation:
      required_files:
        - README.md
        - LICENSE
      required_dirs:
        - scripts/
        - tests/
      file_patterns:
        - "*.sh"
        
    testing:
      framework: "bash_unit/BATS"
      commands:
        - "bash tests/run_tests.sh"
      coverage_threshold: 0  # Shell doesn't have standard coverage tools
      
    quality:
      linters:
        - name: "shellcheck"
          command: "shellcheck **/*.sh"
        - name: "shfmt"
          command: "shfmt -d ."
      documentation_required: true
      inline_comments: true
```

**Key Principles**:
- No placeholders (these are schemas, not user templates)
- Comprehensive documentation via comments
- Consistent structure across all definitions
- Version tracking in header
- Use anchors/references for repeated values

### 4. GitHub Workflow Templates

**Location**: `workflow-templates/workflows/*.yml`  
**Extension**: `.yml`  
**Purpose**: CI/CD workflow files

**Example**: `code-quality.yml`

```yaml
name: Code Quality

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Run Linters
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive
          
      # Language-agnostic: Read from config
      - name: Read config
        id: config
        run: |
          # Extract lint command from .workflow-config.yaml
          LINT_CMD=$(grep "lint_command:" .workflow-config.yaml | cut -d'"' -f2)
          echo "lint_command=$LINT_CMD" >> $GITHUB_OUTPUT
          
      - name: Run linter
        run: ${{ steps.config.outputs.lint_command }}
```

**Key Principles**:
- Make workflows language-agnostic where possible
- Read configuration from `.workflow-config.yaml`
- Provide clear job names and descriptions
- Use latest stable action versions
- Include helpful comments

---

## Placeholder System

### Naming Conventions

**Format**: `{{SCREAMING_SNAKE_CASE}}`

**Examples**:
- ✅ `{{PROJECT_NAME}}`
- ✅ `{{TEST_COMMAND}}`
- ✅ `{{WORKFLOW_DIR}}`
- ❌ `{{projectName}}` (camelCase)
- ❌ `{{project-name}}` (kebab-case)
- ❌ `{PROJECT_NAME}` (single braces)

### Standard Placeholders

Always use these standard placeholders for consistency:

| Placeholder | Description | Example Value | Used In |
|------------|-------------|---------------|---------|
| `{{PROJECT_NAME}}` | Human-readable project name | "My Application" | Config, docs |
| `{{PROJECT_TYPE}}` | Project classification (hyphenated) | "nodejs-application" | Config |
| `{{PROJECT_KIND}}` | From project_kinds.yaml (underscored) | "nodejs_api" | Config |
| `{{PROJECT_DESCRIPTION}}` | Brief description | "REST API for users" | Config |
| `{{VERSION}}` | Semantic version (no 'v') | "2.0.0" | Config |
| `{{LANGUAGE}}` | Primary language | "javascript" | Config |
| `{{REPO_ROOT}}` | Repository root path | "/home/user/project" | Scripts |
| `{{WORKFLOW_DIR}}` | Artifact directory | ".ai_workflow" | Scripts |
| `{{TEST_COMMAND}}` | Command to run tests | "npm test" | Config, workflows |
| `{{LINT_COMMAND}}` | Command to run linter | "eslint ." | Config, workflows |
| `{{BUILD_SYSTEM}}` | Build system/package manager | "npm" | Config |
| `{{TEST_FRAMEWORK}}` | Testing framework | "jest" | Config |

### Creating New Placeholders

When adding new placeholders:

1. **Check if standard placeholder exists** - Reuse before creating new
2. **Use descriptive names** - `{{DATABASE_URL}}` not `{{DB}}`
3. **Document in placeholder reference** - Update `docs/api/PLACEHOLDER_REFERENCE.md`
4. **Add to config template** - Include in `.workflow-config.yaml.template`
5. **Provide example values** - Show realistic examples

**Example - Adding new placeholder**:

```yaml
# 1. Add to config template
database:
  url: "{{DATABASE_URL}}"              # Database connection URL
  pool_size: "{{DB_POOL_SIZE}}"        # Connection pool size

# 2. Document in PLACEHOLDER_REFERENCE.md
# | {{DATABASE_URL}} | Database connection string | "postgresql://localhost/mydb" |
# | {{DB_POOL_SIZE}} | Connection pool size | "10" |

# 3. Update README.md examples
```

### Placeholder Documentation

**Always document placeholders with**:
- **Inline comment** next to usage
- **Example value** in comment or README
- **Required vs optional** status
- **Validation rules** (format, constraints)

**Example**:

```yaml
project:
  # Required: Human-readable project name (1-50 characters)
  # Example: "User Management API"
  name: "{{PROJECT_NAME}}"
  
  # Required: Semantic version without 'v' prefix
  # Format: MAJOR.MINOR.PATCH
  # Example: "2.0.0"
  version: "{{VERSION}}"
  
  # Optional: Additional contact email
  # Format: valid email address
  # Example: "admin@example.com"
  contact: "{{CONTACT_EMAIL}}"
```

---

## YAML Templates

### Structure Guidelines

**1. Consistent Indentation**
- Use **2 spaces** (not tabs)
- Maintain consistent depth across sections

**2. Quoting Strategy**
```yaml
# Always quote:
- Strings with special characters: "value: with: colons"
- Numbers as strings: "2.0.0"
- Booleans as strings: "true" (if meant to be string)
- Placeholders: "{{PLACEHOLDER}}"

# Optional quotes (but recommended for consistency):
- Simple strings: "simple-value" or simple-value
- Keys: "key": or key:
```

**3. Section Organization**
```yaml
# 1. Metadata (required)
project:
  name: "{{PROJECT_NAME}}"
  version: "{{VERSION}}"

# 2. Core configuration (required)
tech_stack:
  primary_language: "{{LANGUAGE}}"

# 3. Structure (defaults provided)
structure:
  source_dirs:
    - src

# 4. Optional customization
workflow:
  enabled: true

# 5. Advanced options (commented examples)
# advanced:
#   custom_field: "value"
```

### Comments Best Practices

```yaml
# ============================================================================
# Section Header - Major sections
# ============================================================================

subsection:
  # Field description - What this field does
  # Example: "npm test"
  # Default: "make test"
  field: "{{PLACEHOLDER}}"
  
  # Multi-line explanation
  # Line 2 of explanation
  # Line 3 of explanation
  another_field: "value"
```

### Default Values

Provide sensible defaults:

```yaml
# Approach 1: Default in comment
structure:
  # Default: ["src"]
  source_dirs: "{{SOURCE_DIRS}}"

# Approach 2: Default as actual value
structure:
  source_dirs:
    - src  # Default, can override

# Approach 3: Optional field (commented out)
# optional:
#   custom_field: "value"  # Uncomment to enable
```

### YAML Anchors (Advanced)

Use anchors for repeated values:

```yaml
# Define anchor
common_steps: &common_test_steps
  - install_dependencies
  - run_linter
  - run_tests

# Reference anchor
nodejs:
  steps: *common_test_steps

python:
  steps: *common_test_steps
```

---

## Script Templates

### Header Format

Every script template should start with:

```bash
#!/bin/bash
# <script-name>.sh - <brief description>
# Version: <semantic version>
# Date: <YYYY-MM-DD>
# Part of: ai_workflow_core

# ============================================================================
# Description
# ============================================================================
# Detailed description of what this script does.
# 
# Usage:
#   bash <script-name>.sh [options]
#
# Options:
#   --help          Show this help message
#   --dry-run       Show what would be done without doing it
#   --verbose       Enable verbose output
#
# Examples:
#   bash <script-name>.sh --dry-run
#   bash <script-name>.sh --verbose
#
# Requirements:
#   - Bash 4.0+
#   - Tools: find, grep, etc.
# ============================================================================

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Enable debug mode if DEBUG environment variable is set
[[ "${DEBUG:-}" == "true" ]] && set -x
```

### Configuration Section

Separate configuration from logic:

```bash
# ============================================================================
# Configuration - Users should customize this section
# ============================================================================

# Project root directory
# Default: Current directory
# Override: Set REPO_ROOT environment variable
REPO_ROOT="${REPO_ROOT:-{{REPO_ROOT}}}"

# Workflow artifact directory
# Default: .ai_workflow
WORKFLOW_DIR="${WORKFLOW_DIR:-{{WORKFLOW_DIR}}}"

# Default cleanup age in days
# Override with --older-than option
DEFAULT_AGE="${DEFAULT_AGE:-30}"

# ============================================================================
# Constants - Do not modify
# ============================================================================

SCRIPT_NAME=$(basename "$0")
SCRIPT_VERSION="2.0.0"
```

### Function Standards

```bash
# ============================================================================
# Functions
# ============================================================================

# Print usage information
# Globals: SCRIPT_NAME
# Arguments: None
# Outputs: Usage text to stdout
function show_usage() {
  cat << EOF
Usage: $SCRIPT_NAME [OPTIONS]

Options:
  -h, --help          Show this help message
  -d, --dry-run       Simulate actions without executing
  -v, --verbose       Enable verbose output
  --older-than DAYS   Clean files older than DAYS (default: $DEFAULT_AGE)

Examples:
  $SCRIPT_NAME --dry-run
  $SCRIPT_NAME --older-than 60 --verbose
EOF
}

# Log message to stdout
# Globals: None
# Arguments:
#   $1 - Log level (INFO, WARN, ERROR)
#   $2+ - Message to log
# Outputs: Formatted log message to stdout/stderr
function log() {
  local level=$1
  shift
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  
  case "$level" in
    ERROR)
      echo "[$timestamp] ERROR: $*" >&2
      ;;
    WARN)
      echo "[$timestamp] WARN: $*" >&2
      ;;
    *)
      echo "[$timestamp] INFO: $*"
      ;;
  esac
}
```

### Error Handling

```bash
# Trap errors and cleanup
trap 'error_handler $? $LINENO' ERR

function error_handler() {
  local exit_code=$1
  local line_number=$2
  log ERROR "Script failed with exit code $exit_code at line $line_number"
  # Cleanup if needed
  exit "$exit_code"
}

# Cleanup on exit
trap cleanup EXIT

function cleanup() {
  log INFO "Cleaning up temporary files..."
  # Cleanup logic here
}
```

### Argument Parsing

```bash
# Parse command-line arguments
DRY_RUN=false
VERBOSE=false
OLDER_THAN=$DEFAULT_AGE

while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      show_usage
      exit 0
      ;;
    -d|--dry-run)
      DRY_RUN=true
      shift
      ;;
    -v|--verbose)
      VERBOSE=true
      shift
      ;;
    --older-than)
      OLDER_THAN=$2
      shift 2
      ;;
    *)
      log ERROR "Unknown option: $1"
      show_usage
      exit 1
      ;;
  esac
done
```

---

## Workflow Templates

### GitHub Actions Best Practices

**1. Language-Agnostic Design**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive
      
      # Read language from config
      - name: Detect language
        id: lang
        run: |
          LANG=$(grep "primary_language:" .workflow-config.yaml | cut -d'"' -f2)
          echo "language=$LANG" >> $GITHUB_OUTPUT
      
      # Conditional setup based on language
      - name: Setup Node.js
        if: steps.lang.outputs.language == 'javascript'
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Python
        if: steps.lang.outputs.language == 'python'
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
```

**2. Configuration-Driven Commands**

```yaml
- name: Run tests
  run: |
    # Read test command from config
    TEST_CMD=$(grep "test_command:" .workflow-config.yaml | cut -d'"' -f2)
    eval "$TEST_CMD"
```

**3. Artifact Handling**

```yaml
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: .ai_workflow/logs/test-results.xml
```

---

## Testing Templates

### Manual Testing Checklist

Before committing a template:

- [ ] YAML syntax validation: `yamllint file.yaml`
- [ ] Shell syntax check: `shellcheck script.sh.template`
- [ ] All placeholders documented
- [ ] Example values provided
- [ ] Works when placeholders replaced
- [ ] Comments are clear and helpful
- [ ] Version and date updated
- [ ] Follows naming conventions
- [ ] Passes project validation script

### Test with Real Values

```bash
# 1. Copy template
cp config/.workflow-config.yaml.template /tmp/test-config.yaml

# 2. Replace placeholders (automate with sed or manual)
sed -i 's/{{PROJECT_NAME}}/Test Project/g' /tmp/test-config.yaml
sed -i 's/{{PROJECT_KIND}}/nodejs_api/g' /tmp/test-config.yaml
# ... replace all placeholders

# 3. Validate
yamllint /tmp/test-config.yaml

# 4. Check no placeholders remain
grep "{{" /tmp/test-config.yaml
# Should return nothing
```

### Integration Testing

Test in actual project:

```bash
# 1. Create test project
mkdir /tmp/test-integration
cd /tmp/test-integration
git init

# 2. Add submodule (your local development version)
git submodule add /path/to/ai_workflow_core .workflow_core

# 3. Copy and customize template
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
# Edit .workflow-config.yaml

# 4. Verify integration
bash .workflow_core/scripts/cleanup_artifacts.sh.template --dry-run
```

---

## Best Practices

### 1. Documentation-First Approach

Before writing template code:
1. Document purpose and usage
2. List all placeholders with examples
3. Provide complete examples
4. Include troubleshooting notes

### 2. Progressive Disclosure

```yaml
# Basic configuration (always visible)
project:
  name: "{{PROJECT_NAME}}"
  
# Advanced options (commented, users uncomment if needed)
# advanced:
#   custom_option: "value"  # Uncomment to enable
```

### 3. Sensible Defaults

Minimize required placeholders:

```bash
# Good: Provide default with placeholder as override
WORKFLOW_DIR="${WORKFLOW_DIR:-.ai_workflow}"

# Better: Document default clearly
# Default: .ai_workflow
# Override: Set WORKFLOW_DIR environment variable
WORKFLOW_DIR="${WORKFLOW_DIR:-{{WORKFLOW_DIR}}}"
```

### 4. Version Everything

Track template versions:

```yaml
# Top of YAML template
# Template Version: 2.0.0
# Last Updated: 2026-02-07
# Compatible with: ai_workflow_core v2.0.0+

# Top of script template
# Version: 2.0.0
# Date: 2026-02-01
```

### 5. Fail Fast

Validate inputs early:

```bash
# Validate required placeholders are replaced
if [[ "$REPO_ROOT" == "{{REPO_ROOT}}" ]]; then
  log ERROR "REPO_ROOT placeholder not replaced. Edit this script first."
  exit 1
fi

# Validate required directories exist
if [[ ! -d "$WORKFLOW_DIR" ]]; then
  log ERROR "Workflow directory not found: $WORKFLOW_DIR"
  exit 1
fi
```

---

## Common Patterns

### Multi-Language Support Pattern

```yaml
# config/.workflow-config.yaml.template
tech_stack:
  primary_language: "{{LANGUAGE}}"
  
  # Language-specific configuration
  javascript:
    package_manager: "{{JS_PACKAGE_MANAGER}}"  # npm, yarn, pnpm
    node_version: "{{NODE_VERSION}}"            # 18, 20, etc.
    
  python:
    package_manager: "{{PY_PACKAGE_MANAGER}}"  # pip, poetry, pipenv
    python_version: "{{PYTHON_VERSION}}"       # 3.9, 3.11, etc.
```

### Conditional Sections Pattern

```yaml
# Optional features (uncomment to enable)

# Feature: Database integration
# database:
#   type: "postgresql"  # postgresql, mysql, sqlite
#   host: "{{DB_HOST}}"
#   port: "{{DB_PORT}}"

# Feature: Cache configuration
# cache:
#   type: "redis"  # redis, memcached
#   host: "{{CACHE_HOST}}"
```

### Environment Override Pattern

```bash
# Script with environment variable overrides
CONFIG_FILE="${CONFIG_FILE:-.workflow-config.yaml}"
DRY_RUN="${DRY_RUN:-false}"
VERBOSE="${VERBOSE:-false}"

# Allow environment variables to override defaults
WORKFLOW_DIR="${WORKFLOW_DIR:-$(grep 'artifact_dir:' "$CONFIG_FILE" | cut -d'"' -f2)}"
```

---

## Validation

### Pre-Commit Validation

```bash
#!/bin/bash
# Validate templates before committing

echo "Validating templates..."

# 1. YAML syntax
for file in config/*.yaml config/*.yaml.template; do
  echo "Checking $file..."
  yamllint "$file" || exit 1
done

# 2. Shell syntax
for file in scripts/*.sh.template; do
  echo "Checking $file..."
  # Create temporary file with placeholders replaced
  tmp_file="/tmp/$(basename "$file" .template)"
  sed 's/{{[^}]*}}/PLACEHOLDER/g' "$file" > "$tmp_file"
  shellcheck "$tmp_file" || exit 1
  rm "$tmp_file"
done

# 3. Documentation validation
python3 scripts/validate_context_blocks.py docs/ || exit 1

echo "✅ All templates valid"
```

### Placeholder Reference Check

Ensure all placeholders are documented:

```bash
# Extract all placeholders from templates
grep -roh "{{[^}]*}}" config/ scripts/ | sort -u > /tmp/used-placeholders.txt

# Extract documented placeholders from PLACEHOLDER_REFERENCE.md
grep -o "{{[^}]*}}" docs/api/PLACEHOLDER_REFERENCE.md | sort -u > /tmp/documented-placeholders.txt

# Find undocumented placeholders
comm -23 /tmp/used-placeholders.txt /tmp/documented-placeholders.txt > /tmp/undocumented.txt

if [[ -s /tmp/undocumented.txt ]]; then
  echo "❌ Undocumented placeholders found:"
  cat /tmp/undocumented.txt
  exit 1
fi

echo "✅ All placeholders documented"
```

---

## Resources

### Related Documentation

- **Placeholder Reference**: `docs/api/PLACEHOLDER_REFERENCE.md` - Complete placeholder list
- **Config Reference**: `docs/api/CONFIG_REFERENCE.md` - Configuration field reference
- **Project Kinds Schema**: `docs/api/PROJECT_KINDS_SCHEMA.md` - Project type definitions
- **Contributing Guide**: `docs/CONTRIBUTING.md` - General contribution guidelines

### Tools

- **yamllint**: YAML syntax validator - `pip install yamllint`
- **shellcheck**: Shell script linter - `apt install shellcheck` or `brew install shellcheck`
- **shfmt**: Shell script formatter - `go install mvdan.cc/sh/v3/cmd/shfmt@latest`

### Examples

- **Configuration template**: `config/.workflow-config.yaml.template`
- **Script template**: `scripts/cleanup_artifacts.sh.template`
- **Project kinds**: `config/project_kinds.yaml`
- **GitHub workflow**: `workflow-templates/workflows/code-quality.yml`

---

**Last Updated**: 2026-02-07  
**Document Version**: 2.0.0
