# Getting Started with ai_workflow_core

**Version**: 1.0.2  
**Last Updated**: 2026-02-10  
**Audience**: New users  
**Estimated time**: 10 minutes

> **Purpose**: Complete guide to setting up ai_workflow_core in your project from scratch

## Table of Contents

- [What is ai_workflow_core?](#what-is-ai_workflow_core)
- [Prerequisites](#prerequisites)
- [5-Minute Quick Start](#5-minute-quick-start)
- [Step-by-Step Setup](#step-by-step-setup)
- [Choosing Your Project Kind](#choosing-your-project-kind)
- [Customizing Configuration](#customizing-configuration)
- [Verifying Installation](#verifying-installation)
- [Next Steps](#next-steps)
- [Troubleshooting](#troubleshooting)

---

## What is ai_workflow_core?

ai_workflow_core is a **configuration and template library** that provides:

✅ **Configuration templates** for workflow automation  
✅ **Project type definitions** with validation rules  
✅ **Directory structures** for workflow artifacts  
✅ **GitHub Actions workflows** for CI/CD  
✅ **Utility scripts** for validation and cleanup  

**Used as**: Git submodule in your project  
**Language**: Language-agnostic (works with any language)  
**Version**: 1.0.2

---

## Prerequisites

### Required Tools

```bash
# Git (with submodule support)
git --version  # Should be 2.x or higher

# YAML validator (recommended)
pip install yamllint

# Python 3 (for validation scripts)
python3 --version  # Should be 3.6+
```

### Project Requirements

- ✅ Git repository initialized
- ✅ Write access to repository
- ✅ Basic understanding of Git submodules

---

## 5-Minute Quick Start

For experienced users who want to get started immediately:

```bash
# 1. Add submodule
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
git submodule update --init --recursive

# 2. Copy and edit configuration
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
$EDITOR .workflow-config.yaml  # Replace {{PLACEHOLDERS}}

# 3. Create artifact directories
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# 4. Update .gitignore
cat >> .gitignore << 'EOF'
# ai_workflow_core artifacts
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/.incremental_cache/
EOF

# 5. Verify setup
bash .workflow_core/scripts/check_integration_health.sh

# 6. Commit
git add .gitmodules .workflow_core .workflow-config.yaml .gitignore .ai_workflow/
git commit -m "feat: integrate ai_workflow_core"
```

Done! Continue to [Verifying Installation](#verifying-installation).

---

## Step-by-Step Setup

### Step 1: Add ai_workflow_core as Submodule

Navigate to your project root:

```bash
cd /path/to/your/project
```

Add the submodule:

```bash
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
```

**What this does**:
- Creates `.workflow_core/` directory
- Clones ai_workflow_core repository
- Updates `.gitmodules` file
- Tracks submodule reference

Initialize the submodule:

```bash
git submodule update --init --recursive
```

Verify:

```bash
ls -la .workflow_core/
# Should show config/, docs/, examples/, scripts/, workflow-templates/
```

### Step 2: Copy Configuration Template

Copy the template to your project root:

```bash
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
```

**Important**: Remove `.template` extension when copying!

Verify the copy:

```bash
ls -la .workflow-config.yaml
# Should exist in your project root
```

### Step 3: Choose Your Project Kind

Open `.workflow-config.yaml` and find the `project.kind` field:

```yaml
project:
  kind: "{{PROJECT_KIND}}"  # ← Replace this
```

**Available project kinds**:

| Kind | Description | Use For |
|------|-------------|---------|
| `shell_script_automation` | Bash/shell scripts | Automation scripts, CLI tools |
| `nodejs_api` | Node.js backend | REST APIs, GraphQL servers |
| `client_spa` | Vanilla JS SPA | Bootstrap/jQuery apps |
| `react_spa` | React apps | React single-page apps |
| `static_website` | Static HTML/CSS/JS | Documentation sites, portfolios |
| `python_app` | Python applications | CLI tools, web apps, data processing |
| `configuration_library` | Config/template repos | Libraries like ai_workflow_core |
| `generic` | Any other type | Fallback for unlisted types |

**Example**: For a Node.js API project:
```yaml
project:
  kind: "nodejs_api"
```

See [Choosing Your Project Kind](#choosing-your-project-kind) section for more details.

### Step 4: Replace All Placeholders

Edit `.workflow-config.yaml` and replace all `{{PLACEHOLDERS}}`:

**Common placeholders**:

```yaml
project:
  name: "{{PROJECT_NAME}}"              # → "My Awesome App"
  type: "{{PROJECT_TYPE}}"              # → "nodejs-application"
  description: "{{PROJECT_DESCRIPTION}}" # → "RESTful API for user management"
  kind: "{{PROJECT_KIND}}"              # → "nodejs_api"
  version: "{{VERSION}}"                # → "1.0.2"

tech_stack:
  primary_language: "{{LANGUAGE}}"      # → "javascript"
  build_system: "{{BUILD_SYSTEM}}"      # → "npm"
  test_framework: "{{TEST_FRAMEWORK}}"  # → "jest"
  test_command: "{{TEST_COMMAND}}"      # → "npm test"
  lint_command: "{{LINT_COMMAND}}"      # → "npm run lint"
```

**Find all placeholders**:
```bash
grep "{{.*}}" .workflow-config.yaml
```

**Validate YAML**:
```bash
yamllint .workflow-config.yaml
```

### Step 5: Create Artifact Directories

Create the standard `.ai_workflow/` directory structure:

```bash
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}
```

**Directory purposes**:
- `backlog/`: Execution reports and development artifacts
- `summaries/`: AI-generated summaries
- `logs/`: Workflow execution logs
- `metrics/`: Performance metrics
- `checkpoints/`: Resume points for workflows
- `prompts/`: AI prompt logs (optional to commit)
- `ml_models/`: ML models (optional to commit)
- `.incremental_cache/`: Incremental processing cache

Verify:

```bash
tree -L 2 .ai_workflow/
```

### Step 6: Configure .gitignore

Add artifact directories to `.gitignore`:

```bash
cat >> .gitignore << 'EOF'

# ==================================================
# ai_workflow_core - Workflow Artifacts
# ==================================================

# Generated artifacts (always ignore)
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/.incremental_cache/

# Optional: Commit or ignore based on needs
# .ai_workflow/prompts/
# .ai_workflow/ml_models/
# .ai_workflow/checkpoints/

EOF
```

**Customization**:
- **Commit prompts** for reproducibility: Remove `# .ai_workflow/prompts/` line
- **Commit models** for sharing: Remove `# .ai_workflow/ml_models/` line
- **Ignore everything**: Add `.ai_workflow/` instead of individual directories

Verify:

```bash
git check-ignore .ai_workflow/logs/test.log
# Should output: .ai_workflow/logs/test.log
```

### Step 7: Verify Installation

Run the integration health check:

```bash
bash .workflow_core/scripts/check_integration_health.sh
```

**Expected output**:
```
✅ Submodule present at .workflow_core/
✅ Submodule initialized
✅ Configuration file exists: .workflow-config.yaml
✅ No unreplaced placeholders found
✅ YAML syntax valid
✅ Artifact directory structure valid
✅ .gitignore configured correctly
✅ Integration health: PASS
```

**If there are issues**:
```bash
# Auto-fix common problems
bash .workflow_core/scripts/check_integration_health.sh --fix
```

### Step 8: Commit Changes

Stage and commit all changes:

```bash
# Check what will be committed
git status

# Add files
git add .gitmodules .workflow_core .workflow-config.yaml .gitignore

# Create placeholder files in artifact directories (so they're tracked)
touch .ai_workflow/backlog/.gitkeep
touch .ai_workflow/summaries/.gitkeep
touch .ai_workflow/checkpoints/.gitkeep
git add .ai_workflow/

# Commit
git commit -m "feat: integrate ai_workflow_core v1.0.2

- Add ai_workflow_core as Git submodule
- Configure project as {{YOUR_PROJECT_KIND}}
- Set up artifact directory structure
- Update .gitignore for workflow artifacts"

# Push
git push origin main
```

---

## Choosing Your Project Kind

### Decision Tree

```
What's your primary language?
│
├─ Shell/Bash
│  └─ shell_script_automation
│
├─ JavaScript/Node.js
│  ├─ Backend API? → nodejs_api
│  ├─ React app? → react_spa
│  ├─ Vanilla JS SPA? → client_spa
│  └─ Static site? → static_website
│
├─ Python
│  └─ python_app
│
├─ Configuration/Templates (like ai_workflow_core)
│  └─ configuration_library
│
└─ Other/Multiple languages
   └─ generic
```

### Detailed Comparison

#### shell_script_automation

**Best for**:
- Bash/shell automation scripts
- Command-line tools
- System administration scripts

**Test framework**: `bash_unit` or `BATS`  
**Linters**: `shellcheck`, `shfmt`  
**Coverage**: Not typically measured

**Example**:
```yaml
project:
  kind: "shell_script_automation"
tech_stack:
  primary_language: "bash"
  test_framework: "bash_unit"
  test_command: "./tests/run_tests.sh"
  lint_command: "shellcheck **/*.sh"
```

#### nodejs_api

**Best for**:
- Node.js REST APIs
- GraphQL servers
- Backend microservices

**Test framework**: `jest`, `mocha`, or `vitest`  
**Linters**: `eslint`, `prettier`  
**Coverage**: 80% threshold

**Example**:
```yaml
project:
  kind: "nodejs_api"
tech_stack:
  primary_language: "javascript"
  test_framework: "jest"
  test_command: "npm test"
  lint_command: "npm run lint"
```

#### react_spa

**Best for**:
- React single-page applications
- React with TypeScript

**Test framework**: `jest` + React Testing Library  
**Linters**: `eslint`, `prettier`  
**Build**: Required (`npm run build`)

**Example**:
```yaml
project:
  kind: "react_spa"
tech_stack:
  primary_language: "javascript"
  test_framework: "jest"
  test_command: "npm test"
  lint_command: "npm run lint"
```

#### python_app

**Best for**:
- Python applications
- CLI tools
- Data processing scripts
- Web apps (Flask/Django)

**Test framework**: `pytest` or `unittest`  
**Linters**: `pylint`, `black`, `mypy`  
**Coverage**: 80% threshold

**Example**:
```yaml
project:
  kind: "python_app"
tech_stack:
  primary_language: "python"
  test_framework: "pytest"
  test_command: "pytest tests/"
  lint_command: "pylint src/"
```

#### configuration_library

**Best for**:
- Template repositories
- Configuration libraries
- Submodule-based libraries (like ai_workflow_core itself)

**Test framework**: Validation scripts  
**Linters**: `yamllint`  
**Build**: Not required

**Example**:
```yaml
project:
  kind: "configuration_library"
tech_stack:
  primary_language: "yaml"
  test_framework: "validation-scripts"
  test_command: "python scripts/validate.py"
  lint_command: "yamllint -d relaxed config/"
```

#### generic

**Best for**:
- Multi-language projects
- Projects not fitting other categories
- Experimental projects

**Minimal assumptions**: Define your own validation rules

**Example**:
```yaml
project:
  kind: "generic"
tech_stack:
  primary_language: "multiple"
  test_framework: "custom"
  test_command: "./run_tests.sh"
  lint_command: "./run_lint.sh"
```

---

## Customizing Configuration

### Essential Customizations

After choosing your project kind, customize these sections:

#### 1. Project Identity

```yaml
project:
  name: "Your Project Name"
  type: "your-project-type"
  description: "One-line description"
  kind: "chosen_project_kind"
  version: "1.0.2"
```

#### 2. Tech Stack

```yaml
tech_stack:
  primary_language: "javascript"
  build_system: "npm"
  test_framework: "jest"
  test_command: "npm test"
  lint_command: "npm run lint"
```

#### 3. Directory Structure

```yaml
structure:
  source_dirs:
    - src
    - lib
  test_dirs:
    - tests
    - __tests__
  docs_dirs:
    - docs
```

### Optional Customizations

#### Add Workflow Hooks

```yaml
workflow:
  hooks:
    pre_test: "npm run build"
    post_test: "npm run coverage"
```

#### Add Custom Validation

```yaml
validation:
  required_files:
    - package.json
    - README.md
    - LICENSE
```

---

## Verifying Installation

### Manual Verification Checklist

Run through this checklist:

- [ ] Submodule exists: `ls -la .workflow_core/`
- [ ] Config exists: `ls -la .workflow-config.yaml`
- [ ] No placeholders: `grep "{{.*}}" .workflow-config.yaml`
- [ ] YAML valid: `yamllint .workflow-config.yaml`
- [ ] Directories created: `ls -la .ai_workflow/`
- [ ] .gitignore updated: `git check-ignore .ai_workflow/logs/test.log`

### Automated Verification

```bash
# Run full health check
bash .workflow_core/scripts/check_integration_health.sh

# Validate structure
python3 .workflow_core/scripts/validate_structure.py

# Validate YAML
yamllint .workflow-config.yaml
```

---

## Next Steps

### Recommended Actions

1. **Copy workflow templates** (optional):
   ```bash
   mkdir -p .github/workflows
   cp .workflow_core/workflow-templates/workflows/*.yml .github/workflows/
   ```

2. **Set up pre-commit hooks** (optional):
   ```bash
   pip install pre-commit
   pre-commit install
   ```

3. **Copy utility scripts** (optional):
   ```bash
   cp .workflow_core/scripts/cleanup_artifacts.sh.template scripts/cleanup_artifacts.sh
   chmod +x scripts/cleanup_artifacts.sh
   ```

### Learn More

- **Configuration**: [CONFIG_REFERENCE.md](../api/CONFIG_REFERENCE.md)
- **Project kinds**: [PROJECT_KINDS_SCHEMA.md](../api/PROJECT_KINDS_SCHEMA.md)
- **Workflows**: [Workflow Automation](../workflow-automation/README.md)
- **Best practices**: [INTEGRATION_BEST_PRACTICES.md](INTEGRATION_BEST_PRACTICES.md)

---

## Troubleshooting

### Submodule not found

**Problem**: `fatal: not a git repository`

**Solution**:
```bash
git submodule update --init --recursive
```

### Placeholder warnings

**Problem**: Health check reports unreplaced placeholders

**Solution**:
```bash
# Find all placeholders
grep "{{.*}}" .workflow-config.yaml

# Replace manually or with sed
sed -i 's/{{PROJECT_NAME}}/My Project/g' .workflow-config.yaml
```

### YAML syntax errors

**Problem**: `yamllint` reports errors

**Solution**:
```bash
# Check specific errors
yamllint .workflow-config.yaml

# Fix common issues:
# - Use 2-space indentation
# - Quote string values
# - No tabs (use spaces)
```

### Directory permission errors

**Problem**: Can't create `.ai_workflow/` directories

**Solution**:
```bash
# Fix permissions
chmod 755 .
mkdir -p .ai_workflow/logs

# Or create as sudo if needed
sudo mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}
sudo chown -R $USER:$USER .ai_workflow/
```

### More help

- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [FAQ](FAQ.md)
- [Open an issue](https://github.com/mpbarbosa/ai_workflow_core/issues)

---

**Congratulations!** 🎉 You've successfully set up ai_workflow_core in your project.

**Last Updated**: 2026-02-10
