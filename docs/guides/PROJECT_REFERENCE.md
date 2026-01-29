# AI Workflow Automation - Project Reference

**SINGLE SOURCE OF TRUTH**  
**Version**: v3.0.0  
**Last Updated**: 2026-01-28

> ⚠️ **Important**: This document is the authoritative source for project statistics, features, and module lists. All other documentation should reference this file, not duplicate its content.

## Quick Reference

### Project Identity

- **Repository**: [github.com/mpbarbosa/ai_workflow](https://github.com/mpbarbosa/ai_workflow)
- **License**: MIT
- **Current Version**: v3.0.0
- **Previous Repository**: mpbarbosa_site (migrated 2025-12-18)
- **Primary Maintainer**: Marcelo Pereira Barbosa ([@mpbarbosa](https://github.com/mpbarbosa))
- **Contact**: mpbarbosa@gmail.com

### Key Statistics

- **Total Lines**: 26,562 (22,411 shell + 4,151 YAML)
- **Total Modules**: 61 (33 libraries + 16 steps + 7 configs + 4 orchestrators + 1 pre-commit)
- **Test Coverage**: 100% (37+ automated tests)
- **Performance**: Up to 93% faster with ML optimization

## Core Features (v3.0.0)

### Workflow Pipeline
- **16-Step Automated Pipeline**: Complete workflow from analysis to finalization
- **Checkpoint Resume**: Automatic continuation from last completed step
- **Dry Run Mode**: Preview execution without changes

### AI Integration
- **14 Functional AI Personas**: Specialized roles across 16 workflow steps
- **GitHub Copilot CLI**: Primary AI integration
- **AI Response Caching**: 60-80% token usage reduction (24-hour TTL)
- **Dynamic Prompt Construction**: Context-aware AI interactions

### Performance Optimization
- **Smart Execution**: Change-based step skipping (40-85% faster)
- **Parallel Execution**: Independent steps run simultaneously (33% faster)
- **ML Optimization** (NEW v2.7.0): Predictive step durations (15-30% additional improvement)
- **Multi-Stage Pipeline** (NEW v2.8.0): Progressive validation (80%+ complete in 2 stages)
- **AI Response Caching**: Automatic with TTL management
- **Combined Optimization**: Up to 93% faster with ML for simple changes

### Project Intelligence
- **Target Project Support**: Run on any project with `--target` option
- **Tech Stack Detection**: Automatic technology identification
- **Project Kind Classification**: 12+ project types supported
- **Configuration Wizard**: Interactive setup with `--init-config`

### Developer Experience
- **Pre-Commit Hooks** (NEW v3.0.0): Fast validation checks (< 1 second) to prevent broken commits
- **Auto-Documentation** (NEW v2.9.0): Generate reports and CHANGELOG from workflow execution
- **Auto-Commit Workflow** (v2.6.0): Automatic artifact commits with intelligent message generation
- **Workflow Templates** (v2.6.0): Pre-configured scripts (docs-only 3-4min, test-only 8-10min, feature 15-20min)
- **IDE Integration** (v2.6.0): VS Code tasks with keyboard shortcuts, JetBrains and Vim/Neovim guides

### Analysis & Quality
- **UX Analysis** (v2.4.0): AI-powered UI/UX with accessibility checking
- **Dependency Visualization**: Interactive Mermaid diagrams
- **Metrics Collection**: Automatic performance tracking
- **Code Quality Checks**: Comprehensive validation

## Module Inventory

### Library Modules (33 total in src/workflow/lib/)

> **Note**: Module count updated 2026-01-28 to reflect actual inventory including recent additions.

#### Core Modules (12 modules)
- `ai_helpers.sh` (102K) - AI integration with 14 functional personas
- `tech_stack.sh` (47K) - Technology stack detection
- `workflow_optimization.sh` (31K) - Smart execution and parallel processing
- `project_kind_config.sh` (26K) - Project kind configuration
- `change_detection.sh` (17K) - Git diff analysis
- `metrics.sh` (16K) - Performance tracking
- `performance.sh` (16K) - Timing utilities
- `step_adaptation.sh` (16K) - Dynamic step behavior
- `config_wizard.sh` (16K) - Interactive configuration
- `dependency_graph.sh` (15K) - Execution dependencies
- `health_check.sh` (15K) - System validation
- `file_operations.sh` (15K) - Safe file operations

#### Supporting Modules (21 modules)
- `edit_operations.sh` (14K) - File editing operations
- `project_kind_detection.sh` (14K) - Project type detection
- `doc_template_validator.sh` (13K) - Template validation
- `session_manager.sh` (12K) - Process management
- `ai_cache.sh` (11K) - AI response caching (v2.3.0)
- `metrics_validation.sh` (11K) - Metrics validation
- `third_party_exclusion.sh` (11K) - File filtering
- `argument_parser.sh` (9.7K) - CLI argument parsing
- `validation.sh` (9.7K) - Input validation
- `step_execution.sh` (9.2K) - Step lifecycle
- `ai_prompt_builder.sh` (8.4K) - Prompt construction
- `ai_personas.sh` (7.0K) - Persona management
- `utils.sh` (6.9K) - Common utilities
- `git_cache.sh` (6.8K) - Git operations caching
- `cleanup_handlers.sh` (5.0K) - Error handling
- `summary.sh` (3.8K) - Report generation
- `ai_validation.sh` (3.6K) - AI response validation
- `backlog.sh` (2.7K) - Execution history
- `test_broken_reference_analysis.sh` (2.4K) - Reference validation testing
- `config.sh` (2.1K) - YAML configuration
- `colors.sh` (637 bytes) - Terminal formatting

### Step Modules (15 total in src/workflow/steps/)

**Execution Order** (Step 11 MUST be last):

1. `step_00_analyze.sh` - Pre-flight analysis
2. `step_0a_version_update.sh` - Semantic version updates (PRE-PROCESSING - NEW v2.6.0)
3. `step_01_documentation.sh` - Documentation updates
4. `step_02_consistency.sh` - Cross-reference validation
5. `step_03_script_refs.sh` - Script reference validation
6. `step_04_directory.sh` - Directory structure validation
7. `step_05_test_review.sh` - Test coverage review
8. `step_06_test_gen.sh` - Test case generation
9. `step_07_test_exec.sh` - Test execution
10. `step_08_dependencies.sh` - Dependency validation
11. `step_09_code_quality.sh` - Code quality checks
12. `step_10_context.sh` - Context analysis
13. `step_12_markdown_lint.sh` - Markdown linting
14. `step_13_prompt_engineer.sh` - Prompt engineering (ai_workflow only)
15. `step_14_ux_analysis.sh` - UX/UI analysis (NEW v2.4.0)
16. `step_11_git.sh` - **Git operations [FINAL STEP - commits all changes]**

### Configuration Files (6 total in src/workflow/config/)

1. `paths.yaml` - Path configuration
2. `ai_helpers.yaml` - Base AI prompt templates (9 templates)
3. `ai_prompts_project_kinds.yaml` - Project-specific AI prompts
4. `project_kinds.yaml` - Project type definitions
5. `step_relevance.yaml` - Step applicability matrix
6. `.workflow-config.yaml` - Project-specific configuration (in project root)

## AI Personas (14 total)

1. **documentation_specialist** - Documentation updates (context-aware)
2. **consistency_analyst** - Cross-reference checks
3. **code_reviewer** - Code quality review
4. **test_engineer** - Test generation
5. **dependency_analyst** - Dependency analysis
6. **git_specialist** - Git operations
7. **performance_analyst** - Performance optimization
8. **security_analyst** - Security scanning
9. **markdown_linter** - Markdown validation
10. **context_analyst** - Context analysis
11. **script_validator** - Shell script validation
12. **directory_validator** - Directory validation
13. **test_execution_analyst** - Test execution analysis
14. **ux_designer** - UX/UI analysis (NEW v2.4.0)

### AI Persona Architecture

The AI Workflow uses a **flexible persona system** with dynamic prompt construction:

**System Design**:
- **9 Base Prompt Templates** in `src/workflow/lib/ai_helpers.yaml`
  - doc_analysis_prompt, consistency_prompt, test_strategy_prompt, quality_prompt, issue_extraction_prompt, markdown_lint_prompt, language_specific_documentation, language_specific_quality, language_specific_testing

- **4 Specialized Persona Types** in `src/workflow/config/ai_prompts_project_kinds.yaml`
  - documentation_specialist (adapts per project kind)
  - code_reviewer (adapts per project kind)
  - test_engineer (adapts per project kind)
  - ux_designer (NEW v2.4.0, adapts per project kind)

**How It Works**:
1. Base prompts provide general guidance applicable across project types
2. Specialized persona types customize behavior for detected project kind (Node.js API, React SPA, Python CLI, etc.)
3. System dynamically constructs prompts based on execution context
4. Language-specific enhancements automatically applied when `PRIMARY_LANGUAGE` set in `.workflow-config.yaml`

**Example**: Step 2 (Documentation Consistency) uses:
- Base: consistency_prompt
- Specialized: documentation_specialist (shell_automation variant)
- Enhancement: language_specific_documentation (if PRIMARY_LANGUAGE=bash)

This architecture enables the same workflow to intelligently adapt to different project types without code changes.

## Version History (Major Releases)

### v2.6.0 (2025-12-24)
- **Auto-commit workflow**: `--auto-commit` flag with intelligent artifact detection and message generation
- **Workflow templates**: Pre-configured scripts (docs-only, test-only, feature)
- **IDE integration**: VS Code tasks with keyboard shortcuts, JetBrains and Vim/Neovim guides
- **Step 13 bug fix**: Fixed YAML block scalar parsing for prompt engineer
- **No breaking changes** (100% backward compatible)

### v2.5.0 (2025-12-24)
- **Smart execution enabled by default**: 85% faster for docs-only changes
- **Parallel execution enabled by default**: 33% faster overall
- **Metrics dashboard tool**: Interactive performance analysis
- **Test validation enhancements**: Improved test execution framework
- **CONTRIBUTING.md updates**: Comprehensive contributor guidelines
- **No breaking changes**

### v2.4.0 (2025-12-23)
- Step 14: UX Analysis with accessibility checking
- UX Designer AI persona
- Intelligent UI detection
- Parallel execution support (Group 1)
- **No breaking changes**

### v2.3.1 (2025-12-18)
- `--no-resume` flag for checkpoint control
- Tech stack initialization
- Adaptive test execution
- Critical bug fixes

### v2.3.0 (2025-12-18)
- Smart execution with change detection
- Parallel execution
- AI response caching system
- Integrated metrics collection
- Target project option

### v2.2.0 (2025-12-17)
- Change detection and impact analysis
- Dependency graph generation
- Metrics framework

### v2.1.0 (2025-12-15)
- Complete modularization
- YAML configuration system
- Enhanced output limits

### v2.0.0 (2025-12-14)
- Initial modular architecture
- 14-step workflow pipeline
- AI integration framework

## Performance Benchmarks

### Execution Time by Change Type

| Change Type | Baseline | Smart | Parallel | Combined |
|-------------|----------|-------|----------|----------|
| Documentation Only | 23 min | 3.5 min (85% ↓) | 15.5 min (33% ↓) | 2.3 min (90% ↓) |
| Code Changes | 23 min | 14 min (40% ↓) | 15.5 min (33% ↓) | 10 min (57% ↓) |
| Full Changes | 23 min | 23 min (0% ↓) | 15.5 min (33% ↓) | 15.5 min (33% ↓) |

### Optimization Features

- **AI Response Caching**: 60-80% token reduction
- **Smart Execution**: Skips 0-9 steps based on changes
- **Parallel Execution**: 6 parallel groups, up to 6 concurrent steps
- **Checkpoint Resume**: Automatic continuation from failures

## Command Reference

### Basic Usage
```bash
cd /path/to/project
/path/to/ai_workflow/src/workflow/execute_tests_docs_workflow.sh
```

### Optimization Flags
```bash
--smart-execution    # Skip unnecessary steps (40-85% faster)
--parallel           # Run independent steps simultaneously (33% faster)
--auto               # Accept all prompts automatically
--no-ai-cache        # Disable AI response caching
--no-resume          # Force fresh start (ignore checkpoints)
```

### Configuration Flags
```bash
--target DIR         # Run on different project
--init-config        # Interactive configuration wizard
--show-tech-stack    # Display detected tech stack
--config-file FILE   # Use custom .workflow-config.yaml
```

### Analysis Flags
```bash
--show-graph         # Display dependency visualization
--dry-run            # Preview without execution
--steps N,M,...      # Run specific steps only
```

## Documentation Index

### Quick Start
- **[user-guide/feature-guide.md](user-guide/feature-guide.md)**: Complete feature guide
- **[user-guide/example-projects.md](user-guide/example-projects.md)**: Example projects and testing
- **[reference/target-project-feature.md](reference/target-project-feature.md)**: --target option guide
- **[reference/target-option-quick-reference.md](reference/target-option-quick-reference.md)**: Quick reference

### Technical Documentation
- **[archive/reports/implementation/MIGRATION_README.md](archive/reports/implementation/MIGRATION_README.md)**: Architecture overview
- **[reference/workflow-diagrams.md](reference/workflow-diagrams.md)**: Visual diagrams (17 Mermaid diagrams))
- **[developer-guide/architecture.md](developer-guide/architecture.md)**: Orchestrator design
- **[archive/](archive/)**: Comprehensive workflow docs
- **[../src/workflow/README.md](../src/workflow/README.md)**: Module API reference
- **[../.github/copilot-instructions.md](../.github/copilot-instructions.md)**: GitHub Copilot reference

### Release Documentation
- **[user-guide/release-notes.md](user-guide/release-notes.md)**: Step 14 release notes
- **[user-guide/migration-guide.md](user-guide/migration-guide.md)**: Migration guide

## Prerequisites

- **Bash**: 4.0+
- **Git**: Any recent version
- **Node.js**: v25.2.1+ (for test execution in target projects)
- **GitHub Copilot CLI**: Optional, for AI features

## How to Reference This Document

### From Markdown Files
```markdown
See [Project Reference](PROJECT_REFERENCE.md) for:
- Module inventory
- Feature list
- Version history
- Performance benchmarks
```

### From Scripts
```bash
# Reference this file as the source of truth
echo "See docs/PROJECT_REFERENCE.md for project statistics"
```

### From Documentation
Instead of duplicating lists, use references:
```markdown
The workflow includes 33 library modules (see [Project Reference](PROJECT_REFERENCE.md#module-inventory)).
```

---

**Maintenance**: Update this file when:
- Adding/removing modules
- Releasing new versions
- Changing core features
- Updating performance metrics

**Do NOT duplicate** the information in this file elsewhere. Use references instead.
