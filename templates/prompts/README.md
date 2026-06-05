# templates/prompts/

This directory contains **GitHub Copilot prompt files** that consuming projects can copy into their own `.github/prompts/` directory.

## Format

Each file follows the [GitHub Copilot prompt file format](https://docs.github.com/en/copilot/tutorials/customization-library/prompt-files/your-first-prompt-file):

- **Filename**: `{name}.prompt.md`
- **Frontmatter**: `agent: 'agent'` and `description` fields
- **Variables**: `${input:identifier:prompt text}` for user-provided context at invocation time
- **Body**: checklist or instructional content in Markdown

## Available prompt files

| File | Description |
|------|-------------|
| `async-flow-debug-checklist.prompt.md` | Debugging async operations and network request issues |
| `browser-api-integration-checklist.prompt.md` | Debugging browser API integration issues |
| `data-structure-debug-checklist.prompt.md` | Debugging data structure mismatches between components |
| `observer-pattern-debug-checklist.prompt.md` | Debugging Observer/Subject pattern integration issues |

## Usage

1. Copy the relevant file(s) into your project's `.github/prompts/` directory:
   ```bash
   cp path/to/ai_workflow_core/templates/prompts/async-flow-debug-checklist.prompt.md \
      .github/prompts/
   ```

2. In VS Code, Visual Studio, or JetBrains with GitHub Copilot Chat, type `/async-flow-debug-checklist` (or the relevant prompt name) to invoke it.

3. Copilot will prompt you for the `symptom` input variable, then walk through the checklist in the context of your codebase.

## Relationship to `templates/debugging/`

The `.md` files in `templates/debugging/` are the original readable reference versions of these checklists. The `.prompt.md` files here are the Copilot-invocable counterparts — same content, with frontmatter and an input variable added. Both are maintained in parallel; neither replaces the other.
