# Deployment Guide

**Version**: 1.0.1  
**Last Updated**: 2026-02-13  
**Audience**: DevOps engineers, project maintainers, technical leads

> **Purpose**: Comprehensive guide to deploying and managing ai_workflow_core as a Git submodule in production environments.

## Table of Contents

- [Overview](#overview)
- [Deployment Models](#deployment-models)
- [Initial Setup](#initial-setup)
- [Version Management](#version-management)
- [Update Strategies](#update-strategies)
- [Multi-Repository Coordination](#multi-repository-coordination)
- [Rollback Procedures](#rollback-procedures)
- [Production Best Practices](#production-best-practices)
- [Security Considerations](#security-considerations)
- [Monitoring & Health Checks](#monitoring--health-checks)
- [Troubleshooting](#troubleshooting)

---

## Overview

### What is Being Deployed

ai_workflow_core is a **configuration and template library** deployed as a Git submodule. Deployment involves:

1. **Adding the submodule** to target projects
2. **Copying and customizing** configuration templates
3. **Managing submodule versions** across environments
4. **Coordinating updates** across multiple repositories
5. **Maintaining consistency** between projects

### Deployment vs. Integration

| Aspect | Integration | Deployment |
|--------|-------------|------------|
| **Scope** | Single repository setup | Multi-repo production rollout |
| **Audience** | Individual developers | DevOps teams, organizations |
| **Frequency** | Once per project | Ongoing version management |
| **Complexity** | Low | Medium to high |
| **Documentation** | [INTEGRATION.md](INTEGRATION.md) | This document |

---

## Deployment Models

### Model 1: Direct Submodule (Recommended)

**Use case**: Most projects, standard setup

```bash
# Add submodule to project
cd /path/to/your/project
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core

# Initialize and update
git submodule update --init --recursive

# Copy and customize config
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
```

**Pros**:
- Simple setup
- Direct version control
- Easy updates

**Cons**:
- Each repo manages its own version
- No centralized control

### Model 2: Forked Repository

**Use case**: Organizations needing custom modifications

```bash
# 1. Fork ai_workflow_core to your organization
# GitHub: Fork mpbarbosa/ai_workflow_core to myorg/ai_workflow_core

# 2. Add organizational customizations
cd myorg/ai_workflow_core
# Make custom changes to templates, configs

# 3. Projects use your fork
cd /path/to/your/project
git submodule add https://github.com/myorg/ai_workflow_core.git .workflow_core
```

**Pros**:
- Custom organizational templates
- Centralized control
- Can merge upstream updates

**Cons**:
- Maintenance overhead
- Sync with upstream required

### Model 3: Locked Version (Stable Releases Only)

**Use case**: Production environments requiring stability

```bash
# Add submodule pinned to specific tag
git submodule add -b v1.0.1 https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core

# Or pin to specific commit
cd .workflow_core
git checkout v1.0.1
cd ..
git add .workflow_core
git commit -m "Pin ai_workflow_core to v1.0.1"
```

**Pros**:
- Guaranteed stability
- Predictable behavior
- Controlled upgrades

**Cons**:
- Manual version updates
- May miss bug fixes

### Model 4: Shared Configuration Repository

**Use case**: Monorepos or tightly coupled projects

```
monorepo/
├── .workflow_core/           # Shared submodule
├── projects/
│   ├── api/
│   │   └── .workflow-config.yaml  # Symlinks to shared configs
│   ├── frontend/
│   │   └── .workflow-config.yaml
│   └── shared-configs/
│       ├── api-config.yaml
│       └── frontend-config.yaml
```

**Pros**:
- Single version across all projects
- Shared configuration patterns
- Simplified updates

**Cons**:
- Tight coupling
- All projects update together

---

## Initial Setup

### Prerequisites

- Git 2.13+ (for submodule improvements)
- Bash/sh shell access
- Repository write access
- Understanding of Git submodules

### Step-by-Step Deployment

#### 1. Plan Your Deployment

Create a deployment checklist:

```yaml
deployment_plan:
  target_projects:
    - name: "api-backend"
      priority: high
      project_kind: "nodejs_api"
    - name: "frontend"
      priority: medium
      project_kind: "react_spa"
    - name: "docs-site"
      priority: low
      project_kind: "static_website"
  
  version_strategy: "locked"  # locked | latest | fork
  rollout_approach: "phased"  # phased | all-at-once
  testing_required: true
  rollback_plan: true
```

#### 2. Add Submodule to First Project (Pilot)

```bash
# Choose a low-risk project for initial deployment
cd /path/to/pilot/project

# Add submodule
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core

# Lock to specific version (recommended for production)
cd .workflow_core
git checkout v1.0.1
cd ..

# Commit submodule addition
git add .gitmodules .workflow_core
git commit -m "chore: Add ai_workflow_core v1.0.1 submodule"
```

#### 3. Configure the Project

```bash
# Copy template
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Customize configuration
vim .workflow-config.yaml

# Replace placeholders:
# - {{PROJECT_NAME}} → "API Backend"
# - {{PROJECT_TYPE}} → "nodejs-application"
# - {{PROJECT_KIND}} → "nodejs_api"
# - {{VERSION}} → "2.1.0"
# - {{LANGUAGE}} → "javascript"
# etc.
```

#### 4. Create Artifact Directories

```bash
# Create standard directory structure
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# Update .gitignore
cat >> .gitignore << 'EOF'

# AI Workflow artifacts
.ai_workflow/
!.ai_workflow/.gitkeep
!.ai_workflow/prompts/
EOF
```

#### 5. Validate Setup

```bash
# Run validation if available
python3 .workflow_core/scripts/validate_structure.py

# Check submodule status
git submodule status

# Verify configuration
yamllint .workflow-config.yaml
```

#### 6. Test Integration

```bash
# Run project-specific tests
npm test  # for Node.js
pytest    # for Python
./tests/run_tests.sh  # for shell

# Verify no breaking changes
git diff --stat
```

#### 7. Deploy to Repository

```bash
# Commit all changes
git add .workflow-config.yaml .ai_workflow/ .gitignore
git commit -m "chore: Configure ai_workflow_core integration"

# Push to remote
git push origin main

# Tag successful deployment
git tag -a deploy/ai-workflow-v1.0.1 -m "Successfully deployed ai_workflow_core v1.0.1"
git push origin deploy/ai-workflow-v1.0.1
```

---

## Version Management

### Semantic Versioning

ai_workflow_core follows [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR** (1.x.x): Breaking changes, incompatible API changes
- **MINOR** (x.1.x): New features, backward-compatible
- **PATCH** (x.x.1): Bug fixes, backward-compatible

### Version Pinning Strategies

#### Strategy 1: Pin to Major Version (Flexible)

```bash
# Allow minor and patch updates
cd .workflow_core
git checkout v1
```

**Use when**: Development environments, rapid iteration

#### Strategy 2: Pin to Minor Version (Balanced)

```bash
# Allow patch updates only
cd .workflow_core
git checkout v1.0
```

**Use when**: Staging environments, moderate stability needs

#### Strategy 3: Pin to Exact Version (Strict)

```bash
# Lock to specific version
cd .workflow_core
git checkout v1.0.1
```

**Use when**: Production environments, maximum stability

#### Strategy 4: Track Latest (Risky)

```bash
# Always use latest commit
cd .workflow_core
git checkout main
git pull origin main
```

**Use when**: Internal testing, early adopters (NOT recommended for production)

### Checking Current Version

```bash
# Method 1: Git describe
cd .workflow_core
git describe --tags --exact-match 2>/dev/null || git rev-parse --short HEAD

# Method 2: Check CHANGELOG
cat .workflow_core/CHANGELOG.md | head -20

# Method 3: Submodule status
git submodule status .workflow_core
```

### Version Upgrade Checklist

Before upgrading ai_workflow_core version:

- [ ] Review [CHANGELOG.md](../CHANGELOG.md) for breaking changes
- [ ] Check [MIGRATION_GUIDE.md](guides/MIGRATION_GUIDE.md) for upgrade steps
- [ ] Test in non-production environment first
- [ ] Backup current configuration
- [ ] Document current version (for rollback)
- [ ] Update one project at a time (phased rollout)
- [ ] Monitor for issues after upgrade
- [ ] Update documentation to reflect changes

---

## Update Strategies

### Manual Update Process

```bash
# 1. Check current version
cd .workflow_core
git describe --tags

# 2. Fetch latest changes
git fetch origin --tags

# 3. Review available versions
git tag -l "v*"

# 4. Review changes
git log --oneline $(git describe --tags --abbrev=0)..v1.1.0

# 5. Update to new version
git checkout v1.1.0
cd ..

# 6. Update configuration if needed
diff .workflow-config.yaml .workflow_core/config/.workflow-config.yaml.template

# 7. Commit update
git add .workflow_core
git commit -m "chore: Update ai_workflow_core to v1.1.0"
```

### Automated Update with Script

Create `scripts/update-workflow-core.sh`:

```bash
#!/bin/bash
set -e

CURRENT_VERSION=$(cd .workflow_core && git describe --tags --exact-match 2>/dev/null || echo "unknown")
TARGET_VERSION=${1:-"latest"}

echo "Current version: $CURRENT_VERSION"
echo "Target version: $TARGET_VERSION"

# Fetch updates
cd .workflow_core
git fetch origin --tags

# Checkout target
if [ "$TARGET_VERSION" = "latest" ]; then
  LATEST_TAG=$(git describe --tags "$(git rev-list --tags --max-count=1)")
  git checkout "$LATEST_TAG"
else
  git checkout "$TARGET_VERSION"
fi

cd ..

echo "✅ Updated to $(cd .workflow_core && git describe --tags)"
echo "⚠️  Review changes and update .workflow-config.yaml if needed"
echo "Run: git diff .workflow-config.yaml .workflow_core/config/.workflow-config.yaml.template"
```

Usage:

```bash
# Update to latest
./scripts/update-workflow-core.sh

# Update to specific version
./scripts/update-workflow-core.sh v1.1.0
```

### CI/CD Automated Updates

Add to `.github/workflows/update-workflow-core.yml`:

```yaml
name: Check ai_workflow_core Updates

on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday
  workflow_dispatch:

jobs:
  check-updates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Check for updates
        id: check
        run: |
          cd .workflow_core
          git fetch origin --tags
          CURRENT=$(git describe --tags --exact-match 2>/dev/null || echo "unknown")
          LATEST=$(git describe --tags "$(git rev-list --tags --max-count=1)")
          echo "current=$CURRENT" >> $GITHUB_OUTPUT
          echo "latest=$LATEST" >> $GITHUB_OUTPUT
          
          if [ "$CURRENT" != "$LATEST" ]; then
            echo "update_available=true" >> $GITHUB_OUTPUT
          fi
      
      - name: Create update PR
        if: steps.check.outputs.update_available == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          title: "chore: Update ai_workflow_core to ${{ steps.check.outputs.latest }}"
          body: |
            Automated update of ai_workflow_core submodule.
            
            **Current version**: ${{ steps.check.outputs.current }}
            **New version**: ${{ steps.check.outputs.latest }}
            
            Please review [CHANGELOG](https://github.com/mpbarbosa/ai_workflow_core/blob/main/CHANGELOG.md) for breaking changes.
          branch: update/workflow-core-${{ steps.check.outputs.latest }}
```

---

## Multi-Repository Coordination

### Strategy 1: Centralized Update Script

Create organization-level script:

```bash
#!/bin/bash
# scripts/org-update-workflow-core.sh

REPOS=(
  "github.com/myorg/api-backend"
  "github.com/myorg/frontend"
  "github.com/myorg/mobile-app"
)

TARGET_VERSION=${1:-"v1.0.1"}

for repo in "${REPOS[@]}"; do
  echo "Updating $repo..."
  
  # Clone if not exists
  repo_name=$(basename "$repo")
  if [ ! -d "$repo_name" ]; then
    git clone "https://$repo" "$repo_name"
  fi
  
  cd "$repo_name"
  
  # Update submodule
  cd .workflow_core
  git fetch origin --tags
  git checkout "$TARGET_VERSION"
  cd ../..
  
  # Commit and push
  cd "$repo_name"
  git add .workflow_core
  git commit -m "chore: Update ai_workflow_core to $TARGET_VERSION"
  git push origin main
  cd ..
  
  echo "✅ Updated $repo"
done
```

### Strategy 2: Dependency Management

Create `workflow-core-versions.json`:

```json
{
  "version": "1.0.1",
  "projects": {
    "api-backend": {
      "repo": "github.com/myorg/api-backend",
      "version": "1.0.1",
      "status": "deployed",
      "last_updated": "2026-02-13T10:00:00Z"
    },
    "frontend": {
      "repo": "github.com/myorg/frontend",
      "version": "1.0.1",
      "status": "deployed",
      "last_updated": "2026-02-13T10:15:00Z"
    },
    "mobile-app": {
      "repo": "github.com/myorg/mobile-app",
      "version": "0.9.5",
      "status": "pending",
      "last_updated": "2026-01-20T14:30:00Z"
    }
  }
}
```

### Strategy 3: Phased Rollout

```yaml
# deployment-phases.yaml
phases:
  - name: "Phase 1: Pilot"
    projects: ["internal-tool"]
    duration_days: 7
    success_criteria:
      - "No critical issues"
      - "Team feedback positive"
  
  - name: "Phase 2: Non-Critical"
    projects: ["docs-site", "monitoring-dashboard"]
    duration_days: 14
    success_criteria:
      - "No production incidents"
      - "Performance maintained"
  
  - name: "Phase 3: Production"
    projects: ["api-backend", "frontend"]
    duration_days: 30
    success_criteria:
      - "All tests passing"
      - "Zero downtime"
  
  - name: "Phase 4: Complete"
    projects: ["all-remaining"]
    duration_days: 30
```

---

## Rollback Procedures

### Quick Rollback

```bash
# 1. Check current commit
cd .workflow_core
git log --oneline -5

# 2. Identify rollback target
# Example: Rolling back from v1.1.0 to v1.0.1
git checkout v1.0.1

cd ..

# 3. Commit rollback
git add .workflow_core
git commit -m "fix: Rollback ai_workflow_core to v1.0.1 due to [issue]"

# 4. Push
git push origin main
```

### Full Rollback with Configuration Restore

```bash
# 1. Backup current state
git branch backup/before-rollback-$(date +%Y%m%d)

# 2. Find commit before problematic update
git log --all --grep="ai_workflow_core" --oneline

# 3. Restore previous state
git checkout <commit-hash> -- .workflow_core .workflow-config.yaml

# 4. Verify
git diff --cached

# 5. Commit
git commit -m "fix: Rollback ai_workflow_core integration to previous state"
```

### Rollback Testing

Before rolling back in production:

```bash
# 1. Create test branch
git checkout -b test/rollback-workflow-core

# 2. Perform rollback
cd .workflow_core
git checkout v1.0.1
cd ..

# 3. Test thoroughly
npm test  # or appropriate test command

# 4. If tests pass, apply to main
git checkout main
git merge test/rollback-workflow-core
```

---

## Production Best Practices

### 1. Version Pinning

✅ **DO**:
- Pin to specific tags in production
- Test version updates in staging first
- Document version in deployment notes

❌ **DON'T**:
- Use `main` branch in production
- Auto-update without testing
- Skip version documentation

### 2. Change Management

```yaml
# Example: .workflow-core-version.yaml
version: "1.0.1"
deployed_by: "devops-team"
deployed_at: "2026-02-13T10:00:00Z"
environment: "production"
approval_ticket: "OPS-1234"
rollback_tested: true
notes: |
  Initial deployment of ai_workflow_core.
  All tests passing in staging for 2 weeks.
```

### 3. Monitoring

Track these metrics:

- **Submodule version** across all repositories
- **Configuration drift** between projects
- **Update success rate**
- **Rollback frequency**
- **Time to deploy updates**

### 4. Documentation

Maintain:

- **Deployment log**: Record of all version changes
- **Configuration registry**: All project configurations
- **Incident reports**: Issues encountered and resolutions
- **Runbooks**: Step-by-step operational procedures

### 5. Access Control

```bash
# .github/CODEOWNERS
/.workflow_core/ @devops-team @platform-team
/.workflow-config.yaml @devops-team @project-team
```

### 6. Backup Strategy

```bash
# Automated backup script
#!/bin/bash
# scripts/backup-workflow-config.sh

BACKUP_DIR=".workflow_backups"
mkdir -p "$BACKUP_DIR"

cp .workflow-config.yaml "$BACKUP_DIR/workflow-config-$(date +%Y%m%d-%H%M%S).yaml"
cd .workflow_core
git describe --tags > "../$BACKUP_DIR/version-$(date +%Y%m%d-%H%M%S).txt"

# Keep last 10 backups
ls -t "$BACKUP_DIR"/workflow-config-* | tail -n +11 | xargs rm -f
```

---

## Security Considerations

### Submodule Source Verification

```bash
# Verify submodule URL
git config --get submodule..workflow_core.url

# Expected: https://github.com/mpbarbosa/ai_workflow_core.git

# Check for tampering
cd .workflow_core
git verify-tag v1.0.1  # If tags are signed
```

### Secrets Management

⚠️ **CRITICAL**: Never commit secrets to `.workflow-config.yaml`

```yaml
# ❌ BAD - Don't do this
api_keys:
  github_token: "ghp_abc123..."

# ✅ GOOD - Use environment variables or secrets managers
api_keys:
  github_token: "${GITHUB_TOKEN}"  # Loaded from environment
```

### Configuration Validation

```bash
# Validate config before deployment
python3 -c "
import yaml
import sys

with open('.workflow-config.yaml', 'r') as f:
    config = yaml.safe_load(f)

# Check for potential secrets
dangerous_keys = ['token', 'password', 'secret', 'key']
for key in dangerous_keys:
    if any(key in str(v).lower() for v in config.values()):
        print(f'⚠️  Warning: Config may contain secrets ({key})')
        sys.exit(1)

print('✅ Config validation passed')
"
```

### Access Logging

```bash
# Track who updates the submodule
git log --all --grep="workflow_core" --pretty=format:"%h %an %ad %s"
```

---

## Monitoring & Health Checks

### Version Consistency Check

```bash
#!/bin/bash
# scripts/check-workflow-versions.sh

REPOS=(
  "/path/to/repo1"
  "/path/to/repo2"
  "/path/to/repo3"
)

echo "Checking ai_workflow_core versions across repositories..."

for repo in "${REPOS[@]}"; do
  if [ -d "$repo/.workflow_core" ]; then
    version=$(cd "$repo/.workflow_core" && git describe --tags --exact-match 2>/dev/null || echo "unknown")
    echo "$repo: $version"
  else
    echo "$repo: ❌ NOT INSTALLED"
  fi
done
```

### Configuration Drift Detection

```bash
#!/bin/bash
# scripts/detect-config-drift.sh

# Compare all project configs against baseline
BASELINE="baseline-config.yaml"

for config in projects/*/.workflow-config.yaml; do
  project=$(dirname "$config")
  
  # Compare critical fields
  diff_output=$(diff -u <(grep "^project:" -A10 "$BASELINE") \
                        <(grep "^project:" -A10 "$config") || true)
  
  if [ -n "$diff_output" ]; then
    echo "⚠️  Drift detected in $project"
    echo "$diff_output"
  fi
done
```

### Health Check Integration

```yaml
# .github/workflows/workflow-core-health.yml
name: AI Workflow Core Health Check

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Verify submodule
        run: |
          cd .workflow_core
          VERSION=$(git describe --tags --exact-match 2>/dev/null || echo "unknown")
          echo "::notice::Current version: $VERSION"
          
          # Check if outdated
          git fetch origin --tags
          LATEST=$(git describe --tags "$(git rev-list --tags --max-count=1)")
          
          if [ "$VERSION" != "$LATEST" ]; then
            echo "::warning::Outdated version: $VERSION (latest: $LATEST)"
          fi
      
      - name: Validate configuration
        run: |
          yamllint .workflow-config.yaml
          python3 .workflow_core/scripts/validate_structure.py
```

---

## Troubleshooting

### Common Issues

#### Issue 1: Submodule Not Initialized

**Symptom**: Empty `.workflow_core` directory

**Solution**:
```bash
git submodule update --init --recursive
```

#### Issue 2: Detached HEAD State

**Symptom**: `git submodule status` shows `-` prefix

**Solution**:
```bash
cd .workflow_core
git checkout v1.0.1  # or desired version
cd ..
git add .workflow_core
git commit -m "fix: Lock workflow_core to v1.0.1"
```

#### Issue 3: Submodule Update Conflicts

**Symptom**: Merge conflicts in `.gitmodules` or `.workflow_core`

**Solution**:
```bash
# Accept incoming submodule pointer
git checkout --theirs .workflow_core
git add .workflow_core

# Or accept current
git checkout --ours .workflow_core
git add .workflow_core

git commit
```

#### Issue 4: Authentication Issues

**Symptom**: `git submodule update` fails with authentication error

**Solution**:
```bash
# Use HTTPS instead of SSH
git config submodule..workflow_core.url https://github.com/mpbarbosa/ai_workflow_core.git

# Or configure SSH keys
ssh-add ~/.ssh/id_rsa
git submodule update
```

#### Issue 5: Version Mismatch Across Environments

**Symptom**: Different versions in dev/staging/prod

**Solution**:
```bash
# Standardize across environments
for env in dev staging prod; do
  ssh $env "cd /path/to/project && \
    cd .workflow_core && \
    git fetch origin --tags && \
    git checkout v1.0.1 && \
    cd .. && \
    git add .workflow_core && \
    git commit -m 'chore: Standardize workflow_core to v1.0.1'"
done
```

### Debugging Commands

```bash
# Check submodule status
git submodule status --recursive

# Show submodule configuration
git config --list | grep submodule

# Verify submodule integrity
git submodule foreach 'git fsck'

# Show submodule history
git log --all -- .workflow_core

# Compare configurations
diff -u .workflow-config.yaml .workflow_core/config/.workflow-config.yaml.template
```

---

## Next Steps

After successful deployment:

1. **Monitor**: Track version consistency and configuration drift
2. **Document**: Update internal runbooks with your specific procedures
3. **Train**: Ensure team understands update and rollback procedures
4. **Automate**: Implement CI/CD workflows for automated updates
5. **Review**: Schedule quarterly reviews of deployment strategy

## Related Documentation

- **[INTEGRATION.md](INTEGRATION.md)**: Initial setup guide
- **[VERSION_MANAGEMENT.md](guides/VERSION_MANAGEMENT.md)**: Detailed versioning strategies
- **[MIGRATION_GUIDE.md](guides/MIGRATION_GUIDE.md)**: Upgrade procedures
- **[SECURITY.md](SECURITY.md)**: Security best practices
- **[TROUBLESHOOTING.md](guides/TROUBLESHOOTING.md)**: Issue resolution

---

**Last Updated**: 2026-02-13  
**Document Version**: 1.0.1  
**Maintainers**: DevOps Team, Platform Engineering
