# AI Workflow Directory Structure

This directory contains the standard structure for AI workflow execution artifacts. These subdirectories are automatically created and managed by the workflow automation system.

## Directory Structure

```
.ai_workflow/
├── backlog/              # Workflow execution reports and step outputs
├── summaries/            # AI-generated summaries per workflow run
├── logs/                 # Detailed execution logs
├── metrics/              # Performance metrics and history
├── checkpoints/          # Checkpoint files for workflow resume capability
├── prompts/              # AI prompt templates and execution logs
├── ml_models/            # Machine learning models for workflow optimization
├── .incremental_cache/   # Cache for incremental processing
└── README.md             # Documentation (from source repository)
```

## Usage

### As a Submodule Consumer

When using ai_workflow_core as a submodule, create this directory structure in your project:

```bash
# Option 1: Copy the structure
cp -r .workflow_core/ai_workflow .ai_workflow

# Option 2: Create symlink (if your workflow allows)
ln -s .workflow_core/ai_workflow .ai_workflow

# Option 3: Let the workflow create it automatically on first run
# (Most workflow implementations will auto-create this structure)
```

### Artifact Management

The `README.md` file copied from the source repository contains detailed information about:
- Automatic cleanup policies
- Manual cleanup procedures
- Disk space management
- Subdirectory details

### Gitignore

Make sure your `.gitignore` includes workflow artifacts:

```gitignore
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
```

The `.ai_workflow/prompts/` and `.ai_workflow/ml_models/` directories may optionally be committed if you want to track AI interactions and ML model evolution.

## Integration

This directory structure is designed to work with:
- Shell-based workflow implementations
- JavaScript/Node.js workflow implementations
- Python workflow implementations
- Any language that can read/write files in this structure

## Example Prompts

The `prompts/` subdirectory includes example prompt templates that show how AI interactions are logged during workflow execution. Use these as reference when building language-specific implementations.
