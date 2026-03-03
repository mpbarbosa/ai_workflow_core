# Integration Best Practices for Dynamic Codebases

**Version:** 1.0.2  
**Last Updated:** 2026-01-29  
**For:** Projects using ai_workflow_core with frequently changing source code

---

## Table of Contents

- [Overview](#overview)
- [Integration Lifecycle](#integration-lifecycle)
- [Configuration Management](#configuration-management)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Team Collaboration](#team-collaboration)
- [Automation Patterns](#automation-patterns)
- [Common Pitfalls](#common-pitfalls)

---

## Overview

Dynamic codebases with frequent commits, feature development, and dependency updates require thoughtful integration strategies for git submodules. This guide provides battle-tested practices for maintaining healthy ai_workflow_core integrations over time.

### Key Principles

1. **Treat submodules as dependencies** - Version them like npm packages or pip requirements
2. **Test before updating** - Never update submodules without validation
3. **Document integration state** - Track versions, changes, and decisions
4. **Automate health checks** - Don't rely on manual verification
5. **Plan for rollback** - Always have an escape route

---

## Integration Lifecycle

### Phase 1: Initial Integration (Day 0)

**Checklist:**

- [ ] Add submodule and pin to specific stable version
- [ ] Copy and fully customize configuration (no placeholders)
- [ ] Create all artifact directories
- [ ] Configure .gitignore properly
- [ ] Run health check script
- [ ] Document integration in project README
- [ ] Create integration test suite
- [ ] Set up monitoring/notifications for updates

**Example integration documentation:**

```markdown
## Workflow Integration

- **Submodule**: ai_workflow_core v1.0.2
- **Location**: `.workflow_core/`
- **Config**: `.workflow-config.yaml`
- **Artifacts**: `.ai_workflow/` (gitignored)
- **Health Check**: `bash .workflow_core/scripts/check_integration_health.sh`
- **Update Policy**: Quarterly review, security patches as-needed
- **Owner**: @devops-team
- **Last Updated**: 2026-01-29
```

### Phase 2: Stabilization (Weeks 1-4)

**Goals:**
- Validate integration works in real workflows
- Identify configuration gaps
- Establish monitoring baseline

**Activities:**

```bash
# Week 1: Smoke testing
npm test
npm run lint
bash .workflow_core/scripts/check_integration_health.sh

# Week 2: Monitor for issues
git log --oneline .workflow_core  # Should show no unexpected changes
grep -r "{{" .workflow-config.yaml  # Should return nothing

# Week 3: Establish baseline metrics
# Document current version, test coverage, lint results

# Week 4: Create playbook for common operations
# Document how to update, troubleshoot, rollback
```

### Phase 3: Maintenance (Ongoing)

**Regular Activities:**

| Frequency | Activity | Command |
|-----------|----------|---------|
| Weekly | Health check | `bash .workflow_core/scripts/check_integration_health.sh` |
| Monthly | Review for updates | Check GitHub releases |
| Quarterly | Update submodule | Follow version management guide |
| As-needed | Security patches | Update immediately |
| Before releases | Verify integration | Full test suite |

### Phase 4: Evolution (Long-term)

**Adaptation strategies:**

- **New features**: Evaluate if new submodule features benefit your project
- **Breaking changes**: Plan migration sprints for major version updates
- **Configuration drift**: Periodically review config against template updates
- **Team changes**: Update documentation and ownership

---

## Configuration Management

### Configuration as Code

Treat `.workflow-config.yaml` like application code:

```yaml
# .workflow-config.yaml
# Version: 1.0.2
# Last Updated: 2026-01-29
# Owner: DevOps Team

project:
  name: "My Dynamic Project"
  type: "nodejs-application"
  description: "Fast-paced web application"
  kind: "web_application"
  version: "2.5.3"
  
  # Metadata for tracking
  workflow_core_version: "v1.0.2"  # Add this!
  workflow_core_updated: "2026-01-15"  # Add this!

tech_stack:
  primary_language: "javascript"
  build_system: "npm"
  test_framework: "jest"
  test_command: "npm test"
  lint_command: "eslint ."
  
  # Validation - add this!
  test_timeout: 30000
  coverage_threshold: 80
```

### Configuration Validation

Create a validation script:

```javascript
// scripts/validate-workflow-config.js
const fs = require('fs');
const yaml = require('js-yaml');

function validateConfig() {
  const config = yaml.load(fs.readFileSync('.workflow-config.yaml', 'utf8'));
  
  // Check for placeholders
  const configStr = JSON.stringify(config);
  if (configStr.includes('{{')) {
    throw new Error('Configuration contains unreplaced placeholders');
  }
  
  // Check required fields
  const required = [
    'project.name',
    'project.type',
    'tech_stack.primary_language',
    'tech_stack.test_command'
  ];
  
  for (const field of required) {
    const value = field.split('.').reduce((obj, key) => obj?.[key], config);
    if (!value) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Check version format
  if (!/^\d+\.\d+\.\d+$/.test(config.project.version)) {
    throw new Error('Invalid version format (should be semver)');
  }
  
  console.log('✓ Configuration is valid');
}

validateConfig();
```

Add to `package.json`:

```json
{
  "scripts": {
    "validate:config": "node scripts/validate-workflow-config.js",
    "pretest": "npm run validate:config"
  }
}
```

### Configuration Drift Detection

Detect when your config deviates from template:

```bash
#!/bin/bash
# scripts/check-config-drift.sh

echo "Checking for configuration drift..."

# Get template from submodule
TEMPLATE=".workflow_core/config/.workflow-config.yaml.template"
CONFIG=".workflow-config.yaml"

# Extract structure (keys only)
get_structure() {
  grep -E '^[a-z_]+:' "$1" | sort
}

TEMPLATE_STRUCTURE=$(get_structure "$TEMPLATE")
CONFIG_STRUCTURE=$(get_structure "$CONFIG")

if [[ "$TEMPLATE_STRUCTURE" != "$CONFIG_STRUCTURE" ]]; then
  echo "⚠️ Configuration structure has drifted from template"
  echo "New keys may be available in the template"
  echo ""
  echo "Run: diff <(grep -E '^[a-z_]+:' $TEMPLATE | sort) <(grep -E '^[a-z_]+:' $CONFIG | sort)"
else
  echo "✓ Configuration structure matches template"
fi
```

---

## Monitoring and Maintenance

### Automated Health Checks

Add to CI/CD pipeline:

```yaml
# .github/workflows/integration-health.yml
name: Integration Health Check

on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Run health check
        run: |
          bash .workflow_core/scripts/check_integration_health.sh
      
      - name: Validate configuration
        run: |
          npm run validate:config
      
      - name: Check for config drift
        run: |
          bash scripts/check-config-drift.sh
```

### Monitoring Dashboard

Track integration health metrics:

```javascript
// scripts/integration-metrics.js
const fs = require('fs');
const yaml = require('js-yaml');
const { execSync } = require('child_process');

function getMetrics() {
  const config = yaml.load(fs.readFileSync('.workflow-config.yaml', 'utf8'));
  
  // Get submodule info
  const submoduleCommit = execSync('cd .workflow_core && git rev-parse HEAD')
    .toString().trim();
  const submoduleVersion = execSync('cd .workflow_core && git describe --tags 2>/dev/null || echo "unknown"')
    .toString().trim();
  
  // Get last update time
  const lastUpdate = execSync('git log -1 --format=%ci .workflow_core')
    .toString().trim();
  
  return {
    timestamp: new Date().toISOString(),
    project: config.project.name,
    version: config.project.version,
    submodule: {
      version: submoduleVersion,
      commit: submoduleCommit.substring(0, 8),
      lastUpdate: lastUpdate
    },
    health: {
      configValid: true,  // From validation
      directoriesExist: true,  // From health check
      gitignoreConfigured: true
    }
  };
}

console.log(JSON.stringify(getMetrics(), null, 2));
```

### Alert Configuration

Set up alerts for critical events:

1. **Submodule update available**: Weekly notification
2. **Security advisory**: Immediate notification
3. **Health check failure**: Immediate alert
4. **Configuration drift**: Monthly report

---

## Team Collaboration

### Submodule Update Protocol

**For individual developers:**

```bash
# 1. Check current state
cd .workflow_core && git describe --tags && cd ..

# 2. Review proposed update
cd .workflow_core && git log --oneline HEAD..origin/main && cd ..

# 3. Create feature branch
git checkout -b update-workflow-core

# 4. Update submodule
cd .workflow_core && git pull origin main && cd ..

# 5. Run full test suite
npm test
bash .workflow_core/scripts/check_integration_health.sh

# 6. Create PR (don't push to main directly)
git add .workflow_core
git commit -m "chore: update ai_workflow_core to <version>"
git push origin update-workflow-core
```

**For PR reviewers:**

- [ ] Check submodule version change is intentional
- [ ] Review changelog for breaking changes
- [ ] Verify tests pass
- [ ] Check health check passes
- [ ] Confirm configuration is still valid
- [ ] Ask: "Why this update now?"

### Communication Templates

**When proposing submodule update:**

```markdown
## PR: Update ai_workflow_core

### Current Version
v1.0.2 (commit abc123d)

### New Version
v1.1.0 (commit def456e)

### Changes
- Feature: New project kind for TypeScript
- Fix: Improved error messages in validation
- Docs: Added version management guide

### Breaking Changes
None

### Testing
- ✅ All tests pass
- ✅ Health check passes
- ✅ Configuration validated
- ✅ Tested in local development

### Rollback Plan
If issues arise: `git revert <commit>` or checkout v1.0.2

### Related Issues
Closes #123
```

### Documentation Updates

When updating submodule, update:

1. **README.md** - Dependency version
2. **CHANGELOG.md** - Note the submodule update
3. **docs/INTEGRATION.md** - If integration steps changed
4. **Internal wiki** - Team knowledge base

---

## Automation Patterns

### Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "gitsubmodule"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "submodule"
    reviewers:
      - "devops-team"
    commit-message:
      prefix: "chore"
      include: "scope"
```

### Auto-Update with Safeguards

```yaml
# .github/workflows/auto-update-submodule.yml
name: Auto-Update Submodule

on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Update submodule
        id: update
        run: |
          cd .workflow_core
          OLD_VERSION=$(git describe --tags)
          git pull origin main
          NEW_VERSION=$(git describe --tags)
          cd ..
          
          echo "old=$OLD_VERSION" >> $GITHUB_OUTPUT
          echo "new=$NEW_VERSION" >> $GITHUB_OUTPUT
          
          if git diff --quiet .workflow_core; then
            echo "changed=false" >> $GITHUB_OUTPUT
          else
            echo "changed=true" >> $GITHUB_OUTPUT
          fi
      
      - name: Run health check
        if: steps.update.outputs.changed == 'true'
        run: |
          bash .workflow_core/scripts/check_integration_health.sh
      
      - name: Run tests
        if: steps.update.outputs.changed == 'true'
        run: |
          npm ci
          npm test
      
      - name: Create PR
        if: steps.update.outputs.changed == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'chore: update ai_workflow_core ${{ steps.update.outputs.old }} → ${{ steps.update.outputs.new }}'
          body: |
            Automated submodule update
            
            **Old Version**: ${{ steps.update.outputs.old }}
            **New Version**: ${{ steps.update.outputs.new }}
            
            ✅ Health check passed
            ✅ Tests passed
            
            Please review changelog before merging.
          branch: auto-update-workflow-core
          labels: dependencies,automated
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check if submodule reference is being committed
if git diff --cached --name-only | grep -q "^.workflow_core$"; then
  echo "🔍 Submodule update detected, running health check..."
  bash .workflow_core/scripts/check_integration_health.sh || exit 1
fi
```

---

## Common Pitfalls

### Pitfall 1: Forgetting to Update Submodule After Clone

**Problem:**
```bash
git clone my-repo
cd my-repo
# .workflow_core is empty!
```

**Solution:**
```bash
git clone --recurse-submodules my-repo
# OR after clone:
git submodule update --init --recursive
```

**Prevention:** Add to README.md:
```markdown
## Setup

```bash
git clone --recurse-submodules <repo-url>
cd <repo>
npm install
```
```

### Pitfall 2: Committing Detached HEAD State

**Problem:**
```bash
cd .workflow_core
git checkout abc123d  # specific commit
cd ..
git add .workflow_core
git commit -m "Update submodule"
# Now everyone gets detached HEAD!
```

**Solution:**
```bash
cd .workflow_core
git checkout v1.0.2  # Use tag or branch
cd ..
git add .workflow_core
git commit -m "Pin to v1.0.2"
```

### Pitfall 3: Modifying Submodule Files Directly

**Problem:**
```bash
# Developer edits .workflow_core/config/something.yaml
# Changes get lost on next submodule update
```

**Solution:**
- **Never** edit files in `.workflow_core/`
- Copy templates out and customize in project root
- If you need changes, contribute to ai_workflow_core repo

### Pitfall 4: Ignoring Submodule in Diffs

**Problem:**
```bash
git diff  # Doesn't show what changed in submodule
```

**Solution:**
```bash
# Configure git to show submodule changes
git config --global diff.submodule log

# Or for this repo only:
git config diff.submodule log

# Now git diff shows submodule commit changes
```

### Pitfall 5: Merge Conflicts in Submodule

**Problem:**
```bash
git merge feature-branch
# Conflict in .workflow_core!
```

**Solution:**
```bash
# Accept one version
git checkout --theirs .workflow_core  # OR --ours

# Update submodule
git submodule update --init --recursive

# Complete merge
git add .workflow_core
git commit
```

### Pitfall 6: Forgetting to Push Submodule Reference

**Problem:**
```bash
git push  # Only pushes parent repo
# Team can't see submodule update
```

**Solution:**
```bash
# Push with submodule check
git push --recurse-submodules=check

# Or set as default:
git config push.recurseSubmodules check
```

---

## Emergency Procedures

### Emergency Rollback

If production is broken due to submodule update:

```bash
# 1. Immediately revert to last known-good commit
git log --oneline -10  # Find last good commit
git revert <commit-hash>
git push

# 2. Verify submodule is at old version
cd .workflow_core && git describe --tags && cd ..

# 3. Deploy immediately

# 4. Post-mortem in dev environment
```

### Lost Submodule State

If submodule gets into weird state:

```bash
# Nuclear option: remove and re-add
git rm -f .workflow_core
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
cd .workflow_core && git checkout v1.0.2 && cd ..
git add .workflow_core .gitmodules
git commit -m "Reset submodule to clean state"
```

---

## Checklists

### Weekly Maintenance Checklist

- [ ] Run health check: `bash .workflow_core/scripts/check_integration_health.sh`
- [ ] Check for updates: Review GitHub releases
- [ ] Verify tests still pass
- [ ] Check artifact directory sizes (clean if needed)

### Monthly Review Checklist

- [ ] Review submodule version (consider updates)
- [ ] Check configuration drift
- [ ] Review integration metrics
- [ ] Update documentation if needed
- [ ] Clean up old artifacts

### Before Release Checklist

- [ ] Verify submodule is at stable version (not branch)
- [ ] Run full test suite
- [ ] Run health check with `--fix`
- [ ] Document which submodule version is in release
- [ ] Tag release with submodule version in notes

---

## Resources

- **Version Management**: [VERSION_MANAGEMENT.md](./VERSION_MANAGEMENT.md)
- **Integration Guide**: [INTEGRATION.md](../INTEGRATION.md)
- **Health Check Script**: [check_integration_health.sh](../../scripts/check_integration_health.sh.template)
- **Git Submodule Docs**: https://git-scm.com/book/en/v2/Git-Tools-Submodules

---

**Last Updated:** 2026-01-29  
**Document Version:** 1.0.2
