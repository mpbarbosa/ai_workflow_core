# CI/CD Integration

**Version**: 1.0.2  
**Last Updated**: 2026-02-07  
**Audience**: DevOps engineers and developers setting up continuous integration and deployment

> **Purpose**: Learn how to integrate ai_workflow_core with popular CI/CD platforms. This guide covers GitHub Actions, GitLab CI, Jenkins, and other platforms with practical examples and best practices.

---

## Table of Contents

- [Overview](#overview)
- [CI/CD Fundamentals](#cicd-fundamentals)
- [GitHub Actions Integration](#github-actions-integration)
- [GitLab CI Integration](#gitlab-ci-integration)
- [Jenkins Integration](#jenkins-integration)
- [CircleCI Integration](#circleci-integration)
- [Azure Pipelines Integration](#azure-pipelines-integration)
- [Multi-Platform Strategies](#multi-platform-strategies)
- [Security Best Practices](#security-best-practices)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

---

## Overview

### What is CI/CD Integration?

**Continuous Integration (CI)**: Automatically build and test code changes  
**Continuous Deployment (CD)**: Automatically deploy verified changes

### Why Integrate with ai_workflow_core?

✅ **Consistent configuration** across local development and CI/CD  
✅ **Project kind validation** ensures CI/CD matches project requirements  
✅ **Standard directory structure** for artifacts  
✅ **Language-agnostic** patterns work across platforms

---

## CI/CD Fundamentals

### Common Workflow Pattern

```
1. Trigger (push/PR) → 2. Checkout code → 3. Read config →
4. Setup environment → 5. Install dependencies → 6. Run tests →
7. Build artifacts → 8. Deploy (if main branch) → 9. Notify
```

### Reading Configuration in CI/CD

All platforms need to read `.workflow-config.yaml`:

**Bash (simple)**:
```bash
PROJECT_KIND=$(grep "kind:" .workflow-config.yaml | cut -d'"' -f2)
TEST_COMMAND=$(grep "test_command:" .workflow-config.yaml | cut -d'"' -f2)
```

**Python (robust)**:
```python
import yaml
with open('.workflow-config.yaml') as f:
    config = yaml.safe_load(f)
    project_kind = config['project']['kind']
    test_command = config['tech_stack']['test_command']
```

**Node.js**:
```javascript
const yaml = require('js-yaml');
const fs = require('fs');

const config = yaml.load(fs.readFileSync('.workflow-config.yaml', 'utf8'));
const projectKind = config.project.kind;
const testCommand = config.tech_stack.test_command;
```

---

## GitHub Actions Integration

### Basic Workflow Template

**`.github/workflows/ci.yml`**:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    
    steps:
      # 1. Checkout code with submodules
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          submodules: recursive  # Important: Load .workflow_core
      
      # 2. Read configuration
      - name: Read project configuration
        id: config
        run: |
          PROJECT_KIND=$(grep "kind:" .workflow-config.yaml | cut -d'"' -f2)
          PRIMARY_LANG=$(grep "primary_language:" .workflow-config.yaml | cut -d'"' -f2)
          TEST_CMD=$(grep "test_command:" .workflow-config.yaml | cut -d'"' -f2)
          LINT_CMD=$(grep "lint_command:" .workflow-config.yaml | cut -d'"' -f2)
          
          echo "project_kind=$PROJECT_KIND" >> $GITHUB_OUTPUT
          echo "primary_language=$PRIMARY_LANG" >> $GITHUB_OUTPUT
          echo "test_command=$TEST_CMD" >> $GITHUB_OUTPUT
          echo "lint_command=$LINT_CMD" >> $GITHUB_OUTPUT
      
      # 3. Setup environment (conditional based on language)
      - name: Setup Node.js
        if: steps.config.outputs.primary_language == 'javascript'
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Setup Python
        if: steps.config.outputs.primary_language == 'python'
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Setup Go
        if: steps.config.outputs.primary_language == 'go'
        uses: actions/setup-go@v5
        with:
          go-version: '1.21'
      
      # 4. Install dependencies
      - name: Install dependencies
        run: |
          case "${{ steps.config.outputs.primary_language }}" in
            javascript)
              npm ci
              ;;
            python)
              pip install -r requirements.txt
              ;;
            go)
              go mod download
              ;;
          esac
      
      # 5. Run linter
      - name: Lint
        run: ${{ steps.config.outputs.lint_command }}
      
      # 6. Run tests
      - name: Test
        run: ${{ steps.config.outputs.test_command }}
      
      # 7. Upload artifacts
      - name: Upload workflow artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: workflow-artifacts
          path: .ai_workflow/logs/
```

---

### Advanced GitHub Actions Patterns

#### Matrix Testing (Multiple Versions)

```yaml
name: Matrix Testing

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18, 20]
    
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - run: npm ci
      - run: npm test
```

#### Caching Dependencies

```yaml
- name: Cache Node.js modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Cache Python packages
  uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

#### Conditional Deployment

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      # ... test steps ...
  
  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: bash .workflow_core/scripts/deploy.sh staging
  
  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - name: Deploy to production
        run: bash .workflow_core/scripts/deploy.sh production
```

#### Reusable Workflows

**`.github/workflows/reusable-test.yml`**:

```yaml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      
      - run: npm ci
      - run: npm test
```

**`.github/workflows/ci.yml`** (calls reusable):

```yaml
name: CI

on: [push, pull_request]

jobs:
  test-node-18:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '18'
  
  test-node-20:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '20'
```

---

## GitLab CI Integration

### Basic Pipeline

**`.gitlab-ci.yml`**:

```yaml
# Read configuration
variables:
  GIT_SUBMODULE_STRATEGY: recursive  # Important: Load .workflow_core

# Define stages
stages:
  - validate
  - test
  - build
  - deploy

# Template for reading config
.read-config: &read-config
  before_script:
    - apt-get update && apt-get install -y python3 python3-pip
    - pip3 install pyyaml
    - |
      python3 << EOF
      import yaml
      with open('.workflow-config.yaml') as f:
          config = yaml.safe_load(f)
      print(f"PROJECT_KIND={config['project']['kind']}")
      print(f"TEST_COMMAND={config['tech_stack']['test_command']}")
      EOF

# Validate configuration
validate:config:
  stage: validate
  image: python:3.11
  script:
    - pip install yamllint
    - yamllint .workflow-config.yaml
  only:
    - merge_requests
    - main
    - develop

# Lint
lint:
  stage: test
  image: node:20
  <<: *read-config
  script:
    - npm ci
    - npm run lint
  only:
    - merge_requests
    - main
    - develop

# Test
test:
  stage: test
  image: node:20
  <<: *read-config
  script:
    - npm ci
    - npm test
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  only:
    - merge_requests
    - main
    - develop

# Build
build:
  stage: build
  image: node:20
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  only:
    - main
    - develop

# Deploy to staging
deploy:staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache bash openssh-client
  script:
    - bash .workflow_core/scripts/deploy.sh staging
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

# Deploy to production (manual)
deploy:production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache bash openssh-client
  script:
    - bash .workflow_core/scripts/deploy.sh production
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main
```

---

### GitLab CI Advanced Features

#### Include External Templates

```yaml
# .gitlab-ci.yml
include:
  - local: '.workflow_core/workflow-templates/gitlab-ci/test-template.yml'
  - local: '.workflow_core/workflow-templates/gitlab-ci/deploy-template.yml'

stages:
  - test
  - deploy

test:node:
  extends: .test-template
  variables:
    NODE_VERSION: "20"

deploy:staging:
  extends: .deploy-template
  variables:
    ENVIRONMENT: "staging"
```

#### Parallel Testing

```yaml
test:
  stage: test
  image: node:20
  parallel:
    matrix:
      - NODE_VERSION: ["18", "20"]
        OS: ["ubuntu", "alpine"]
  script:
    - npm ci
    - npm test
```

#### Cache Dependencies

```yaml
# Global cache configuration
cache:
  key:
    files:
      - package-lock.json
  paths:
    - node_modules/
    - .npm/

test:
  stage: test
  script:
    - npm ci --cache .npm --prefer-offline
    - npm test
```

---

## Jenkins Integration

### Jenkinsfile (Declarative)

**`Jenkinsfile`**:

```groovy
pipeline {
    agent any
    
    environment {
        // Read from configuration
        PROJECT_KIND = sh(
            script: "grep 'kind:' .workflow-config.yaml | cut -d'\"' -f2",
            returnStdout: true
        ).trim()
        
        TEST_COMMAND = sh(
            script: "grep 'test_command:' .workflow-config.yaml | cut -d'\"' -f2",
            returnStdout: true
        ).trim()
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout with submodules
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [[$class: 'SubmoduleOption', 
                                  recursiveSubmodules: true]],
                    userRemoteConfigs: [[url: env.GIT_URL]]
                ])
            }
        }
        
        stage('Validate') {
            steps {
                sh '''
                    echo "Project Kind: $PROJECT_KIND"
                    yamllint .workflow-config.yaml
                '''
            }
        }
        
        stage('Setup') {
            steps {
                script {
                    if (PROJECT_KIND == 'nodejs_api') {
                        sh 'nvm install 20'
                        sh 'npm ci'
                    } else if (PROJECT_KIND == 'python_app') {
                        sh 'python3 -m venv venv'
                        sh '. venv/bin/activate && pip install -r requirements.txt'
                    }
                }
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Test') {
            steps {
                sh env.TEST_COMMAND
            }
            post {
                always {
                    junit 'test-results/*.xml'
                    publishHTML([
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build') {
            when {
                branch 'main'
            }
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sh 'bash .workflow_core/scripts/deploy.sh production'
            }
        }
    }
    
    post {
        always {
            // Archive workflow artifacts
            archiveArtifacts artifacts: '.ai_workflow/logs/**/*', 
                            allowEmptyArchive: true
        }
        success {
            slackSend color: 'good', 
                     message: "Build succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        }
        failure {
            slackSend color: 'danger', 
                     message: "Build failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        }
    }
}
```

---

### Jenkins Scripted Pipeline

**`Jenkinsfile`** (Scripted):

```groovy
node {
    def config
    
    stage('Checkout') {
        checkout([
            $class: 'GitSCM',
            extensions: [[$class: 'SubmoduleOption', recursiveSubmodules: true]],
            userRemoteConfigs: [[url: env.GIT_URL]]
        ])
    }
    
    stage('Load Config') {
        config = readYaml file: '.workflow-config.yaml'
        echo "Project: ${config.project.name}"
        echo "Kind: ${config.project.kind}"
    }
    
    stage('Test') {
        sh config.tech_stack.test_command
    }
    
    if (env.BRANCH_NAME == 'main') {
        stage('Deploy') {
            input message: 'Deploy to production?'
            sh 'bash .workflow_core/scripts/deploy.sh production'
        }
    }
}
```

---

## CircleCI Integration

**`.circleci/config.yml`**:

```yaml
version: 2.1

# Define executors
executors:
  node-executor:
    docker:
      - image: cimg/node:20.0
    working_directory: ~/project
  
  python-executor:
    docker:
      - image: cimg/python:3.11
    working_directory: ~/project

# Define jobs
jobs:
  checkout-and-validate:
    executor: node-executor
    steps:
      - checkout
      
      # Checkout submodules
      - run:
          name: Checkout submodules
          command: git submodule update --init --recursive
      
      # Cache .workflow_core
      - save_cache:
          key: workflow-core-{{ checksum ".gitmodules" }}
          paths:
            - .workflow_core
      
      # Read and validate config
      - run:
          name: Validate configuration
          command: |
            pip install yamllint
            yamllint .workflow-config.yaml
      
      # Persist to workspace
      - persist_to_workspace:
          root: .
          paths:
            - .
  
  test:
    executor: node-executor
    steps:
      - attach_workspace:
          at: .
      
      # Restore dependencies
      - restore_cache:
          keys:
            - deps-{{ checksum "package-lock.json" }}
            - deps-
      
      - run: npm ci
      
      - save_cache:
          key: deps-{{ checksum "package-lock.json" }}
          paths:
            - node_modules
      
      - run: npm test
      
      # Store test results
      - store_test_results:
          path: test-results
      
      - store_artifacts:
          path: coverage
  
  deploy:
    executor: node-executor
    steps:
      - attach_workspace:
          at: .
      
      - run:
          name: Deploy
          command: bash .workflow_core/scripts/deploy.sh production

# Define workflows
workflows:
  version: 2
  build-test-deploy:
    jobs:
      - checkout-and-validate
      
      - test:
          requires:
            - checkout-and-validate
      
      - deploy:
          requires:
            - test
          filters:
            branches:
              only: main
```

---

## Azure Pipelines Integration

**`azure-pipelines.yml`**:

```yaml
# Trigger on main and develop
trigger:
  branches:
    include:
      - main
      - develop

# PR validation
pr:
  branches:
    include:
      - main
      - develop

# Define pool
pool:
  vmImage: 'ubuntu-latest'

# Define variables
variables:
  - name: projectKind
    value: ''
  - name: testCommand
    value: ''

# Define stages
stages:
  - stage: Validate
    jobs:
      - job: ValidateConfig
        steps:
          - checkout: self
            submodules: true  # Important: Load .workflow_core
          
          - task: UsePythonVersion@0
            inputs:
              versionSpec: '3.11'
          
          - script: |
              pip install yamllint pyyaml
              yamllint .workflow-config.yaml
            displayName: 'Validate YAML'
          
          - script: |
              python3 << 'EOF'
              import yaml
              with open('.workflow-config.yaml') as f:
                  config = yaml.safe_load(f)
              print(f"##vso[task.setvariable variable=projectKind;isOutput=true]{config['project']['kind']}")
              print(f"##vso[task.setvariable variable=testCommand;isOutput=true]{config['tech_stack']['test_command']}")
              EOF
            name: readConfig
            displayName: 'Read configuration'
  
  - stage: Test
    dependsOn: Validate
    variables:
      projectKind: $[ stageDependencies.Validate.ValidateConfig.outputs['readConfig.projectKind'] ]
      testCommand: $[ stageDependencies.Validate.ValidateConfig.outputs['readConfig.testCommand'] ]
    jobs:
      - job: RunTests
        steps:
          - checkout: self
            submodules: true
          
          - task: NodeTool@0
            condition: eq(variables['projectKind'], 'nodejs_api')
            inputs:
              versionSpec: '20.x'
          
          - task: UsePythonVersion@0
            condition: eq(variables['projectKind'], 'python_app')
            inputs:
              versionSpec: '3.11'
          
          - script: |
              npm ci
              npm test
            condition: eq(variables['projectKind'], 'nodejs_api')
            displayName: 'Test Node.js project'
          
          - script: |
              pip install -r requirements.txt
              pytest
            condition: eq(variables['projectKind'], 'python_app')
            displayName: 'Test Python project'
          
          - task: PublishTestResults@2
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: '**/test-results/*.xml'
          
          - task: PublishCodeCoverageResults@1
            inputs:
              codeCoverageTool: 'Cobertura'
              summaryFileLocation: '$(System.DefaultWorkingDirectory)/**/coverage.xml'
  
  - stage: Deploy
    dependsOn: Test
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployProduction
        environment: production
        strategy:
          runOnce:
            deploy:
              steps:
                - checkout: self
                  submodules: true
                
                - script: |
                    bash .workflow_core/scripts/deploy.sh production
                  displayName: 'Deploy to production'
```

---

## Multi-Platform Strategies

### Unified Configuration Approach

Create a shared script that works across all platforms:

**`scripts/ci-runner.sh`**:

```bash
#!/bin/bash
# scripts/ci-runner.sh - Unified CI script for all platforms
# Works with: GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure Pipelines

set -euo pipefail

STAGE=${1:-test}

# Detect CI platform
if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
  CI_PLATFORM="github"
elif [[ -n "${GITLAB_CI:-}" ]]; then
  CI_PLATFORM="gitlab"
elif [[ -n "${JENKINS_URL:-}" ]]; then
  CI_PLATFORM="jenkins"
elif [[ -n "${CIRCLECI:-}" ]]; then
  CI_PLATFORM="circleci"
elif [[ -n "${AZURE_PIPELINES:-}" ]]; then
  CI_PLATFORM="azure"
else
  CI_PLATFORM="local"
fi

echo "Running on: $CI_PLATFORM"
echo "Stage: $STAGE"

# Read configuration
PROJECT_KIND=$(grep "kind:" .workflow-config.yaml | cut -d'"' -f2)
TEST_COMMAND=$(grep "test_command:" .workflow-config.yaml | cut -d'"' -f2)
LINT_COMMAND=$(grep "lint_command:" .workflow-config.yaml | cut -d'"' -f2)

# Execute stage
case "$STAGE" in
  lint)
    echo "Running linter..."
    eval "$LINT_COMMAND"
    ;;
  
  test)
    echo "Running tests..."
    eval "$TEST_COMMAND"
    ;;
  
  build)
    echo "Building project..."
    case "$PROJECT_KIND" in
      nodejs_api)
        npm run build
        ;;
      python_app)
        python setup.py build
        ;;
      *)
        echo "No build step for $PROJECT_KIND"
        ;;
    esac
    ;;
  
  deploy)
    echo "Deploying..."
    bash scripts/deploy.sh "${2:-staging}"
    ;;
  
  *)
    echo "Unknown stage: $STAGE"
    exit 1
    ;;
esac
```

**Usage in any CI platform**:

```yaml
# GitHub Actions
- run: bash scripts/ci-runner.sh test

# GitLab CI
script:
  - bash scripts/ci-runner.sh test

# Jenkins
sh 'bash scripts/ci-runner.sh test'

# CircleCI
- run: bash scripts/ci-runner.sh test

# Azure Pipelines
- script: bash scripts/ci-runner.sh test
```

---

## Security Best Practices

### 1. Secrets Management

**GitHub Actions**:
```yaml
- name: Deploy
  env:
    DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
    API_KEY: ${{ secrets.API_KEY }}
  run: bash scripts/deploy.sh
```

**GitLab CI**:
```yaml
deploy:
  script:
    - bash scripts/deploy.sh
  variables:
    DEPLOY_TOKEN: $CI_DEPLOY_TOKEN  # Protected variable
```

**Jenkins**:
```groovy
withCredentials([
    string(credentialsId: 'deploy-token', variable: 'DEPLOY_TOKEN'),
    string(credentialsId: 'api-key', variable: 'API_KEY')
]) {
    sh 'bash scripts/deploy.sh'
}
```

### 2. Least Privilege Principle

```yaml
# Only allow deployment from specific branches
deploy:
  only:
    - main
  
# Require manual approval for production
deploy:production:
  when: manual
  environment:
    name: production
```

### 3. Audit Logging

```bash
# Log all CI/CD actions
echo "CI Run: $(date -Iseconds)" >> .ai_workflow/logs/ci-audit.log
echo "User: ${CI_USER:-unknown}" >> .ai_workflow/logs/ci-audit.log
echo "Stage: $STAGE" >> .ai_workflow/logs/ci-audit.log
```

### 4. Dependency Scanning

```yaml
- name: Security audit
  run: |
    npm audit --audit-level=moderate
    # or: pip-audit
    # or: go list -json -m all | nancy sleuth
```

---

## Performance Optimization

### 1. Caching Strategies

**Cache node_modules**:
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

**Cache pip packages**:
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
```

### 2. Parallel Jobs

```yaml
# GitHub Actions
strategy:
  matrix:
    test-group: [unit, integration, e2e]

# GitLab CI
test:
  parallel:
    matrix:
      - TEST_GROUP: [unit, integration, e2e]
```

### 3. Conditional Execution

```yaml
# Only run tests on changed files
- name: Detect changes
  uses: dorny/paths-filter@v2
  id: changes
  with:
    filters: |
      backend:
        - 'backend/**'
      frontend:
        - 'frontend/**'

- name: Test backend
  if: steps.changes.outputs.backend == 'true'
  run: npm test -- backend/
```

### 4. Artifact Reuse

```yaml
# Job 1: Build once
build:
  steps:
    - run: npm run build
    - uses: actions/upload-artifact@v4
      with:
        name: dist
        path: dist/

# Job 2: Reuse build
deploy:
  needs: build
  steps:
    - uses: actions/download-artifact@v4
      with:
        name: dist
    - run: bash scripts/deploy.sh
```

---

## Troubleshooting

### Problem: Submodules not loaded

**Symptom**: `.workflow_core/` directory is empty

**Solution**:

```yaml
# GitHub Actions
- uses: actions/checkout@v4
  with:
    submodules: recursive  # Add this

# GitLab CI
variables:
  GIT_SUBMODULE_STRATEGY: recursive  # Add this

# Jenkins
checkout([
    $class: 'GitSCM',
    extensions: [[$class: 'SubmoduleOption', recursiveSubmodules: true]]  # Add this
])
```

---

### Problem: Configuration not found

**Symptom**: `grep: .workflow-config.yaml: No such file`

**Solution**: Verify file is committed and working directory is correct

```bash
# Debug
- run: pwd && ls -la
- run: cat .workflow-config.yaml
```

---

### Problem: Secrets not available

**Symptom**: `DEPLOY_TOKEN: unbound variable`

**Solution**: Check secrets are configured in platform

```bash
# Verify secret exists (without exposing value)
- run: |
    if [[ -z "${DEPLOY_TOKEN:-}" ]]; then
      echo "DEPLOY_TOKEN not set"
      exit 1
    fi
```

---

### Problem: Cache invalidation

**Symptom**: Old dependencies cached, new ones not installed

**Solution**: Use better cache keys

```yaml
# Include multiple files in key
key: ${{ runner.os }}-${{ hashFiles('**/package-lock.json', '**/requirements.txt') }}

# Or: Add version to key
key: v2-${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

---

## Resources

### Documentation

- **Custom Workflows**: `docs/advanced/CUSTOM_WORKFLOW_CREATION.md`
- **Multi-Language Setup**: `docs/advanced/MULTI_LANGUAGE_SETUP.md`
- **Configuration Reference**: `docs/api/CONFIG_REFERENCE.md`

### Platform Documentation

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitLab CI Docs](https://docs.gitlab.com/ee/ci/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [CircleCI Docs](https://circleci.com/docs/)
- [Azure Pipelines Docs](https://docs.microsoft.com/en-us/azure/devops/pipelines/)

---

**Last Updated**: 2026-02-07  
**Document Version**: 1.0.2
