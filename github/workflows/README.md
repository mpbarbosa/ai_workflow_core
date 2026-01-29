# GitHub Workflows - AI Workflow Automation

This directory contains GitHub Actions workflows for continuous integration and validation.

## Available Workflows

### 1. Documentation Validation (`validate-docs.yml`)

**Purpose:** Validates documentation consistency and accuracy

**Triggers:**

- Pull requests that modify `.md` files
- Push to `main` branch with documentation changes

**What it checks:**

- Documentation cross-references are valid
- `PROJECT_STATISTICS.md` is up to date
- All documentation links work correctly

**How to run locally:**

```bash
./scripts/validate_docs.sh
```

---

### 2. Test Suite Validation (`validate-tests.yml`)

**Purpose:** Validates all test files and ensures test suite integrity

**Triggers:**

- Pull requests that modify any shell scripts in `src/workflow/` or `tests/`
- Push to `main` or `develop` branches with test file changes

**What it checks:**

- ✅ Shell script syntax validation (ShellCheck)
- ✅ Unit tests execution
- ✅ Library module tests (including `test_third_party_exclusion.sh`)
- ✅ Integration tests execution
- ✅ Test report generation

**Test Categories:**

1. **Unit Tests** (`tests/unit/test_*.sh`)
   - File operations tests
   - Cache tests
   - Tech stack tests
   - Utilities tests

2. **Library Module Tests** (`tests/unit/lib/test_*.sh`)
   - `test_third_party_exclusion.sh` (44 tests) ⭐ NEW
   - `test_ai_cache.sh`
   - `test_workflow_optimization.sh`
   - `test_tech_stack_phase3.sh`
   - And 13 more library module tests...

3. **Integration Tests** (via `test_runner.sh`)
   - End-to-end workflow tests
   - Step integration tests

**How to run locally:**

```bash
# Run all tests
./tests/test_runner.sh

# Run only unit tests
./tests/test_runner.sh --unit

# Run only integration tests
./tests/test_runner.sh --integration

# Run with verbose output
./tests/test_runner.sh --unit --verbose

# Test specific module (updated path)
bash tests/unit/lib/test_third_party_exclusion.sh
```

**Features:**

- **Parallel Execution:** Tests run in parallel when possible
- **Caching:** Test results are cached for faster subsequent runs
- **Detailed Reports:** Generates markdown report with test results
- **PR Comments:** Automatically comments test results on pull requests
- **Continue on Failure:** All test suites run even if one fails
- **Timing Metrics:** Reports execution duration

**Test Report Format:**

```markdown
# Test Validation Report

**Date:** 2025-12-23 15:15:00 UTC
**Commit:** abc123...

- ✅ Unit Tests: **PASSED**
- ✅ Library Module Tests: **PASSED**
- ✅ Integration Tests: **PASSED**

## Overall Status: ✅ PASSED
```

---

## Workflow Configuration

### Cache Strategy

Both workflows use GitHub Actions cache to speed up execution:

**Documentation Validation:**

```yaml
key: doc-validation-${{ hashFiles('**.md', 'scripts/validate_docs.sh') }}
```

**Test Suite Validation:**

```yaml
key: test-validation-${{ hashFiles('tests/**/*.sh', 'src/workflow/lib/test_*.sh') }}
```

### Branch Protection

Recommended branch protection rules:

```yaml
branches:
  main:
    required_status_checks:
      - Documentation Validation
      - Test Suite Validation
    require_pull_request: true
```

---

## Adding New Tests

### 1. Unit Test

Create `tests/unit/test_my_feature.sh`:

```bash
#!/bin/bash
set -euo pipefail

source "$(dirname "$0")/../../src/workflow/lib/my_module.sh"

test_my_function() {
    local result
    result=$(my_function "input")
    
    if [[ "$result" == "expected" ]]; then
        echo "✅ test_my_function passed"
        return 0
    else
        echo "❌ test_my_function failed"
        return 1
    fi
}

# Run test
test_my_function
```

Make it executable:

```bash
chmod +x tests/unit/test_my_feature.sh
```

### 2. Library Module Test

Create `src/workflow/lib/test_my_module.sh`:

```bash
#!/bin/bash
set -uo pipefail

source "$(dirname "$0")/my_module.sh"

TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

assert_equals() {
    local expected="$1"
    local actual="$2"
    local test_name="$3"
    
    ((TESTS_RUN++))
    
    if [[ "$expected" == "$actual" ]]; then
        echo "✅ $test_name"
        ((TESTS_PASSED++))
    else
        echo "❌ $test_name (expected: $expected, got: $actual)"
        ((TESTS_FAILED++))
    fi
}

# Tests
test_feature() {
    local result
    result=$(my_function)
    assert_equals "expected" "$result" "my_function returns correct value"
}

main() {
    echo "Testing: My Module"
    test_feature
    
    echo ""
    echo "Tests: $TESTS_RUN | Passed: $TESTS_PASSED | Failed: $TESTS_FAILED"
    
    [[ $TESTS_FAILED -eq 0 ]] && exit 0 || exit 1
}

main
```

### 3. Integration Test

Add to `tests/test_runner.sh` or create new integration test file.

---

## Troubleshooting

### Workflow Fails Locally But Passes in CI

**Cause:** Environment differences

**Solution:**

```bash
# Install same dependencies as CI
sudo apt-get install -y shellcheck bats

# Clear cache
rm -rf ~/.cache/test-validation

# Run tests
./tests/test_runner.sh
```

### ShellCheck Warnings

**Cause:** Shell script syntax issues

**Solution:**

```bash
# Run shellcheck locally
shellcheck tests/unit/test_*.sh

# Fix reported issues
# Common fixes:
# - Quote variables: "$var" instead of $var
# - Use [[ ]] instead of [ ]
# - Declare variables with local
```

### Tests Pass Individually But Fail in Suite

**Cause:** Test interdependencies or environment pollution

**Solution:**

```bash
# Run tests in isolation
for test in tests/unit/test_*.sh; do
    bash "$test"
done

# Check for global variables
# Each test should be self-contained
```

### PR Comment Not Appearing

**Cause:** Insufficient permissions

**Solution:**

- Ensure GitHub Actions has write permissions for PRs
- Check repository settings > Actions > General > Workflow permissions
- Enable "Read and write permissions"

---

## Best Practices

### 1. Test Naming

- Unit tests: `test_<module>_<feature>.sh`
- Integration tests: `test_<workflow>_integration.sh`
- Module tests: `test_<module_name>.sh`

### 2. Test Structure

```bash
#!/bin/bash
set -euo pipefail  # Fail fast

# Setup
source dependencies

# Helper functions
assert_*() { ... }

# Test functions
test_feature_1() { ... }
test_feature_2() { ... }

# Main
main() {
    test_feature_1
    test_feature_2
    # Report results
}

main "$@"
```

### 3. Test Independence

- Each test should be independent
- Use `mktemp` for temporary files
- Clean up after tests
- Don't rely on execution order

### 4. Descriptive Assertions

```bash
# Good
assert_equals "expected" "$result" "function returns correct value for valid input"

# Bad
assert_equals "expected" "$result" "test 1"
```

### 5. Continue on Error for Test Suites

Allow all tests to run:

```yaml
continue-on-error: true
```

Then check final status and fail if any test failed.

---

## Metrics

### Current Test Coverage

| Category | Tests | Status |
|----------|-------|--------|
| Unit Tests | 15+ | ✅ Active |
| Library Module Tests | 20+ | ✅ Active |
| Integration Tests | 5+ | ✅ Active |
| **Total** | **40+** | **✅ Active** |

### New in v2.3.1

- ✅ Third-Party Exclusion Module: 44 tests (100% coverage)
- ✅ AI Cache Module: Comprehensive tests
- ✅ Workflow Optimization: Performance tests

---

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [ShellCheck](https://www.shellcheck.net/)
- [BATS Testing Framework](https://github.com/bats-core/bats-core)
- Project Test Runner: `tests/test_runner.sh`

---

**Last Updated:** 2025-12-23  
**Maintained By:** AI Workflow Automation Team
