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
  kind: "web_application"               # Replace {{PROJECT_KIND}}
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

See [docs/INTEGRATION.md](docs/INTEGRATION.md) for complete placeholder list.

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

See [examples/](examples/) for complete integration examples.

## Documentation

- [docs/INTEGRATION.md](docs/INTEGRATION.md) - Detailed integration guide
- [docs/guides/](docs/guides/) - Implementation guides
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) - Contributing guidelines

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

**Version**: 1.0.0 | **Updated**: 2026-01-30
