## SCRIPT_API_REFERENCE

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
| `0` | Success | All val

---

## SCRIPTS_COMPREHENSIVE_GUIDE

# Scripts Comprehensive Usage Guide

**Version**: 1.0.2  
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
   