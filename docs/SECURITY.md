# Security Best Practices

**Version**: 1.0.2  
**Last Updated**: 2026-02-07  
**Audience**: All users, security-conscious developers

> **Purpose**: Security guidelines and best practices for using ai_workflow_core safely in your projects.

---

## Table of Contents

1. [Overview](#overview)
2. [Configuration Security](#configuration-security)
3. [Secrets Management](#secrets-management)
4. [Submodule Security](#submodule-security)
5. [CI/CD Security](#cicd-security)
6. [File Permissions](#file-permissions)
7. [Dependency Security](#dependency-security)
8. [Common Security Pitfalls](#common-security-pitfalls)
9. [Security Checklist](#security-checklist)
10. [Incident Response](#incident-response)

---

## Overview

### Security Principles

ai_workflow_core follows these security principles:

🔒 **Least Privilege**: Only grant minimum necessary permissions  
🔒 **Defense in Depth**: Multiple layers of security controls  
🔒 **No Secrets in Code**: Never commit credentials or secrets  
🔒 **Secure Defaults**: Templates use secure configurations by default  
🔒 **Transparency**: Open source allows security auditing

### Threat Model

**What ai_workflow_core protects against**:
- ✅ Accidental credential exposure
- ✅ Malicious submodule tampering
- ✅ Configuration injection attacks
- ✅ Unauthorized file access

**What ai_workflow_core does NOT protect against**:
- ❌ Vulnerabilities in your application code
- ❌ Compromised developer machines
- ❌ Social engineering attacks
- ❌ Infrastructure-level attacks

---

## Configuration Security

### Sensitive Data in Configuration

**❌ Never put these in `.workflow-config.yaml`:**

```yaml
# ❌ DON'T DO THIS
ci_cd:
  github:
    token: "ghp_abc123..."  # ❌ Secret exposed
  aws:
    access_key: "AKIA..."   # ❌ Credentials exposed
  database:
    password: "mypassword"  # ❌ Password exposed
```

**✅ Instead, use environment variables and secrets:**

```yaml
# ✅ DO THIS
ci_cd:
  github:
    token_env: "GITHUB_TOKEN"  # Reference to environment variable
  aws:
    access_key_env: "AWS_ACCESS_KEY_ID"
    secret_key_env: "AWS_SECRET_ACCESS_KEY"
  database:
    password_env: "DB_PASSWORD"
```

### Configuration File Permissions

**Set appropriate file permissions**:

```bash
# Configuration files should NOT be world-readable
chmod 600 .workflow-config.yaml

# Verify permissions
ls -la .workflow-config.yaml
# Should show: -rw------- (600)

# Scripts should be executable by owner only
chmod 700 scripts/*.sh

# Verify
ls -la scripts/
# Should show: -rwx------ (700)
```

### Validating Configuration Security

**Check for accidentally committed secrets**:

```bash
# Scan for potential secrets
git secrets --scan

# Or use gitleaks
gitleaks detect --source=.

# Or check manually
grep -r "password\|secret\|token\|key" .workflow-config.yaml
```

---

## Secrets Management

### Using Environment Variables

**Recommended approach** for secrets in scripts and workflows:

```bash
#!/bin/bash
# ✅ Good: Read from environment

# Check if required secrets are set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GITHUB_TOKEN not set"
    exit 1
fi

# Use secret from environment
curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/user
```

**❌ Bad approach**:

```bash
#!/bin/bash
# ❌ Bad: Hardcoded secret

GITHUB_TOKEN="ghp_abc123..."  # ❌ DON'T DO THIS
curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/user
```

### GitHub Actions Secrets

**Store secrets in GitHub repository settings**:

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add secret name and value
4. Reference in workflows:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      
      - name: Deploy
        env:
          # ✅ Secrets from GitHub Actions
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
          API_KEY: ${{ secrets.API_KEY }}
        run: |
          ./scripts/deploy.sh
```

### Secret Scanning Tools

**Prevent secret commits with pre-commit hooks**:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
  
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.1
    hooks:
      - id: gitleaks
```

**Install and use**:

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Test hooks
pre-commit run --all-files
```

### Environment Variables Best Practices

**1. Use a `.env` file (but gitignore it)**:

```bash
# .env (NEVER COMMIT THIS FILE)
GITHUB_TOKEN=ghp_abc123...
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJalrXUt...
DB_PASSWORD=mypassword
```

**2. Add to `.gitignore`**:

```bash
# .gitignore
.env
.env.local
.env.production
*.key
*.pem
secrets/
```

**3. Provide example file**:

```bash
# .env.example (SAFE TO COMMIT)
GITHUB_TOKEN=your_github_token_here
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
DB_PASSWORD=your_database_password_here
```

**4. Load in scripts**:

```bash
#!/bin/bash
# Load environment variables

if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo "Warning: .env file not found"
fi
```

---

## Submodule Security

### Verifying Submodule Integrity

**Always verify submodule source**:

```bash
# Check submodule URL
git config --file .gitmodules --get submodule..workflow_core.url

# Should be: https://github.com/mpbarbosa/ai_workflow_core.git

# Verify submodule commit hash
cd .workflow_core
git rev-parse HEAD

# Check against known good commit or tag
git describe --tags
```

### Pinning to Specific Versions

**❌ Don't track `main` branch** (security risk):

```bash
# ❌ Risky: Always pulls latest
cd .workflow_core
git checkout main
```

**✅ Pin to specific tag** (secure):

```bash
# ✅ Safe: Use specific version
cd .workflow_core
git checkout v1.0.2

# Or use commit hash
git checkout abc123def456...
```

### Submodule Update Security

**Before updating submodules**:

1. **Review changelog**: Check what changed
2. **Review commits**: Look for suspicious changes
3. **Test in isolated environment**: Don't update production directly
4. **Verify signatures**: If available

```bash
# Review changes before updating
cd .workflow_core
git fetch --tags
git log v1.0.2..v1.1.0  # Review commits between versions

# Check for suspicious changes
git diff v1.0.2..v1.1.0  # Review code changes

# If satisfied, update
git checkout v1.1.0
cd ..
git add .workflow_core
git commit -m "chore: update ai_workflow_core to v1.1.0"
```

### Detecting Submodule Tampering

**Monitor for unexpected changes**:

```bash
# Check if submodule was modified
git submodule status

# Output format:
# abc123... .workflow_core (v1.0.2)  # ✅ Clean
# +abc123... .workflow_core (v1.0.2) # ⚠️  Modified
# -abc123... .workflow_core (v1.0.2) # ⚠️  Not initialized

# Verify submodule is clean
cd .workflow_core
git status

# Should show: "nothing to commit, working tree clean"
```

---

## CI/CD Security

### GitHub Actions Security

**1. Use minimal permissions**:

```yaml
# .github/workflows/build.yml
name: Build

on: [push, pull_request]

permissions:
  contents: read  # ✅ Read-only by default
  pull-requests: write  # Only if needed

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
          # ✅ Don't persist credentials
          persist-credentials: false
```

**2. Pin action versions** (security best practice):

```yaml
# ❌ Risky: Uses latest
- uses: actions/checkout@main

# ✅ Safe: Pinned version with hash
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
```

**3. Secure secrets handling**:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        env:
          # ✅ Use secrets, not env vars in workflow file
          TOKEN: ${{ secrets.DEPLOY_TOKEN }}
        run: |
          # ✅ Mask secret in logs
          echo "::add-mask::$TOKEN"
          ./deploy.sh
```

**4. Restrict workflow triggers**:

```yaml
# ✅ Only run on protected branches
on:
  push:
    branches:
      - main
      - 'release/**'
  pull_request:
    branches:
      - main

# ❌ Dangerous: Runs on any branch
on: [push, pull_request]
```

### Protecting CI/CD Secrets

**Environment-based secrets**:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    # ✅ Use environment with protection rules
    environment:
      name: production
      url: https://example.com
    steps:
      - name: Deploy to production
        env:
          DEPLOY_KEY: ${{ secrets.PRODUCTION_DEPLOY_KEY }}
        run: ./deploy.sh
```

**Set up environment protection rules**:
1. Repository Settings → Environments
2. Add required reviewers
3. Add deployment branches
4. Set wait timer

### CI/CD Isolation

**Isolate sensitive operations**:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Build
        run: npm run build
  
  # ✅ Separate job for deployment
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy
        run: ./deploy.sh
```

---

## File Permissions

### Artifact Directory Permissions

**Secure `.ai_workflow/` directory**:

```bash
# Set restrictive permissions on artifact directory
chmod 700 .ai_workflow

# Secure subdirectories
find .ai_workflow -type d -exec chmod 700 {} \;

# Secure log files (may contain sensitive data)
find .ai_workflow/logs -type f -exec chmod 600 {} \;

# Verify permissions
ls -la .ai_workflow/
# Should show: drwx------ (700)
```

### Script Permissions

**Executable scripts should not be world-writable**:

```bash
# ❌ Bad: World-writable
chmod 777 scripts/deploy.sh  # ❌ DON'T DO THIS

# ✅ Good: Owner-only executable
chmod 700 scripts/deploy.sh

# Or: Owner executable, group/others read-only
chmod 755 scripts/deploy.sh
```

### Configuration File Permissions

```bash
# Sensitive configs: Owner read/write only
chmod 600 .workflow-config.yaml
chmod 600 .env

# Public configs: Everyone can read
chmod 644 README.md
chmod 644 .gitignore
```

---

## Dependency Security

### Monitoring Dependencies

**Regularly check for vulnerabilities**:

```bash
# For Node.js projects
npm audit

# Fix vulnerabilities automatically
npm audit fix

# For Python projects
pip install safety
safety check

# For Go projects
go list -m all | nancy sleuth
```

### Dependabot Configuration

**Enable automated dependency updates**:

```yaml
# .github/dependabot.yml
version: 2
updates:
  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
  
  # Git submodules
  - package-ecosystem: "gitsubmodule"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Supply Chain Security

**Verify integrity of dependencies**:

```bash
# For npm packages, use lock files
npm ci  # Uses package-lock.json (deterministic)

# For Python, use hashes
pip install --require-hashes -r requirements.txt

# For Go, use checksums
go mod verify
```

---

## Common Security Pitfalls

### 1. Committing Secrets

**❌ Problem**:
```bash
git add .
git commit -m "Add configuration"
git push
# Oops! Committed .env file with secrets
```

**✅ Solution**:
```bash
# Add .env to .gitignore BEFORE committing
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .gitignore"

# If already committed secrets:
# 1. Revoke the exposed secret immediately
# 2. Use git-filter-repo to remove from history
git filter-repo --path .env --invert-paths
```

### 2. World-Readable Secrets

**❌ Problem**:
```bash
# Secret file has wrong permissions
-rw-rw-rw- .env  # ❌ Anyone can read
```

**✅ Solution**:
```bash
# Fix permissions
chmod 600 .env
# Now: -rw------- .env ✅
```

### 3. Logging Secrets

**❌ Problem**:
```bash
#!/bin/bash
echo "Deploying with token: $DEPLOY_TOKEN"  # ❌ Secret in logs
```

**✅ Solution**:
```bash
#!/bin/bash
echo "Deploying..."  # ✅ Don't log secrets

# If you must log for debugging:
echo "Token length: ${#DEPLOY_TOKEN}"  # ✅ Only log metadata
```

### 4. Insecure Submodule URLs

**❌ Problem**:
```bash
# Using HTTP instead of HTTPS
git submodule add http://github.com/user/repo.git  # ❌ Insecure
```

**✅ Solution**:
```bash
# Always use HTTPS
git submodule add https://github.com/user/repo.git  # ✅ Secure

# Or use SSH for authenticated access
git submodule add git@github.com:user/repo.git  # ✅ Secure
```

### 5. Unrestricted CI/CD Access

**❌ Problem**:
```yaml
# Workflow runs on any branch, including forks
on: [push, pull_request]  # ❌ Too permissive
```

**✅ Solution**:
```yaml
# Restrict to specific branches
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

---

## Security Checklist

### Before Initial Commit

- [ ] `.env` files added to `.gitignore`
- [ ] No secrets in `.workflow-config.yaml`
- [ ] File permissions set correctly (`chmod 600` for sensitive files)
- [ ] Pre-commit hooks installed for secret detection
- [ ] `.gitignore` includes all sensitive directories

### Before Each Commit

- [ ] Run `git diff` to review changes
- [ ] No secrets in files being committed
- [ ] Run pre-commit hooks: `pre-commit run --all-files`
- [ ] No new sensitive files added

### For Submodule Updates

- [ ] Reviewed changelog for security issues
- [ ] Reviewed code changes (`git diff`)
- [ ] Tested in isolated environment
- [ ] Verified submodule signature (if available)
- [ ] Pinned to specific version tag

### For CI/CD Setup

- [ ] Secrets stored in GitHub Actions secrets (not in workflow files)
- [ ] Workflow permissions minimized
- [ ] Action versions pinned
- [ ] Environment protection rules configured
- [ ] Deployment approvals required for production

### Regular Security Maintenance

- [ ] Rotate secrets every 90 days
- [ ] Review access permissions quarterly
- [ ] Update dependencies monthly
- [ ] Audit CI/CD logs for suspicious activity
- [ ] Review submodule updates before applying

---

## Incident Response

### If Secrets Are Compromised

**Immediate actions** (within 1 hour):

1. **Revoke the compromised secret**
   ```bash
   # Example: Revoke GitHub token
   # Go to GitHub → Settings → Developer settings → Personal access tokens
   # Delete the compromised token
   ```

2. **Rotate to new secret**
   ```bash
   # Generate new secret
   # Update in GitHub Actions secrets
   # Update in local .env file
   ```

3. **Check for unauthorized access**
   ```bash
   # Check GitHub audit log
   # Check AWS CloudTrail (if AWS keys compromised)
   # Check database logs (if DB password compromised)
   ```

4. **Remove from Git history**
   ```bash
   # Use git-filter-repo to remove secret
   pip install git-filter-repo
   git filter-repo --path .env --invert-paths --force
   
   # Force push (after backing up)
   git push --force --all
   ```

### If Submodule Is Compromised

**Immediate actions**:

1. **Stop using the submodule**
   ```bash
   # Revert to known good version
   cd .workflow_core
   git checkout <last-known-good-tag>
   ```

2. **Investigate changes**
   ```bash
   # Compare against official repository
   git diff <official-tag> <current-commit>
   ```

3. **Report to maintainers**
   - Create GitHub issue on official repository
   - Include evidence of compromise

4. **Consider alternatives**
   - Fork and audit the repository
   - Use alternative configuration system
   - Vendor the dependency

---

## Security Resources

### Tools

- **Secret Detection**:
  - [gitleaks](https://github.com/gitleaks/gitleaks)
  - [detect-secrets](https://github.com/Yelp/detect-secrets)
  - [trufflehog](https://github.com/trufflesecurity/trufflehog)

- **Dependency Scanning**:
  - [Dependabot](https://github.com/dependabot)
  - [Snyk](https://snyk.io/)
  - [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
  - [safety](https://pyup.io/safety/) (Python)

- **Code Security**:
  - [CodeQL](https://codeql.github.com/)
  - [SonarQube](https://www.sonarqube.org/)
  - [Bandit](https://bandit.readthedocs.io/) (Python)

### Documentation

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)

### Reporting Security Issues

**If you find a security vulnerability in ai_workflow_core**:

1. **Do NOT create a public GitHub issue**
2. **Email security contact**: [Provide email if available]
3. **Include**:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

4. **Wait for response** before public disclosure

---

## Related Documentation

- [TESTING.md](TESTING.md) - Testing and validation guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution security requirements
- [CI_CD_INTEGRATION.md](advanced/CI_CD_INTEGRATION.md) - Secure CI/CD setup

---

## Security Policy Statement

ai_workflow_core is committed to security:

✅ **No secrets in repository**: All templates use environment variables  
✅ **Secure defaults**: Configuration templates follow security best practices  
✅ **Regular updates**: Dependencies and submodules updated regularly  
✅ **Community auditing**: Open source allows security review  
✅ **Responsible disclosure**: Security issues handled privately first

**Remember**: Security is a shared responsibility. This document provides guidelines, but you must implement and maintain security in your own projects.

---

**Last Updated**: 2026-02-07  
**Document Version**: 1.0.2  
**Security Policy Version**: 1.0  
**Maintained By**: ai_workflow_core security team
