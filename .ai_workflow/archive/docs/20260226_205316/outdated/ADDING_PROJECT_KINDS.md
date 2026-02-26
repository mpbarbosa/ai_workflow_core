# Developer Guide: Adding Project Kinds

**Version**: 1.0.0  
**Last Updated**: 2026-02-10  
**Audience**: Contributors extending ai_workflow_core

> **Purpose**: Learn how to add new project types to `config/project_kinds.yaml`

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Understanding Project Kinds](#understanding-project-kinds)
- [Schema Structure](#schema-structure)
- [Step-by-Step Guide](#step-by-step-guide)
- [Testing Your Changes](#testing-your-changes)
- [Submitting Contributions](#submitting-contributions)
- [Examples](#examples)

---

## Overview

Project kinds define validation rules, testing standards, and best practices for different project types. Adding a new project kind enables ai_workflow_core to provide tailored guidance for that project type.

**Current project kinds** (8 total):
1. `shell_script_automation`
2. `nodejs_api`
3. `client_spa`
4. `react_spa`
5. `static_website`
6. `python_app`
7. `configuration_library`
8. `generic`

---

## Prerequisites

### Knowledge Requirements

- YAML syntax and structure
- Project type characteristics (language, tools, conventions)
- Testing frameworks and linters for the language
- Best practices for the project type

### Tools Required

```bash
# YAML validator
pip install yamllint

# Editor with YAML support
code config/project_kinds.yaml  # VS Code
vim config/project_kinds.yaml   # Vim with YAML plugin
```

### Files to Understand

Before adding a project kind, read:
- `config/project_kinds.yaml` - Existing definitions
- `docs/api/PROJECT_KINDS_SCHEMA.md` - Schema reference
- `docs/api/CONFIG_REFERENCE.md` - Configuration reference

---

## Understanding Project Kinds

### Purpose

Project kinds define:
- **Validation rules**: Required files, directories, patterns
- **Testing configuration**: Frameworks, commands, coverage
- **Quality standards**: Linters, documentation requirements
- **Dependencies**: Package files, security audits
- **Build configuration**: Build requirements and commands
- **Deployment**: Deployment types and artifacts
- **AI guidance**: Best practices and conventions

### When to Add a New Kind

Add a new project kind when:
- ✅ Supporting a new language/framework
- ✅ Project type has unique validation needs
- ✅ Different testing/quality standards required
- ✅ Specific build/deployment patterns

Don't add if:
- ❌ Existing `generic` kind is sufficient
- ❌ Differences are minor (use configuration instead)
- ❌ Language-specific but follows common patterns

---

## Schema Structure

### Top-Level Structure

```yaml
project_kinds:
  your_project_kind:  # Underscored name
    description: "Brief description"
    validation:        # Required files/directories
    testing:           # Test framework and commands
    quality:           # Linting and documentation
    dependencies:      # Package management
    build:            # Build requirements
    deployment:       # Deployment configuration
    ai_guidance:      # Best practices
```

### Required Fields

Every project kind must have:
1. **description**: Human-readable description
2. **validation**: At least basic required files
3. **testing**: Test framework specification
4. **quality**: Linting requirements
5. **ai_guidance**: Best practices

### Optional Fields

- **dependencies**: If package management exists
- **build**: If build step required
- **deployment**: If deployment patterns defined

---

## Step-by-Step Guide

### Step 1: Choose a Name

**Naming convention**: Use underscores, lowercase, descriptive

**Good names**:
- `rust_cli_app`
- `django_web_app`
- `go_microservice`
- `flutter_mobile_app`

**Bad names**:
- `RustCLI` (no camelCase)
- `rust-cli` (no hyphens, use underscores)
- `app` (too generic)

### Step 2: Research the Project Type

Gather information about:
- **Language**: Primary language and version
- **Package manager**: npm, pip, cargo, go mod, etc.
- **Test framework**: Common testing tools
- **Linters**: Standard code quality tools
- **Build system**: Build tools and commands
- **File structure**: Common directory patterns
- **Best practices**: Language/framework conventions

### Step 3: Define Validation Rules

**Example structure**:
```yaml
validation:
  required_files:
    - "Cargo.toml"           # Package manifest
    - "README.md"            # Documentation
  required_dirs:
    - "src"                  # Source code
    - "tests"                # Tests
  file_patterns:
    - pattern: "**/*.rs"
      description: "Rust source files"
```

### Step 4: Define Testing Configuration

**Example structure**:
```yaml
testing:
  framework: "cargo test"
  commands:
    unit: "cargo test"
    integration: "cargo test --test integration"
  coverage:
    threshold: 80
    tool: "tarpaulin"
    command: "cargo tarpaulin --out Xml"
```

### Step 5: Define Quality Standards

**Example structure**:
```yaml
quality:
  linters:
    - name: "clippy"
      command: "cargo clippy -- -D warnings"
      required: true
    - name: "rustfmt"
      command: "cargo fmt --check"
      required: true
  documentation:
    required: true
    formats: ["README.md", "API docs"]
    standards:
      - "Document public APIs"
      - "Include usage examples"
```

### Step 6: Define Dependencies (if applicable)

**Example structure**:
```yaml
dependencies:
  package_files:
    - "Cargo.toml"
    - "Cargo.lock"
  security:
    audit_command: "cargo audit"
    update_command: "cargo update"
```

### Step 7: Define Build Configuration

**Example structure**:
```yaml
build:
  required: true
  commands:
    debug: "cargo build"
    release: "cargo build --release"
  output_dir: "target"
  artifacts:
    - "target/release/app"
```

### Step 8: Define Deployment Configuration

**Example structure**:
```yaml
deployment:
  type: "binary"
  artifacts:
    - pattern: "target/release/*"
      description: "Release binaries"
  strategies:
    - "Direct binary distribution"
    - "Package manager (cargo)"
```

### Step 9: Define AI Guidance

**Example structure**:
```yaml
ai_guidance:
  testing_standards:
    - "Write unit tests for all public functions"
    - "Integration tests for main workflows"
    - "Aim for 80%+ coverage"
  style_guides:
    - "Follow Rust API Guidelines"
    - "Use idiomatic Rust patterns"
  best_practices:
    - "Use Result/Option for error handling"
    - "Leverage Rust's type system"
    - "Document unsafe code"
  directory_standards:
    - "src/ for source code"
    - "tests/ for integration tests"
    - "benches/ for benchmarks"
```

### Step 10: Update Metadata

At the bottom of `project_kinds.yaml`:

```yaml
# Metadata
metadata:
  version: "1.3.0"  # Increment minor version
  last_updated: "2026-02-10"
  changelog:
    - version: "1.3.0"
      date: "2026-02-10"
      changes:
        - "Added rust_cli_app project kind"
    # ... existing entries ...
```

---

## Complete Example

### Adding a Rust CLI App Project Kind

```yaml
project_kinds:
  rust_cli_app:
    description: "Rust command-line applications"
    
    validation:
      required_files:
        - "Cargo.toml"
        - "README.md"
        - "LICENSE"
      required_dirs:
        - "src"
        - "tests"
      file_patterns:
        - pattern: "**/*.rs"
          description: "Rust source files"
        - pattern: "src/main.rs"
          description: "Main entry point"
    
    testing:
      framework: "cargo test"
      commands:
        unit: "cargo test --lib"
        integration: "cargo test --test '*'"
        doc: "cargo test --doc"
      coverage:
        threshold: 80
        tool: "tarpaulin"
        command: "cargo tarpaulin --out Xml"
    
    quality:
      linters:
        - name: "clippy"
          command: "cargo clippy -- -D warnings"
          required: true
        - name: "rustfmt"
          command: "cargo fmt --check"
          required: true
      documentation:
        required: true
        formats: ["README.md", "doc comments"]
        standards:
          - "Document all public APIs with doc comments"
          - "Include usage examples in README"
          - "Provide installation instructions"
    
    dependencies:
      package_files:
        - "Cargo.toml"
        - "Cargo.lock"
      security:
        audit_command: "cargo audit"
        update_command: "cargo update"
    
    build:
      required: true
      commands:
        debug: "cargo build"
        release: "cargo build --release"
      output_dir: "target"
      artifacts:
        - "target/release/app_name"
    
    deployment:
      type: "binary"
      artifacts:
        - pattern: "target/release/*"
          description: "Release binaries"
      strategies:
        - "Direct binary distribution"
        - "Package via cargo"
        - "System package managers (Homebrew, apt)"
    
    ai_guidance:
      testing_standards:
        - "Write unit tests for all public functions"
        - "Integration tests for CLI commands"
        - "Test edge cases and error handling"
        - "Aim for 80%+ test coverage"
      
      style_guides:
        - "Follow Rust API Guidelines"
        - "Use idiomatic Rust patterns"
        - "Follow naming conventions from std library"
      
      best_practices:
        - "Use Result/Option for error handling"
        - "Leverage Rust's type system for safety"
        - "Write documentation comments for public APIs"
        - "Use clap or structopt for CLI parsing"
        - "Handle errors gracefully with meaningful messages"
      
      directory_standards:
        - "src/ for source code"
        - "src/main.rs for CLI entry point"
        - "tests/ for integration tests"
        - "benches/ for benchmarks"
        - "examples/ for usage examples"
```

---

## Testing Your Changes

### 1. Validate YAML Syntax

```bash
# Check syntax
yamllint config/project_kinds.yaml

# Validate against schema (if you have a validator)
python3 scripts/validate_project_kinds.py
```

### 2. Test with Real Project

Create a test project using your new kind:

```bash
# Create test project
mkdir test_rust_app
cd test_rust_app

# Add ai_workflow_core
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core

# Create config
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Edit config to use your kind
# project:
#   kind: "rust_cli_app"
```

### 3. Validate Integration

```bash
# Run health check
bash .workflow_core/scripts/check_integration_health.sh

# Verify validation works
# Create required files/directories
# Run health check again
```

### 4. Test AI Guidance

Verify AI guidance is helpful:
- Are standards clear?
- Are best practices actionable?
- Is directory structure logical?

---

## Submitting Contributions

### 1. Create Branch

```bash
git checkout -b feature/add-rust-cli-project-kind
```

### 2. Make Changes

Edit `config/project_kinds.yaml`:
- Add your project kind
- Update metadata version and changelog
- Ensure proper formatting

### 3. Update Documentation

Update relevant docs:
- `docs/api/PROJECT_KINDS_SCHEMA.md` - Add to list
- `README.md` - Update supported kinds count
- `.github/copilot-instructions.md` - Update if needed

### 4. Test Thoroughly

```bash
# Validate
yamllint config/project_kinds.yaml

# Test integration
bash scripts/check_integration_health.sh

# Validate structure
python3 scripts/validate_structure.py
```

### 5. Commit and Push

```bash
git add config/project_kinds.yaml
git add docs/  # If you updated docs
git commit -m "feat: add rust_cli_app project kind

- Add rust_cli_app to project_kinds.yaml
- Define validation, testing, quality rules
- Include AI guidance for Rust best practices
- Update metadata to v1.3.0"

git push origin feature/add-rust-cli-project-kind
```

### 6. Create Pull Request

Create PR with:
- **Title**: `feat: add rust_cli_app project kind`
- **Description**: Explain the project kind, use cases, validation rules
- **Checklist**: YAML valid, documentation updated, tested

---

## Related Documentation

- [Project Kinds Schema Reference](../api/PROJECT_KINDS_SCHEMA.md)
- [Configuration Reference](../api/CONFIG_REFERENCE.md)
- [Contributing Guide](../CONTRIBUTING.md)

---

**Need help?** See [Troubleshooting Guide](../guides/TROUBLESHOOTING.md) or [open an issue](https://github.com/mpbarbosa/ai_workflow_core/issues).

**Last Updated**: 2026-02-10
