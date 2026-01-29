# Scripts

This directory contains utility scripts that can be adapted for different languages and projects.

## Available Scripts

### `cleanup_artifacts.sh.template`
Cleans up old workflow execution artifacts including logs, metrics, backlog reports, and AI cache files.

**Features:**
- Selective cleanup (logs, metrics, backlog, cache)
- Age-based cleanup (older than N days)
- Dry-run mode
- Confirmation prompts

**Usage:**
```bash
./cleanup_artifacts.sh --all --older-than 7
./cleanup_artifacts.sh --logs --dry-run
```

### `validate_context_blocks.py`
Python script to validate documentation context blocks and code examples.

**Requirements:**
- Python 3.6+

**Usage:**
```bash
python3 validate_context_blocks.py <directory>
```

## Creating Custom Scripts

When creating scripts for your project:
1. Copy the relevant template
2. Remove `.template` extension
3. Make executable: `chmod +x script.sh`
4. Replace placeholders with project-specific values
5. Test thoroughly before committing

## Script Placeholders

Common placeholders used in script templates:
- `{{PROJECT_ROOT}}` - Project root directory
- `{{ARTIFACT_DIR}}` - Artifact directory path (usually `.ai_workflow`)
- `{{LOG_DIR}}` - Log directory path
- `{{METRICS_DIR}}` - Metrics directory path

## Language-Specific Adaptations

These scripts are primarily bash-based but can be adapted to other languages:
- **JavaScript/Node.js**: Convert to Node.js scripts using `fs`, `path`, and `child_process` modules
- **Python**: Convert using `os`, `pathlib`, `shutil`, and `subprocess` modules
- **PowerShell**: Convert to PowerShell scripts for Windows environments

## Contributing

If you create useful scripts that could benefit other projects, consider contributing them back to ai_workflow_core.
