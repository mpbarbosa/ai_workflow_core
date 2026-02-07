# API Reference Documentation

**Purpose**: Complete technical references for ai_workflow_core configuration files and schemas.

## What Belongs Here

✅ **API documentation for**:
- Configuration file schemas (`.workflow-config.yaml`)
- Placeholder reference guides
- Project kinds schemas (`project_kinds.yaml`)
- AI helpers configuration
- AI prompts configuration

❌ **What does NOT belong here**:
- User guides (→ `docs/guides/`)
- Tutorials (→ `docs/guides/`)
- Implementation examples (→ `examples/`)
- Developer guides (→ `docs/developers/`)

## Current Files

| File | Description | Lines |
|------|-------------|-------|
| [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md) | Complete `.workflow-config.yaml` field reference | 695 |
| [PLACEHOLDER_REFERENCE.md](PLACEHOLDER_REFERENCE.md) | Placeholder patterns and substitution guide | 756 |
| [PROJECT_KINDS_SCHEMA.md](PROJECT_KINDS_SCHEMA.md) | Project kinds schema v1.2.0 reference | 777 |
| [AI_HELPERS_REFERENCE.md](AI_HELPERS_REFERENCE.md) | AI persona definitions and token efficiency | 1,177 |
| [AI_PROMPTS_REFERENCE.md](AI_PROMPTS_REFERENCE.md) | Project-specific AI prompt templates | 1,197 |

**Total**: 5 files, 4,602 lines

## Adding New API Documentation

When adding new API reference documentation to this directory:

1. **Name the file**: `<COMPONENT>_REFERENCE.md` or `<COMPONENT>_SCHEMA.md`
2. **Follow the structure**:
   ```markdown
   # Component Reference
   
   **Version**: X.X.X
   **Last Updated**: YYYY-MM-DD
   
   ## Overview
   ## Schema Definition
   ## Field Reference
   ## Examples
   ## Validation Rules
   ```
3. **Update this README**: Add your file to the table above
4. **Link from main docs**: Update relevant docs to reference your API doc
5. **Keep it technical**: Focus on "what" and "how", not "why" (that's for guides)

## Style Guidelines

- Use tables for field references
- Include type information (string, number, boolean, array, object)
- Show example values
- Document default values
- List validation rules
- Cross-reference related configuration

## Examples

**Good API documentation**:
- Field-by-field reference with types and defaults
- Schema validation rules
- Complete YAML/JSON examples
- Error messages and troubleshooting

**Not API documentation** (goes elsewhere):
- "How to configure X for beginners" → `docs/guides/`
- "Step-by-step setup tutorial" → `docs/guides/`
- "Best practices for Y" → `docs/guides/` or `docs/advanced/`

---

**Last Updated**: 2026-02-07
