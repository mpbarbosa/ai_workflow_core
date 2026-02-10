# Command Cheat Sheet

**Version**: 1.0.0  
**Last Updated**: 2026-02-10

> **Quick reference** for all ai_workflow_core commands

---

## Git Submodule Commands

### Initial Setup
```bash
# Add submodule to project
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core

# Initialize and clone submodule
git submodule update --init --recursive

# Clone project with submodules
git clone --recurse-submodules <repo-url>
```

### Updating Submodule
```bash
# Update to latest commit
cd .workflow_core && git pull origin main && cd ..

# Update submodule reference in parent
git add .workflow_core
git commit -m "chore: update ai_workflow_core submodule"

# Update all submodules
git submodule update --remote --merge
```

### Checking Submodule Status
```bash
# Show submodule status
git submodule status

# Show submodule details
git submodule

# Check submodule version
cd .workflow_core && git describe --tags
```

---

## Configuration Commands

### Setup
```bash
# Copy template
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Edit configuration
$EDITOR .workflow-config.yaml

# Validate YAML
yamllint .workflow-config.yaml
```

### Placeholder Replacement
```bash
# Find unreplaced placeholders
grep -r "{{.*}}" .workflow-config.yaml

# Replace placeholder (manual)
sed -i 's/{{PROJECT_NAME}}/My Project/g' .workflow-config.yaml

# Check for specific placeholder
grep "{{PROJECT_NAME}}" .workflow-config.yaml
```

---

## Directory Structure Commands

### Create Standard Directories
```bash
# Create artifact directories
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# Create project directories
mkdir -p src tests docs config scripts

# Verify structure
tree -L 2 .ai_workflow/
```

### Validate Structure
```bash
# Validate directory structure
python3 .workflow_core/scripts/validate_structure.py

# Auto-fix empty directories
python3 .workflow_core/scripts/validate_structure.py --fix

# Quiet mode
python3 .workflow_core/scripts/validate_structure.py --quiet
```

---

## Validation Commands

### YAML Validation
```bash
# Validate all YAML
yamllint -d relaxed config/

# Validate specific file
yamllint .workflow-config.yaml

# Strict validation
yamllint config/
```

### Shell Script Validation
```bash
# Validate all scripts
shellcheck scripts/*.sh

# Validate specific script
shellcheck scripts/cleanup_artifacts.sh

# Check with external sources
shellcheck -x scripts/*.sh
```

### Documentation Validation
```bash
# Validate all documentation
python3 .workflow_core/scripts/validate_context_blocks.py docs/

# Validate specific directory
python3 .workflow_core/scripts/validate_context_blocks.py docs/guides/

# Validate single file
python3 .workflow_core/scripts/validate_context_blocks.py docs/guides/QUICK_START.md
```

### Integration Health Check
```bash
# Check integration health
bash .workflow_core/scripts/check_integration_health.sh

# Auto-fix issues
bash .workflow_core/scripts/check_integration_health.sh --fix

# CI mode (no color)
NO_COLOR=1 bash .workflow_core/scripts/check_integration_health.sh
```

---

## Cleanup Commands

### Artifact Cleanup
```bash
# Clean all artifacts older than 30 days
./scripts/cleanup_artifacts.sh --all

# Clean specific types
./scripts/cleanup_artifacts.sh --logs --metrics

# Custom age threshold
./scripts/cleanup_artifacts.sh --all --older-than 7

# Dry run
./scripts/cleanup_artifacts.sh --all --dry-run

# Skip confirmation
./scripts/cleanup_artifacts.sh --all --yes
```

### Manual Cleanup
```bash
# Remove old logs
find .ai_workflow/logs -type f -mtime +30 -delete

# Remove old metrics
find .ai_workflow/metrics -type f -mtime +30 -delete

# Clean cache
rm -rf .ai_workflow/.incremental_cache/*

# Clean all artifacts
rm -rf .ai_workflow/{logs,metrics,backlog,summaries}/*
```

---

## Workflow Commands

### Copy Workflow Templates
```bash
# Copy all workflows
cp .workflow_core/workflow-templates/workflows/*.yml .github/workflows/

# Copy specific workflow
cp .workflow_core/workflow-templates/workflows/code-quality.yml .github/workflows/

# Create workflow directory
mkdir -p .github/workflows
```

### Run Workflows Locally
```bash
# Using act (GitHub Actions locally)
act -l  # List workflows
act     # Run all workflows

# Validate workflow syntax
yamllint .github/workflows/
```

---

## Testing Commands

### Run All Tests
```bash
# Complete test suite
yamllint -d relaxed config/ && \
shellcheck scripts/*.sh && \
python3 .workflow_core/scripts/validate_structure.py && \
python3 .workflow_core/scripts/validate_context_blocks.py docs/
```

### Individual Tests
```bash
# YAML linting
yamllint -d relaxed config/

# Shell linting
shellcheck scripts/*.sh

# Python linting
pylint scripts/*.py

# Structure validation
python3 .workflow_core/scripts/validate_structure.py

# Documentation validation
python3 .workflow_core/scripts/validate_context_blocks.py docs/
```

---

## Git Commands

### Configuration Tracking
```bash
# Check if config is tracked
git ls-files .workflow-config.yaml

# Untrack config (if private)
git rm --cached .workflow-config.yaml
echo ".workflow-config.yaml" >> .gitignore

# Track config (if public)
git add .workflow-config.yaml
```

### Artifact Tracking
```bash
# Verify .gitignore
git check-ignore .ai_workflow/logs/test.log

# Show ignored files
git status --ignored

# Add artifact exceptions
echo "!.ai_workflow/prompts/" >> .gitignore
```

---

## CI/CD Commands

### GitHub Actions
```bash
# Trigger workflow
gh workflow run code-quality.yml

# View workflow runs
gh run list

# View workflow logs
gh run view <run-id>
```

### Pre-commit Hooks
```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run manually
pre-commit run --all-files

# Update hooks
pre-commit autoupdate
```

---

## Diagnostic Commands

### System Check
```bash
# Check required tools
which yamllint shellcheck python3 git

# Version check
yamllint --version
shellcheck --version
python3 --version
git --version
```

### Project Status
```bash
# Git status
git status
git submodule status

# Configuration check
ls -la .workflow-config.yaml
cat .workflow-config.yaml | grep -v "^#" | grep -v "^$"

# Directory check
tree -L 2 -a .ai_workflow/
```

### Troubleshooting
```bash
# Check for placeholders
grep -r "{{.*}}" .

# Find empty directories
find . -type d -empty

# Check file permissions
ls -la scripts/

# Verify submodule
git diff .workflow_core
```

---

## Quick Workflows

### New Project Setup
```bash
# 1. Add submodule
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core

# 2. Copy and customize config
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
$EDITOR .workflow-config.yaml

# 3. Create directories
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# 4. Setup .gitignore
cat >> .gitignore << 'EOF'
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/.incremental_cache/
EOF

# 5. Validate
bash .workflow_core/scripts/check_integration_health.sh
```

### Daily Development
```bash
# Morning routine
git pull
git submodule update --init --recursive
python3 .workflow_core/scripts/validate_structure.py

# Before commit
yamllint .workflow-config.yaml
python3 .workflow_core/scripts/validate_structure.py
pre-commit run --all-files

# Weekly maintenance
bash .workflow_core/scripts/check_integration_health.sh
./scripts/cleanup_artifacts.sh --all --older-than 30
```

### Version Update
```bash
# 1. Check current version
cd .workflow_core && git describe --tags && cd ..

# 2. Update to latest
cd .workflow_core
git fetch --tags
git checkout v1.1.0  # Or latest tag
cd ..

# 3. Update reference
git add .workflow_core
git commit -m "chore: update ai_workflow_core to v1.1.0"

# 4. Verify integration
bash .workflow_core/scripts/check_integration_health.sh
```

---

## Emergency Commands

### Submodule Issues
```bash
# Reinitialize submodule
git submodule deinit -f .workflow_core
git submodule update --init --recursive

# Remove and re-add
git submodule deinit -f .workflow_core
rm -rf .git/modules/.workflow_core
git rm -f .workflow_core
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
```

### Configuration Issues
```bash
# Reset to template
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Fix permissions
chmod 644 .workflow-config.yaml

# Validate
yamllint .workflow-config.yaml
```

### Structure Issues
```bash
# Recreate directories
rm -rf .ai_workflow
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# Fix permissions
chmod -R 755 .ai_workflow

# Validate
python3 .workflow_core/scripts/validate_structure.py --fix
```

---

## Related Documentation

- [Quick Start Guide](../guides/QUICK_START.md)
- [Troubleshooting Guide](../guides/TROUBLESHOOTING.md)
- [Integration Quick Reference](../INTEGRATION_QUICK_REFERENCE.md)

---

**Last Updated**: 2026-02-10
