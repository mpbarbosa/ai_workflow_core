# Quick Start Guide

**Version**: 1.0.1  
**Last Updated**: 2026-02-07  
**Estimated Time**: 5-10 minutes

> **Purpose**: Get ai_workflow_core integrated into your project in under 10 minutes. This guide focuses on the essential steps to get started quickly.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [5-Minute Setup](#5-minute-setup)
- [Verification](#verification)
- [Common First-Time Issues](#common-first-time-issues)
- [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ Git repository initialized (`git init`)
- ✅ Git configured with user name and email
- ✅ Basic familiarity with YAML syntax
- ✅ Text editor installed

**Optional but recommended:**
- YAML linter (`yamllint`) for validation
- Project already has: source code, tests, or documentation

---

## 5-Minute Setup

### Step 1: Add Submodule (30 seconds)

```bash
# From your project root
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
git submodule update --init --recursive
```

**What this does**: Downloads ai_workflow_core templates into `.workflow_core/` directory.

### Step 2: Copy Configuration Template (15 seconds)

```bash
# Copy the main config template
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
```

**What this does**: Creates your project's configuration file from the template.

### Step 3: Choose Your Project Kind (1 minute)

Open `.workflow-config.yaml` and identify your project type:

| Your Project | Use `project_kind` | Use `primary_language` |
|--------------|-------------------|------------------------|
| Shell scripts automation | `shell_script_automation` | `bash` |
| Node.js REST API | `nodejs_api` | `javascript` |
| React SPA | `react_spa` | `javascript` |
| Python application | `python_app` | `python` |
| Static HTML/CSS site | `static_website` | `html` |
| Vanilla JS SPA (Bootstrap) | `client_spa` | `javascript` |
| Config/template library | `configuration_library` | `yaml` |
| Other/mixed | `generic` | (your primary language) |

**Reference**: See `.workflow_core/config/project_kinds.yaml` for complete definitions.

### Step 4: Fill Basic Configuration (2 minutes)

Edit `.workflow-config.yaml` and replace these **7 critical placeholders**:

```yaml
project:
  name: "{{PROJECT_NAME}}"              # → "My Application"
  type: "{{PROJECT_TYPE}}"              # → "nodejs-application" (hyphenated)
  description: "{{PROJECT_DESCRIPTION}}" # → "REST API for users"
  kind: "{{PROJECT_KIND}}"              # → "nodejs_api" (underscored)
  version: "{{VERSION}}"                # → "1.0.1" (no 'v' prefix)

tech_stack:
  primary_language: "{{LANGUAGE}}"      # → "javascript"
  test_command: "{{TEST_COMMAND}}"      # → "npm test"
```

**Quick Example** (Node.js API):
```yaml
project:
  name: "User Management API"
  type: "nodejs-application"
  description: "RESTful API for user management"
  kind: "nodejs_api"
  version: "1.0.1"

tech_stack:
  primary_language: "javascript"
  build_system: "npm"
  test_framework: "jest"
  test_command: "npm test"
  lint_command: "eslint ."
```

### Step 5: Create Artifact Directories (30 seconds)

```bash
# Create standard directory structure
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}
```

**What this does**: Creates directories for workflow execution artifacts (logs, reports, etc.).

### Step 6: Update .gitignore (30 seconds)

```bash
# Add artifact patterns to .gitignore
cat >> .gitignore << 'EOF'

# AI Workflow artifacts (generated files)
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
EOF
```

**What this does**: Prevents generated artifacts from being committed to Git.

### Step 7: Commit the Setup (30 seconds)

```bash
git add .gitmodules .workflow_core .workflow-config.yaml .gitignore
git commit -m "chore: integrate ai_workflow_core v1.0.1"
```

**✅ Done!** You've successfully integrated ai_workflow_core.

---

## Verification

### Verify Submodule

```bash
# Check submodule is properly initialized
git submodule status
# Should show: <commit-hash> .workflow_core (v1.0.1 or similar)
```

### Verify Configuration

```bash
# Validate YAML syntax (if yamllint installed)
yamllint .workflow-config.yaml

# Check for remaining placeholders (should be none)
grep "{{" .workflow-config.yaml
# No output = good! All placeholders replaced.
```

### Verify Directory Structure

```bash
# Check artifact directories exist
ls -la .ai_workflow/
# Should show: backlog/, summaries/, logs/, metrics/, checkpoints/, prompts/, ml_models/, .incremental_cache/
```

### Verify Gitignore

```bash
# Check .gitignore has workflow patterns
grep -A8 "AI Workflow" .gitignore
# Should show artifact directory patterns
```

**All checks pass?** → You're ready to use ai_workflow_core! 🎉

---

## Common First-Time Issues

### Issue 1: "fatal: not a git repository"

**Symptom**: Error when adding submodule.

**Solution**:
```bash
# Initialize git first
git init
git add .
git commit -m "Initial commit"

# Then add submodule
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
```

### Issue 2: "{{PLACEHOLDERS}} still in config"

**Symptom**: Grep finds `{{` patterns after editing.

**Solution**: You missed some placeholders. Common ones:
- `{{PROJECT_NAME}}` → Replace with your project name
- `{{PROJECT_KIND}}` → Must match one from `project_kinds.yaml`
- `{{VERSION}}` → Use "1.0.1" format (no 'v' prefix)

**Tip**: Search and replace in your editor:
1. Find: `{{PROJECT_NAME}}`
2. Replace: `"Your Project Name"`

### Issue 3: "project_kind vs project_type confusion"

**Symptom**: Config validation fails or seems wrong.

**Clarification**:
- `type`: Uses **hyphens** → `"nodejs-application"`, `"configuration-library"`
- `kind`: Uses **underscores** → `"nodejs_api"`, `"configuration_library"`

**Example**:
```yaml
# ✅ Correct
project:
  type: "nodejs-application"  # hyphenated
  kind: "nodejs_api"          # underscored

# ❌ Wrong
project:
  type: "nodejs_api"          # Don't use underscores here
  kind: "nodejs-application"  # Don't use hyphens here
```

### Issue 4: "Directory .ai_workflow/ already exists"

**Symptom**: `mkdir` command fails.

**Solution**: That's fine! Directory already exists. Continue to next step.

```bash
# Just ensure subdirectories exist
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}
```

### Issue 5: "Submodule appears empty"

**Symptom**: `.workflow_core/` exists but has no files.

**Solution**: Initialize the submodule:
```bash
git submodule update --init --recursive
```

---

## Next Steps

### 1. Explore Configuration Options

Your basic setup is complete, but there are many optional configurations:

- **Read**: `docs/api/CONFIG_REFERENCE.md` - Complete field reference
- **Review**: Your `.workflow-config.yaml` - Customize optional sections
- **Check**: `.workflow_core/config/project_kinds.yaml` - See validation rules for your project kind

### 2. Review Your Project Kind Standards

Each project kind has specific requirements (test coverage, linters, etc.):

```bash
# View your project kind's validation rules
grep -A50 "^  {{YOUR_KIND}}:" .workflow_core/config/project_kinds.yaml
```

**Example**: If you chose `nodejs_api`, you'll see:
- Required test framework: jest/mocha/vitest
- Required linters: eslint, prettier
- Minimum coverage: 80%
- Documentation requirements

### 3. Set Up GitHub Workflows (Optional)

```bash
# Copy workflow templates
mkdir -p .github/workflows
cp .workflow_core/workflow-templates/workflows/*.yml .github/workflows/

# Edit and customize for your project
```

**Available workflows**:
- `code-quality.yml` - Runs linters and tests
- `validate-docs.yml` - Validates documentation structure
- `validate-tests.yml` - Ensures test coverage

### 4. Explore Integration Patterns

- **Read**: `docs/INTEGRATION.md` - Comprehensive integration guide (735 lines)
- **Study**: Language-specific examples:
  - `examples/shell/README.md` - Shell script integration (645 lines)
  - `examples/nodejs/README.md` - Node.js integration (320 lines)

### 5. Learn About Artifacts

The `.ai_workflow/` directory will contain:

- `backlog/` - Execution reports and development artifacts
- `summaries/` - AI-generated summaries
- `logs/` - Execution logs
- `metrics/` - Performance metrics
- `checkpoints/` - Resume points for long workflows
- `prompts/` - AI prompt logs (optional commit)
- `ml_models/` - ML models (optional commit)

**Read**: `docs/AI_WORKFLOW_DIRECTORY.md` - Complete artifact directory guide

### 6. Understand Template vs Execution

⚠️ **Important**: ai_workflow_core provides **templates and configuration only**.

- **This repo** (ai_workflow_core): Configuration, templates, schemas
- **Parent project** ([ai_workflow](https://github.com/mpbarbosa/ai_workflow)): Workflow execution engine

If you need workflow execution capabilities, see the parent project.

### 7. Pin to Stable Version (Production Projects)

For production stability:

```bash
cd .workflow_core
git checkout v1.0.1  # Pin to specific version
cd ..
git add .workflow_core
git commit -m "chore: pin ai_workflow_core to v1.0.1"
```

**Read**: `docs/guides/VERSION_MANAGEMENT.md` - Version management strategies

### 8. Join the Community

- **Report Issues**: [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)
- **Contribute**: See `docs/CONTRIBUTING.md`
- **Stay Updated**: Watch repository for releases

---

## Quick Reference Card

```bash
# Setup (one-time)
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
# Edit .workflow-config.yaml (replace {{PLACEHOLDERS}})
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# Validation
yamllint .workflow-config.yaml
grep "{{" .workflow-config.yaml  # Should return nothing

# Update submodule (later)
cd .workflow_core && git pull origin main && cd ..
git add .workflow_core
git commit -m "chore: update ai_workflow_core"
```

---

## Getting Help

**Stuck?** Try these resources in order:

1. **Troubleshooting Guide**: `docs/guides/TROUBLESHOOTING.md` - Common problems and solutions
2. **FAQ**: `docs/guides/FAQ.md` - Frequently asked questions
3. **Integration Guide**: `docs/INTEGRATION.md` - Comprehensive integration documentation
4. **GitHub Issues**: Search existing issues or create new one
5. **Examples**: Study `examples/shell/` or `examples/nodejs/` for working integrations

---

**Congratulations!** 🎉 You've completed the quick start. Your project now has ai_workflow_core integrated and configured.

**Next**: Choose one of the [Next Steps](#next-steps) above based on your needs.
