# Project Kinds Schema Reference

**Version**: 1.2.0  
**Last Updated**: 2026-01-30  
**Schema File**: `config/project_kinds.yaml`

> **Purpose**: Complete reference for the `project_kinds.yaml` schema. This document explains all 8 supported project kinds, their validation rules, testing requirements, quality standards, and AI guidance.

---

## Table of Contents

- [Overview](#overview)
- [Schema Structure](#schema-structure)
- [Supported Project Kinds](#supported-project-kinds)
- [Schema Fields Reference](#schema-fields-reference)
- [Project Kind Definitions](#project-kind-definitions)
  - [shell_script_automation](#shell_script_automation)
  - [nodejs_api](#nodejs_api)
  - [client_spa](#client_spa)
  - [react_spa](#react_spa)
  - [static_website](#static_website)
  - [python_app](#python_app)
  - [configuration_library](#configuration_library)
  - [generic](#generic)
- [Choosing the Right Project Kind](#choosing-the-right-project-kind)
- [Validation Rules](#validation-rules)

---

## Overview

The `project_kinds.yaml` file defines 8 standardized project types with specific validation rules, testing requirements, quality standards, and best practices. Each project kind represents a common software development pattern with language-specific conventions.

**Purpose**:
- Define validation rules per project type
- Specify test frameworks and coverage thresholds
- Establish quality standards (linters, documentation)
- Provide AI guidance for best practices
- Ensure consistency across similar projects

**File Location**: `config/project_kinds.yaml`  
**Current Version**: 1.2.0  
**Last Updated**: 2026-01-30

---

## Schema Structure

Each project kind follows this structure:

```yaml
project_kinds:
  <kind_name>:
    name: "Human Readable Name"
    description: "Brief description"
    
    validation:
      required_files: []          # Files that must exist
      required_directories: []    # Directories that must exist
      optional_files: []          # Recommended files
      file_patterns: []           # Expected file extensions
    
    testing:
      test_framework: ""          # Testing framework(s)
      test_directory: ""          # Test directory name(s)
      test_file_pattern: ""       # Test file naming pattern
      test_command: ""            # Command to run tests
      coverage_required: bool     # Whether coverage is required
      coverage_threshold: int     # Minimum coverage percentage
      
    quality:
      linters: []                 # Linter configurations
      documentation_required: bool
      inline_comments_recommended: bool
      readme_required: bool
      # Additional quality fields per project type
    
    dependencies:
      package_files: []           # Package manifest files
      lock_files: []              # Lock file names
      validation_required: bool
      security_audit_required: bool
      audit_command: ""
    
    build:
      required: bool              # Whether build is required
      build_command: ""           # Build command
      output_directory: ""        # Build output directory
    
    deployment:
      type: ""                    # Deployment type
      requires_build: bool
      artifact_patterns: []
    
    ai_guidance:
      testing_standards: []       # Testing best practices
      style_guides: []            # Style guide references
      best_practices: []          # General best practices
      directory_standards: []     # Directory structure conventions
```

---

## Supported Project Kinds

| Kind | Name | Description | Coverage |
|------|------|-------------|----------|
| `shell_script_automation` | Shell Script Automation | Bash/shell automation tools | 0% |
| `nodejs_api` | Node.js API | Backend API with Express/similar | 80% |
| `client_spa` | Client SPA | Vanilla JS SPA with Bootstrap | 70% |
| `react_spa` | React SPA | React single-page application | 80% |
| `static_website` | Static Website | HTML/CSS/JS static site | 0% |
| `python_app` | Python Application | Python CLI or server application | 80% |
| `configuration_library` | Configuration Library | Template/config repository | 0% |
| `generic` | Generic Project | Fallback for other types | 0% |

**Coverage**: Minimum test coverage threshold

---

## Schema Fields Reference

### validation Section

Defines what files and directories must exist for the project kind.

#### Fields

- **`required_files`** (`array` of `string`):
  - Files that MUST exist in the project
  - Supports pipe-separated alternatives: `"server.js|app.js|index.js"`
  - Example: `["package.json", "README.md"]`

- **`required_directories`** (`array` of `string`):
  - Directories that MUST exist
  - Supports pipe-separated alternatives: `"src|lib|routes"`
  - Example: `["src", "tests"]`

- **`optional_files`** (`array` of `string`):
  - Recommended but not required files
  - Example: `[".env.example", "docker-compose.yml"]`

- **`file_patterns`** (`array` of `string`):
  - Expected file extensions in the project
  - Example: `["*.js", "*.ts", "*.json"]`

### testing Section

Defines testing framework, commands, and coverage requirements.

#### Fields

- **`test_framework`** (`string`):
  - Testing framework(s) used
  - Supports pipe-separated alternatives: `"jest|mocha|vitest"`
  - Example: `"jest"`

- **`test_directory`** (`string`):
  - Directory containing tests
  - Supports pipe-separated alternatives: `"test|tests|__tests__"`
  - Example: `"tests"`

- **`test_file_pattern`** (`string`):
  - Test file naming pattern
  - Supports pipe-separated alternatives: `"*.test.js|*.spec.js"`
  - Example: `"*.test.js"`

- **`test_command`** (`string`):
  - Command to execute tests
  - Example: `"npm test"`, `"pytest tests/"`

- **`coverage_required`** (`boolean`):
  - Whether code coverage is mandatory
  - Example: `true`

- **`coverage_threshold`** (`integer`):
  - Minimum coverage percentage (0-100)
  - Example: `80`

### quality Section

Defines linters, documentation standards, and quality requirements.

#### Fields

- **`linters`** (`array` of `object`):
  - Linter configurations
  - Each linter has:
    - `name`: Linter name
    - `enabled`: Whether enabled by default
    - `command`: Command to run linter
    - `args`: Command arguments (array)
    - `file_pattern`: File pattern to lint

- **`documentation_required`** (`boolean`):
  - Whether documentation is required
  - Example: `true`

- **`inline_comments_recommended`** (`boolean`):
  - Whether inline code comments are recommended
  - Example: `true`

- **`readme_required`** (`boolean`):
  - Whether README.md is required
  - Example: `true`

**Additional Quality Fields** (project-specific):
- `api_documentation_required`: For APIs
- `api_documentation_format`: e.g., `"openapi|swagger|jsdoc"`
- `accessibility_required`: For web projects
- `wcag_level`: e.g., `"AA"`

### dependencies Section

Defines package management and security audit requirements.

#### Fields

- **`package_files`** (`array` of `string`):
  - Package manifest files
  - Example: `["package.json"]`, `["requirements.txt"]`

- **`lock_files`** (`array` of `string`):
  - Lock file names
  - Example: `["package-lock.json", "yarn.lock"]`

- **`validation_required`** (`boolean`):
  - Whether dependency validation is required
  - Example: `true`

- **`security_audit_required`** (`boolean`):
  - Whether security audit is required (if applicable)
  - Example: `true`

- **`audit_command`** (`string`):
  - Command to run security audit
  - Example: `"npm audit"`, `"pip-audit"`

### build Section

Defines build requirements and configuration.

#### Fields

- **`required`** (`boolean`):
  - Whether build step is required
  - Example: `true` for TypeScript, `false` for vanilla JS

- **`build_command`** (`string`):
  - Command to build the project
  - Example: `"npm run build"`, `"webpack"`

- **`output_directory`** (`string`):
  - Build output directory
  - Supports pipe-separated alternatives: `"dist|build"`
  - Example: `"dist"`

### deployment Section

Defines deployment type and artifact requirements.

#### Fields

- **`type`** (`string`):
  - Deployment type
  - Values: `"script"`, `"service"`, `"static"`, `"package"`, `"submodule"`
  - Example: `"service"`

- **`requires_build`** (`boolean`):
  - Whether deployment requires build step
  - Example: `true`

- **`artifact_patterns`** (`array` of `string`):
  - Files/patterns to include in deployment
  - Example: `["dist/**/*", "package.json"]`

- **`environment_required`** (`boolean`):
  - Whether environment configuration is required
  - Example: `true`

### ai_guidance Section

Provides AI assistants with best practices and standards.

#### Fields

- **`testing_standards`** (`array` of `string`):
  - Testing best practices
  - Example: `["Jest best practices", "Mock external services"]`

- **`style_guides`** (`array` of `string`):
  - Style guide references
  - Example: `["Airbnb JavaScript Style Guide"]`

- **`best_practices`** (`array` of `string`):
  - General best practices for the language/framework
  - Example: `["Use async/await", "Validate input"]`

- **`directory_standards`** (`array` of `string`):
  - Directory structure conventions
  - Example: `["Separate routes/, controllers/, models/"]`

---

## Project Kind Definitions

### shell_script_automation

**Purpose**: Bash/shell script based automation tools and utilities.

**Typical Use Cases**:
- Deployment automation scripts
- Infrastructure management scripts
- CI/CD pipeline scripts
- System administration tools

#### Configuration

```yaml
shell_script_automation:
  name: "Shell Script Automation"
  description: "Bash/shell script based automation tools and utilities"
  
  validation:
    required_files: ["*.sh"]
    required_directories: ["src"]
    optional_files: ["README.md", ".gitignore"]
    file_patterns: ["*.sh", "*.bash"]
  
  testing:
    test_framework: "bash_unit"
    test_directory: "tests"
    test_file_pattern: "test_*.sh"
    test_command: "bash"
    coverage_required: false
    coverage_threshold: 0
    
  quality:
    linters:
      - name: "shellcheck"
        enabled: true
        command: "shellcheck"
        args: ["-x", "-S", "warning"]
        file_pattern: "*.sh"
      - name: "shfmt"
        enabled: false
        command: "shfmt"
        args: ["-d", "-i", "4"]
        file_pattern: "*.sh"
    documentation_required: true
    inline_comments_recommended: true
    readme_required: true
  
  dependencies:
    package_files: []
    lock_files: []
    validation_required: false
  
  build:
    required: false
    build_command: ""
    output_directory: ""
  
  deployment:
    type: "script"
    requires_build: false
    artifact_patterns: ["*.sh"]
  
  ai_guidance:
    testing_standards:
      - "BATS testing conventions and best practices"
      - "Test with set -euo pipefail for strict error handling"
      - "Mock external commands and dependencies"
      - "Test both success and failure scenarios"
    
    style_guides:
      - "Google Shell Style Guide"
      - "ShellCheck recommendations"
    
    best_practices:
      - "Quote all variable expansions: \"${var}\""
      - "Use [[ ]] for conditionals instead of [ ]"
      - "Use functions for code organization"
      - "Add error handling with trap"
      - "Use local for function variables"
      - "Avoid eval and command substitution pitfalls"
    
    directory_standards:
      - "Separate source (src/), tests (tests/), and docs (docs/)"
      - "Keep scripts in bin/ or scripts/ directory"
      - "Configuration files in config/ or root"
```

---

### nodejs_api

**Purpose**: Node.js backend API with Express or similar framework.

**Typical Use Cases**:
- RESTful APIs
- GraphQL servers
- Microservices
- Backend for web/mobile apps

#### Configuration

```yaml
nodejs_api:
  name: "Node.js API"
  description: "Node.js backend API with Express or similar framework"
  
  validation:
    required_files:
      - "package.json"
      - "server.js|app.js|index.js"
    required_directories:
      - "src|lib|routes"
    optional_files:
      - "README.md"
      - ".env.example"
      - "docker-compose.yml"
    file_patterns:
      - "*.js"
      - "*.ts"
      - "*.mjs"
  
  testing:
    test_framework: "jest|mocha|vitest"
    test_directory: "test|tests|__tests__"
    test_file_pattern: "*.test.js|*.spec.js|*.test.ts|*.spec.ts"
    test_command: "npm test"
    coverage_required: true
    coverage_threshold: 80
    
  quality:
    linters:
      - name: "eslint"
        enabled: true
        command: "npx eslint"
        args: ["."]
        file_pattern: "*.js|*.ts"
      - name: "prettier"
        enabled: true
        command: "npx prettier"
        args: ["--check", "."]
        file_pattern: "*.js|*.ts|*.json"
    
    documentation_required: true
    inline_comments_recommended: true
    readme_required: true
    api_documentation_required: true
    api_documentation_format: "openapi|swagger|jsdoc"
  
  dependencies:
    package_files: ["package.json"]
    lock_files: ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"]
    validation_required: true
    security_audit_required: true
    audit_command: "npm audit"
  
  build:
    required: false  # May be true for TypeScript
    build_command: "npm run build"
    output_directory: "dist|build"
  
  deployment:
    type: "service"
    requires_build: false
    artifact_patterns: ["package.json", "*.js", "src/**/*"]
    environment_required: true
  
  ai_guidance:
    testing_standards:
      - "Jest/Vitest/Mocha best practices"
      - "Supertest for API endpoint testing"
      - "Mock external services and databases"
      - "Test middleware and error handlers"
      - "Use fixtures for test data"
    
    style_guides:
      - "Airbnb JavaScript Style Guide"
      - "Node.js Best Practices"
      - "Express.js security best practices"
    
    best_practices:
      - "Use async/await for async operations"
      - "Handle errors with proper HTTP status codes"
      - "Validate input with middleware (joi, express-validator)"
      - "Use environment variables for configuration"
      - "Implement proper logging (winston, pino)"
      - "Follow RESTful API design principles"
    
    directory_standards:
      - "Separate routes/, controllers/, models/, services/"
      - "Configuration in config/ directory"
      - "Middleware in middleware/ directory"
      - "Tests parallel to src/ structure"
```

---

### client_spa

**Purpose**: Vanilla JavaScript single-page application with Bootstrap or similar CSS framework.

**Typical Use Cases**:
- Dashboard applications (no React/Vue/Angular)
- Admin panels
- Form-heavy applications
- Bootstrap-based SPAs

#### Key Characteristics
- **No framework required**: Vanilla JS, jQuery optional
- **CSS Framework**: Bootstrap, Tailwind, or similar
- **Coverage**: 70% minimum
- **Build**: Optional (depends on tooling)

---

### react_spa

**Purpose**: React single-page application.

**Typical Use Cases**:
- Modern web applications
- Dashboards with React
- Component-based UIs
- TypeScript React apps

#### Key Characteristics
- **Framework**: React (with or without TypeScript)
- **Test Framework**: Jest/Vitest with React Testing Library
- **Coverage**: 80% minimum
- **Build**: Required (Webpack, Vite, CRA)

---

### static_website

**Purpose**: HTML/CSS/JavaScript static website or portfolio.

**Typical Use Cases**:
- Marketing websites
- Landing pages
- Portfolio sites
- Documentation sites (static HTML)

#### Key Characteristics
- **Required**: `index.html`
- **Testing**: Optional (accessibility, link checking)
- **Coverage**: 0% (no tests required)
- **Accessibility**: WCAG AA required

---

### python_app

**Purpose**: Python CLI or server application.

**Typical Use Cases**:
- Flask/Django APIs
- FastAPI services
- CLI tools
- Data processing scripts

#### Key Characteristics
- **Test Framework**: pytest or unittest
- **Coverage**: 80% minimum
- **Linters**: pylint, black, mypy
- **Documentation**: Docstrings required (Google/NumPy/Sphinx format)

---

### configuration_library

**Purpose**: Template and configuration repository (meta-type).

**Typical Use Cases**:
- This repository (ai_workflow_core)
- Git submodule configuration libraries
- Template repositories
- Shared configuration packages

#### Key Characteristics
- **Language**: YAML, JSON, or templates
- **Testing**: Validation scripts
- **Coverage**: 0% (config files, not code)
- **Deployment**: Git submodule or package

#### Configuration

```yaml
configuration_library:
  name: "Configuration Library"
  description: "Template and configuration repository"
  
  validation:
    required_files:
      - "README.md"
      - "*.yaml|*.yml|*.json"
    required_directories:
      - "config|templates"
    optional_files:
      - "INTEGRATION.md"
      - "CHANGELOG.md"
      - ".gitignore"
    file_patterns:
      - "*.yaml"
      - "*.yml"
      - "*.json"
      - "*.template"
  
  testing:
    test_framework: "validation-scripts"
    test_directory: "tests|scripts"
    test_file_pattern: "validate_*.py|test_*.sh"
    test_command: "python scripts/validate.py"
    coverage_required: false
    coverage_threshold: 0
    
  quality:
    linters:
      - name: "yamllint"
        enabled: true
        command: "yamllint"
        args: ["-d", "relaxed"]
        file_pattern: "*.yaml|*.yml"
      - name: "jsonlint"
        enabled: false
        command: "jsonlint"
        args: ["-q"]
        file_pattern: "*.json"
    
    documentation_required: true
    inline_comments_recommended: true
    readme_required: true
    integration_guide_required: true
    placeholder_documentation_required: true
  
  dependencies:
    package_files: []
    lock_files: []
    validation_required: false
  
  build:
    required: false
    build_command: ""
    output_directory: ""
  
  deployment:
    type: "submodule"
    requires_build: false
    artifact_patterns: ["config/**/*", "templates/**/*", "*.md"]
  
  ai_guidance:
    testing_standards:
      - "Validate YAML/JSON syntax"
      - "Check placeholder consistency"
      - "Verify example completeness"
      - "Test documentation links"
    
    style_guides:
      - "YAML Style Guide"
      - "Configuration Best Practices"
    
    best_practices:
      - "Use consistent placeholder format"
      - "Document all configuration fields"
      - "Provide complete examples"
      - "Maintain backward compatibility"
      - "Version configuration schema"
    
    directory_standards:
      - "Configuration in config/ directory"
      - "Templates in templates/ or root"
      - "Examples in examples/ directory"
      - "Documentation in docs/ directory"
```

---

### generic

**Purpose**: Fallback for project types not covered by specific kinds.

**Typical Use Cases**:
- Experimental projects
- Multi-language projects
- Projects without clear category
- Custom project structures

#### Key Characteristics
- **Minimal requirements**: README.md only
- **Testing**: Optional
- **Coverage**: 0%
- **Flexibility**: Maximum flexibility, minimum enforcement

---

## Choosing the Right Project Kind

### Decision Tree

```
Is it a configuration/template library?
├─ Yes → configuration_library
└─ No
   └─ What language?
      ├─ Shell/Bash → shell_script_automation
      ├─ JavaScript/Node.js
      │  ├─ Backend API? → nodejs_api
      │  ├─ React SPA? → react_spa
      │  ├─ Vanilla JS SPA? → client_spa
      │  └─ Static HTML? → static_website
      ├─ Python → python_app
      └─ Other/Multiple → generic
```

### Selection Criteria

| Criteria | Use This Kind |
|----------|---------------|
| Backend API with Node.js | `nodejs_api` |
| React-based frontend | `react_spa` |
| Vanilla JS + Bootstrap | `client_spa` |
| Static HTML/CSS site | `static_website` |
| Python CLI/API | `python_app` |
| Bash automation | `shell_script_automation` |
| Templates & configs | `configuration_library` |
| Doesn't fit above | `generic` |

---

## Validation Rules

### File Patterns

File patterns support pipe-separated alternatives:
- `"server.js|app.js|index.js"` - Any of these files
- `"src|lib|routes"` - Any of these directories
- `"*.test.js|*.spec.js"` - Either naming pattern

### Required vs Optional

- **Required files/dirs**: Must exist or validation fails
- **Optional files**: Recommended but not enforced
- **File patterns**: Expected but not strictly validated

### Coverage Thresholds

| Project Kind | Threshold | Reason |
|--------------|-----------|--------|
| nodejs_api | 80% | Production API reliability |
| react_spa | 80% | UI component testing |
| client_spa | 70% | Vanilla JS flexibility |
| python_app | 80% | Python testing culture |
| shell_script_automation | 0% | Hard to unit test scripts |
| static_website | 0% | No logic to test |
| configuration_library | 0% | Config files, not code |
| generic | 0% | Unknown requirements |

---

## See Also

- [`CONFIG_REFERENCE.md`](CONFIG_REFERENCE.md) - Configuration file reference
- [`PLACEHOLDER_REFERENCE.md`](PLACEHOLDER_REFERENCE.md) - Placeholder guide
- [`docs/guides/TROUBLESHOOTING.md`](../guides/TROUBLESHOOTING.md) - Common issues
- [`docs/developers/ADDING_PROJECT_KINDS.md`](../developers/ADDING_PROJECT_KINDS.md) - Adding new kinds

---

**Last Updated**: 2026-01-30  
**Document Version**: 1.0.0  
**Schema Version**: 1.2.0
