# Multi-Stage Pipeline Guide

**Version**: 2.8.0  
**Status**: Production Ready  
**Last Updated**: 2026-01-01

## Overview

The Multi-Stage Pipeline provides progressive validation that intelligently determines which checks to run based on your changes. Most workflows complete in just the first 1-2 stages, dramatically reducing execution time.

## Quick Start

### Enable Multi-Stage Pipeline

```bash
# Basic multi-stage execution
./src/workflow/execute_tests_docs_workflow.sh --multi-stage

# Multi-stage + other optimizations (RECOMMENDED)
./src/workflow/execute_tests_docs_workflow.sh \
  --multi-stage \
  --smart-execution \
  --parallel \
  --auto

# View pipeline configuration
./src/workflow/execute_tests_docs_workflow.sh --show-pipeline

# Force all 3 stages to run
./src/workflow/execute_tests_docs_workflow.sh \
  --multi-stage \
  --manual-trigger
```

## Pipeline Stages

### Stage 1: Fast Validation (Target: 2 minutes)
**Always Runs** - Mandatory baseline validation

**Steps**: 
- Step 0: Pre-Analysis

**Purpose**: Quick smoke test and change impact analysis

**Triggers**: Always (mandatory)

**Typical Duration**: 1-2 minutes

### Stage 2: Targeted Checks (Target: 5 minutes)
**Conditional** - Runs when docs/scripts/structure changes detected

**Steps**:
- Step 1: Documentation Updates
- Step 2: Consistency Analysis
- Step 3: Script Reference Validation
- Step 4: Directory Structure Validation

**Purpose**: Domain-specific validation for documentation and structure

**Triggers**: Stage 1 passes AND (docs changes OR script changes OR structure changes)

**Typical Duration**: 3-5 minutes

### Stage 3: Full Validation (Target: 15 minutes)
**Conditional** - Runs for high-impact changes or manual trigger

**Steps**:
- Step 5: Test Review
- Step 6: Test Generation
- Step 7: Test Execution
- Step 8: Dependency Validation
- Step 9: Code Quality Validation
- Step 10: Context Analysis
- Step 11: Git Finalization
- Step 12: Markdown Linting
- Step 13: Prompt Engineer Analysis
- Step 14: UX Analysis

**Purpose**: Comprehensive code, test, and security validation

**Triggers**: Stage 2 passes AND (manual trigger OR high-impact changes OR code changes)

**Typical Duration**: 12-18 minutes

## Intelligent Stage Triggers

### Stage 1 Triggers
- **Always runs** - No conditions

### Stage 2 Triggers
Stage 2 runs when ALL conditions are met:
1. Stage 1 passes ✅
2. **AND** at least ONE of:
   - Documentation files changed (*.md, docs/)
   - Shell scripts changed (*.sh)
   - Directory structure changed (new/deleted folders)

### Stage 3 Triggers
Stage 3 runs when ALL conditions are met:
1. Stage 2 passes ✅
2. **AND** at least ONE of:
   - Manual trigger enabled (`--manual-trigger`)
   - High-impact changes detected (10+ files, core libs, config, security)
   - Source code changed (src/, lib/, *.js, *.ts, *.py)

## Performance Characteristics

### Expected Stage Completion Rates

| Scenario | Stage 1 Only | Stage 1-2 | All 3 Stages |
|----------|--------------|-----------|--------------|
| Documentation fixes | 20% | 80% | 0% |
| Script updates | 15% | 70% | 15% |
| Code changes | 5% | 10% | 85% |
| **Overall Average** | **15%** | **65%** | **20%** |

**Result**: **80% of workflows complete in Stages 1-2** (2-7 minutes vs 15-20 minutes)

### Time Savings

| Change Type | Standard Workflow | Multi-Stage | Time Saved |
|-------------|-------------------|-------------|------------|
| Docs Only | 23 min | 5 min | 78% faster |
| Small Script Updates | 23 min | 7 min | 70% faster |
| Code Changes | 23 min | 18 min | 22% faster |
| Major Refactoring | 23 min | 20 min | 13% faster |

## Usage Examples

### Example 1: Documentation Update

```bash
# Modify some docs
vim docs/README.md

# Run multi-stage pipeline
./src/workflow/execute_tests_docs_workflow.sh --multi-stage

# Expected: Stages 1-2 only (5 minutes)
# Stage 1: Pre-analysis ✅
# Stage 2: Docs validation ✅
# Stage 3: Skipped (no code changes)
```

### Example 2: Script Enhancement

```bash
# Modify a shell script
vim src/workflow/lib/helpers.sh

# Run with smart execution
./src/workflow/execute_tests_docs_workflow.sh \
  --multi-stage \
  --smart-execution \
  --parallel

# Expected: All 3 stages (15-18 minutes)
# Stage 1: Pre-analysis ✅
# Stage 2: Script validation ✅
# Stage 3: Full validation ✅ (triggered by code change)
```

### Example 3: Target Project

```bash
# Run on external project
./src/workflow/execute_tests_docs_workflow.sh \
  --target /path/to/project \
  --multi-stage \
  --smart-execution \
  --parallel \
  --auto

# Stages determined by detected changes
```

### Example 4: Force Full Validation

```bash
# Before major release - run everything
./src/workflow/execute_tests_docs_workflow.sh \
  --multi-stage \
  --manual-trigger

# All 3 stages will execute regardless of changes
```

### Example 5: Combined with ML

```bash
# Maximum optimization stack
./src/workflow/execute_tests_docs_workflow.sh \
  --multi-stage \
  --ml-optimize \
  --smart-execution \
  --parallel \
  --auto

# ML predicts durations, multi-stage optimizes execution
```

## Change Detection Logic

### Documentation Changes
- Files in `docs/` directory
- Markdown files (`*.md`)
- README files

### Script Changes
- Shell scripts (`*.sh`)
- Executable scripts

### Structure Changes
- New directories created
- Directories deleted
- File hierarchy modifications

### Code Changes
- Files in `src/`, `lib/`, `app/` directories
- JavaScript/TypeScript (`*.js`, `*.ts`, `*.tsx`)
- Python files (`*.py`)
- Go files (`*.go`)

### High-Impact Changes
- **10+ files modified**
- Core library files (`src/workflow/lib/*`)
- Workflow orchestrator (`execute_tests_docs_workflow.sh`)
- Configuration files (`*.yaml`, `*.json`, `.workflow-config.yaml`)
- Security-sensitive files (auth, secrets, tokens)

## Pipeline Flow Diagram

```
Start
  │
  v
┌──────────────────────────┐
│ Stage 1: Fast Validation │  (2 min, always)
│ • Pre-analysis           │
└───────────┬──────────────┘
            │
            ├─[Pass]──> Check Triggers
            │
            └─[Fail]──> Exit (1)
                        
Check Stage 2 Triggers
  │
  ├─[Docs/Scripts/Structure Changes]
  │   │
  │   v
  │ ┌──────────────────────────┐
  │ │ Stage 2: Targeted Checks │  (5 min, conditional)
  │ │ • Docs validation        │
  │ │ • Script validation      │
  │ │ • Structure validation   │
  │ └───────────┬──────────────┘
  │             │
  │             ├─[Pass]──> Check Stage 3 Triggers
  │             │
  │             └─[Fail]──> Exit (1)
  │
  └─[No Changes]──> Skip Stage 2 ⏭️

Check Stage 3 Triggers
  │
  ├─[Manual OR High-Impact OR Code Changes]
  │   │
  │   v
  │ ┌──────────────────────────┐
  │ │ Stage 3: Full Validation │  (15 min, conditional)
  │ │ • Tests                  │
  │ │ • Code quality           │
  │ │ • Security               │
  │ └───────────┬──────────────┘
  │             │
  │             ├─[Pass]──> Success! ✅
  │             │
  │             └─[Fail]──> Exit (1)
  │
  └─[No Trigger]──> Skip Stage 3 ⏭️ -> Success! ✅
```

## Stage Metrics

Each stage tracks:
- **Duration**: Actual execution time
- **Target**: Expected completion time
- **Status**: success/failure/skipped
- **Steps Executed**: Which workflow steps ran
- **Trigger Reason**: Why the stage ran (or didn't)

### Viewing Metrics

```bash
# During execution - real-time progress
# Shows current stage, elapsed time, target time

# After completion - summary report
# Displays all stages with status and durations

# Historical metrics (coming in v2.9.0)
# Compare stage performance across runs
```

## Best Practices

### 1. Use Multi-Stage for Daily Development

```bash
# Your regular workflow
./src/workflow/execute_tests_docs_workflow.sh --multi-stage --auto
```

**Benefits**:
- Fast feedback for docs/script changes
- Automatic escalation to full validation when needed
- Reduced CI/CD time

### 2. Combine with Smart Execution

```bash
./src/workflow/execute_tests_docs_workflow.sh \
  --multi-stage \
  --smart-execution \
  --parallel
```

**Benefits**:
- Multi-stage provides macro-level optimization (which stages)
- Smart execution provides micro-level optimization (which steps within stages)
- Parallel execution runs independent steps simultaneously

### 3. Use Manual Trigger Before Releases

```bash
# Pre-release validation
./src/workflow/execute_tests_docs_workflow.sh \
  --multi-stage \
  --manual-trigger \
  --auto
```

**Benefits**:
- Ensures all 3 stages run
- Comprehensive validation
- Catches issues before deployment

### 4. Monitor Stage Patterns

Track which stages typically run for your project:
- **Docs-heavy projects**: Mostly Stages 1-2
- **Code-heavy projects**: Frequently Stage 3
- **Configuration projects**: Mixed patterns

Adjust workflow strategies accordingly.

## Troubleshooting

### Stage 2 Not Running When Expected

**Symptom**: Stage 2 skips even though you modified docs

**Possible Causes**:
- Changes not detected by git (unstaged)
- Files modified outside tracked patterns
- Stage 1 failed (prerequisite)

**Solution**:
```bash
# Stage changes
git add .

# Verify detection
./src/workflow/execute_tests_docs_workflow.sh --show-pipeline

# Check what's modified
git status
```

### Stage 3 Running When Not Expected

**Symptom**: Stage 3 runs for simple doc changes

**Possible Causes**:
- More than 10 files modified (high-impact trigger)
- Core library files included in changes
- Configuration files modified

**Solution**:
```bash
# Review modified files
git status

# Split changes into separate commits
git add -p  # Stage interactively

# Run on subset of changes
```

### All Stages Skipping

**Symptom**: Only Stage 1 runs, nothing else

**Possible Causes**:
- No git changes detected
- Changes already committed
- Working directory clean

**Solution**:
```bash
# Make sure changes are staged
git add .

# Or use manual trigger
./src/workflow/execute_tests_docs_workflow.sh \
  --multi-stage \
  --manual-trigger
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Multi-Stage Pipeline

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Multi-Stage Validation
        run: |
          /path/to/ai_workflow/src/workflow/execute_tests_docs_workflow.sh \
            --multi-stage \
            --smart-execution \
            --parallel \
            --auto
      
      - name: Upload Stage Metrics
        uses: actions/upload-artifact@v3
        with:
          name: stage-metrics
          path: .ai_workflow/metrics/
```

### GitLab CI Example

```yaml
validate:
  script:
    - /path/to/ai_workflow/src/workflow/execute_tests_docs_workflow.sh
        --multi-stage
        --smart-execution
        --parallel
        --auto
  artifacts:
    paths:
      - .ai_workflow/metrics/
    expire_in: 1 week
```

## Comparison with Other Modes

| Feature | Standard | Multi-Stage | Multi-Stage + Smart |
|---------|----------|-------------|---------------------|
| All steps run | Always | Conditional by stage | Conditional per step |
| Typical duration | 23 min | 5-18 min | 2-15 min |
| Flexibility | Low | Medium | High |
| Complexity | Low | Medium | Medium-High |
| Best for | Full validation | Daily development | Maximum performance |

## Advanced Configuration

### Custom Stage Targets

Edit `src/workflow/lib/multi_stage_pipeline.sh`:

```bash
# Adjust target times
STAGE_FAST_VALIDATION_TARGET=120   # 2 minutes (default)
STAGE_TARGETED_CHECKS_TARGET=300   # 5 minutes (default)
STAGE_FULL_VALIDATION_TARGET=900   # 15 minutes (default)
```

### Custom Stage Triggers

Modify trigger expressions:

```bash
# Stage 2 - make it run more often
STAGE_2_TRIGGER="stage_1_success AND (docs_changes OR script_changes OR structure_changes OR ANY_CHANGES)"

# Stage 3 - make it run less often
STAGE_3_TRIGGER="stage_2_success AND manual"  # Only with --manual-trigger
```

## Roadmap

### v2.9.0 (Planned)
- Stage performance metrics history
- Automated stage configuration optimization
- Team-wide stage pattern analysis
- Custom stage definitions

### v3.0.0 (Future)
- 5-stage pipeline (micro-stages)
- ML-driven stage triggers
- Parallel stage execution
- Stage-level caching

## Support

- **Documentation**: [docs/PROJECT_REFERENCE.md](PROJECT_REFERENCE.md)
- **Issues**: [GitHub Issues](https://github.com/mpbarbosa/ai_workflow/issues)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)

---

**Last Updated**: 2026-01-01  
**Version**: 2.8.0  
**Author**: Marcelo Pereira Barbosa ([@mpbarbosa](https://github.com/mpbarbosa))
