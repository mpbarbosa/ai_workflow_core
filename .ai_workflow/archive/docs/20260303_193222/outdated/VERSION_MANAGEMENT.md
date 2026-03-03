# Version Management Guide - AI Workflow Core

**Version:** 1.0.2  
**Last Updated:** 2026-01-29  
**Audience:** Developers integrating ai_workflow_core into dynamic codebases

---

## Table of Contents

- [Overview](#overview)
- [Versioning Strategy](#versioning-strategy)
- [Tracking Versions](#tracking-versions)
- [Updating Strategies](#updating-strategies)
- [Testing Updates](#testing-updates)
- [Rollback Procedures](#rollback-procedures)
- [Best Practices](#best-practices)

---

## Overview

When integrating `ai_workflow_core` as a Git submodule into live, dynamic codebases, proper version management is critical to maintain stability while benefiting from updates. This guide covers strategies for tracking, updating, and managing versions over time.

### Why Version Management Matters

- **Stability**: Pin to known-good versions in production
- **Predictability**: Avoid surprise breaking changes
- **Testing**: Validate updates before deploying
- **Rollback**: Quickly revert problematic updates
- **Documentation**: Track which version each project uses

---

## Versioning Strategy

### Semantic Versioning

`ai_workflow_core` follows [semantic versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- **MAJOR** (v2.0.0): Breaking changes requiring migration
- **MINOR** (v1.1.0): New features, backward-compatible
- **PATCH** (v1.0.2): Bug fixes, backward-compatible

### Version Tags

Check available versions:

```bash
cd .workflow_core
git fetch --tags
git tag -l
# Output: v1.0.2, v1.0.2, v1.1.0, etc.
```

### Release Branches

- `main` - Latest stable release
- `develop` - Active development (unstable)
- `v1.x` - Maintenance branch for v1.x releases

---

## Tracking Versions

### 1. Tag-Based Pinning (Recommended for Production)

Pin to specific release tags for maximum stability:

```bash
cd .workflow_core
git fetch --tags
git checkout v1.0.2
cd ..
git add .workflow_core
git commit -m "Pin ai_workflow_core to v1.0.2"
```

**Pros:**
- ✅ Maximum stability
- ✅ Explicit version control
- ✅ Easy rollback
- ✅ Clear dependency tracking

**Cons:**
- ❌ Manual updates required
- ❌ Miss incremental improvements
- ❌ Requires active monitoring for security updates

**Best for:** Production systems, critical applications, team projects

### 2. Branch Tracking (Recommended for Development)

Track a release branch to get compatible updates automatically:

```bash
cd .workflow_core
git checkout main
git pull origin main
cd ..
git add .workflow_core
git commit -m "Update ai_workflow_core to latest main"
```

Configure auto-update:

```bash
git config -f .gitmodules submodule.workflow_core.branch main
git config -f .gitmodules submodule.workflow_core.update rebase
```

Then update with:

```bash
git submodule update --remote .workflow_core
```

**Pros:**
- ✅ Automatic compatible updates
- ✅ Less maintenance overhead
- ✅ Stay current with fixes

**Cons:**
- ❌ Less predictable
- ❌ Potential for unexpected changes
- ❌ Requires thorough testing

**Best for:** Development environments, personal projects, early adopters

### 3. Commit-Based Pinning

Pin to specific commit (for testing pre-release features):

```bash
cd .workflow_core
git fetch
git checkout abc123def456  # Specific commit hash
cd ..
git add .workflow_core
git commit -m "Pin ai_workflow_core to commit abc123d (testing feature X)"
```

**Best for:** Testing unreleased features, contributing to ai_workflow_core

---

## Updating Strategies

### Strategy 1: Conservative Updates (Production)

**Update only for critical fixes or major features:**

1. **Monitor releases**: Watch GitHub releases/changelog
2. **Read changelog**: Review changes before updating
3. **Test in staging**: Update dev/staging environment first
4. **Validate integration**: Run tests and health checks
5. **Deploy to production**: After validation passes

**Timeline:** Quarterly or as-needed for security fixes

```bash
# 1. Check current version
cd .workflow_core && git describe --tags && cd ..

# 2. Review available updates
cd .workflow_core && git fetch --tags && git tag -l && cd ..

# 3. Read changelog
cd .workflow_core && git log --oneline v1.0.2..v1.1.0 && cd ..

# 4. Update in feature branch
git checkout -b update-workflow-core
cd .workflow_core
git checkout v1.1.0
cd ..
git add .workflow_core
git commit -m "Update ai_workflow_core from v1.0.2 to v1.1.0"

# 5. Test thoroughly
npm test  # or your test command

# 6. Merge after validation
git checkout main
git merge update-workflow-core
```

### Strategy 2: Regular Updates (Development)

**Stay current with latest features:**

1. **Weekly/monthly scheduled updates**
2. **Automated pull request creation**
3. **CI/CD validation**
4. **Quick review and merge**

**Timeline:** Weekly or bi-weekly

```bash
# Automated with GitHub Actions (see CI/CD section)
git submodule update --remote .workflow_core
git add .workflow_core
git commit -m "chore: update ai_workflow_core to latest"
```

### Strategy 3: Continuous Updates (Leading Edge)

**Track latest changes immediately:**

1. **Auto-update on every submodule change**
2. **Comprehensive automated testing**
3. **Rapid feedback loop**

**Timeline:** Continuous

**⚠️ Warning:** Only for projects with excellent test coverage and quick rollback capability.

---

## Testing Updates

### Pre-Update Checklist

Before updating the submodule:

- [ ] Read changelog/release notes
- [ ] Identify breaking changes
- [ ] Check migration guide if major version
- [ ] Create backup/feature branch
- [ ] Note current version for rollback

### Validation Steps

After updating:

```bash
# 1. Run integration health check
.workflow_core/scripts/check_integration_health.sh

# 2. Validate configuration
grep -r "{{" .workflow-config.yaml  # Check for new placeholders

# 3. Run tests
npm test  # or your test command

# 4. Run linter
npm run lint  # or your lint command

# 5. Check documentation
git diff .workflow_core/docs/

# 6. Verify directory structure
ls -la .ai_workflow/

# 7. Test workflow artifacts
# (Run actual workflow if available)
```

### Integration Testing

Create a test suite for integration validation:

```javascript
// tests/integration/workflow-core.test.js
const fs = require('fs');
const yaml = require('js-yaml');

describe('ai_workflow_core integration', () => {
  test('workflow config exists and is valid', () => {
    const config = yaml.load(fs.readFileSync('.workflow-config.yaml', 'utf8'));
    expect(config.project.name).toBeDefined();
    expect(config.project.name).not.toContain('{{');  // No placeholders
  });

  test('artifact directories exist', () => {
    expect(fs.existsSync('.ai_workflow/backlog')).toBe(true);
    expect(fs.existsSync('.ai_workflow/logs')).toBe(true);
    expect(fs.existsSync('.ai_workflow/metrics')).toBe(true);
  });

  test('submodule is at expected version', () => {
    // Implement version check
  });
});
```

---

## Rollback Procedures

### Quick Rollback

If an update causes issues:

```bash
# 1. Check commit history
git log --oneline -5

# 2. Revert the submodule update commit
git revert HEAD  # If last commit was the update

# Or reset to previous commit
git reset --hard HEAD~1

# 3. Update submodule to previous state
git submodule update --init --recursive

# 4. Verify
cd .workflow_core && git describe --tags && cd ..
```

### Targeted Rollback

Rollback just the submodule:

```bash
# 1. Find previous submodule commit
git log --oneline -- .workflow_core

# 2. Checkout previous version
cd .workflow_core
git checkout <previous-commit-hash>
cd ..

# 3. Commit the rollback
git add .workflow_core
git commit -m "Rollback ai_workflow_core to previous version"
```

### Emergency Rollback

For critical production issues:

```bash
# 1. Immediately revert to last known-good tag
cd .workflow_core
git fetch --tags
git checkout v1.0.2  # Known-good version
cd ..
git add .workflow_core
git commit -m "EMERGENCY: Rollback ai_workflow_core to v1.0.2"
git push

# 2. Deploy immediately

# 3. Investigate issue in dev environment
```

---

## Best Practices

### Document Your Version

Track the version in your project documentation:

```markdown
<!-- README.md -->
## Dependencies

- **ai_workflow_core**: v1.0.2 (pinned)
- Last updated: 2026-01-15
- Update policy: Quarterly review
```

### Maintain a Version Log

Keep a log of submodule updates:

```markdown
<!-- docs/WORKFLOW_CORE_UPDATES.md -->
# AI Workflow Core Update Log

## v1.1.0 (2026-01-29)
- Updated from v1.0.2
- Reason: New project kind support for TypeScript
- Testing: All tests passed
- Issues: None
- Rollback plan: Revert to v1.0.2 if issues arise

## v1.0.2 (2025-12-01)
- Initial integration
```

### Use Version Constraints in Documentation

In your project's integration guide:

```markdown
## Requirements

- ai_workflow_core: >= v1.0.2, < v2.0.0 (no breaking changes)
- Recommended: v1.1.0 or later for enhanced features
```

### Monitor for Security Updates

Set up notifications:

1. **Watch the repository**: Click "Watch" → "Custom" → "Releases" on GitHub
2. **GitHub Security Advisories**: Enable notifications
3. **RSS/Atom feeds**: Subscribe to release feed
4. **Automated tools**: Use Dependabot or Renovate (for GitHub Actions)

### Test Matrix for Updates

Maintain compatibility across versions:

```yaml
# .github/workflows/integration-test.yml
strategy:
  matrix:
    workflow_core_version: ['v1.0.2', 'v1.1.0', 'main']
```

### Version Compatibility Matrix

Document compatibility:

| Your Project | ai_workflow_core | Status | Notes |
|--------------|------------------|--------|-------|
| v2.0.0       | v1.0.2          | ✅ Supported | Stable |
| v2.0.0       | v1.1.0          | ✅ Supported | Recommended |
| v2.0.0       | v2.0.0          | ⚠️ Testing | Breaking changes |
| v1.x.x       | v1.0.2          | ✅ Supported | LTS |

---

## Advanced Patterns

### Multi-Project Version Management

If you maintain multiple projects using ai_workflow_core:

```bash
# Central version tracking script
# scripts/list-workflow-versions.sh

for project in project_a project_b project_c; do
  cd "$project/.workflow_core"
  version=$(git describe --tags 2>/dev/null || echo "unknown")
  echo "$project: $version"
  cd ../..
done
```

### Staged Rollout

Update projects progressively:

1. **Week 1**: Update dev environment
2. **Week 2**: Update staging (if stable)
3. **Week 3**: Update 10% of production instances
4. **Week 4**: Complete production rollout

### Automated Update PR

Use GitHub Actions to create update PRs automatically:

```yaml
# .github/workflows/update-submodule.yml
name: Update Submodule
on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday
  workflow_dispatch:  # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Update submodule
        run: |
          git submodule update --remote .workflow_core
          
      - name: Check for changes
        id: changes
        run: |
          git diff --quiet .workflow_core || echo "changed=true" >> $GITHUB_OUTPUT
          
      - name: Create Pull Request
        if: steps.changes.outputs.changed == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'chore: update ai_workflow_core submodule'
          body: |
            Automated submodule update
            
            Please review changelog and test before merging.
          branch: update-workflow-core
```

---

## Troubleshooting

### Issue: Detached HEAD after update

```bash
# Symptoms: Submodule shows detached HEAD
cd .workflow_core
git checkout main  # Or specific tag
cd ..
git add .workflow_core
git commit -m "Fix detached HEAD state"
```

### Issue: Merge conflicts in submodule

```bash
# Symptoms: Git reports submodule conflicts
git checkout --theirs .workflow_core  # Use their version
# OR
git checkout --ours .workflow_core    # Use our version

git submodule update --init --recursive
```

### Issue: Can't find expected version

```bash
# Update remote refs
cd .workflow_core
git fetch --tags --all
git tag -l  # List available tags
```

---

## Resources

- **Changelog**: [CHANGELOG.md](../../CHANGELOG.md)
- **Integration Guide**: [INTEGRATION.md](../INTEGRATION.md)
- **Best Practices**: [INTEGRATION_BEST_PRACTICES.md](./INTEGRATION_BEST_PRACTICES.md)
- **GitHub Releases**: https://github.com/mpbarbosa/ai_workflow_core/releases

---

**Last Updated:** 2026-01-29  
**Document Version:** 1.0.2
