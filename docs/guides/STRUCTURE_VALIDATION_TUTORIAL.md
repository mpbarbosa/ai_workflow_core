# Structure Validation Tutorial

**Version**: 1.0.1  
**Last Updated**: 2026-02-07  
**Audience**: Developers and contributors  
**Difficulty**: Beginner

> **Purpose**: Step-by-step tutorial for setting up and using automated structure validation in your project.

---

## Table of Contents

- [Overview](#overview)
- [What You'll Learn](#what-youll-learn)
- [Prerequisites](#prerequisites)
- [Tutorial Steps](#tutorial-steps)
- [Common Scenarios](#common-scenarios)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Overview

This tutorial teaches you how to implement automated directory structure validation in your project using ai_workflow_core's validation tools. You'll set up three layers of protection:

1. **Local validation** - Run manually when needed
2. **Pre-commit hooks** - Automatic validation before commits
3. **CI/CD validation** - Automatic validation on push/pull requests

**Time required**: 15 minutes  
**Difficulty**: Beginner

---

## What You'll Learn

By the end of this tutorial, you'll be able to:

- ✅ Run structure validation locally
- ✅ Configure pre-commit hooks for automatic validation
- ✅ Set up CI/CD workflows for continuous validation
- ✅ Customize validation rules for your project
- ✅ Fix common structure issues automatically
- ✅ Integrate validation into your development workflow

---

## Prerequisites

Before starting, ensure you have:

- ✅ Python 3.8 or higher installed
- ✅ Git repository initialized
- ✅ ai_workflow_core added as a submodule (`.workflow_core/`)
- ✅ Basic command-line knowledge

**Optional but recommended**:
- pip (Python package manager)
- GitHub Actions enabled (for CI/CD)

---

## Tutorial Steps

### Step 1: Verify Setup (2 minutes)

First, verify ai_workflow_core is properly integrated:

```bash
# Check submodule exists
ls -la .workflow_core/

# Verify validation script exists
ls -la .workflow_core/scripts/validate_structure.py

# Check Python version
python3 --version  # Should be 3.8+
```

**Expected output**:
```
.workflow_core/
  ├── scripts/
  │   └── validate_structure.py  ✓
  └── ...
```

---

### Step 2: Run Local Validation (3 minutes)

Let's run the validation script to check your project structure:

```bash
# Run from project root
python3 .workflow_core/scripts/validate_structure.py
```

**Possible outcomes**:

**✅ Success** (clean structure):
```
======================================================================
✅ Structure validation PASSED

Repository structure is clean and documented.
======================================================================
```

**❌ Found issues** (needs fixing):
```
======================================================================
❌ Structure validation FAILED

Found 2 issues:
  • Empty directory: docs/old_drafts/
  • Empty directory: tests/temp/
  
Tip: Run with --fix to automatically remove empty directories
======================================================================
```

**If you see failures**, continue to Step 2b.

---

### Step 2b: Fix Issues Automatically (1 minute)

If validation found empty directories, use auto-fix:

```bash
# Auto-remove empty directories
python3 .workflow_core/scripts/validate_structure.py --fix
```

**What happens**:
- Script identifies empty directories
- Removes empty directories (excluding allowed ones like `.ai_workflow/`)
- Re-validates structure
- Shows final status

**Expected output**:
```
🔧 Fixing: Removing empty directories...
  Removed: docs/old_drafts/
  Removed: tests/temp/
✅ Removed 2 empty directories

✅ Structure validation PASSED
```

---

### Step 3: Copy Validation Script (Optional) (2 minutes)

For convenience, copy the script to your project:

```bash
# Create scripts directory if needed
mkdir -p scripts

# Copy validation script
cp .workflow_core/scripts/validate_structure.py scripts/

# Make executable
chmod +x scripts/validate_structure.py
```

**Benefits**:
- Shorter command: `python3 scripts/validate_structure.py`
- Can customize for your project structure
- Works if submodule is missing

**Customization**:
Edit `scripts/validate_structure.py` to match your project:

```python
# Line 39-46: Define your required directories
REQUIRED_DIRS = [
    'src',          # Your source code
    'tests',        # Your tests
    'docs',         # Your documentation
    'config',       # Your configuration
]

# Line 49-70: Define your known structure
KNOWN_STRUCTURE = {
    'src',
    'src/components',
    'src/utils',
    'tests',
    'tests/unit',
    'tests/integration',
    'docs',
    # ... add your directories
}
```

---

### Step 4: Set Up Pre-commit Hooks (3 minutes)

Automate validation before each commit:

```bash
# Install pre-commit
pip install pre-commit

# Copy pre-commit config
cp .workflow_core/.pre-commit-config.yaml .pre-commit-config.yaml

# Install hooks
pre-commit install
```

**Verify installation**:
```bash
# Run pre-commit manually
pre-commit run validate-structure --all-files
```

**Expected output**:
```
Validate directory structure.................................Passed
```

**What happens now**:
- Every time you run `git commit`, validation runs automatically
- If structure issues found, commit is blocked
- Fix issues, then commit succeeds

**Example workflow**:
```bash
# Try to commit
git add .
git commit -m "Add new feature"

# Pre-commit runs automatically
Validate directory structure.................................Passed
[main abc1234] Add new feature
```

---

### Step 5: Set Up CI/CD Validation (3 minutes)

Add GitHub Actions workflow for continuous validation:

```bash
# Create workflows directory
mkdir -p .github/workflows

# Copy validation workflow
cp .workflow_core/workflow-templates/workflows/validate-structure.yml \
   .github/workflows/validate-structure.yml

# Commit and push
git add .github/workflows/validate-structure.yml
git commit -m "Add structure validation workflow"
git push
```

**What happens**:
- Workflow runs on every push and pull request
- Validates structure in CI environment
- Fails build if structure issues found
- Shows detailed report in GitHub Actions tab

**View workflow results**:
1. Go to your GitHub repository
2. Click "Actions" tab
3. See "Validate Directory Structure" workflow
4. Click on a run to see details

**Example workflow output**:
```
✅ Run structure validation
✅ Check for empty directories  
✅ Verify required directories
✅ Generate structure report
```

---

### Step 6: Test the Complete Setup (2 minutes)

Let's verify all three layers work:

**Test 1: Local validation**
```bash
python3 scripts/validate_structure.py
# Should pass ✅
```

**Test 2: Pre-commit hook**
```bash
# Create test empty directory
mkdir test_empty_dir

# Try to commit
git add .
git commit -m "Test commit"

# Pre-commit should fail ❌
# Validate directory structure.................................Failed
```

**Test 3: Remove issue and retry**
```bash
# Remove empty directory
rmdir test_empty_dir

# Commit should now succeed ✅
git commit -m "Test commit"
```

**Test 4: CI/CD** (if GitHub Actions enabled)
```bash
git push
# Check GitHub Actions tab - should pass ✅
```

---

## Common Scenarios

### Scenario 1: Adding New Directories

When adding legitimate new directories to your project:

**Step 1**: Create the directory with content
```bash
mkdir -p docs/architecture
touch docs/architecture/README.md
```

**Step 2**: Update validation script (if using custom copy)
```python
# In scripts/validate_structure.py
KNOWN_STRUCTURE = {
    'docs',
    'docs/architecture',  # Add this line
    # ... other directories
}
```

**Step 3**: Validate
```bash
python3 scripts/validate_structure.py
# Should pass ✅
```

---

### Scenario 2: Allowing Empty Directories

Some directories need to exist but may be empty (like `.ai_workflow/logs/`):

**Edit validation script**:
```python
# In scripts/validate_structure.py
ALLOWED_EMPTY_DIRS = {
    '.ai_workflow',
    '.ai_workflow/logs',
    '.ai_workflow/cache',
    'temp',              # Add your empty dir
    'build',             # Build output directory
}
```

---

### Scenario 3: Excluding Directories from Validation

To exclude directories from validation (like `node_modules/`):

```python
# In scripts/validate_structure.py
EXCLUDED_DIRS = {
    '.git',
    'node_modules',
    '__pycache__',
    '.venv',
    'dist',              # Add your excluded dir
    'build',
}
```

---

### Scenario 4: Cleaning Up Old Directories

If validation finds many empty directories:

```bash
# See what would be removed
python3 scripts/validate_structure.py

# Auto-remove all empty directories
python3 scripts/validate_structure.py --fix

# Verify clean
python3 scripts/validate_structure.py
# ✅ Structure validation PASSED
```

---

### Scenario 5: Debugging Validation Failures

If validation fails but you don't understand why:

```bash
# Run with verbose output (look at script output)
python3 scripts/validate_structure.py

# Check specific directory
ls -la path/to/failing/directory/

# Check if directory is truly empty
find path/to/failing/directory/ -type f

# Check .gitignore patterns
cat .gitignore | grep directory_name
```

---

### Scenario 6: Temporarily Bypassing Pre-commit

For emergency commits (use sparingly):

```bash
# Skip pre-commit hooks
git commit --no-verify -m "Emergency fix"

# Or skip specific hook
SKIP=validate-structure git commit -m "Skip structure check"
```

**⚠️ Warning**: Always fix structure issues as soon as possible!

---

### Scenario 7: Custom Validation Rules

Create project-specific validation rules:

```python
# In scripts/validate_structure.py

def custom_validation(root_dir):
    """Add custom validation logic."""
    issues = []
    
    # Check: All docs subdirs must have README.md
    docs_dir = root_dir / 'docs'
    for subdir in docs_dir.iterdir():
        if subdir.is_dir():
            readme = subdir / 'README.md'
            if not readme.exists():
                issues.append(f"Missing README.md in {subdir}")
    
    return issues

# Add to main validation function
```

---

## Troubleshooting

### Problem: "ModuleNotFoundError: No module named 'yaml'"

**Solution**: The script doesn't require PyYAML. If you see this, check:
```bash
# Verify script path
ls -la scripts/validate_structure.py

# Check Python version
python3 --version

# If using custom script with yaml, install it
pip install pyyaml
```

---

### Problem: Pre-commit hook doesn't run

**Solution**: Verify installation
```bash
# Check hooks installed
ls -la .git/hooks/pre-commit

# Reinstall if needed
pre-commit uninstall
pre-commit install

# Test manually
pre-commit run validate-structure --all-files
```

---

### Problem: "Permission denied" when running script

**Solution**: Make script executable
```bash
chmod +x scripts/validate_structure.py
chmod +x .workflow_core/scripts/validate_structure.py
```

---

### Problem: Validation passes locally but fails in CI

**Possible causes**:
1. **Different file states**: CI checks committed files
   ```bash
   # Check what's committed
   git status
   git ls-files
   ```

2. **Submodule not initialized**:
   ```yaml
   # In .github/workflows/validate-structure.yml
   - uses: actions/checkout@v3
     with:
       submodules: recursive  # Add this
   ```

3. **Python version mismatch**:
   ```yaml
   # In workflow file
   - uses: actions/setup-python@v4
     with:
       python-version: '3.9'  # Match your version
   ```

---

### Problem: False positives for empty directories

**Solution**: Add to allowed list
```python
# In scripts/validate_structure.py
ALLOWED_EMPTY_DIRS = {
    '.ai_workflow/logs',
    'your/directory/here',
}
```

---

### Problem: Validation is too slow

**Solution**: Exclude large directories
```python
# In scripts/validate_structure.py
EXCLUDED_DIRS = {
    'node_modules',
    'venv',
    'dist',
    'build',
    'data',  # Large data directory
}
```

---

## Next Steps

Congratulations! You've set up automated structure validation. Here's what to do next:

### 1. Customize for Your Project
- Edit `KNOWN_STRUCTURE` in validation script
- Add project-specific directories
- Configure allowed empty directories

### 2. Document Your Structure
- Create `docs/STRUCTURE.md` describing your directory layout
- Reference it in your README
- Keep it updated as structure evolves

### 3. Integrate with Other Validations
- Combine with code linting workflows
- Add to your test suite
- Include in release checklists

### 4. Share with Your Team
- Document validation setup in CONTRIBUTING.md
- Add to onboarding documentation
- Include in PR review checklist

### 5. Monitor and Improve
- Review validation failures in CI
- Adjust rules based on team feedback
- Keep validation script updated

---

## Additional Resources

### Related Documentation
- [scripts/validate_structure.py](../../scripts/validate_structure.py) - Validation script source
- [.pre-commit-config.yaml](../../.pre-commit-config.yaml) - Pre-commit configuration
- [workflow-templates/workflows/validate-structure.yml](../../workflow-templates/workflows/validate-structure.yml) - CI/CD workflow

### External Resources
- [Pre-commit Documentation](https://pre-commit.com/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Python pathlib Documentation](https://docs.python.org/3/library/pathlib.html)

### Getting Help
- Check [docs/guides/TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- Review [docs/guides/FAQ.md](FAQ.md) for quick answers
- Open an issue on GitHub if stuck

---

**Tutorial Complete!** 🎉

You now have a robust, three-layer structure validation system that:
- ✅ Catches issues early (pre-commit)
- ✅ Prevents broken commits (local validation)
- ✅ Ensures consistency (CI/CD)
- ✅ Scales with your project (customizable)

---

**Last Updated**: 2026-02-07  
**Document Version**: 1.0.1  
**Tutorial Duration**: 15 minutes

