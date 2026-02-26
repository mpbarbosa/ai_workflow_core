# Placeholder Reference Guide

**Version**: 1.0.0  
**Last Updated**: 2026-02-01  
**Format**: `{{PLACEHOLDER_NAME}}`

> **Purpose**: Complete reference for all placeholder patterns used in ai_workflow_core templates. This guide explains what each placeholder means, valid values, examples, and substitution patterns.

---

## Table of Contents

- [Overview](#overview)
- [Placeholder Format](#placeholder-format)
- [Core Placeholders](#core-placeholders)
- [Placeholder Substitution](#placeholder-substitution)
- [Examples by Project Type](#examples-by-project-type)
- [Validation](#validation)
- [Best Practices](#best-practices)

---

## Overview

**Placeholders** are variable markers in template files that you replace with project-specific values. They use the format `{{PLACEHOLDER_NAME}}` and appear in:
- Configuration templates (`.workflow-config.yaml.template`)
- Script templates (`cleanup_artifacts.sh.template`)
- Documentation templates

### Purpose

Placeholders enable:
- Single source of truth for templates
- Easy customization per project
- Type-safe value substitution
- Clear documentation of required values

---

## Placeholder Format

### Syntax

```
{{PLACEHOLDER_NAME}}
```

**Rules**:
- Wrapped in double curly braces: `{{` and `}}`
- All uppercase letters
- Underscores for word separation
- No spaces inside braces
- Case-sensitive

**Valid Examples**:
```yaml
name: "{{PROJECT_NAME}}"
version: "{{VERSION}}"
language: "{{LANGUAGE}}"
```

**Invalid Examples**:
```yaml
name: "{{ PROJECT_NAME }}"  # ❌ Spaces inside braces
name: "{{project_name}}"    # ❌ Lowercase
name: "{{PROJECT-NAME}}"    # ❌ Hyphens instead of underscores
```

---

## Core Placeholders

### Project Metadata

#### `{{PROJECT_NAME}}`

**Description**: Human-readable project name  
**Type**: String  
**Required**: Yes  
**Used In**: `.workflow-config.yaml`

**Valid Values**: Any descriptive project name  
**Length**: 3-100 characters recommended

**Examples**:
```yaml
# Short names
name: "API Gateway"
name: "Deploy Scripts"
name: "Web Dashboard"

# Descriptive names
name: "User Management API"
name: "E-commerce Admin Dashboard"
name: "Infrastructure Automation Scripts"
```

**Tips**:
- Use title case
- Be descriptive but concise
- Avoid abbreviations unless widely known
- Don't include version numbers

---

#### `{{PROJECT_TYPE}}`

**Description**: Technical project type (hyphenated format)  
**Type**: String (kebab-case)  
**Required**: Yes  
**Used In**: `.workflow-config.yaml`

**Valid Values**:
- `"nodejs-application"`
- `"nodejs-api"`
- `"python-application"`
- `"python-api"`
- `"shell-script-automation"`
- `"static-website"`
- `"react-spa"`
- `"client-spa"`
- `"configuration-library"`
- `"generic-project"`

**Examples**:
```yaml
type: "nodejs-api"            # Node.js backend API
type: "shell-script-automation"  # Bash automation
type: "react-spa"              # React application
type: "configuration-library"  # Config/template library
```

**Related**: See `{{PROJECT_KIND}}` for underscored variant

---

#### `{{PROJECT_DESCRIPTION}}`

**Description**: Brief one-line project description  
**Type**: String  
**Required**: Yes  
**Used In**: `.workflow-config.yaml`

**Valid Values**: Any concise description  
**Length**: 50-200 characters recommended

**Examples**:
```yaml
description: "RESTful API for user authentication and authorization"
description: "Automated deployment scripts for AWS infrastructure"
description: "Admin dashboard built with React and TypeScript"
description: "Language-agnostic configuration templates for workflows"
```

**Tips**:
- Start with what the project does
- Mention key technologies
- Keep it to one sentence
- Focus on purpose, not implementation details

---

#### `{{PROJECT_KIND}}`

**Description**: Project kind from `project_kinds.yaml` (underscored format)  
**Type**: String (snake_case)  
**Required**: Yes  
**Used In**: `.workflow-config.yaml`

**Valid Values** (must match `config/project_kinds.yaml`):
- `"shell_script_automation"`
- `"nodejs_api"`
- `"client_spa"`
- `"react_spa"`
- `"static_website"`
- `"python_app"`
- `"configuration_library"`
- `"generic"`

**Examples**:
```yaml
kind: "nodejs_api"              # Node.js API
kind: "shell_script_automation" # Shell scripts
kind: "react_spa"               # React SPA
kind: "configuration_library"   # Config library
```

**Reference**: [`docs/api/PROJECT_KINDS_SCHEMA.md`](PROJECT_KINDS_SCHEMA.md)

**Important**: `PROJECT_TYPE` uses hyphens, `PROJECT_KIND` uses underscores:
```yaml
type: "nodejs-api"      # Hyphenated
kind: "nodejs_api"      # Underscored
```

---

#### `{{VERSION}}`

**Description**: Project version (semantic versioning, no 'v' prefix)  
**Type**: String (semver format)  
**Required**: Yes  
**Used In**: `.workflow-config.yaml`

**Format**: `"MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]"`

**Valid Values**:
- `"1.0.0"` - Initial release
- `"2.1.3"` - Stable version
- `"1.0.0-alpha"` - Pre-release
- `"2.0.0-beta.1"` - Beta version
- `"1.2.3-rc.1+build.123"` - Release candidate with build metadata

**Examples**:
```yaml
version: "1.0.0"        # Initial stable release
version: "2.3.1"        # Maintenance release
version: "3.0.0-beta"   # Beta version
```

**Tips**:
- Start new projects at `"1.0.0"` or `"0.1.0"`
- No 'v' prefix (use `"1.0.0"` not `"v1.0.0"`)
- Follow semantic versioning rules
- Update in both `.workflow-config.yaml` and `package.json`

---

### Technology Stack

#### `{{LANGUAGE}}`

**Description**: Primary programming language  
**Type**: String (lowercase)  
**Required**: Yes  
**Used In**: `.workflow-config.yaml`

**Valid Values**:
- `"bash"` - Shell scripts
- `"javascript"` - JavaScript (Node.js or browser)
- `"typescript"` - TypeScript
- `"python"` - Python
- `"yaml"` - YAML configuration files
- `"go"` - Go
- `"rust"` - Rust
- `"java"` - Java
- `"ruby"` - Ruby

**Examples**:
```yaml
# Backend API
primary_language: "javascript"

# Shell automation
primary_language: "bash"

# Python application
primary_language: "python"

# Configuration library
primary_language: "yaml"
```

**Tips**:
- Use lowercase
- Choose the primary language (not all languages used)
- For multi-language projects, choose the dominant one

---

#### `{{BUILD_SYSTEM}}`

**Description**: Build system or package manager  
**Type**: String (lowercase)  
**Required**: Yes  
**Used In**: `.workflow-config.yaml`

**Valid Values**:

**JavaScript/Node.js**:
- `"none"` - No build system
- `"npm"` - Node Package Manager
- `"webpack"` - Webpack bundler
- `"vite"` - Vite build tool
- `"rollup"` - Rollup bundler
- `"parcel"` - Parcel bundler

**Python**:
- `"none"` - No build
- `"pip"` - pip package manager
- `"poetry"` - Poetry
- `"pipenv"` - Pipenv

**Java**:
- `"maven"` - Maven
- `"gradle"` - Gradle

**Other**:
- `"go"` - Go toolchain
- `"cargo"` - Rust Cargo
- `"none"` - No build system

**Examples**:
```yaml
# Node.js with npm
build_system: "npm"

# React with Vite
build_system: "vite"

# Shell scripts (no build)
build_system: "none"

# Python with pip
build_system: "pip"
```

---

#### `{{TEST_FRAMEWORK}}`

**Description**: Testing framework  
**Type**: String (lowercase)  
**Required**: Yes  
**Used In**: `.workflow-config.yaml`

**Valid Values by Language**:

**JavaScript**:
- `"jest"` - Jest testing framework
- `"mocha"` - Mocha
- `"vitest"` - Vitest
- `"playwright"` - Playwright (E2E)
- `"cypress"` - Cypress (E2E)

**Python**:
- `"pytest"` - pytest
- `"unittest"` - Python unittest

**Shell**:
- `"shell-script"` - Custom shell tests
- `"bats"` - Bash Automated Testing System
- `"bash_unit"` - bash_unit

**Configuration/Other**:
- `"validation-scripts"` - Custom validation scripts
- `"none"` - No tests

**Examples**:
```yaml
# Node.js with Jest
test_framework: "jest"

# Shell with BATS
test_framework: "bats"

# Python with pytest
test_framework: "pytest"

# Config library with validation
test_framework: "validation-scripts"
```

---

#### `{{TEST_COMMAND}}`

**Description**: Command to execute tests  
**Type**: String (shell command)  
**Required**: Yes  
**Used In**: `.workflow-config.yaml`

**Format**: Complete command including arguments

**Examples by Framework**:
```yaml
# JavaScript/Node.js
test_command: "npm test"
test_command: "npm run test:unit"
test_command: "npx jest --coverage"

# Shell scripts
test_command: "./tests/run_tests.sh"
test_command: "bats tests/"
test_command: "bash tests/test_all.sh"

# Python
test_command: "pytest tests/"
test_command: "python -m pytest --cov=src tests/"
test_command: "python -m unittest discover"

# Validation scripts
test_command: "python scripts/validate_context_blocks.py"
test_command: "./scripts/validate_all.sh"
```

**Tips**:
- Use the exact command that runs tests
- Include important flags (e.g., `--coverage`)
- Make it executable from project root
- Ensure it exits with proper status codes

---

#### `{{LINT_COMMAND}}`

**Description**: Command to run linter  
**Type**: String (shell command)  
**Required**: Yes  
**Used In**: `.workflow-config.yaml`

**Format**: Complete linting command including arguments

**Examples by Language**:
```yaml
# JavaScript/Node.js
lint_command: "eslint ."
lint_command: "eslint . --ext .js,.jsx"
lint_command: "npx eslint src/ --fix"

# TypeScript
lint_command: "eslint . --ext .ts,.tsx"
lint_command: "tsc --noEmit && eslint ."

# Shell scripts
lint_command: "shellcheck src/**/*.sh"
lint_command: "shellcheck -x -S warning src/*.sh"
lint_command: "shfmt -d -i 4 src/"

# Python
lint_command: "pylint src/"
lint_command: "black --check . && pylint src/"
lint_command: "ruff check ."

# YAML/Config
lint_command: "yamllint -d relaxed config/"
lint_command: "yamllint config/ docs/"
```

**Tips**:
- Include file patterns or directories
- Use glob patterns for multiple files
- Combine multiple linters with `&&`
- Consider auto-fix flags for development

---

### Directory Structure

#### `{{PROJECT_ROOT}}`

**Description**: Project root directory path  
**Type**: String (absolute path)  
**Required**: Context-dependent  
**Used In**: Script templates

**Format**: Absolute path to project root

**Examples**:
```bash
# In script templates
PROJECT_ROOT="/home/user/projects/myapp"
cd "${PROJECT_ROOT}" || exit 1

# In configuration
project_root: "/opt/applications/api"
```

**Usage in Templates**:
```bash
#!/bin/bash
PROJECT_ROOT="{{PROJECT_ROOT}}"
cd "${PROJECT_ROOT}" || exit 1
```

**Tips**:
- Always use absolute paths
- Quote variables in scripts: `"${PROJECT_ROOT}"`
- Validate directory exists before use
- Consider using `$(pwd)` for dynamic detection

---

#### `{{ARTIFACT_DIR}}`

**Description**: Workflow artifact directory path  
**Type**: String (relative or absolute path)  
**Required**: Context-dependent  
**Used In**: Script templates

**Default Value**: `.ai_workflow`

**Format**: Path to artifact directory

**Examples**:
```bash
# Default (relative)
ARTIFACT_DIR=".ai_workflow"

# Absolute
ARTIFACT_DIR="/home/user/projects/myapp/.ai_workflow"

# Custom location
ARTIFACT_DIR=".workflow-data"
```

**Usage in Templates**:
```bash
#!/bin/bash
ARTIFACT_DIR="{{ARTIFACT_DIR}}"
mkdir -p "${ARTIFACT_DIR}/logs"
```

**Subdirectories**:
- `${ARTIFACT_DIR}/backlog/` - Execution reports
- `${ARTIFACT_DIR}/summaries/` - AI summaries
- `${ARTIFACT_DIR}/logs/` - Execution logs
- `${ARTIFACT_DIR}/metrics/` - Performance metrics
- `${ARTIFACT_DIR}/checkpoints/` - Resume points
- `${ARTIFACT_DIR}/prompts/` - AI prompt logs
- `${ARTIFACT_DIR}/ml_models/` - ML models
- `${ARTIFACT_DIR}/.incremental_cache/` - Cache

---

## Placeholder Substitution

### Manual Substitution

**Step 1**: Copy template
```bash
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
```

**Step 2**: Replace placeholders
```yaml
# Before (template)
project:
  name: "{{PROJECT_NAME}}"
  type: "{{PROJECT_TYPE}}"
  kind: "{{PROJECT_KIND}}"

# After (substituted)
project:
  name: "User Management API"
  type: "nodejs-api"
  kind: "nodejs_api"
```

### Using sed (Shell)

```bash
# Replace single placeholder
sed -i 's/{{PROJECT_NAME}}/My Project/g' .workflow-config.yaml

# Replace multiple placeholders
sed -i \
  -e 's/{{PROJECT_NAME}}/User API/g' \
  -e 's/{{PROJECT_TYPE}}/nodejs-api/g' \
  -e 's/{{VERSION}}/1.0.0/g' \
  .workflow-config.yaml
```

### Using Script

```bash
#!/bin/bash
# substitute_placeholders.sh

PROJECT_NAME="User Management API"
PROJECT_TYPE="nodejs-api"
PROJECT_KIND="nodejs_api"
VERSION="1.0.0"
LANGUAGE="javascript"

sed -i \
  -e "s/{{PROJECT_NAME}}/${PROJECT_NAME}/g" \
  -e "s/{{PROJECT_TYPE}}/${PROJECT_TYPE}/g" \
  -e "s/{{PROJECT_KIND}}/${PROJECT_KIND}/g" \
  -e "s/{{VERSION}}/${VERSION}/g" \
  -e "s/{{LANGUAGE}}/${LANGUAGE}/g" \
  .workflow-config.yaml
```

---

## Examples by Project Type

### Node.js API Example

```yaml
# Template values
{{PROJECT_NAME}} → "User Management API"
{{PROJECT_TYPE}} → "nodejs-api"
{{PROJECT_DESCRIPTION}} → "RESTful API for user authentication"
{{PROJECT_KIND}} → "nodejs_api"
{{VERSION}} → "1.0.0"
{{LANGUAGE}} → "javascript"
{{BUILD_SYSTEM}} → "npm"
{{TEST_FRAMEWORK}} → "jest"
{{TEST_COMMAND}} → "npm test"
{{LINT_COMMAND}} → "eslint ."
```

### Shell Script Automation Example

```yaml
# Template values
{{PROJECT_NAME}} → "Deployment Scripts"
{{PROJECT_TYPE}} → "shell-script-automation"
{{PROJECT_DESCRIPTION}} → "Automated AWS deployment scripts"
{{PROJECT_KIND}} → "shell_script_automation"
{{VERSION}} → "2.1.0"
{{LANGUAGE}} → "bash"
{{BUILD_SYSTEM}} → "none"
{{TEST_FRAMEWORK}} → "bats"
{{TEST_COMMAND}} → "./tests/run_tests.sh"
{{LINT_COMMAND}} → "shellcheck src/**/*.sh"
```

### Configuration Library Example

```yaml
# Template values (ai_workflow_core itself)
{{PROJECT_NAME}} → "AI Workflow Core"
{{PROJECT_TYPE}} → "configuration-library"
{{PROJECT_DESCRIPTION}} → "Language-agnostic foundational templates"
{{PROJECT_KIND}} → "configuration_library"
{{VERSION}} → "1.0.0"
{{LANGUAGE}} → "yaml"
{{BUILD_SYSTEM}} → "none"
{{TEST_FRAMEWORK}} → "validation-scripts"
{{TEST_COMMAND}} → "python scripts/validate_context_blocks.py"
{{LINT_COMMAND}} → "yamllint -d relaxed config/"
```

### React SPA Example

```yaml
# Template values
{{PROJECT_NAME}} → "Admin Dashboard"
{{PROJECT_TYPE}} → "react-spa"
{{PROJECT_DESCRIPTION}} → "React admin dashboard with TypeScript"
{{PROJECT_KIND}} → "react_spa"
{{VERSION}} → "3.0.0"
{{LANGUAGE}} → "typescript"
{{BUILD_SYSTEM}} → "vite"
{{TEST_FRAMEWORK}} → "vitest"
{{TEST_COMMAND}} → "npm run test"
{{LINT_COMMAND}} → "eslint . --ext .ts,.tsx"
```

---

## Validation

### Syntax Validation

**Check for unreplaced placeholders**:
```bash
# Find remaining placeholders
grep -r '{{[A-Z_]*}}' .workflow-config.yaml

# Should output nothing if all replaced
```

### Value Validation

**Check valid project kind**:
```bash
# Verify project.kind matches project_kinds.yaml
grep "^  $(yq '.project.kind' .workflow-config.yaml):" \
  .workflow_core/config/project_kinds.yaml
```

**Verify version format**:
```bash
# Check semantic version format
if [[ $(yq '.project.version' .workflow-config.yaml) =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-z0-9.]+)?(\+[a-z0-9.]+)?$ ]]; then
  echo "✅ Valid version"
else
  echo "❌ Invalid version format"
fi
```

### YAML Syntax Validation

```bash
# Validate YAML syntax
yamllint .workflow-config.yaml

# Check for required fields
yq '.project.name' .workflow-config.yaml
yq '.project.kind' .workflow-config.yaml
yq '.tech_stack.primary_language' .workflow-config.yaml
```

---

## Best Practices

### Template Files

✅ **Do**:
- Keep `{{PLACEHOLDER}}` format in template files
- Document all placeholders in comments
- Provide example values
- Use consistent naming (ALL_CAPS with underscores)

❌ **Don't**:
- Replace placeholders in core templates
- Use spaces inside braces: `{{ PLACEHOLDER }}`
- Mix naming conventions
- Use placeholders in non-template files

### Substitution

✅ **Do**:
- Validate values before substitution
- Check for remaining placeholders after substitution
- Test the resulting configuration
- Document custom placeholder values

❌ **Don't**:
- Hard-code sensitive values (use environment variables)
- Forget to replace all instances
- Use invalid values for constrained fields
- Skip validation after substitution

### Version Control

✅ **Do**:
- Commit substituted configuration files
- Use `.gitignore` for sensitive values
- Document substitution process in README
- Provide example configurations

❌ **Don't**:
- Commit templates without substitution
- Version control secrets
- Leave `{{PLACEHOLDERS}}` in committed files
- Commit `.env` or credentials

---

## See Also

- [`CONFIG_REFERENCE.md`](CONFIG_REFERENCE.md) - Complete configuration reference
- [`PROJECT_KINDS_SCHEMA.md`](PROJECT_KINDS_SCHEMA.md) - Project kind definitions
- [`docs/INTEGRATION.md`](../INTEGRATION.md) - Integration guide
- [`docs/guides/TROUBLESHOOTING.md`](../guides/TROUBLESHOOTING.md) - Common issues

---

**Last Updated**: 2026-02-01  
**Document Version**: 1.0.0
