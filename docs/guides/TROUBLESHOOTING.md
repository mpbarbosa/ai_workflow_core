# Troubleshooting Guide

**Version**: 1.0.2  
**Last Updated**: 2026-02-07

> **Purpose**: Solutions to common problems when integrating and using ai_workflow_core. Organized by problem category with step-by-step fixes.

---

## Table of Contents

- [Quick Diagnosis](#quick-diagnosis)
- [Submodule Issues](#submodule-issues)
- [Configuration Problems](#configuration-problems)
- [Directory Structure Issues](#directory-structure-issues)
- [Placeholder Problems](#placeholder-problems)
- [Version and Compatibility](#version-and-compatibility)
- [Integration Issues](#integration-issues)
- [Performance and Artifacts](#performance-and-artifacts)
- [Advanced Debugging](#advanced-debugging)

---

## Quick Diagnosis

### Run These Commands First

```bash
# 1. Check submodule status
git submodule status

# 2. Validate config syntax
yamllint .workflow-config.yaml 2>&1

# 3. Check for placeholders
grep "{{" .workflow-config.yaml

# 4. Verify directory structure
ls -la .ai_workflow/

# 5. Check submodule version
cd .workflow_core && git describe --tags 2>/dev/null && cd ..
```

**If all commands succeed with no errors**: Your setup is likely correct.

---

## Submodule Issues

### Problem: "fatal: not a git repository (or any of the parent directories): .git"

**Symptom**: Can't add submodule to project.

**Cause**: Not in a Git repository.

**Solution**:
```bash
# Initialize Git first
git init
git add .
git commit -m "Initial commit"

# Then add submodule
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
```

---

### Problem: ".workflow_core directory is empty"

**Symptom**: `.workflow_core/` exists but contains no files.

**Cause**: Submodule not initialized.

**Solution 1** (Quick fix):
```bash
git submodule update --init --recursive
```

**Solution 2** (If solution 1 fails):
```bash
# Remove and re-add submodule
git submodule deinit -f .workflow_core
rm -rf .git/modules/workflow_core
git rm -f .workflow_core
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
git submodule update --init --recursive
```

---

### Problem: "Submodule shows modified but I didn't change anything"

**Symptom**: `git status` shows `.workflow_core` as modified.

**Cause**: Submodule HEAD is detached or pointing to different commit.

**Diagnosis**:
```bash
cd .workflow_core
git status
cd ..
```

**Solution 1** (Reset to tracked commit):
```bash
git submodule update --init --recursive
```

**Solution 2** (Update to latest):
```bash
cd .workflow_core
git checkout main
git pull origin main
cd ..
git add .workflow_core
git commit -m "chore: update ai_workflow_core submodule"
```

---

### Problem: "Submodule URL is wrong"

**Symptom**: Can't fetch/update submodule.

**Diagnosis**:
```bash
git config --file=.gitmodules submodule.workflow_core.url
# Check if URL is correct
```

**Solution**:
```bash
# Update URL in .gitmodules
git config --file=.gitmodules submodule.workflow_core.url https://github.com/mpbarbosa/ai_workflow_core.git

# Sync configuration
git submodule sync
git submodule update --init --recursive
```

---

### Problem: "Cannot clone repository" when others clone project

**Symptom**: Collaborators can't initialize submodule.

**Cause**: Submodule not properly committed.

**Solution** (Project owner):
```bash
# Ensure submodule is tracked
git add .gitmodules .workflow_core
git commit -m "chore: add ai_workflow_core submodule"
git push origin main
```

**Solution** (Collaborators):
```bash
# Clone with submodules
git clone --recurse-submodules <project-url>

# OR after cloning
git submodule update --init --recursive
```

---

## Configuration Problems

### Problem: "mapping values are not allowed here"

**Symptom**: YAML syntax error when running `yamllint`.

**Cause**: YAML indentation error or missing quotes.

**Common Mistakes**:

```yaml
# ❌ Wrong: Missing quotes around string with special chars
description: This is: my project

# ✅ Correct: Quote strings with colons
description: "This is: my project"

# ❌ Wrong: Inconsistent indentation
project:
  name: "Test"
   type: "nodejs"  # Extra space

# ✅ Correct: Consistent 2-space indentation
project:
  name: "Test"
  type: "nodejs"
```

**Solution**:
1. Use an editor with YAML syntax highlighting
2. Check indentation (must be 2 spaces)
3. Quote strings containing: `:`, `#`, `{`, `}`, `[`, `]`, `&`, `*`, `?`, `|`, `-`, `<`, `>`, `=`, `!`, `%`, `@`

---

### Problem: "Project kind not recognized"

**Symptom**: Validation errors about unknown project kind.

**Cause**: Typo or invalid `project.kind` value.

**Valid project kinds** (underscored format):
- `shell_script_automation`
- `nodejs_api`
- `client_spa`
- `react_spa`
- `static_website`
- `python_app`
- `configuration_library`
- `generic`

**Solution**:
```bash
# Check valid kinds
grep "^  [a-z_]*:" .workflow_core/config/project_kinds.yaml

# Update your config with valid kind
# Edit .workflow-config.yaml
```

**Example**:
```yaml
# ❌ Wrong
project:
  kind: "nodejs-api"  # Uses hyphens

# ✅ Correct
project:
  kind: "nodejs_api"  # Uses underscores
```

---

### Problem: "Confusion between project.type and project.kind"

**Symptom**: Config seems correct but validation fails.

**Explanation**:
- `project.type`: Uses **hyphens** (e.g., `"nodejs-application"`)
- `project.kind`: Uses **underscores** (e.g., `"nodejs_api"`)

**Solution**:
```yaml
# ✅ Correct usage
project:
  name: "My API"
  type: "nodejs-application"  # Hyphenated (describes project broadly)
  kind: "nodejs_api"          # Underscored (matches project_kinds.yaml)
  
# ❌ Wrong (swapped)
project:
  type: "nodejs_api"          # Wrong: don't use underscore here
  kind: "nodejs-application"  # Wrong: don't use hyphen here
```

---

### Problem: "Config file not found"

**Symptom**: Tools can't find `.workflow-config.yaml`.

**Diagnosis**:
```bash
ls -la .workflow-config.yaml
# Check if file exists at project root
```

**Solution 1** (File missing):
```bash
# Copy template
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
# Edit and replace placeholders
```

**Solution 2** (File in wrong location):
```bash
# Move to project root
mv path/to/.workflow-config.yaml .workflow-config.yaml
```

---

## Directory Structure Issues

### Problem: ".ai_workflow directory missing"

**Symptom**: Tools expect `.ai_workflow/` but it doesn't exist.

**Solution**:
```bash
# Create standard structure
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}
```

---

### Problem: "Permission denied when creating directories"

**Symptom**: `mkdir: cannot create directory '.ai_workflow': Permission denied`

**Cause**: Insufficient permissions.

**Solution**:
```bash
# Check current directory ownership
ls -la

# If owned by different user, use sudo
sudo mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}
sudo chown -R $USER:$USER .ai_workflow
```

---

### Problem: "Artifacts committed to Git"

**Symptom**: Generated files in `.ai_workflow/` are being tracked by Git.

**Cause**: `.gitignore` missing or incorrect patterns.

**Diagnosis**:
```bash
# Check if artifacts are ignored
git check-ignore .ai_workflow/logs/test.log
# Should output: .ai_workflow/logs/test.log

# If not, .gitignore is missing patterns
```

**Solution**:
```bash
# Add patterns to .gitignore
cat >> .gitignore << 'EOF'

# AI Workflow artifacts (generated files)
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
EOF

# Remove already-tracked files
git rm -r --cached .ai_workflow/backlog/
git rm -r --cached .ai_workflow/summaries/
git rm -r --cached .ai_workflow/logs/
git rm -r --cached .ai_workflow/metrics/
git rm -r --cached .ai_workflow/checkpoints/
git rm -r --cached .ai_workflow/.incremental_cache/
git commit -m "chore: stop tracking workflow artifacts"
```

---

### Problem: "Old directory structure (src/workflow)"

**Symptom**: Have `src/workflow/` instead of `.ai_workflow/`.

**Cause**: Using older version or outdated examples.

**Solution** (Migrate to new structure):
```bash
# Create new structure
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# Move existing artifacts (if any)
mv src/workflow/* .ai_workflow/ 2>/dev/null || true

# Update scripts referencing old path
grep -r "src/workflow" . --exclude-dir=.git --exclude-dir=node_modules
# Manually update found files: src/workflow → .ai_workflow

# Remove old directory
rm -rf src/workflow
```

---

## Placeholder Problems

### Problem: "Placeholders still in configuration"

**Symptom**: `grep "{{" .workflow-config.yaml` returns matches.

**Cause**: Forgot to replace placeholders after copying template.

**Diagnosis**:
```bash
# Find all remaining placeholders
grep -n "{{" .workflow-config.yaml
```

**Solution**:
```bash
# Replace each placeholder manually in editor
# OR use sed (be careful with special characters)

# Example: Replace project name
sed -i 's/{{PROJECT_NAME}}/My Project/g' .workflow-config.yaml

# Example: Replace language
sed -i 's/{{LANGUAGE}}/javascript/g' .workflow-config.yaml
```

**Common placeholders to replace**:
- `{{PROJECT_NAME}}` → Your project name
- `{{PROJECT_TYPE}}` → Use hyphens (e.g., "nodejs-application")
- `{{PROJECT_KIND}}` → Use underscores (e.g., "nodejs_api")
- `{{PROJECT_DESCRIPTION}}` → Brief description
- `{{VERSION}}` → Version without 'v' prefix (e.g., "1.0.2")
- `{{LANGUAGE}}` → Primary language (e.g., "javascript", "python", "bash")
- `{{TEST_COMMAND}}` → Command to run tests (e.g., "npm test")
- `{{LINT_COMMAND}}` → Command to run linter (e.g., "eslint .")

---

### Problem: "Version format error"

**Symptom**: Version validation fails.

**Cause**: Incorrect version format.

**Solution**:
```yaml
# ❌ Wrong: Includes 'v' prefix
project:
  version: "v1.0.2"

# ❌ Wrong: Not semantic versioning
project:
  version: "1.0"

# ✅ Correct: Semantic versioning, no 'v'
project:
  version: "1.0.2"
```

---

## Version and Compatibility

### Problem: "Features don't work as documented"

**Symptom**: Documentation describes features that don't exist.

**Cause**: Version mismatch between docs and installed version.

**Diagnosis**:
```bash
# Check installed version
cd .workflow_core && git describe --tags && cd ..

# Check documentation version
head -5 .workflow_core/README.md | grep -i version
```

**Solution**:
```bash
# Update to latest stable
cd .workflow_core
git fetch --tags
git checkout v1.0.2  # or latest version
cd ..
git add .workflow_core
git commit -m "chore: update ai_workflow_core to v1.0.2"
```

---

### Problem: "Breaking changes after update"

**Symptom**: Project breaks after updating submodule.

**Cause**: Major version upgrade with breaking changes.

**Solution**:
1. Review `CHANGELOG.md` for breaking changes
2. Follow migration guide: `docs/guides/MIGRATION_GUIDE.md`
3. If too complex, rollback:
   ```bash
   cd .workflow_core
   git checkout v1.0.2  # Previous working version
   cd ..
   git add .workflow_core
   git commit -m "chore: rollback ai_workflow_core"
   ```

---

### Problem: "Parent project version incompatibility"

**Symptom**: ai_workflow (parent) doesn't work with ai_workflow_core.

**Cause**: Incompatible versions.

**Compatibility**:
- ai_workflow_core v1.0.2 → ai_workflow v1.1.0+

**Solution**:
```bash
# Check versions
cd .workflow_core && git describe --tags && cd ..
# Compare with parent project requirements
```

---

## Integration Issues

### Problem: "Examples don't match my language"

**Symptom**: Want to integrate but no example for your language.

**Available examples**:
- Shell: `examples/shell/`
- Node.js: `examples/nodejs/`

**Solution** (No example for your language):
1. Start with most similar example (shell for scripting, nodejs for apps)
2. Follow `docs/INTEGRATION.md` generic guide
3. Adapt configuration for your language
4. Contribute your example back to project!

---

### Problem: "Can't find integration health check script"

**Symptom**: `check_integration_health.sh` not found.

**Cause**: Script doesn't exist in v1.0.2 (may be future feature).

**Workaround**:
```bash
# Manual health check
echo "Checking integration..."

# 1. Submodule exists and initialized
[ -d ".workflow_core" ] && echo "✓ Submodule exists" || echo "✗ Submodule missing"

# 2. Config exists
[ -f ".workflow-config.yaml" ] && echo "✓ Config exists" || echo "✗ Config missing"

# 3. No placeholders
if ! grep -q "{{" .workflow-config.yaml 2>/dev/null; then
  echo "✓ No placeholders"
else
  echo "✗ Placeholders found"
fi

# 4. Directory structure
[ -d ".ai_workflow" ] && echo "✓ Artifact directory exists" || echo "✗ Artifact directory missing"

# 5. Gitignore configured
if grep -q ".ai_workflow" .gitignore 2>/dev/null; then
  echo "✓ Gitignore configured"
else
  echo "✗ Gitignore missing patterns"
fi
```

---

### Problem: "GitHub workflows not working"

**Symptom**: Copied workflows fail in GitHub Actions.

**Common causes**:
1. Workflow needs customization for your project
2. Missing secrets or environment variables
3. Test/lint commands don't match your setup

**Solution**:
```bash
# Review workflow file
cat .github/workflows/code-quality.yml

# Verify test command matches config
grep "test_command:" .workflow-config.yaml

# Update workflow to match your setup
# Edit .github/workflows/*.yml
```

---

## Performance and Artifacts

### Problem: ".ai_workflow directory growing too large"

**Symptom**: Directory size is excessive.

**Diagnosis**:
```bash
du -sh .ai_workflow/*
# Check size of each subdirectory
```

**Solution**:
```bash
# Clean old artifacts (if cleanup script available)
bash scripts/cleanup_artifacts.sh --older-than 30

# Manual cleanup (careful!)
# Remove old logs
find .ai_workflow/logs -type f -mtime +30 -delete

# Remove old metrics
find .ai_workflow/metrics -type f -mtime +30 -delete

# Clear cache (regenerates as needed)
rm -rf .ai_workflow/.incremental_cache/*
```

---

### Problem: "Artifacts not being created"

**Symptom**: `.ai_workflow/` subdirectories remain empty.

**Cause**: Not using workflow execution engine (this repo only provides templates).

**Explanation**:
- **ai_workflow_core**: Configuration templates only
- **ai_workflow** (parent): Execution engine that creates artifacts

**Solution**:
If you need workflow execution, see parent project: [mpbarbosa/ai_workflow](https://github.com/mpbarbosa/ai_workflow)

---

## Advanced Debugging

### Enable Detailed Logging

**For script debugging**:
```bash
# Run scripts with debug mode
bash -x scripts/cleanup_artifacts.sh

# OR add to script
set -x  # Enable debug mode
set +x  # Disable debug mode
```

**For YAML validation**:
```bash
# Verbose yamllint
yamllint -f parsable .workflow-config.yaml
```

---

### Inspect Submodule State

```bash
# Show submodule details
git submodule status --recursive

# Show commit details
cd .workflow_core
git log --oneline -10
git remote -v
git branch -a
cd ..
```

---

### Verify File Permissions

```bash
# Check permissions
ls -la .workflow-config.yaml
ls -la .ai_workflow/

# Fix if needed
chmod 644 .workflow-config.yaml
chmod 755 .ai_workflow/
```

---

### Clean Slate Reset

**If nothing works**, start fresh:

```bash
# CAUTION: This removes all customizations!

# 1. Remove submodule
git submodule deinit -f .workflow_core
rm -rf .git/modules/workflow_core
git rm -f .workflow_core

# 2. Remove config
rm .workflow-config.yaml

# 3. Start over
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
git submodule update --init --recursive
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# 4. Follow quick start guide
# See: docs/guides/QUICK_START.md
```

---

## Getting Help

### Before Asking for Help

Collect this information:

```bash
# System info
echo "OS: $(uname -s) $(uname -r)"
echo "Git: $(git --version)"

# Project info
echo "Submodule version:"
cd .workflow_core && git describe --tags 2>/dev/null && cd ..

echo "Config validation:"
yamllint .workflow-config.yaml 2>&1 | head -10

echo "Placeholder check:"
grep "{{" .workflow-config.yaml

echo "Directory structure:"
ls -la .ai_workflow/ 2>&1
```

### Where to Get Help

1. **Search Issues**: [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)
2. **Create New Issue**: Include information from "Before Asking for Help"
3. **Check FAQ**: `docs/guides/FAQ.md`
4. **Review Guides**: `docs/INTEGRATION.md`, `docs/guides/QUICK_START.md`

### Issue Template

```markdown
**Problem**: [Brief description]

**Environment**:
- OS: [Linux/macOS/Windows]
- ai_workflow_core version: [e.g., v1.0.2]
- Git version: [e.g., 2.34.1]

**Steps to Reproduce**:
1. [First step]
2. [Second step]
3. [Error occurs]

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]

**Error Messages**:
```
[Paste error messages here]
```

**Configuration** (sanitized):
```yaml
[Paste relevant config sections]
```

**Already Tried**:
- [List troubleshooting steps you've attempted]
```

---

**Last Updated**: 2026-02-07  
**Document Version**: 1.0.2
