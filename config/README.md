# Configuration Templates

This directory contains configuration file templates that can be customized for language-specific projects.

## Files

### `.workflow-config.yaml.template`
Main workflow configuration template. Copy to your project root as `.workflow-config.yaml` and customize with your project details.

**Placeholders:**
- `{{PROJECT_NAME}}` - Your project name
- `{{PROJECT_TYPE}}` - Project type (e.g., bash-automation-framework, nodejs-application)
- `{{PROJECT_DESCRIPTION}}` - Project description
- `{{PROJECT_KIND}}` - Project kind (e.g., shell_script_automation, nodejs_api, react_spa) - see project_kinds.yaml
- `{{VERSION}}` - Current version
- `{{LANGUAGE}}` - Primary language (bash, javascript, python, etc.)
- `{{BUILD_SYSTEM}}` - Build system (none, npm, webpack, etc.)
- `{{TEST_FRAMEWORK}}` - Test framework (shell-script, jest, pytest, etc.)
- `{{TEST_COMMAND}}` - Command to run tests
- `{{LINT_COMMAND}}` - Command to run linter

## Usage

```bash
# From your project root with ai_workflow_core as submodule
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Edit the file and replace all {{PLACEHOLDERS}} with actual values
# Or use sed for simple replacements:
sed -i 's/{{PROJECT_NAME}}/My Project/g' .workflow-config.yaml
sed -i 's/{{LANGUAGE}}/javascript/g' .workflow-config.yaml
# ... etc
```

## Gitignore Patterns

Add these patterns to your project's `.gitignore` file to exclude workflow artifacts:

```gitignore
# AI Workflow artifacts
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
```

## AI Prompt Configuration Files

### `ai_helpers.yaml`
Core AI prompt templates for workflow automation. Contains 2,927+ lines (v6.3.0) of optimized prompts for 16 AI personas including:

**Documentation Personas:**
- **Documentation Specialist** (`doc_analysis_prompt`) - Incremental change-driven documentation updates
- **Technical Writer** (`technical_writer_prompt`) - Comprehensive from-scratch documentation creation (v4.1.0)
- **Requirements Engineer** (`requirements_engineer_prompt`) - Requirements elicitation, analysis, specification, and validation (v6.1.0)
- **Consistency Analyst** (`consistency_prompt`) - Documentation quality assurance and auditing

**Front-End Development Personas:**
- **Front-End Developer** (`front_end_developer_prompt`) - Front-end code implementation, architecture, and optimization (v4.2.0)
- **UI/UX Designer** (`ui_ux_designer_prompt`) - User experience design, visual design, and interaction patterns (v6.0.0)
- **E2E Test Engineer** (`e2e_test_engineer_prompt`) - NEW v6.3.0: End-to-end testing, browser automation, and visual testing

**Testing & Quality Personas:**
- Test Strategy Architect (`test_strategy_prompt`) - Strategic test coverage analysis
- Test Review Specialist (`step5_test_review_prompt`) - Tactical test code quality review
- Code Quality Analyst
- Dependency Auditor

**Development Personas:**
- DevOps Specialist
- Git Commit Message Expert
- Markdown Linter
- Prompt Engineer
- Version Manager

**Usage Guidelines:**
- Use `technical_writer_prompt` for: New projects, major rewrites, undocumented codebases
- Use `doc_analysis_prompt` for: Incremental updates after code changes
- Use `consistency_prompt` for: Documentation audits and quality assurance
- Use `e2e_test_engineer_prompt` for: E2E testing strategy for front-end projects (client_spa, react_spa, static_website)
- Use `test_strategy_prompt` for: Strategic test coverage analysis (WHAT to test)
- Use `front_end_developer_prompt` for: Front-end code implementation and unit testing

Uses YAML anchors for token efficiency and reduced duplication.

### `ai_prompts_project_kinds.yaml`
Language-specific prompt customizations for different project types (bash, javascript, python, etc.).

### `project_kinds.yaml`
Project kind definitions and their characteristics.

### Usage

These files work together with the workflow automation system:
1. `ai_helpers.yaml` provides base prompt templates
2. `ai_prompts_project_kinds.yaml` adds language-specific context
3. `project_kinds.yaml` defines project types

Copy these to your project if you're building a workflow automation system that needs AI prompt management.

**Note:** Path configurations should be defined in your project-specific configuration files, not in the core templates.
