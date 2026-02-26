# Changelog

All notable changes to the AI Workflow Core project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.1/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **JavaScript Developer Persona** (2026-02-26, v6.5.0)
  - Added `javascript_developer_prompt`: JavaScript Developer persona for `package.json` management
  - **Target audience**: Developers & Project Teams creating, maintaining, and updating package.json
  - **Expertise areas**:
    - Dependency management: Runtime vs. devDependencies, semver version strategies (`^`, `~`, exact), npm/yarn/pnpm
    - Script authoring: `start`, `test`, `build`, `lint`, `format` command-line aliases, pre/post hooks, cross-env
    - Project metadata: `name`, `version`, `description`, `license`, `main`/`module`/`exports`, `repository`, `keywords`
    - Security hygiene: `npm audit`, lockfile integrity, `overrides`/`resolutions` for transitive vulnerability patching
    - Compatibility: `engines.node`, `peerDependencies`, `browserslist`, CJS/ESM `type` field
    - Monorepo/workspaces: `workspaces` array, dependency hoisting, Turborepo/Nx integration
  - **Methodology**: Dependency classification framework, semver selection strategy, script composition patterns, security governance
  - **Quality checklist**: 12 checks covering name format, entry points, dependency placement, scripts, audit, lockfile, Node.js engine, and privacy
  - **Complements existing personas**:
    - `front_end_developer_prompt`: UI/code implementation (consumes packages declared here)
    - `configuration_specialist_prompt`: Broader project configuration management
  - **Total personas**: 18 (was 17)
  - **Updated files**:
    - `config/ai_helpers.yaml`: v6.4.0 → v6.5.0 (new persona appended, version header updated)
    - `.github/copilot-instructions.md`: persona count, list, and detail section updated


  - Enhanced `technical_writer_prompt` with **STEP 1.5: DIRECTORY STRUCTURE ANALYSIS**
  - **Purpose**: Prevents duplicate documentation file creation by checking subdirectories before creating new files
  - **Real-world problem solved**: AI created `docs/USER_GUIDE.md` when `docs/user/USER_GUIDE.md` already existed
  - **Enhancement includes**:
    1. Scan documentation organization (subdirectories, patterns, naming conventions)
    2. Check for similar files in ALL subdirectories before creating (prevents duplicates)
    3. File location decision rules (priority: UPDATE existing > FOLLOW pattern > ROOT only if flat)
    4. Examples of correct behavior with ✅ markers (e.g., "UPDATE docs/user/USER_GUIDE.md, not create docs/USER_GUIDE.md")
    5. Examples of incorrect behavior with ❌ markers to avoid (e.g., "Creating docs/USER_GUIDE.md when docs/user/USER_GUIDE.md exists")
    6. Directory pattern recognition (by audience, type, feature, mixed/hybrid)
    7. When to ask vs. decide guidance (clear patterns = decide, ambiguous = ask)
  - **Specifications**:
    - ~54 lines of guidance (~700 tokens) inserted between STEP 1 and STEP 2
    - Token efficiency maintained: Concise examples, clear decision rules, no bloat
    - Backward compatible: Existing workflows benefit immediately without changes
  - **Prevention example**: "Before creating docs/USER_GUIDE.md, check for docs/user/USER_GUIDE.md"
  - **Updated files**:
    - `config/ai_helpers.yaml`: v6.1.0 → v6.2.1 (inserted STEP 1.5 at line 449-502)
    - Version history entry added documenting the enhancement

- **Requirements Engineering Persona** (2026-02-11, v6.1.0)
  - Added `requirements_engineer_prompt`: Senior requirements engineer persona for comprehensive requirements engineering
  - **Expertise areas**:
    - Requirements elicitation (interviews, workshops, user observation, prototyping)
    - Requirements analysis and refinement (ambiguity resolution, feasibility analysis, prioritization)
    - Requirements specification (user stories, use cases, acceptance criteria, functional/non-functional requirements)
    - Requirements traceability and management (change tracking, dependency analysis, requirements-to-test mapping)
    - Requirements validation and verification (reviews, walkthroughs, SMART criteria verification, testability assessment)
    - Standards and frameworks (IEEE 29148, BABOK, Agile user stories, Gherkin/BDD scenarios, Cockburn use cases)
  - **Key features**:
    - Necessity evaluation framework (9-point criteria to avoid unnecessary requirements generation)
    - Supports multiple specification formats (user stories, use cases, Gherkin scenarios, functional requirements)
    - Full requirements engineering lifecycle (elicitation → analysis → specification → traceability → validation)
    - SMART requirements validation (Specific, Measurable, Achievable, Relevant, Testable)
    - Language-agnostic with `{language_specific_requirements}` placeholder for future enhancement
  - **Integration with existing personas**:
    - `requirements_engineer_prompt`: Defines WHAT the system SHOULD do
    - `technical_writer_prompt`: Documents WHAT the system DOES (after implementation)
    - `ui_ux_designer_prompt`: Defines HOW users will interact (informed by requirements)
    - `test_strategy_prompt`: Validates requirements are met (traceability)
  - **Token efficiency**: Follows v4.0.0 patterns (uses `*behavioral_actionable` anchor, concise output format)
  - **Updated files**:
    - `config/ai_helpers.yaml`: v6.0.0 → v6.1.0 (added requirements_engineer_prompt at line 991)
    - `docs/api/AI_HELPERS_REFERENCE.md`: v6.0.0 → v6.1.0 (added comprehensive documentation section)
    - **Persona count**: 11 → 12 core AI personas (9 general + 3 specialized)

### Changed
- **Documentation Updated for Workflow Steps Configuration** (2026-02-10)
  - Updated `docs/api/CONFIG_REFERENCE.md` to v1.1.0 (695 → 835 lines)
  - Added comprehensive documentation for `workflow.steps` configuration
    - Documents 16-step structure with ID-based step definitions
    - Explains step fields: id, name, file, description, phase, can_parallelize, dependencies, ai_persona, required
    - Includes complete examples for step definitions
  - Added documentation for `workflow.phases` configuration
    - Documents 7 standard phases: pre-flight, analysis, structure, testing, quality, context, finalization, versioning, completion
    - Explains phase fields: description, steps
    - Shows phase organization and execution order
  - Updated `.github/copilot-instructions.md` with new CONFIG_REFERENCE.md file size
  - **Impact**: Configuration reference now complete for both basic and advanced workflow configurations
  - **Note**: Both ID-based (0a-16) and name-based (v4.0.0 descriptive names) step formats are supported
- **Workflow Phase Reorganization** (2026-02-10, commit 9e4d0f3)
  - Reorganized workflow execution phases for better clarity and logical flow
  - **Phase changes**:
    - Removed `specialized` phase (was steps 14, 15)
    - Split into two focused phases:
      - `finalization`: Documentation linting, prompt optimization, and UX analysis (steps 12, 13, 14)
      - `versioning`: Version management and changelog generation (step 15)
    - Renamed `git-finalization` → `completion` for consistency
  - **Step updates**:
    - Step 14 (UX Analysis): Moved from `specialized` to `finalization` phase
    - Step 15 (Version Update): Moved from `specialized` to new `versioning` phase
    - Step 16 (Git Finalization): Phase renamed to `completion`, dependencies simplified (`["15", "11"]` → `["15"]`)
  - **Impact**: Improved workflow phase semantics, clearer execution order, better phase grouping
  - **Backward Compatibility**: Phase names changed in `.workflow-config.yaml` only, no breaking changes to templates
- **AI Helpers Configuration Updated to v6.0.0** (2026-02-09)
  - Added `ui_ux_designer_prompt`: Senior UI/UX designer persona for user experience and visual design
  - Refined `front_end_developer_prompt`: Removed UI/UX design overlap, strengthened technical implementation focus
  - **Clear separation of concerns** matching real-world team structures:
    - `ui_ux_designer_prompt`: User research, visual design, interaction patterns, usability testing, information architecture
    - `front_end_developer_prompt`: Code implementation, architecture, performance optimization, front-end testing, build configuration
  - **UI/UX Designer expertise areas**:
    - User research, personas, journey mapping
    - Wireframing, prototyping, visual design
    - Interaction design and usability testing
    - Design systems and accessibility from user perspective
    - Information architecture and responsive design strategy
  - **Front End Developer refinements**:
    - Removed UI/UX design aspects (now in dedicated persona)
    - Strengthened technical implementation focus
    - Enhanced performance optimization guidance
    - Expanded testing and build configuration sections
    - Added cross-browser compatibility focus
  - Both personas follow v4.0.0 token efficiency patterns (anchors, concise output format)
  - No token overhead: Only one persona loads per workflow step
  - **Persona count**: Now **11 personas** (8 general + 3 specialized: front-end, UI/UX, config)

### Changed
- **Migration Guide Updated to v1.1.0** (2026-02-09)
  - Updated compatibility matrix with source and target projects
  - Added section on Source ai_workflow v4.0.0 breaking changes (config-driven execution)
  - Added section on Migration Target ai_workflow.js v1.3.0 (Phase 8 complete)
  - Documented step renaming: `step_01` → `documentation_updates`, etc.
  - Updated notable changes for v1.0.1 section with detailed project status
  - Clarified 100% backward compatibility in source ai_workflow v4.0.0

### Added
- **Comprehensive API Documentation for AI Prompts** (2026-02-07)
  - Added `docs/api/AI_HELPERS_REFERENCE.md` (1,177 lines) - Complete reference for `config/ai_helpers.yaml`
    - Documents 8 AI personas (doc_analysis, consistency, technical_writer, test_strategy, quality, issue_extraction, markdown_lint, version_manager)
    - Explains YAML anchor system for token efficiency (~1,400-1,500 tokens saved per workflow)
    - Details language-specific standards injection for 8 programming languages
    - Includes prompt builder integration patterns and customization guide
    - Documents version history from v3.0.0 to v4.1.0 with token optimization tracking
  - Added `docs/api/AI_PROMPTS_REFERENCE.md` (1,197 lines) - Complete reference for `config/ai_prompts_project_kinds.yaml`
    - Documents 11 project kinds with specialized AI prompt templates
    - Maps project kinds to 3-4 personas per type (documentation_specialist, test_engineer, code_reviewer, ux_designer)
    - Explains role/task_context/approach patterns across all project types
    - Includes verification checklist structure for shell_script_automation
    - Documents alignment with `project_kinds.yaml` v1.2.0 (8 aligned, 3 legacy)
    - Details two-layer prompt system integration with `ai_helpers.yaml`
  - Updated `README.md` to link to new API documentation
  - Updated `.github/copilot-instructions.md` with new API doc references (exact line counts)
  - Added "AI Prompt Customization" section to `docs/INTEGRATION.md`
    - Explains two-layer AI system (generic personas + project-specific prompts)
    - Documents available project kinds and selection strategy
    - Details token efficiency benefits (~$0.042-0.045 saved per workflow)
    - Provides customization options and best practices

### Changed
- **Cleanup Script Updated to v2.0.0** (2026-02-01)
  - Updated `scripts/cleanup_artifacts.sh.template` to v2.0.0
  - **BREAKING**: Changed WORKFLOW_DIR from `${REPO_ROOT}/src/workflow` to `${REPO_ROOT}/.ai_workflow`
  - Added `--summaries` option to clean summary files
  - Updated cache cleanup to use `.incremental_cache/` (was `.ai_cache/`)
  - Added note about Node.js cleanup_handlers.js implementation (v2.0.0) in parent project
  - Aligned directory structure with current .ai_workflow/ standard
  - Updated version from 1.0.1 to 2.0.0, date from 2025-12-20 to 2026-02-01
- **Parent Project Status Update** (2026-02-09)
  - **Source ai_workflow (Bash)** updated to v4.0.0 (released 2026-02-08)
  - **Major Breaking Changes in Source v4.0.0**:
    - Configuration-driven step execution system
    - Steps renamed to descriptive names (e.g., `documentation_updates` instead of `step_01`)
    - Step registry system with YAML parser and topological sort
    - Dynamic step loader with on-demand module loading
    - All orchestrators and optimization modules refactored
    - 21 step files renamed, 8 library directories renamed
    - 100% backward compatible with legacy mode
  - **Migration Target ai_workflow.js (Node.js)** updated to v1.3.0
  - Phase 8 completed: Performance Optimization (11 modules)
  - All 11 performance optimization modules implemented:
    - performance.js, performance_monitoring.js, ml_optimization.js
    - analysis_cache.js, incremental_analysis.js
    - docs_only_optimization.js, code_changes_optimization.js, full_changes_optimization.js
    - multi_stage_pipeline.js, step1_incremental.js, step1_parallel.js
  - Phase 9 in progress: Step Implementations (19 workflow steps)
  - Total tests in parent project: 3,417 passing (18 skipped, 0 failures)
  - Performance improvements: 40-85% faster with optimizations, ML-driven skip prediction
  - Node.js requirement: 18+
  - Core templates remain compatible with parent project v1.3.0
  - Documentation updated to reference parent project Phase 8 completion

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

## [1.0.1] - 2026-01-29

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

- **1.0.1** (2026-01-29) - Initial release

## Migration Notes

### From ai_workflow

If you're migrating from using ai_workflow directly:

1. Add ai_workflow_core as submodule: `git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core`
2. Copy configuration: `cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml`
3. Customize for your language and build system
4. Keep your language-specific workflow implementation separate

---

For questions or issues, see [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues).
