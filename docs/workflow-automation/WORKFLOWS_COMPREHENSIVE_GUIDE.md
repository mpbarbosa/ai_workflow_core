# GitHub Actions Workflows - Comprehensive Guide

**Version**: 1.0.0  
**Last Updated**: 2026-02-16  
**Target Audience**: DevOps Engineers, Project Maintainers, Contributors

## Table of Contents

- [Overview](#overview)
- [Available Workflows](#available-workflows)
- [Workflow Details](#workflow-details)
- [Customization Guide](#customization-guide)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Performance Optimization](#performance-optimization)

---

## Overview

The `ai_workflow_core` repository provides **5 production-ready GitHub Actions workflows** that can be integrated into any project using this template library. These workflows provide automated quality checks, validation, and health monitoring.

### Workflow Philosophy

1. **Fast Feedback**: All workflows are optimized for speed with caching strategies
2. **Clear Reporting**: Rich output with timing metrics and summaries
3. **Fail Fast**: Critical issues halt the pipeline immediately
4. **Extensible**: Easy to customize for project-specific needs

### Quick Integration

```bash
# Copy all workflows to your project
cp -r .workflow_core/workflow-templates/workflows/* .github/workflows/

# Or copy selectively
cp .workflow_core/workflow-templates/workflows/code-quality.yml .github/workflows/
cp .workflow_core/workflow-templates/workflows/validate-structure.yml .github/workflows/
```

---

## Available Workflows

| Workflow | Purpose | Triggers | Duration |
|----------|---------|----------|----------|
| **code-quality.yml** | Linting and code quality checks | Push, PR, Manual | 2-5 min |
| **validate-structure.yml** | Directory structure validation | Push, PR, Manual | 1-2 min |
| **validate-docs.yml** | Documentation validation | Push, PR, Manual | 1-2 min |
| **validate-tests.yml** | Test execution and validation | Push, PR, Manual | 3-10 min |
| **integration-health.yml** | Integration health monitoring | Push, PR, Weekly, Manual | 2-3 min |

---

## Workflow Details

### 1. Code Quality Workflow (`code-quality.yml`)

**Purpose**: Runs multiple linters to ensure code quality standards.

#### Jobs

##### 1.1. ShellCheck Analysis
- **Purpose**: Static analysis for shell scripts
- **Scope**: Scans `./src/workflow` directory
- **Severity**: Warning and above
- **Output Format**: GCC-style for easy IDE integration

```yaml
# Key configuration
uses: ludeeus/action-shellcheck@master
with:
  scandir: './src/workflow'
  severity: warning
  format: gcc
```

**Customization**:
```yaml
# To scan different directories
scandir: './scripts'  # Change to your script directory

# To be more strict
severity: error  # Fails on errors only

# To change output format
format: json  # Options: gcc, json, checkstyle, diff, tty
```

##### 1.2. Markdown Linting
- **Purpose**: Ensures markdown documentation follows style guidelines
- **Tool**: markdownlint-cli
- **Configuration**: `.markdownlint.json` in repository root

```yaml
# Key configuration
markdownlint '**/*.md' \
  --ignore node_modules \
  --ignore src/workflow/backlog \
  --config .markdownlint.json
```

**Customization**:
```yaml
# Custom ignore patterns
--ignore build \
--ignore dist \
--ignore coverage

# Custom config file
--config .custom-markdownlint.json

# Fail on errors (remove '|| true')
markdownlint '**/*.md' --config .markdownlint.json
```

**Recommended `.markdownlint.json`**:
```json
{
  "default": true,
  "MD013": false,
  "MD033": false,
  "MD041": false,
  "line-length": false,
  "no-inline-html": false,
  "first-line-heading": false
}
```

##### 1.3. YAML Validation
- **Purpose**: Validates YAML syntax and structure
- **Tool**: yamllint
- **Scope**: Configuration files and workflows

```yaml
# Key configuration
yamllint src/workflow/config/*.yaml \
  src/workflow/lib/*.yaml \
  .github/workflows/*.yml
```

**Customization**:
```yaml
# For configuration-library projects
yamllint config/*.yaml

# For Python projects
yamllint config/*.yaml \
  .github/workflows/*.yml \
  docker-compose.yml

# With custom config
yamllint -c .yamllint.yml config/
```

**Recommended `.yamllint` config**:
```yaml
extends: default
rules:
  line-length:
    max: 120
    level: warning
  comments:
    min-spaces-from-content: 1
  indentation:
    spaces: 2
```

##### 1.4. Test Execution
- **Purpose**: Runs project test suite
- **Frameworks**: BATS for shell, adaptable for others
- **Timeout**: 60 seconds per test file

```yaml
# Key configuration (shell/BATS)
for test_file in test_*.sh; do
  timeout 60s bash "$test_file" || echo "Test failed"
done
```

**Customization for Different Languages**:

**Node.js/JavaScript**:
```yaml
- name: Run tests
  run: npm test

- name: Run tests with coverage
  run: npm run test:coverage
```

**Python**:
```yaml
- name: Run pytest
  run: |
    pip install pytest pytest-cov
    pytest tests/ --cov=src --cov-report=xml
```

**Configuration Library (like ai_workflow_core)**:
```yaml
- name: Run validation scripts
  run: |
    python3 scripts/validate_context_blocks.py
    python3 scripts/validate_structure.py
```

##### 1.5. Documentation Validation
- **Purpose**: Checks documentation consistency and links
- **Checks**: Broken links, inconsistent references

```yaml
# Check for broken internal links
find docs -name "*.md" -type f -exec grep -H "\[.*\](.*)" {} \; | \
  grep -v "http" | \
  grep -v "^#" || true
```

**Customization**:
```yaml
# Add custom validation scripts
- name: Validate documentation
  run: |
    bash scripts/validate_docs.sh
    bash scripts/check_api_references.sh
    
# Check for placeholder consistency
- name: Check placeholders
  run: |
    grep -r "{{" docs/ && exit 1 || echo "No placeholders found"
```

#### Caching Strategy

The code-quality workflow uses **5 caching layers**:

1. **ShellCheck results**: `~/.cache/shellcheck`
2. **npm dependencies**: `~/.npm`
3. **pip dependencies**: `~/.cache/pip`
4. **Test results**: `test-results/`
5. **Documentation validation**: `~/.cache/doc-validation`

**Cache Keys**:
- Uses file hashes for automatic invalidation
- Fallback keys for partial cache hits
- 7-day retention by default

```yaml
# Example cache configuration
- uses: actions/cache@v4
  with:
    path: ~/.cache/shellcheck
    key: shellcheck-${{ hashFiles('src/**/*.sh') }}
    restore-keys: shellcheck-
```

#### Timing Metrics

Each job tracks execution time:

```yaml
- name: Track step timing
  run: echo "STEP_START=$(date +%s)" >> $GITHUB_ENV

- name: Report timing
  if: always()
  run: |
    DURATION=$(($(date +%s) - STEP_START))
    echo "::notice::Job duration: ${DURATION}s"
```

---

### 2. Structure Validation Workflow (`validate-structure.yml`)

**Purpose**: Ensures directory structure integrity and documentation alignment.

#### Jobs

##### 2.1. Validate Repository Structure
- **Python Version**: 3.9+
- **Script**: `scripts/validate_structure.py`
- **Checks**: Required directories, empty directories, structure alignment

##### 2.2. Check for Empty Directories

```yaml
EMPTY_DIRS=$(find . -type d -empty \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -not -path "./.ai_workflow/*" \
  2>/dev/null || true)
```

**Excluded Paths** (configurable):
- `.git/` - Git metadata
- `node_modules/` - npm dependencies
- `__pycache__/` - Python cache
- `.venv/`, `venv/` - Python virtual environments
- `.ai_workflow/` - Workflow artifacts
- `docs/misc/` - Allowed empty directory

**Customization**:
```yaml
# Add custom exclusions
-not -path "./build/*" \
-not -path "./dist/*" \
-not -path "./coverage/*"

# Make empty directories fail
if [ -n "$EMPTY_DIRS" ]; then
  echo "❌ Found empty directories"
  exit 1
fi
```

##### 2.3. Verify Required Directories

Default required directories:
- `config/`
- `docs/`
- `examples/`
- `scripts/`
- `workflow-templates/`
- `.github/`

**Customization**:
```yaml
# For Node.js projects
REQUIRED_DIRS=(
  "src"
  "tests"
  "docs"
  ".github"
)

# For Python projects
REQUIRED_DIRS=(
  "src"
  "tests"
  "docs"
  "scripts"
  ".github"
)

# For shell projects
REQUIRED_DIRS=(
  "scripts"
  "tests"
  "docs"
  ".github"
)
```

##### 2.4. Structure Documentation Alignment

Compares actual structure with documented structure in `copilot-instructions.md`.

```yaml
# Extract documented directories
DOCUMENTED_DIRS=$(grep -E "^├── |^│   ├── " .github/copilot-instructions.md | \
  sed 's/^[│├─ ]*//g' | sed 's/\/.*//g' | sort -u)
```

##### 2.5. Generate Structure Report

Produces comprehensive report:
- Top-level directories
- Documentation subdirectories
- File counts per subdirectory
- Total markdown files
- Total directories

**Report Output**:
```
=== Directory Structure Report ===

Top-level directories:
./config
./docs
./examples

Documentation subdirectories:
docs/api
docs/guides
docs/developers

File counts per docs subdirectory:
  api: 9 files
  guides: 11 files
  developers: 3 files

Total markdown files: 568
Total directories: 42
```

---

### 3. Documentation Validation Workflow (`validate-docs.yml`)

**Purpose**: Validates documentation integrity and consistency.

#### Configuration

```yaml
name: Validate Documentation

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'docs/**'
      - '**.md'
  pull_request:
    paths:
      - 'docs/**'
      - '**.md'
  workflow_dispatch:
```

#### Jobs

##### 3.1. Link Validation
- Checks for broken internal links
- Validates external links (optional)
- Reports missing references

##### 3.2. Placeholder Validation
- Ensures no `{{PLACEHOLDER}}` in documentation
- Validates placeholder references are documented

##### 3.3. Context Block Validation
- Runs `validate_context_blocks.py` script
- Checks YAML context blocks in documentation

**Customization**:
```yaml
# Add custom validation
- name: Validate API docs
  run: |
    bash scripts/validate_api_docs.sh

# Check for outdated dates
- name: Check documentation dates
  run: |
    bash scripts/check_doc_freshness.sh
```

---

### 4. Test Validation Workflow (`validate-tests.yml`)

**Purpose**: Comprehensive test execution and coverage validation.

#### Jobs

##### 4.1. Test Execution
- Runs all test suites
- Collects coverage data
- Validates test quality

##### 4.2. Coverage Reporting
- Minimum coverage thresholds
- Coverage report upload
- Historical coverage tracking

**Configuration for Different Frameworks**:

**Jest (Node.js)**:
```yaml
- name: Run Jest tests
  run: npm test -- --coverage --maxWorkers=2

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

**pytest (Python)**:
```yaml
- name: Run pytest
  run: |
    pytest tests/ \
      --cov=src \
      --cov-report=xml \
      --cov-report=html

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage.xml
```

**BATS (Shell)**:
```yaml
- name: Run BATS tests
  run: |
    bats tests/*.bats --report-formatter junit \
      --output test-results/

- name: Upload results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: test-results/
```

---

### 5. Integration Health Workflow (`integration-health.yml`)

**Purpose**: Monitors ai_workflow_core submodule integration health.

#### Triggers

- **Push**: Changes to `.workflow_core/`, `.workflow-config.yaml`, `.ai_workflow/`
- **Pull Request**: Same paths as push
- **Schedule**: Weekly on Monday at midnight UTC
- **Manual**: `workflow_dispatch`

#### Jobs

##### 5.1. Health Check
- Runs `check_integration_health.sh` script
- Checks for unreplaced placeholders
- Validates YAML syntax
- Reports submodule version

```yaml
- name: Check for unreplaced placeholders
  run: |
    if grep -r "{{" .workflow-config.yaml; then
      echo "❌ Configuration contains unreplaced placeholders"
      exit 1
    fi
```

##### 5.2. Validate Structure
- Checks artifact directories exist
- Validates `.gitignore` configuration

**Required Artifact Directories**:
```yaml
REQUIRED_DIRS=(
  ".ai_workflow/backlog"
  ".ai_workflow/summaries"
  ".ai_workflow/logs"
  ".ai_workflow/metrics"
  ".ai_workflow/checkpoints"
  ".ai_workflow/prompts"
  ".ai_workflow/ml_models"
  ".ai_workflow/.incremental_cache"
)
```

##### 5.3. Health Report

Generates summary report:
```markdown
## Integration Health Report

- **Submodule Version**: v1.0.0
- **Submodule Commit**: abc123f
- **Workflow**: Integration Health Check
- **Triggered by**: schedule
```

**Customization**:
```yaml
# Custom health checks
- name: Check configuration validity
  run: |
    bash scripts/validate_config.sh .workflow-config.yaml

# Check script templates
- name: Validate script templates
  run: |
    bash .workflow_core/scripts/check_integration_health.sh --verbose
```

---

## Customization Guide

### Language-Specific Customization

#### Node.js/JavaScript Projects

```yaml
# Replace ShellCheck with ESLint
eslint:
  name: ESLint Analysis
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
    - run: npm run lint

# Replace BATS with Jest
test-execution:
  name: Run Jest Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
    - run: npm test -- --coverage
```

#### Python Projects

```yaml
# Replace ShellCheck with pylint
pylint:
  name: Pylint Analysis
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-python@v5
      with:
        python-version: '3.11'
    - run: pip install pylint
    - run: pylint src/

# Replace BATS with pytest
test-execution:
  name: Run pytest
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-python@v5
      with:
        python-version: '3.11'
    - run: pip install -r requirements.txt
    - run: pytest tests/ --cov=src
```

#### Configuration Library Projects (like ai_workflow_core)

```yaml
# Focus on validation scripts
validation:
  name: Validate Configuration
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-python@v5
      with:
        python-version: '3.11'
    - run: pip install yamllint
    - run: yamllint -d relaxed config/
    - run: python3 scripts/validate_context_blocks.py
    - run: python3 scripts/validate_structure.py
```

### Trigger Customization

```yaml
# Run on all branches
on:
  push:
    branches: [ '**' ]

# Run only on specific paths
on:
  push:
    paths:
      - 'src/**'
      - 'tests/**'

# Run on schedule
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

# Disable PR checks
on:
  push:
    branches: [ main, develop ]
  # Remove pull_request trigger
```

### Performance Tuning

#### Parallel Job Execution

```yaml
jobs:
  lint:
    strategy:
      matrix:
        linter: [eslint, prettier, stylelint]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g ${{ matrix.linter }}
      - run: ${{ matrix.linter }} .
```

#### Conditional Job Execution

```yaml
jobs:
  expensive-tests:
    # Only run on main branch
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:e2e

  quick-tests:
    # Run on all branches
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:unit
```

---

## Troubleshooting

### Common Issues

#### 1. Workflow Not Triggering

**Symptoms**: Workflow doesn't run on push/PR

**Solutions**:
```yaml
# Check trigger paths
on:
  push:
    paths:
      - 'src/**'
      - '!src/test/**'  # Exclude paths with !

# Check branch names
on:
  push:
    branches: 
      - main
      - develop
      - 'feature/**'
```

#### 2. Cache Not Working

**Symptoms**: Long build times, dependencies reinstalled every run

**Solutions**:
```yaml
# Ensure cache key is unique and deterministic
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: npm-${{ runner.os }}-

# Check cache size (< 10GB limit)
- run: du -sh ~/.npm
```

#### 3. Linter Failures

**Symptoms**: Unexpected linting errors

**Solutions**:
```bash
# Run linter locally first
npm run lint

# Check linter configuration
cat .eslintrc.json

# Update linter version in workflow
- run: npm install -g eslint@latest
```

#### 4. Test Timeouts

**Symptoms**: Tests hang or timeout

**Solutions**:
```yaml
# Increase timeout
- run: npm test
  timeout-minutes: 30  # Default is 360 (6 hours)

# Add timeout per test file
- run: timeout 60s bash test_file.sh
```

#### 5. Permission Errors

**Symptoms**: Cannot write to directories, permission denied

**Solutions**:
```yaml
# Grant permissions
- run: chmod +x scripts/*.sh

# Run with sudo (use sparingly)
- run: sudo apt-get install package

# Check GITHUB_TOKEN permissions
permissions:
  contents: read
  packages: write
```

---

## Best Practices

### 1. Keep Workflows Fast

✅ **Do**:
- Use caching aggressively
- Run expensive jobs conditionally
- Parallelize independent jobs
- Use matrix strategies for similar jobs

❌ **Don't**:
- Run full test suite on every commit
- Install unnecessary dependencies
- Duplicate work across jobs

### 2. Fail Fast

```yaml
# Cancel in-progress runs on new push
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Fail fast in matrix builds
strategy:
  fail-fast: true
  matrix:
    node: [18, 20, 22]
```

### 3. Secure Workflows

```yaml
# Use pinned action versions
uses: actions/checkout@v4  # ✅ Pinned
uses: actions/checkout@main  # ❌ Unpinned

# Use secrets for sensitive data
env:
  API_KEY: ${{ secrets.API_KEY }}  # ✅ Secure
  API_KEY: "hardcoded-key"  # ❌ Insecure

# Limit permissions
permissions:
  contents: read  # Minimal permissions
```

### 4. Meaningful Reports

```yaml
# Use step summaries
- run: |
    echo "## Test Results" >> $GITHUB_STEP_SUMMARY
    echo "- Tests: 42 passed" >> $GITHUB_STEP_SUMMARY

# Upload artifacts
- uses: actions/upload-artifact@v3
  with:
    name: coverage-report
    path: coverage/
```

### 5. Maintainability

```yaml
# Use reusable workflows
workflow_call:
  inputs:
    node-version:
      required: true
      type: string

# Extract common steps
- uses: ./.github/actions/setup-node

# Document workflows
# This workflow validates code quality
# Runs on: push, pull_request
# Duration: ~5 minutes
```

---

## Performance Optimization

### Caching Strategies

#### 1. Dependency Caching

```yaml
# Node.js
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ hashFiles('**/package-lock.json') }}

# Python
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: pip-${{ hashFiles('**/requirements.txt') }}

# Ruby
- uses: actions/cache@v4
  with:
    path: vendor/bundle
    key: gems-${{ hashFiles('**/Gemfile.lock') }}
```

#### 2. Build Output Caching

```yaml
- uses: actions/cache@v4
  with:
    path: |
      dist/
      build/
      .cache/
    key: build-${{ github.sha }}
    restore-keys: build-
```

#### 3. Multi-Level Caching

```yaml
# Level 1: Exact match
key: cache-${{ hashFiles('**/*.js') }}

# Level 2: Partial match
restore-keys: |
  cache-${{ hashFiles('**/package.json') }}
  cache-
```

### Execution Optimization

#### 1. Conditional Steps

```yaml
- name: Run expensive check
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  run: npm run expensive-check
```

#### 2. Job Dependencies

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]
  
  test:
    needs: lint  # Only run if lint succeeds
    runs-on: ubuntu-latest
    steps: [...]
  
  deploy:
    needs: [lint, test]  # Wait for both
    runs-on: ubuntu-latest
    steps: [...]
```

#### 3. Artifact Sharing

```yaml
# Job 1: Build
- uses: actions/upload-artifact@v3
  with:
    name: dist
    path: dist/

# Job 2: Test (depends on build)
- uses: actions/download-artifact@v3
  with:
    name: dist
    path: dist/
```

---

## Monitoring and Observability

### GitHub Actions Insights

View workflow performance:
1. Repository → Actions tab
2. Click workflow name
3. View run history and timing

### Custom Metrics

```yaml
- name: Track performance metrics
  run: |
    echo "build_duration=$DURATION" >> metrics.txt
    echo "test_count=$TEST_COUNT" >> metrics.txt

- uses: actions/upload-artifact@v3
  with:
    name: metrics
    path: metrics.txt
```

### Alerts and Notifications

```yaml
# Slack notification on failure
- name: Slack Notification
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Workflow failed: ${{ github.workflow }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## See Also

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [CI/CD Integration Guide](../advanced/CI_CD_INTEGRATION.md)
- [Script API Reference](../api/SCRIPT_API_REFERENCE.md)

---

**Last Updated**: 2026-02-16  
**Version**: 1.0.0  
**Maintainers**: AI Workflow Core Team
