# Shell Script Integration Example

🟢 **Complexity: Comprehensive** - Detailed walkthrough with troubleshooting and best practices

This example shows how to integrate `ai_workflow_core` into a shell script automation project.

## Directory Structure

```
my_shell_project/
├── .workflow_core/              # ai_workflow_core submodule
├── .ai_workflow/                # Workflow artifacts directory
│   ├── backlog/                 # Execution reports
│   ├── summaries/               # AI summaries
│   ├── logs/                    # Execution logs
│   ├── metrics/                 # Performance metrics
│   ├── checkpoints/             # Resume points
│   ├── prompts/                 # AI prompt logs
│   └── .incremental_cache/      # Incremental processing cache
├── .workflow-config.yaml        # Customized workflow config
├── .gitignore                   # Includes workflow artifacts
├── src/
│   ├── main.sh                  # Main script entry point
│   └── lib/                     # Reusable library functions
│       ├── utils.sh             # Utility functions
│       └── validation.sh        # Input validation
├── tests/
│   ├── run_tests.sh             # Test runner script
│   ├── test_main.sh             # Main script tests
│   └── test_utils.sh            # Utility function tests
├── docs/
│   └── README.md                # Project documentation
└── README.md                    # Project overview
```

## Prerequisites

- **Git**: Version control (2.0+)
- **Bash**: Shell environment (4.0+)
- **ShellCheck**: Static analysis tool for shell scripts
  ```bash
  # Install ShellCheck
  # Ubuntu/Debian
  sudo apt-get install shellcheck
  
  # macOS
  brew install shellcheck
  
  # Fedora
  sudo dnf install shellcheck
  ```
- **BATS** (optional): Bash Automated Testing System
  ```bash
  # Install BATS
  git clone https://github.com/bats-core/bats-core.git
  cd bats-core
  sudo ./install.sh /usr/local
  ```

## Setup Steps

### 1. Initialize Your Project

```bash
# Initialize project
mkdir my_shell_project && cd my_shell_project
git init

# Add submodule (pinned to specific version for stability)
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
cd .workflow_core && git checkout v1.0.2 && cd ..
git submodule update --init --recursive

# Copy and customize configuration
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Edit .workflow-config.yaml:
# - Replace {{PROJECT_NAME}} with "My Shell Script Project"
# - Set primary_language: "bash"
# - Set test_framework: "shell-script"
# - Set test_command: "./tests/run_all_tests.sh"
# - Set lint_command: "shellcheck src/**/*.sh"

# Create project structure
mkdir -p src tests docs
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# Update .gitignore
cat >> .gitignore << 'EOF'

# AI Workflow artifacts
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
EOF

# Commit
git add .
git commit -m "Initial commit with ai_workflow_core integration"
```

## Version Management

### Check Current Version

```bash
cd .workflow_core && git describe --tags && cd ..
# Output: v1.0.2
```

### Update to New Version

```bash
# 1. Fetch updates
cd .workflow_core && git fetch --tags && cd ..

# 2. Review changes
cd .workflow_core && git log --oneline v1.0.2..v1.1.0 && cd ..

# 3. Update in feature branch
git checkout -b update-workflow-core
cd .workflow_core && git checkout v1.1.0 && cd ..

# 4. Test
bash .workflow_core/scripts/check_integration_health.sh
./tests/run_all_tests.sh

# 5. Commit
git add .workflow_core
git commit -m "chore: update ai_workflow_core to v1.1.0"
```

## Project Structure

```
my_shell_project/
├── .workflow_core/           # ai_workflow_core submodule (pinned to v1.0.2)
├── .ai_workflow/             # Workflow artifacts (gitignored)
├── .workflow-config.yaml     # Customized workflow config
├── .gitignore                # Git ignore patterns
├── src/                      # Shell scripts
│   ├── main.sh              # Main entry point
│   └── lib/                 # Library functions
├── tests/                    # Test scripts
│   ├── run_all_tests.sh     # Test runner
│   └── test_*.sh            # Individual test files
├── docs/                     # Documentation
│   └── README.md
└── README.md
```

## Configuration Example

`.workflow-config.yaml`:

```yaml
project:
  name: "My Shell Script Project"
  type: "shell-script-automation"
  description: "Shell script automation tools"
  kind: "shell_script_automation"
  version: "1.0.2"
  
  # Track submodule version
  workflow_core_version: "v1.0.2"
  workflow_core_updated: "2026-01-29"

tech_stack:
  primary_language: "bash"
  build_system: "none"
  test_framework: "shell-script"
  test_command: "./tests/run_all_tests.sh"
  lint_command: "shellcheck src/**/*.sh"

structure:
  source_dirs:
    - src
  test_dirs:
    - tests
  docs_dirs:
    - docs
```

## Testing

Create `tests/run_all_tests.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PASSED=0
FAILED=0

echo "Running tests..."

for test_file in "$SCRIPT_DIR"/test_*.sh; do
  if [[ -f "$test_file" ]]; then
    echo "Running: $(basename "$test_file")"
    if bash "$test_file"; then
      ((PASSED++))
    else
      ((FAILED++))
    fi
  fi
done

echo "Results: $PASSED passed, $FAILED failed"
[[ $FAILED -eq 0 ]]
```

## Best Practices

1. **Use shellcheck** for linting all shell scripts
2. **Follow Google Shell Style Guide**
3. **Pin submodule to tagged versions** in production
4. **Run health checks** before deployments:
   ```bash
   bash .workflow_core/scripts/check_integration_health.sh
   ```
5. **Update through tested branches/PRs only**
6. **Document shell version requirements** (Bash 4.0+)

## Maintenance

### Weekly Health Check

```bash
bash .workflow_core/scripts/check_integration_health.sh
```

### Monthly Version Review

```bash
cd .workflow_core
git fetch --tags
git tag -l  # Check for new versions
cd ..
```

### CI/CD Integration

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Install shellcheck
        run: sudo apt-get install -y shellcheck
      
      - name: Run health check
        run: |
          bash .workflow_core/scripts/check_integration_health.sh
      
      - name: Lint scripts
        run: shellcheck src/**/*.sh
      
      - name: Run tests
        run: ./tests/run_all_tests.sh
```

## Resources

- [ai_workflow_core Documentation](../../README.md)
- [Integration Guide](../../docs/INTEGRATION.md)
- [Version Management Guide](../../docs/guides/VERSION_MANAGEMENT.md)
- [Integration Best Practices](../../docs/guides/INTEGRATION_BEST_PRACTICES.md)
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [ShellCheck](https://www.shellcheck.net/)

---

**Integration Strategy**: Version pinning with as-needed updates  
**Last Updated**: 2026-01-29  
**Example Version**: 1.1.0
