# Integration Quick Reference for Dynamic Codebases

**Quick commands and patterns for maintaining ai_workflow_core integrations in frequently-changing projects**

---

## Daily/Weekly Commands

### Health Check (Run Weekly)
```bash
bash .workflow_core/scripts/check_integration_health.sh
```

### Check Submodule Version
```bash
cd .workflow_core && git describe --tags && cd ..
```

### Check for Updates
```bash
cd .workflow_core && git fetch --tags && git tag -l && cd ..
```

---

## Version Management

### Pin to Stable Version (Production)
```bash
cd .workflow_core && git checkout v1.0.1 && cd ..
git add .workflow_core
git commit -m "Pin ai_workflow_core to v1.0.1"
```

### Track Latest Stable (Development)
```bash
cd .workflow_core && git checkout main && cd ..
git config -f .gitmodules submodule.workflow_core.branch main
```

### Update to New Version
```bash
# 1. Create feature branch
git checkout -b update-workflow-core

# 2. Update submodule
cd .workflow_core && git checkout v1.1.0 && cd ..

# 3. Validate
bash .workflow_core/scripts/check_integration_health.sh
npm test  # or your test command

# 4. Commit
git add .workflow_core
git commit -m "chore: update ai_workflow_core to v1.1.0"
```

---

## Troubleshooting

### Fix Common Issues Automatically
```bash
bash .workflow_core/scripts/check_integration_health.sh --fix
```

### Check for Unreplaced Placeholders
```bash
grep -r "{{" .workflow-config.yaml
```

### Fix Detached HEAD
```bash
cd .workflow_core && git checkout main && cd ..
git add .workflow_core && git commit -m "Fix submodule HEAD"
```

### Initialize Missing Submodule
```bash
git submodule update --init --recursive
```

---

## Emergency Rollback

### Quick Revert
```bash
git revert HEAD  # If last commit was submodule update
```

### Manual Rollback
```bash
cd .workflow_core && git checkout v1.0.1 && cd ..
git add .workflow_core
git commit -m "Rollback ai_workflow_core to v1.0.1"
```

---

## CI/CD Integration

### Add to GitHub Actions
```yaml
# .github/workflows/test.yml
- name: Checkout with submodules
  uses: actions/checkout@v3
  with:
    submodules: true

- name: Run health check
  run: bash .workflow_core/scripts/check_integration_health.sh
```

---

## Configuration Maintenance

### Validate Configuration
```bash
# Check syntax (requires yamllint)
yamllint -d relaxed .workflow-config.yaml

# Check for placeholders
grep "{{" .workflow-config.yaml
```

### Check for Drift
```bash
# Compare structure with template
diff <(grep -E '^[a-z_]+:' .workflow_core/config/.workflow-config.yaml.template | sort) \
     <(grep -E '^[a-z_]+:' .workflow-config.yaml | sort)
```

---

## Documentation Quick Links

- **[Version Management Guide](docs/guides/VERSION_MANAGEMENT.md)** - Complete versioning strategies
- **[Integration Best Practices](docs/guides/INTEGRATION_BEST_PRACTICES.md)** - Maintenance patterns
- **[Integration Guide](docs/INTEGRATION.md)** - Full setup instructions
- **[Health Check Script](scripts/check_integration_health.sh.template)** - Validation tool

---

## Update Frequency Recommendations

| Environment | Strategy | Frequency |
|-------------|----------|-----------|
| Production | Pin to tags | Quarterly / security patches |
| Staging | Pin to tags | Monthly |
| Development | Track branch | Weekly |
| CI/CD | Pin to tags | Same as production |

---

## Checklist: Before Production Deployment

- [ ] Health check passes: `bash .workflow_core/scripts/check_integration_health.sh`
- [ ] Submodule pinned to tag: `cd .workflow_core && git describe --tags`
- [ ] No placeholders: `grep "{{" .workflow-config.yaml` returns nothing
- [ ] Tests pass: `npm test` (or your test command)
- [ ] Version documented: Note submodule version in deployment notes

---

## Getting Help

1. Run health check: `bash .workflow_core/scripts/check_integration_health.sh`
2. Check troubleshooting guide: [INTEGRATION.md](docs/INTEGRATION.md#troubleshooting)
3. Review best practices: [INTEGRATION_BEST_PRACTICES.md](docs/guides/INTEGRATION_BEST_PRACTICES.md)
4. Open issue: [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)

---

**Version:** 1.0.1  
**Last Updated:** 2026-01-29  
**Print this page for quick reference at your desk!**
