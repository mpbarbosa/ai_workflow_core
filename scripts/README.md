# Scripts

This directory contains utility scripts that can be adapted for different languages and projects.

## Available Scripts

### `check_integration_health.sh.template`

**NEW**: Comprehensive integration health check and validation

**Purpose**: Validate ai_workflow_core integration and detect configuration issues

**Usage:**
```bash
# Copy to project root first (or use directly from submodule)
bash .workflow_core/scripts/check_integration_health.sh

# Automatically fix common issues
bash .workflow_core/scripts/check_integration_health.sh --fix
```

**What it checks:**
- ✅ Submodule presence and initialization
- ✅ Submodule version (tag/branch/detached HEAD)
- ✅ Configuration file existence and validity
- ✅ Unreplaced placeholders
- ✅ YAML syntax (if yamllint installed)
- ✅ Artifact directory structure
- ✅ .gitignore configuration
- ✅ Git tracking status
- ✅ Integration consistency

**Exit codes:**
- `0` - All checks passed
- `1` - One or more checks failed
- `2` - Critical errors (submodule missing)

**Integration with CI/CD:**
```yaml
# .github/workflows/integration-health.yml
- name: Run health check
  run: bash .workflow_core/scripts/check_integration_health.sh
```

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

### `validate_structure.py`
Python script to validate repository directory structure for empty directories, undocumented directories, and required directories.

**Features:**
- Detects empty directories (excluding allowed exceptions)
- Identifies undocumented directories not in known structure
- Verifies required directories exist
- Auto-fix mode to remove empty directories

**Requirements:**
- Python 3.6+

**Usage:**
```bash
# Validate structure
python3 validate_structure.py

# Validate and auto-fix empty directories
python3 validate_structure.py --fix

# Quiet mode (errors only)
python3 validate_structure.py --quiet
```

**Exit Codes:**
- 0: Structure is valid
- 1: Validation errors found
- 2: Script error

## Creating Custom Scripts

When creating scripts for your project:
1. Copy the relevant template
2. Remove `.template` extension
3. Make executable: `chmod +x script.sh`
4. Replace placeholders with project-specific values
5. Test thoroughly before committing

## Script Placeholders

Common placeholders used in script templates:
- `{{PROJECT_ROOT}}` - Project root directory (or use `$(git rev-parse --show-toplevel)`)
- `{{ARTIFACT_DIR}}` - Artifact directory path (usually `.ai_workflow`)
- `{{LOG_DIR}}` - Log directory path
- `{{METRICS_DIR}}` - Metrics directory path

## Language-Specific Adaptations

These scripts are primarily bash-based but can be adapted to other languages:
- **JavaScript/Node.js**: Convert to Node.js scripts using `fs`, `path`, and `child_process` modules
- **Python**: Convert using `os`, `pathlib`, `shutil`, and `subprocess` modules
- **PowerShell**: Convert to PowerShell scripts for Windows environments

## Best Practices for Dynamic Codebases

1. **Run health checks regularly** - Weekly validation recommended
2. **Automate in CI/CD** - Add health checks to pipelines
3. **Use `--fix` mode carefully** - Only in development, review changes
4. **Monitor submodule versions** - Track updates and changes
5. **Version control scripts** - Commit customized scripts to project

### Integration Health Checks

For frequently changing projects:

- **Before deployments**: Always run health check
- **After submodule updates**: Validate integration
- **In CI/CD**: Automate validation on every commit
- **Weekly maintenance**: Schedule regular checks

See [Integration Best Practices](../docs/guides/INTEGRATION_BEST_PRACTICES.md) for comprehensive guidance.

## Resources

- [Integration Guide](../docs/INTEGRATION.md) - Setup and configuration
- [Version Management](../docs/guides/VERSION_MANAGEMENT.md) - Managing versions in dynamic codebases
- [Integration Best Practices](../docs/guides/INTEGRATION_BEST_PRACTICES.md) - Maintenance strategies

## Contributing

If you create useful scripts that could benefit other projects, consider contributing them back to ai_workflow_core.
