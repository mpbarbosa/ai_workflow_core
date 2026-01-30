# Changelog

All notable changes to the AI Workflow Core project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **New AI Persona**: `technical_writer_prompt` (v4.1.0)
  - Specialized in comprehensive from-scratch documentation creation
  - Designed for undocumented codebases, new projects, and major rewrites
  - Covers: API docs, architecture guides, user guides, developer guides, code documentation
  - Language-agnostic with dynamic language-specific standards injection
  - Complements existing `doc_analysis_prompt` (incremental updates) and `consistency_prompt` (auditing)
  - Follows v4.0.0 token efficiency patterns (YAML anchors, concise output format)
- Updated `config/README.md` with persona usage guidelines
  - Documented when to use technical_writer vs doc_analysis vs consistency personas
  - Added complete list of 15 AI personas by category

### Changed
- Bumped `ai_helpers.yaml` version from 4.0.0 to 4.1.0
- Updated version history with technical_writer_prompt addition

### Fixed
- **Bug Fix**: Corrected `version_manager_prompt` YAML syntax error
  - Changed undefined `<<: *standard_guidelines` to `behavioral_guidelines: *behavioral_actionable`
  - This was a pre-existing bug preventing YAML parsing

### Removed
- `config/paths.yaml` - Removed as it's project-specific and should be created by consuming projects, not provided as a template

## [1.0.0] - 2026-01-29

### Added
- Initial release of ai_workflow_core as standalone repository
- Language-agnostic configuration templates
  - `.workflow-config.yaml.template` with placeholder system
  - `.gitignore.template` for workflow artifacts
  - VS Code tasks integration
- GitHub integration
  - GitHub Actions workflows (code-quality, validate-docs, validate-tests)
  - Copilot instructions template
- Reusable templates
  - Error handling template
  - Workflow templates (docs-only, test-only, feature)
- Utility scripts
  - `cleanup_artifacts.sh.template` for artifact management
  - `validate_context_blocks.py` for documentation validation
- Standard `.ai_workflow/` directory structure
  - backlog/, summaries/, logs/, metrics/
  - checkpoints/, prompts/, ml_models/
- Comprehensive documentation
  - Integration guide with step-by-step instructions
  - Architecture documentation
  - Implementation guides
  - CONTRIBUTING.md and CODE_OF_CONDUCT.md
- Language-specific examples
  - Shell script integration example
  - JavaScript/Node.js integration example
- Placeholder system using `{{VARIABLE_NAME}}` format
  - Supports 14+ common placeholders
  - Easy search and replace workflow

### Features
- Designed for use as Git submodule
- Works with multiple programming languages (Shell, JavaScript, Python, etc.)
- Extracted from proven [ai_workflow](https://github.com/mpbarbosa/ai_workflow) project
- MIT licensed

### Planned
- Python integration example
- Additional GitHub workflow templates
- Pre-commit hooks configuration
- Docker integration example
- CI/CD pipeline templates for multiple platforms
- More utility scripts

---

## Version History

- **1.0.0** (2026-01-29) - Initial release

## Migration Notes

### From ai_workflow

If you're migrating from using ai_workflow directly:

1. Add ai_workflow_core as submodule: `git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core`
2. Copy configuration: `cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml`
3. Customize for your language and build system
4. Keep your language-specific workflow implementation separate

---

For questions or issues, see [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues).
