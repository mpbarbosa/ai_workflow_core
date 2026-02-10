# Workflow Automation Documentation

**Version**: 1.0.0  
**Last Updated**: 2026-02-10  
**Audience**: Users integrating ai_workflow_core with CI/CD systems

> **Purpose**: Documentation for automating workflows using ai_workflow_core templates with GitHub Actions, GitLab CI, and other CI/CD platforms.

## Table of Contents

- [Overview](#overview)
- [Available Workflow Templates](#available-workflow-templates)
- [GitHub Actions Integration](#github-actions-integration)
- [GitLab CI Integration](#gitlab-ci-integration)
- [Jenkins Integration](#jenkins-integration)
- [Custom Automation](#custom-automation)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

ai_workflow_core provides workflow automation templates that can be integrated into any CI/CD system. These templates automate:

- **Code quality checks**: Linting, formatting validation
- **Documentation validation**: Context blocks, structure, completeness
- **Test validation**: Test execution and coverage
- **Structure validation**: Directory structure consistency
- **Integration health**: Configuration and submodule validation

### Template Location

All workflow templates are located in:
```
workflow-templates/workflows/
├── code-quality.yml
├── validate-docs.yml
├── validate-tests.yml
├── validate-structure.yml
├── integration-health.yml
└── README.md
```

---

## Available Workflow Templates

### 1. Code Quality Workflow (`code-quality.yml`)

**Purpose**: Automated code quality checks including linting and formatting.

**Triggers**:
- Push to main/master/develop branches
- Pull requests
- Manual dispatch

**Checks**:
- YAML linting (yamllint)
- Shell script linting (shellcheck)
- Markdown linting (markdownlint)
- Python linting (pylint, flake8, black)
- JavaScript linting (eslint)
- Formatting validation

**Usage**:
```bash
# Copy to your project
cp .workflow_core/workflow-templates/workflows/code-quality.yml .github/workflows/
```

**Customization**:
```yaml
# Edit for your project's languages
- name: Lint Python
  if: hashFiles('**/*.py') != ''
  run: |
    pip install pylint flake8 black
    pylint **/*.py
```

### 2. Documentation Validation (`validate-docs.yml`)

**Purpose**: Validate documentation structure, links, and code examples.

**Triggers**:
- Push to main branch
- Pull requests modifying docs/
- Manual dispatch

**Checks**:
- Context blocks validation
- Markdown syntax
- Internal link validation
- Code example syntax
- Table of contents accuracy

**Usage**:
```bash
cp .workflow_core/workflow-templates/workflows/validate-docs.yml .github/workflows/
```

### 3. Test Validation (`validate-tests.yml`)

**Purpose**: Run test suites and verify test coverage.

**Triggers**:
- Push to any branch
- Pull requests
- Scheduled (daily)

**Checks**:
- Unit test execution
- Integration test execution
- Coverage thresholds
- Test report generation

**Usage**:
```bash
cp .workflow_core/workflow-templates/workflows/validate-tests.yml .github/workflows/
```

### 4. Structure Validation (`validate-structure.yml`)

**Purpose**: Validate repository directory structure consistency.

**Triggers**:
- Push to main branch
- Pull requests
- Manual dispatch

**Checks**:
- Required directories present
- Empty directories detection
- Undocumented directories
- Structure consistency

**Usage**:
```bash
cp .workflow_core/workflow-templates/workflows/validate-structure.yml .github/workflows/
```

### 5. Integration Health (`integration-health.yml`)

**Purpose**: Validate ai_workflow_core integration status.

**Triggers**:
- Push to main branch
- Pull requests
- Scheduled (weekly)
- Submodule updates

**Checks**:
- Submodule initialization
- Configuration validity
- Placeholder replacement
- Artifact directory structure
- .gitignore configuration

**Usage**:
```bash
cp .workflow_core/workflow-templates/workflows/integration-health.yml .github/workflows/
```

---

## GitHub Actions Integration

### Complete Setup

**Step 1: Create workflow directory**
```bash
mkdir -p .github/workflows
```

**Step 2: Copy workflow templates**
```bash
# Copy all workflows
cp .workflow_core/workflow-templates/workflows/*.yml .github/workflows/

# Or copy selectively
cp .workflow_core/workflow-templates/workflows/code-quality.yml .github/workflows/
cp .workflow_core/workflow-templates/workflows/integration-health.yml .github/workflows/
```

**Step 3: Customize for your project**

Edit each workflow file to match your project:

```yaml
# Example: Customize code-quality.yml
name: Code Quality (My Project)

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive  # Important for ai_workflow_core

      - name: Lint YAML
        run: |
          pip install yamllint
          yamllint -d relaxed config/
```

**Step 4: Configure permissions**

```yaml
permissions:
  contents: read
  pull-requests: write  # For PR comments
  checks: write         # For status checks
```

**Step 5: Add status badges**

```markdown
# In your README.md
![Code Quality](https://github.com/username/repo/workflows/Code%20Quality/badge.svg)
![Tests](https://github.com/username/repo/workflows/Tests/badge.svg)
```

### Environment Variables

Configure these in GitHub Settings → Secrets and variables → Actions:

```yaml
env:
  ARTIFACT_DIR: .ai_workflow
  CONFIG_FILE: .workflow-config.yaml
  PYTHON_VERSION: '3.11'
  NODE_VERSION: '20'
```

### Caching Dependencies

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

---

## GitLab CI Integration

### Complete Setup

**Step 1: Create GitLab CI configuration**

Create `.gitlab-ci.yml`:

```yaml
# .gitlab-ci.yml
image: ubuntu:latest

variables:
  ARTIFACT_DIR: .ai_workflow
  CONFIG_FILE: .workflow-config.yaml

stages:
  - validate
  - test
  - quality

before_script:
  - apt-get update -qq
  - apt-get install -y git python3 python3-pip

# Integration health check
integration-health:
  stage: validate
  script:
    - git submodule update --init --recursive
    - bash .workflow_core/scripts/check_integration_health.sh
  only:
    - main
    - merge_requests

# Code quality
code-quality:
  stage: quality
  script:
    - pip3 install yamllint
    - yamllint -d relaxed config/
  allow_failure: true

# Documentation validation
validate-docs:
  stage: validate
  script:
    - python3 .workflow_core/scripts/validate_context_blocks.py docs/
  only:
    changes:
      - docs/**/*

# Structure validation
validate-structure:
  stage: validate
  script:
    - python3 .workflow_core/scripts/validate_structure.py
  only:
    - main
```

**Step 2: Configure GitLab runners**

Ensure runners have necessary tools:
```bash
# On GitLab runner
apt-get install git python3 shellcheck yamllint
```

**Step 3: Add badges**

```markdown
[![pipeline status](https://gitlab.com/username/repo/badges/main/pipeline.svg)](https://gitlab.com/username/repo/-/commits/main)
```

---

## Jenkins Integration

### Complete Setup

**Step 1: Create Jenkinsfile**

Create `Jenkinsfile`:

```groovy
pipeline {
    agent any
    
    environment {
        ARTIFACT_DIR = '.ai_workflow'
        CONFIG_FILE = '.workflow-config.yaml'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git submodule update --init --recursive'
            }
        }
        
        stage('Integration Health') {
            steps {
                sh 'bash .workflow_core/scripts/check_integration_health.sh'
            }
        }
        
        stage('Code Quality') {
            parallel {
                stage('YAML Lint') {
                    steps {
                        sh 'yamllint -d relaxed config/'
                    }
                }
                stage('Shell Lint') {
                    steps {
                        sh 'shellcheck scripts/*.sh'
                    }
                }
            }
        }
        
        stage('Validate Structure') {
            steps {
                sh 'python3 .workflow_core/scripts/validate_structure.py'
            }
        }
        
        stage('Validate Docs') {
            when {
                changeset "docs/**/*"
            }
            steps {
                sh 'python3 .workflow_core/scripts/validate_context_blocks.py docs/'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            mail to: 'team@example.com',
                 subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                 body: "Build failed: ${env.BUILD_URL}"
        }
    }
}
```

---

## Custom Automation

### Using Scripts Directly

All validation scripts can be used in any automation system:

```bash
# In any CI/CD system
bash .workflow_core/scripts/check_integration_health.sh
python3 .workflow_core/scripts/validate_structure.py
python3 .workflow_core/scripts/validate_context_blocks.py docs/
```

### Pre-commit Hooks

Integrate with Git pre-commit hooks:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: integration-health
        name: Check integration health
        entry: bash .workflow_core/scripts/check_integration_health.sh
        language: system
        pass_filenames: false
        
      - id: validate-structure
        name: Validate directory structure
        entry: python3 .workflow_core/scripts/validate_structure.py
        language: system
        pass_filenames: false
```

### Custom Scripts

Create custom automation scripts:

```bash
#!/bin/bash
# scripts/ci-validate.sh

set -e

echo "Running ai_workflow_core validations..."

# Check integration health
bash .workflow_core/scripts/check_integration_health.sh

# Validate structure
python3 .workflow_core/scripts/validate_structure.py

# Validate docs if changed
if git diff --name-only HEAD~1 | grep -q "^docs/"; then
    python3 .workflow_core/scripts/validate_context_blocks.py docs/
fi

echo "All validations passed!"
```

---

## Best Practices

### 1. Validation Frequency

**Every commit**:
- Code quality checks
- Basic structure validation

**Pull requests**:
- Full validation suite
- Integration health
- Documentation validation

**Scheduled**:
- Weekly integration health
- Monthly comprehensive audit

### 2. Fail Fast Strategy

```yaml
# Run critical checks first
stages:
  - integration    # Check submodule and config
  - quality        # Lint and format
  - test           # Run tests
  - deploy         # Only if all pass
```

### 3. Caching Strategies

**Cache validation results**:
```yaml
- uses: actions/cache@v3
  with:
    path: .validation-cache
    key: validation-${{ hashFiles('**/*.yaml', '**/*.md') }}
```

**Cache dependencies**:
```yaml
- uses: actions/cache@v3
  with:
    path: |
      ~/.cache/pip
      node_modules
    key: deps-${{ hashFiles('requirements.txt', 'package-lock.json') }}
```

### 4. Conditional Execution

```yaml
# Only validate docs if changed
- name: Validate docs
  if: contains(github.event.head_commit.modified, 'docs/')
  run: python3 .workflow_core/scripts/validate_context_blocks.py docs/
```

### 5. Parallel Execution

```yaml
jobs:
  quality:
    strategy:
      matrix:
        check: [yaml, shell, python, markdown]
    steps:
      - name: Run ${{ matrix.check }} checks
        run: ./scripts/check-${{ matrix.check }}.sh
```

---

## Troubleshooting

### Common Issues

#### Submodule Not Found

**Problem**: Workflow fails with "submodule not found"

**Solution**:
```yaml
- uses: actions/checkout@v3
  with:
    submodules: recursive  # Add this!
```

#### Permission Denied on Scripts

**Problem**: Scripts fail with permission errors

**Solution**:
```bash
# Make scripts executable
chmod +x .workflow_core/scripts/*.sh
git add .workflow_core/scripts/*.sh
git commit -m "fix: make scripts executable"
```

#### Python Module Not Found

**Problem**: `ModuleNotFoundError` in validation scripts

**Solution**:
```yaml
- name: Install Python dependencies
  run: |
    python3 -m pip install --upgrade pip
    pip3 install pyyaml  # or other required modules
```

#### YAML Lint Failures

**Problem**: yamllint reports too many style issues

**Solution**:
```yaml
# Use relaxed mode
- run: yamllint -d relaxed config/

# Or create .yamllint
# .yamllint
extends: default
rules:
  line-length:
    max: 120
  indentation:
    spaces: 2
```

---

## Related Documentation

- [GitHub Actions Templates](../workflow-templates/README.md)
- [Integration Best Practices](../guides/INTEGRATION_BEST_PRACTICES.md)
- [Script Reference](../api/SCRIPT_API_REFERENCE.md)
- [CI/CD Integration Guide](../advanced/CI_CD_INTEGRATION.md)

---

**Need help?** See [Troubleshooting Guide](../guides/TROUBLESHOOTING.md) or [open an issue](https://github.com/mpbarbosa/ai_workflow_core/issues).

**Last Updated**: 2026-02-10
