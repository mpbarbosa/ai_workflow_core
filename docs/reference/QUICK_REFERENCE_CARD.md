# Quick Reference Card

**ai_workflow_core - Essential Commands & Concepts**

**Version**: 1.0.2 | **Last Updated**: 2026-02-12 | **Print-Friendly**: Yes

---

## 🚀 Setup Commands

### Initial Setup (5 minutes)

```bash
# Add as submodule
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
git submodule update --init --recursive

# Copy config template
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Create artifact directories
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
```

### Submodule Management

```bash
# Update to latest
git submodule update --remote .workflow_core

# Pull with submodules
git pull --recurse-submodules

# Clone with submodules
git clone --recurse-submodules <repo-url>
```

---

## 📝 Configuration

### Essential Placeholders

| Placeholder | Example | Format |
|------------|---------|--------|
| `{{PROJECT_NAME}}` | "My App" | String |
| `{{PROJECT_TYPE}}` | "nodejs-application" | Hyphenated |
| `{{PROJECT_KIND}}` | "nodejs_api" | Underscored |
| `{{LANGUAGE}}` | "javascript" | Lowercase |
| `{{VERSION}}` | "1.0.2" | Semver (no 'v') |
| `{{TEST_COMMAND}}` | "npm test" | Shell command |
| `{{LINT_COMMAND}}` | "eslint ." | Shell command |

### Project Kinds (8 Types)

```yaml
# Choose one:
kind: "shell_script_automation"  # Bash/shell projects
kind: "nodejs_api"               # Node.js backend
kind: "client_spa"               # Vanilla JS SPA
kind: "react_spa"                # React application
kind: "static_website"           # HTML/CSS/JS
kind: "python_app"               # Python application
kind: "configuration_library"    # Template repo
kind: "generic"                  # Other types
```

---

## 🔍 Validation Scripts

### Quick Validation

```bash
# Validate directory structure
python3 scripts/validate_structure.py

# Validate AI prompts
python3 scripts/validate_context_blocks.py config/ai_helpers.yaml

# Fix empty directories
python3 scripts/validate_structure.py --fix
```

### Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| `0` | Success | Continue |
| `1` | Failed | Review errors |
| `2` | Error | Check setup |

---

## 🛠️ Common Commands

### Artifact Management

```bash
# Clean cache
./scripts/cleanup_artifacts.sh --cache

# Clean backlog
./scripts/cleanup_artifacts.sh --backlog

# Clean all (with prompt)
./scripts/cleanup_artifacts.sh --all

# Preview cleanup
./scripts/cleanup_artifacts.sh --all --dry-run
```

### Health Checks

```bash
# Check integration
./scripts/check_integration_health.sh

# Verbose output
./scripts/check_integration_health.sh --verbose
```

---

## 📁 Directory Structure

```
project/
├── .workflow_core/          # Submodule (don't edit)
├── .ai_workflow/            # Artifacts (gitignored)
│   ├── backlog/
│   ├── summaries/
│   ├── logs/
│   ├── metrics/
│   ├── checkpoints/
│   ├── prompts/
│   ├── ml_models/
│   └── .incremental_cache/
├── .workflow-config.yaml    # Your config (edited)
└── .gitignore               # Include artifacts
```

---

## 📚 Documentation Map

### For Beginners

- 📖 [README.md](../../README.md) - Start here
- 🚀 [QUICK_START.md](../guides/QUICK_START.md) - 5-min setup
- 🔗 [INTEGRATION.md](../INTEGRATION.md) - Submodule guide
- ❓ [FAQ.md](../guides/FAQ.md) - 40+ Q&As

### For Developers

- 🏗️ [ARCHITECTURE.md](../ARCHITECTURE.md) - System design
- 🤝 [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribute
- 📋 [ONBOARDING.md](ONBOARDING.md) - Developer onboarding
- 🔧 [ADDING_PROJECT_KINDS.md](ADDING_PROJECT_KINDS.md) - Extend

### API References

- ⚙️ [CONFIG_REFERENCE.md](../api/CONFIG_REFERENCE.md) - Config fields
- 🔤 [PLACEHOLDER_REFERENCE.md](../api/PLACEHOLDER_REFERENCE.md) - Placeholders
- 📦 [PROJECT_KINDS_SCHEMA.md](../api/PROJECT_KINDS_SCHEMA.md) - Project types
- 🤖 [AI_HELPERS_REFERENCE.md](../api/AI_HELPERS_REFERENCE.md) - AI helpers
- 📜 [SCRIPT_API_REFERENCE.md](../api/SCRIPT_API_REFERENCE.md) - Scripts

### Troubleshooting

- 🐛 [TROUBLESHOOTING.md](../guides/TROUBLESHOOTING.md) - 25+ solutions
- 🚚 [MIGRATION_GUIDE.md](../guides/MIGRATION_GUIDE.md) - Version upgrades
- 💡 [INTEGRATION_BEST_PRACTICES.md](../guides/INTEGRATION_BEST_PRACTICES.md) - Best practices

---

## 🎯 Common Workflows

### Adding New Project

```bash
# 1. Setup submodule
git submodule add <url> .workflow_core

# 2. Copy config
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# 3. Edit config (replace ALL {{PLACEHOLDERS}})
nano .workflow-config.yaml

# 4. Create directories
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts}

# 5. Update .gitignore
echo ".ai_workflow/" >> .gitignore

# 6. Validate
python3 scripts/validate_structure.py
```

### Updating Configuration

```bash
# 1. Edit config
nano .workflow-config.yaml

# 2. Validate syntax
yamllint .workflow-config.yaml

# 3. Test changes
# (Run your workflow or validation)

# 4. Commit
git add .workflow-config.yaml
git commit -m "chore(config): update project configuration"
```

### Upgrading Submodule

```bash
# 1. Update submodule
cd .workflow_core
git fetch origin
git checkout v1.2.5  # Pin to specific version
cd ..

# 2. Update parent repo
git add .workflow_core
git commit -m "chore(deps): upgrade ai_workflow_core to v1.2.5"

# 3. Review breaking changes
cat .workflow_core/CHANGELOG.md

# 4. Update config if needed
# (See MIGRATION_GUIDE.md)
```

---

## 🔧 Troubleshooting Quick Fixes

### Submodule Issues

```bash
# Submodule not initialized
git submodule update --init --recursive

# Detached HEAD warning
cd .workflow_core
git checkout main
cd ..

# Reset submodule
git submodule deinit -f .workflow_core
git submodule update --init
```

### Validation Errors

```bash
# Missing files error
# → Create required files per project kind

# Empty directory warning
python3 scripts/validate_structure.py --fix

# Context block error
# → Fix ai_helpers.yaml format
```

### Configuration Issues

```bash
# YAML syntax error
yamllint .workflow-config.yaml

# Placeholder not replaced
grep -r "{{" .workflow-config.yaml

# Invalid project kind
# → Check config/project_kinds.yaml for valid kinds
```

---

## 🎨 File Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Project Type | Hyphenated | `nodejs-application` |
| Project Kind | Underscored | `nodejs_api` |
| Config Keys | Underscored | `primary_language` |
| Placeholders | Uppercase + Underscored | `{{PROJECT_NAME}}` |
| Template Files | `.template` extension | `cleanup_artifacts.sh.template` |
| Version Numbers | Semver (no 'v') | `1.0.2` |

---

## 📊 CI/CD Integration

### GitHub Actions

```yaml
name: Validate
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive

      - name: Validate Structure
        run: python3 scripts/validate_structure.py

      - name: Validate Context
        run: python3 scripts/validate_context_blocks.py config/ai_helpers.yaml
```

### Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: validate-structure
        name: Validate Directory Structure
        entry: python3 scripts/validate_structure.py
        language: system
        pass_filenames: false
```

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| GitHub Repo | https://github.com/mpbarbosa/ai_workflow_core |
| Issues | https://github.com/mpbarbosa/ai_workflow_core/issues |
| Changelog | [CHANGELOG.md](../../CHANGELOG.md) |
| License | [LICENSE](../LICENSE) |
| Parent Project | https://github.com/mpbarbosa/ai_workflow |

---

## 💡 Pro Tips

### Performance
- Pin submodule to specific tag for stability: `git checkout v1.0.2`
- Cache validation results in CI/CD
- Use `--quiet` flag in automation

### Organization
- Keep `.workflow-config.yaml` in root
- Don't edit files in `.workflow_core/`
- Version control customized scripts, not templates

### Best Practices
- Replace ALL placeholders before committing
- Run validation before each commit
- Update submodule regularly for fixes
- Read CHANGELOG before upgrading

### Common Mistakes
- ❌ Editing `.workflow_core/` files directly
- ❌ Forgetting to replace placeholders
- ❌ Committing `.ai_workflow/` artifacts
- ❌ Using 'v' prefix in version numbers

---

## 📞 Getting Help

1. **Check Documentation**: Start with [FAQ.md](../guides/FAQ.md)
2. **Search Issues**: Look for similar problems
3. **Read Guides**: Review [TROUBLESHOOTING.md](../guides/TROUBLESHOOTING.md)
4. **Ask Community**: Open a GitHub issue
5. **Contribute**: Found a solution? Update docs!

---

**Print this card** • **Bookmark this page** • **Share with team**

---

**ai_workflow_core** v1.0.2 | MIT License | © 2026
