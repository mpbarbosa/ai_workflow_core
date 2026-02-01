# Shell Script Integration Example

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
# Create project directory
mkdir my_shell_project
cd my_shell_project

# Initialize git repository
git init
```

### 2. Add ai_workflow_core Submodule

```bash
# Add submodule
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core

# Initialize and update submodule
git submodule update --init --recursive
```

### 3. Copy and Customize Configuration

```bash
# Copy workflow configuration template
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Create workflow artifacts directory structure
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,.incremental_cache}

# Create standard project directories
mkdir -p src/lib tests docs

# Update .gitignore to exclude workflow artifacts
cat >> .gitignore << 'EOF'
# Workflow artifacts
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/

# Optional: Keep prompts and ML models in git
# .ai_workflow/prompts/
# .ai_workflow/ml_models/
EOF
```

### 4. Configure for Shell Script Projects

Edit `.workflow-config.yaml`:

```yaml
project:
  name: "My Shell Automation"
  type: "shell-script-automation"
  description: "Bash script automation with AI workflow integration"
  kind: "shell_script_automation"
  version: "1.0.0"

tech_stack:
  primary_language: "bash"
  build_system: "none"
  test_framework: "bash_unit"  # or "bats" if using BATS
  test_command: "./tests/run_tests.sh"
  lint_command: "shellcheck -x -S warning src/**/*.sh"

structure:
  source_dirs:
    - src
  test_dirs:
    - tests
  docs_dirs:
    - docs
```

### 5. Create Project Files

#### Main Script (`src/main.sh`)

```bash
#!/usr/bin/env bash
################################################################################
# Main Script
# Description: Entry point for shell automation
# Usage: ./src/main.sh [OPTIONS]
################################################################################

set -euo pipefail

# Script directory and project root
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Source library functions
# shellcheck source=src/lib/utils.sh
source "${PROJECT_ROOT}/src/lib/utils.sh"

# shellcheck source=src/lib/validation.sh
source "${PROJECT_ROOT}/src/lib/validation.sh"

#######################################
# Display usage information
#######################################
usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Description:
    Shell script automation with AI workflow integration

Options:
    -h, --help       Show this help message
    -v, --version    Show version information
    --debug          Enable debug output

Examples:
    $(basename "$0") --help
    $(basename "$0") --version

EOF
    exit 0
}

#######################################
# Main function
#######################################
main() {
    # Parse command-line arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                usage
                ;;
            -v|--version)
                echo "Version: 1.0.0"
                exit 0
                ;;
            --debug)
                set -x
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                usage
                ;;
        esac
    done

    log_info "Starting automation script..."
    
    # Your automation logic here
    
    log_success "Automation complete!"
}

main "$@"
```

#### Utility Library (`src/lib/utils.sh`)

```bash
#!/usr/bin/env bash
################################################################################
# Utility Functions Library
# Description: Common utility functions for shell scripts
################################################################################

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

#######################################
# Log info message
# Arguments:
#   $1 - Message to log
#######################################
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

#######################################
# Log success message
# Arguments:
#   $1 - Message to log
#######################################
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

#######################################
# Log warning message
# Arguments:
#   $1 - Message to log
#######################################
log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" >&2
}

#######################################
# Log error message
# Arguments:
#   $1 - Message to log
#######################################
log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}
```

#### Test Runner (`tests/run_tests.sh`)

```bash
#!/usr/bin/env bash
################################################################################
# Test Runner
# Description: Execute all test suites
################################################################################

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

#######################################
# Run a single test suite
# Arguments:
#   $1 - Test file path
#######################################
run_test_suite() {
    local test_file="$1"
    echo "Running: $(basename "$test_file")"
    
    if bash "$test_file"; then
        echo "✓ PASSED: $(basename "$test_file")"
        ((TESTS_PASSED++))
    else
        echo "✗ FAILED: $(basename "$test_file")"
        ((TESTS_FAILED++))
    fi
    ((TESTS_RUN++))
}

#######################################
# Main function
#######################################
main() {
    echo "========================================"
    echo "Running Shell Script Test Suite"
    echo "========================================"
    echo ""

    # Run all test files
    for test_file in "${SCRIPT_DIR}"/test_*.sh; do
        if [[ -f "$test_file" ]]; then
            run_test_suite "$test_file"
        fi
    done

    echo ""
    echo "========================================"
    echo "Test Results"
    echo "========================================"
    echo "Total:  ${TESTS_RUN}"
    echo "Passed: ${TESTS_PASSED}"
    echo "Failed: ${TESTS_FAILED}"
    echo "========================================"

    [[ $TESTS_FAILED -eq 0 ]] && exit 0 || exit 1
}

main "$@"
```

### 6. Run Tests and Linters

```bash
# Run ShellCheck
shellcheck -x -S warning src/**/*.sh

# Run tests
./tests/run_tests.sh

# Make scripts executable
chmod +x src/main.sh tests/run_tests.sh
```

### 7. Commit Initial Setup

```bash
# Stage files
git add .gitignore .workflow-config.yaml
git add src/ tests/ docs/
git add .workflow_core  # Submodule reference

# Commit
git commit -m "feat: initial project setup with ai_workflow_core integration"
```

## Integration Workflow

### Standard Development Cycle

1. **Create feature branch**
   ```bash
   git checkout -b feature/my-automation
   ```

2. **Develop with workflow artifacts**
   - Workflow artifacts stored in `.ai_workflow/`
   - Configuration read from `.workflow-config.yaml`
   - AI helpers use project kind (`shell_script_automation`)

3. **Run quality checks**
   ```bash
   # Linting
   shellcheck -x -S warning src/**/*.sh
   
   # Testing
   ./tests/run_tests.sh
   
   # Code formatting
   shfmt -w -i 2 -ci src/**/*.sh
   ```

4. **Review workflow artifacts** (optional)
   ```bash
   # Check execution logs
   ls -la .ai_workflow/logs/
   
   # Review AI summaries
   cat .ai_workflow/summaries/latest_summary.md
   ```

5. **Commit and push**
   ```bash
   git add src/ tests/
   git commit -m "feat: add new automation feature"
   git push origin feature/my-automation
   ```

## Configuration Customization

### Placeholder Reference

| Placeholder | Description | Example Value |
|------------|-------------|---------------|
| `{{PROJECT_NAME}}` | Project display name | "Log Analyzer Tool" |
| `{{PROJECT_TYPE}}` | Technical project type | "shell-script-automation" |
| `{{PROJECT_DESCRIPTION}}` | Brief description | "Automated log analysis and reporting" |
| `{{PROJECT_KIND}}` | Project kind from schema | "shell_script_automation" |
| `{{VERSION}}` | Current version | "1.0.0" |
| `{{LANGUAGE}}` | Primary language | "bash" |
| `{{BUILD_SYSTEM}}` | Build system | "none" |
| `{{TEST_FRAMEWORK}}` | Testing framework | "bash_unit" or "bats" |
| `{{TEST_COMMAND}}` | Test execution command | "./tests/run_tests.sh" |
| `{{LINT_COMMAND}}` | Linter command | "shellcheck -x -S warning src/**/*.sh" |

### Shell-Specific Configuration Options

```yaml
tech_stack:
  primary_language: "bash"
  build_system: "none"
  
  # Testing options
  test_framework: "bash_unit"  # or "bats", "shunit2"
  test_command: "./tests/run_tests.sh"
  
  # Linting options
  lint_command: "shellcheck -x -S warning src/**/*.sh"
  # ShellCheck flags:
  #   -x : Follow source statements
  #   -S : Set severity threshold (error, warning, info, style)
  
quality:
  # Additional quality tools
  formatters:
    - shfmt -w -i 2 -ci src/**/*.sh  # Format with 2-space indent
  
  security:
    - shellcheck -e SC2086 src/**/*.sh  # Check for unquoted variables
```

## Testing and Validation

### Running Tests

```bash
# Run all tests
./tests/run_tests.sh

# Run specific test suite
bash tests/test_utils.sh

# Run with BATS (if installed)
bats tests/
```

### Writing Tests

Example test file (`tests/test_utils.sh`):

```bash
#!/usr/bin/env bash
# Test Suite: Utility Functions

set +e  # Don't exit on test failures
set -uo pipefail

# Load module under test
source "$(dirname "$0")/../src/lib/utils.sh"

# Test counters
PASSED=0
FAILED=0

# Test helper function
assert_equals() {
    local expected="$1"
    local actual="$2"
    local test_name="$3"
    
    if [[ "$expected" == "$actual" ]]; then
        echo "✓ PASS: $test_name"
        ((PASSED++))
    else
        echo "✗ FAIL: $test_name"
        echo "  Expected: $expected"
        echo "  Actual:   $actual"
        ((FAILED++))
    fi
}

# Tests
test_log_functions() {
    # Test log_info outputs message
    local output
    output=$(log_info "test message")
    assert_equals "[INFO] test message" "$output" "log_info outputs correctly"
}

# Run tests
test_log_functions

# Summary
echo ""
echo "Tests passed: $PASSED"
echo "Tests failed: $FAILED"
[[ $FAILED -eq 0 ]] && exit 0 || exit 1
```

### Linting with ShellCheck

```bash
# Check all shell scripts
shellcheck -x -S warning src/**/*.sh tests/**/*.sh

# Fix common issues
# - SC2086: Quote variables to prevent word splitting
# - SC2155: Declare and assign separately
# - SC2164: Use || exit with cd commands
```

## Common Pitfalls

### 1. Variable Quoting

```bash
# ❌ Bad: Unquoted variables
echo $variable
cp $source $destination

# ✅ Good: Quoted variables
echo "${variable}"
cp "${source}" "${destination}"
```

### 2. Sourcing Files

```bash
# ❌ Bad: Relative path without PROJECT_ROOT
source ../lib/utils.sh

# ✅ Good: Absolute path from PROJECT_ROOT
readonly PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "${PROJECT_ROOT}/lib/utils.sh"
```

### 3. Strict Mode

```bash
# Always use at top of scripts
set -euo pipefail
# -e: Exit on error
# -u: Exit on undefined variable
# -o pipefail: Exit on pipe failure
```

### 4. Workflow Directory Structure

```bash
# ❌ Bad: Hardcoded paths
ls .ai_workflow/logs

# ✅ Good: Use PROJECT_ROOT variable
ls "${PROJECT_ROOT}/.ai_workflow/logs"
```

## Troubleshooting

### Submodule Not Found

```bash
# Problem: .workflow_core directory is empty
# Solution: Initialize submodules
git submodule update --init --recursive
```

### ShellCheck Errors

```bash
# Problem: ShellCheck reports SC2086 (unquoted variables)
# Solution: Quote all variable expansions
"${variable}" instead of $variable
```

### Test Failures

```bash
# Problem: Tests fail with "command not found"
# Solution: Check script is executable and paths are correct
chmod +x tests/run_tests.sh
# Verify PROJECT_ROOT is correctly set in test files
```

### Workflow Artifacts Not Created

```bash
# Problem: .ai_workflow directory missing
# Solution: Create directory structure
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,.incremental_cache}
```

## Next Steps

1. **Explore Configuration**: Review `config/project_kinds.yaml` in `.workflow_core/` to understand validation rules for shell projects

2. **Add CI/CD**: Copy GitHub Actions workflow from `.workflow_core/workflow-templates/workflows/`
   ```bash
   mkdir -p .github/workflows
   cp .workflow_core/workflow-templates/workflows/code-quality.yml .github/workflows/
   ```

3. **Update Submodule**: Keep ai_workflow_core up to date
   ```bash
   cd .workflow_core
   git pull origin main
   cd ..
   git add .workflow_core
   git commit -m "chore: update ai_workflow_core submodule"
   ```

4. **Read Integration Guide**: See [docs/INTEGRATION.md](../../docs/INTEGRATION.md) for advanced configuration options

5. **Review AI Helpers**: Explore `config/ai_helpers.yaml` and `config/ai_prompts_project_kinds.yaml` for shell-specific AI prompts

## Resources

- **ShellCheck**: [https://www.shellcheck.net/](https://www.shellcheck.net/)
- **Google Shell Style Guide**: [https://google.github.io/styleguide/shellguide.html](https://google.github.io/styleguide/shellguide.html)
- **BATS Testing**: [https://github.com/bats-core/bats-core](https://github.com/bats-core/bats-core)
- **ai_workflow_core Docs**: [../../docs/](../../docs/)

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-31  
**Project Kind**: `shell_script_automation`
