# Developer Documentation

**Purpose**: Guides for developers who want to extend, customize, or contribute to ai_workflow_core.

## What Belongs Here

✅ **Developer-focused guides**:
- Template authoring guides
- Adding new project kinds
- Testing and validation procedures
- Contributing to examples
- Extending configuration schemas
- Custom validation rules

❌ **What does NOT belong here**:
- User setup guides (→ `docs/guides/`)
- API references (→ `docs/api/`)
- Architecture docs (→ `docs/ARCHITECTURE.md`)
- Advanced user patterns (→ `docs/advanced/`)

## Current Files

| File | Description | Lines |
|------|-------------|-------|
| [TEMPLATE_AUTHORING.md](TEMPLATE_AUTHORING.md) | Creating and modifying templates | 937 |

**Total**: 1 file, 937 lines

## Planned Documentation

These developer guides are planned but not yet created:

- [ ] **ADDING_PROJECT_KINDS.md** - How to add new project types to `project_kinds.yaml`
- [ ] **TESTING_VALIDATION.md** - Running and creating validation tests
- [ ] **CONTRIBUTING_EXAMPLES.md** - Guide for contributing language examples

## Adding New Developer Guides

When adding new developer documentation to this directory:

1. **Name the file**: Use gerunds (e.g., `ADDING_FEATURES.md`, `TESTING_VALIDATION.md`)
2. **Follow the structure**:
   ```markdown
   # Developer Guide: Topic
   
   **Version**: 1.0.1
   **Last Updated**: YYYY-MM-DD
   **Audience**: Contributors and maintainers
   
   > **Purpose**: What developers will learn
   
   ## Prerequisites
   ## Understanding the System
   ## Step-by-Step Guide
   ## Testing Your Changes
   ## Submitting Contributions
   ```
3. **Update this README**: Add your file to the table above
4. **Link from CONTRIBUTING.md**: Reference in main contributing guide
5. **Focus on extension**: Show how to extend, not just use

## Style Guidelines

- **Technical depth**: Assume reader has development experience
- **Code examples**: Show real implementation patterns
- **Architecture context**: Explain why things are designed certain ways
- **Testing emphasis**: Always include testing procedures
- **Contribution flow**: Connect to PR and review process
- **Best practices**: Document conventions and standards

## Guide Categories

### Template Development
- Creating new template files
- Placeholder system usage
- Template validation
- Example: TEMPLATE_AUTHORING.md

### Schema Extension
- Adding new project kinds
- Extending configuration schemas
- Validation rule creation
- Example: (planned) ADDING_PROJECT_KINDS.md

### Testing & Validation
- Writing validation tests
- Running test suites
- CI/CD integration
- Example: (planned) TESTING_VALIDATION.md

### Contributing
- Example project creation
- Documentation standards
- Review process
- Example: (planned) CONTRIBUTING_EXAMPLES.md

## Good vs. Not-So-Good Examples

**✅ Good developer guide**:
- "Adding a new project kind to project_kinds.yaml"
- "Creating custom validation rules"
- "Template authoring best practices"
- "Testing workflow changes locally"

**❌ Not developer guide** (belongs elsewhere):
- "How to use ai_workflow_core" → `docs/guides/QUICK_START.md`
- "Configuration file reference" → `docs/api/CONFIG_REFERENCE.md`
- "Multi-language setup" → `docs/advanced/MULTI_LANGUAGE_SETUP.md`
- "System architecture" → `docs/ARCHITECTURE.md`

## Contribution Workflow

For developers adding new guides:

1. **Check if guide exists**: Review this README and planned documentation
2. **Create draft**: Start with template structure above
3. **Add examples**: Include code samples and real implementations
4. **Test instructions**: Verify all commands and examples work
5. **Update README**: Add your guide to the table
6. **Submit PR**: Follow CONTRIBUTING.md guidelines

---

**Last Updated**: 2026-02-07
