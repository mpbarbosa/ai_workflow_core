# AI Workflow Core

**Foundational configuration and templates for AI-powered workflow automation across multiple languages**

[![License](https://img.shields.io/badge/license-MIT-green.svg)](docs/LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)]()

## Overview

`ai_workflow_core` provides language-agnostic foundational files for building AI-powered workflow automation systems. Extract configuration, templates, GitHub workflows, and directory structures to share across projects written in different languages (Shell, JavaScript/Node.js, Python, etc.).

**Originally extracted from**: [mpbarbosa/ai_workflow](https://github.com/mpbarbosa/ai_workflow)  
**Use as**: Git submodule

## What's Included

- **Configuration Templates** - Workflow config files
- **GitHub Integration** - Actions workflows, Copilot instructions
- **Utility Scripts** - Cleanup, validation scripts
- **Directory Structure** - Standard artifact organization
- **Documentation** - Architecture, guides, contributing

## Quick Start

### 1. Add as Submodule

```bash
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
git submodule update --init --recursive
```

### 2. Copy and Customize Configuration

```bash
# Copy workflow config
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Add workflow artifact patterns to your .gitignore
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

### 3. Replace Placeholders

Edit `.workflow-config.yaml` and replace `{{PLACEHOLDERS}}`:

```yaml
project:
  name: "My Project"                    # Replace {{PROJECT_NAME}}
  type: "nodejs-application"            # Replace {{PROJECT_TYPE}}
  description: "My description"         # Replace {{PROJECT_DESCRIPTION}}
  kind: "nodejs_api"                    # Replace {{PROJECT_KIND}} - see config/project_kinds.yaml
  version: "1.0.1"                      # Replace {{VERSION}}

tech_stack:
  primary_language: "javascript"        # Replace {{LANGUAGE}}
  build_system: "npm"                   # Replace {{BUILD_SYSTEM}}
  test_framework: "jest"                # Replace {{TEST_FRAMEWORK}}
  test_command: "npm test"              # Replace {{TEST_COMMAND}}
  lint_command: "eslint ."              # Replace {{LINT_COMMAND}}
```

### 4. Set Up Workflow Structure

```bash
# Create artifact directory structure
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}
```

## Placeholder Reference

| Placeholder | Description | Example |
|------------|-------------|---------|
| `{{PROJECT_NAME}}` | Project name | "My Project" |
| `{{PROJECT_TYPE}}` | Project type (hyphenated) | "nodejs-application", "configuration-library" |
| `{{PROJECT_KIND}}` | Project kind (underscored) | "nodejs_api", "configuration_library" |
| `{{PROJECT_DESCRIPTION}}` | Project description | "RESTful API for user management" |
| `{{LANGUAGE}}` | Primary language | "javascript", "bash", "python" |
| `{{BUILD_SYSTEM}}` | Build system/package manager | "npm", "webpack", "maven", "none" |
| `{{TEST_FRAMEWORK}}` | Testing framework | "jest", "pytest", "shell-script" |
| `{{TEST_COMMAND}}` | Test command | "npm test", "./tests/run_tests.sh" |
| `{{LINT_COMMAND}}` | Lint command | "eslint .", "shellcheck **/*.sh" |
| `{{VERSION}}` | Version number | "1.0.1" |

**Terminology Note:**
- `PROJECT_TYPE` uses **hyphens** for display: `"nodejs-application"`, `"configuration-library"`
- `PROJECT_KIND` uses **underscores** for validation: `"nodejs_api"`, `"configuration_library"` (from `config/project_kinds.yaml`)

See [docs/api/PLACEHOLDER_REFERENCE.md](docs/api/PLACEHOLDER_REFERENCE.md) for complete placeholder reference guide, or [docs/INTEGRATION.md](docs/INTEGRATION.md) for integration examples.

## Version Management

For production systems, **always pin to specific version tags**:

```bash
# Pin to stable version
cd .workflow_core && git checkout v1.0.1 && cd ..
git add .workflow_core
git commit -m "Pin ai_workflow_core to v1.0.1"
```

**Important for dynamic codebases:**
- Review [Version Management Guide](docs/guides/VERSION_MANAGEMENT.md) for update strategies
- Run health checks after updates: `bash .workflow_core/scripts/check_integration_health.sh`
- See [Integration Best Practices](docs/guides/INTEGRATION_BEST_PRACTICES.md) for maintenance tips

## Language Examples

### Shell Script
```bash
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
# Edit: language: bash, test_framework: shell-script
```

### JavaScript/Node.js
```bash
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
# Edit: language: javascript, build_system: npm, test_framework: jest
```

**Complete Integration Examples:**
- **[Shell Script](examples/shell/)** 🟢 **Comprehensive** - Bash automation with BATS testing (645+ lines, detailed troubleshooting)
- **[Node.js](examples/nodejs/)** 🟡 **Compact** - JavaScript/Node.js with npm/jest (320+ lines, essential patterns)

**Complexity Labels:**
- 🟢 **Comprehensive** = Detailed walkthrough with troubleshooting, best practices, and edge cases
- 🟡 **Compact** = Essential patterns and quick setup focused on getting started

**Want to add an example?** See [examples/README.md](examples/README.md) for comprehensive contributor guide.

## Documentation

> ⚠️ **Context Note**: Some guides in `docs/guides/` reference the **parent ai_workflow project** (workflow execution engine). Focus on configuration templates, project_kinds schemas, and integration patterns when using ai_workflow_core as a configuration library.

### Core Documentation
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and design decisions  
- **[INTEGRATION.md](docs/INTEGRATION.md)** - Detailed integration guide  
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** ⚠️ - Contributing guidelines (references parent project features)
- **[AI_WORKFLOW_DIRECTORY.md](docs/AI_WORKFLOW_DIRECTORY.md)** - Artifact directory structure  

### API References
- **[CONFIG_REFERENCE.md](docs/api/CONFIG_REFERENCE.md)** - Complete `.workflow-config.yaml` field reference
- **[PLACEHOLDER_REFERENCE.md](docs/api/PLACEHOLDER_REFERENCE.md)** - Placeholder patterns and substitution guide
- **[PROJECT_KINDS_SCHEMA.md](docs/api/PROJECT_KINDS_SCHEMA.md)** - Project kinds schema v1.2.0 reference
- **[AI_HELPERS_REFERENCE.md](docs/api/AI_HELPERS_REFERENCE.md)** - AI persona definitions and token efficiency system
- **[AI_PROMPTS_REFERENCE.md](docs/api/AI_PROMPTS_REFERENCE.md)** - Project-specific AI prompt templates

### User Guides
- **[QUICK_START.md](docs/guides/QUICK_START.md)** - 5-minute setup guide
- **[MIGRATION_GUIDE.md](docs/guides/MIGRATION_GUIDE.md)** - Version upgrade procedures
- **[TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md)** - 25+ solutions across 8 categories
- **[FAQ.md](docs/guides/FAQ.md)** - 40+ questions answered

### Developer Guides
- **[TEMPLATE_AUTHORING.md](docs/developers/TEMPLATE_AUTHORING.md)** - Creating and modifying templates

### Advanced Guides
- **[MULTI_LANGUAGE_SETUP.md](docs/advanced/MULTI_LANGUAGE_SETUP.md)** - Polyglot project configurations
- **[CUSTOM_WORKFLOW_CREATION.md](docs/advanced/CUSTOM_WORKFLOW_CREATION.md)** - Custom automation workflows
- **[CI_CD_INTEGRATION.md](docs/advanced/CI_CD_INTEGRATION.md)** - Integration with 5 CI/CD platforms

### Visual Aids
- **[diagrams/README.md](docs/diagrams/README.md)** - 20+ Mermaid diagrams for architecture, flows, and structures

## Development

### Validation Scripts

Run validation scripts to ensure configuration quality:

```bash
# Validate documentation context blocks
python3 scripts/validate_context_blocks.py

# Validate directory structure
python3 scripts/validate_structure.py

# With auto-fix for empty directories
python3 scripts/validate_structure.py --fix
```

**Script Documentation:**
- `validate_context_blocks.py` - Validates standardized context block structure in YAML configs
- `validate_structure.py` - Checks directory structure for empty/undocumented directories

**Automated in CI/CD:**
- ✅ Structure validation runs on every push/PR
- ✅ Pre-commit hooks validate before each commit
- ✅ See [workflow-templates/workflows/validate-structure.yml](workflow-templates/workflows/validate-structure.yml)

### Pre-commit Hooks

This project uses pre-commit hooks for code quality:

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run manually
pre-commit run --all-files
```

**Hooks validate:**
- ✅ YAML syntax
- ✅ File formatting (trailing whitespace, EOF)
- ✅ Large file prevention
- ✅ Merge conflict markers
- ✅ Private key detection
- ✅ **Directory structure** (via validate_structure.py)

## Features

✅ Language-agnostic templates  
✅ GitHub Actions workflows  
✅ GitHub Copilot integration  
✅ Standardized directory structure  
✅ Utility scripts  
✅ Comprehensive documentation

## License

MIT License - See [docs/LICENSE](docs/LICENSE)

## Credits

Part of [AI Workflow Automation](https://github.com/mpbarbosa/ai_workflow) project.

**Parent Project Status**: v1.1.0 (Phase 3 Complete - File Operations & Utilities)

---

**Version**: 1.0.1 | **Updated**: 2026-02-01

## Automated Validation

### CI/CD Integration

This repository includes automated structure validation in CI/CD:

```yaml
# .github/workflows/validate-structure.yml (included in workflow-templates/)
- Runs on every push and pull request
- Detects empty directories automatically
- Verifies required directories exist
- Checks documentation alignment
```

To integrate in your project:
```bash
cp .workflow_core/workflow-templates/workflows/validate-structure.yml .github/workflows/
```

### Pre-commit Hooks

Structure validation runs automatically via pre-commit hooks:

```bash
# Install pre-commit
pip install pre-commit
pre-commit install

# Run manually
pre-commit run validate-structure --all-files
```

The pre-commit hook:
- ✅ Validates directory structure before each commit
- ✅ Detects empty directories
- ✅ Ensures required directories exist
- ✅ Prevents structure drift
