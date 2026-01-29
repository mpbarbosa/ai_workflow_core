# Contributing to AI Workflow Automation

**Version**: 1.0.0  
**Last Updated**: 2025-12-23  
**Status**: ✅ Official Guidelines

Thank you for your interest in contributing to AI Workflow Automation! This document provides guidelines to help you contribute effectively.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Documentation Standards](#documentation-standards)
- [Commit Message Convention](#commit-message-convention)
- [Issue Reporting](#issue-reporting)
- [Release Process](#release-process)

---

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, background, or identity.

### Key Points

- **Be Respectful**: Treat everyone with respect and consideration
- **Be Collaborative**: Work together to improve the project
- **Be Constructive**: Provide helpful feedback and suggestions
- **Be Patient**: Help newcomers learn and grow

### Reporting

If you experience or witness unacceptable behavior, please report it by opening a confidential issue or contacting project maintainers.

For complete details, see our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Bash**: Version 4.0+ (check: `bash --version`)
- **Git**: Version 2.0+ (check: `git --version`)
- **Node.js**: Version 25.2.1+ for testing (check: `node --version`)
- **GitHub CLI** (optional): For easier PR management

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork

git clone git@github.com:YOUR_USERNAME/ai_workflow.git
cd ai_workflow

# Add upstream remote
git remote add upstream git@github.com:mpbarbosa/ai_workflow.git
```

### Create a Branch

```bash
# Update your fork
git fetch upstream
git checkout main
git merge upstream/main

# Create a feature branch
git checkout -b feature/your-feature-name
```

---

## Workflow Usage Patterns

### Optimized Development Workflow (v2.5.0+)

The workflow now runs in **optimized mode by default** with smart execution and parallel processing enabled. This provides the best experience for most users.

#### Default Behavior (Phase 2 Complete)

```bash
# Run with all optimizations enabled (default)
./src/workflow/execute_tests_docs_workflow.sh

# What's enabled by default:
#  ✅ Smart Execution - Skips unnecessary steps (40-85% faster)
#  ✅ Parallel Execution - Runs independent steps simultaneously (33% faster)
#  ✅ AI Response Caching - Reduces token usage (60-80% savings)
#  ✅ Checkpoint Resume - Continues from last completed step
```

#### Override Defaults

```bash
# Disable smart execution (run all steps)
./src/workflow/execute_tests_docs_workflow.sh --no-smart-execution

# Disable parallel execution (sequential mode)
./src/workflow/execute_tests_docs_workflow.sh --no-parallel

# Disable both optimizations
./src/workflow/execute_tests_docs_workflow.sh --no-smart-execution --no-parallel

# Fresh start (ignore checkpoints)
./src/workflow/execute_tests_docs_workflow.sh --no-resume
```

### Common Usage Patterns

#### 1. Quick Documentation Update

For documentation-only changes:

```bash
# Smart execution automatically detects doc-only changes
# and skips test/code quality steps (85% faster)
./src/workflow/execute_tests_docs_workflow.sh

# Steps automatically skipped:
#   - Step 5: Test Review
#   - Step 6: Test Generation
#   - Step 7: Test Execution
#   - Step 9: Code Quality
```

#### 2. Code Changes

For code modifications:

```bash
# All relevant steps run automatically
./src/workflow/execute_tests_docs_workflow.sh

# Steps included:
#   - All documentation steps
#   - Test review and generation
#   - Test execution
#   - Dependency validation
#   - Code quality checks
```

#### 3. Automated CI/CD Pipeline

```bash
# Non-interactive mode for CI/CD
./src/workflow/execute_tests_docs_workflow.sh \
  --auto \
  --ai-batch

# Optimizations:
#  • No user prompts
#  • AI runs non-interactively with 5min timeout
#  • Smart execution enabled
#  • Parallel processing enabled
```

#### 4. Selective Step Execution

```bash
# Run specific steps only
./src/workflow/execute_tests_docs_workflow.sh --steps 0,5,6,7

# Run just validation steps (1-4)
./src/workflow/execute_tests_docs_workflow.sh --steps 1,2,3,4
```

#### 5. Target External Project

```bash
# Run workflow on different project
./src/workflow/execute_tests_docs_workflow.sh --target /path/to/project

# Artifacts stored in target project's .ai_workflow/ directory
```

#### 6. View Performance Metrics

```bash
# View metrics dashboard
./tools/metrics_dashboard.sh

# Shows:
#  • Optimization status
#  • Performance gains
#  • Usage recommendations
```

### Performance Expectations (v2.5.0)

| Change Type | Duration (Baseline) | Duration (Optimized) | Improvement |
|-------------|---------------------|----------------------|-------------|
| Documentation Only | 23 minutes | 3.5 minutes | **85% faster** |
| Code Changes | 23 minutes | 10 minutes | **57% faster** |
| Full Changes | 23 minutes | 15.5 minutes | **33% faster** |

### Troubleshooting Common Issues

#### Issue: Steps Taking Too Long

```bash
# Check if optimizations are enabled
./src/workflow/execute_tests_docs_workflow.sh --help | grep "ENABLED BY DEFAULT"

# Should see:
#   --smart-execution  ✅ ENABLED BY DEFAULT
#   --parallel         ✅ ENABLED BY DEFAULT
```

#### Issue: Tests Failing Unexpectedly

```bash
# Run in sequential mode for easier debugging
./src/workflow/execute_tests_docs_workflow.sh --no-parallel

# Run specific failing step
./src/workflow/execute_tests_docs_workflow.sh --steps 7
```

#### Issue: Want to Force Full Execution

```bash
# Disable smart execution to run all steps
./src/workflow/execute_tests_docs_workflow.sh --no-smart-execution
```

### Best Practices

1. **Use Defaults**: The optimizations are well-tested and safe for most use cases
2. **Check Metrics**: Run `./tools/metrics_dashboard.sh` to monitor performance
3. **CI/CD**: Use `--auto --ai-batch` for automation
4. **Debugging**: Use `--no-parallel` if you need sequential execution for debugging
5. **Documentation**: Keep README.md updated as workflow runs

---

## Development Setup

### Run Tests

```bash
# Run all tests
./tests/run_all_tests.sh

# Run specific test suite
./tests/run_all_tests.sh --unit
./tests/run_all_tests.sh --integration

# Run individual test
./tests/unit/test_ai_cache.sh
```

### Self-Test the Workflow

```bash
# Test on itself (recommended)
./src/workflow/execute_tests_docs_workflow.sh --smart-execution --parallel

# Test on sample project
cd /path/to/sample/project
/path/to/ai_workflow/src/workflow/execute_tests_docs_workflow.sh
```

### Health Check

```bash
# Verify environment
./src/workflow/lib/health_check.sh
```

---

## Code Style Guidelines

### Shell Script Standards

Follow these conventions for all shell scripts:

#### 1. **File Header**

Every script must have a header:

```bash
#!/usr/bin/env bash
################################################################################
# Module Name
# Purpose: Brief description of what this module does
# Part of: AI Workflow Automation vX.Y.Z
################################################################################

set -euo pipefail
```

#### 2. **Error Handling**

Always use strict error handling:

```bash
# Enable strict mode
set -euo pipefail

# Check command exit codes
if ! command_that_might_fail; then
    echo "Error: Command failed" >&2
    return 1
fi

# Use trap for cleanup
trap cleanup_function EXIT ERR
```

#### 3. **Variable Naming**

```bash
# Constants: UPPERCASE with underscores
readonly PROJECT_ROOT="/path/to/project"
readonly MAX_RETRIES=3

# Local variables: lowercase with underscores
local file_path="/tmp/file.txt"
local retry_count=0

# Global variables: Avoid if possible, use uppercase if needed
GLOBAL_STATE="initial"
```

#### 4. **Function Design**

```bash
# Function naming: verb_noun pattern
function validate_configuration() {
    # Declare local variables
    local config_file="$1"
    
    # Validate parameters
    if [[ -z "${config_file}" ]]; then
        echo "Error: config_file required" >&2
        return 1
    fi
    
    # Function logic
    if [[ ! -f "${config_file}" ]]; then
        echo "Error: Config file not found: ${config_file}" >&2
        return 1
    fi
    
    # Return success
    return 0
}

# Export functions for use in other scripts
export -f validate_configuration
```

#### 5. **Quoting**

Always quote variable expansions:

```bash
# ✅ Correct
echo "${variable}"
cp "${source_file}" "${destination}"
if [[ "${status}" == "active" ]]; then

# ❌ Incorrect
echo $variable
cp $source_file $destination
if [[ $status == "active" ]]; then
```

#### 6. **Conditionals**

Use `[[ ]]` for conditionals:

```bash
# ✅ Correct
if [[ -f "${file}" ]]; then
if [[ "${var}" == "value" ]]; then
if [[ -n "${string}" ]]; then

# ❌ Incorrect
if [ -f $file ]; then
if [ $var = "value" ]; then
if [ -n $string ]; then
```

#### 7. **Comments**

```bash
# Single-line comments for brief explanations
local temp_file="/tmp/data"

# Multi-line comments for complex logic
# This function performs three tasks:
# 1. Validates input parameters
# 2. Processes the data
# 3. Returns the result
function process_data() {
    # Implementation
}

# Inline comments for clarity
local max_attempts=5  # Retry up to 5 times
```

#### 8. **Functions Over Scripts**

Prefer functions for code organization:

```bash
# ✅ Correct: Use functions
function main() {
    validate_input "$@"
    process_data
    generate_output
}

main "$@"

# ❌ Incorrect: Script-level code without functions
# ... inline code without structure
```

### ShellCheck Compliance

All scripts must pass ShellCheck:

```bash
# Run ShellCheck
shellcheck src/workflow/**/*.sh

# Fix common issues
# - SC2086: Quote variables
# - SC2155: Declare and assign separately
# - SC2164: Use || exit with cd
```

### Style Checklist

- [ ] Shebang: `#!/usr/bin/env bash`
- [ ] Strict mode: `set -euo pipefail`
- [ ] File header with purpose
- [ ] Constants in UPPERCASE
- [ ] Local variables in lowercase
- [ ] All variables quoted
- [ ] Use `[[ ]]` for conditionals
- [ ] Functions exported if needed
- [ ] ShellCheck passes
- [ ] Comments for complex logic

---

## Testing Requirements

### Coverage Goals

- **100% Coverage**: All new functions must have tests
- **No Regressions**: All existing tests must pass
- **Test Types**: Unit tests for functions, integration tests for workflows

### Writing Tests

#### Test File Template

```bash
#!/usr/bin/env bash
################################################################################
# Test Suite: Module Name
# Purpose: Test module functionality
################################################################################

set +e  # Don't exit on test failures
set -uo pipefail

# Test setup
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Load module under test
source "${PROJECT_ROOT}/src/workflow/lib/module_name.sh"

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Assertion helper
assert_equals() {
    local expected="$1"
    local actual="$2"
    local test_name="$3"
    
    ((TESTS_RUN++))
    
    if [[ "${expected}" == "${actual}" ]]; then
        ((TESTS_PASSED++))
        echo "✓ ${test_name}"
        return 0
    else
        ((TESTS_FAILED++))
        echo "✗ ${test_name}"
        echo "  Expected: ${expected}"
        echo "  Actual:   ${actual}"
        return 1
    fi
}

# Test function
test_example_function() {
    local expected="expected_result"
    local actual=$(example_function "input")
    
    assert_equals "${expected}" "${actual}" "example_function returns correct value"
}

# Run tests
test_example_function

# Summary
if [[ ${TESTS_FAILED} -eq 0 ]]; then
    echo "✅ All ${TESTS_PASSED} tests passed"
    exit 0
else
    echo "❌ ${TESTS_FAILED} of ${TESTS_RUN} tests failed"
    exit 1
fi
```

#### Test Best Practices

1. **Arrange-Act-Assert** (AAA Pattern)
```bash
test_function_name() {
    # Arrange
    local input="test_value"
    local expected="expected_result"
    
    # Act
    local actual=$(function_to_test "${input}")
    
    # Assert
    assert_equals "${expected}" "${actual}" "Test description"
}
```

2. **Test One Thing**
```bash
# ✅ Good - focused test
test_function_handles_empty_input()
test_function_handles_long_input()

# ❌ Bad - tests multiple things
test_function_works()
```

3. **Use Descriptive Names**
```bash
# ✅ Good
test_cache_returns_cached_value_on_second_call()

# ❌ Bad
test_1()
```

4. **Clean Up After Tests**
```bash
test_creates_temp_file() {
    local temp_file="/tmp/test_$$"
    
    # Test logic
    create_file "${temp_file}"
    
    # Cleanup
    rm -f "${temp_file}"
}
```

### Running Tests Before PR

```bash
# Required before submitting PR
./tests/run_all_tests.sh

# Should see:
# ✅ All tests passed
# Total: 37 test files
# Passed: 430+ tests
```

### Test Checklist

- [ ] All new functions have tests
- [ ] All tests pass locally
- [ ] Test file named `test_*.sh`
- [ ] Test file executable (`chmod +x`)
- [ ] Tests use AAA pattern
- [ ] Tests are independent
- [ ] Tests clean up after themselves

---

## Pull Request Process

### Before Submitting

1. **Update Your Branch**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run Tests**
```bash
./tests/run_all_tests.sh
```

3. **Run Self-Test**
```bash
./src/workflow/execute_tests_docs_workflow.sh --smart-execution --parallel
```

4. **Check Code Style**
```bash
shellcheck src/workflow/**/*.sh
```

5. **Update Documentation**
- Update README if behavior changes
- Add docstrings to new functions
- Update relevant guides

### Creating the PR

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR (using GitHub CLI)
gh pr create \
  --base main \
  --head feature/your-feature-name \
  --title "feat: Brief description" \
  --body "Detailed description of changes"
```

### PR Template

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update

## Changes Made

- List specific changes
- Include file modifications
- Note any new dependencies

## Testing

- [ ] All tests pass (`./tests/run_all_tests.sh`)
- [ ] Self-test passes
- [ ] New tests added for new functionality
- [ ] Test coverage remains at 100%

## Documentation

- [ ] Code comments updated
- [ ] README updated (if needed)
- [ ] Documentation guides updated (if needed)
- [ ] Release notes prepared (if significant)

## Checklist

- [ ] Code follows style guidelines
- [ ] ShellCheck passes
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Commit messages follow convention
```

### PR Review Process

1. **Automated Checks**: CI tests must pass
2. **Code Review**: At least one maintainer approval
3. **Documentation Review**: Docs must be updated
4. **Testing Review**: Tests must be adequate

### After Approval

PRs will be merged using **squash and merge** to keep main branch clean.

---

## Documentation Standards

### Follow the Style Guide

All documentation must follow [`docs/reference/documentation-style-guide.md`](docs/reference/documentation-style-guide.md).

### Key Conventions

#### File Paths

Always use inline code:
```markdown
✅ The `src/workflow/lib/ai_helpers.sh` module...
❌ The src/workflow/lib/ai_helpers.sh module...
```

#### Commands

Always use code blocks or inline code:
```markdown
✅ Run `./execute_tests_docs_workflow.sh --auto`
❌ Run ./execute_tests_docs_workflow.sh --auto
```

#### Configuration Values

Always use inline code:
```markdown
✅ Set `primary_language: "bash"` in configuration
❌ Set primary_language: "bash" in configuration
```

#### Status Indicators

Use emoji or symbols:
```markdown
✅ Complete
❌ Failed
⚠️  Warning
🚧 In Progress
```

### Documentation Checklist

- [ ] Follow DOCUMENTATION_STYLE_GUIDE.md
- [ ] Use inline code for file paths
- [ ] Use code blocks for commands
- [ ] Include examples
- [ ] Add table of contents for long docs
- [ ] Use clear, concise language
- [ ] Check spelling and grammar

---

## Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no behavior change)
- **test**: Test additions or modifications
- **chore**: Build process, dependencies, tooling

### Examples

#### Feature
```
feat(ai-cache): Add TTL-based cache expiration

- Implement automatic cleanup of expired cache entries
- Add configurable TTL (default: 24 hours)
- Update tests for cache expiration

Closes #123
```

#### Bug Fix
```
fix(step-7): Correct test execution directory

Step 7 was not changing to the correct directory before running tests,
causing test failures. Updated to use TARGET_DIR properly.

Fixes #456
```

#### Documentation
```
docs: Add performance benchmarks documentation

- Document benchmarking methodology
- Include raw benchmark data
- Add reproducibility instructions

Related to #789
```

### Commit Message Checklist

- [ ] Type prefix (feat, fix, docs, etc.)
- [ ] Subject line < 72 characters
- [ ] Imperative mood ("Add" not "Added")
- [ ] Body explains what and why
- [ ] Reference issues (Closes #123)

---

## Issue Reporting

### Before Reporting

1. **Search Existing Issues**: Check if already reported
2. **Use Latest Version**: Test on current release
3. **Reproduce**: Ensure issue is reproducible
4. **Gather Info**: Collect error messages, logs

### Bug Report Template

```markdown
## Description

Clear description of the bug.

## Steps to Reproduce

1. Run command `...`
2. Observe behavior `...`
3. Expected vs actual result

## Environment

- OS: Ubuntu 22.04
- Bash: 5.1.16
- Node.js: 25.2.1
- Workflow Version: v2.4.0

## Error Messages

```
Paste error messages here
```

## Logs

Attach relevant log files from `src/workflow/logs/`

## Additional Context

Any other relevant information.
```

### Feature Request Template

```markdown
## Feature Description

Clear description of the proposed feature.

## Use Case

Explain the problem this feature solves.

## Proposed Solution

Describe how you envision this feature working.

## Alternatives Considered

Other solutions you've considered.

## Additional Context

Any other relevant information.
```

---

## Release Process

### For Contributors

If your contribution should be part of a release:

1. **Document Changes**: Update release notes draft
2. **Version Bump**: Use semantic versioning
3. **Testing**: Ensure all tests pass
4. **Changelog**: Update CHANGELOG.md

### For Maintainers

See [`docs/reference/release-process.md`](docs/reference/release-process.md) for complete release process.

---

## Additional Resources

### Documentation

- **Quick Start**: [`docs/user-guide/quick-start.md`](docs/user-guide/quick-start.md)
- **Testing Strategy**: [`docs/developer-guide/testing.md`](docs/developer-guide/testing.md)
- **Release Process**: [`docs/reference/release-process.md`](docs/reference/release-process.md)
- **Configuration Schema**: [`docs/reference/configuration.md`](docs/reference/configuration.md)
- **Performance Benchmarks**: [`docs/reference/performance-benchmarks.md`](docs/reference/performance-benchmarks.md)

### Tools

- **Test Runner**: `./tests/run_all_tests.sh`
- **Version Bump**: `./scripts/bump_version.sh`
- **Health Check**: `./src/workflow/lib/health_check.sh`

### Communication

- **Issues**: [GitHub Issues](https://github.com/mpbarbosa/ai_workflow/issues)
- **Pull Requests**: [GitHub PRs](https://github.com/mpbarbosa/ai_workflow/pulls)
- **Discussions**: [GitHub Discussions](https://github.com/mpbarbosa/ai_workflow/discussions)

---

## Questions?

If you have questions not covered here:

1. Check existing documentation in `docs/`
2. Search closed issues
3. Ask in GitHub Discussions
4. Open a new issue with the "question" label

---

## Thank You!

Thank you for contributing to AI Workflow Automation! Your contributions help make this project better for everyone.

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-23  
**Status**: ✅ Official Contributing Guidelines
