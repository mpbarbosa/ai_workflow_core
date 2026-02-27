# AI Workflow Core - Documentation Index

**Version**: 1.0.2  
**Last Updated**: 2026-02-12  
**Purpose**: Master index of all documentation in ai_workflow_core

> 📚 **Quick Navigation**: Use this index to find the right documentation for your needs.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [API References](#api-references)
3. [User Guides](#user-guides)
4. [Developer Documentation](#developer-documentation)
5. [Advanced Topics](#advanced-topics)
6. [Examples & Templates](#examples--templates)
7. [Contributing & Community](#contributing--community)
8. [Quick Reference Charts](#quick-reference-charts)

---

## Getting Started

**New to ai_workflow_core? Start here:**

| Document | Purpose | Time | Level |
|----------|---------|------|-------|
| [README.md](README.md) | Project overview & quick start | 5 min | Beginner |
| [docs/guides/QUICK_START.md](docs/guides/QUICK_START.md) | Detailed setup guide | 10 min | Beginner |
| [docs/INTEGRATION.md](docs/INTEGRATION.md) | Integration as Git submodule | 15 min | Beginner |
| [docs/INTEGRATION_QUICK_REFERENCE.md](docs/INTEGRATION_QUICK_REFERENCE.md) | Quick integration commands | 2 min | All |

**First-time setup checklist**:
1. ✅ Read [README.md](README.md) - Understand what ai_workflow_core is
2. ✅ Follow [QUICK_START.md](docs/guides/QUICK_START.md) - Set up your project
3. ✅ Choose your [project kind](#choosing-project-kind) - Select appropriate configuration
4. ✅ Review [examples](#examples--templates) - See language-specific integration

---

## API References

**Complete technical references for configuration schemas:**

| Document | Content | Lines | Version |
|----------|---------|-------|---------|
| [CONFIG_REFERENCE.md](docs/api/CONFIG_REFERENCE.md) | `.workflow-config.yaml` field reference | 695 | 1.0.2 |
| [PLACEHOLDER_REFERENCE.md](docs/api/PLACEHOLDER_REFERENCE.md) | Placeholder patterns & substitution | 756 | 1.0.2 |
| [PROJECT_KINDS_SCHEMA.md](docs/api/PROJECT_KINDS_SCHEMA.md) | Project kinds schema (8 types) | 777 | 1.2.0 |
| [AI_HELPERS_REFERENCE.md](docs/api/AI_HELPERS_REFERENCE.md) | AI personas & token efficiency | 1,177 | 1.0.2 |
| [AI_PROMPTS_REFERENCE.md](docs/api/AI_PROMPTS_REFERENCE.md) | Project-specific AI prompts | 1,197 | 1.2.0 |
| [docs/api/README.md](docs/api/README.md) | API documentation overview | - | - |

**Use API references when**:
- Configuring `.workflow-config.yaml` fields
- Understanding validation rules
- Looking up placeholder syntax
- Defining project kinds
- Configuring AI helpers

---

## User Guides

**Step-by-step guides and how-to documentation:**

### Core Guides

| Document | Purpose | Audience |
|----------|---------|----------|
| [QUICK_START.md](docs/guides/QUICK_START.md) | 5-minute setup guide | Beginners |
| [FAQ.md](docs/guides/FAQ.md) | 40+ common questions answered | All |
| [TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md) | 25+ solutions across 8 categories | All |
| [MIGRATION_GUIDE.md](docs/guides/MIGRATION_GUIDE.md) | Version upgrade procedures | Intermediate |
| [INTEGRATION_BEST_PRACTICES.md](docs/guides/INTEGRATION_BEST_PRACTICES.md) | Integration recommendations | Intermediate |

### Specialized Guides

| Document | Purpose | Audience |
|----------|---------|----------|
| [VERSION_MANAGEMENT.md](docs/guides/VERSION_MANAGEMENT.md) | Version management strategies | Intermediate |
| [STRUCTURE_VALIDATION_TUTORIAL.md](docs/guides/STRUCTURE_VALIDATION_TUTORIAL.md) | Structure validation setup | Intermediate |
| [docs/guides/README.md](docs/guides/README.md) | Guides directory overview | All |

### Parent Project References ⚠️

> **Note**: These guides reference features from the parent **ai_workflow** project (execution engine), not ai_workflow_core (configuration library).

| Document | Purpose | Context |
|----------|---------|---------|
| [PROJECT_REFERENCE.md](docs/guides/PROJECT_REFERENCE.md) | Parent project documentation | Parent project |
| [ML_OPTIMIZATION_GUIDE.md](docs/guides/ML_OPTIMIZATION_GUIDE.md) | ML optimization for workflows | Parent project |
| [MULTI_STAGE_PIPELINE_GUIDE.md](docs/guides/MULTI_STAGE_PIPELINE_GUIDE.md) | Pipeline execution patterns | Parent project |

---

## Developer Documentation

**For contributors and template authors:**

| Document | Purpose | Audience |
|----------|---------|----------|
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Contribution guidelines | Contributors |
| [TEMPLATE_AUTHORING.md](docs/developers/TEMPLATE_AUTHORING.md) | Creating custom templates | Advanced |
| [docs/developers/README.md](docs/developers/README.md) | Developer docs overview | Contributors |
| [CODE_OF_CONDUCT.md](docs/CODE_OF_CONDUCT.md) | Community standards | All |

**Development workflow**:
1. Read [CONTRIBUTING.md](docs/CONTRIBUTING.md) - Understand contribution process
2. Review [TEMPLATE_AUTHORING.md](docs/developers/TEMPLATE_AUTHORING.md) - Learn template syntax
3. Check [CODE_OF_CONDUCT.md](docs/CODE_OF_CONDUCT.md) - Community guidelines
4. Submit contributions following the guidelines

---

## Advanced Topics

**Deep dives into complex scenarios:**

| Document | Purpose | Lines | Level |
|----------|---------|-------|-------|
| [MULTI_LANGUAGE_SETUP.md](docs/advanced/MULTI_LANGUAGE_SETUP.md) | Multi-language project setup | - | Advanced |
| [CUSTOM_WORKFLOW_CREATION.md](docs/advanced/CUSTOM_WORKFLOW_CREATION.md) | Creating custom workflows | - | Advanced |
| [CI_CD_INTEGRATION.md](docs/advanced/CI_CD_INTEGRATION.md) | CI/CD platform integration | - | Advanced |
| [docs/advanced/README.md](docs/advanced/README.md) | Advanced topics overview | - | Advanced |

**When to read advanced topics**:
- Setting up monorepo with multiple languages
- Creating custom GitHub Actions workflows
- Integrating with CI/CD platforms (Jenkins, GitLab CI, etc.)
- Extending ai_workflow_core for specific needs

---

## Examples & Templates

**Language-specific integration examples:**

### Integration Examples

| Example | Language | Lines | Description |
|---------|----------|-------|-------------|
| [examples/shell/](examples/shell/) | Bash | 645+ | Shell script automation integration |
| [examples/nodejs/](examples/nodejs/) | JavaScript | 320+ | Node.js application integration |
| [examples/README.md](examples/README.md) | - | 350+ | Creating new examples guide |

### Configuration Templates

| Template | Purpose | Location |
|----------|---------|----------|
| `.workflow-config.yaml.template` | Main configuration template | `config/` |
| `cleanup_artifacts.sh.template` | Artifact cleanup script | `scripts/` |

### GitHub Workflows

| Workflow | Purpose | Location |
|----------|---------|----------|
| `code-quality.yml` | Linting and code quality checks | `workflow-templates/workflows/` |
| `validate-docs.yml` | Documentation validation | `workflow-templates/workflows/` |
| `validate-tests.yml` | Test validation | `workflow-templates/workflows/` |
| `validate-structure.yml` | Directory structure validation | `workflow-templates/workflows/` |
| `integration-health.yml` | Integration health checks | `workflow-templates/workflows/` |

See [workflow-templates/README.md](workflow-templates/README.md) for usage instructions.

---

## Contributing & Community

**Community resources and policies:**

| Document | Purpose |
|----------|---------|
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | How to contribute |
| [CODE_OF_CONDUCT.md](docs/CODE_OF_CONDUCT.md) | Community standards (Contributor Covenant 2.1) |
| [LICENSE](docs/LICENSE) | MIT License |
| [CHANGELOG.md](CHANGELOG.md) | Version history & changes |

**Get involved**:
- 🐛 Report bugs via [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 🌟 Star the project

---

## Architecture & Design

**System design and decisions:**

| Document | Content |
|----------|---------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, design patterns, ADRs |
| [AI_WORKFLOW_DIRECTORY.md](docs/AI_WORKFLOW_DIRECTORY.md) | `.ai_workflow/` artifact directory structure |
| [diagrams/README.md](docs/diagrams/README.md) | 20+ visual diagrams (Mermaid, ASCII art) |

---

## Quick Reference Charts

### Choosing Project Kind

Use this flowchart to select the right `project_kind`:

```
What type of project?
├── Scripts → Bash/Shell? → shell_script_automation
├── Web App
│   ├── React? → react_spa
│   ├── Vanilla JS? → client_spa
│   └── Static HTML? → static_website
├── Backend
│   ├── Node.js? → nodejs_api
│   └── Python? → python_app
├── Config/Templates? → configuration_library
└── Other? → generic
```

See [PROJECT_KINDS_SCHEMA.md](docs/api/PROJECT_KINDS_SCHEMA.md) for full definitions.

### Common Placeholder Mappings

| Placeholder | Example Value | Used In |
|------------|---------------|---------|
| `{{PROJECT_NAME}}` | "My Project" | Display name |
| `{{PROJECT_TYPE}}` | "nodejs-application" | Type (hyphenated) |
| `{{PROJECT_KIND}}` | "nodejs_api" | Validation (underscored) |
| `{{VERSION}}` | "1.0.2" | Version (no 'v' prefix) |
| `{{LANGUAGE}}` | "javascript" | Primary language |
| `{{TEST_COMMAND}}` | "npm test" | Test execution |
| `{{LINT_COMMAND}}` | "eslint ." | Code linting |

See [PLACEHOLDER_REFERENCE.md](docs/api/PLACEHOLDER_REFERENCE.md) for complete list.

### Directory Structure Quick Reference

```
your-project/
├── .workflow_core/              # Git submodule (ai_workflow_core)
├── .ai_workflow/                # Workflow artifacts (gitignored)
│   ├── backlog/                 # Execution reports
│   ├── summaries/               # AI summaries
│   ├── logs/                    # Execution logs
│   ├── metrics/                 # Performance metrics
│   ├── checkpoints/             # Resume points
│   ├── prompts/                 # AI prompt logs (optional commit)
│   ├── ml_models/               # ML models (optional commit)
│   └── .incremental_cache/      # Incremental cache (gitignored)
├── .workflow-config.yaml        # Customized config (committed)
├── .gitignore                   # Includes .ai_workflow/ patterns
└── .gitmodules                  # Submodule configuration
```

See [AI_WORKFLOW_DIRECTORY.md](docs/AI_WORKFLOW_DIRECTORY.md) for details.

---

## Finding What You Need

### By Task

**I want to...**

| Task | Document |
|------|----------|
| Set up ai_workflow_core for the first time | [QUICK_START.md](docs/guides/QUICK_START.md) |
| Understand configuration fields | [CONFIG_REFERENCE.md](docs/api/CONFIG_REFERENCE.md) |
| Fix a problem | [TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md) |
| Upgrade to a new version | [MIGRATION_GUIDE.md](docs/guides/MIGRATION_GUIDE.md) |
| Choose the right project kind | [PROJECT_KINDS_SCHEMA.md](docs/api/PROJECT_KINDS_SCHEMA.md) |
| See an example integration | [examples/shell/](examples/shell/) or [examples/nodejs/](examples/nodejs/) |
| Contribute to the project | [CONTRIBUTING.md](docs/CONTRIBUTING.md) |
| Create custom templates | [TEMPLATE_AUTHORING.md](docs/developers/TEMPLATE_AUTHORING.md) |
| Integrate with CI/CD | [CI_CD_INTEGRATION.md](docs/advanced/CI_CD_INTEGRATION.md) |
| Understand the architecture | [ARCHITECTURE.md](docs/ARCHITECTURE.md) |

### By Audience

**Beginner** → Start with [README.md](README.md) and [QUICK_START.md](docs/guides/QUICK_START.md)  
**Intermediate** → Explore [User Guides](#user-guides) and [Examples](#examples--templates)  
**Advanced** → Review [Advanced Topics](#advanced-topics) and [API References](#api-references)  
**Contributors** → Read [Developer Documentation](#developer-documentation)

### By File Type

**Markdown Documentation** (32 files):
- Core: 9 files in `docs/` root
- API References: 6 files in `docs/api/`
- User Guides: 11 files in `docs/guides/`
- Advanced Topics: 4 files in `docs/advanced/`
- Developer Docs: 2 files in `docs/developers/`

**Configuration Files** (5 files in `config/`):
- `.workflow-config.yaml.template` - Main config template
- `project_kinds.yaml` - Project type definitions
- `ai_helpers.yaml` - AI helper configurations
- `ai_prompts_project_kinds.yaml` - Project-specific prompts
- `README.md` - Configuration overview

**Script Templates** (2 files in `scripts/`):
- `cleanup_artifacts.sh.template` - Artifact cleanup
- `validate_context_blocks.py` - Documentation validator
- `validate_structure.py` - Directory structure validator

**Examples** (3 directories in `examples/`):
- `shell/` - Shell script integration
- `nodejs/` - Node.js integration
- `README.md` - Example creation guide

---

## Documentation Statistics

**Total Documentation**: 32 markdown files, 15,000+ lines  
**API References**: 5 files, 4,602 lines  
**User Guides**: 11 files, 3,000+ lines  
**Examples**: 2 complete integrations (shell, nodejs)  
**Configuration Files**: 5 YAML files  
**Workflow Templates**: 5 GitHub Actions workflows  

**Last Major Update**: 2026-02-07  
**Schema Versions**:
- project_kinds.yaml: v1.2.0
- AI prompts: v1.2.0
- Core templates: v1.0.2

---

## Related Resources

**Parent Project**:
- [ai_workflow](https://github.com/mpbarbosa/ai_workflow) - Workflow execution engine

**External Resources**:
- [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [YAML Syntax Guide](https://yaml.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## Maintenance

**This index is maintained by**:
- Core maintainers
- Documentation contributors

**Update frequency**: After significant documentation changes

**How to update this index**:
1. Add new documents to appropriate section
2. Update line counts and statistics
3. Verify all links work
4. Update "Last Updated" date
5. Commit with message: `docs: update documentation index`

---

## Need Help?

**Can't find what you're looking for?**

1. Search this repository: Use GitHub search or `grep -r "search term" docs/`
2. Check [FAQ.md](docs/guides/FAQ.md) for common questions
3. Review [TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md) for solutions
4. Ask in [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)

---

**Last Updated**: 2026-02-07  
**Document Version**: 1.0.2  
**Maintained By**: ai_workflow_core team
