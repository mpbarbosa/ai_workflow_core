# Integration Guide - AI Workflow Core

This guide provides detailed instructions for integrating `ai_workflow_core` into your project as a Git submodule.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Configuration](#configuration)
- [Language-Specific Integration](#language-specific-integration)
- [GitHub Integration](#github-integration)
- [Updating the Submodule](#updating-the-submodule)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Git 2.13 or later
- Your language runtime (Node.js, Python, Bash, etc.)
- Text editor for configuration
- Optional: GitHub CLI for enhanced GitHub features

## Initial Setup

### Step 1: Add the Submodule

```bash
# Navigate to your project root
cd /path/to/your/project

# Add ai_workflow_core as a submodule
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core

# Initialize and update the submodule
git submodule update --init --recursive

# Commit the submodule addition
git add .gitmodules .workflow_core
git commit -m "Add ai_workflow_core submodule"
```

### Step 2: Copy Configuration Files

```bash
# Copy workflow configuration template
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Add workflow artifact patterns to .gitignore
cat >> .gitignore << 'EOF'

# AI Workflow artifacts
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
EOF
```

### Step 3: Create Workflow Directory Structure

```bash
# Create the ai_workflow directory structure
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# The structure includes:
# - backlog/, summaries/, logs/, metrics/, checkpoints/
# - prompts/, ml_models/, .incremental_cache/
```

## Configuration

### Workflow Configuration (.workflow-config.yaml)

Edit `.workflow-config.yaml` and replace all placeholders:

#### Required Placeholders

```yaml
project:
  name: "{{PROJECT_NAME}}"                      # Your project name
  type: "{{PROJECT_TYPE}}"                      # Project type (see below)
  description: "{{PROJECT_DESCRIPTION}}"        # Brief description
  kind: "{{PROJECT_KIND}}"                      # Project kind (see below)
  version: "{{VERSION}}"                        # Current version

tech_stack:
  primary_language: "{{LANGUAGE}}"              # bash, javascript, python, etc.
  build_system: "{{BUILD_SYSTEM}}"              # npm, webpack, maven, none
  test_framework: "{{TEST_FRAMEWORK}}"          # jest, pytest, shell-script
  test_command: "{{TEST_COMMAND}}"              # Command to run tests
  lint_command: "{{LINT_COMMAND}}"              # Command to run linter
```

#### Project Types (Hyphenated Format)

Choose from these standard types for `{{PROJECT_TYPE}}`:

- `shell-script-automation` - Bash/shell automation projects
- `nodejs-application` - Node.js backend applications
- `nodejs-library` - Node.js reusable libraries
- `static-website` - HTML/CSS/JS static websites
- `client-spa` - Vanilla JS single-page applications
- `react-spa` - React single-page applications
- `python-application` - Python applications or scripts
- `python-package` - Python distributable packages
- `configuration-library` - Template/config repositories
- `generic` - Other project types

#### Project Kinds (Underscored Format)

Choose from these standard kinds for `{{PROJECT_KIND}}` (must match `config/project_kinds.yaml`):

- `shell_script_automation` - Bash/shell script projects
- `nodejs_api` - Node.js backend APIs
- `static_website` - HTML/CSS/JS static sites  
- `client_spa` - Vanilla JS SPAs with Bootstrap (no frameworks)
- `react_spa` - React single-page applications
- `python_app` - Python applications
- `configuration_library` - Template and configuration repositories (like ai_workflow_core)
- `generic` - Fallback for other project types

**Note**: `PROJECT_TYPE` uses hyphens (e.g., `"nodejs-application"`), while `PROJECT_KIND` uses underscores (e.g., `"nodejs_api"`). Project kinds define validation rules, testing standards, and quality requirements in `config/project_kinds.yaml`.

### Automated Placeholder Replacement

Use sed for quick replacements:

```bash
#!/bin/bash
CONFIG_FILE=".workflow-config.yaml"

# Replace placeholders
sed -i 's/{{PROJECT_NAME}}/My Awesome Project/g' "$CONFIG_FILE"
sed -i 's/{{PROJECT_TYPE}}/nodejs-application/g' "$CONFIG_FILE"
sed -i 's/{{PROJECT_DESCRIPTION}}/Web application for task management/g' "$CONFIG_FILE"
sed -i 's/{{PROJECT_KIND}}/nodejs_api/g' "$CONFIG_FILE"
sed -i 's/{{VERSION}}/1.0.1/g' "$CONFIG_FILE"
sed -i 's/{{LANGUAGE}}/javascript/g' "$CONFIG_FILE"
sed -i 's/{{BUILD_SYSTEM}}/npm/g' "$CONFIG_FILE"
sed -i 's/{{TEST_FRAMEWORK}}/jest/g' "$CONFIG_FILE"
sed -i 's/{{TEST_COMMAND}}/npm test/g' "$CONFIG_FILE"
sed -i 's/{{LINT_COMMAND}}/eslint ./g' "$CONFIG_FILE"

echo "Configuration updated successfully!"
```

## Language-Specific Integration

### Shell Script Project

```yaml
# .workflow-config.yaml
project:
  name: "My Shell Script Project"
  type: "bash-automation-framework"
  description: "Shell script automation tools"
  kind: "shell_script_automation"
  version: "1.0.1"

tech_stack:
  primary_language: "bash"
  build_system: "none"
  test_framework: "shell-script"
  test_command: "./tests/run_all_tests.sh"
  lint_command: "shellcheck src/**/*.sh"
```

**Directory Structure:**
```
my_shell_project/
├── .workflow_core/           # Submodule
├── .ai_workflow/             # Workflow artifacts
├── .workflow-config.yaml     # Customized config
├── src/                      # Shell scripts
├── tests/                    # Test scripts
└── docs/                     # Documentation
```

### JavaScript/Node.js Project

```yaml
# .workflow-config.yaml
project:
  name: "My Node.js App"
  type: "nodejs-application"
  description: "Node.js web application"
  kind: "nodejs_api"
  version: "1.0.1"

tech_stack:
  primary_language: "javascript"
  build_system: "npm"
  test_framework: "jest"
  test_command: "npm test"
  lint_command: "eslint ."
```

**Directory Structure:**
```
my_nodejs_project/
├── .workflow_core/           # Submodule
├── .ai_workflow/             # Workflow artifacts
├── .workflow-config.yaml     # Customized config
├── package.json              # Node.js config
├── src/                      # Source code
├── tests/                    # Test files
└── docs/                     # Documentation
```

### Python Project

```yaml
# .workflow-config.yaml
project:
  name: "My Python Package"
  type: "python-package"
  description: "Python utility library"
  kind: "library"
  version: "1.0.1"

tech_stack:
  primary_language: "python"
  build_system: "pip"
  test_framework: "pytest"
  test_command: "pytest tests/"
  lint_command: "pylint src/"
```

**Directory Structure:**
```
my_python_project/
├── .workflow_core/           # Submodule
├── .ai_workflow/             # Workflow artifacts
├── .workflow-config.yaml     # Customized config
├── setup.py                  # Python config
├── requirements.txt          # Dependencies
├── src/                      # Source code
├── tests/                    # Test files
└── docs/                     # Documentation
```

## GitHub Integration

### GitHub Actions Workflows

```bash
# Create .github directory
mkdir -p .github

# Copy workflows
cp -r .workflow_core/workflow-templates/workflows .github/

# Customize for your language
# Edit .github/workflows/*.yml files
```

#### Customizing Workflows

For a Node.js project, edit `.github/workflows/code-quality.yml`:

```yaml
# Before (template)
- name: Run tests
  run: {{TEST_COMMAND}}

# After (customized)
- name: Run tests
  run: npm test
```

### GitHub Copilot Instructions

Each project should create its own `.github/copilot-instructions.md` file based on their specific:
- Project architecture and design patterns
- Module organization and key files
- Development workflow and best practices
- Testing strategy and conventions
- Language-specific guidelines

Example structure:
```markdown
# GitHub Copilot Instructions - My Project

**Repository**: my_project
**Version**: 1.0.1
**Language**: JavaScript/Node.js

## Project Overview
[Your project description]

## Architecture Patterns
[Your patterns and conventions]

## Key Files and Directories
[Your file structure]

## Development Workflow
[Your workflow]
```

### AI Prompt Customization

The `ai_workflow_core` provides AI prompt templates that can be customized for your project.

#### Understanding the AI System

The AI system uses two layers:
1. **Generic personas** (`config/ai_helpers.yaml`) - Base AI roles (documentation specialist, test engineer, etc.)
2. **Project-specific prompts** (`config/ai_prompts_project_kinds.yaml`) - Customizations per project type

See the [AI Helpers Reference](api/AI_HELPERS_REFERENCE.md) and [AI Prompts Reference](api/AI_PROMPTS_REFERENCE.md) for complete documentation.

#### Customizing AI Prompts

To customize AI behavior for your project:

**Option 1: Copy and modify configuration files** (for advanced customization):
```bash
# Copy AI configuration to your project
cp .workflow_core/config/ai_helpers.yaml config/
cp .workflow_core/config/ai_prompts_project_kinds.yaml config/

# Edit to customize for your specific needs
# Example: Add project-specific terminology, adjust focus areas, etc.
```

**Option 2: Use project_kind alignment** (recommended):
```yaml
# In .workflow-config.yaml
project:
  kind: "nodejs_api"  # Uses nodejs_api prompts from ai_prompts_project_kinds.yaml
```

The system will automatically load project-specific prompts for your project kind. Available project kinds:
- `shell_script_automation` - Shell script projects
- `nodejs_api` - Node.js backend APIs
- `react_spa` - React applications
- `python_app` - Python applications
- `client_spa` - Vanilla JS SPAs
- `static_website` - Static HTML/CSS/JS sites
- `configuration_library` - Config/template repositories
- `generic` - Generic fallback

#### Token Efficiency

The AI prompt system is optimized for token efficiency:
- **YAML anchors** for reusable guidelines (~260-390 tokens saved)
- **Language-specific injection** based on `primary_language` setting
- **Total savings**: ~1,400-1,500 tokens per workflow
- **Cost impact**: ~$0.042-0.045 saved per workflow (GPT-4 pricing)

See [AI Helpers Reference](api/AI_HELPERS_REFERENCE.md#token-efficiency-system) for details.

## Updating the Submodule

### Version Management

⚠️ **Important**: For production systems, always pin to specific versions rather than tracking branches. See [Version Management Guide](guides/VERSION_MANAGEMENT.md) for comprehensive strategies.

### Update to Latest Version

```bash
# Navigate to submodule
cd .workflow_core

# Pull latest changes
git pull origin main

# Return to project root
cd ..

# Stage and commit the update
git add .workflow_core
git commit -m "Update ai_workflow_core to latest version"
```

### Update to Specific Version (Recommended)

```bash
cd .workflow_core

# Fetch all tags
git fetch --tags

# Checkout specific version
git checkout v1.1.0

cd ..
git add .workflow_core
git commit -m "Update ai_workflow_core to v1.1.0"
```

### Update After Git Clone

When cloning a project with submodules:

```bash
# Clone the project
git clone <your-project-url>
cd <your-project>

# Initialize and update submodules
git submodule update --init --recursive
```

### Set Up Auto-Update

Add to your `.git/config`:

```ini
[submodule ".workflow_core"]
    update = rebase
    branch = main
```

Then run:

```bash
git submodule update --remote .workflow_core
```

**⚠️ Warning:** Auto-update is convenient but can introduce unexpected changes. Only use in development environments.

### Migration Guides

When updating between major versions, check for breaking changes:

#### Upgrading from v1.x to v2.x

If a v2.0.0 is released with breaking changes:

1. **Read the CHANGELOG**: Review all breaking changes
2. **Check migration guide**: Look for `docs/MIGRATION_v1_to_v2.md`
3. **Update configuration**: New placeholders may be required
4. **Test thoroughly**: Run full test suite
5. **Update gradually**: Test in dev → staging → production

**Example breaking change handling:**

```bash
# 1. Review changes
cd .workflow_core
git log --oneline v1.0.1..v2.0.0
git diff v1.0.1..v2.0.0 -- config/.workflow-config.yaml.template
cd ..

# 2. Update submodule in feature branch
git checkout -b upgrade-workflow-core-v2
cd .workflow_core && git checkout v2.0.0 && cd ..

# 3. Update configuration for new schema
# Check template for new required fields
diff <(grep -E '^[a-z_]+:' .workflow_core/config/.workflow-config.yaml.template) \
     <(grep -E '^[a-z_]+:' .workflow-config.yaml)

# 4. Add any new required configuration
vim .workflow-config.yaml  # Add new fields

# 5. Run health check
bash .workflow_core/scripts/check_integration_health.sh

# 6. Test extensively
npm test
npm run lint

# 7. Commit and create PR
git add .workflow_core .workflow-config.yaml
git commit -m "Upgrade ai_workflow_core from v1.0.1 to v2.0.0"
```

### Health Checks After Updates

Always validate integration health after updates:

```bash
# Run health check script
bash .workflow_core/scripts/check_integration_health.sh

# Check for new placeholders
grep -r "{{" .workflow-config.yaml

# Validate configuration syntax
yamllint -d relaxed .workflow-config.yaml

# Run tests
npm test  # or your test command
```

### Rollback Procedure

If an update causes issues:

```bash
# Quick rollback - revert the update commit
git revert HEAD

# Or manually checkout previous version
cd .workflow_core
git checkout v1.0.1  # Previous version
cd ..
git add .workflow_core
git commit -m "Rollback ai_workflow_core to v1.0.1"
```

See [Version Management Guide](guides/VERSION_MANAGEMENT.md) for detailed rollback procedures.

## Troubleshooting

### Common Issues

#### Issue: Submodule Not Initialized

```bash
# Symptoms: .workflow_core directory is empty
# Solution:
git submodule update --init --recursive
```

#### Issue: Placeholders Not Replaced

```bash
# Symptoms: Config still shows {{PLACEHOLDERS}}
# Solution: Check for typos in sed commands or replace manually
grep -r "{{" .workflow-config.yaml  # Find remaining placeholders
```

#### Issue: Workflow Artifacts Not Ignored

```bash
# Symptoms: Git wants to commit .ai_workflow/ contents
# Solution: Ensure .gitignore includes workflow patterns
cat >> .gitignore << 'EOF'

# AI Workflow artifacts
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
EOF

git rm -r --cached .ai_workflow/backlog .ai_workflow/logs  # Remove from index
```

#### Issue: GitHub Workflows Failing

```bash
# Symptoms: CI/CD workflows fail
# Solution: Check language-specific setup in workflows
# Ensure test commands, lint commands match your project
# Verify dependencies are installed in workflow
```

#### Issue: Submodule Detached HEAD

```bash
# Symptoms: Submodule shows detached HEAD
# Solution:
cd .workflow_core
git checkout main
git pull origin main
cd ..
git add .workflow_core
git commit -m "Update submodule reference"
```

### Dynamic Codebase Issues

#### Issue: Configuration Drift

**Symptoms:** Your config differs from template after submodule update

**Solution:**
```bash
# Compare your config with template
diff <(grep -E '^[a-z_]+:' .workflow_core/config/.workflow-config.yaml.template) \
     <(grep -E '^[a-z_]+:' .workflow-config.yaml)

# Review what's new in template
cd .workflow_core
git log --oneline v1.0.1..HEAD -- config/.workflow-config.yaml.template
cd ..
```

#### Issue: Submodule Update Breaks Tests

**Symptoms:** Tests pass before submodule update, fail after

**Solution:**
```bash
# Rollback immediately
cd .workflow_core && git checkout v1.0.1 && cd ..
git add .workflow_core
git commit -m "Rollback submodule update"

# Investigate in separate branch
git checkout -b debug-submodule-update
cd .workflow_core && git checkout v1.1.0 && cd ..
# Debug and fix issues
```

#### Issue: Multiple Developers Out of Sync

**Symptoms:** Different developers have different submodule versions

**Solution:**
```bash
# Set explicit submodule version in documentation
# Add to README.md:
echo "Required ai_workflow_core version: v1.0.1" >> README.md

# Everyone syncs:
cd .workflow_core && git checkout v1.0.1 && cd ..
git submodule update --init --recursive
```

#### Issue: Integration Health Unknown

**Symptoms:** Unsure if integration is properly configured

**Solution:**
```bash
# Run comprehensive health check
bash .workflow_core/scripts/check_integration_health.sh

# Automatically fix common issues
bash .workflow_core/scripts/check_integration_health.sh --fix
```

### Getting Detailed Help

For issues not covered here:

1. **Check existing documentation**:
   - [Version Management Guide](guides/VERSION_MANAGEMENT.md)
   - [Integration Best Practices](guides/INTEGRATION_BEST_PRACTICES.md)

2. **Run health check**: `bash .workflow_core/scripts/check_integration_health.sh`

3. **Search existing issues**: [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)

4. **Open new issue**: Provide output from health check script

## Advanced Usage

### Using Multiple Versions

Pin to a specific version:

```bash
cd .workflow_core
git checkout v1.0.1
cd ..
git add .workflow_core
git commit -m "Pin ai_workflow_core to v1.0.1"
```

### Forking for Customization

If you need extensive customization:

```bash
# Fork on GitHub first, then:
git submodule add https://github.com/<your-username>/ai_workflow_core.git .workflow_core
```

### Sharing Configuration Across Projects

Use the same submodule in multiple projects with different configurations:

```
project_a/
├── .workflow_core/           # Submodule
└── .workflow-config.yaml     # Node.js config

project_b/
├── .workflow_core/           # Same submodule
└── .workflow-config.yaml     # Python config
```

## Best Practices

### Essential Practices

1. **Don't modify submodule files directly** - They'll be overwritten on update
2. **Version pin for stability** - Pin to tagged releases for production
3. **Document customizations** - Keep notes on what you changed from templates
4. **Test after updates** - Always test after updating the submodule
5. **Commit .gitmodules** - Ensure `.gitmodules` is committed and tracked

### For Dynamic Codebases

6. **Run health checks regularly** - Weekly validation with health check script
7. **Monitor for updates** - Watch GitHub releases for new versions
8. **Update incrementally** - Test in dev → staging → production
9. **Maintain version log** - Document when and why you update
10. **Automate validation** - Add health checks to CI/CD pipeline

### Version Management Strategy

**Production systems:**
- Pin to specific version tags (e.g., `v1.0.1`)
- Update quarterly or as-needed for security
- Test updates in staging first
- Document rollback plan

**Development systems:**
- Can track stable branch (`main`)
- Update more frequently
- Validate with automated tests
- Report issues upstream

See [Integration Best Practices](guides/INTEGRATION_BEST_PRACTICES.md) for comprehensive guidance on maintaining integrations in dynamic codebases.

## Getting Help

- **Health Check**: Run `bash .workflow_core/scripts/check_integration_health.sh` first
- **Documentation**: 
  - [Version Management Guide](guides/VERSION_MANAGEMENT.md) - Tracking and updating versions
  - [Integration Best Practices](guides/INTEGRATION_BEST_PRACTICES.md) - Maintaining dynamic codebases
- **Issues**: [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mpbarbosa/ai_workflow_core/discussions)
- **Examples**: [examples/](examples/) - Language-specific integration examples

---

**Version**: 1.0.1  
**Last Updated**: 2026-01-31

**Next Steps**: 
- See [examples/](examples/) for complete integration examples
- Read [Version Management Guide](guides/VERSION_MANAGEMENT.md) for update strategies
- Review [Integration Best Practices](guides/INTEGRATION_BEST_PRACTICES.md) for maintenance tips
