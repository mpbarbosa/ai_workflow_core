# Advanced Documentation

**Purpose**: Advanced integration patterns and complex use cases for experienced users.

## What Belongs Here

✅ **Advanced topics**:
- Multi-language project setups
- Custom workflow creation
- CI/CD platform integrations
- Complex automation patterns
- Performance optimization
- Enterprise deployments

❌ **What does NOT belong here**:
- Getting started guides (→ `docs/guides/`)
- API references (→ `docs/api/`)
- Developer contribution guides (→ `docs/developers/`)
- Basic configuration help (→ `docs/guides/FAQ.md`)

## Current Files

| File | Description | Lines |
|------|-------------|-------|
| [MULTI_LANGUAGE_SETUP.md](MULTI_LANGUAGE_SETUP.md) | Polyglot project configurations | 1,122 |
| [CUSTOM_WORKFLOW_CREATION.md](CUSTOM_WORKFLOW_CREATION.md) | Custom automation workflows | 1,498 |
| [CI_CD_INTEGRATION.md](CI_CD_INTEGRATION.md) | Integration with 5 CI/CD platforms | 1,234 |

**Total**: 3 files, 3,854 lines

## Who Should Read These Guides

**Target Audience**:
- Experienced developers with multiple projects
- Teams managing monorepos or multi-language codebases
- DevOps engineers setting up CI/CD
- Enterprise users with complex requirements
- Users comfortable with YAML, shell scripting, and CI/CD concepts

**Prerequisites**:
- Completed basic setup (QUICK_START.md)
- Understanding of ai_workflow_core fundamentals
- Familiarity with Git submodules
- Experience with CI/CD platforms

## Adding New Advanced Guides

When adding new advanced documentation to this directory:

1. **Name the file**: `<TOPIC>_<TYPE>.md` (e.g., `PERFORMANCE_OPTIMIZATION.md`, `SECURITY_HARDENING.md`)
2. **Follow the structure**:
   ```markdown
   # Advanced Guide: Topic
   
   **Version**: 1.0.0
   **Last Updated**: YYYY-MM-DD
   **Difficulty**: Advanced
   **Prerequisites**: List advanced requirements
   
   > **Purpose**: What advanced users will achieve
   
   ## Overview
   ## Architecture Considerations
   ## Implementation Patterns
   ## Advanced Examples
   ## Performance Considerations
   ## Troubleshooting
   ```
3. **Update this README**: Add your file to the table above
4. **Link appropriately**: Reference from advanced sections in main docs
5. **Assume expertise**: Don't repeat basics, focus on complexity

## Style Guidelines

- **Advanced audience**: Assume reader knows the basics
- **Complex examples**: Show real-world multi-component setups
- **Architecture focus**: Explain design decisions and trade-offs
- **Performance notes**: Include optimization tips
- **Security awareness**: Highlight security considerations
- **Scalability**: Discuss enterprise-scale deployments
- **Edge cases**: Cover unusual but valid scenarios

## Guide Categories

### Multi-Language Projects
- Monorepo configurations
- Language-specific optimizations
- Shared configuration patterns
- Example: MULTI_LANGUAGE_SETUP.md

### Workflow Automation
- Custom CI/CD workflows
- Advanced GitHub Actions
- Deployment automation
- Example: CUSTOM_WORKFLOW_CREATION.md

### Platform Integration
- CI/CD platform specifics
- Cloud provider integrations
- Tool ecosystem connections
- Example: CI_CD_INTEGRATION.md

### Enterprise Patterns
- Large-scale deployments
- Security hardening
- Audit and compliance
- (Planned guides)

## Good vs. Not-So-Good Examples

**✅ Good advanced guide**:
- "Multi-language monorepo with shared workflows"
- "Custom deployment pipelines for microservices"
- "Integrating with Jenkins, GitLab CI, and Azure Pipelines"
- "Performance tuning for large codebases"

**❌ Not advanced guide** (belongs elsewhere):
- "What is ai_workflow_core?" → `README.md`
- "Installing pre-commit hooks" → `docs/guides/QUICK_START.md`
- "Configuration field reference" → `docs/api/CONFIG_REFERENCE.md`
- "How to contribute templates" → `docs/developers/`

## Complexity Indicators

Use these labels in your guides:

- 🟢 **Intermediate** - Requires basic ai_workflow_core knowledge
- 🟡 **Advanced** - Requires experience with related technologies
- 🔴 **Expert** - Requires deep understanding of multiple systems

Current guides:
- MULTI_LANGUAGE_SETUP.md 🟡 **Advanced**
- CUSTOM_WORKFLOW_CREATION.md 🟡 **Advanced**
- CI_CD_INTEGRATION.md 🟡 **Advanced**

---

**Last Updated**: 2026-02-07
