# Reference Documentation

**Version**: 1.0.0  
**Last Updated**: 2026-02-10

> **Purpose**: Quick reference guides and cheat sheets for ai_workflow_core

## Overview

This directory contains quick reference documentation including cheat sheets, command references, and lookup tables.

## What Belongs Here

✅ **Quick reference materials**:
- Command cheat sheets
- Configuration quick references
- Common patterns and snippets
- Lookup tables
- Keyboard shortcuts
- CLI command references

❌ **What does NOT belong here**:
- Complete API documentation (→ `docs/api/`)
- Tutorials and guides (→ `docs/guides/`)
- Architecture documentation (→ `docs/architecture/`)

---

## Available References

### 1. Quick Reference Card

**File**: `QUICK_REFERENCE.md`

Essential commands and patterns on one page:
- Setup commands
- Common workflows
- Validation commands
- Troubleshooting shortcuts

### 2. Configuration Quick Reference

**Location**: `docs/INTEGRATION_QUICK_REFERENCE.md` (root docs)

Quick lookup for:
- Placeholder patterns
- Common configurations
- Directory structures
- File templates

### 3. Command Cheat Sheet

**File**: `COMMAND_CHEAT_SHEET.md`

All commands organized by category:
- Git submodule commands
- Validation commands
- Cleanup commands
- CI/CD commands

---

## Creating Reference Documents

### Structure Template

```markdown
# [Topic] Quick Reference

**Version**: 1.0.0  
**Last Updated**: YYYY-MM-DD

## Quick Commands

| Task | Command |
|------|---------|
| Task 1 | `command here` |
| Task 2 | `command here` |

## Common Patterns

### Pattern 1
\`\`\`bash
# Code example
\`\`\`

### Pattern 2
\`\`\`yaml
# Config example
\`\`\`

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Issue 1 | Fix 1 |
| Issue 2 | Fix 2 |
```

### Best Practices

1. **One page per reference**: Keep references focused and scannable
2. **Tables for lookups**: Use tables for quick scanning
3. **Minimal explanation**: Just enough context, reference full docs
4. **Working examples**: Every command should be copy-pasteable
5. **Visual hierarchy**: Use clear headings and formatting

---

## Style Guidelines

- **Concise**: No lengthy explanations
- **Scannable**: Easy to find information quickly
- **Complete**: Every command/pattern should work
- **Updated**: Keep in sync with full documentation
- **Cross-referenced**: Link to detailed docs

---

## Related Documentation

- [API Reference](../api/README.md) - Complete API documentation
- [User Guides](../guides/README.md) - Step-by-step tutorials
- [Integration Quick Reference](../INTEGRATION_QUICK_REFERENCE.md) - Setup quick reference

---

**Last Updated**: 2026-02-10
