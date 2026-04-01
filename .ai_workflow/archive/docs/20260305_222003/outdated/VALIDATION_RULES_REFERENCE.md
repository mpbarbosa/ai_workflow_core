# Validation Rules Reference

**Version**: 1.0.2  
**Last Updated**: 2026-02-13  
**Schema Version**: project_kinds.yaml v1.2.0

> **Purpose**: Complete reference for validation rules, patterns, and error handling in ai_workflow_core.

## Table of Contents

- [Overview](#overview)
- [Validation Types](#validation-types)
- [File Pattern Syntax](#file-pattern-syntax)
- [Directory Validation](#directory-validation)
- [Configuration Validation](#configuration-validation)
- [Project Kind Validation Rules](#project-kind-validation-rules)
- [Custom Validation](#custom-validation)
- [Error Messages](#error-messages)
- [Validation Scripts](#validation-scripts)
- [Best Practices](#best-practices)

---

## Overview

### What is Validated

ai_workflow_core validates:

1. **Project Structure**: Required files and directories
2. **Configuration Syntax**: YAML validity, schema compliance
3. **File Patterns**: Correct file types for project kind
4. **Documentation**: Context blocks, structure, links
5. **Integration Health**: Submodule setup, placeholder replacement
6. **Template Integrity**: Template files are valid

### Validation Layers

```
┌─────────────────────────────────────┐
│ Layer 1: Syntax Validation          │  YAML/JSON syntax
├─────────────────────────────────────┤
│ Layer 2: Schema Validation          │  Required fields, types
├─────────────────────────────────────┤
│ Layer 3: Structure Validation       │  Files, directories
├─────────────────────────────────────┤
│ Layer 4: Content Validation         │  Patterns, references
├─────────────────────────────────────┤
│ Layer 5: Integration Validation     │  Cross-file consistency
└─────────────────────────────────────┘
```

---

## Validation Types

### 1. Structural Validation

**Purpose**: Ensure correct directory structure and file presence

**Rules**:
- Required directories must exist
- Required files must be present
- Optional files validated if present
- Unknown directories flagged as warnings

**Example from `project_kinds.yaml`**:

```yaml
shell_script_automation:
  validation:
    required_files:
      - "*.sh"                    # At least one shell script
    required_directories:
      - "src"                     # Must have src/ directory
    optional_files:
      - "README.md"               # Validated if present
      - ".gitignore"
    file_patterns:
      - "*.sh"                    # Expected patterns
      - "*.bash"
```

### 2. Pattern Validation

**Purpose**: Validate file naming conventions and content patterns

**Supported Patterns**:

| Pattern | Matches | Example |
|---------|---------|---------|
| `*.sh` | Files ending in .sh | `script.sh`, `deploy.sh` |
| `test_*.sh` | Files starting with test_ | `test_utils.sh` |
| `*.test.js` | Files with .test.js extension | `api.test.js` |
| `**/*.py` | Python files recursively | `src/main.py` |
| `src/**/*.ts` | TypeScript in src/ | `src/app/main.ts` |

**Regex Patterns**:

Some validations use regular expressions:

```python
# Example: Validate shell script shebang
SHEBANG_PATTERN = r'^#!(/usr/bin/env bash|/bin/bash|/bin/sh)'

# Example: Validate Node.js test files
TEST_FILE_PATTERN = r'^.*\.(test|spec)\.(js|ts)$'

# Example: Validate Python module naming
MODULE_PATTERN = r'^[a-z_][a-z0-9_]*\.py$'
```

### 3. Content Validation

**Purpose**: Validate file contents meet standards

**Examples**:

**Shell scripts**:
```bash
# Required: Proper shebang
#!/bin/bash

# Required: Set error handling (for strict projects)
set -euo pipefail

# Recommended: Script header
# Script: script_name.sh
# Purpose: Brief description
# Author: Name
# Version: X.Y.Z
```

**Python files**:
```python
# Required: Module docstring
"""Module description.

Detailed explanation of module purpose.
"""

# Recommended: Type hints (for modern Python)
def function(param: str) -> int:
    """Function docstring."""
    pass
```

**Configuration files**:
```yaml
# Required: Valid YAML syntax
# Required: No duplicate keys
# Required: Proper indentation (2 spaces)
# Recommended: Comments for complex sections
```

### 4. Dependency Validation

**Purpose**: Ensure dependencies are properly declared and up-to-date

**Checks**:
- Package files exist (`package.json`, `requirements.txt`, etc.)
- Lock files present (`package-lock.json`, `Pipfile.lock`, etc.)
- No security vulnerabilities (if security scanning enabled)
- Version constraints are reasonable

**Example from `project_kinds.yaml`**:

```yaml
nodejs_api:
  dependencies:
    package_files:
      - "package.json"
    lock_files:
      - "package-lock.json"
      - "yarn.lock"              # Alternative
    validation_required: true
    security_audit_command: "npm audit"
```

### 5. Testing Validation

**Purpose**: Ensure test infrastructure is present and configured

**Checks**:
- Test directory exists
- Test files follow naming convention
- Test framework is configured
- Coverage thresholds are met (if required)

**Example**:

```yaml
nodejs_api:
  testing:
    test_framework: "jest"
    test_directory: "tests"
    test_file_pattern: "*.test.js|*.spec.js|*.test.ts|*.spec.ts"
    test_command: "npm test"
    coverage_required: true
    coverage_threshold: 80
```

---

## File Pattern Syntax

### Glob Patterns

Standard glob patterns used throughout:

```bash
# Wildcard - matches any characters in filename
*.sh                    # Matches: script.sh, deploy.sh
                       # Does NOT match: src/script.sh

# Recursive wildcard - matches any path
**/*.sh                # Matches: script.sh, src/script.sh, src/utils/helper.sh

# Single character wildcard
test?.sh               # Matches: test1.sh, testA.sh
                       # Does NOT match: test10.sh

# Character class
test[0-9].sh           # Matches: test0.sh through test9.sh

# Alternation (pipe in YAML)
"*.test.js|*.spec.js"  # Matches: api.test.js OR api.spec.js
```

### Pattern Matching in Project Kinds

Each project kind defines patterns for:

1. **Source files**: Main codebase patterns
2. **Test files**: Test file naming patterns
3. **Linter targets**: Files to lint
4. **Build artifacts**: Generated files

**Example - shell_script_automation**:

```yaml
file_patterns:
  - "*.sh"              # Source: Shell scripts
  - "*.bash"            # Source: Bash scripts

test_file_pattern: "test_*.sh"  # Tests: test_utils.sh, test_api.sh

linters:
  - name: "shellcheck"
    file_pattern: "*.sh"  # Lint all shell scripts
```

**Example - nodejs_api**:

```yaml
file_patterns:
  - "*.js"              # Source: JavaScript files
  - "*.ts"              # Source: TypeScript files
  - "*.json"            # Config: JSON files

test_file_pattern: "*.test.js|*.spec.js|*.test.ts|*.spec.ts"

linters:
  - name: "eslint"
    file_pattern: "*.js|*.ts"  # Lint JS/TS files
```

### Regex vs. Glob

**Use glob patterns when**:
- Simple file matching
- Standard wildcards sufficient
- Cross-platform compatibility needed

**Use regex patterns when**:
- Complex content validation
- Precise string matching needed
- Validating file contents

```python
# Glob pattern (for file discovery)
glob_pattern = "**/*.test.js"

# Regex pattern (for content validation)
regex_pattern = r'^describe\([\'"].*[\'"]\s*,\s*\(\)\s*=>\s*\{'
```

---

## Directory Validation

### Required Directories

Defined per project kind in `project_kinds.yaml`:

```yaml
# Minimal directory structure
shell_script_automation:
  validation:
    required_directories:
      - "src"           # Source code

# More complex structure
nodejs_api:
  validation:
    required_directories:
      - "src"           # Source code
      - "tests"         # Test files
      - "config"        # Configuration
```

### Standard Directory Structure

Expected structure for different project types:

#### Shell Script Automation

```
project/
├── src/              # Required: Source scripts
├── tests/            # Recommended: Test scripts
├── docs/             # Recommended: Documentation
├── config/           # Optional: Configuration files
└── bin/              # Optional: Executable wrappers
```

#### Node.js API

```
project/
├── src/              # Required: Source code
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── tests/            # Required: Tests
├── config/           # Required: Configuration
├── docs/             # Recommended: Documentation
└── scripts/          # Optional: Utility scripts
```

#### Python Application

```
project/
├── src/              # Required: Source code
│   └── package_name/
│       ├── __init__.py
│       └── main.py
├── tests/            # Required: Tests
├── docs/             # Recommended: Documentation
└── scripts/          # Optional: Utility scripts
```

#### Configuration Library (ai_workflow_core itself)

```
project/
├── config/           # Required: Configuration templates
├── docs/             # Required: Documentation
├── examples/         # Required: Integration examples
├── scripts/          # Required: Utility scripts
└── workflow-templates/  # Required: GitHub workflows
```

### Directory Validation Rules

**From `scripts/validate_structure.py`**:

```python
REQUIRED_DIRS = [
    'config',
    'docs',
    'examples',
    'scripts',
    'workflow-templates',
    '.github',
]

# Allowed to be empty
ALLOWED_EMPTY_DIRS = {
    '.ai_workflow',
    '.ai_workflow/backlog',
    '.ai_workflow/summaries',
    '.ai_workflow/logs',
    '.ai_workflow/metrics',
    '.ai_workflow/checkpoints',
    '.ai_workflow/prompts',
    '.ai_workflow/ml_models',
    '.ai_workflow/.incremental_cache',
}

# Must NOT be empty
MUST_HAVE_CONTENT = {
    'config',              # Must have config files
    'docs',                # Must have documentation
    'examples',            # Must have examples
    'scripts',             # Must have scripts
}
```

---

## Configuration Validation

### Schema Validation

**`.workflow-config.yaml` schema**:

```yaml
# Required top-level keys
project:              # ✅ Required
  name:               # ✅ Required (string)
  type:               # ✅ Required (string, hyphenated)
  kind:               # ✅ Required (string, underscored, must be valid project_kind)
  version:            # ✅ Required (semver, no 'v' prefix)
  description:        # ⚠️  Optional but recommended

tech_stack:           # ✅ Required
  primary_language:   # ✅ Required (string)
  build_system:       # ✅ Required (string, can be "none")
  test_framework:     # ✅ Required (string)
  test_command:       # ✅ Required (string)
  lint_command:       # ⚠️  Optional but recommended

structure:            # ✅ Required
  source_dirs:        # ✅ Required (array)
  test_dirs:          # ✅ Required (array)
  docs_dirs:          # ⚠️  Optional
```

### Validation Rules by Field

#### `project.kind`

**Must be one of**:
- `shell_script_automation`
- `nodejs_api`
- `client_spa`
- `react_spa`
- `static_website`
- `python_app`
- `configuration_library`
- `generic`

**Validation**:
```python
VALID_PROJECT_KINDS = [
    'shell_script_automation',
    'nodejs_api',
    'client_spa',
    'react_spa',
    'static_website',
    'python_app',
    'configuration_library',
    'generic',
]

if config['project']['kind'] not in VALID_PROJECT_KINDS:
    raise ValidationError(f"Invalid project_kind: {config['project']['kind']}")
```

#### `project.version`

**Format**: Semantic versioning without 'v' prefix

**Valid**:
- `1.0.2`
- `2.1.3`
- `0.9.0-beta.1`

**Invalid**:
- `v1.0.2` ❌ (has 'v' prefix)
- `1.0` ❌ (incomplete semver)
- `1.0.2.0` ❌ (too many parts)

**Validation regex**:
```python
VERSION_PATTERN = r'^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$'

if not re.match(VERSION_PATTERN, version):
    raise ValidationError(f"Invalid version format: {version}")
```

#### `tech_stack.primary_language`

**Common values**:
- `javascript`, `typescript`, `bash`, `python`, `go`, `rust`, `java`, `yaml`

**Validation**:
```python
# No strict validation - informational field
# But should match actual codebase
```

#### `tech_stack.build_system`

**Valid values depend on language**:

| Language | Valid Build Systems |
|----------|---------------------|
| JavaScript/Node.js | `npm`, `yarn`, `pnpm`, `webpack`, `vite`, `none` |
| Python | `pip`, `poetry`, `pipenv`, `setuptools`, `none` |
| Bash/Shell | `none` |
| Go | `go`, `make`, `none` |
| Rust | `cargo`, `none` |

#### `tech_stack.test_framework`

**Must match project_kind expectations**:

```yaml
# For nodejs_api - must be one of:
test_framework: "jest"      # ✅
test_framework: "mocha"     # ✅
test_framework: "vitest"    # ✅
test_framework: "ava"       # ✅
test_framework: "custom"    # ❌ (not in approved list)

# For python_app - must be one of:
test_framework: "pytest"    # ✅
test_framework: "unittest"  # ✅
test_framework: "nose2"     # ✅
```

### Placeholder Validation

**In template files** (`.template` extension):

**Valid placeholders**:
```yaml
name: "{{PROJECT_NAME}}"              # ✅ Correct format
type: "{{PROJECT_TYPE}}"              # ✅ Correct format
version: "{{VERSION}}"                # ✅ Correct format
```

**Invalid placeholders**:
```yaml
name: "{PROJECT_NAME}"                # ❌ Single braces
name: "{{ PROJECT_NAME }}"            # ❌ Spaces inside braces
name: "<<PROJECT_NAME>>"              # ❌ Wrong delimiters
```

**Validation pattern**:
```python
PLACEHOLDER_PATTERN = r'\{\{[A-Z_]+\}\}'

# Find all placeholders
placeholders = re.findall(PLACEHOLDER_PATTERN, content)

# Validate against known placeholders
KNOWN_PLACEHOLDERS = [
    'PROJECT_NAME',
    'PROJECT_TYPE',
    'PROJECT_KIND',
    'VERSION',
    'LANGUAGE',
    'BUILD_SYSTEM',
    'TEST_FRAMEWORK',
    'TEST_COMMAND',
    'LINT_COMMAND',
]

for placeholder in placeholders:
    if placeholder not in KNOWN_PLACEHOLDERS:
        warnings.append(f"Unknown placeholder: {placeholder}")
```

---

## Project Kind Validation Rules

### Complete Rules by Project Kind

#### 1. shell_script_automation

```yaml
Required files: ["*.sh"]
Required directories: ["src"]
File patterns: ["*.sh", "*.bash"]
Test pattern: "test_*.sh"

Linters:
  - shellcheck: "*.sh"
  - shfmt: "*.sh" (optional)

Testing:
  - Framework: bash_unit or BATS
  - Coverage: Not required

Style:
  - Google Shell Style Guide
  - Quote all variables
  - Use [[ ]] for conditionals
```

**Validation errors**:

```
❌ No shell scripts found
❌ Missing src/ directory
❌ Shell script missing shebang: src/deploy.sh
⚠️  No tests found (recommended: test_*.sh)
⚠️  shellcheck not configured
```

#### 2. nodejs_api

```yaml
Required files: ["package.json"]
Required directories: ["src", "tests"]
File patterns: ["*.js", "*.ts", "*.json"]
Test pattern: "*.test.js|*.spec.js|*.test.ts|*.spec.ts"

Linters:
  - eslint: "*.js|*.ts"
  - prettier: "*.js|*.ts|*.json"

Testing:
  - Framework: jest, mocha, or vitest
  - Coverage: 80% required

Dependencies:
  - package.json must exist
  - package-lock.json or yarn.lock required
  - npm audit for security
```

**Validation errors**:

```
❌ Missing package.json
❌ Missing src/ directory
❌ Missing tests/ directory
❌ No test files matching *.test.js or *.spec.js
❌ Test coverage below 80% (current: 65%)
⚠️  No lock file found (package-lock.json or yarn.lock)
⚠️  eslint not configured in package.json
```

#### 3. client_spa (Vanilla JS)

```yaml
Required files: ["index.html", "package.json"]
Required directories: ["src", "public"]
File patterns: ["*.html", "*.css", "*.js"]
Test pattern: "*.test.js|*.spec.js"

Linters:
  - htmlhint: "*.html"
  - stylelint: "*.css"
  - eslint: "*.js"

Testing:
  - Framework: jest or playwright
  - DOM testing required

Build:
  - Build required: true
  - Bundle for production
```

**Validation errors**:

```
❌ Missing index.html
❌ Missing src/ directory
❌ No HTML files found
⚠️  No CSS linter configured
⚠️  Build script not defined in package.json
```

#### 4. react_spa

```yaml
Required files: ["package.json", "src/App.jsx or src/App.tsx"]
Required directories: ["src", "public"]
File patterns: ["*.jsx", "*.tsx", "*.js", "*.ts"]
Test pattern: "*.test.js|*.test.tsx|*.spec.js|*.spec.tsx"

Linters:
  - eslint: "*.jsx|*.tsx|*.js|*.ts"
  - prettier: "*.jsx|*.tsx"

Testing:
  - Framework: jest with React Testing Library
  - Component testing required
  - Coverage: 70% recommended

Build:
  - Build required: true
  - Webpack, Vite, or create-react-app
```

**Validation errors**:

```
❌ Missing src/App.jsx or src/App.tsx
❌ React not found in dependencies
❌ No React test files (*.test.jsx, *.test.tsx)
⚠️  React Testing Library not installed
⚠️  No build script in package.json
```

#### 5. static_website

```yaml
Required files: ["index.html"]
Required directories: ["assets" or "public"]
File patterns: ["*.html", "*.css", "*.js"]

Linters:
  - htmlhint: "*.html"
  - stylelint: "*.css"
  - eslint: "*.js" (optional)

Testing:
  - Link validation
  - HTML validation
  - Accessibility checks (WCAG AA)

Build:
  - Build not required (or static site generator)
```

**Validation errors**:

```
❌ Missing index.html
❌ No assets/ or public/ directory
⚠️  Broken links detected: about.html -> contact.html
⚠️  Accessibility issues: Missing alt text on images
⚠️  HTML validation errors: Unclosed <div> tag
```

#### 6. python_app

```yaml
Required files: ["src/**/*.py", "requirements.txt or setup.py"]
Required directories: ["src", "tests"]
File patterns: ["*.py"]
Test pattern: "test_*.py|*_test.py"

Linters:
  - pylint: "*.py"
  - black: "*.py"
  - mypy: "*.py"

Testing:
  - Framework: pytest or unittest
  - Coverage: 80% recommended

Dependencies:
  - requirements.txt or Pipfile
  - Virtual environment recommended
```

**Validation errors**:

```
❌ No Python files found in src/
❌ Missing requirements.txt or setup.py
❌ Missing tests/ directory
❌ No __init__.py in src/ (not a package)
❌ Test coverage below 80%
⚠️  Type hints missing (mypy warnings)
⚠️  Docstrings missing (pylint warnings)
```

#### 7. configuration_library

```yaml
Required files: ["config/*.yaml", "README.md"]
Required directories: ["config", "docs", "examples"]
File patterns: ["*.yaml", "*.yml", "*.md"]
Test pattern: "validate_*.py|test_*.sh"

Linters:
  - yamllint: "*.yaml|*.yml"
  - markdownlint: "*.md"

Testing:
  - Validation scripts
  - Integration tests
  - Documentation validation

Build:
  - Build not required
  - Deployed as Git submodule
```

**Validation errors**:

```
❌ No configuration files in config/
❌ Missing examples/ directory
❌ No documentation in docs/
⚠️  YAML syntax errors in config/project_kinds.yaml
⚠️  Broken links in documentation
⚠️  No integration examples provided
```

#### 8. generic

```yaml
Required files: []
Required directories: []
File patterns: ["*"]
Test pattern: "test_*|*_test.*|*.test.*|*.spec.*"

Minimal validation:
  - README.md recommended
  - Basic documentation
  - Some tests recommended

Flexibility:
  - No strict structure requirements
  - Adapt to project needs
```

**Validation errors**:

```
⚠️  No README.md found
⚠️  No tests found
ℹ️  Generic project type - minimal validation applied
```

---

## Custom Validation

### Creating Custom Validators

Projects can add custom validation scripts:

**Example**: `scripts/validate_custom.py`

```python
#!/usr/bin/env python3
"""Custom validation for project-specific rules."""

import sys
from pathlib import Path

def validate_api_endpoints():
    """Ensure all API endpoints are documented."""
    api_files = Path('src/routes').glob('*.js')
    docs_files = Path('docs/api').glob('*.md')
    
    documented_endpoints = set()
    for doc in docs_files:
        # Parse documented endpoints
        pass
    
    implemented_endpoints = set()
    for api_file in api_files:
        # Parse implemented endpoints
        pass
    
    undocumented = implemented_endpoints - documented_endpoints
    if undocumented:
        print(f"❌ Undocumented endpoints: {undocumented}")
        return False
    
    return True

def validate_database_migrations():
    """Ensure migration files follow naming convention."""
    migrations = Path('migrations').glob('*.sql')
    pattern = r'^\d{4}_\d{2}_\d{2}_[a-z_]+\.sql$'
    
    for migration in migrations:
        if not re.match(pattern, migration.name):
            print(f"❌ Invalid migration filename: {migration.name}")
            print(f"   Expected format: YYYY_MM_DD_description.sql")
            return False
    
    return True

if __name__ == '__main__':
    checks = [
        validate_api_endpoints,
        validate_database_migrations,
    ]
    
    all_passed = all(check() for check in checks)
    sys.exit(0 if all_passed else 1)
```

### Integration with CI/CD

**GitHub Actions example**:

```yaml
# .github/workflows/validation.yml
name: Custom Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Run standard validation
        run: |
          python3 .workflow_core/scripts/validate_structure.py
          python3 .workflow_core/scripts/validate_context_blocks.py docs/
      
      - name: Run custom validation
        run: python3 scripts/validate_custom.py
```

---

## Error Messages

### Standard Error Codes

| Code | Type | Description |
|------|------|-------------|
| `VAL001` | Error | Missing required file |
| `VAL002` | Error | Missing required directory |
| `VAL003` | Error | Invalid file pattern |
| `VAL004` | Error | Configuration syntax error |
| `VAL005` | Error | Invalid project_kind |
| `VAL006` | Warning | Missing recommended file |
| `VAL007` | Warning | Deprecated configuration |
| `VAL008` | Warning | Undocumented directory |
| `VAL009` | Info | Structure suggestion |

### Error Message Format

```
[CODE] LEVEL: Short description
  File: path/to/file
  Line: 42
  Details: Longer explanation
  Suggestion: How to fix
```

**Examples**:

```
[VAL001] ERROR: Missing required file
  File: package.json
  Details: Node.js projects must have package.json
  Suggestion: Run 'npm init' to create package.json

[VAL005] ERROR: Invalid project_kind
  File: .workflow-config.yaml
  Line: 5
  Details: project_kind must be one of: shell_script_automation, nodejs_api, ...
  Current value: "node-api"
  Suggestion: Change to "nodejs_api"

[VAL006] WARNING: Missing recommended file
  File: README.md
  Details: Projects should include README.md
  Suggestion: Create README.md with project overview

[VAL008] WARNING: Undocumented directory
  Directory: lib/
  Details: Directory 'lib/' not in documented structure
  Suggestion: Document in copilot-instructions.md or remove if unused
```

### Common Validation Errors

#### Configuration Errors

```
❌ YAML syntax error: .workflow-config.yaml:12
   mapping values are not allowed here

❌ Invalid project_kind: "nodejs-app"
   Must use underscores: "nodejs_api"

❌ Invalid version format: "v1.0.2"
   Remove 'v' prefix: "1.0.2"

❌ Required field missing: tech_stack.test_command
```

#### Structure Errors

```
❌ Required directory missing: src/
❌ Required directory missing: tests/
❌ No shell scripts found (*.sh)
❌ Empty directory not allowed: src/
```

#### Pattern Errors

```
❌ Test files must match pattern: test_*.sh
   Found: tests/utils.sh
   Expected: tests/test_utils.sh

❌ Invalid file in src/: README.md
   Only *.sh files allowed

❌ Linter target pattern mismatch
   Pattern: *.js
   No matching files found
```

---

## Validation Scripts

### 1. Structure Validator

**Script**: `scripts/validate_structure.py`

**Purpose**: Validate directory structure

**Usage**:
```bash
# Check structure
python3 scripts/validate_structure.py

# Fix issues automatically
python3 scripts/validate_structure.py --fix

# Quiet mode
python3 scripts/validate_structure.py --quiet
```

**What it validates**:
- Required directories present
- No empty directories (except allowed)
- No unknown directories
- Structure matches documentation

### 2. Context Block Validator

**Script**: `scripts/validate_context_blocks.py`

**Purpose**: Validate documentation context blocks

**Usage**:
```bash
# Validate docs directory
python3 scripts/validate_context_blocks.py docs/

# Validate specific file
python3 scripts/validate_context_blocks.py docs/ARCHITECTURE.md

# Verbose mode
python3 scripts/validate_context_blocks.py -v docs/
```

**What it validates**:
- Context block format
- Required blocks present
- Cross-references valid
- Link integrity

### 3. Integration Health Check

**Script**: `scripts/check_integration_health.sh.template`

**Purpose**: Validate complete integration

**Usage**:
```bash
# After copying from template
cp .workflow_core/scripts/check_integration_health.sh.template \
   scripts/check_integration_health.sh

# Replace placeholders
# {{PROJECT_ROOT}} -> "."
# {{WORKFLOW_CORE_DIR}} -> ".workflow_core"

# Run health check
bash scripts/check_integration_health.sh
```

**What it validates**:
- Submodule initialized
- Configuration valid
- Placeholders replaced
- Directories created
- Tests can run

### 4. CI/CD Validation Workflows

**Workflow**: `workflow-templates/workflows/validate-structure.yml`

**Triggers**:
- On push
- On pull request
- Manual dispatch

**Steps**:
1. Checkout with submodules
2. Run structure validation
3. Run documentation validation
4. Check for empty directories
5. Report results

---

## Best Practices

### 1. Validate Early

✅ **Run validation before committing**:

```bash
# Pre-commit hook (.git/hooks/pre-commit)
#!/bin/bash
python3 .workflow_core/scripts/validate_structure.py || exit 1
python3 .workflow_core/scripts/validate_context_blocks.py docs/ || exit 1
```

### 2. Use CI/CD Validation

✅ **GitHub Actions validation**:

```yaml
# Required checks
- Validate structure
- Validate configuration
- Validate documentation
- Run tests
```

### 3. Document Custom Rules

✅ **Document project-specific validation in README**:

```markdown
## Validation

This project extends standard validation with:

- API endpoint documentation checks
- Database migration naming validation
- Code coverage > 90%
- All public functions must have docstrings
```

### 4. Graceful Degradation

✅ **Warnings vs. Errors**:

- **Errors**: Block merge, require fix
- **Warnings**: Can merge, should fix soon
- **Info**: Suggestions, optional improvements

### 5. Regular Audits

✅ **Schedule validation audits**:

```bash
# Weekly validation check
0 0 * * 1 cd /path/to/project && python3 .workflow_core/scripts/validate_structure.py --fix
```

---

## Next Steps

- **[CONFIG_REFERENCE.md](CONFIG_REFERENCE.md)**: Configuration field reference
- **[PROJECT_KINDS_SCHEMA.md](PROJECT_KINDS_SCHEMA.md)**: Project kind definitions
- **[SCRIPT_API_REFERENCE.md](SCRIPT_API_REFERENCE.md)**: Validation script API
- **[TESTING.md](../TESTING.md)**: Testing guide
- **[TROUBLESHOOTING.md](../guides/TROUBLESHOOTING.md)**: Issue resolution

---

**Last Updated**: 2026-02-13  
**Document Version**: 1.0.2  
**Maintained By**: ai_workflow_core team
