# Developer Onboarding Guide

**Welcome to ai_workflow_core development!**

**Version**: 1.0.1  
**Last Updated**: 2026-02-12  
**Audience**: New contributors and developers

---

## Table of Contents

- [Quick Start for Developers](#quick-start-for-developers)
- [Understanding the Codebase](#understanding-the-codebase)
- [Development Environment Setup](#development-environment-setup)
- [Architecture Overview](#architecture-overview)
- [Key Concepts](#key-concepts)
- [Development Workflow](#development-workflow)
- [Testing Your Changes](#testing-your-changes)
- [Documentation Standards](#documentation-standards)
- [Common Development Tasks](#common-development-tasks)
- [Getting Help](#getting-help)

---

## Quick Start for Developers

### 5-Minute Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/ai_workflow_core.git
cd ai_workflow_core

# 2. Verify structure
python3 scripts/validate_structure.py

# 3. Check documentation
python3 scripts/validate_context_blocks.py config/ai_helpers.yaml

# 4. Read key documentation
cat README.md
cat docs/ARCHITECTURE.md
cat docs/CONTRIBUTING.md
```

### First Day Checklist

- [ ] Read [README.md](../README.md) - Project overview
- [ ] Read [ARCHITECTURE.md](../ARCHITECTURE.md) - System design
- [ ] Read [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [ ] Explore `config/` directory - Configuration templates
- [ ] Review `examples/` - Integration patterns
- [ ] Run validation scripts - Ensure setup correct
- [ ] Join community discussions - Get connected

---

## Understanding the Codebase

### What is ai_workflow_core?

**ai_workflow_core** is a **configuration and template library**, NOT a workflow execution engine.

```
┌─────────────────────────────────────────────────┐
│         ai_workflow (Parent Project)            │
│      Workflow Execution Engine + AI Integration │
└─────────────────────────────────────────────────┘
                        ▲
                        │ Uses as foundation
                        │
┌─────────────────────────────────────────────────┐
│          ai_workflow_core (This Repo)           │
│   Configuration Templates + Schemas + Examples  │
└─────────────────────────────────────────────────┘
```

**What this repo provides:**
- ✅ Configuration file templates with placeholders
- ✅ Project kind definitions and validation schemas
- ✅ Integration examples for different languages
- ✅ Documentation structure and standards
- ✅ Utility script templates
- ✅ GitHub Actions workflow templates

**What this repo does NOT provide:**
- ❌ Workflow execution engine
- ❌ Step orchestration logic
- ❌ AI integration code (only schemas)
- ❌ Testing framework

### Repository Structure

```
ai_workflow_core/
├── config/                      # Configuration templates & schemas
│   ├── .workflow-config.yaml.template    # Main config template
│   ├── project_kinds.yaml                # 8 project types
│   ├── ai_helpers.yaml                   # AI helper definitions (2000+ lines)
│   ├── ai_prompts_project_kinds.yaml     # Project-specific prompts
│   ├── model_selection_rules.yaml        # Model selection config
│   └── README.md                         # Config system overview
│
├── docs/                        # Comprehensive documentation
│   ├── ARCHITECTURE.md          # System architecture & ADRs
│   ├── INTEGRATION.md           # Integration guide
│   ├── AI_WORKFLOW_DIRECTORY.md # Artifact directory structure
│   ├── CONTRIBUTING.md          # Contributing guidelines
│   │
│   ├── api/                     # API references (5,000+ lines)
│   │   ├── CONFIG_REFERENCE.md
│   │   ├── PLACEHOLDER_REFERENCE.md
│   │   ├── PROJECT_KINDS_SCHEMA.md
│   │   ├── AI_HELPERS_REFERENCE.md
│   │   ├── AI_PROMPTS_REFERENCE.md
│   │   ├── MODEL_SELECTION_RULES_REFERENCE.md
│   │   └── SCRIPT_API_REFERENCE.md
│   │
│   ├── guides/                  # User guides (5,000+ lines)
│   │   ├── QUICK_START.md
│   │   ├── FAQ.md
│   │   ├── TROUBLESHOOTING.md
│   │   ├── MIGRATION_GUIDE.md
│   │   ├── VERSION_MANAGEMENT.md
│   │   └── INTEGRATION_BEST_PRACTICES.md
│   │
│   ├── advanced/                # Advanced topics (3,800+ lines)
│   │   ├── CI_CD_INTEGRATION.md
│   │   ├── CUSTOM_WORKFLOW_CREATION.md
│   │   └── MULTI_LANGUAGE_SETUP.md
│   │
│   ├── developers/              # Developer docs
│   │   ├── ADDING_PROJECT_KINDS.md
│   │   ├── TEMPLATE_AUTHORING.md
│   │   └── README.md
│   │
│   ├── architecture/            # Architecture details
│   │   ├── OVERVIEW.md
│   │   └── TEMPLATE_SYSTEM.md
│   │
│   └── misc/                    # Documentation tracking
│       └── DOCUMENTATION_INDEX.md
│
├── examples/                    # Language integration examples
│   ├── shell/README.md          # Shell integration (645+ lines)
│   ├── nodejs/README.md         # Node.js integration (320+ lines)
│   └── README.md                # Contributor guide (350+ lines)
│
├── scripts/                     # Utility scripts
│   ├── validate_context_blocks.py   # Validate AI prompts
│   ├── validate_structure.py        # Validate directory structure
│   ├── cleanup_artifacts.sh.template
│   ├── check_integration_health.sh.template
│   └── README.md
│
├── workflow-templates/          # GitHub Actions templates
│   ├── workflows/
│   │   ├── code-quality.yml
│   │   ├── validate-docs.yml
│   │   └── validate-tests.yml
│   └── README.md
│
├── .github/                     # GitHub metadata
│   ├── copilot-instructions.md  # GitHub Copilot instructions
│   └── DESCRIPTION.md
│
└── .ai_workflow/                # Workflow artifacts (dogfooding)
    ├── backlog/
    ├── summaries/
    └── logs/
```

---

## Development Environment Setup

### Prerequisites

- **Git** 2.13+ (for submodules)
- **Python** 3.8+ (for validation scripts)
- **Bash** 4.0+ (for utility scripts)
- **Text Editor** with YAML support

### Optional Tools

- **yamllint** - YAML linting
- **shellcheck** - Shell script linting
- **pre-commit** - Git hooks management

### Setup Steps

```bash
# 1. Install Python dependencies
pip install pyyaml  # For validation scripts

# 2. Install optional linters
pip install yamllint
sudo apt install shellcheck  # On Debian/Ubuntu

# 3. Setup pre-commit hooks (optional)
pip install pre-commit
pre-commit install

# 4. Verify setup
python3 scripts/validate_structure.py
python3 scripts/validate_context_blocks.py config/ai_helpers.yaml
```

---

## Architecture Overview

### Template System Design

ai_workflow_core uses a **placeholder-based template system**:

```yaml
# Template file: config/.workflow-config.yaml.template
project:
  name: "{{PROJECT_NAME}}"           # Placeholder
  type: "{{PROJECT_TYPE}}"           # Placeholder
  kind: "{{PROJECT_KIND}}"           # Placeholder

# User's customized file: .workflow-config.yaml
project:
  name: "My Application"             # Substituted value
  type: "nodejs-application"         # Substituted value
  kind: "nodejs_api"                 # Substituted value
```

### Git Submodule Integration Pattern

```
Parent Project
├── .workflow_core/              # This repo as submodule
│   ├── config/
│   ├── docs/
│   └── examples/
├── .workflow-config.yaml        # Copied from template
└── .ai_workflow/                # Created by user
    ├── backlog/
    ├── summaries/
    └── logs/
```

### Project Kinds System

8 supported project kinds with validation rules:

1. **shell_script_automation** - Bash/shell projects
2. **nodejs_api** - Node.js backend APIs
3. **client_spa** - Vanilla JS SPAs
4. **react_spa** - React applications
5. **static_website** - HTML/CSS/JS sites
6. **python_app** - Python applications
7. **configuration_library** - Template repositories (meta-type)
8. **generic** - Fallback for other types

See [PROJECT_KINDS_SCHEMA.md](api/PROJECT_KINDS_SCHEMA.md) for details.

---

## Key Concepts

### Placeholders

**Format**: `{{PLACEHOLDER_NAME}}`

**Common Placeholders**:
- `{{PROJECT_NAME}}` - Human-readable name
- `{{PROJECT_TYPE}}` - Hyphenated type: `"nodejs-application"`
- `{{PROJECT_KIND}}` - Underscored kind: `"nodejs_api"`
- `{{LANGUAGE}}` - Primary language: `"javascript"`
- `{{VERSION}}` - Semver without 'v': `"1.0.1"`

**Terminology**:
- `PROJECT_TYPE`: Uses hyphens (display format)
- `PROJECT_KIND`: Uses underscores (validation format)

See [PLACEHOLDER_REFERENCE.md](api/PLACEHOLDER_REFERENCE.md) for complete list.

### Configuration Validation

Projects define validation rules in `config/project_kinds.yaml`:

```yaml
nodejs_api:
  validation:
    required_files:
      - package.json
      - README.md
    required_directories:
      - src/
      - tests/
  testing:
    framework: jest
    coverage_threshold: 80
  quality:
    linters:
      - eslint
      - prettier
```

### Template Files

Files ending in `.template` are meant to be copied and customized:

1. Copy without `.template` extension
2. Replace all `{{PLACEHOLDERS}}`
3. Customize for specific project
4. Make executable if script

---

## Development Workflow

### Standard Contribution Flow

```bash
# 1. Create feature branch
git checkout -b feature/add-python-example

# 2. Make changes
# Edit files...

# 3. Validate changes
python3 scripts/validate_structure.py
python3 scripts/validate_context_blocks.py config/ai_helpers.yaml

# 4. Update documentation
# Update relevant .md files

# 5. Commit with conventional commit message
git add .
git commit -m "feat(examples): add Python integration example"

# 6. Push and create PR
git push origin feature/add-python-example
```

### Commit Message Convention

Format: `<type>(<scope>): <subject>`

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style (formatting, no logic change)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

**Examples**:
```
feat(config): add model_selection_rules.yaml configuration
fix(scripts): handle edge case in validate_structure.py
docs(api): update CONFIG_REFERENCE with new fields
```

---

## Testing Your Changes

### Validation Scripts

```bash
# Validate directory structure
python3 scripts/validate_structure.py

# Validate AI helper context blocks
python3 scripts/validate_context_blocks.py config/ai_helpers.yaml

# Check for empty directories
python3 scripts/validate_structure.py --fix
```

### Manual Testing

**For configuration changes**:
```bash
# 1. Update config/project_kinds.yaml or .workflow-config.yaml.template
# 2. Test with actual values in .workflow-config.yaml (this repo)
# 3. Verify placeholder documentation in README.md
```

**For example changes**:
```bash
# 1. Navigate to example directory
cd examples/shell/

# 2. Follow example README setup
# 3. Verify all commands work
# 4. Check for outdated references
```

**For documentation changes**:
```bash
# 1. Update markdown file
# 2. Check internal links work
# 3. Verify code examples are accurate
# 4. Update "Last Updated" date
```

### Dogfooding

This repo tests itself using its own templates:
- `.workflow-config.yaml` - Uses project_kind: `configuration_library`
- `.ai_workflow/` - Contains workflow artifacts
- Validation scripts run on self

---

## Documentation Standards

### File Path References

Always use inline code for paths:
```markdown
✅ Correct: `config/.workflow-config.yaml.template`
❌ Wrong: config/.workflow-config.yaml.template
```

### Command References

Use code blocks or inline code:
```markdown
✅ Correct: `git submodule add ...`
✅ Correct:
\`\`\`bash
git submodule add ...
\`\`\`
```

### Configuration Values

Use inline code:
```markdown
✅ Correct: `primary_language: "bash"`
❌ Wrong: primary_language: "bash"
```

### Status Indicators

Use emoji for visual clarity:
- ✅ Complete/Valid
- ❌ Error/Invalid
- ⚠️ Warning/Attention needed
- 🚧 Work in progress

### Placeholder Format

Keep `{{PLACEHOLDER}}` format in templates:
```markdown
✅ In templates: `{{PROJECT_NAME}}`
✅ In examples: "My Project"
```

---

## Common Development Tasks

### Adding a New Project Kind

See [ADDING_PROJECT_KINDS.md](ADDING_PROJECT_KINDS.md) for detailed guide.

**Quick steps**:
1. Edit `config/project_kinds.yaml`
2. Define validation rules
3. Add AI guidance
4. Update metadata changelog
5. Create example (optional)
6. Update documentation

### Creating Integration Examples

See [examples/README.md](../examples/README.md) for contributor guide.

**Quick steps**:
1. Create `examples/<language>/` directory
2. Include complete project structure
3. Write comprehensive README (300-650 lines)
4. Show customized `.workflow-config.yaml`
5. Include working code examples
6. Document common pitfalls

### Updating API Documentation

**Quick steps**:
1. Locate file in `docs/api/`
2. Update content sections
3. Add examples for new features
4. Update version history
5. Update "Last Updated" date
6. Cross-reference related docs

### Authoring Template Scripts

See [TEMPLATE_AUTHORING.md](TEMPLATE_AUTHORING.md) for detailed guide.

**Quick steps**:
1. Create script with `.template` extension
2. Use `{{PLACEHOLDER}}` format
3. Document required placeholders in header
4. Add usage examples in comments
5. Update `scripts/README.md`

---

## Getting Help

### Resources

- **[FAQ.md](guides/FAQ.md)** - 40+ common questions answered
- **[TROUBLESHOOTING.md](guides/TROUBLESHOOTING.md)** - 25+ solutions
- **[DOCUMENTATION_INDEX.md](misc/DOCUMENTATION_INDEX.md)** - All docs indexed
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - System design
- **[GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)** - Report bugs

### Community

- **GitHub Discussions** - Ask questions, share ideas
- **Issue Tracker** - Bug reports, feature requests
- **Pull Requests** - Contribute code/docs

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](../CODE_OF_CONDUCT.md). Please read and follow it when participating.

---

## Next Steps

### After Onboarding

1. **Pick a good first issue**
   - Look for `good-first-issue` label
   - Start with documentation improvements
   - Add examples for languages you know

2. **Explore advanced topics**
   - [CI_CD_INTEGRATION.md](advanced/CI_CD_INTEGRATION.md)
   - [CUSTOM_WORKFLOW_CREATION.md](advanced/CUSTOM_WORKFLOW_CREATION.md)
   - [MULTI_LANGUAGE_SETUP.md](advanced/MULTI_LANGUAGE_SETUP.md)

3. **Join the community**
   - Star the repository
   - Watch for updates
   - Participate in discussions

---

## Quick Reference

### Essential Commands

```bash
# Validate structure
python3 scripts/validate_structure.py

# Validate AI helpers
python3 scripts/validate_context_blocks.py config/ai_helpers.yaml

# Check integration health
./scripts/check_integration_health.sh

# Clean artifacts
./scripts/cleanup_artifacts.sh --cache
```

### Essential Files

| File | Purpose |
|------|---------|
| `config/project_kinds.yaml` | Project type definitions |
| `config/.workflow-config.yaml.template` | Main config template |
| `docs/ARCHITECTURE.md` | System architecture |
| `docs/CONTRIBUTING.md` | Contributing guidelines |

### Essential Documentation

| Doc | Purpose |
|-----|---------|
| [QUICK_START.md](guides/QUICK_START.md) | 5-minute setup |
| [FAQ.md](guides/FAQ.md) | Common questions |
| [API References](api/README.md) | Technical references |

---

**Welcome to the team! 🎉**

We're excited to have you contribute to ai_workflow_core. Don't hesitate to ask questions and reach out for help. Happy coding!

---

**Document Version**: 1.0.1  
**Last Updated**: 2026-02-12  
**Maintained By**: ai_workflow_core team
