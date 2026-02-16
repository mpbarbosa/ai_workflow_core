# Scripts Comprehensive Usage Guide

**Version**: 1.0.0  
**Last Updated**: 2026-02-16  
**Target Audience**: Developers, DevOps Engineers, Project Maintainers

## Table of Contents

- [Overview](#overview)
- [Script Inventory](#script-inventory)
- [Validation Scripts](#validation-scripts)
- [Template Scripts](#template-scripts)
- [Usage Examples](#usage-examples)
- [Integration Guide](#integration-guide)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Overview

The `ai_workflow_core` repository provides **4 production-ready scripts** for validation, health checking, and artifact management. These scripts support both the core repository itself and projects that integrate it as a submodule.

### Script Categories

1. **Validation Scripts** (Python)
   - `validate_context_blocks.py` - Validates YAML context block structure
   - `validate_structure.py` - Validates directory structure integrity

2. **Template Scripts** (Bash)
   - `check_integration_health.sh.template` - Integration health monitoring
   - `cleanup_artifacts.sh.template` - Artifact directory management

### Quick Reference

| Script | Type | Language | Lines | Purpose |
|--------|------|----------|-------|---------|
| `validate_context_blocks.py` | Validator | Python | 117 | YAML context validation |
| `validate_structure.py` | Validator | Python | 416 | Directory structure validation |
| `check_integration_health.sh` | Template | Bash | 410 | Integration health checks |
| `cleanup_artifacts.sh` | Template | Bash | 451 | Artifact cleanup |

---

## Script Inventory

### Validation Scripts

#### 1. `validate_context_blocks.py`

**Purpose**: Validates that workflow step prompts follow standardized context block structure.

**Location**: `scripts/validate_context_blocks.py`  
**Language**: Python 3.9+  
**Dependencies**: `pyyaml`  
**Exit Codes**:
- `0` - All validations passed
- `1` - Validation failures found
- `2` - Script error (missing file, etc.)

**What It Validates**:
1. ✅ Presence of `**Context:**` block in each step prompt
2. ✅ Standard parameters: `project_name`, `project_description`, `primary_language`, `change_scope`, `modified_count`
3. ✅ Parameter naming convention (snake_case, no title case)
4. ✅ Bullet list format consistency
5. ✅ Parameter ordering

**Usage**:
```bash
# Validate default file (config/ai_helpers.yaml)
python3 scripts/validate_context_blocks.py

# Validate specific file
python3 scripts/validate_context_blocks.py config/ai_helpers.yaml

# Validate with verbose output
python3 scripts/validate_context_blocks.py --verbose

# CI/CD usage
python3 scripts/validate_context_blocks.py || exit 1
```

**Output Example**:
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

**Error Example**:
```
Validating Context Block Structure...
===============================================================================

❌ VALIDATION FAILURES FOUND

Step 2: Missing parameters: change_scope
Step 3: Non-snake_case parameters: ProjectName, ModifiedCount
Step 5: Non-bullet lines in context: 2

Found 3 validation errors.
Exit code: 1
```

**Standard Parameters**:
```python
standard_params = [
    'project_name',         # Human-readable project name
    'project_description',  # Brief project description
    'primary_language',     # Main programming language
    'change_scope',         # Scope of changes made
    'modified_count'        # Number of files modified
]
```

**Integration with Pre-commit**:
```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: validate-context-blocks
        name: Validate Context Blocks
        entry: python3 scripts/validate_context_blocks.py
        language: system
        files: 'config/ai_helpers.yaml'
```

---

#### 2. `validate_structure.py`

**Purpose**: Validates directory structure for empty directories, undocumented directories, and required directories.

**Location**: `scripts/validate_structure.py`  
**Language**: Python 3.9+  
**Dependencies**: None (uses stdlib only)  
**Exit Codes**:
- `0` - Structure is valid
- `1` - Validation errors found
- `2` - Script error (missing dependencies, etc.)

**What It Validates**:
1. ✅ Empty directories (excluding allowed exceptions)
2. ✅ Undocumented directories (not in known structure)
3. ✅ Required directories present
4. ✅ Structure consistency with documentation

**Usage**:
```bash
# Basic validation
python3 scripts/validate_structure.py

# Auto-fix mode (removes empty directories)
python3 scripts/validate_structure.py --fix

# Quiet mode (errors only)
python3 scripts/validate_structure.py --quiet

# Verbose mode
python3 scripts/validate_structure.py --verbose

# Help
python3 scripts/validate_structure.py --help
```

**Configuration** (in script):

```python
# Required top-level directories
REQUIRED_DIRS = [
    'config',
    'docs',
    'examples',
    'scripts',
    'workflow-templates',
    '.github',
]

# Allowed empty directories
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
    'docs/misc',
}

# Excluded from scanning
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

**Output Example** (Success):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  AI Workflow Core - Directory Structure Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ PASS: All 6 required directories exist
✓ PASS: No empty directories found (excluding allowed)
✓ PASS: No undocumented directories found

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Validation Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checks:       3
Passed:       3
Failed:       0
Warnings:     0

✅ Structure validation PASSED
```

**Output Example** (Failure):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  AI Workflow Core - Directory Structure Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✗ FAIL: Missing required directories: examples/python, scripts/lib
✗ FAIL: Found 2 empty directories: docs/temp, tests/fixtures
⚠ WARN: Found 1 undocumented directories: experimental/

Empty directories:
  • docs/temp
  • tests/fixtures

Use --fix to automatically remove empty directories.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Validation Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checks:       3
Passed:       0
Failed:       2
Warnings:     1

❌ Structure validation FAILED
```

**Auto-Fix Example**:
```bash
$ python3 scripts/validate_structure.py --fix

Found 2 empty directories:
  • docs/temp
  • tests/fixtures

Auto-fixing...
  ✓ Removed: docs/temp
  ✓ Removed: tests/fixtures

✅ Structure validation PASSED (after fixes)
```

**Customization for Different Projects**:

```python
# For Node.js projects
REQUIRED_DIRS = [
    'src',
    'tests',
    'docs',
    '.github',
]

ALLOWED_EMPTY_DIRS = {
    'coverage',
    'dist',
    '.nyc_output',
}

# For Python projects
REQUIRED_DIRS = [
    'src',
    'tests',
    'docs',
    'scripts',
    '.github',
]

ALLOWED_EMPTY_DIRS = {
    '.pytest_cache',
    'htmlcov',
    'dist',
}

# For configuration libraries (like ai_workflow_core)
REQUIRED_DIRS = [
    'config',
    'docs',
    'examples',
    'scripts',
    'workflow-templates',
    '.github',
]
```

**Integration with CI/CD**:
```yaml
# .github/workflows/validate-structure.yml
- name: Validate directory structure
  run: python3 scripts/validate_structure.py

- name: Check for empty directories
  run: |
    if python3 scripts/validate_structure.py | grep "empty directories"; then
      exit 1
    fi
```

---

### Template Scripts

#### 3. `check_integration_health.sh.template`

**Purpose**: Validates ai_workflow_core submodule integration health and detects configuration issues.

**Location**: `scripts/check_integration_health.sh.template`  
**Language**: Bash 4.0+  
**Dependencies**: `git`, `grep`, `find`, optionally `yamllint`  
**Lines**: 410  
**Exit Codes**:
- `0` - All checks passed
- `1` - One or more checks failed
- `2` - Critical errors (submodule missing, etc.)

**Setup Instructions**:

```bash
# 1. Copy template to project (without .template extension)
cp .workflow_core/scripts/check_integration_health.sh.template scripts/check_integration_health.sh

# 2. Replace placeholders
sed -i 's|{{PROJECT_ROOT}}|$(git rev-parse --show-toplevel)|g' scripts/check_integration_health.sh

# 3. Make executable
chmod +x scripts/check_integration_health.sh

# 4. Run
bash scripts/check_integration_health.sh
```

**Usage**:
```bash
# Basic health check
bash scripts/check_integration_health.sh

# Auto-fix mode (fixes issues where possible)
bash scripts/check_integration_health.sh --fix

# Verbose output
bash scripts/check_integration_health.sh --verbose

# Dry-run mode (show what would be fixed)
bash scripts/check_integration_health.sh --fix --dry-run
```

**What It Checks**:

1. ✅ **Submodule Presence** - Verifies `.workflow_core/` exists
2. ✅ **Submodule Status** - Checks if submodule is initialized
3. ✅ **Configuration File** - Validates `.workflow-config.yaml` exists
4. ✅ **Placeholder Replacement** - Checks for unreplaced `{{PLACEHOLDERS}}`
5. ✅ **YAML Syntax** - Validates YAML syntax (if yamllint installed)
6. ✅ **Required Directories** - Checks artifact directories exist
7. ✅ **Gitignore Configuration** - Validates artifact patterns in `.gitignore`
8. ✅ **Version Tracking** - Reports submodule version/commit
9. ✅ **Drift Detection** - Compares actual vs. expected structure
10. ✅ **Documentation Alignment** - Checks structure vs. copilot-instructions.md

**Output Example** (Success):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  AI Workflow Core - Integration Health Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: Submodule presence
✓ PASS: Submodule .workflow_core exists

Checking: Submodule initialization
✓ PASS: Submodule is initialized and up-to-date

Checking: Configuration file
✓ PASS: Configuration file .workflow-config.yaml exists

Checking: Placeholder replacement
✓ PASS: No unreplaced placeholders found

Checking: YAML syntax validation
✓ PASS: YAML syntax is valid

Checking: Required artifact directories
✓ PASS: All 8 required directories exist

Checking: Gitignore configuration
✓ PASS: All artifact patterns in .gitignore

Checking: Submodule version
ℹ INFO: Submodule version: v1.0.0 (commit: abc123f)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Health Check Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checks:       10
Passed:       9
Failed:       0
Warnings:     0

✅ Integration health check PASSED
```

**Output Example** (Failure):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  AI Workflow Core - Integration Health Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: Configuration file
✗ FAIL: Configuration file .workflow-config.yaml not found

Checking: Placeholder replacement
✗ FAIL: Found unreplaced placeholders:
  • {{PROJECT_NAME}} in line 3
  • {{VERSION}} in line 5

Checking: Required artifact directories
✗ FAIL: Missing directories: .ai_workflow/logs, .ai_workflow/metrics

Checking: Gitignore configuration
⚠ WARN: Missing .gitignore patterns: .ai_workflow/backlog/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Health Check Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checks:       10
Passed:       5
Failed:       3
Warnings:     1

❌ Integration health check FAILED

Run with --fix to automatically fix issues where possible.
```

**Auto-Fix Example**:
```bash
$ bash scripts/check_integration_health.sh --fix

Running in AUTO-FIX mode...

✓ Created missing directory: .ai_workflow/logs
✓ Created missing directory: .ai_workflow/metrics
✓ Added missing pattern to .gitignore: .ai_workflow/backlog/

⚠ Cannot auto-fix: unreplaced placeholders (manual edit required)

✅ Fixed 3 out of 4 issues
```

**Customization**:

```bash
# Custom project root
readonly PROJECT_ROOT="/path/to/project"

# Custom submodule path
readonly SUBMODULE_PATH="${PROJECT_ROOT}/.workflow_core_custom"

# Custom config file
readonly CONFIG_FILE="${PROJECT_ROOT}/.custom-workflow-config.yaml"

# Custom artifact directory
readonly ARTIFACT_DIR="${PROJECT_ROOT}/.custom_artifacts"

# Additional checks
check_custom_config() {
  print_check "Custom configuration validation"
  if validate_custom_config "$CONFIG_FILE"; then
    print_pass "Custom configuration is valid"
  else
    print_fail "Custom configuration validation failed"
  fi
}
```

**Integration with CI/CD**:
```yaml
# .github/workflows/integration-health.yml
- name: Run integration health check
  run: bash scripts/check_integration_health.sh

- name: Check submodule version
  run: |
    cd .workflow_core
    echo "Submodule version: $(git describe --tags 2>/dev/null || echo 'unknown')"
```

---

#### 4. `cleanup_artifacts.sh.template`

**Purpose**: Manages workflow artifact directory cleanup with safety checks.

**Location**: `scripts/cleanup_artifacts.sh.template`  
**Language**: Bash 4.0+  
**Dependencies**: `find`, `du`, `date`  
**Lines**: 451  
**Exit Codes**:
- `0` - Cleanup completed successfully
- `1` - Cleanup failed or was aborted
- `2` - Script error

**Setup Instructions**:

```bash
# 1. Copy template to project
cp .workflow_core/scripts/cleanup_artifacts.sh.template scripts/cleanup_artifacts.sh

# 2. Replace placeholders
sed -i 's|{{ARTIFACT_DIR}}|.ai_workflow|g' scripts/cleanup_artifacts.sh
sed -i 's|{{LOG_RETENTION_DAYS}}|30|g' scripts/cleanup_artifacts.sh

# 3. Make executable
chmod +x scripts/cleanup_artifacts.sh

# 4. Run
bash scripts/cleanup_artifacts.sh
```

**Usage**:
```bash
# Interactive cleanup (default)
bash scripts/cleanup_artifacts.sh

# Auto-confirm (non-interactive)
bash scripts/cleanup_artifacts.sh --yes

# Dry-run mode (show what would be deleted)
bash scripts/cleanup_artifacts.sh --dry-run

# Clean specific category only
bash scripts/cleanup_artifacts.sh --logs-only
bash scripts/cleanup_artifacts.sh --cache-only

# Custom retention period
bash scripts/cleanup_artifacts.sh --days 60

# Aggressive cleanup (deletes everything)
bash scripts/cleanup_artifacts.sh --all --yes

# Verbose output
bash scripts/cleanup_artifacts.sh --verbose
```

**What It Cleans**:

1. **Logs** (`.ai_workflow/logs/`)
   - Default retention: 30 days
   - Keeps: Recent logs, error logs
   - Pattern: `*.log`, `*.log.gz`

2. **Metrics** (`.ai_workflow/metrics/`)
   - Default retention: 90 days
   - Keeps: Current month, aggregated metrics
   - Pattern: `*.json`, `*.csv`

3. **Cache** (`.ai_workflow/.incremental_cache/`)
   - Default retention: 7 days
   - Keeps: Active caches
   - Pattern: `*.cache`, `*.tmp`

4. **Backlog** (`.ai_workflow/backlog/`)
   - Default retention: 180 days
   - Keeps: Open items, recent items
   - Pattern: `*.md`, `*.json`

5. **Summaries** (`.ai_workflow/summaries/`)
   - Default retention: 90 days
   - Keeps: Recent summaries
   - Pattern: `*.md`, `*.txt`

6. **Checkpoints** (`.ai_workflow/checkpoints/`)
   - Default retention: 30 days
   - Keeps: Latest checkpoint per workflow
   - Pattern: `*.checkpoint`

**Safety Features**:

- ✅ Confirmation prompts (unless `--yes`)
- ✅ Dry-run mode to preview deletions
- ✅ Backup before delete (optional)
- ✅ Exclusion patterns for important files
- ✅ Size calculation before cleanup
- ✅ Detailed reporting of deletions

**Output Example** (Interactive):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Artifact Cleanup - Size Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Directory: .ai_workflow/

  logs/                 1.2 GB  (412 files older than 30 days)
  metrics/              456 MB  (89 files older than 90 days)
  .incremental_cache/   3.4 GB  (1,203 files older than 7 days)
  backlog/              234 MB  (56 files older than 180 days)
  summaries/            123 MB  (34 files older than 90 days)
  checkpoints/          89 MB   (12 files older than 30 days)

Total reclaimable space: 5.5 GB

Proceed with cleanup? [y/N]: y

Cleaning logs (retention: 30 days)...
  ✓ Deleted: 412 files (1.2 GB)

Cleaning metrics (retention: 90 days)...
  ✓ Deleted: 89 files (456 MB)

Cleaning cache (retention: 7 days)...
  ✓ Deleted: 1,203 files (3.4 GB)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cleanup Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Files deleted:   1,806
Space reclaimed: 5.5 GB
Duration:        42 seconds

✅ Cleanup completed successfully
```

**Output Example** (Dry-run):
```
DRY-RUN MODE: No files will be deleted

Would delete from logs/:
  • workflow_run_2024-01-15.log (12 MB)
  • error_2024-01-20.log (3 MB)
  ... (410 more files)

Would delete from cache/:
  • step3_cache_old.tmp (234 MB)
  • incremental_2024-01-10.cache (1.2 GB)
  ... (1,201 more files)

Total that would be deleted: 1,806 files (5.5 GB)

Run without --dry-run to perform actual cleanup.
```

**Customization**:

```bash
# Custom retention periods
readonly LOG_RETENTION_DAYS=60
readonly METRICS_RETENTION_DAYS=180
readonly CACHE_RETENTION_DAYS=14

# Custom exclusion patterns
EXCLUDE_PATTERNS=(
  "*.important.log"
  "production_metrics_*.json"
  "backup_*.checkpoint"
)

# Custom cleanup logic
cleanup_custom_artifacts() {
  local dir="$1"
  local retention_days="$2"
  
  find "$dir" -type f -mtime +"$retention_days" \
    ! -name "*.important.*" \
    -delete
}

# Size threshold warning
WARN_THRESHOLD_GB=10

if (( $(get_size_gb "$ARTIFACT_DIR") > WARN_THRESHOLD_GB )); then
  print_warn "Artifact directory exceeds ${WARN_THRESHOLD_GB}GB threshold"
fi
```

**Scheduled Cleanup** (Cron):
```bash
# Run weekly cleanup on Sunday at 2 AM
0 2 * * 0 /path/to/scripts/cleanup_artifacts.sh --yes --days 30

# Run daily cache cleanup
0 3 * * * /path/to/scripts/cleanup_artifacts.sh --cache-only --yes
```

**Integration with CI/CD**:
```yaml
# .github/workflows/cleanup-artifacts.yml
name: Cleanup Old Artifacts

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  workflow_dispatch:

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run artifact cleanup
        run: bash scripts/cleanup_artifacts.sh --yes --days 30
      
      - name: Report cleanup
        run: |
          echo "## Artifact Cleanup Report" >> $GITHUB_STEP_SUMMARY
          echo "- Retention period: 30 days" >> $GITHUB_STEP_SUMMARY
          echo "- Cleaned at: $(date)" >> $GITHUB_STEP_SUMMARY
```

---

## Usage Examples

### Example 1: Daily Development Workflow

```bash
#!/bin/bash
# daily_checks.sh - Run validation checks before committing

set -euo pipefail

echo "Running daily validation checks..."

# 1. Validate directory structure
if ! python3 scripts/validate_structure.py --quiet; then
  echo "❌ Structure validation failed"
  exit 1
fi

# 2. Validate context blocks (if applicable)
if [[ -f "config/ai_helpers.yaml" ]]; then
  if ! python3 scripts/validate_context_blocks.py --quiet; then
    echo "❌ Context block validation failed"
    exit 1
  fi
fi

# 3. Check integration health
if ! bash scripts/check_integration_health.sh; then
  echo "❌ Integration health check failed"
  exit 1
fi

echo "✅ All checks passed"
```

### Example 2: Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run structure validation
python3 scripts/validate_structure.py --quiet || {
  echo "❌ Structure validation failed"
  exit 1
}

# Run context block validation
python3 scripts/validate_context_blocks.py --quiet || {
  echo "❌ Context block validation failed"
  exit 1
}

exit 0
```

### Example 3: CI/CD Pipeline

```yaml
# .github/workflows/validation.yml
name: Validation Pipeline

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install pyyaml yamllint
      
      - name: Validate structure
        run: python3 scripts/validate_structure.py
      
      - name: Validate context blocks
        run: python3 scripts/validate_context_blocks.py
      
      - name: Check integration health
        run: bash scripts/check_integration_health.sh
```

### Example 4: Weekly Maintenance

```bash
#!/bin/bash
# weekly_maintenance.sh

set -euo pipefail

echo "Running weekly maintenance..."

# 1. Cleanup old artifacts
bash scripts/cleanup_artifacts.sh --yes --days 30

# 2. Validate structure
python3 scripts/validate_structure.py --fix

# 3. Generate health report
bash scripts/check_integration_health.sh > health_report.txt

# 4. Update submodule
cd .workflow_core
git fetch origin
git checkout v1.0.0
cd ..

echo "✅ Maintenance complete"
```

---

## Integration Guide

### For New Projects

```bash
# 1. Add ai_workflow_core as submodule
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
git submodule update --init --recursive

# 2. Create scripts directory
mkdir -p scripts

# 3. Copy validation scripts (use as-is)
cp .workflow_core/scripts/validate_structure.py scripts/
cp .workflow_core/scripts/validate_context_blocks.py scripts/

# 4. Copy and customize template scripts
cp .workflow_core/scripts/check_integration_health.sh.template scripts/check_integration_health.sh
cp .workflow_core/scripts/cleanup_artifacts.sh.template scripts/cleanup_artifacts.sh

# 5. Replace placeholders
sed -i 's|{{PROJECT_ROOT}}|$(git rev-parse --show-toplevel)|g' scripts/check_integration_health.sh
sed -i 's|{{ARTIFACT_DIR}}|.ai_workflow|g' scripts/cleanup_artifacts.sh

# 6. Make executable
chmod +x scripts/*.sh

# 7. Run initial validation
python3 scripts/validate_structure.py
bash scripts/check_integration_health.sh
```

### For Existing Projects

```bash
# 1. Ensure submodule is up-to-date
git submodule update --remote .workflow_core

# 2. Check for new scripts
diff -r scripts/ .workflow_core/scripts/

# 3. Update copied scripts if needed
cp .workflow_core/scripts/validate_structure.py scripts/
cp .workflow_core/scripts/validate_context_blocks.py scripts/

# 4. Run health check
bash scripts/check_integration_health.sh
```

---

## Troubleshooting

### Common Issues

#### 1. "ModuleNotFoundError: No module named 'yaml'"

**Solution**:
```bash
# Install PyYAML
pip install pyyaml

# Or use system package
sudo apt-get install python3-yaml  # Ubuntu/Debian
brew install libyaml  # macOS
```

#### 2. "Permission denied" when running scripts

**Solution**:
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Or run with bash
bash scripts/check_integration_health.sh
```

#### 3. "Submodule not found" error

**Solution**:
```bash
# Initialize submodules
git submodule init
git submodule update

# Or clone with submodules
git clone --recursive <repo-url>
```

#### 4. Validation script reports unexpected empty directories

**Solution**:
```bash
# Check if directories are truly empty
find . -type d -empty

# Add to ALLOWED_EMPTY_DIRS if intentional
# Or add placeholder files
echo "# Placeholder" > docs/misc/.gitkeep
```

#### 5. Cleanup script deletes important files

**Solution**:
```bash
# Always use dry-run first
bash scripts/cleanup_artifacts.sh --dry-run

# Add exclusion patterns
EXCLUDE_PATTERNS=(
  "*.important.log"
  "production_*.json"
)

# Restore from backup (if enabled)
cp -r .ai_workflow.backup/ .ai_workflow/
```

---

## Best Practices

### 1. Version Control

✅ **Do**:
- Commit validation scripts to repository
- Version template scripts alongside code
- Document customizations in README

❌ **Don't**:
- Modify scripts in `.workflow_core/` directly (use copies)
- Commit large artifact files
- Skip documentation of custom changes

### 2. Automation

```bash
# Set up pre-commit hooks
pip install pre-commit
pre-commit install

# Add to .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: validate-structure
        name: Validate Directory Structure
        entry: python3 scripts/validate_structure.py
        language: system
        pass_filenames: false
```

### 3. Maintenance Schedule

| Task | Frequency | Script |
|------|-----------|--------|
| Structure validation | Daily | `validate_structure.py` |
| Integration health | Daily | `check_integration_health.sh` |
| Artifact cleanup | Weekly | `cleanup_artifacts.sh` |
| Submodule update | Monthly | `git submodule update` |

### 4. Monitoring

```bash
# Track script execution in CI/CD
- name: Validate with metrics
  run: |
    time python3 scripts/validate_structure.py
    echo "validation_duration_seconds=$(date +%s - $START_TIME)" >> metrics.txt
```

### 5. Documentation

```markdown
# scripts/README.md

## Custom Scripts

### check_integration_health.sh
- **Customizations**: Custom retention days, additional checks
- **Schedule**: Runs daily in CI/CD
- **Maintainer**: @username

### cleanup_artifacts.sh
- **Customizations**: Custom exclusion patterns
- **Schedule**: Runs weekly on Sunday
- **Maintainer**: @username
```

---

## See Also

- [SCRIPT_API_REFERENCE.md](../api/SCRIPT_API_REFERENCE.md) - Detailed API reference
- [WORKFLOWS_COMPREHENSIVE_GUIDE.md](./WORKFLOWS_COMPREHENSIVE_GUIDE.md) - GitHub Actions workflows
- [TROUBLESHOOTING.md](../guides/TROUBLESHOOTING.md) - General troubleshooting guide
- [INTEGRATION.md](../INTEGRATION.md) - Integration guide

---

**Last Updated**: 2026-02-16  
**Version**: 1.0.0  
**Maintainers**: AI Workflow Core Team
