# Changelog

All notable changes to the AI Workflow Core project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **AI Prompts for Missing Project Kinds** (2026-01-31)
  - Added comprehensive AI prompts for 4 missing project kinds:
    - `python_app`: Python application testing, documentation, and code review prompts
    - `client_spa`: Vanilla JavaScript SPA prompts (Bootstrap/CSS frameworks, no React/Vue/Angular)
    - `static_website`: HTML/CSS/JS static website prompts with accessibility focus (WCAG AA)
    - `configuration_library`: Template/schema validation and documentation prompts
  - All prompts follow existing structure with `documentation_specialist`, `test_engineer`, and `code_reviewer` roles
  - Updated `config/ai_prompts_project_kinds.yaml` version to 1.2.0 (aligned with project_kinds.yaml)
- **Expanded Shell Example** (2026-01-31)
  - Expanded `examples/shell/README.md` from 20 lines to 550+ lines
  - Added comprehensive sections: Prerequisites, Setup Steps, Directory Structure, Configuration
  - Included practical examples: main script, utility library, test runner
  - Added Integration Workflow, Testing/Validation, Common Pitfalls, Troubleshooting, Resources
  - Now matches nodejs example detail level while maintaining shell script focus
- **Naming Conventions Documentation** (2026-01-31)
  - Added comprehensive Naming Conventions section to `docs/CONTRIBUTING.md`
  - Documented conventions for all file/directory types:
    - Files: directories (underscores), YAML configs (underscores), dotfiles (hyphens), docs (UPPERCASE)
    - Variables: placeholders (UPPERCASE), YAML keys (underscores), PROJECT_TYPE (hyphens), PROJECT_KIND (underscores)
  - Included comparison tables, examples in context, and quick decision guide
  - Added to Table of Contents for easy navigation
- **Pre-commit Hooks Configuration** (2026-01-31)
  - Added `.pre-commit-config.yaml` for automated code quality checks
  - Hooks include:
    - YAML syntax validation (yamllint with relaxed rules)
    - File formatting (end-of-file-fixer, trailing-whitespace)
    - Security checks (private key detection)
    - Merge conflict detection
    - Large file prevention (>1MB)
    - Structure validation (custom local hook)
  - Documented installation and usage in README.md
- **Architecture Documentation** (2026-01-31)
  - Created comprehensive `docs/ARCHITECTURE.md` (400+ lines)
  - Sections include:
    - System overview and context diagram
    - Template system design and placeholder substitution flow
    - Git submodule integration pattern with update strategy
    - Project kinds system architecture
    - 5 Architectural Decision Records (ADRs)
    - Design principles and integration patterns
  - Separate from AI-specific copilot-instructions.md, focused on human understanding
  - Referenced in README.md documentation section
- **Examples Guide for Contributors** (2026-01-31)
  - Created comprehensive `examples/README.md` (350+ lines)
  - Complete guide for creating new language integration examples
  - Sections include:
    - Directory structure template
    - Required README.md sections (11 sections)
    - Configuration checklist (30+ items)
    - Testing requirements
    - Example complexity guidelines (beginner/intermediate/advanced)
    - Language-specific considerations (6 languages documented)
    - Quick decision guide and submission process
  - References existing shell and nodejs examples as templates
  - Roadmap for future examples (Python, Java, Go, TypeScript, Ruby, Rust)
- **Structure Validation Script** (2026-01-31)
  - Created `scripts/validate_structure.py` (400+ lines)
  - Validates repository directory structure:
    - Detects empty directories (excluding allowed exceptions)
    - Identifies undocumented directories not in known structure
    - Verifies required directories exist
  - Features:
    - Auto-fix mode (--fix) to remove empty directories
    - Quiet mode (--quiet) for CI integration
    - Clear exit codes (0=valid, 1=errors, 2=script error)
  - Integrated into pre-commit hooks as local custom hook
  - Documented in `scripts/README.md`
- **API Reference Documentation** (2026-02-01)
  - Created comprehensive API reference documentation in `docs/api/` (2,228 lines total)
  - Three complete reference guides:
    - `CONFIG_REFERENCE.md`: Complete `.workflow-config.yaml` field reference (695 lines)
    - `PLACEHOLDER_REFERENCE.md`: Placeholder patterns and substitution guide (756 lines)
    - `PROJECT_KINDS_SCHEMA.md`: Project kinds schema v1.2.0 reference (777 lines)
  - Each guide includes:
    - Table of contents with deep linking
    - Complete field/placeholder descriptions
    - Valid values and examples
    - Cross-references to related configuration
    - Best practices and validation rules
  - Referenced in README.md and copilot-instructions.md
  - Provides developer-friendly API documentation separate from integration guides

### Changed
- **Directory Structure Improvements** (2026-01-31)
  - Renamed `github/` → `workflow-templates/` to eliminate confusion with `.github/`
    - `.github/` contains GitHub metadata (copilot-instructions.md, DESCRIPTION.md)
    - `workflow-templates/` contains workflow templates for projects to copy
  - Updated all documentation references to use new directory name
  - Updated examples (shell, integration docs) with correct paths
- **Documentation Improvements** (2026-01-31)
  - Updated `docs/INTEGRATION.md`:
    - Completed PROJECT_TYPE/PROJECT_KIND lists with all 8 project kinds
    - Added clear distinction between hyphenated types and underscored kinds
    - Included reference to `config/project_kinds.yaml` for validation rules
  - Fixed placeholder examples in `config/.workflow-config.yaml.template`:
    - Corrected PROJECT_TYPE examples (nodejs-application, configuration-library)
    - Updated PROJECT_KIND examples to match schema (shell_script_automation, nodejs_api, etc.)
  - Removed broken reference to `docs/reference/documentation-style-guide.md` in CONTRIBUTING.md
    - Documentation standards already well-defined inline in the document
- **Parent Project Context Warnings** (2026-01-31)
  - Added context warnings to distinguish ai_workflow_core (config templates) from parent ai_workflow (execution engine):
    - `docs/guides/MULTI_STAGE_PIPELINE_GUIDE.md`
    - `docs/guides/ML_OPTIMIZATION_GUIDE.md`
    - Previously added to `docs/guides/PROJECT_REFERENCE.md` and `docs/CONTRIBUTING.md`
- **Enhanced .gitignore** (2026-01-31)
  - Expanded from 1 line to comprehensive coverage (150+ lines)
  - Added patterns for:
    - Editor/IDE files (VSCode, JetBrains, Vim, Emacs, Sublime, Atom)
    - OS-specific files (macOS, Windows, Linux)
    - Python development files (for validation scripts)
    - Node.js patterns (for projects using this as submodule)
    - Logs, temporary files, backups
  - Organized with clear section headers for maintainability
  - Added inline comments explaining optional patterns

### Fixed
- **Configuration Schema Alignment** (2026-01-31)
  - Aligned `config/ai_prompts_project_kinds.yaml` version 1.1.0 → 1.2.0 to match `config/project_kinds.yaml`
  - All 8 project kinds now have corresponding AI prompts
  - Verified YAML syntax validity across all configuration files

### Removed
- **Empty Placeholder Directories** (2026-01-31)
  - Removed 8 empty placeholder directories from `docs/`:
    - `docs/architecture/`
    - `docs/reference/`
    - `docs/testing/`
    - `docs/reports/` (and subdirectories: analysis/, bugfixes/, implementation/)
    - `docs/workflow-automation/`
  - Removed broken references to non-existent docs in `docs/CONTRIBUTING.md`:
    - Replaced parent project tool/doc references with ai_workflow_core specific resources
    - Updated Additional Resources section with actual available documentation
  - Updated `.github/copilot-instructions.md` to remove placeholder directory references
  - Rationale: Empty directories create false impression of content and should be created when needed

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
