# Testing Documentation

**Version**: 1.0.1  
**Last Updated**: 2026-02-10  
**Audience**: Developers and contributors

> **Purpose**: Comprehensive guide to testing ai_workflow_core templates, validations, and integrations.

## Table of Contents

- [Overview](#overview)
- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Validation Scripts](#validation-scripts)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Test Coverage](#test-coverage)
- [Troubleshooting](#troubleshooting)

---

## Overview

ai_workflow_core is a **configuration and template library**, not an execution engine. Testing focuses on:

✅ **Configuration validation**: YAML syntax, schema correctness  
✅ **Documentation validation**: Context blocks, structure, links  
✅ **Directory structure**: Required directories, empty detection  
✅ **Integration health**: Submodule setup, placeholder replacement  
✅ **Template validity**: Placeholder patterns, file structure  
✅ **Example projects**: Integration examples work correctly  

❌ **NOT tested** (belongs in parent ai_workflow project):  
- Workflow execution logic
- Step orchestration
- AI integration runtime
- Pipeline execution

---

## Testing Philosophy

### Core Principles

1. **Validation over execution**: Test that templates and configs are valid, not that they execute
2. **Static analysis**: Most tests analyze files without running workflows
3. **Integration testing**: Verify templates work when copied to real projects
4. **Self-testing**: ai_workflow_core tests itself using its own templates

### Test Pyramid

```
        ┌─────────────────┐
        │  Integration    │  ← Examples work in real projects
        │     Tests       │
        ├─────────────────┤
        │   Validation    │  ← Structure, docs, config validity
        │     Tests       │
        ├─────────────────┤
        │  Static Tests   │  ← YAML syntax, linting, formatting
        └─────────────────┘
```

---

## Test Types

### 1. Static Analysis Tests

**Purpose**: Validate file syntax and formatting without execution.

**Tools**:
- `yamllint`: YAML syntax and style
- `shellcheck`: Shell script linting
- `markdownlint`: Markdown formatting
- `pylint`: Python code quality

**Run**:
```bash
# YAML files
yamllint -d relaxed config/

# Shell scripts
shellcheck scripts/*.sh

# Python scripts
pylint scripts/*.py

# Markdown files
markdownlint docs/
```

### 2. Structure Validation Tests

**Purpose**: Verify directory structure and organization.

**Script**: `scripts/validate_structure.py`

**Validates**:
- ✅ Required directories exist
- ✅ No unexpected empty directories
- ✅ All directories are documented
- ✅ Structure consistency

**Run**:
```bash
# Validate structure
python3 scripts/validate_structure.py

# Validate and fix empty directories
python3 scripts/validate_structure.py --fix

# Quiet mode (errors only)
python3 scripts/validate_structure.py --quiet
```

**Expected output**:
```
✅ All required directories present: config, docs, examples, scripts, workflow-templates, .github
✅ No problematic empty directories found
✅ All directories are documented
✅ Structure validation passed!
```

### 3. Documentation Validation Tests

**Purpose**: Validate documentation completeness and correctness.

**Script**: `scripts/validate_context_blocks.py`

**Validates**:
- ✅ Context blocks are properly formatted
- ✅ Code examples have correct syntax
- ✅ No malformed markdown structures
- ✅ Documentation consistency

**Run**:
```bash
# Validate all documentation
python3 scripts/validate_context_blocks.py docs/

# Validate specific directory
python3 scripts/validate_context_blocks.py docs/guides/
```

**Expected output**:
```
Validating docs/guides/QUICK_START.md... ✓
Validating docs/api/CONFIG_REFERENCE.md... ✓
All documentation validation passed!
```

### 4. Integration Health Tests

**Purpose**: Validate ai_workflow_core integration in projects.

**Script**: `scripts/check_integration_health.sh.template`

**Validates**:
- ✅ Submodule present and initialized
- ✅ Configuration file exists
- ✅ No unreplaced placeholders
- ✅ YAML syntax valid
- ✅ Artifact directory structure correct
- ✅ .gitignore properly configured

**Run**:
```bash
# Check integration health
bash .workflow_core/scripts/check_integration_health.sh

# Auto-fix common issues
bash .workflow_core/scripts/check_integration_health.sh --fix
```

**Expected output**:
```
✅ Submodule present at .workflow_core/
✅ Submodule initialized
✅ Configuration file exists: .workflow-config.yaml
✅ No unreplaced placeholders found
✅ Artifact directory structure valid
✅ .gitignore configured correctly
Integration health: PASS
```

### 5. Configuration Schema Tests

**Purpose**: Validate configuration files against schemas.

**Manual validation**:
```bash
# Install yamllint if needed
pip install yamllint

# Validate configuration
yamllint .workflow-config.yaml

# Check for placeholder patterns
grep -r "{{.*}}" .workflow-config.yaml
```

**Automated validation**:
```python
# scripts/validate_config.py (create if needed)
import yaml
import sys

def validate_config(config_file):
    with open(config_file, 'r') as f:
        config = yaml.safe_load(f)
    
    # Required fields
    required = ['project', 'tech_stack', 'structure']
    for field in required:
        if field not in config:
            print(f"❌ Missing required field: {field}")
            return False
    
    print("✅ Configuration valid")
    return True

if __name__ == '__main__':
    sys.exit(0 if validate_config('.workflow-config.yaml') else 1)
```

### 6. Example Integration Tests

**Purpose**: Verify example projects work correctly.

**Test each example**:
```bash
# Test shell example
cd examples/shell/
bash scripts/run_tests.sh

# Test nodejs example
cd examples/nodejs/
npm install
npm test
```

**Validation checklist**:
- [ ] Example README is complete
- [ ] Configuration has no placeholders
- [ ] All example code runs without errors
- [ ] Example demonstrates key features
- [ ] Dependencies are documented

---

## Running Tests

### Complete Test Suite

Run all tests together:

```bash
#!/bin/bash
# scripts/run_all_tests.sh

set -e

echo "Running ai_workflow_core test suite..."

# 1. Static analysis
echo "→ Static analysis..."
yamllint -d relaxed config/
shellcheck scripts/*.sh
pylint scripts/*.py || true  # Warning-level, don't fail

# 2. Structure validation
echo "→ Structure validation..."
python3 scripts/validate_structure.py

# 3. Documentation validation
echo "→ Documentation validation..."
python3 scripts/validate_context_blocks.py docs/

# 4. Integration health (self-test)
echo "→ Integration health..."
bash scripts/check_integration_health.sh.template || true

# 5. Configuration validation
echo "→ Configuration validation..."
yamllint .workflow-config.yaml

echo "✅ All tests passed!"
```

Make executable and run:
```bash
chmod +x scripts/run_all_tests.sh
./scripts/run_all_tests.sh
```

### Individual Test Commands

```bash
# Quick validation (structure + docs)
python3 scripts/validate_structure.py && \
python3 scripts/validate_context_blocks.py docs/

# Full validation (all checks)
yamllint -d relaxed config/ && \
shellcheck scripts/*.sh && \
python3 scripts/validate_structure.py && \
python3 scripts/validate_context_blocks.py docs/

# Pre-commit validation
yamllint .workflow-config.yaml && \
python3 scripts/validate_structure.py --quiet
```

---

## Validation Scripts

### validate_structure.py

**Location**: `scripts/validate_structure.py`

**Purpose**: Validate directory structure consistency.

**Usage**:
```bash
python3 scripts/validate_structure.py [--fix] [--quiet]
```

**Exit codes**:
- `0`: Structure is valid
- `1`: Validation errors found
- `2`: Script error

**Configuration** (edit script):
```python
REQUIRED_DIRS = [
    'config',
    'docs',
    'examples',
    'scripts',
    'workflow-templates',
    '.github',
]

ALLOWED_EMPTY = {
    '.git',
    '__pycache__',
    'node_modules',
}
```

### validate_context_blocks.py

**Location**: `scripts/validate_context_blocks.py`

**Purpose**: Validate documentation context blocks.

**Usage**:
```bash
python3 scripts/validate_context_blocks.py <directory>
```

**Validates**:
- Code block formatting
- Context block structure
- Markdown syntax
- Example completeness

### check_integration_health.sh

**Location**: `scripts/check_integration_health.sh.template`

**Purpose**: Validate project integration health.

**Usage**:
```bash
bash scripts/check_integration_health.sh [--fix]
```

**Exit codes**:
- `0`: All checks passed
- `1`: One or more checks failed
- `2`: Critical error (submodule missing)

---

## Writing Tests

### Adding Structure Validation Rules

Edit `scripts/validate_structure.py`:

```python
# Add to REQUIRED_DIRS
REQUIRED_DIRS = [
    'config',
    'docs',
    'examples',
    'scripts',
    'workflow-templates',
    '.github',
    'new_required_dir',  # Add here
]

# Add to KNOWN_STRUCTURE
KNOWN_STRUCTURE = {
    '.github',
    'config',
    # ... existing entries ...
    'new_required_dir',  # Add here
}
```

### Adding Documentation Validation

Edit `scripts/validate_context_blocks.py`:

```python
def validate_custom_pattern(content: str) -> bool:
    """Validate custom documentation pattern."""
    pattern = r'your_pattern_here'
    if not re.search(pattern, content):
        return False
    return True
```

### Adding Integration Health Checks

Edit `scripts/check_integration_health.sh.template`:

```bash
# Add new check function
check_custom_validation() {
    echo "→ Checking custom validation..."
    
    if [[ ! -f "custom_file.yaml" ]]; then
        error "Custom file not found"
        return 1
    fi
    
    success "Custom validation passed"
    return 0
}

# Add to main validation flow
main() {
    # ... existing checks ...
    check_custom_validation || ((ERRORS++))
}
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive
      
      - name: Install dependencies
        run: |
          pip install yamllint
          sudo apt-get install -y shellcheck
      
      - name: Run tests
        run: |
          yamllint -d relaxed config/
          shellcheck scripts/*.sh
          python3 scripts/validate_structure.py
          python3 scripts/validate_context_blocks.py docs/
```

### Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: validate-structure
        name: Validate structure
        entry: python3 scripts/validate_structure.py
        language: system
        pass_filenames: false
      
      - id: validate-docs
        name: Validate documentation
        entry: python3 scripts/validate_context_blocks.py docs/
        language: system
        pass_filenames: false
```

Install and use:
```bash
pip install pre-commit
pre-commit install
pre-commit run --all-files
```

---

## Test Coverage

### What's Covered

✅ **Configuration Files**:
- YAML syntax validation
- Schema correctness
- Placeholder patterns

✅ **Documentation**:
- Context blocks
- Code examples
- Link validity
- Structure

✅ **Scripts**:
- Shell script syntax
- Python code quality
- Executable permissions

✅ **Integration**:
- Submodule setup
- Directory structure
- Configuration validity

### What's NOT Covered

❌ **Execution Logic**: No workflow execution tests (see parent ai_workflow project)  
❌ **Runtime Behavior**: No integration tests with AI systems  
❌ **Performance**: No benchmarking or load testing  

### Coverage Goals

- **Static validation**: 100% of files
- **Structure validation**: 100% of directories
- **Documentation**: 100% of docs
- **Examples**: All examples validated

---

## Troubleshooting

### Tests Fail: "yamllint not found"

**Solution**:
```bash
pip install yamllint
```

### Tests Fail: "shellcheck not found"

**Solution**:
```bash
# Ubuntu/Debian
sudo apt-get install shellcheck

# macOS
brew install shellcheck
```

### Tests Fail: Structure validation errors

**Investigate**:
```bash
# Show detailed errors
python3 scripts/validate_structure.py

# Auto-fix empty directories
python3 scripts/validate_structure.py --fix
```

### Tests Fail: Documentation validation

**Debug**:
```bash
# Validate specific file
python3 scripts/validate_context_blocks.py docs/guides/QUICK_START.md

# Check markdown syntax
markdownlint docs/
```

### Pre-commit hooks fail

**Reset**:
```bash
# Reinstall hooks
pre-commit clean
pre-commit install
pre-commit run --all-files
```

---

## Related Documentation

- [Contributing Guide](../CONTRIBUTING.md)
- [CI/CD Integration](../advanced/CI_CD_INTEGRATION.md)
- [Workflow Automation](../workflow-automation/README.md)
- [Script API Reference](../api/SCRIPT_API_REFERENCE.md)

---

**Need help?** See [Troubleshooting Guide](../guides/TROUBLESHOOTING.md) or [open an issue](https://github.com/mpbarbosa/ai_workflow_core/issues).

**Last Updated**: 2026-02-10
