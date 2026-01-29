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

# Append gitignore patterns (or create if doesn't exist)
if [ -f .gitignore ]; then
    echo "" >> .gitignore
    echo "# AI Workflow artifacts" >> .gitignore
    cat .workflow_core/config/.gitignore.template >> .gitignore
else
    cp .workflow_core/config/.gitignore.template .gitignore
fi

# Copy VS Code configuration (optional)
cp -r .workflow_core/config/.vscode .vscode
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

#### Project Types

- `bash-automation-framework`
- `nodejs-application`
- `nodejs-library`
- `python-application`
- `python-package`
- `web-application`
- `cli-tool`
- `library`

#### Project Kinds

- `shell_automation`
- `web_application`
- `api_service`
- `library`
- `cli_tool`
- `data_pipeline`
- `mobile_app`

### Automated Placeholder Replacement

Use sed for quick replacements:

```bash
#!/bin/bash
CONFIG_FILE=".workflow-config.yaml"

# Replace placeholders
sed -i 's/{{PROJECT_NAME}}/My Awesome Project/g' "$CONFIG_FILE"
sed -i 's/{{PROJECT_TYPE}}/nodejs-application/g' "$CONFIG_FILE"
sed -i 's/{{PROJECT_DESCRIPTION}}/Web application for task management/g' "$CONFIG_FILE"
sed -i 's/{{PROJECT_KIND}}/web_application/g' "$CONFIG_FILE"
sed -i 's/{{VERSION}}/1.0.0/g' "$CONFIG_FILE"
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
  kind: "shell_automation"
  version: "1.0.0"

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
  kind: "web_application"
  version: "1.0.0"

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
  version: "1.0.0"

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
cp -r .workflow_core/github/workflows .github/

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

```bash
# Copy template
cp .workflow_core/github/copilot-instructions.md.template .github/copilot-instructions.md

# Edit and replace placeholders
# Use an editor or sed script:
sed -i 's/{{PROJECT_NAME}}/My Project/g' .github/copilot-instructions.md
sed -i 's/{{VERSION}}/1.0.0/g' .github/copilot-instructions.md
sed -i 's/{{REPO_NAME}}/my_project/g' .github/copilot-instructions.md
# ... etc
```

## Updating the Submodule

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

## Troubleshooting

### Issue: Submodule Not Initialized

```bash
# Symptoms: .workflow_core directory is empty
# Solution:
git submodule update --init --recursive
```

### Issue: Placeholders Not Replaced

```bash
# Symptoms: Config still shows {{PLACEHOLDERS}}
# Solution: Check for typos in sed commands or replace manually
grep -r "{{" .workflow-config.yaml  # Find remaining placeholders
```

### Issue: Workflow Artifacts Not Ignored

```bash
# Symptoms: Git wants to commit .ai_workflow/ contents
# Solution: Ensure .gitignore is properly configured
cat .workflow_core/config/.gitignore.template >> .gitignore
git rm -r --cached .ai_workflow/backlog .ai_workflow/logs  # Remove from index
```

### Issue: GitHub Workflows Failing

```bash
# Symptoms: CI/CD workflows fail
# Solution: Check language-specific setup in workflows
# Ensure test commands, lint commands match your project
# Verify dependencies are installed in workflow
```

### Issue: Submodule Detached HEAD

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

## Advanced Usage

### Using Multiple Versions

Pin to a specific version:

```bash
cd .workflow_core
git checkout v1.0.0
cd ..
git add .workflow_core
git commit -m "Pin ai_workflow_core to v1.0.0"
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

1. **Don't modify submodule files directly** - They'll be overwritten on update
2. **Version pin for stability** - Pin to tagged releases for production
3. **Document customizations** - Keep notes on what you changed from templates
4. **Test after updates** - Always test after updating the submodule
5. **Commit .gitmodules** - Ensure `.gitmodules` is committed and tracked

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mpbarbosa/ai_workflow_core/discussions)
- **Documentation**: [docs/](docs/)
- **Examples**: [examples/](examples/)

---

**Next Steps**: See [examples/](examples/) for complete integration examples in different languages.
