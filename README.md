# AI Workflow Core

**Foundational configuration and templates for AI-powered workflow automation across multiple languages**

[![License](https://img.shields.io/badge/license-MIT-green.svg)](docs/LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()

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
  version: "1.0.0"                      # Replace {{VERSION}}

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
| `{{LANGUAGE}}` | Primary language | "javascript", "bash", "python" |
| `{{TEST_COMMAND}}` | Test command | "npm test", "./tests/run_tests.sh" |
| `{{LINT_COMMAND}}` | Lint command | "eslint .", "shellcheck **/*.sh" |
| `{{VERSION}}` | Version number | "1.0.0" |

See [docs/api/PLACEHOLDER_REFERENCE.md](docs/api/PLACEHOLDER_REFERENCE.md) for complete placeholder reference guide, or [docs/INTEGRATION.md](docs/INTEGRATION.md) for integration examples.

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
- **[Shell Script](examples/shell/)** - Bash automation with BATS testing (645+ lines)
- **[Node.js](examples/nodejs/)** - JavaScript/Node.js with npm/jest (320+ lines)

**Want to add an example?** See [examples/README.md](examples/README.md) for comprehensive contributor guide.

## Documentation

### Core Documentation
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and design decisions  
- **[INTEGRATION.md](docs/INTEGRATION.md)** - Detailed integration guide  
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Contributing guidelines and standards  
- **[AI_WORKFLOW_DIRECTORY.md](docs/AI_WORKFLOW_DIRECTORY.md)** - Artifact directory structure  

### API References
- **[CONFIG_REFERENCE.md](docs/api/CONFIG_REFERENCE.md)** - Complete `.workflow-config.yaml` field reference
- **[PLACEHOLDER_REFERENCE.md](docs/api/PLACEHOLDER_REFERENCE.md)** - Placeholder patterns and substitution guide
- **[PROJECT_KINDS_SCHEMA.md](docs/api/PROJECT_KINDS_SCHEMA.md)** - Project kinds schema v1.2.0 reference

### Additional Guides
- [docs/guides/](docs/guides/) - Implementation guides and advanced topics

## Development

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

---

**Version**: 1.0.0 | **Updated**: 2026-01-31
