# Custom Workflow Creation

**Version**: 2.0.0  
**Last Updated**: 2026-02-07  
**Audience**: Advanced users creating custom automation workflows

> **Purpose**: Learn how to create custom workflows using ai_workflow_core as a foundation. This guide covers workflow design patterns, script creation, automation strategies, and integration with the template system.

---

## Table of Contents

- [Overview](#overview)
- [Workflow Design Principles](#workflow-design-principles)
- [Workflow Types](#workflow-types)
- [Creating Script-Based Workflows](#creating-script-based-workflows)
- [Configuration-Driven Workflows](#configuration-driven-workflows)
- [Workflow Orchestration](#workflow-orchestration)
- [State Management](#state-management)
- [Error Handling](#error-handling)
- [Workflow Templates](#workflow-templates)
- [Integration with ai_workflow_core](#integration-with-ai_workflow_core)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Testing Workflows](#testing-workflows)

---

## Overview

### What is a Custom Workflow?

A **custom workflow** is an automated sequence of tasks tailored to your project's specific needs. While ai_workflow_core provides templates and configuration, you create workflows to:

- 🎯 **Automate repetitive tasks**: Build, test, deploy sequences
- 🎯 **Enforce standards**: Code quality checks, documentation generation
- 🎯 **Orchestrate processes**: Multi-step deployments, data pipelines
- 🎯 **Integrate tools**: Connect linters, testers, deployers

### Why Create Custom Workflows?

✅ **Project-specific requirements** not covered by standard workflows  
✅ **Domain-specific automation** (e.g., ML pipelines, infrastructure provisioning)  
✅ **Tool integration** with your specific tech stack  
✅ **Team processes** unique to your organization

---

## Workflow Design Principles

### 1. Single Responsibility

Each workflow should have **one clear purpose**:

✅ **Good**:
- `test.sh` - Run all tests
- `deploy.sh` - Deploy to production
- `lint.sh` - Run code quality checks

❌ **Bad**:
- `do-everything.sh` - Test, lint, build, deploy, notify

### 2. Composability

Build workflows from **smaller, reusable components**:

```bash
# workflows/build.sh
source workflows/lib/utils.sh
source workflows/lib/validation.sh

function main() {
  validate_environment
  install_dependencies
  run_build
  verify_artifacts
}
```

### 3. Fail Fast

Detect and report errors **as early as possible**:

```bash
#!/bin/bash
set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Validate inputs before starting
if [[ ! -f ".workflow-config.yaml" ]]; then
  echo "❌ Configuration file not found"
  exit 1
fi

# Continue with workflow...
```

### 4. Observability

Make workflows **transparent and debuggable**:

```bash
# Log every major step
log "INFO" "Starting deployment workflow"
log "INFO" "Environment: $ENVIRONMENT"
log "INFO" "Version: $VERSION"

# Provide progress indicators
echo "⏳ Building application... (1/5)"
echo "⏳ Running tests... (2/5)"
echo "⏳ Creating artifacts... (3/5)"
```

### 5. Idempotency

Workflows should be **safe to run multiple times**:

```bash
# ❌ Bad: Fails if directory exists
mkdir deployment-artifacts

# ✅ Good: Idempotent
mkdir -p deployment-artifacts

# ✅ Good: Clean before creating
rm -rf deployment-artifacts
mkdir deployment-artifacts
```

---

## Workflow Types

### Type 1: Linear Workflows

**Pattern**: Sequential steps, each depends on previous

**Example**: Build → Test → Package → Deploy

```bash
#!/bin/bash
# workflows/deploy.sh - Linear deployment workflow

set -euo pipefail

source workflows/lib/utils.sh

log "Step 1/4: Building application"
npm run build || exit 1

log "Step 2/4: Running tests"
npm test || exit 1

log "Step 3/4: Creating deployment package"
npm run package || exit 1

log "Step 4/4: Deploying to production"
npm run deploy:prod || exit 1

log "✅ Deployment complete"
```

---

### Type 2: Parallel Workflows

**Pattern**: Multiple independent steps execute concurrently

**Example**: Lint (JS + Python + Shell) in parallel

```bash
#!/bin/bash
# workflows/lint-parallel.sh - Parallel linting

set -euo pipefail

# Run linters in background
eslint . &
PID_ESLINT=$!

pylint src/ &
PID_PYLINT=$!

shellcheck **/*.sh &
PID_SHELLCHECK=$!

# Wait for all to complete
FAILED=()

wait $PID_ESLINT || FAILED+=("eslint")
wait $PID_PYLINT || FAILED+=("pylint")
wait $PID_SHELLCHECK || FAILED+=("shellcheck")

# Report results
if [ ${#FAILED[@]} -eq 0 ]; then
  echo "✅ All linters passed"
  exit 0
else
  echo "❌ Linters failed: ${FAILED[*]}"
  exit 1
fi
```

---

### Type 3: Conditional Workflows

**Pattern**: Branch based on conditions

**Example**: Deploy to staging OR production based on branch

```bash
#!/bin/bash
# workflows/deploy-conditional.sh - Conditional deployment

set -euo pipefail

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH" == "main" ]]; then
  echo "🚀 Deploying to PRODUCTION"
  bash workflows/deploy-production.sh
elif [[ "$BRANCH" == "develop" ]]; then
  echo "🧪 Deploying to STAGING"
  bash workflows/deploy-staging.sh
else
  echo "⚠️  Branch '$BRANCH' not configured for deployment"
  exit 1
fi
```

---

### Type 4: Approval Workflows

**Pattern**: Require human confirmation before proceeding

**Example**: Prompt before production deployment

```bash
#!/bin/bash
# workflows/deploy-with-approval.sh - Approval workflow

set -euo pipefail

# Show what will be deployed
echo "========================================="
echo "Production Deployment"
echo "========================================="
echo "Environment: PRODUCTION"
echo "Version: $(cat VERSION)"
echo "Services: api, web, worker"
echo "========================================="

# Request confirmation
read -p "Deploy to production? (yes/no): " CONFIRM

if [[ "$CONFIRM" != "yes" ]]; then
  echo "❌ Deployment cancelled"
  exit 0
fi

echo "✅ Confirmed. Deploying..."
bash workflows/deploy-production.sh
```

---

### Type 5: Retry Workflows

**Pattern**: Retry failed steps with backoff

**Example**: Retry flaky network operations

```bash
#!/bin/bash
# workflows/lib/retry.sh - Retry helper

function retry() {
  local max_attempts=$1
  local delay=$2
  shift 2
  local command="$@"
  
  local attempt=1
  while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt/$max_attempts: $command"
    
    if eval "$command"; then
      return 0
    fi
    
    if [ $attempt -lt $max_attempts ]; then
      echo "⏳ Waiting ${delay}s before retry..."
      sleep $delay
      delay=$((delay * 2))  # Exponential backoff
    fi
    
    attempt=$((attempt + 1))
  done
  
  echo "❌ Command failed after $max_attempts attempts"
  return 1
}

# Usage
retry 3 5 "curl -f https://api.example.com/deploy"
```

---

## Creating Script-Based Workflows

### Basic Workflow Script Template

```bash
#!/bin/bash
# workflows/my-workflow.sh - Description of workflow
# Version: 2.0.0
# Date: 2026-02-07

set -euo pipefail

# ============================================================================
# Configuration
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKFLOW_DIR="${PROJECT_ROOT}/.ai_workflow"

# Load configuration
if [[ -f "${PROJECT_ROOT}/.workflow-config.yaml" ]]; then
  # Parse YAML config (simplified - use yq or python for complex parsing)
  PROJECT_NAME=$(grep "name:" "${PROJECT_ROOT}/.workflow-config.yaml" | cut -d'"' -f2)
  PROJECT_VERSION=$(grep "version:" "${PROJECT_ROOT}/.workflow-config.yaml" | cut -d'"' -f2)
fi

# Load utilities
source "${SCRIPT_DIR}/lib/utils.sh"

# ============================================================================
# Functions
# ============================================================================

function validate_environment() {
  log "INFO" "Validating environment"
  
  # Check required files
  if [[ ! -f "$PROJECT_ROOT/.workflow-config.yaml" ]]; then
    log "ERROR" "Configuration file not found"
    exit 1
  fi
  
  # Check required tools
  for tool in git npm node; do
    if ! command -v $tool &> /dev/null; then
      log "ERROR" "Required tool not found: $tool"
      exit 1
    fi
  done
  
  log "INFO" "Environment validation passed"
}

function step_1_example() {
  log "INFO" "Executing step 1"
  # Your step logic here
}

function step_2_example() {
  log "INFO" "Executing step 2"
  # Your step logic here
}

function cleanup() {
  log "INFO" "Cleaning up"
  # Cleanup logic here
}

# ============================================================================
# Main Workflow
# ============================================================================

function main() {
  log "INFO" "Starting workflow: $PROJECT_NAME v$PROJECT_VERSION"
  
  # Setup cleanup trap
  trap cleanup EXIT
  
  # Execute workflow steps
  validate_environment
  step_1_example
  step_2_example
  
  log "INFO" "✅ Workflow completed successfully"
}

# Run main function
main "$@"
```

---

### Utility Library

**workflows/lib/utils.sh**:

```bash
#!/bin/bash
# workflows/lib/utils.sh - Shared utility functions

# Logging
function log() {
  local level=$1
  shift
  local message="$@"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  
  case "$level" in
    ERROR)
      echo "[$timestamp] ❌ ERROR: $message" >&2
      ;;
    WARN)
      echo "[$timestamp] ⚠️  WARN: $message" >&2
      ;;
    SUCCESS)
      echo "[$timestamp] ✅ SUCCESS: $message"
      ;;
    *)
      echo "[$timestamp] ℹ️  INFO: $message"
      ;;
  esac
}

# Read YAML value
function get_config_value() {
  local key=$1
  local config_file="${PROJECT_ROOT}/.workflow-config.yaml"
  
  grep "$key:" "$config_file" | cut -d'"' -f2
}

# Check if command exists
function require_command() {
  local cmd=$1
  if ! command -v "$cmd" &> /dev/null; then
    log "ERROR" "Required command not found: $cmd"
    exit 1
  fi
}

# Execute with retry
function execute_with_retry() {
  local max_attempts=$1
  shift
  local command="$@"
  
  for attempt in $(seq 1 $max_attempts); do
    if eval "$command"; then
      return 0
    fi
    
    if [ $attempt -lt $max_attempts ]; then
      log "WARN" "Attempt $attempt failed, retrying..."
      sleep 2
    fi
  done
  
  log "ERROR" "Command failed after $max_attempts attempts"
  return 1
}

# Create workflow artifact directory
function ensure_artifact_dir() {
  local subdir=$1
  local dir="${WORKFLOW_DIR}/${subdir}"
  
  if [[ ! -d "$dir" ]]; then
    mkdir -p "$dir"
    log "INFO" "Created artifact directory: $dir"
  fi
}

# Save workflow artifact
function save_artifact() {
  local name=$1
  local content=$2
  local subdir=${3:-logs}
  
  ensure_artifact_dir "$subdir"
  
  local timestamp=$(date '+%Y%m%d_%H%M%S')
  local filename="${WORKFLOW_DIR}/${subdir}/${name}_${timestamp}.log"
  
  echo "$content" > "$filename"
  log "INFO" "Artifact saved: $filename"
}
```

---

## Configuration-Driven Workflows

### Read Configuration

Parse `.workflow-config.yaml` in your workflow:

**Python** (recommended for complex YAML):

```python
#!/usr/bin/env python3
# workflows/config-driven.py - Configuration-driven workflow

import yaml
import sys
from pathlib import Path

def load_config():
    config_file = Path(".workflow-config.yaml")
    if not config_file.exists():
        print("❌ Configuration file not found")
        sys.exit(1)
    
    with open(config_file) as f:
        return yaml.safe_load(f)

def main():
    config = load_config()
    
    project_name = config['project']['name']
    project_kind = config['project']['kind']
    test_command = config['tech_stack']['test_command']
    
    print(f"Running workflow for: {project_name}")
    print(f"Project kind: {project_kind}")
    print(f"Test command: {test_command}")
    
    # Execute test command from config
    import subprocess
    result = subprocess.run(test_command, shell=True)
    sys.exit(result.returncode)

if __name__ == '__main__':
    main()
```

**Bash** (simple key-value extraction):

```bash
#!/bin/bash
# workflows/config-driven.sh - Simple YAML parsing

function get_yaml_value() {
  local key=$1
  grep "$key:" .workflow-config.yaml | cut -d'"' -f2
}

PROJECT_NAME=$(get_yaml_value "name")
TEST_COMMAND=$(get_yaml_value "test_command")

echo "Project: $PROJECT_NAME"
echo "Running: $TEST_COMMAND"

eval "$TEST_COMMAND"
```

---

### Define Custom Workflow Configuration

Add custom section to `.workflow-config.yaml`:

```yaml
# Standard configuration
project:
  name: "My Project"
  kind: "nodejs_api"

tech_stack:
  test_command: "npm test"

# Custom workflow configuration
workflows:
  deploy:
    environments:
      - staging
      - production
    approval_required:
      staging: false
      production: true
  
  release:
    changelog_required: true
    version_bump: "minor"  # major, minor, patch
    create_tag: true
  
  backup:
    schedule: "0 2 * * *"  # Daily at 2 AM
    retention_days: 30
    targets:
      - database
      - uploads
```

**Access in workflow**:

```python
config = load_config()

deploy_config = config['workflows']['deploy']
environments = deploy_config['environments']
needs_approval = deploy_config['approval_required']['production']
```

---

## Workflow Orchestration

### Sequential Orchestration

**workflows/orchestrator.sh**:

```bash
#!/bin/bash
# workflows/orchestrator.sh - Orchestrate multiple workflows

set -euo pipefail

source workflows/lib/utils.sh

WORKFLOWS=(
  "workflows/lint.sh"
  "workflows/test.sh"
  "workflows/build.sh"
  "workflows/package.sh"
)

log "INFO" "Starting workflow orchestration (${#WORKFLOWS[@]} workflows)"

for i in "${!WORKFLOWS[@]}"; do
  workflow="${WORKFLOWS[$i]}"
  step=$((i + 1))
  total=${#WORKFLOWS[@]}
  
  log "INFO" "[$step/$total] Executing: $workflow"
  
  if bash "$workflow"; then
    log "SUCCESS" "[$step/$total] Completed: $workflow"
  else
    log "ERROR" "[$step/$total] Failed: $workflow"
    exit 1
  fi
done

log "SUCCESS" "All workflows completed successfully"
```

---

### Parallel Orchestration

```bash
#!/bin/bash
# workflows/orchestrator-parallel.sh - Parallel execution

set -euo pipefail

source workflows/lib/utils.sh

WORKFLOWS=(
  "workflows/lint-js.sh"
  "workflows/lint-python.sh"
  "workflows/lint-shell.sh"
)

log "INFO" "Starting parallel workflow orchestration"

# Start all workflows in background
PIDS=()
for workflow in "${WORKFLOWS[@]}"; do
  log "INFO" "Starting: $workflow"
  bash "$workflow" &
  PIDS+=($!)
done

# Wait for all to complete
FAILED=()
for i in "${!WORKFLOWS[@]}"; do
  workflow="${WORKFLOWS[$i]}"
  pid="${PIDS[$i]}"
  
  if wait "$pid"; then
    log "SUCCESS" "Completed: $workflow"
  else
    log "ERROR" "Failed: $workflow"
    FAILED+=("$workflow")
  fi
done

# Report results
if [ ${#FAILED[@]} -eq 0 ]; then
  log "SUCCESS" "All workflows completed successfully"
  exit 0
else
  log "ERROR" "Failed workflows: ${FAILED[*]}"
  exit 1
fi
```

---

### Conditional Orchestration (Makefile)

**Makefile**:

```makefile
.PHONY: all ci cd quick full

# Quick check (fast, minimal)
quick: lint test-unit

# Full check (comprehensive, slow)
full: lint test-unit test-integration test-e2e

# Continuous Integration
ci: full build

# Continuous Deployment
cd: ci deploy-staging

# Individual workflows
lint:
	@echo "Running linters..."
	@bash workflows/lint.sh

test-unit:
	@echo "Running unit tests..."
	@bash workflows/test-unit.sh

test-integration:
	@echo "Running integration tests..."
	@bash workflows/test-integration.sh

test-e2e:
	@echo "Running E2E tests..."
	@bash workflows/test-e2e.sh

build:
	@echo "Building application..."
	@bash workflows/build.sh

deploy-staging:
	@echo "Deploying to staging..."
	@bash workflows/deploy-staging.sh

# Usage:
# make quick      # Fast check before commit
# make full       # Full check before PR
# make ci         # Run in CI pipeline
# make cd         # Deploy to staging
```

---

## State Management

### Workflow State Directory

```
.ai_workflow/
├── state/                    # Workflow state (add to .gitignore)
│   ├── last-deploy.json      # Last deployment info
│   ├── workflow-lock         # Lock file (prevent concurrent runs)
│   └── resume-points/        # Checkpoints for resuming
│       └── deploy_20260207.json
└── logs/                     # Workflow logs
    └── deploy_20260207.log
```

---

### Save/Load State

**workflows/lib/state.sh**:

```bash
#!/bin/bash
# workflows/lib/state.sh - State management

STATE_DIR="${WORKFLOW_DIR}/state"

function save_state() {
  local key=$1
  local value=$2
  
  mkdir -p "$STATE_DIR"
  echo "$value" > "${STATE_DIR}/${key}.state"
}

function load_state() {
  local key=$1
  local default=${2:-""}
  
  local state_file="${STATE_DIR}/${key}.state"
  if [[ -f "$state_file" ]]; then
    cat "$state_file"
  else
    echo "$default"
  fi
}

function clear_state() {
  local key=$1
  rm -f "${STATE_DIR}/${key}.state"
}

# Workflow locking
function acquire_lock() {
  local workflow=$1
  local lock_file="${STATE_DIR}/${workflow}.lock"
  
  if [[ -f "$lock_file" ]]; then
    log "ERROR" "Workflow already running (lock file exists)"
    exit 1
  fi
  
  echo "$$" > "$lock_file"  # Save process ID
}

function release_lock() {
  local workflow=$1
  rm -f "${STATE_DIR}/${workflow}.lock"
}
```

**Usage**:

```bash
source workflows/lib/state.sh

# Acquire lock (prevent concurrent runs)
acquire_lock "deploy"
trap "release_lock deploy" EXIT

# Save state
save_state "last_deploy_version" "1.2.3"
save_state "last_deploy_time" "$(date -Iseconds)"

# Load state
LAST_VERSION=$(load_state "last_deploy_version" "unknown")
echo "Last deployed version: $LAST_VERSION"
```

---

## Error Handling

### Comprehensive Error Handling

```bash
#!/bin/bash
# workflows/robust-workflow.sh - Error handling example

set -euo pipefail

source workflows/lib/utils.sh

# Error handler
function error_handler() {
  local exit_code=$?
  local line_number=$1
  
  log "ERROR" "Workflow failed at line $line_number with exit code $exit_code"
  
  # Save error details
  save_artifact "error" "Exit code: $exit_code\nLine: $line_number\nTime: $(date)"
  
  # Send notification (optional)
  # notify_team "Workflow failed: $exit_code"
  
  # Cleanup
  cleanup_on_error
  
  exit "$exit_code"
}

# Setup error trap
trap 'error_handler $LINENO' ERR

# Cleanup function
function cleanup_on_error() {
  log "WARN" "Cleaning up after error"
  
  # Stop background processes
  jobs -p | xargs -r kill 2>/dev/null || true
  
  # Remove temporary files
  rm -rf /tmp/workflow-temp-*
  
  # Restore backups if needed
  if [[ -f ".backup" ]]; then
    mv .backup .original
  fi
}

# Main workflow with error handling
function main() {
  log "INFO" "Starting workflow"
  
  # Step with error handling
  if ! npm run build; then
    log "ERROR" "Build failed"
    return 1
  fi
  
  # Step with retry
  if ! execute_with_retry 3 "npm test"; then
    log "ERROR" "Tests failed after retries"
    return 1
  fi
  
  log "SUCCESS" "Workflow completed"
}

main "$@"
```

---

## Workflow Templates

### Template Structure

```
workflow-templates/
├── README.md
└── workflows/
    ├── feature-development.yml     # Feature workflow
    ├── hotfix.yml                  # Hotfix workflow
    ├── release.yml                 # Release workflow
    └── maintenance.yml             # Maintenance workflow
```

### Feature Development Workflow Template

**workflow-templates/workflows/feature-development.yml**:

```yaml
name: Feature Development

# When to run
triggers:
  - push:
      branches: [feature/*]
  - pull_request:
      target: [develop]

# Workflow steps
steps:
  - name: "Validate"
    description: "Validate branch and configuration"
    script: "workflows/validate.sh"
    required: true
  
  - name: "Lint"
    description: "Run code quality checks"
    script: "workflows/lint.sh"
    required: true
    parallel: true
  
  - name: "Test"
    description: "Run test suite"
    script: "workflows/test.sh"
    required: true
    coverage_threshold: 80
  
  - name: "Build"
    description: "Build application"
    script: "workflows/build.sh"
    required: true
    artifacts:
      - dist/
      - build/
  
  - name: "Preview Deploy"
    description: "Deploy to preview environment"
    script: "workflows/deploy-preview.sh"
    required: false
    manual_approval: false

# Notifications
notifications:
  on_success:
    - slack: "#dev-notifications"
  on_failure:
    - slack: "#dev-alerts"
    - email: "dev-team@example.com"
```

---

## Integration with ai_workflow_core

### Use Configuration Templates

```bash
#!/bin/bash
# workflows/config-aware.sh - Read ai_workflow_core config

source workflows/lib/utils.sh

# Read project kind
PROJECT_KIND=$(get_config_value "kind")

# Adapt workflow based on project kind
case "$PROJECT_KIND" in
  nodejs_api)
    log "INFO" "Node.js API detected"
    npm run lint
    npm test
    npm run build
    ;;
  
  python_app)
    log "INFO" "Python application detected"
    pylint src/
    pytest
    python setup.py build
    ;;
  
  shell_script_automation)
    log "INFO" "Shell scripts detected"
    shellcheck **/*.sh
    bash tests/run_tests.sh
    ;;
  
  *)
    log "WARN" "Unknown project kind: $PROJECT_KIND"
    ;;
esac
```

---

### Use Artifact Directories

```bash
#!/bin/bash
# workflows/use-artifacts.sh - Leverage .ai_workflow directories

source workflows/lib/utils.sh

WORKFLOW_DIR="${PROJECT_ROOT}/.ai_workflow"

# Log to workflow logs
exec 1> >(tee -a "${WORKFLOW_DIR}/logs/workflow_$(date +%Y%m%d_%H%M%S).log")
exec 2>&1

# Save metrics
save_artifact "metrics" "Duration: ${DURATION}s\nStatus: success"

# Save execution summary
cat > "${WORKFLOW_DIR}/summaries/deploy_$(date +%Y%m%d).md" << EOF
# Deployment Summary

**Date**: $(date)
**Version**: $VERSION
**Environment**: $ENVIRONMENT
**Status**: ✅ Success

## Metrics
- Build time: ${BUILD_TIME}s
- Test time: ${TEST_TIME}s
- Deploy time: ${DEPLOY_TIME}s
EOF
```

---

## Examples

### Example 1: Deployment Workflow

```bash
#!/bin/bash
# workflows/deploy.sh - Complete deployment workflow

set -euo pipefail

source workflows/lib/utils.sh
source workflows/lib/state.sh

ENVIRONMENT=${1:-staging}

function validate_deployment() {
  log "INFO" "Validating deployment prerequisites"
  
  # Check environment
  if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    log "ERROR" "Invalid environment: $ENVIRONMENT"
    exit 1
  fi
  
  # Check credentials
  if [[ -z "${DEPLOY_TOKEN:-}" ]]; then
    log "ERROR" "DEPLOY_TOKEN not set"
    exit 1
  fi
  
  # Check version
  VERSION=$(get_config_value "version")
  LAST_VERSION=$(load_state "last_deploy_version_${ENVIRONMENT}" "0.0.0")
  
  log "INFO" "Current version: $VERSION"
  log "INFO" "Last deployed: $LAST_VERSION"
}

function run_pre_deploy_checks() {
  log "INFO" "Running pre-deployment checks"
  
  # Lint
  npm run lint || return 1
  
  # Test
  npm test || return 1
  
  # Security audit
  npm audit --audit-level=moderate || return 1
}

function build_artifacts() {
  log "INFO" "Building deployment artifacts"
  
  npm run build || return 1
  
  # Create deployment package
  tar -czf "deploy-${VERSION}.tar.gz" dist/
  
  log "SUCCESS" "Artifacts built: deploy-${VERSION}.tar.gz"
}

function deploy_to_environment() {
  log "INFO" "Deploying to $ENVIRONMENT"
  
  # Upload artifacts
  execute_with_retry 3 "scp deploy-${VERSION}.tar.gz deploy@${ENVIRONMENT}.example.com:/tmp/"
  
  # Extract and deploy
  ssh deploy@${ENVIRONMENT}.example.com << EOF
    cd /app
    tar -xzf /tmp/deploy-${VERSION}.tar.gz
    pm2 reload ecosystem.config.js
    pm2 save
EOF
  
  log "SUCCESS" "Deployed to $ENVIRONMENT"
}

function verify_deployment() {
  log "INFO" "Verifying deployment"
  
  # Health check
  for i in {1..10}; do
    if curl -sf "https://${ENVIRONMENT}.example.com/health"; then
      log "SUCCESS" "Health check passed"
      return 0
    fi
    log "WARN" "Health check attempt $i/10 failed, retrying..."
    sleep 5
  done
  
  log "ERROR" "Health check failed after 10 attempts"
  return 1
}

function save_deployment_info() {
  save_state "last_deploy_version_${ENVIRONMENT}" "$VERSION"
  save_state "last_deploy_time_${ENVIRONMENT}" "$(date -Iseconds)"
  save_state "last_deploy_commit_${ENVIRONMENT}" "$(git rev-parse HEAD)"
}

function main() {
  acquire_lock "deploy"
  trap "release_lock deploy" EXIT
  
  log "INFO" "Starting deployment workflow for $ENVIRONMENT"
  
  validate_deployment
  run_pre_deploy_checks
  build_artifacts
  deploy_to_environment
  verify_deployment
  save_deployment_info
  
  log "SUCCESS" "Deployment completed successfully"
}

main "$@"
```

---

### Example 2: Release Workflow

```bash
#!/bin/bash
# workflows/release.sh - Create a new release

set -euo pipefail

source workflows/lib/utils.sh

BUMP_TYPE=${1:-patch}  # major, minor, patch

function validate_release() {
  # Must be on main branch
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [[ "$BRANCH" != "main" ]]; then
    log "ERROR" "Releases must be created from main branch"
    exit 1
  fi
  
  # Must have clean working directory
  if ! git diff-index --quiet HEAD --; then
    log "ERROR" "Working directory has uncommitted changes"
    exit 1
  fi
}

function bump_version() {
  CURRENT_VERSION=$(get_config_value "version")
  log "INFO" "Current version: $CURRENT_VERSION"
  
  # Simple version bumping (use npm version, poetry version, etc. in real projects)
  IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"
  
  case "$BUMP_TYPE" in
    major)
      NEW_VERSION="$((major + 1)).0.0"
      ;;
    minor)
      NEW_VERSION="${major}.$((minor + 1)).0"
      ;;
    patch)
      NEW_VERSION="${major}.${minor}.$((patch + 1))"
      ;;
    *)
      log "ERROR" "Invalid bump type: $BUMP_TYPE"
      exit 1
      ;;
  esac
  
  log "INFO" "New version: $NEW_VERSION"
  echo "$NEW_VERSION"
}

function update_version_files() {
  local new_version=$1
  
  # Update .workflow-config.yaml
  sed -i "s/version: \".*\"/version: \"$new_version\"/" .workflow-config.yaml
  
  # Update package.json (if exists)
  if [[ -f "package.json" ]]; then
    npm version "$new_version" --no-git-tag-version
  fi
  
  log "SUCCESS" "Version files updated to $new_version"
}

function generate_changelog() {
  local new_version=$1
  
  log "INFO" "Generating changelog"
  
  # Get commits since last tag
  LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
  
  if [[ -n "$LAST_TAG" ]]; then
    COMMITS=$(git log ${LAST_TAG}..HEAD --pretty=format:"- %s (%h)" --no-merges)
  else
    COMMITS=$(git log --pretty=format:"- %s (%h)" --no-merges)
  fi
  
  # Prepend to CHANGELOG.md
  cat > CHANGELOG.tmp << EOF
## [${new_version}] - $(date +%Y-%m-%d)

${COMMITS}

EOF
  
  if [[ -f "CHANGELOG.md" ]]; then
    cat CHANGELOG.md >> CHANGELOG.tmp
    mv CHANGELOG.tmp CHANGELOG.md
  else
    mv CHANGELOG.tmp CHANGELOG.md
  fi
  
  log "SUCCESS" "Changelog generated"
}

function create_release_commit() {
  local new_version=$1
  
  git add .workflow-config.yaml CHANGELOG.md package.json 2>/dev/null || true
  git commit -m "chore: release v${new_version}"
  git tag -a "v${new_version}" -m "Release v${new_version}"
  
  log "SUCCESS" "Release commit and tag created"
}

function main() {
  log "INFO" "Starting release workflow ($BUMP_TYPE)"
  
  validate_release
  
  NEW_VERSION=$(bump_version)
  
  update_version_files "$NEW_VERSION"
  generate_changelog "$NEW_VERSION"
  create_release_commit "$NEW_VERSION"
  
  log "SUCCESS" "Release v${NEW_VERSION} created"
  log "INFO" "Push with: git push origin main --tags"
}

main "$@"
```

---

## Best Practices

### 1. Use Version Control for Workflows

```bash
# Track workflows in Git
git add workflows/
git commit -m "Add deployment workflow"
```

### 2. Document Workflows

```markdown
# workflows/README.md

## Available Workflows

### deploy.sh
Deploy application to staging or production.

**Usage**: `bash workflows/deploy.sh [staging|production]`

**Prerequisites**:
- DEPLOY_TOKEN environment variable set
- SSH access to deployment servers

**Steps**:
1. Validate prerequisites
2. Run tests
3. Build artifacts
4. Deploy to environment
5. Verify deployment
```

### 3. Make Workflows Testable

```bash
# workflows/deploy.sh

# Add --dry-run flag
DRY_RUN=${DRY_RUN:-false}

if [[ "$DRY_RUN" == "true" ]]; then
  log "INFO" "[DRY RUN] Would deploy to $ENVIRONMENT"
  exit 0
fi

# Test with:
# DRY_RUN=true bash workflows/deploy.sh production
```

### 4. Use Semantic Naming

```
workflows/
├── deploy-staging.sh      # Clear purpose
├── deploy-production.sh
├── test-unit.sh
├── test-integration.sh
└── release-major.sh
```

### 5. Handle Secrets Securely

```bash
# ❌ Bad: Hardcoded secrets
DB_PASSWORD="secret123"

# ✅ Good: Environment variables
DB_PASSWORD="${DB_PASSWORD:?DB_PASSWORD not set}"

# ✅ Good: Secrets manager
DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id db-password --query SecretString --output text)
```

---

## Testing Workflows

### Unit Test Workflow Functions

```bash
# tests/test_workflows.sh - Test workflow functions

source workflows/lib/utils.sh

function test_log_function() {
  local output=$(log "INFO" "test message" 2>&1)
  
  if [[ "$output" =~ "INFO: test message" ]]; then
    echo "✅ test_log_function passed"
    return 0
  else
    echo "❌ test_log_function failed"
    return 1
  fi
}

function test_retry_function() {
  # Test successful retry
  if execute_with_retry 3 "true"; then
    echo "✅ test_retry_function (success) passed"
  else
    echo "❌ test_retry_function (success) failed"
    return 1
  fi
  
  # Test failed retry
  if execute_with_retry 2 "false"; then
    echo "❌ test_retry_function (failure) failed"
    return 1
  else
    echo "✅ test_retry_function (failure) passed"
  fi
}

# Run tests
test_log_function
test_retry_function
```

---

### Integration Test Workflows

```bash
# tests/test_deploy_workflow.sh - Integration test

set -euo pipefail

# Setup test environment
export DRY_RUN=true
export ENVIRONMENT=staging

# Run workflow
if bash workflows/deploy.sh; then
  echo "✅ Deployment workflow test passed"
  exit 0
else
  echo "❌ Deployment workflow test failed"
  exit 1
fi
```

---

## Resources

### Related Documentation

- **Script Template Authoring**: `docs/developers/TEMPLATE_AUTHORING.md`
- **CI/CD Integration**: `docs/advanced/CI_CD_INTEGRATION.md`
- **Multi-Language Setup**: `docs/advanced/MULTI_LANGUAGE_SETUP.md`

### Tools

- **Makefiles**: Task orchestration
- **Task**: Modern alternative to Make
- **GitHub Actions**: CI/CD workflows
- **Jenkins**: Self-hosted CI/CD
- **GitLab CI**: Integrated CI/CD

---

**Last Updated**: 2026-02-07  
**Document Version**: 2.0.0
