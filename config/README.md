# Configuration Templates

This directory contains configuration file templates that can be customized for language-specific projects.

## Files

### `.workflow-config.yaml.template`
Main workflow configuration template. Copy to your project root as `.workflow-config.yaml` and customize with your project details.

**Placeholders:**
- `{{PROJECT_NAME}}` - Your project name
- `{{PROJECT_TYPE}}` - Project type (e.g., bash-automation-framework, nodejs-application)
- `{{PROJECT_DESCRIPTION}}` - Project description
- `{{PROJECT_KIND}}` - Project kind (e.g., shell_automation, web_application)
- `{{VERSION}}` - Current version
- `{{LANGUAGE}}` - Primary language (bash, javascript, python, etc.)
- `{{BUILD_SYSTEM}}` - Build system (none, npm, webpack, etc.)
- `{{TEST_FRAMEWORK}}` - Test framework (shell-script, jest, pytest, etc.)
- `{{TEST_COMMAND}}` - Command to run tests
- `{{LINT_COMMAND}}` - Command to run linter

### `.gitignore.template`
Git ignore patterns for workflow artifacts. Copy to your project root as `.gitignore` (or append to existing).

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

## AI Prompt Configuration Files

### `ai_helpers.yaml`
Core AI prompt templates for workflow automation. Contains 1,900+ lines of optimized prompts for 14 AI personas including:
- Documentation Specialist
- Test Engineer
- Code Quality Analyst
- Prompt Engineer
- And more...

Uses YAML anchors for token efficiency and reduced duplication.

### `ai_prompts_project_kinds.yaml`
Language-specific prompt customizations for different project types (bash, javascript, python, etc.).

### `project_kinds.yaml`
Project kind definitions and their characteristics.

### `paths.yaml`
Path configuration for workflow artifacts and directories.

### Usage

These files work together with the workflow automation system:
1. `ai_helpers.yaml` provides base prompt templates
2. `ai_prompts_project_kinds.yaml` adds language-specific context
3. `project_kinds.yaml` defines project types
4. `paths.yaml` configures artifact locations

Copy these to your project if you're building a workflow automation system that needs AI prompt management.
