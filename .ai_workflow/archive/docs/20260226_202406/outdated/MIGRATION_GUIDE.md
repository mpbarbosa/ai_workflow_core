# Migration Guide

**Version**: 1.1.0  
**Last Updated**: 2026-02-09

> **Purpose**: Step-by-step instructions for upgrading ai_workflow_core between versions. This guide covers breaking changes, deprecations, and migration strategies.

---

## Table of Contents

- [Overview](#overview)
- [Version Compatibility](#version-compatibility)
- [Migration Paths](#migration-paths)
  - [Upgrading to v2.0.0](#upgrading-to-v200-unreleased)
  - [Upgrading to v1.0.1](#upgrading-to-v100-current)
- [Breaking Changes Reference](#breaking-changes-reference)
- [Migration Checklists](#migration-checklists)
- [Rollback Procedures](#rollback-procedures)
- [Testing Migrations](#testing-migrations)

---

## Overview

### When to Migrate

You should migrate when:

- ✅ New features are needed for your project
- ✅ Security updates or bug fixes are available
- ✅ Your project requires new project kinds or configurations
- ⚠️ You encounter bugs fixed in newer versions

You can **skip migration** if:

- ❌ Current version works fine for your needs
- ❌ No critical security issues in your version
- ❌ New features aren't relevant to your project

### Versioning Strategy

ai_workflow_core follows [Semantic Versioning](https://semver.org/):

- **Major (X.0.0)**: Breaking changes, migration required
- **Minor (1.X.0)**: New features, backward compatible
- **Patch (1.0.X)**: Bug fixes, backward compatible

**Example**:
- `v1.0.1` → `v1.1.0`: Safe upgrade, no breaking changes
- `v1.0.1` → `v2.0.0`: Breaking changes, follow migration guide

### Migration Risk Levels

| Change Type | Risk | Time | Testing Required |
|------------|------|------|------------------|
| Patch (1.0.1 → 1.0.1) | 🟢 Low | 5 min | Basic validation |
| Minor (1.0.1 → 1.1.0) | 🟡 Medium | 15 min | Config validation |
| Major (1.0.1 → 2.0.0) | 🔴 High | 30-60 min | Full integration test |

---

## Version Compatibility

### Current Stable Versions

| Version | Released | Status | End of Life |
|---------|----------|--------|-------------|
| v1.0.1 | 2026-02-01 | ✅ Current | TBD |
| v0.x.x | 2025-2026 | ⚠️ Pre-release | 2026-06-01 |

### Compatibility Matrix

| ai_workflow_core | Source ai_workflow (Bash) | Migration Target ai_workflow.js (Node.js) | Node.js | Python | Bash |
|-----------------|---------------------------|------------------------------------------|---------|--------|------|
| v1.0.1 | v4.0.0+ | v1.3.0+ | 18+ | 3.8+ | 4.0+ |

**Important Notes:**
- **Source ai_workflow v4.0.0** (released 2026-02-08): Configuration-driven step execution, 100% backward compatible
- **ai_workflow.js v1.3.0** (released 2026-02-09): Phase 8 complete, all performance optimization modules implemented

---

## Migration Paths

### Upgrading to v2.0.0 (Unreleased)

**Status**: 🚧 In development  
**Breaking Changes**: Yes - Directory structure changes

#### Breaking Changes Summary

1. **Artifact Directory Relocated** (`scripts/cleanup_artifacts.sh.template` v2.0.0)
   - **Old**: `${REPO_ROOT}/src/workflow`
   - **New**: `${REPO_ROOT}/.ai_workflow`
   - **Impact**: All projects using cleanup script

2. **Cache Directory Renamed**
   - **Old**: `.ai_cache/`
   - **New**: `.ai_workflow/.incremental_cache/`
   - **Impact**: Projects with existing cache

#### Migration Steps (v1.x → v2.0.0)

**Estimated Time**: 30 minutes

##### Step 1: Create Feature Branch

```bash
git checkout -b upgrade-workflow-core-v2
```

##### Step 2: Update Submodule

```bash
cd .workflow_core
git fetch --tags
git checkout v2.0.0  # When released
cd ..
```

##### Step 3: Migrate Artifact Directory

**If you have custom scripts referencing `src/workflow`:**

```bash
# Find all references
grep -r "src/workflow" . --exclude-dir=.git --exclude-dir=node_modules

# Replace with .ai_workflow
# (Manual edit required for each file)
```

**Update your scripts**:
```bash
# Old
WORKFLOW_DIR="${REPO_ROOT}/src/workflow"

# New
WORKFLOW_DIR="${REPO_ROOT}/.ai_workflow"
```

##### Step 4: Migrate Cache Directory

```bash
# Move cache if exists
if [ -d ".ai_cache" ]; then
  mkdir -p .ai_workflow/.incremental_cache
  mv .ai_cache/* .ai_workflow/.incremental_cache/ 2>/dev/null || true
  rmdir .ai_cache
fi
```

##### Step 5: Update .gitignore

```bash
# Remove old patterns
sed -i '/.ai_cache/d' .gitignore
sed -i '/src\/workflow/d' .gitignore

# Add new patterns (if not already present)
cat >> .gitignore << 'EOF'

# AI Workflow artifacts (v2.0.0+)
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
EOF
```

##### Step 6: Update Cleanup Script

```bash
# Re-copy updated script template
cp .workflow_core/scripts/cleanup_artifacts.sh.template scripts/cleanup_artifacts.sh

# Re-apply customizations (if any)
# (Manual review required)
```

##### Step 7: Validate Migration

```bash
# Check for old references
grep -r "src/workflow" . --exclude-dir=.git --exclude-dir=.workflow_core
grep -r ".ai_cache" . --exclude-dir=.git --exclude-dir=.workflow_core

# Should return no results

# Verify new structure
ls -la .ai_workflow/
# Should include .incremental_cache/
```

##### Step 8: Test

```bash
# Run cleanup script (dry run)
bash scripts/cleanup_artifacts.sh --dry-run

# Run your project's tests
npm test  # or your test command

# Verify workflow operations
# (Project-specific testing)
```

##### Step 9: Commit

```bash
git add .
git commit -m "chore: migrate to ai_workflow_core v2.0.0

BREAKING CHANGES:
- Migrated artifact directory: src/workflow → .ai_workflow
- Migrated cache directory: .ai_cache → .ai_workflow/.incremental_cache
- Updated cleanup script to v2.0.0
- Updated .gitignore patterns"
```

##### Step 10: Merge and Deploy

```bash
# Create PR/MR for review
# After approval:
git checkout main
git merge upgrade-workflow-core-v2
git push origin main
```

---

### Upgrading to v1.0.1 (Current)

**Status**: ✅ Stable release  
**Breaking Changes**: No (initial stable release)

#### From Pre-release (v0.x) to v1.0.1

**Estimated Time**: 15-20 minutes

##### Step 1: Review CHANGELOG

```bash
# View changes
cat .workflow_core/CHANGELOG.md
```

##### Step 2: Update Submodule

```bash
cd .workflow_core
git fetch --tags
git checkout v1.0.1
cd ..
git add .workflow_core
```

##### Step 3: Update Configuration

```bash
# Check for new config fields
diff .workflow-config.yaml .workflow_core/config/.workflow-config.yaml.template

# Add any new optional fields you want to use
# (Manual edit required)
```

##### Step 4: Validate Configuration

```bash
# Syntax check
yamllint .workflow-config.yaml

# Check placeholders removed
grep "{{" .workflow-config.yaml
# Should return nothing
```

##### Step 5: Update Documentation References

```bash
# Update any documentation referencing ai_workflow_core
# Search for version mentions
grep -r "0\.[0-9]\.[0-9]" docs/ 2>/dev/null
```

##### Step 6: Test

```bash
# Run your tests
npm test  # or your test command

# Validate directory structure
bash .workflow_core/scripts/check_integration_health.sh  # If available
```

##### Step 7: Commit

```bash
git commit -m "chore: upgrade ai_workflow_core to v1.0.1"
```

---

## Breaking Changes Reference

### v2.0.0 (Unreleased)

#### Cleanup Script Directory Structure

**Component**: `scripts/cleanup_artifacts.sh.template`  
**Type**: Breaking change  
**Date**: TBD

**What Changed**:
```bash
# Before v2.0.0
WORKFLOW_DIR="${REPO_ROOT}/src/workflow"

# After v2.0.0
WORKFLOW_DIR="${REPO_ROOT}/.ai_workflow"
```

**Who Is Affected**:
- Projects using `scripts/cleanup_artifacts.sh.template`
- Custom scripts referencing `src/workflow`
- CI/CD pipelines with hardcoded paths

**Migration Required**:
1. Update all script references: `src/workflow` → `.ai_workflow`
2. Move existing artifacts: `src/workflow/*` → `.ai_workflow/`
3. Update `.gitignore` patterns
4. Re-copy and customize cleanup script

**Backward Compatibility**: None (breaking change)

#### Cache Directory Relocation

**Component**: Incremental cache  
**Type**: Breaking change  
**Date**: TBD

**What Changed**:
```bash
# Before v2.0.0
.ai_cache/

# After v2.0.0
.ai_workflow/.incremental_cache/
```

**Who Is Affected**:
- Projects with existing cache data
- Scripts referencing `.ai_cache/`

**Migration Required**:
1. Move cache: `.ai_cache/*` → `.ai_workflow/.incremental_cache/`
2. Update `.gitignore`: remove `.ai_cache/`, add `.ai_workflow/.incremental_cache/`
3. Update any cache references in code

**Backward Compatibility**: None (breaking change)

---

### v1.0.1 (Current)

**Type**: Initial stable release  
**Breaking Changes**: None (first major version)

**Notable Changes**:
- Cleanup script updated to v2.0.0 (see above)
- **Source ai_workflow (Bash)** updated to v4.0.0 (released 2026-02-08)
  - Configuration-driven step execution system
  - Steps renamed to descriptive names (e.g., `documentation_updates` instead of `step_01`)
  - Step registry with YAML parser and topological sort
  - Dynamic step loader with on-demand module loading
  - 21 step files renamed, 8 library directories renamed
  - 100% backward compatible with legacy mode
- **Migration Target ai_workflow.js (Node.js)** updated to v1.3.0 (released 2026-02-09)
  - Phase 8 complete: Performance Optimization (11 modules)
  - 3,417 tests passing (18 skipped, 0 failures)
  - All 11 performance optimization modules implemented:
    - performance.js, performance_monitoring.js, ml_optimization.js
    - analysis_cache.js, incremental_analysis.js
    - docs_only_optimization.js, code_changes_optimization.js, full_changes_optimization.js
    - multi_stage_pipeline.js, step1_incremental.js, step1_parallel.js
  - Phase 9 in progress: Step Implementations (19 workflow steps)
  - Performance improvements: 40-85% faster with optimizations, ML-driven skip prediction

**No migration required** for new installations.

---

## Migration Checklists

### Pre-Migration Checklist

Before upgrading, ensure:

- [ ] Current version is committed and pushed
- [ ] All tests passing on current version
- [ ] Backup of `.workflow-config.yaml` created
- [ ] CHANGELOG reviewed for target version
- [ ] Breaking changes documented and understood
- [ ] Team notified (if team project)
- [ ] Feature branch created
- [ ] Testing environment available

### Post-Migration Checklist

After upgrading, verify:

- [ ] Submodule updated to target version
- [ ] Configuration file validated (YAML syntax)
- [ ] No `{{PLACEHOLDERS}}` remaining in config
- [ ] All custom scripts updated (if needed)
- [ ] Directory structure matches new version
- [ ] `.gitignore` patterns updated
- [ ] Tests passing
- [ ] CI/CD pipelines updated (if applicable)
- [ ] Documentation updated with new version
- [ ] Changes committed with descriptive message
- [ ] Migration tested in staging/dev environment

---

## Rollback Procedures

### If Migration Fails

**Option 1: Rollback Submodule** (Quick)

```bash
# Rollback to previous version
cd .workflow_core
git checkout v1.0.1  # Your previous version
cd ..
git add .workflow_core

# Restore previous config (if backed up)
cp .workflow-config.yaml.backup .workflow-config.yaml

git commit -m "chore: rollback ai_workflow_core to v1.0.1"
```

**Option 2: Reset Branch** (Full rollback)

```bash
# Discard all migration changes
git reset --hard HEAD~1  # If one commit
# OR
git reset --hard <commit-hash>  # Before migration
```

**Option 3: Revert Commits** (Keep history)

```bash
# Revert migration commit(s)
git revert <migration-commit-hash>
git push origin main
```

### Rollback Testing

After rollback:

```bash
# Verify version
cd .workflow_core && git describe --tags && cd ..
# Should show previous version

# Run tests
npm test  # or your test command

# Check config
grep "{{" .workflow-config.yaml
# Should return nothing
```

---

## Testing Migrations

### Local Testing Strategy

1. **Test in Feature Branch** (Required)
   ```bash
   git checkout -b test-upgrade-v2
   # Perform migration steps
   # Run tests
   # If successful, merge
   ```

2. **Test in Separate Directory** (Recommended for major versions)
   ```bash
   # Clone project to test directory
   git clone /path/to/project /tmp/test-migration
   cd /tmp/test-migration
   # Perform migration
   # Run full test suite
   # If successful, apply to main project
   ```

3. **Use Staging Environment** (Recommended for production projects)
   - Deploy migration to staging
   - Run integration tests
   - Verify functionality
   - Monitor for issues
   - Deploy to production after validation

### Automated Testing

**CI/CD Pipeline Example**:

```yaml
# .github/workflows/test-migration.yml
name: Test Migration

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive
      
      - name: Validate config
        run: yamllint .workflow-config.yaml
      
      - name: Check placeholders
        run: |
          if grep -q "{{" .workflow-config.yaml; then
            echo "Error: Placeholders found in config"
            exit 1
          fi
      
      - name: Run tests
        run: npm test
```

### Migration Smoke Tests

**Quick validation script**:

```bash
#!/bin/bash
# smoke-test.sh - Run after migration

echo "🔍 Smoke Testing Migration..."

# 1. Check submodule version
echo "Checking submodule version..."
cd .workflow_core && git describe --tags && cd ..

# 2. Validate config syntax
echo "Validating config syntax..."
yamllint .workflow-config.yaml || { echo "❌ Config invalid"; exit 1; }

# 3. Check for placeholders
echo "Checking for placeholders..."
if grep -q "{{" .workflow-config.yaml; then
  echo "❌ Placeholders found"
  exit 1
fi

# 4. Verify directory structure
echo "Verifying directory structure..."
[ -d ".ai_workflow" ] || { echo "❌ .ai_workflow missing"; exit 1; }
[ -d ".ai_workflow/.incremental_cache" ] || echo "⚠️  Cache directory missing"

# 5. Run tests
echo "Running tests..."
npm test || { echo "❌ Tests failed"; exit 1; }

echo "✅ Smoke tests passed!"
```

---

## Version-Specific Notes

### v1.0.1 → v2.0.0 (When Released)

**Complexity**: High  
**Time**: 30-60 minutes  
**Risk**: Medium-High

**Key Changes**:
- Directory structure overhaul
- Cache relocation
- Cleanup script rewrite

**Recommendation**: Test thoroughly in dev/staging before production deployment.

### v0.x → v1.0.1

**Complexity**: Low  
**Time**: 15-20 minutes  
**Risk**: Low

**Key Changes**:
- Stable API established
- Documentation improvements
- No breaking changes

**Recommendation**: Safe upgrade, minimal risk.

---

## Getting Help

**Migration Issues?**

1. **Check Troubleshooting Guide**: `docs/guides/TROUBLESHOOTING.md`
2. **Review CHANGELOG**: `CHANGELOG.md` for version-specific notes
3. **Search Issues**: [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)
4. **Create New Issue**: Provide:
   - Current version
   - Target version
   - Migration steps attempted
   - Error messages
   - Config file (sanitized)

---

## Best Practices

### Version Pinning

**Production projects** should pin to specific versions:

```bash
# Pin to v1.0.1
cd .workflow_core && git checkout v1.0.1 && cd ..
git add .workflow_core
git commit -m "chore: pin ai_workflow_core to v1.0.1"
```

### Version Tracking

**Track version in development projects:**

```bash
# Track main branch (latest stable)
cd .workflow_core && git checkout main && cd ..
git config -f .gitmodules submodule.workflow_core.branch main
```

See `docs/guides/VERSION_MANAGEMENT.md` for complete strategies.

### Migration Scheduling

**Recommended schedule**:
- **Patch versions**: Upgrade within 1 week
- **Minor versions**: Upgrade within 1 month
- **Major versions**: Plan 2-4 weeks for testing and migration

---

## Recent Migration Origin Updates

### Source ai_workflow (Bash) - v4.0.0 (2026-02-08)

**Major Breaking Changes**:
- Configuration-driven step execution replaces hardcoded step numbers
- All 21 step files renamed to descriptive names:
  - Old: `step_01.sh`, `step_02.sh`, etc.
  - New: `documentation_updates.sh`, `context_analysis.sh`, etc.
- 8 library directories renamed for clarity
- Step registry system with YAML configuration (`config/steps_registry.yaml`)
- Dynamic step loader with topological sort for dependency resolution
- All orchestrators and optimization modules refactored

**Backward Compatibility**:
- 100% backward compatible via legacy mode
- Legacy step names still work via symlinks/aliases
- No forced migration required

**Impact on ai_workflow_core**:
- Core templates remain compatible
- Configuration schemas support both old and new naming
- Documentation references updated for clarity

### Migration Target ai_workflow.js (Node.js) - v1.3.0 (2026-02-09)

**Phase 8 Complete - Performance Optimization**:
- All 11 performance optimization modules implemented and tested
- 3,417 tests passing (18 skipped, 0 failures)
- Performance improvements: 40-85% faster with optimizations
- ML-driven predictive step skipping implemented

**Conditional Execution Strategy**:
- `scripts/analyze-change-impact.js` for intelligent CI/CD execution
- Four strategies: docs-only, unit-only, selective, run-all
- 40-60% CI/CD time reduction for low-impact changes

**Validation Scripts**:
- Export validation (`validate-exports.js`)
- Version consistency checks (`check-version-consistency.js`)
- Integrated into CI/CD pipeline

**Phase 9 Status**:
- In progress: Step Implementations (19 workflow steps)
- Aligned with source ai_workflow v4.0.0 naming conventions
- Incremental migration to config-driven execution

---

**Last Updated**: 2026-02-09  
**Document Version**: 1.1.0
