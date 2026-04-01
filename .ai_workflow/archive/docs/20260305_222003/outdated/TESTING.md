# Testing & Validation Guide

**Version**: 1.0.2  
**Last Updated**: 2026-02-07  
**Audience**: Users, integrators, contributors

> **Purpose**: Comprehensive guide for testing and validating ai_workflow_core configurations, templates, and integrations.

---

## Table of Contents

1. [Overview](#overview)
2. [Types of Testing](#types-of-testing)
3. [Configuration Validation](#configuration-validation)
4. [Template Testing](#template-testing)
5. [Integration Testing](#integration-testing)
6. [Validation Scripts](#validation-scripts)
7. [CI/CD Testing](#cicd-testing)
8. [Common Test Scenarios](#common-test-scenarios)
9. [Troubleshooting Tests](#troubleshooting-tests)

---

## Overview

### What to Test

When working with ai_workflow_core, you should test:

✅ **Configuration validity**: YAML syntax, required fields, placeholder replacement  
✅ **Template customization**: Proper substitution of placeholders  
✅ **Directory structure**: Required directories exist and are properly configured  
✅ **Project kind compatibility**: Configuration matches project kind requirements  
✅ **Script execution**: Template scripts work after customization  
✅ **Integration**: Submodule integration works correctly  
✅ **CI/CD workflows**: GitHub Actions and other CI/CD workflows function properly

### Testing Philosophy

ai_workflow_core is a **configuration and template library**, not an execution engine. Testing focuses on:

- **Static validation**: Configuration syntax, schema compliance
- **Template integrity**: Templates are syntactically correct
- **Integration verification**: Submodule setup works correctly
- **Documentation accuracy**: Examples and guides are up-to-date

**What we DON'T test**:
- Workflow execution (handled by parent ai_workflow project)
- Application logic (belongs to your project)
- Runtime behavior (not applicable to templates)

---

## Types of Testing

### 1. **Configuration Validation**
Verify `.workflow-config.yaml` is syntactically correct and semantically valid.

### 2. **Template Integrity Testing**
Ensure templates are valid and placeholders are correctly defined.

### 3. **Integration Testing**
Verify submodule integration and file copying work correctly.

### 4. **Documentation Testing**
Validate documentation examples, code blocks, and links.

### 5. **Script Testing**
Test utility scripts work correctly after customization.

---

## Configuration Validation

### Manual Validation

#### 1. YAML Syntax Check

```bash
# Install yamllint if not already installed
pip install yamllint

# Validate YAML syntax
yamllint .workflow-config.yaml

# Use relaxed rules (recommended for ai_workflow_core)
yamllint -d relaxed .workflow-config.yaml
```

**Expected output**:
```
✓ .workflow-config.yaml is valid YAML
```

**Common errors**:
```yaml
# ❌ Bad: Inconsistent indentation
project:
  name: "My Project"
   type: "nodejs-application"  # Wrong indentation

# ✅ Good: Consistent 2-space indentation
project:
  name: "My Project"
  type: "nodejs-application"
```

#### 2. Placeholder Check

Ensure all placeholders have been replaced:

```bash
# Check for remaining placeholders
grep -r "{{.*}}" .workflow-config.yaml

# No output = all placeholders replaced ✅
# Output found = some placeholders remain ❌
```

**Example unreplaced placeholders**:
```yaml
# ❌ These need replacement
project:
  name: "{{PROJECT_NAME}}"  # ❌ Not replaced
  version: "1.0.2"          # ✅ Replaced
```

#### 3. Required Fields Check

Verify all required fields are present:

```bash
# Check for essential fields
for field in "project.name" "project.type" "project.kind" "tech_stack.primary_language"; do
  yq eval ".${field}" .workflow-config.yaml
done
```

**Expected output**:
```
My Project
nodejs-application
nodejs_api
javascript
```

### Automated Validation

#### Using Python Script

Create a validation script:

```python
#!/usr/bin/env python3
"""Validate .workflow-config.yaml configuration file."""

import sys
import yaml
import re
from pathlib import Path

def validate_config(config_path: Path) -> list:
    """Validate configuration file and return list of errors."""
    errors = []
    
    # 1. Check file exists
    if not config_path.exists():
        return [f"Configuration file not found: {config_path}"]
    
    # 2. Parse YAML
    try:
        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)
    except yaml.YAMLError as e:
        return [f"YAML syntax error: {e}"]
    
    # 3. Check required sections
    required_sections = ['project', 'tech_stack', 'structure']
    for section in required_sections:
        if section not in config:
            errors.append(f"Missing required section: {section}")
    
    # 4. Check required project fields
    if 'project' in config:
        required_project_fields = ['name', 'type', 'kind', 'version']
        for field in required_project_fields:
            if field not in config['project']:
                errors.append(f"Missing required field: project.{field}")
            elif not config['project'][field]:
                errors.append(f"Empty value for: project.{field}")
    
    # 5. Check for unreplaced placeholders
    config_str = yaml.dump(config)
    placeholders = re.findall(r'{{[^}]+}}', config_str)
    if placeholders:
        errors.append(f"Unreplaced placeholders found: {', '.join(set(placeholders))}")
    
    # 6. Validate project kind format
    if 'project' in config and 'kind' in config['project']:
        kind = config['project']['kind']
        valid_kinds = [
            'shell_script_automation', 'nodejs_api', 'client_spa', 
            'react_spa', 'static_website', 'python_app', 
            'configuration_library', 'generic'
        ]
        if kind not in valid_kinds:
            errors.append(f"Invalid project kind: {kind}. Must be one of: {', '.join(valid_kinds)}")
    
    return errors

def main():
    config_path = Path('.workflow-config.yaml')
    errors = validate_config(config_path)
    
    if errors:
        print("❌ Configuration validation failed:\n")
        for error in errors:
            print(f"  • {error}")
        sys.exit(1)
    else:
        print("✅ Configuration is valid")
        sys.exit(0)

if __name__ == '__main__':
    main()
```

**Usage**:
```bash
# Make script executable
chmod +x validate_config.py

# Run validation
./validate_config.py

# Expected output on success:
# ✅ Configuration is valid
```

---

## Template Testing

### Testing Template Files

#### 1. Template Syntax Validation

Verify templates are valid YAML before placeholder substitution:

```bash
# For .yaml.template files, check structure
# Remove placeholders temporarily to test syntax
sed 's/{{[^}]*}}/TEST_VALUE/g' config/.workflow-config.yaml.template | yamllint -
```

#### 2. Placeholder Coverage Test

Ensure all placeholders in templates are documented:

```bash
# Extract all placeholders from templates
grep -rh "{{[^}]*}}" config/*.template | \
  grep -o "{{[^}]*}}" | \
  sort -u

# Compare with documented placeholders in docs/api/PLACEHOLDER_REFERENCE.md
```

**Expected placeholders** (from template):
```
{{BUILD_SYSTEM}}
{{LANGUAGE}}
{{LINT_COMMAND}}
{{PROJECT_DESCRIPTION}}
{{PROJECT_KIND}}
{{PROJECT_NAME}}
{{PROJECT_TYPE}}
{{TEST_COMMAND}}
{{TEST_FRAMEWORK}}
{{VERSION}}
```

#### 3. Template Completeness Check

Verify templates include all required sections:

```python
#!/usr/bin/env python3
"""Check template completeness."""

import yaml
import re

def check_template_completeness(template_path: str) -> list:
    """Check if template has all required sections."""
    
    with open(template_path, 'r') as f:
        # Replace placeholders with dummy values
        content = f.read()
        content = re.sub(r'{{[^}]*}}', 'PLACEHOLDER', content)
        template = yaml.safe_load(content)
    
    required_sections = [
        'project',
        'tech_stack',
        'structure',
        'quality',
        'ci_cd',
        'workflow'
    ]
    
    missing = [s for s in required_sections if s not in template]
    return missing

# Usage
missing = check_template_completeness('config/.workflow-config.yaml.template')
if missing:
    print(f"❌ Missing sections: {', '.join(missing)}")
else:
    print("✅ Template is complete")
```

---

## Integration Testing

### Testing Submodule Integration

#### 1. Fresh Integration Test

Test integration in a clean environment:

```bash
#!/bin/bash
# Test fresh integration of ai_workflow_core

set -euo pipefail

TEST_DIR=$(mktemp -d)
echo "Testing in: $TEST_DIR"

cd "$TEST_DIR"

# Step 1: Initialize git repo
git init test_project
cd test_project

# Step 2: Add submodule
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core

# Step 3: Initialize submodule
git submodule update --init --recursive

# Step 4: Verify submodule exists
if [ -f .workflow_core/README.md ]; then
    echo "✅ Submodule added successfully"
else
    echo "❌ Submodule missing"
    exit 1
fi

# Step 5: Copy config
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Step 6: Verify config exists
if [ -f .workflow-config.yaml ]; then
    echo "✅ Config copied successfully"
else
    echo "❌ Config copy failed"
    exit 1
fi

# Cleanup
cd /
rm -rf "$TEST_DIR"

echo "✅ Integration test passed"
```

#### 2. Submodule Update Test

Test updating submodule to a specific version:

```bash
#!/bin/bash
# Test submodule update

cd .workflow_core
git fetch --tags
git checkout v1.0.2  # Or latest version
cd ..

# Verify submodule updated
SUBMODULE_VERSION=$(cd .workflow_core && git describe --tags)
echo "Submodule version: $SUBMODULE_VERSION"

if [ "$SUBMODULE_VERSION" = "v1.0.2" ]; then
    echo "✅ Submodule updated successfully"
else
    echo "❌ Submodule update failed"
    exit 1
fi
```

#### 3. Configuration Customization Test

Test that configuration can be customized correctly:

```bash
#!/bin/bash
# Test configuration customization

# Copy template
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Replace placeholders (simplified example)
sed -i 's/{{PROJECT_NAME}}/Test Project/g' .workflow-config.yaml
sed -i 's/{{PROJECT_TYPE}}/nodejs-application/g' .workflow-config.yaml
sed -i 's/{{PROJECT_KIND}}/nodejs_api/g' .workflow-config.yaml
sed -i 's/{{VERSION}}/1.0.2/g' .workflow-config.yaml
sed -i 's/{{LANGUAGE}}/javascript/g' .workflow-config.yaml

# Validate no placeholders remain
if grep -q "{{.*}}" .workflow-config.yaml; then
    echo "❌ Placeholders still present"
    grep "{{.*}}" .workflow-config.yaml
    exit 1
else
    echo "✅ All placeholders replaced"
fi

# Validate YAML syntax
yamllint -d relaxed .workflow-config.yaml
echo "✅ Configuration is valid YAML"
```

---

## Validation Scripts

### Using Built-in Validation Scripts

ai_workflow_core includes validation scripts in `scripts/`:

#### 1. Documentation Validation

```bash
# Validate documentation context blocks
python3 scripts/validate_context_blocks.py docs/

# Expected output:
# Analyzing: docs/ARCHITECTURE.md
# ✓ Valid context blocks
# Analyzing: docs/INTEGRATION.md
# ✓ Valid context blocks
# ...
# Summary: All documentation files validated
```

#### 2. Structure Validation

```bash
# Validate directory structure
python3 scripts/validate_structure.py

# Expected output:
# ✓ config/ directory exists
# ✓ docs/ directory exists
# ✓ examples/ directory exists
# ✓ scripts/ directory exists
# ✓ workflow-templates/ directory exists
# ✅ Directory structure is valid
```

### Creating Custom Validation Scripts

#### Example: Project Kind Validator

```python
#!/usr/bin/env python3
"""Validate project kind against requirements."""

import yaml
from pathlib import Path

def validate_project_kind(config_path: Path, project_root: Path) -> list:
    """Validate project matches its declared kind."""
    
    errors = []
    
    # Load config
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    
    kind = config.get('project', {}).get('kind')
    
    # Load project kind requirements
    kinds_path = Path('.workflow_core/config/project_kinds.yaml')
    with open(kinds_path, 'r') as f:
        kinds = yaml.safe_load(f)
    
    kind_spec = kinds['project_kinds'].get(kind)
    if not kind_spec:
        return [f"Unknown project kind: {kind}"]
    
    # Validate required files
    required_files = kind_spec.get('validation', {}).get('required_files', [])
    for file_pattern in required_files:
        if not list(project_root.glob(file_pattern)):
            errors.append(f"Missing required file pattern: {file_pattern}")
    
    # Validate required directories
    required_dirs = kind_spec.get('validation', {}).get('required_directories', [])
    for dir_name in required_dirs:
        dir_path = project_root / dir_name
        if not dir_path.exists():
            errors.append(f"Missing required directory: {dir_name}")
    
    return errors

# Usage
errors = validate_project_kind(Path('.workflow-config.yaml'), Path('.'))
if errors:
    print("❌ Project kind validation failed:")
    for error in errors:
        print(f"  • {error}")
else:
    print("✅ Project matches declared kind")
```

---

## CI/CD Testing

### GitHub Actions Workflows

#### 1. Configuration Validation Workflow

Create `.github/workflows/validate-config.yml`:

```yaml
name: Validate Configuration

on:
  push:
    paths:
      - '.workflow-config.yaml'
      - '.workflow_core/**'
  pull_request:
    paths:
      - '.workflow-config.yaml'

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          submodules: recursive
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install yamllint pyyaml
      
      - name: Validate YAML syntax
        run: |
          yamllint -d relaxed .workflow-config.yaml
      
      - name: Check for unreplaced placeholders
        run: |
          if grep -q "{{.*}}" .workflow-config.yaml; then
            echo "❌ Unreplaced placeholders found:"
            grep "{{.*}}" .workflow-config.yaml
            exit 1
          fi
          echo "✅ No placeholders found"
      
      - name: Validate configuration structure
        run: |
          python3 .workflow_core/scripts/validate_config.py
```

#### 2. Integration Test Workflow

Create `.github/workflows/test-integration.yml`:

```yaml
name: Test Integration

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  test-fresh-integration:
    runs-on: ubuntu-latest
    
    steps:
      - name: Create test directory
        run: mkdir -p /tmp/test_project
      
      - name: Initialize git repo
        working-directory: /tmp/test_project
        run: |
          git init
          git config user.name "Test User"
          git config user.email "test@example.com"
      
      - name: Add ai_workflow_core as submodule
        working-directory: /tmp/test_project
        run: |
          git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
          git submodule update --init --recursive
      
      - name: Copy and customize config
        working-directory: /tmp/test_project
        run: |
          cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
          sed -i 's/{{PROJECT_NAME}}/Test Project/g' .workflow-config.yaml
          sed -i 's/{{PROJECT_TYPE}}/nodejs-application/g' .workflow-config.yaml
          sed -i 's/{{PROJECT_KIND}}/nodejs_api/g' .workflow-config.yaml
          sed -i 's/{{VERSION}}/1.0.2/g' .workflow-config.yaml
          sed -i 's/{{LANGUAGE}}/javascript/g' .workflow-config.yaml
          sed -i 's/{{BUILD_SYSTEM}}/npm/g' .workflow-config.yaml
          sed -i 's/{{TEST_FRAMEWORK}}/jest/g' .workflow-config.yaml
          sed -i 's/{{TEST_COMMAND}}/npm test/g' .workflow-config.yaml
          sed -i 's/{{LINT_COMMAND}}/eslint ./g' .workflow-config.yaml
      
      - name: Validate configuration
        working-directory: /tmp/test_project
        run: |
          pip install yamllint
          yamllint -d relaxed .workflow-config.yaml
      
      - name: Verify no placeholders remain
        working-directory: /tmp/test_project
        run: |
          if grep -q "{{.*}}" .workflow-config.yaml; then
            echo "❌ Unreplaced placeholders found"
            exit 1
          fi
          echo "✅ Integration test passed"
```

---

## Common Test Scenarios

### Scenario 1: New Project Setup

**Test**: Verify a new project can be set up correctly.

```bash
#!/bin/bash
# Complete setup test

set -euo pipefail

# 1. Add submodule
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
git submodule update --init --recursive

# 2. Copy configuration
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# 3. Customize configuration
# (Use your own values or script to replace placeholders)

# 4. Create artifact directory
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# 5. Update .gitignore
cat >> .gitignore << 'EOF'

# AI Workflow artifacts
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
EOF

# 6. Validate setup
echo "Testing setup..."

# Check submodule
[ -d .workflow_core ] || { echo "❌ Submodule missing"; exit 1; }

# Check config
[ -f .workflow-config.yaml ] || { echo "❌ Config missing"; exit 1; }

# Check artifact directory
[ -d .ai_workflow ] || { echo "❌ Artifact directory missing"; exit 1; }

# Validate YAML
yamllint -d relaxed .workflow-config.yaml || { echo "❌ Config invalid"; exit 1; }

echo "✅ Setup test passed"
```

### Scenario 2: Version Upgrade

**Test**: Verify submodule can be upgraded safely.

```bash
#!/bin/bash
# Version upgrade test

set -euo pipefail

# 1. Check current version
CURRENT_VERSION=$(cd .workflow_core && git describe --tags)
echo "Current version: $CURRENT_VERSION"

# 2. Fetch latest version
cd .workflow_core
git fetch --tags
LATEST_VERSION=$(git describe --tags $(git rev-list --tags --max-count=1))
echo "Latest version: $LATEST_VERSION"

# 3. Upgrade (if needed)
if [ "$CURRENT_VERSION" != "$LATEST_VERSION" ]; then
    echo "Upgrading to $LATEST_VERSION..."
    git checkout "$LATEST_VERSION"
    cd ..
    
    # 4. Test configuration still valid
    yamllint -d relaxed .workflow-config.yaml
    
    # 5. Commit submodule update
    git add .workflow_core
    git commit -m "chore: upgrade ai_workflow_core to $LATEST_VERSION"
    
    echo "✅ Upgrade successful"
else
    echo "Already on latest version"
fi
```

### Scenario 3: Multi-Language Project

**Test**: Verify configuration works for projects with multiple languages.

```bash
#!/bin/bash
# Multi-language project test

set -euo pipefail

# This project has:
# - Backend: Python (src/backend/)
# - Frontend: TypeScript/React (src/frontend/)
# - CLI: Go (src/cli/)

# Verify project kind supports multi-language
KIND=$(yq eval '.project.kind' .workflow-config.yaml)

if [ "$KIND" != "generic" ]; then
    echo "⚠️  Warning: Multi-language projects should use 'generic' kind"
fi

# Verify each component has test configuration
BACKEND_TEST=$(yq eval '.tech_stack.languages.python.test_command' .workflow-config.yaml)
FRONTEND_TEST=$(yq eval '.tech_stack.languages.typescript.test_command' .workflow-config.yaml)
CLI_TEST=$(yq eval '.tech_stack.languages.go.test_command' .workflow-config.yaml)

echo "Backend test command: $BACKEND_TEST"
echo "Frontend test command: $FRONTEND_TEST"
echo "CLI test command: $CLI_TEST"

[ -n "$BACKEND_TEST" ] || { echo "❌ Backend test command missing"; exit 1; }
[ -n "$FRONTEND_TEST" ] || { echo "❌ Frontend test command missing"; exit 1; }
[ -n "$CLI_TEST" ] || { echo "❌ CLI test command missing"; exit 1; }

echo "✅ Multi-language configuration valid"
```

---

## Troubleshooting Tests

### Common Test Failures

#### 1. YAML Syntax Errors

**Problem**:
```
❌ YAML syntax error: mapping values are not allowed here
```

**Solution**:
- Check indentation (use 2 spaces consistently)
- Verify quotes around string values
- Ensure colons have space after them

```yaml
# ❌ Bad
project:
name:"My Project"  # Missing space after colon

# ✅ Good
project:
  name: "My Project"
```

#### 2. Unreplaced Placeholders

**Problem**:
```
❌ Unreplaced placeholders found: {{PROJECT_NAME}}, {{VERSION}}
```

**Solution**:
- Review all placeholders in template
- Replace each with actual value
- Use find & replace in editor

```bash
# Quick find all placeholders
grep -n "{{.*}}" .workflow-config.yaml
```

#### 3. Submodule Not Initialized

**Problem**:
```
❌ .workflow_core directory is empty
```

**Solution**:
```bash
# Initialize submodule
git submodule update --init --recursive

# If still empty, remove and re-add
git submodule deinit .workflow_core
git rm .workflow_core
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
```

#### 4. Project Kind Validation Fails

**Problem**:
```
❌ Missing required file pattern: *.sh
```

**Solution**:
- Check project kind requirements in `config/project_kinds.yaml`
- Ensure your project has required files
- Or change project kind to match your project structure

```bash
# Check requirements for your project kind
yq eval '.project_kinds.nodejs_api' .workflow_core/config/project_kinds.yaml
```

---

## Testing Checklist

### Before Committing

- [ ] YAML syntax validated with `yamllint`
- [ ] All placeholders replaced
- [ ] Required fields present
- [ ] Project kind matches project structure
- [ ] Artifact directories created
- [ ] `.gitignore` updated
- [ ] Submodule initialized correctly
- [ ] Configuration validated with custom script (if any)

### Before Releasing

- [ ] All integration tests pass
- [ ] Documentation examples tested
- [ ] GitHub Actions workflows validated
- [ ] Version numbers updated
- [ ] CHANGELOG.md updated
- [ ] All links in documentation work
- [ ] Examples build and run successfully

---

## Automated Testing Setup

### Pre-commit Hooks

Create `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: local
    hooks:
      - id: validate-workflow-config
        name: Validate workflow config
        entry: yamllint -d relaxed
        language: system
        files: ^\.workflow-config\.yaml$
      
      - id: check-placeholders
        name: Check for unreplaced placeholders
        entry: bash -c 'grep -q "{{.*}}" .workflow-config.yaml && exit 1 || exit 0'
        language: system
        files: ^\.workflow-config\.yaml$
```

Install pre-commit hooks:
```bash
pip install pre-commit
pre-commit install
```

### Make Target for Testing

Create `Makefile`:

```makefile
.PHONY: test validate validate-config validate-structure validate-docs

test: validate

validate: validate-config validate-structure validate-docs
	@echo "✅ All validations passed"

validate-config:
	@echo "Validating configuration..."
	@yamllint -d relaxed .workflow-config.yaml
	@grep -q "{{.*}}" .workflow-config.yaml && echo "❌ Placeholders found" && exit 1 || echo "✅ Config valid"

validate-structure:
	@echo "Validating structure..."
	@python3 .workflow_core/scripts/validate_structure.py

validate-docs:
	@echo "Validating documentation..."
	@python3 .workflow_core/scripts/validate_context_blocks.py docs/
```

Usage:
```bash
# Run all tests
make test

# Run specific test
make validate-config
```

---

## Next Steps

After setting up testing:

1. ✅ Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
2. ✅ Check [CI_CD_INTEGRATION.md](advanced/CI_CD_INTEGRATION.md) for CI/CD setup
3. ✅ Read [INTEGRATION_BEST_PRACTICES.md](guides/INTEGRATION_BEST_PRACTICES.md)
4. ✅ See [examples/](../examples/) for language-specific testing examples

---

## Related Documentation

- [CONFIG_REFERENCE.md](api/CONFIG_REFERENCE.md) - Configuration field reference
- [PROJECT_KINDS_SCHEMA.md](api/PROJECT_KINDS_SCHEMA.md) - Project kind requirements
- [TROUBLESHOOTING.md](guides/TROUBLESHOOTING.md) - Common problems and solutions
- [CI_CD_INTEGRATION.md](advanced/CI_CD_INTEGRATION.md) - CI/CD testing setup

---

**Last Updated**: 2026-02-07  
**Document Version**: 1.0.2  
**Maintained By**: ai_workflow_core team
