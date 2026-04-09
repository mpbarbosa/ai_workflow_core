# Multi-Language Project Setup

**Version**: 1.0.2
**Last Updated**: 2026-02-07
**Audience**: Advanced users managing polyglot projects

> **Purpose**: Learn how to configure ai_workflow_core for projects that use multiple programming languages. This guide covers monorepo setups, language-specific configurations, and multi-language testing strategies.

---

## Table of Contents

- [Overview](#overview)
- [When to Use Multi-Language Setup](#when-to-use-multi-language-setup)
- [Architecture Patterns](#architecture-patterns)
- [Configuration Strategies](#configuration-strategies)
- [Project Structure](#project-structure)
- [Testing Multi-Language Projects](#testing-multi-language-projects)
- [Language-Specific Workflows](#language-specific-workflows)
- [Common Patterns](#common-patterns)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

### What is a Multi-Language Project?

A multi-language project uses **two or more programming languages** in significant roles, such as:

- **Full-stack applications**: Node.js backend + React frontend
- **Microservices**: Go services + Python data processing + Node.js API gateway
- **CLI tools**: Bash scripts + Python utilities
- **Libraries**: C/C++ core + Python/Node.js bindings
- **Infrastructure**: Terraform + Shell scripts + Python automation

### Challenges

Multi-language projects face unique challenges:

- 🔴 **Multiple build systems**: npm, pip, cargo, maven, etc.
- 🔴 **Different test frameworks**: jest, pytest, go test, etc.
- 🔴 **Language-specific linters**: eslint, pylint, clippy, etc.
- 🔴 **Dependency management**: Multiple lock files
- 🔴 **Deployment complexity**: Different artifact types
- 🔴 **Team expertise**: Different language conventions

### How ai_workflow_core Helps

ai_workflow_core provides:

- ✅ **Primary language designation** with optional secondary languages
- ✅ **Language-specific configuration sections**
- ✅ **Multiple test command support**
- ✅ **Flexible directory structures**
- ✅ **Composite project kinds** (via generic)

---

## When to Use Multi-Language Setup

### Use Multi-Language Configuration When

✅ **Multiple languages play significant roles**
- Backend in Python + Frontend in JavaScript
- CLI in Go + Web UI in React
- Core library in C++ + Bindings in Python/Node.js

✅ **Each language has separate build/test processes**
- Different package managers
- Different test frameworks
- Different deployment artifacts

✅ **Team maintains expertise in multiple languages**
- Different teams for different components
- Language choice based on optimal use case

### Don't Use Multi-Language When

❌ **One language dominates** (>90% of codebase)
- Use single-language project kind
- Treat minority language as dependency

❌ **Languages are just build tools**
- Node.js project using Webpack (still `nodejs_api`)
- Python project using Sphinx docs (still `python_app`)

❌ **Minimal code in secondary language**
- Few utility scripts
- Configuration files

---

## Architecture Patterns

### Pattern 1: Monorepo with Language Boundaries

**Structure**: All languages in one repository, organized by language

```
my-project/
├── .workflow_core/           # Submodule
├── .workflow-config.yaml     # Main config
├── backend/                  # Python backend
│   ├── src/
│   ├── tests/
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/                 # React frontend
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── jest.config.js
├── cli/                      # Go CLI
│   ├── cmd/
│   ├── pkg/
│   ├── go.mod
│   └── go.sum
└── docs/
```

**Best for**: Full-stack applications, microservices in one repo

---

### Pattern 2: Language-First Organization

**Structure**: Organize by feature/domain, languages mixed within

```
my-project/
├── .workflow_core/
├── .workflow-config.yaml
├── services/
│   ├── auth/                # Node.js service
│   │   ├── src/
│   │   └── package.json
│   ├── analytics/           # Python service
│   │   ├── src/
│   │   └── requirements.txt
│   └── gateway/             # Go service
│       ├── cmd/
│       └── go.mod
├── shared/
│   ├── types/               # TypeScript types
│   └── utils/               # Shared utilities (Python)
└── scripts/                 # Bash automation
```

**Best for**: Microservices, feature-based organization

---

### Pattern 3: Core + Bindings

**Structure**: One primary language with bindings for others

```
my-library/
├── .workflow_core/
├── .workflow-config.yaml
├── core/                    # C++ core library
│   ├── src/
│   ├── include/
│   └── CMakeLists.txt
├── bindings/
│   ├── python/              # Python bindings
│   │   ├── setup.py
│   │   └── tests/
│   ├── node/                # Node.js bindings
│   │   ├── package.json
│   │   └── test/
│   └── rust/                # Rust bindings
│       ├── Cargo.toml
│       └── tests/
└── docs/
```

**Best for**: Libraries, performance-critical code with language bindings

---

### Pattern 4: Infrastructure as Code + Automation

**Structure**: Infrastructure code + automation scripts

```
my-infrastructure/
├── .workflow_core/
├── .workflow-config.yaml
├── terraform/               # Terraform (HCL)
│   ├── modules/
│   └── environments/
├── ansible/                 # Ansible (YAML)
│   ├── playbooks/
│   └── roles/
├── scripts/                 # Bash automation
│   ├── deploy.sh
│   └── backup.sh
└── tools/                   # Python utilities
    ├── validate_config.py
    └── requirements.txt
```

**Best for**: DevOps projects, infrastructure automation

---

## Configuration Strategies

### Strategy 1: Primary Language with Extensions

**Use when**: One language dominates (60-80%), others support

**Configuration**:

```yaml
project:
  name: "Full-Stack App"
  type: "full-stack-application"
  kind: "generic"  # No single project kind fits
  version: "1.0.2"

tech_stack:
  primary_language: "javascript"  # Node.js backend dominates

  # Secondary languages
  languages:
    - javascript  # Backend
    - typescript  # Frontend
    - python      # Data processing scripts

  build_system: "npm"
  test_framework: "jest"  # Primary test framework
  test_command: "npm run test:all"  # Runs all tests
  lint_command: "npm run lint:all"  # Runs all linters

# Language-specific configurations
language_configs:
  javascript:
    directory: "backend/"
    test_command: "cd backend && npm test"
    lint_command: "cd backend && eslint ."
    package_file: "backend/package.json"

  typescript:
    directory: "frontend/"
    test_command: "cd frontend && npm test"
    lint_command: "cd frontend && eslint src/"
    package_file: "frontend/package.json"
    build_required: true
    build_command: "cd frontend && npm run build"

  python:
    directory: "scripts/"
    test_command: "cd scripts && pytest"
    lint_command: "cd scripts && pylint *.py"
    package_file: "scripts/requirements.txt"

structure:
  source_dirs:
    - backend/src
    - frontend/src
    - scripts/
  test_dirs:
    - backend/tests
    - frontend/tests
    - scripts/tests
  docs_dirs:
    - docs
```

---

### Strategy 2: Equal Multi-Language (Microservices)

**Use when**: Multiple languages have equal importance

**Configuration**:

```yaml
project:
  name: "Microservices Platform"
  type: "microservices-platform"
  kind: "generic"
  version: "1.0.2"

tech_stack:
  primary_language: "multiple"  # No single primary

  languages:
    - javascript  # API gateway
    - python      # Analytics service
    - go          # Auth service

  # Composite commands that run all
  test_command: "bash scripts/test-all.sh"
  lint_command: "bash scripts/lint-all.sh"
  build_system: "composite"  # Multiple build systems

services:
  gateway:
    language: "javascript"
    directory: "services/gateway"
    test_command: "cd services/gateway && npm test"
    lint_command: "cd services/gateway && eslint ."
    build_command: "cd services/gateway && npm run build"
    package_file: "package.json"

  analytics:
    language: "python"
    directory: "services/analytics"
    test_command: "cd services/analytics && pytest"
    lint_command: "cd services/analytics && pylint src/"
    package_file: "requirements.txt"

  auth:
    language: "go"
    directory: "services/auth"
    test_command: "cd services/auth && go test ./..."
    lint_command: "cd services/auth && golangci-lint run"
    build_command: "cd services/auth && go build"
    package_file: "go.mod"

structure:
  source_dirs:
    - services/*/src
  test_dirs:
    - services/*/tests
  docs_dirs:
    - docs
```

---

### Strategy 3: Core + Bindings Configuration

**Use when**: One core language with multiple binding layers

**Configuration**:

```yaml
project:
  name: "ML Library"
  type: "library-with-bindings"
  kind: "generic"
  version: "1.0.2"

tech_stack:
  primary_language: "c++"  # Core implementation

  languages:
    - c++       # Core
    - python    # Primary bindings
    - javascript # Node.js bindings
    - rust      # Experimental bindings

  build_system: "cmake"  # Core build system
  test_command: "bash scripts/test-all-bindings.sh"

core:
  language: "c++"
  directory: "core/"
  build_command: "cd core && cmake --build build"
  test_command: "cd core/build && ctest"
  package_file: "CMakeLists.txt"

bindings:
  python:
    directory: "bindings/python"
    test_command: "cd bindings/python && pytest"
    build_command: "cd bindings/python && python setup.py build"
    package_file: "setup.py"

  node:
    directory: "bindings/node"
    test_command: "cd bindings/node && npm test"
    build_command: "cd bindings/node && npm run build"
    package_file: "package.json"

  rust:
    directory: "bindings/rust"
    test_command: "cd bindings/rust && cargo test"
    build_command: "cd bindings/rust && cargo build"
    package_file: "Cargo.toml"
```

---

## Project Structure

### Directory Organization Best Practices

#### 1. Language-Segregated Structure

**Pros**: Clear separation, independent builds, easier CI/CD
**Cons**: Code duplication, harder to share utilities

```
project/
├── .workflow-config.yaml
├── backend/              # Python
│   ├── src/
│   ├── tests/
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/             # TypeScript/React
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
└── cli/                  # Go
    ├── cmd/
    ├── pkg/
    └── go.mod
```

#### 2. Feature-Segregated Structure

**Pros**: Co-location of related code, better for domain-driven design
**Cons**: Mixed languages in directories, complex build setup

```
project/
├── .workflow-config.yaml
├── features/
│   ├── auth/
│   │   ├── backend/      # Python
│   │   └── frontend/     # TypeScript
│   ├── analytics/
│   │   ├── processor/    # Go
│   │   └── dashboard/    # React
│   └── ...
└── shared/
    ├── types/            # TypeScript definitions
    └── utils/            # Python utilities
```

#### 3. Layered Architecture Structure

**Pros**: Clear architectural layers, good for full-stack apps
**Cons**: May duplicate similar code across layers

```
project/
├── .workflow-config.yaml
├── api/                  # Node.js API layer
│   ├── src/
│   └── tests/
├── services/             # Python business logic
│   ├── src/
│   └── tests/
├── ui/                   # React frontend
│   ├── src/
│   └── tests/
└── infrastructure/       # Terraform + Bash
    ├── terraform/
    └── scripts/
```

---

## Testing Multi-Language Projects

### Unified Test Command

Create a master test script that runs all language-specific tests:

```bash
#!/bin/bash
# scripts/test-all.sh - Run tests for all languages

set -euo pipefail

echo "🧪 Running multi-language test suite..."

# Track failures
FAILED=()

# Backend tests (Python)
echo "Testing backend (Python)..."
if cd backend && pytest; then
  echo "✅ Backend tests passed"
else
  echo "❌ Backend tests failed"
  FAILED+=("backend")
fi
cd ..

# Frontend tests (Node.js)
echo "Testing frontend (Node.js)..."
if cd frontend && npm test; then
  echo "✅ Frontend tests passed"
else
  echo "❌ Frontend tests failed"
  FAILED+=("frontend")
fi
cd ..

# CLI tests (Go)
echo "Testing CLI (Go)..."
if cd cli && go test ./...; then
  echo "✅ CLI tests passed"
else
  echo "❌ CLI tests failed"
  FAILED+=("cli")
fi
cd ..

# Report results
if [ ${#FAILED[@]} -eq 0 ]; then
  echo "✅ All tests passed!"
  exit 0
else
  echo "❌ Tests failed in: ${FAILED[*]}"
  exit 1
fi
```

**Configuration**:

```yaml
tech_stack:
  test_command: "bash scripts/test-all.sh"
```

---

### Language-Specific Test Commands

For selective testing:

```bash
#!/bin/bash
# scripts/test-language.sh - Test specific language

LANGUAGE=$1

case "$LANGUAGE" in
  python)
    cd backend && pytest
    ;;
  javascript)
    cd frontend && npm test
    ;;
  go)
    cd cli && go test ./...
    ;;
  all)
    bash scripts/test-all.sh
    ;;
  *)
    echo "Unknown language: $LANGUAGE"
    echo "Usage: $0 {python|javascript|go|all}"
    exit 1
    ;;
esac
```

**Usage**:

```bash
bash scripts/test-language.sh python      # Test Python only
bash scripts/test-language.sh javascript  # Test JavaScript only
bash scripts/test-language.sh all         # Test all languages
```

---

### Coverage Aggregation

Combine coverage from multiple languages:

```bash
#!/bin/bash
# scripts/coverage-all.sh - Aggregate coverage

# Python coverage
cd backend && pytest --cov=src --cov-report=xml:../coverage-python.xml
cd ..

# JavaScript coverage
cd frontend && npm test -- --coverage --coverageReporters=cobertura
mv coverage/cobertura-coverage.xml ../coverage-javascript.xml
cd ..

# Go coverage
cd cli && go test -coverprofile=../coverage-go.out ./...
cd .. && go tool cover -html=coverage-go.out -o coverage-go.html

echo "Coverage reports generated:"
echo "  - Python: coverage-python.xml"
echo "  - JavaScript: coverage-javascript.xml"
echo "  - Go: coverage-go.html"
```

---

## Language-Specific Workflows

### GitHub Actions Multi-Language Workflow

```yaml
name: Multi-Language CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Python backend
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt

      - name: Run tests
        run: |
          cd backend
          pytest --cov=src

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: backend/coverage.xml
          flags: backend

  # JavaScript frontend
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Run tests
        run: |
          cd frontend
          npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: frontend/coverage/lcov.info
          flags: frontend

  # Go CLI
  test-cli:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'

      - name: Run tests
        run: |
          cd cli
          go test -v -race -coverprofile=coverage.out ./...

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: cli/coverage.out
          flags: cli

  # Integration tests
  test-integration:
    needs: [test-backend, test-frontend, test-cli]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Setup all languages
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - uses: actions/setup-go@v4
        with:
          go-version: '1.21'

      # Install dependencies
      - name: Install all dependencies
        run: bash scripts/install-all.sh

      # Run integration tests
      - name: Run integration tests
        run: bash scripts/test-integration.sh
```

---

## Common Patterns

### Pattern 1: Wrapper Scripts

Create language-agnostic wrapper scripts:

```bash
# scripts/dev.sh - Start development servers for all languages
#!/bin/bash

# Backend (Python)
cd backend && uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Frontend (Node.js)
cd frontend && npm run dev &
FRONTEND_PID=$!

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop all services"

wait
```

---

### Pattern 2: Shared Types/Interfaces

For TypeScript/JavaScript + Python:

```typescript
// shared/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
}
```

```python
# shared/types/user.py (generated or manually synced)
from dataclasses import dataclass

@dataclass
class User:
    id: str
    email: str
    name: str
```

Use tools like:
- **py-ts-interfaces**: Generate Python from TypeScript
- **pydantic**: Python models with TypeScript generation
- **dataclass-wizard**: Convert between formats

---

### Pattern 3: Polyglot Build Tool

Use a meta-build tool:

**Makefile**:

```makefile
.PHONY: all install test lint build clean

# Install dependencies for all languages
install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm ci
	cd cli && go mod download

# Run all tests
test:
	cd backend && pytest
	cd frontend && npm test
	cd cli && go test ./...

# Run all linters
lint:
	cd backend && pylint src/
	cd frontend && eslint src/
	cd cli && golangci-lint run

# Build all components
build:
	cd frontend && npm run build
	cd cli && go build -o ../bin/cli

# Clean build artifacts
clean:
	rm -rf backend/__pycache__
	rm -rf backend/.pytest_cache
	rm -rf frontend/dist
	rm -rf frontend/node_modules
	rm -rf cli/bin
```

**Usage**:

```bash
make install  # Install all dependencies
make test     # Test all languages
make lint     # Lint all languages
make build    # Build all components
```

---

## Examples

### Example 1: Full-Stack E-Commerce

**Languages**: Node.js (API) + React (Frontend) + Python (Data Processing)

**Structure**:
```
ecommerce/
├── .workflow-config.yaml
├── api/                    # Node.js/Express API
│   ├── src/
│   ├── tests/
│   └── package.json
├── web/                    # React frontend
│   ├── src/
│   ├── tests/
│   └── package.json
├── analytics/              # Python data processing
│   ├── src/
│   ├── tests/
│   └── requirements.txt
└── shared/
    └── types/              # Shared TypeScript types
```

**Configuration**: See [Strategy 1](#strategy-1-primary-language-with-extensions)

---

### Example 2: Microservices Platform

**Languages**: Go (Services) + Python (ML) + JavaScript (Gateway)

**Structure**:
```
platform/
├── .workflow-config.yaml
├── services/
│   ├── auth/              # Go
│   ├── users/             # Go
│   └── recommendations/   # Python ML
├── gateway/               # Node.js API Gateway
└── shared/
    └── proto/             # Protocol buffers
```

**Configuration**: See [Strategy 2](#strategy-2-equal-multi-language-microservices)

---

### Example 3: C++ Library with Bindings

**Languages**: C++ (Core) + Python + Node.js + Rust

**Structure**:
```
fast-lib/
├── .workflow-config.yaml
├── core/                  # C++ core
│   ├── src/
│   ├── include/
│   └── CMakeLists.txt
└── bindings/
    ├── python/
    ├── node/
    └── rust/
```

**Configuration**: See [Strategy 3](#strategy-3-core--bindings-configuration)

---

## Best Practices

### 1. Consistent Directory Structure

**Maintain similar structure across languages**:

```
component-name/
├── src/           # Source code (always)
├── tests/         # Tests (always)
├── docs/          # Documentation (optional)
└── <language-specific-files>
```

### 2. Unified Documentation

**Keep docs language-agnostic where possible**:

```
docs/
├── architecture/     # System architecture
├── api/             # API documentation (all services)
├── setup/           # Setup for all languages
└── languages/       # Language-specific notes
    ├── python.md
    ├── javascript.md
    └── go.md
```

### 3. Dependency Management

**Track all dependency files**:

```yaml
dependencies:
  package_files:
    - backend/requirements.txt      # Python
    - frontend/package.json         # JavaScript
    - cli/go.mod                    # Go
  lock_files:
    - backend/requirements-lock.txt # Python
    - frontend/package-lock.json    # JavaScript
    - cli/go.sum                    # Go
```

### 4. Version Synchronization

**Keep versions in sync across components**:

```json
// frontend/package.json
{
  "name": "my-app-frontend",
  "version": "1.2.7"  // ← Keep in sync
}
```

```toml
# backend/pyproject.toml
[tool.poetry]
name = "my-app-backend"
version = "1.2.7"  # ← Keep in sync
```

```
# cli/version.go
package main

const Version = "1.2.7"  // ← Keep in sync
```

### 5. CI/CD Strategy

**Test each language independently, then together**:

1. **Unit tests**: Per language
2. **Integration tests**: Cross-language
3. **E2E tests**: Full stack
4. **Performance tests**: Critical paths

---

## Troubleshooting

### Problem: Tests pass individually but fail together

**Cause**: Port conflicts, shared resources, race conditions

**Solution**:

```bash
# Use different ports per service
# backend/.env
PORT=8000

# frontend/.env
REACT_APP_API_URL=http://localhost:8000
PORT=3000

# cli/config.yaml
server_port: 9000
```

---

### Problem: Dependency version conflicts

**Cause**: Different components need different versions

**Solution**: Use containers or virtual environments

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    # Python dependencies isolated

  frontend:
    build: ./frontend
    # Node.js dependencies isolated

  cli:
    build: ./cli
    # Go dependencies isolated
```

---

### Problem: Complex build order

**Cause**: Dependencies between components

**Solution**: Document build order and automate

```bash
#!/bin/bash
# scripts/build-all.sh - Build in correct order

set -euo pipefail

echo "1. Building shared types..."
cd shared/types && npm run build

echo "2. Building backend..."
cd ../../backend && pip install -e .

echo "3. Building frontend..."
cd ../frontend && npm run build

echo "4. Building CLI..."
cd ../cli && go build -o ../bin/cli

echo "✅ All components built successfully"
```

---

### Problem: Linters conflict with each other

**Cause**: Different code style rules per language

**Solution**: Use language-specific `.editorconfig`

```ini
# .editorconfig
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8

[*.py]
indent_style = space
indent_size = 4

[*.{js,ts,jsx,tsx}]
indent_style = space
indent_size = 2

[*.go]
indent_style = tab
indent_size = 4
```

---

## Resources

### Tools

- **Pre-commit**: Multi-language pre-commit hooks
- **Nx**: Monorepo build system (Node.js focused)
- **Bazel**: Google's multi-language build tool
- **Pants**: Multi-language build system (Python, Go, Java)
- **Make**: Universal build tool
- **Task**: Modern alternative to Make

### Documentation

- **Language Integration Guides**: `docs/INTEGRATION.md`
- **Project Kinds Reference**: `docs/api/PROJECT_KINDS_SCHEMA.md`
- **Configuration Reference**: `docs/api/CONFIG_REFERENCE.md`

### Examples

- **Full-Stack Example**: `examples/nodejs/` (Node.js + React patterns)
- **Shell Integration**: `examples/shell/` (multi-script management)

---

**Last Updated**: 2026-02-07
**Document Version**: 1.0.2
