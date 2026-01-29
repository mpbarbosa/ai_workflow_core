# Workflow Templates

Pre-configured workflow templates for common development scenarios.

## Available Templates

### 1. Documentation-Only Workflow

**File**: `docs-only.sh`  
**Steps**: 0, 1, 2, 4, 12  
**Duration**: ~3-4 minutes  
**Use Case**: Documentation updates, README changes, guide improvements

```bash
./templates/workflows/docs-only.sh
```

**What it does**:
- Pre-analyzes changes
- Updates documentation
- Checks consistency
- Validates directory structure
- Lints markdown files

### 2. Test-Only Workflow

**File**: `test-only.sh`  
**Steps**: 0, 5, 6, 7, 9  
**Duration**: ~8-10 minutes  
**Use Case**: Test development, test fixes, adding test coverage

```bash
./templates/workflows/test-only.sh
```

**What it does**:
- Pre-analyzes changes
- Reviews existing tests
- Generates new tests
- Executes test suite
- Validates code quality

### 3. Feature Development Workflow

**File**: `feature.sh`  
**Steps**: All steps  
**Duration**: ~15-20 minutes  
**Use Case**: Feature development, major changes, releases

```bash
./templates/workflows/feature.sh
```

**What it does**:
- Full documentation validation
- Complete test suite
- Code quality checks
- Dependency validation
- Git finalization

## Features

All templates include:
- ✅ **Smart Execution** - Automatically skips unnecessary steps
- ✅ **Parallel Processing** - Runs independent steps simultaneously
- ✅ **Auto-commit** - Automatically commits workflow artifacts
- ✅ **Performance Optimized** - Uses all v2.6.0 optimizations

## Usage

### Basic Usage

```bash
# Run template directly
./templates/workflows/docs-only.sh

# Pass additional arguments
./templates/workflows/test-only.sh --verbose

# Disable auto-commit
./templates/workflows/feature.sh --no-auto-commit
```

### VS Code Integration

Templates are integrated with VS Code tasks:

1. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
2. Type "Tasks: Run Task"
3. Select a workflow template

Or use keyboard shortcuts:
- `Ctrl+Shift+B` - Run default task (Full Run)

## Customization

### Create Custom Template

```bash
cp templates/workflows/docs-only.sh templates/workflows/my-custom.sh
# Edit to customize steps and options
chmod +x templates/workflows/my-custom.sh
```

### Template Structure

```bash
#!/bin/bash
set -euo pipefail

# Locate workflow
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKFLOW_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Run workflow with custom options
"${WORKFLOW_ROOT}/src/workflow/execute_tests_docs_workflow.sh" \
    --steps X,Y,Z \
    --smart-execution \
    --parallel \
    --auto-commit \
    "$@"
```

## IDE Integration

### VS Code

Templates are pre-configured in `.vscode/tasks.json`:
- AI Workflow: Documentation Only
- AI Workflow: Test Only
- AI Workflow: Feature Development
- AI Workflow: Auto-commit
- AI Workflow: Metrics Dashboard

### JetBrains IDEs (IntelliJ, WebStorm, etc.)

Create External Tools:
1. Settings → Tools → External Tools
2. Add new tool
3. Program: `$ProjectFileDir$/templates/workflows/docs-only.sh`
4. Working directory: `$ProjectFileDir$`

### Vim/Neovim

Add to your `.vimrc` or `init.vim`:

```vim
" AI Workflow commands
command! WorkflowDocs :!./templates/workflows/docs-only.sh
command! WorkflowTests :!./templates/workflows/test-only.sh
command! WorkflowFull :!./templates/workflows/feature.sh
```

## Performance Expectations

| Template | Steps | Duration | Best For |
|----------|-------|----------|----------|
| docs-only | 5 | 3-4 min | Documentation changes |
| test-only | 5 | 8-10 min | Test development |
| feature | 15 | 15-20 min | Feature development |

## Auto-commit Behavior

All templates enable auto-commit by default. Committed artifacts include:
- Documentation files (`docs/**/*.md`)
- README files
- Test files (`tests/**/*.sh`)
- Source files (`src/**/*.sh`)
- Configuration files

**Excluded from auto-commit**:
- Log files (`.log`)
- Temporary files (`.tmp`)
- Backlog files (`.ai_workflow/backlog/**`)
- Node modules
- Coverage reports

## Troubleshooting

### Template Not Found

```bash
# Ensure templates are executable
chmod +x templates/workflows/*.sh

# Run from project root
cd /path/to/ai_workflow
./templates/workflows/docs-only.sh
```

### Auto-commit Not Working

```bash
# Check git status
git status

# Verify you're in a git repository
git rev-parse --git-dir

# Disable auto-commit if needed
./templates/workflows/docs-only.sh --no-auto-commit
```

### Wrong Steps Executed

Templates use fixed step configurations. To customize:

```bash
# Run workflow directly with custom steps
./src/workflow/execute_tests_docs_workflow.sh --steps 0,1,2
```

## See Also

- Main Workflow: `src/workflow/execute_tests_docs_workflow.sh`
- Usage Patterns: `CONTRIBUTING.md` (Workflow Usage Patterns section)
- VS Code Tasks: `.vscode/tasks.json`
- Auto-commit Module: `src/workflow/lib/auto_commit.sh`

---

**Version**: v2.6.0  
**Created**: 2025-12-24  
**Part of**: AI Workflow Automation - Developer Experience Enhancements
