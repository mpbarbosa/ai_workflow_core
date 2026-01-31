# GitHub Workflows & Templates

⚠️ **Important Directory Distinction**:
- **`.github/`** (with dot) = GitHub platform metadata for THIS repository (DESCRIPTION.md, copilot-instructions.md)
- **`github/`** (no dot) = Workflow templates for YOUR projects to copy

This directory contains **template** GitHub Actions workflows that projects can copy and customize when using ai_workflow_core as a submodule.

## Directory Structure

```
ai_workflow_core/
├── .github/                    # GitHub metadata (DO NOT COPY)
│   ├── DESCRIPTION.md          # This repo's description
│   └── copilot-instructions.md # This repo's Copilot instructions
│
└── github/                     # Workflow templates (COPY THESE)
    ├── README.md               # This file
    └── workflows/              # Template workflow files
        ├── code-quality.yml
        ├── validate-docs.yml
        └── validate-tests.yml
```

## Workflows Included

### `workflows/code-quality.yml`
- Runs linters and formatters
- Checks code style compliance
- Configurable for multiple languages

### `workflows/validate-docs.yml`  
- Validates documentation consistency
- Checks broken links
- Verifies code block syntax

### `workflows/validate-tests.yml`
- Runs project test suites
- Generates coverage reports
- Validates test structure

## Usage

### 1. Copy Templates to Your Project

```bash
# From your project root
mkdir -p .github
cp -r .workflow_core/github/workflows .github/

# Edit .github/workflows/*.yml files
```

### 2. Customize for Your Project

Each workflow file needs customization:
- **Build commands**: Replace with your build system (npm, maven, cargo, etc.)
- **Test commands**: Update test runner commands
- **Linting**: Configure linters for your language
- **Language versions**: Set supported versions (Node.js 18+, Python 3.10+, etc.)
- **Dependencies**: Add installation steps

### 3. Create Project-Specific Copilot Instructions

**Important**: Create your own `.github/copilot-instructions.md` specific to YOUR project:

```bash
# DO NOT copy ai_workflow_core's copilot-instructions.md
# Create your own tailored to your project:
touch .github/copilot-instructions.md
```

Include:
- Project-specific architecture and patterns
- Module organization and key files
- Development workflow and conventions
- Testing strategy and requirements
- AI personas or coding guidelines

## Example Customization

**Before** (template):
```yaml
- name: Run tests
  run: {{TEST_COMMAND}}  # Replace with actual command
```

**After** (Node.js project):
```yaml
- name: Run tests
  run: npm test
```

## Language-Specific Examples

See [`examples/`](../examples/) directory for complete integration examples:
- `examples/shell/` - Shell script automation
- `examples/nodejs/` - Node.js application

## Workflow Triggers

Default triggers (customize as needed):
- **Push**: Runs on every push to main/master
- **Pull Request**: Runs on PRs to main/master
- **Manual**: Can be triggered via workflow_dispatch

## Best Practices

1. ✅ **Review all workflows** before committing
2. ✅ **Test workflows** on a branch first
3. ✅ **Remove unused workflows** specific to other languages
4. ✅ **Add secrets** via GitHub Settings → Secrets (API keys, tokens, etc.)
5. ✅ **Monitor workflow runs** in the Actions tab
6. ✅ **Keep workflows simple** - one responsibility per workflow

## Troubleshooting

**Workflow fails with "command not found"**:
- Add language/runtime setup step (actions/setup-node, actions/setup-python, etc.)

**Tests pass locally but fail in CI**:
- Check environment variables and secrets
- Verify dependency installation steps
- Review working directory paths

**Linter configuration conflicts**:
- Ensure linter config files are committed (.eslintrc, .pylintrc, etc.)
- Check linter version matches local development

## Reference

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

---

**Last Updated**: 2026-01-30  
**ai_workflow_core Version**: 1.0.0
