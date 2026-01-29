# AI Workflow Directory Structure

The `.ai_workflow/` directory is used for workflow execution artifacts. This directory should be created in your project (not in the core repository) and is automatically managed by the workflow automation system.

## Directory Structure

Create this structure in your project:

```
.ai_workflow/
├── backlog/              # Workflow execution reports and step outputs
├── summaries/            # AI-generated summaries per workflow run
├── logs/                 # Detailed execution logs
├── metrics/              # Performance metrics and history
├── checkpoints/          # Checkpoint files for workflow resume capability
├── prompts/              # AI prompt templates and execution logs
├── ml_models/            # Machine learning models for workflow optimization
└── .incremental_cache/   # Cache for incremental processing
```

## Setup

When integrating ai_workflow_core into your project, create this directory structure:

```bash
# Option 1: Create manually
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# Option 2: Let the workflow create it automatically on first run
# (Most workflow implementations will auto-create this structure)
```

## Gitignore

Make sure your `.gitignore` includes these patterns (already in `.gitignore.template`):

```gitignore
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
```

The `prompts/` and `ml_models/` directories may optionally be committed if you want to track AI interactions and ML model evolution.

## Artifact Management

### Automatic Cleanup

The workflow automatically cleans up old artifacts based on retention policies (typically 7 days).

### Manual Cleanup

```bash
# Remove old workflow runs (older than 7 days)
find .ai_workflow/backlog -type d -mtime +7 -exec rm -rf {} \;
find .ai_workflow/logs -type d -mtime +7 -exec rm -rf {} \;

# Or use the cleanup script
./.workflow_core/scripts/cleanup_artifacts.sh --all --older-than 7
```

## Disk Space

Typical artifact sizes per workflow run:
- Backlog reports: ~100-500 KB
- Summaries: ~10-50 KB
- Logs: ~50-200 KB
- **Total per run**: ~200-800 KB

With 7-day retention at 1 run/day: ~1-6 MB

## Reference

For detailed information about artifact management and directory usage, see the original [ai_workflow](https://github.com/mpbarbosa/ai_workflow) project documentation.
