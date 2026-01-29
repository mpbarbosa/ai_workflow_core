# GitHub Configuration

This directory contains GitHub-specific configuration files for workflows and CI/CD integration.

## Files

### `workflows/`
GitHub Actions workflow YAML files for CI/CD:
- `code-quality.yml` - Code quality checks
- `validate-docs.yml` - Documentation validation
- `validate-tests.yml` - Test validation
- `README.md` - Workflow documentation

### `README.md`
Documentation about GitHub workflows and configuration.

## Usage

### Setting up GitHub Actions

```bash
# From your project root
mkdir -p .github
cp -r .workflow_core/github/workflows .github/

# Customize workflows for your language and build system
# Edit .github/workflows/*.yml files
```

## Workflow Customization

Each workflow file contains placeholders or language-specific sections. Review and customize:
- Build commands
- Test commands
- Linting configuration
- Supported language versions
- Dependencies installation

## GitHub Copilot Instructions

Each project should create its own `.github/copilot-instructions.md` file tailored to:
- Project-specific architecture and patterns
- Module organization and key files
- Development workflow and conventions
- Testing strategy and requirements
- AI personas or coding guidelines specific to your project

## Reference

See [GitHub Actions documentation](https://docs.github.com/en/actions) for more information on workflows.
