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

### `prompt_roles.yaml` *(new in v1.2.0)*
**Single source of truth for all AI persona role definitions.**

Contains 29 named role entries, each with:
- `description` — one-line summary of the role's expertise
- `role_prefix` — the full identity/role text injected into the AI prompt

Personas in `ai_helpers.yaml` reference these roles via a `role_ref:` key instead of
inlining the role text directly. The TypeScript config-loader (`src/loader.ts`) resolves
references at load time.

**Schema:**
```yaml
roles:
  <role_key>:
    description: "One-line summary"
    role_prefix: |
      You are a senior ...
```

**Adding a new role:**
1. Add an entry under `roles:` with a unique snake_case key.
2. Provide `description:` and `role_prefix:` fields.
3. Reference it in `ai_helpers.yaml` with `role_ref: <your_key>`.
4. Run `npm test` to verify the reference resolves correctly.

See `docs/api/PROMPT_ROLES_REFERENCE.md` for the full API reference.

### `ai_helpers.yaml`
Core AI prompt templates for workflow automation. Contains 29 personas across
documentation, front-end, testing, development, debugging, and cloud categories.

As of v1.2.0, each persona uses `role_ref: <key>` to reference its role definition
from `prompt_roles.yaml`, instead of inlining the role text:

```yaml
# v1.2.0+ pattern
doc_analysis_prompt:
  role_ref: doc_analysis          # resolved from config/prompt_roles.yaml
  behavioral_guidelines: ...
  task_template: |
    ...
  approach: |
    ...
```

Uses YAML anchors (`&behavioral_actionable`, `&behavioral_structured`,
`&behavioral_generative`) for token-efficient sharing of behavioral guidelines
across personas.

**Usage Guidelines:**
- Use `technical_writer_prompt` for: New projects, major rewrites, undocumented codebases
- Use `doc_analysis_prompt` for: Incremental updates after code changes
- Use `consistency_prompt` for: Documentation audits and quality assurance
- Use `e2e_test_engineer_prompt` for: E2E testing strategy for front-end projects
- Use `test_strategy_prompt` for: Strategic test coverage analysis (WHAT to test)
- Use `front_end_developer_prompt` for: Front-end code implementation and unit testing

### `ai_prompts_project_kinds.yaml`
Language-specific prompt customizations for different project types (bash, javascript, python, etc.).

### `project_kinds.yaml`
Project kind definitions and their characteristics (8 kinds: shell_script_automation, nodejs_api,
react_spa, python_app, client_spa, static_website, configuration_library, generic).

### Usage

These files work together with the workflow automation system:
1. `prompt_roles.yaml` provides the central role/identity definitions
2. `ai_helpers.yaml` provides base prompt templates (references roles via `role_ref:`)
3. `ai_prompts_project_kinds.yaml` adds language-specific context
4. `project_kinds.yaml` defines project types

The TypeScript config-loader (`src/`) loads and resolves these files programmatically:

```typescript
import { loadPromptRoles, loadPersonas, resolveAllPersonas } from 'ai_workflow_core';

const roles = loadPromptRoles('config/prompt_roles.yaml');
const personas = loadPersonas('config/ai_helpers.yaml');
const resolved = resolveAllPersonas(personas, roles);

console.log(resolved['doc_analysis_prompt'].role_prefix); // full role text
```

Copy these to your project if you're building a workflow automation system that needs AI prompt management.

**Note:** Path configurations should be defined in your project-specific configuration files, not in the core templates.

