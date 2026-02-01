# Configuration Reference

**Version**: 1.0.0  
**Last Updated**: 2026-02-01  
**Status**: Complete Reference

> **Purpose**: Complete reference documentation for `.workflow-config.yaml` configuration file. This document describes every field, its purpose, valid values, and examples.

---

## Table of Contents

- [Overview](#overview)
- [Configuration Structure](#configuration-structure)
- [Field Reference](#field-reference)
  - [project](#project-section)
  - [tech_stack](#tech_stack-section)
  - [structure](#structure-section)
  - [workflow](#workflow-section)
  - [configuration](#configuration-section)
  - [submodule](#submodule-section)
  - [quality](#quality-section)
- [Complete Examples](#complete-examples)
- [Validation Rules](#validation-rules)

---

## Overview

The `.workflow-config.yaml` file is the main configuration file for projects using ai_workflow_core. It defines project metadata, technology stack, directory structure, and workflow preferences.

**File Location**: `<project-root>/.workflow-config.yaml`  
**Template Source**: `.workflow_core/config/.workflow-config.yaml.template`  
**Format**: YAML (strict syntax)

### Quick Start

```bash
# Copy template
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Edit and replace {{PLACEHOLDERS}} with actual values
# Validate syntax
yamllint .workflow-config.yaml
```

---

## Configuration Structure

```yaml
project:           # Project metadata (required)
tech_stack:        # Technology stack (required)
structure:         # Directory structure (required)
workflow:          # Workflow preferences (optional)
configuration:     # Configuration-specific settings (optional, for config libraries)
submodule:         # Git submodule settings (optional)
quality:           # Quality standards (optional)
```

---

## Field Reference

### project Section

**Purpose**: Define project identity and classification.

#### Fields

##### `project.name`
- **Type**: `string`
- **Required**: Yes
- **Description**: Human-readable project name
- **Example**: `"My Application"`, `"API Gateway"`
- **Placeholder**: `{{PROJECT_NAME}}`

##### `project.type`
- **Type**: `string` (hyphenated)
- **Required**: Yes
- **Description**: Technical project type (use hyphens)
- **Valid Values**:
  - `"nodejs-application"`
  - `"nodejs-api"`
  - `"python-application"`
  - `"shell-script-automation"`
  - `"static-website"`
  - `"react-spa"`
  - `"client-spa"`
  - `"configuration-library"`
  - `"generic-project"`
- **Example**: `"nodejs-application"`
- **Placeholder**: `{{PROJECT_TYPE}}`

##### `project.description`
- **Type**: `string`
- **Required**: Yes
- **Description**: Brief one-line project description
- **Length**: 50-200 characters recommended
- **Example**: `"RESTful API for user authentication and authorization"`
- **Placeholder**: `{{PROJECT_DESCRIPTION}}`

##### `project.kind`
- **Type**: `string` (underscored)
- **Required**: Yes
- **Description**: Project kind from `project_kinds.yaml` (use underscores)
- **Valid Values**:
  - `"shell_script_automation"`
  - `"nodejs_api"`
  - `"client_spa"`
  - `"react_spa"`
  - `"static_website"`
  - `"python_app"`
  - `"configuration_library"`
  - `"generic"`
- **Reference**: See [`docs/api/PROJECT_KINDS_SCHEMA.md`](PROJECT_KINDS_SCHEMA.md)
- **Example**: `"nodejs_api"`
- **Placeholder**: `{{PROJECT_KIND}}`

**Note**: `project.type` uses hyphens, `project.kind` uses underscores.

##### `project.version`
- **Type**: `string` (semantic version)
- **Required**: Yes
- **Description**: Project version following semver (no 'v' prefix)
- **Format**: `"MAJOR.MINOR.PATCH"`
- **Example**: `"1.0.0"`, `"2.1.3-beta"`
- **Placeholder**: `{{VERSION}}`

#### Example

```yaml
project:
  name: "User Management API"
  type: "nodejs-api"
  description: "RESTful API for user authentication, authorization, and profile management"
  kind: "nodejs_api"
  version: "1.2.0"
```

---

### tech_stack Section

**Purpose**: Define technology stack and tooling.

#### Fields

##### `tech_stack.primary_language`
- **Type**: `string`
- **Required**: Yes
- **Description**: Primary programming language
- **Valid Values**:
  - `"bash"` - Shell scripts
  - `"javascript"` - JavaScript (Node.js)
  - `"typescript"` - TypeScript
  - `"python"` - Python
  - `"yaml"` - Configuration files (for config libraries)
  - `"go"` - Go
  - `"rust"` - Rust
  - `"java"` - Java
- **Example**: `"javascript"`
- **Placeholder**: `{{LANGUAGE}}`

##### `tech_stack.build_system`
- **Type**: `string`
- **Required**: Yes
- **Description**: Build system or package manager
- **Valid Values**:
  - `"none"` - No build system
  - `"npm"` - Node Package Manager
  - `"webpack"` - Webpack bundler
  - `"vite"` - Vite build tool
  - `"maven"` - Maven (Java)
  - `"gradle"` - Gradle (Java/Kotlin)
  - `"pip"` - pip (Python)
  - `"cargo"` - Cargo (Rust)
  - `"go"` - Go toolchain
- **Example**: `"npm"`
- **Placeholder**: `{{BUILD_SYSTEM}}`

##### `tech_stack.test_framework`
- **Type**: `string`
- **Required**: Yes
- **Description**: Testing framework
- **Valid Values by Language**:
  - **JavaScript**: `"jest"`, `"mocha"`, `"vitest"`, `"playwright"`
  - **Python**: `"pytest"`, `"unittest"`
  - **Shell**: `"shell-script"`, `"bats"`, `"bash_unit"`
  - **Configuration**: `"validation-scripts"`
- **Example**: `"jest"`
- **Placeholder**: `{{TEST_FRAMEWORK}}`

##### `tech_stack.test_command`
- **Type**: `string`
- **Required**: Yes
- **Description**: Command to run tests
- **Example**: 
  - `"npm test"`
  - `"./tests/run_tests.sh"`
  - `"pytest tests/"`
  - `"python scripts/validate_context_blocks.py"`
- **Placeholder**: `{{TEST_COMMAND}}`

##### `tech_stack.lint_command`
- **Type**: `string`
- **Required**: Yes
- **Description**: Command to run linter
- **Example**:
  - `"eslint ."`
  - `"shellcheck src/**/*.sh"`
  - `"pylint src/"`
  - `"yamllint -d relaxed config/"`
- **Placeholder**: `{{LINT_COMMAND}}`

#### Example

```yaml
tech_stack:
  primary_language: "javascript"
  build_system: "npm"
  test_framework: "jest"
  test_command: "npm test"
  lint_command: "eslint . --ext .js,.jsx"
```

---

### structure Section

**Purpose**: Define project directory structure.

#### Fields

##### `structure.source_dirs`
- **Type**: `array` of `string`
- **Required**: Yes
- **Description**: Source code directories
- **Default**: `["src"]`
- **Example**: 
  ```yaml
  source_dirs:
    - src
    - lib
  ```

##### `structure.test_dirs`
- **Type**: `array` of `string`
- **Required**: Yes
- **Description**: Test directories
- **Default**: `["tests"]`
- **Example**:
  ```yaml
  test_dirs:
    - tests
    - __tests__
  ```

##### `structure.docs_dirs`
- **Type**: `array` of `string`
- **Required**: Yes
- **Description**: Documentation directories
- **Default**: `["docs"]`
- **Example**:
  ```yaml
  docs_dirs:
    - docs
    - documentation
  ```

#### Example

```yaml
structure:
  source_dirs:
    - src
    - lib
  test_dirs:
    - tests
    - integration
  docs_dirs:
    - docs
    - examples
```

---

### workflow Section

**Purpose**: Configure workflow execution preferences (optional).

**Note**: These settings apply when using the parent `ai_workflow` execution engine.

#### Fields

##### `workflow.smart_execution`
- **Type**: `boolean`
- **Required**: No
- **Default**: `true`
- **Description**: Skip unchanged areas during workflow execution
- **Example**: `true`

##### `workflow.parallel_execution`
- **Type**: `boolean`
- **Required**: No
- **Default**: `true`
- **Description**: Enable parallel execution of independent steps
- **Example**: `true`

##### `workflow.ai_cache_enabled`
- **Type**: `boolean`
- **Required**: No
- **Default**: `true`
- **Description**: Cache AI responses (24-hour TTL)
- **Example**: `true`

##### `workflow.auto_commit`
- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Automatically commit workflow artifacts
- **Example**: `false`

##### `workflow.multi_stage_pipeline`
- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Enable multi-stage progressive validation
- **Example**: `false`

##### `workflow.ml_optimize`
- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: ML optimization (requires historical data)
- **Example**: `false`

#### Example

```yaml
workflow:
  smart_execution: true
  parallel_execution: true
  ai_cache_enabled: true
  auto_commit: false
  multi_stage_pipeline: false
  ml_optimize: false
```

---

### configuration Section

**Purpose**: Configuration-specific settings (for configuration_library project kind only).

#### Fields

##### `configuration.placeholder_format`
- **Type**: `string`
- **Required**: No (required for configuration_library)
- **Description**: Template placeholder format
- **Example**: `"{{VARIABLE_NAME}}"`

##### `configuration.integration_type`
- **Type**: `string`
- **Required**: No (required for configuration_library)
- **Valid Values**: `"git-submodule"`, `"npm-package"`, `"copy"`
- **Example**: `"git-submodule"`

##### `configuration.required_docs`
- **Type**: `array` of `string`
- **Required**: No
- **Description**: Required documentation files
- **Example**:
  ```yaml
  required_docs:
    - "README.md"
    - "INTEGRATION.md"
    - "CHANGELOG.md"
  ```

##### `configuration.validation`
- **Type**: `object`
- **Required**: No
- **Description**: Validation requirements
- **Fields**:
  - `yaml_syntax`: `boolean` - Validate YAML syntax
  - `placeholder_consistency`: `boolean` - Check placeholder consistency
  - `example_completeness`: `boolean` - Validate examples
  - `documentation_links`: `boolean` - Check documentation links

#### Example

```yaml
configuration:
  placeholder_format: "{{VARIABLE_NAME}}"
  integration_type: "git-submodule"
  required_docs:
    - "README.md"
    - "INTEGRATION.md"
    - "CHANGELOG.md"
  validation:
    yaml_syntax: true
    placeholder_consistency: true
    example_completeness: true
    documentation_links: true
```

---

### submodule Section

**Purpose**: Git submodule configuration (optional).

#### Fields

##### `submodule.intended_path`
- **Type**: `string`
- **Required**: No
- **Description**: Recommended submodule path
- **Example**: `".workflow_core"`

##### `submodule.update_strategy`
- **Type**: `string`
- **Required**: No
- **Valid Values**: `"checkout"`, `"rebase"`, `"merge"`
- **Default**: `"checkout"`
- **Example**: `"checkout"`

#### Example

```yaml
submodule:
  intended_path: ".workflow_core"
  update_strategy: "checkout"
```

---

### quality Section

**Purpose**: Quality standards and requirements (optional).

#### Fields

##### `quality.documentation`
- **Type**: `object`
- **Required**: No
- **Fields**:
  - `integration_guide`: `boolean` - Require integration guide
  - `examples_required`: `boolean` - Require examples
  - `placeholder_documentation`: `boolean` - Document placeholders

##### `quality.templates`
- **Type**: `object`
- **Required**: No
- **Fields**:
  - `placeholder_consistency`: `boolean` - Check placeholder consistency
  - `example_validation`: `boolean` - Validate examples
  - `backward_compatibility`: `boolean` - Maintain backward compatibility

#### Example

```yaml
quality:
  documentation:
    integration_guide: true
    examples_required: true
    placeholder_documentation: true
  templates:
    placeholder_consistency: true
    example_validation: true
    backward_compatibility: true
```

---

## Complete Examples

### Example 1: Node.js API

```yaml
project:
  name: "User Management API"
  type: "nodejs-api"
  description: "RESTful API for user authentication and profile management"
  kind: "nodejs_api"
  version: "1.2.0"

tech_stack:
  primary_language: "javascript"
  build_system: "npm"
  test_framework: "jest"
  test_command: "npm test"
  lint_command: "eslint . --ext .js,.jsx"

structure:
  source_dirs:
    - src
    - lib
  test_dirs:
    - tests
  docs_dirs:
    - docs

workflow:
  smart_execution: true
  parallel_execution: true
  ai_cache_enabled: true
  auto_commit: false
```

### Example 2: Shell Script Automation

```yaml
project:
  name: "Deployment Scripts"
  type: "shell-script-automation"
  description: "Automated deployment and infrastructure management scripts"
  kind: "shell_script_automation"
  version: "2.0.1"

tech_stack:
  primary_language: "bash"
  build_system: "none"
  test_framework: "bats"
  test_command: "./tests/run_tests.sh"
  lint_command: "shellcheck src/**/*.sh"

structure:
  source_dirs:
    - src
    - scripts
  test_dirs:
    - tests
  docs_dirs:
    - docs

workflow:
  smart_execution: false
  parallel_execution: false
  ai_cache_enabled: true
  auto_commit: false
```

### Example 3: Configuration Library

```yaml
project:
  name: "AI Workflow Core"
  type: "configuration-library"
  description: "Language-agnostic foundational configuration and templates"
  kind: "configuration_library"
  version: "1.0.0"

tech_stack:
  primary_language: "yaml"
  build_system: "none"
  test_framework: "validation-scripts"
  test_command: "python scripts/validate_context_blocks.py"
  lint_command: "yamllint -d relaxed config/"

structure:
  source_dirs:
    - config
    - workflow-templates
    - scripts
  test_dirs:
    - scripts
  docs_dirs:
    - docs
    - examples

configuration:
  placeholder_format: "{{VARIABLE_NAME}}"
  integration_type: "git-submodule"
  required_docs:
    - "README.md"
    - "INTEGRATION.md"
    - "CHANGELOG.md"
  validation:
    yaml_syntax: true
    placeholder_consistency: true
    example_completeness: true
    documentation_links: true

submodule:
  intended_path: ".workflow_core"
  update_strategy: "checkout"

quality:
  documentation:
    integration_guide: true
    examples_required: true
    placeholder_documentation: true
  templates:
    placeholder_consistency: true
    example_validation: true
    backward_compatibility: true
```

### Example 4: React SPA

```yaml
project:
  name: "Admin Dashboard"
  type: "react-spa"
  description: "React-based admin dashboard with TypeScript"
  kind: "react_spa"
  version: "3.1.0"

tech_stack:
  primary_language: "typescript"
  build_system: "vite"
  test_framework: "vitest"
  test_command: "npm run test"
  lint_command: "eslint . --ext .ts,.tsx && prettier --check ."

structure:
  source_dirs:
    - src
    - components
  test_dirs:
    - tests
    - __tests__
  docs_dirs:
    - docs

workflow:
  smart_execution: true
  parallel_execution: true
  ai_cache_enabled: true
  auto_commit: false
  multi_stage_pipeline: true
```

---

## Validation Rules

### Required Fields

All configurations must include:
- `project.name`
- `project.type`
- `project.description`
- `project.kind`
- `project.version`
- `tech_stack.primary_language`
- `tech_stack.build_system`
- `tech_stack.test_framework`
- `tech_stack.test_command`
- `tech_stack.lint_command`
- `structure.source_dirs` (non-empty array)
- `structure.test_dirs` (non-empty array)
- `structure.docs_dirs` (non-empty array)

### Field Constraints

- `project.version`: Must follow semver format `X.Y.Z` (no 'v' prefix)
- `project.kind`: Must match one of 8 defined kinds in `project_kinds.yaml`
- `project.type`: Use hyphens (e.g., `nodejs-api`)
- `project.kind`: Use underscores (e.g., `nodejs_api`)
- Directory paths: Relative paths only, no leading slash

### YAML Syntax

- Use 2-space indentation
- Quote all string values
- Use arrays for lists (not comma-separated)
- Boolean values: `true` or `false` (lowercase, unquoted)

### Validation Command

```bash
# Validate YAML syntax
yamllint .workflow-config.yaml

# Validate against project kind schema (requires parent ai_workflow)
# This checks that configuration matches project_kinds.yaml requirements
```

---

## See Also

- [`PROJECT_KINDS_SCHEMA.md`](PROJECT_KINDS_SCHEMA.md) - Project kind definitions
- [`PLACEHOLDER_REFERENCE.md`](PLACEHOLDER_REFERENCE.md) - Complete placeholder guide
- [`docs/INTEGRATION.md`](../INTEGRATION.md) - Integration guide
- [`docs/guides/TROUBLESHOOTING.md`](../guides/TROUBLESHOOTING.md) - Common issues

---

**Last Updated**: 2026-02-01  
**Document Version**: 1.0.0
