# Script API Reference

**Scripts Directory**: [`scripts/`](../../scripts/)  
**Last Updated**: 2026-02-09

## Table of Contents

- [Overview](#overview)
- [Validation Scripts](#validation-scripts)
  - [validate_context_blocks.py](#validate_context_blockspy)
  - [validate_structure.py](#validate_structurepy)
- [Health Check Scripts](#health-check-scripts)
  - [check_integration_health.sh](#check_integration_healthsh)
- [Cleanup Scripts](#cleanup-scripts)
  - [cleanup_artifacts.sh](#cleanup_artifactssh)
- [Common Patterns](#common-patterns)
- [Exit Codes](#exit-codes)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## Overview

The `scripts/` directory contains utility scripts for validation, health checks, and maintenance. All scripts follow consistent patterns for exit codes, error handling, and output formatting.

**Script Categories:**
1. **Validation** - Verify configuration and structure compliance
2. **Health Checks** - Detect integration issues and drift
3. **Cleanup** - Manage workflow artifacts and cache

**Design Principles:**
- **Exit codes** - Consistent 0 (success), 1 (failure), 2 (error)
- **Color output** - Clear visual feedback for pass/fail/warning
- **Automation-friendly** - Support for `--quiet`, `--fix`, CI/CD integration
- **Template-based** - `.template` files for projects to customize

---

## Validation Scripts

### validate_context_blocks.py

**Purpose**: Validates standardized context block structure in AI helper prompts

**File**: `scripts/validate_context_blocks.py`  
**Language**: Python 3.6+  
**Dependencies**: `yaml` (standard library)

#### Usage

```bash
# Validate default file (.workflow_core/config/ai_helpers.yaml)
python3 scripts/validate_context_blocks.py

# Validate specific file
python3 scripts/validate_context_blocks.py config/ai_helpers.yaml

# Validate file from different directory
python3 scripts/validate_context_blocks.py /path/to/ai_helpers.yaml
```

#### What It Validates

1. **Context Block Presence**
   - Every step prompt has `**Context:**` block
   - Block is properly formatted with markdown

2. **Standard Parameters**
   - Required fields: `project_name`, `project_description`, `primary_language`, `change_scope`, `modified_count`
   - Parameters use `{parameter_name}` syntax

3. **Naming Convention**
   - Parameters use `snake_case` (not `TitleCase`, `kebab-case`)
   - No spaces or hyphens in parameter names

4. **Format Consistency**
   - Context block uses bullet list format (`- Parameter: {value}`)
   - Proper indentation and spacing

5. **Parameter Ordering**
   - Consistent parameter order across all prompts

#### Validated Prompts

| Prompt Name | Step | Description |
|------------|------|-------------|
| `step2_consistency_prompt` | Step 2 | Documentation consistency |
| `step3_script_refs_prompt` | Step 3 | Script references |
| `step4_directory_prompt` | Step 4 | Directory structure |
| `step5_test_review_prompt` | Step 5 | Test review |
| `step8_dependencies_prompt` | Step 8 | Dependencies |
| `step9_code_quality_prompt` | Step 9 | Code quality |

#### Output Examples

**Success:**
```
Validating Context Block Structure...
===============================================================================

✅ ALL VALIDATIONS PASSED

All step prompts have:
  • **Context:** block present
  • Standard parameters: project_name, project_description, primary_language, change_scope, modified_count
  • snake_case naming convention
  • Consistent bullet list format
```

**Failure:**
```
Validating Context Block Structure...
===============================================================================

❌ VALIDATION FAILURES FOUND

  • Step 2: Missing **Context:** block
  • Step 3: Missing parameters: change_scope, modified_count
  • Step 5: Non-snake_case parameters: ProjectName, Primary-Language
  • Step 9: Non-bullet lines in context: 2
```

#### Exit Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `0` | Success | All validations passed |
| `1` | Failure | One or more validation failures |
| `2` | Error | File not found or invalid YAML |

#### Integration

**Pre-commit Hook:**
```yaml
# .pre-commit-config.yaml
- repo: local
  hooks:
    - id: validate-context-blocks
      name: Validate AI Context Blocks
      entry: python3 scripts/validate_context_blocks.py
      language: system
      files: ^config/ai_helpers\.yaml$
```

**GitHub Actions:**
```yaml
# .github/workflows/validate-docs.yml
- name: Validate Context Blocks
  run: python3 scripts/validate_context_blocks.py config/ai_helpers.yaml
```

**Makefile:**
```makefile
.PHONY: validate-context
validate-context:
	python3 scripts/validate_context_blocks.py config/ai_helpers.yaml
```

#### Customization

To validate additional prompts, modify the script:

```python
# Add to step_prompts dictionary
step_prompts = {
    'step2_consistency_prompt': 'Step 2',
    'step3_script_refs_prompt': 'Step 3',
    # ... existing prompts ...
    'my_custom_prompt': 'Custom Step',  # Add your prompt
}

# Add custom standard parameters
standard_params = [
    'project_name',
    'project_description',
    'primary_language',
    'change_scope',
    'modified_count',
    'my_custom_param',  # Add your parameter
]
```

---

### validate_structure.py

**Purpose**: Validates repository directory structure and detects empty/undocumented directories

**File**: `scripts/validate_structure.py`  
**Language**: Python 3.6+  
**Dependencies**: None (uses only standard library)

#### Usage

```bash
# Validate structure (report only)
python3 scripts/validate_structure.py

# Auto-fix: Remove empty directories
python3 scripts/validate_structure.py --fix

# Quiet mode (for CI)
python3 scripts/validate_structure.py --quiet

# Combine options
python3 scripts/validate_structure.py --fix --quiet
```

#### What It Validates

1. **Required Directories Present**
   - Checks for: `config/`, `docs/`, `examples/`, `scripts/`, `workflow-templates/`, `.github/`
   - Reports missing directories

2. **Empty Directories Detection**
   - Finds directories with no files (subdirectories allowed)
   - Excludes allowed empty directories (`.ai_workflow/` subdirectories)
   - Reports unexpected empty directories

3. **Undocumented Directories**
   - Compares against known structure from `copilot-instructions.md`
   - Reports directories not in documented structure
   - Helps prevent structure drift

4. **Structure Consistency**
   - Validates documented structure matches actual repository
   - Ensures documentation stays synchronized with code

#### Configuration

**Required Directories:**
```python
REQUIRED_DIRS = [
    'config',
    'docs',
    'examples',
    'scripts',
    'workflow-templates',
    '.github',
]
```

**Known Structure:**
```python
KNOWN_STRUCTURE = {
    '.github',
    '.ai_workflow',
    'config',
    'docs',
    'docs/api',
    'docs/guides',
    'docs/advanced',
    'docs/developers',
    'docs/diagrams',
    'docs/misc',
    'examples',
    'examples/shell',
    'examples/nodejs',
    'scripts',
    'workflow-templates',
    'workflow-templates/workflows',
}
```

**Allowed Empty Directories:**
```python
ALLOWED_EMPTY_DIRS = {
    '.ai_workflow',                     # May be empty initially
    '.ai_workflow/backlog',
    '.ai_workflow/summaries',
    '.ai_workflow/logs',
    '.ai_workflow/metrics',
    '.ai_workflow/checkpoints',
    '.ai_workflow/prompts',
    '.ai_workflow/ml_models',
    '.ai_workflow/.incremental_cache',
    'docs/misc',                        # May have tracking files only
}
```

**Excluded Directories:**
```python
EXCLUDED_DIRS = {
    '.git',
    'node_modules',
    '__pycache__',
    '.venv',
    'venv',
    '.pytest_cache',
    '.mypy_cache',
}
```

#### Output Examples

**Success (All Valid):**
```
=======================================================================
Validating ai_workflow_core Directory Structure
=======================================================================

Checking required directories...
✅ All required directories present

Checking for empty directories...
✅ No unexpected empty directories

Checking for undocumented directories...
✅ All directories documented in known structure

=======================================================================
VALIDATION SUMMARY
=======================================================================

✅ Structure is VALID

All checks passed:
  • Required directories present: 6/6
  • No unexpected empty directories
  • All directories documented

Repository structure is consistent and well-maintained.
```

**Failure (Issues Found):**
```
=======================================================================
Validating ai_workflow_core Directory Structure
=======================================================================

Checking required directories...
✅ All required directories present

Checking for empty directories...
⚠️  Found 2 unexpected empty directories

Checking for undocumented directories...
⚠️  Found 1 undocumented directories

=======================================================================
VALIDATION SUMMARY
=======================================================================

❌ Structure has ISSUES

Issues found:
  • Empty directory: docs/reference/
  • Empty directory: docs/reports/
  • Undocumented directory: temp/

=======================================================================
RECOMMENDATIONS
=======================================================================

To fix empty directories automatically:
  python3 scripts/validate_structure.py --fix

For undocumented directories:
  1. Add to KNOWN_STRUCTURE in validate_structure.py, OR
  2. Document in .github/copilot-instructions.md, OR
  3. Remove if not needed
```

**Auto-fix Mode:**
```
=======================================================================
Validating ai_workflow_core Directory Structure
=======================================================================

Checking required directories...
✅ All required directories present

Checking for empty directories...
⚠️  Found 2 unexpected empty directories

Auto-fix mode enabled: Removing empty directories...
🔧 Removed: docs/reference/
🔧 Removed: docs/reports/

Checking for undocumented directories...
⚠️  Found 1 undocumented directories

=======================================================================
VALIDATION SUMMARY
=======================================================================

⚠️  Structure has ISSUES (some auto-fixed)

Auto-fixed:
  • Removed 2 empty directories

Remaining issues:
  • Undocumented directory: temp/

Manual action needed for undocumented directories.
```

#### Exit Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `0` | Success | Structure is valid |
| `1` | Failure | Validation errors found |
| `2` | Error | Script error (permissions, etc.) |

#### Integration

**Pre-commit Hook:**
```yaml
# .pre-commit-config.yaml
- repo: local
  hooks:
    - id: validate-structure
      name: Validate Directory Structure
      entry: python3 scripts/validate_structure.py
      language: system
      pass_filenames: false
```

**GitHub Actions:**
```yaml
# .github/workflows/validate-structure.yml
name: Validate Structure
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate Structure
        run: python3 scripts/validate_structure.py
```

**Makefile:**
```makefile
.PHONY: validate-structure
validate-structure:
	python3 scripts/validate_structure.py

.PHONY: fix-structure
fix-structure:
	python3 scripts/validate_structure.py --fix
```

#### Customization

**Add Required Directories:**
```python
REQUIRED_DIRS = [
    'config',
    'docs',
    'examples',
    'scripts',
    'workflow-templates',
    '.github',
    'my_custom_dir',  # Add your directory
]
```

**Add Known Structure:**
```python
KNOWN_STRUCTURE = {
    # ... existing structure ...
    'my_custom_dir',
    'my_custom_dir/subdir',
}
```

**Allow Empty Directories:**
```python
ALLOWED_EMPTY_DIRS = {
    # ... existing allowed ...
    'my_custom_dir/cache',  # Can be empty
}
```

#### Advanced Usage

**Validate from Different Directory:**
```bash
cd /path/to/other/project
python3 /path/to/ai_workflow_core/scripts/validate_structure.py
```

**CI with Failure on Warning:**
```bash
# Exit 1 if any warnings (for strict CI)
python3 scripts/validate_structure.py --quiet || exit 1
```

**Custom Validation Script:**
```python
#!/usr/bin/env python3
from scripts.validate_structure import check_required_directories, check_empty_directories

# Custom validation logic
root = Path('.')
required_ok, required_issues = check_required_directories(root)
empty_ok, empty_issues = check_empty_directories(root)

if not required_ok or not empty_ok:
    send_alert("Structure validation failed!")
```

---

## Health Check Scripts

### check_integration_health.sh

**Purpose**: Validates ai_workflow_core integration into a project and detects common issues

**File**: `scripts/check_integration_health.sh.template`  
**Language**: Bash  
**Dependencies**: `git`, `bash` 4.0+

#### Template Usage

**1. Copy Template:**
```bash
cp .workflow_core/scripts/check_integration_health.sh.template scripts/check_integration_health.sh
chmod +x scripts/check_integration_health.sh
```

**2. Replace Placeholders:**
```bash
# Replace {{PROJECT_ROOT}} with your project root
sed -i 's|{{PROJECT_ROOT}}|/path/to/project|g' scripts/check_integration_health.sh

# Or use git root dynamically
sed -i 's|{{PROJECT_ROOT}}|$(git rev-parse --show-toplevel)|g' scripts/check_integration_health.sh
```

**3. Run Health Check:**
```bash
# Check only (report issues)
./scripts/check_integration_health.sh

# Auto-fix common issues
./scripts/check_integration_health.sh --fix
```

#### What It Checks

1. **Submodule Presence**
   - Verifies `.workflow_core/` exists
   - Checks submodule initialization
   - Detects submodule path issues

2. **Configuration File**
   - `.workflow-config.yaml` exists
   - No placeholder values remain (`{{PLACEHOLDER}}`)
   - Valid YAML syntax
   - Required fields present

3. **Artifact Directory**
   - `.ai_workflow/` directory exists
   - Required subdirectories present
   - Proper permissions

4. **Gitignore Patterns**
   - `.ai_workflow/` patterns in `.gitignore`
   - Prevents committing logs/metrics
   - Allows optional prompt commits

5. **Version Pinning**
   - Submodule pinned to specific tag/commit
   - Not on `HEAD` or `main` branch
   - Recommends stable version

6. **Configuration Drift**
   - Compares config with template
   - Detects outdated configuration
   - Reports new fields available

#### Output Examples

**Success (Healthy Integration):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Project Root Detection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: Project root directory
✓ PASS: Project root exists: /home/user/my-project

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Submodule Integration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: .workflow_core submodule
✓ PASS: Submodule directory exists
✓ PASS: Submodule initialized and checked out
✓ PASS: Pinned to version tag: v1.0.1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: .workflow-config.yaml
✓ PASS: Configuration file exists
✓ PASS: No placeholder values found
✓ PASS: Valid YAML syntax

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Artifact Directory
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: .ai_workflow directory structure
✓ PASS: Artifact directory exists
✓ PASS: All required subdirectories present

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Gitignore Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: .gitignore patterns
✓ PASS: .gitignore includes .ai_workflow/ patterns

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HEALTH CHECK SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Integration is HEALTHY

Checks: 10 passed, 0 failed, 0 warnings
```

**Failure (Issues Found):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Submodule Integration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: .workflow_core submodule
✗ FAIL: Submodule not initialized (run: git submodule update --init --recursive)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: .workflow-config.yaml
✗ FAIL: Placeholder values found: {{PROJECT_NAME}}, {{PROJECT_TYPE}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Artifact Directory
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: .ai_workflow directory structure
⚠ WARN: Missing subdirectory: .ai_workflow/checkpoints/
⚠ WARN: Missing subdirectory: .ai_workflow/ml_models/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HEALTH CHECK SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Integration has ISSUES

Checks: 7 passed, 2 failed, 2 warnings

Fixes available: Run with --fix to auto-correct common issues
```

**Auto-fix Mode:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Artifact Directory
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: .ai_workflow directory structure
⚠ WARN: Missing subdirectory: .ai_workflow/checkpoints/
🔧 FIXED: Created .ai_workflow/checkpoints/
⚠ WARN: Missing subdirectory: .ai_workflow/ml_models/
🔧 FIXED: Created .ai_workflow/ml_models/
✓ PASS: All required subdirectories present
```

#### Exit Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `0` | Success | All checks passed |
| `1` | Failure | One or more checks failed |
| `2` | Critical | Submodule missing or critical error |

#### Integration

**Makefile:**
```makefile
.PHONY: health-check
health-check:
	./scripts/check_integration_health.sh

.PHONY: health-fix
health-fix:
	./scripts/check_integration_health.sh --fix
```

**GitHub Actions:**
```yaml
# .github/workflows/integration-health.yml
name: Integration Health
on: [push, pull_request]

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive
      - name: Check Integration Health
        run: ./scripts/check_integration_health.sh
```

**Pre-push Hook:**
```bash
# .git/hooks/pre-push
#!/bin/bash
./scripts/check_integration_health.sh || {
    echo "Integration health check failed. Push aborted."
    exit 1
}
```

#### Customization

Add custom checks by modifying the template:

```bash
# Add after existing checks
check_custom_requirement() {
  print_header "Custom Requirement"
  print_check "My custom validation"
  
  if [[ -f "${PROJECT_ROOT}/my-required-file.txt" ]]; then
    print_pass "Required file exists"
  else
    print_fail "Required file missing: my-required-file.txt"
  fi
}

# Add to main execution
check_project_root
check_submodule
check_configuration
check_artifact_directory
check_gitignore
check_custom_requirement  # Add here
```

---

## Cleanup Scripts

### cleanup_artifacts.sh

**Purpose**: Manages workflow artifacts and cache cleanup

**File**: `scripts/cleanup_artifacts.sh.template`  
**Language**: Bash  
**Version**: 2.0.0

#### Template Usage

**1. Copy Template:**
```bash
cp .workflow_core/scripts/cleanup_artifacts.sh.template scripts/cleanup_artifacts.sh
chmod +x scripts/cleanup_artifacts.sh
```

**2. Replace Placeholders:**
```bash
# Replace {{PROJECT_ROOT}}
sed -i 's|{{PROJECT_ROOT}}|$(git rev-parse --show-toplevel)|g' scripts/cleanup_artifacts.sh
```

**3. Run Cleanup:**
```bash
# Clean logs only
./scripts/cleanup_artifacts.sh --logs

# Clean everything except prompts
./scripts/cleanup_artifacts.sh --all

# Clean including summaries
./scripts/cleanup_artifacts.sh --all --summaries

# Clean with confirmation
./scripts/cleanup_artifacts.sh --all --confirm
```

#### Options

| Option | Description | What Gets Cleaned |
|--------|-------------|-------------------|
| `--logs` | Clean log files | `.ai_workflow/logs/*.log` |
| `--metrics` | Clean metrics | `.ai_workflow/metrics/*.json` |
| `--cache` | Clean cache | `.ai_workflow/.incremental_cache/*` |
| `--summaries` | Clean summaries | `.ai_workflow/summaries/*.md` |
| `--all` | Clean all (except prompts) | Logs, metrics, cache, backlog |
| `--prompts` | Clean prompts | `.ai_workflow/prompts/*.md` (use with caution) |
| `--dry-run` | Show what would be deleted | No actual deletion |
| `--confirm` | Prompt before deletion | Interactive confirmation |
| `--quiet` | Suppress output | Minimal output |

#### Output Examples

**Dry Run:**
```
Workflow Artifact Cleanup (DRY RUN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Would delete:
  • 15 log files (2.3 MB)
  • 8 metric files (450 KB)
  • 120 cache entries (5.1 MB)

Total space to be freed: 7.85 MB

Run without --dry-run to perform cleanup.
```

**Actual Cleanup:**
```
Workflow Artifact Cleanup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cleaning logs...
✓ Removed 15 log files (2.3 MB)

Cleaning metrics...
✓ Removed 8 metric files (450 KB)

Cleaning cache...
✓ Removed 120 cache entries (5.1 MB)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLEANUP SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Cleanup completed successfully

Total space freed: 7.85 MB
Files removed: 143
```

#### Exit Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `0` | Success | Cleanup completed |
| `1` | Error | Cleanup failed (permissions, missing dir) |

#### Integration

**Cron Job (Weekly Cleanup):**
```bash
# crontab -e
0 2 * * 0 /path/to/project/scripts/cleanup_artifacts.sh --logs --metrics --quiet
```

**Makefile:**
```makefile
.PHONY: clean-logs
clean-logs:
	./scripts/cleanup_artifacts.sh --logs

.PHONY: clean-all
clean-all:
	./scripts/cleanup_artifacts.sh --all --confirm
```

**Pre-commit Hook (Optional):**
```bash
# .git/hooks/pre-commit
#!/bin/bash
# Clean old logs before commit
./scripts/cleanup_artifacts.sh --logs --quiet
```

---

## Common Patterns

### Python Script Pattern

```python
#!/usr/bin/env python3
"""
Script Name and Purpose

Usage:
    python3 script.py [options] [arguments]

Exit codes:
    0 - Success
    1 - Validation/processing failure
    2 - Script error (missing deps, file not found)
"""

import sys
from pathlib import Path

def main():
    """Main entry point."""
    try:
        # Script logic
        result = do_validation()
        
        if result:
            print("✅ SUCCESS")
            return 0
        else:
            print("❌ FAILURE")
            return 1
            
    except FileNotFoundError as e:
        print(f"Error: {e}")
        return 2
    except Exception as e:
        print(f"Unexpected error: {e}")
        return 2

if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)
```

### Bash Script Pattern

```bash
#!/usr/bin/env bash
# Script Name and Purpose
#
# Usage: ./script.sh [options]
#   --fix: Auto-fix issues
#
# Exit codes:
#   0 - Success
#   1 - Failures found
#   2 - Critical error

set -euo pipefail

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m'

# Configuration
readonly PROJECT_ROOT="$(git rev-parse --show-toplevel)"

# Counters
PASSED=0
FAILED=0

# Helper functions
print_pass() {
    echo -e "${GREEN}✓ PASS:${NC} $1"
    ((PASSED++))
}

print_fail() {
    echo -e "${RED}✗ FAIL:${NC} $1"
    ((FAILED++))
}

# Main logic
main() {
    do_checks
    
    if [[ $FAILED -eq 0 ]]; then
        echo "✅ All checks passed"
        exit 0
    else
        echo "❌ $FAILED checks failed"
        exit 1
    fi
}

main "$@"
```

---

## Exit Codes

### Standard Exit Code Convention

All scripts follow this convention:

| Code | Status | Meaning | When to Use |
|------|--------|---------|-------------|
| `0` | Success | All operations succeeded | Normal completion, all validations passed |
| `1` | Failure | Validation/logic failure | Issues found, tests failed, config invalid |
| `2` | Error | Script execution error | File not found, permission denied, missing dependency |

### Exit Code Usage

**Python:**
```python
sys.exit(0)  # Success
sys.exit(1)  # Validation failure
sys.exit(2)  # Script error
```

**Bash:**
```bash
exit 0  # Success
exit 1  # Validation failure
exit 2  # Script error
```

### CI/CD Integration

```yaml
# GitHub Actions - Fail on any non-zero exit
- name: Validate Structure
  run: python3 scripts/validate_structure.py

# Jenkins - Check specific exit code
if [ $? -eq 2 ]; then
    echo "Script error - investigate"
    exit 1
fi
```

---

## Error Handling

### Python Error Handling

```python
def validate_file(path: Path) -> Tuple[bool, List[str]]:
    """Validate file with proper error handling."""
    issues = []
    
    try:
        if not path.exists():
            return False, [f"File not found: {path}"]
        
        with open(path) as f:
            data = yaml.safe_load(f)
        
        # Validation logic
        if not data:
            issues.append("Empty file")
        
        return len(issues) == 0, issues
        
    except PermissionError:
        return False, [f"Permission denied: {path}"]
    except yaml.YAMLError as e:
        return False, [f"Invalid YAML: {e}"]
    except Exception as e:
        return False, [f"Unexpected error: {e}"]
```

### Bash Error Handling

```bash
# Enable strict error handling
set -euo pipefail  # Exit on error, undefined var, pipe failure

# Function-level error handling
check_file() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        print_fail "File not found: $file"
        return 1
    fi
    
    if [[ ! -r "$file" ]]; then
        print_fail "Permission denied: $file"
        return 1
    fi
    
    # Validation logic
    if ! validate_content "$file"; then
        print_fail "Invalid content: $file"
        return 1
    fi
    
    print_pass "Valid file: $file"
    return 0
}
```

---

## Best Practices

### 1. Consistent Output Format

**Use Color Coding:**
- ✅ Green for success/pass
- ❌ Red for errors/failures
- ⚠️ Yellow for warnings
- ℹ️ Blue for info
- 🔧 Green for auto-fixes

**Structure Output:**
```
Header/Section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: What is being validated
✓ PASS: Specific check passed
✗ FAIL: Specific check failed
⚠ WARN: Non-critical issue

Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅/❌ Overall result
Statistics (passed/failed/warnings)
```

### 2. Automation-Friendly

**Support Flags:**
- `--quiet` - Minimal output for scripts
- `--verbose` - Detailed output for debugging
- `--dry-run` - Show what would happen
- `--fix` - Automatically fix issues

**Example:**
```python
parser = argparse.ArgumentParser()
parser.add_argument('--quiet', action='store_true', help='Minimal output')
parser.add_argument('--fix', action='store_true', help='Auto-fix issues')
parser.add_argument('--dry-run', action='store_true', help='Dry run')
args = parser.parse_args()
```

### 3. Idempotent Operations

Scripts should be safe to run multiple times:

```python
# Good: Check before creating
if not dir_path.exists():
    dir_path.mkdir(parents=True)

# Good: Remove only if exists
if file_path.exists():
    file_path.unlink()
```

### 4. Clear Documentation

Every script should have:

```python
"""
Script Purpose: One-line description

Detailed description of what the script does.

Usage:
    python3 script.py [options] [args]
    
Options:
    --option1    Description
    --option2    Description

Exit codes:
    0 - Success description
    1 - Failure description
    2 - Error description

Examples:
    python3 script.py --option1
    python3 script.py --option2 --quiet

Author: Team/maintainer
Version: X.Y.Z
Last Updated: YYYY-MM-DD
"""
```

### 5. Logging and Debugging

```python
# Add --verbose flag
if args.verbose:
    print(f"DEBUG: Processing {file_path}")
    print(f"DEBUG: Config values: {config}")

# Log to file in addition to stdout
with open('script.log', 'a') as log:
    log.write(f"{timestamp}: {message}\n")
```

### 6. Template Variables

For `.template` files, document placeholders:

```bash
# Script header
# Template Variables:
#   {{PROJECT_ROOT}}  - Root directory of project
#   {{ARTIFACT_DIR}}  - Workflow artifact directory
#
# To use:
#   1. Copy to scripts/ without .template extension
#   2. Replace {{PLACEHOLDERS}} with actual values
#   3. Make executable: chmod +x scripts/script.sh
```

---

## Related Documentation

### Configuration References
- **[Config Reference](CONFIG_REFERENCE.md)** - Main configuration file
- **[Model Selection Rules](MODEL_SELECTION_RULES_REFERENCE.md)** - AI model selection

### User Guides
- **[Quick Start](../guides/QUICK_START.md)** - Getting started
- **[Integration Guide](../INTEGRATION.md)** - Integration steps
- **[Troubleshooting](../guides/TROUBLESHOOTING.md)** - Common issues

### Developer Guides
- **[Template Authoring](../developers/TEMPLATE_AUTHORING.md)** - Creating templates
- **[Testing Guide](../developers/TESTING_GUIDE.md)** - Testing strategies

---

**Last Updated**: 2026-02-09  
**Version**: 1.0.1  
**Maintainer**: ai_workflow_core team
