# Frequently Asked Questions (FAQ)

**Version**: 1.0.0  
**Last Updated**: 2026-02-07

> **Purpose**: Quick answers to common questions about ai_workflow_core. Organized by topic for easy navigation.
> ⚠️ **Context Note**: Some answers reference the **parent ai_workflow project** (workflow execution engine). This repository (ai_workflow_core) provides configuration templates and schemas only.


---

## Table of Contents

- [General Questions](#general-questions)
- [Project Setup](#project-setup)
- [Configuration](#configuration)
- [Project Kinds](#project-kinds)
- [Submodules](#submodules)
- [Artifacts and Directory Structure](#artifacts-and-directory-structure)
- [Versioning and Updates](#versioning-and-updates)
- [Relationship to Parent Project](#relationship-to-parent-project)
- [Customization and Extensibility](#customization-and-extensibility)
- [Troubleshooting](#troubleshooting)

---

## General Questions

### What is ai_workflow_core?

**A**: ai_workflow_core is a **configuration and template library** that provides foundational files for AI-powered workflow automation. It's designed to be used as a Git submodule across projects in any language (Shell, Node.js, Python, etc.).

**It provides**:
- Configuration templates with placeholder patterns
- Project type definitions and validation rules
- Directory structure standards
- Utility script templates
- Documentation and integration examples

**It does NOT provide**:
- Workflow execution engine (that's in the parent [ai_workflow](https://github.com/mpbarbosa/ai_workflow) project)
- Testing framework
- AI integration code

---

### Why would I use this?

**A**: Use ai_workflow_core if you want:

✅ **Standardized configuration** across multiple projects  
✅ **Language-agnostic templates** that work with any programming language  
✅ **Consistent directory structures** for artifacts and documentation  
✅ **Project-specific validation rules** (e.g., test coverage, linters)  
✅ **Version-controlled template updates** via Git submodules  
✅ **Foundation for workflow automation** that can integrate with AI tools

**Don't use it if**:
- ❌ You only need workflow execution (use parent ai_workflow project instead)
- ❌ Your project is too simple to need configuration management
- ❌ You prefer language-specific configuration systems

---

### Is this a workflow execution engine?

**A**: **No**. ai_workflow_core provides **templates and configuration only**.

- **This repository** (ai_workflow_core): Configuration templates, schemas, examples
- **Parent project** ([ai_workflow](https://github.com/mpbarbosa/ai_workflow)): Workflow execution engine (Node.js-based)

Think of it like:
- **ai_workflow_core** = Recipe templates
- **ai_workflow** = Kitchen that executes recipes

---

### What languages are supported?

**A**: **All languages**. ai_workflow_core is language-agnostic.

**Pre-configured project kinds**:
- Bash/Shell scripts (`shell_script_automation`)
- JavaScript/Node.js (`nodejs_api`, `react_spa`, `client_spa`)
- Python (`python_app`)
- HTML/CSS (`static_website`)
- YAML/Config (`configuration_library`)
- Generic (any other language)

Each project kind defines language-specific standards (test frameworks, linters, etc.), but you can customize for any language.

---

## Project Setup

### How do I get started?

**A**: Follow the 5-minute setup:

1. Add as submodule: `git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core`
2. Copy config: `cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml`
3. Edit config: Replace `{{PLACEHOLDERS}}` with your values
4. Create directories: `mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}`
5. Update .gitignore: Add `.ai_workflow/` patterns

**See**: `docs/guides/QUICK_START.md` for detailed walkthrough.

---

### Can I use this without Git submodules?

**A**: **Yes**, but not recommended.

**Option 1**: Copy files directly
```bash
# Download and extract
wget https://github.com/mpbarbosa/ai_workflow_core/archive/refs/tags/v1.0.0.tar.gz
tar -xzf v1.0.0.tar.gz
cp -r ai_workflow_core-1.0.0/config/* .
```

**Downsides**:
- ❌ No easy updates (manual copy/merge required)
- ❌ Harder to track which version you're using
- ❌ No connection to upstream improvements

**Option 2**: Fork the repository
- ✅ Allows customization
- ⚠️ Must manually sync upstream changes

**Recommendation**: Use Git submodules for easiest maintenance.

---

### Do I need to know YAML?

**A**: **Basic YAML syntax** is helpful but not required.

**You need to know**:
- Indentation matters (use 2 spaces)
- Quote strings containing special characters (`:`, `#`, etc.)
- Lists use `- item` format
- Comments start with `#`

**Resources**:
- [YAML in 5 minutes](https://learnxinyminutes.com/docs/yaml/)
- Use a YAML-aware editor (VSCode, Sublime, etc.)
- Install `yamllint` for validation

---

## Configuration

### What's the difference between `project.type` and `project.kind`?

**A**: Different naming conventions for different uses:

| Field | Format | Example | Purpose |
|-------|--------|---------|---------|
| `project.type` | **Hyphens** | `"nodejs-application"` | General project classification |
| `project.kind` | **Underscores** | `"nodejs_api"` | Matches `project_kinds.yaml` keys |

**Why two fields?**
- Historical: Different systems expect different formats
- `type`: Human-readable, flexible
- `kind`: Machine-readable, must match schema

**Example**:
```yaml
project:
  type: "nodejs-application"  # Descriptive, hyphenated
  kind: "nodejs_api"          # Matches project_kinds.yaml, underscored
```

---

### What are placeholders and why do I need them?

**A**: Placeholders use `{{NAME}}` syntax for values you must customize.

**Purpose**:
- ✅ Single source of truth for templates
- ✅ Clearly marks what needs customization
- ✅ Prevents accidental use of default values
- ✅ Easy to find: `grep "{{" .workflow-config.yaml`

**Example**:
```yaml
# Template (.workflow-config.yaml.template)
project:
  name: "{{PROJECT_NAME}}"  # ← You must replace this

# Your config (.workflow-config.yaml)
project:
  name: "My Awesome API"    # ← Replaced with actual value
```

**See**: `docs/api/PLACEHOLDER_REFERENCE.md` for complete list.

---

### Can I add custom configuration fields?

**A**: **Yes**! Add custom sections for your needs:

```yaml
# Standard configuration
project:
  name: "My Project"
  kind: "nodejs_api"

# Custom section (your addition)
custom:
  slack_webhook: "https://hooks.slack.com/..."
  deployment_region: "us-west-2"
  feature_flags:
    - new_ui
    - beta_api
```

Custom fields are ignored by standard validation but available to your scripts/tools.

---

### How do I validate my configuration?

**A**: Multiple validation methods:

**1. YAML Syntax** (install yamllint):
```bash
yamllint .workflow-config.yaml
```

**2. Placeholder Check**:
```bash
grep "{{" .workflow-config.yaml
# Should return nothing (all placeholders replaced)
```

**3. Project Kind Validation**:
```bash
# Check your kind exists
grep "^  your_kind:" .workflow_core/config/project_kinds.yaml
```

**4. Manual Review**:
- Required fields: `project.name`, `project.kind`, `project.version`
- Version format: `"1.0.0"` (no 'v' prefix)
- Valid kind: Must match `project_kinds.yaml`

---

## Project Kinds

### What project kinds are available?

**A**: 8 project kinds defined in `config/project_kinds.yaml`:

1. **`shell_script_automation`** - Bash/shell script projects
2. **`nodejs_api`** - Node.js backend APIs (Express, Fastify, etc.)
3. **`client_spa`** - Vanilla JavaScript SPAs with Bootstrap (no frameworks)
4. **`react_spa`** - React single-page applications
5. **`static_website`** - HTML/CSS/JavaScript static sites
6. **`python_app`** - Python applications
7. **`configuration_library`** - Template/config repositories (like ai_workflow_core itself)
8. **`generic`** - Fallback for other project types

---

### How do I choose the right project kind?

**A**: Match your project's primary characteristics:

**Decision flowchart**:
```
Is it shell/bash scripts? → shell_script_automation
Is it Node.js REST API? → nodejs_api
Is it React-based? → react_spa
Is it vanilla JS SPA (Bootstrap)? → client_spa
Is it static HTML/CSS site? → static_website
Is it Python application? → python_app
Is it config/template repo? → configuration_library
Otherwise? → generic
```

**Each kind defines**:
- Required test frameworks
- Linters and code quality tools
- Documentation standards
- Build requirements
- Deployment patterns

**See**: `docs/api/PROJECT_KINDS_SCHEMA.md` for complete definitions.

---

### Can I create custom project kinds?

**A**: **Not directly** (would require forking), but you have options:

**Option 1**: Use `generic` kind and customize
```yaml
project:
  kind: "generic"  # Minimal assumptions

# Add custom validations in your scripts
```

**Option 2**: Fork ai_workflow_core
```bash
# Fork on GitHub, then:
git submodule add https://github.com/YOUR-USERNAME/ai_workflow_core.git .workflow_core

# Edit .workflow_core/config/project_kinds.yaml
# Add your custom kind
```

**Option 3**: Contribute new kind upstream
- Open issue describing new kind
- Submit PR with definition
- Benefits everyone!

---

### What does each project kind validate?

**A**: Each kind defines:

- **Required files**: (e.g., `package.json`, `setup.py`, `README.md`)
- **Required directories**: (e.g., `src/`, `tests/`, `docs/`)
- **Test framework**: (e.g., jest, pytest, BATS)
- **Linters**: (e.g., eslint, pylint, shellcheck)
- **Coverage threshold**: (e.g., 80%, 70%, none)
- **Build requirement**: (yes/no)
- **Documentation standards**: (e.g., JSDoc, docstrings, inline comments)

**Example** (`nodejs_api`):
```yaml
nodejs_api:
  validation:
    required_files: ["package.json", "package-lock.json", "README.md"]
    required_dirs: ["src/", "tests/"]
    file_patterns: ["*.js"]
  testing:
    framework: "jest/mocha/vitest"
    coverage_threshold: 80
  quality:
    linters: ["eslint", "prettier"]
```

---

## Submodules

### What's a Git submodule?

**A**: A Git submodule is a repository embedded inside another repository.

**Benefits**:
- ✅ Version control for dependencies
- ✅ Easy updates: `git submodule update`
- ✅ Shared across projects
- ✅ Pin to specific versions

**How it works**:
```
your-project/
├── .gitmodules          # Submodule configuration
├── .workflow_core/      # ← Submodule (ai_workflow_core)
│   └── config/
│       └── *.yaml
└── .workflow-config.yaml  # Your customized copy
```

---

### How do I update the submodule?

**A**: Depends on your update strategy:

**Update to latest stable**:
```bash
cd .workflow_core
git fetch --tags
git checkout main  # or latest tag like v1.0.0
cd ..
git add .workflow_core
git commit -m "chore: update ai_workflow_core"
```

**Update to specific version**:
```bash
cd .workflow_core
git checkout v1.0.0
cd ..
git add .workflow_core
git commit -m "chore: update ai_workflow_core to v1.0.0"
```

**See**: `docs/guides/VERSION_MANAGEMENT.md` for strategies.

---

### Can I modify files in .workflow_core/?

**A**: **Not recommended**. Changes will be lost on update.

**Instead**:
1. **Copy to project root**: `cp .workflow_core/scripts/cleanup.sh.template scripts/cleanup.sh`
2. **Customize the copy**: Edit `scripts/cleanup.sh`
3. **Keep original**: Don't modify `.workflow_core/`

**If you need permanent changes**:
- Fork ai_workflow_core
- Use your fork as submodule
- Contribute improvements upstream via PR

---

### What if collaborators can't clone the submodule?

**A**: Ensure submodule is properly committed:

**Fix for project owner**:
```bash
git add .gitmodules .workflow_core
git commit -m "chore: add ai_workflow_core submodule"
git push origin main
```

**Fix for collaborators**:
```bash
# Option 1: Clone with submodules
git clone --recurse-submodules <project-url>

# Option 2: Initialize after cloning
git submodule update --init --recursive
```

---

## Artifacts and Directory Structure

### What is .ai_workflow/ for?

**A**: The `.ai_workflow/` directory stores **workflow execution artifacts**:

| Subdirectory | Purpose | Gitignore? |
|-------------|---------|-----------|
| `backlog/` | Execution reports, development artifacts | ✅ Yes |
| `summaries/` | AI-generated summaries | ✅ Yes |
| `logs/` | Execution logs | ✅ Yes |
| `metrics/` | Performance metrics | ✅ Yes |
| `checkpoints/` | Resume points for workflows | ✅ Yes |
| `prompts/` | AI prompt logs | ⚠️ Optional |
| `ml_models/` | Machine learning models | ⚠️ Optional |
| `.incremental_cache/` | Incremental processing cache | ✅ Yes |

**These are generated files**, like `node_modules/` or `target/`. Don't commit unless specifically needed.

**See**: `docs/AI_WORKFLOW_DIRECTORY.md` for complete guide.

---

### Why isn't .ai_workflow/ created automatically?

**A**: This is a **template library only**. Artifact creation happens during workflow execution.

**You create the structure**:
```bash
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}
```

**Artifacts populate during workflow execution** (requires parent ai_workflow project or custom tooling).

---

### Should I commit .ai_workflow/ to Git?

**A**: **Mostly no**, with exceptions:

**Never commit** (add to .gitignore):
- `backlog/` - Generated reports
- `summaries/` - AI outputs
- `logs/` - Execution logs
- `metrics/` - Performance data
- `checkpoints/` - Temporary state
- `.incremental_cache/` - Cache data

**Maybe commit** (project-specific):
- `prompts/` - If you want to version AI prompts for reproducibility
- `ml_models/` - If small and versioning is important

**Always commit**:
- `.ai_workflow/` directory itself (empty subdirectories)
- `.gitkeep` files to preserve directory structure

---

### Can I change the directory structure?

**A**: **Yes**, but not recommended (reduces standardization).

**If you must**:
1. Update your `.workflow-config.yaml`:
   ```yaml
   structure:
     artifact_dir: "my_custom_artifacts/"  # Custom location
   ```
2. Update `.gitignore` patterns
3. Update any scripts referencing directories

**Trade-off**: Loses compatibility with standard tooling and documentation.

---

## Versioning and Updates

### How often should I update?

**A**: Depends on your project stability needs:

| Project Type | Update Strategy | Frequency |
|--------------|----------------|-----------|
| Production | Pin to stable version | Quarterly or as needed |
| Development | Track latest stable | Monthly |
| Experimental | Track main branch | Weekly |

**Recommendation**: Pin production projects, track latest for development.

---

### How do I pin to a specific version?

**A**: Checkout a specific tag:

```bash
cd .workflow_core
git fetch --tags
git checkout v1.0.0  # Pin to v1.0.0
cd ..
git add .workflow_core
git commit -m "chore: pin ai_workflow_core to v1.0.0"
```

**To update later**:
```bash
cd .workflow_core
git checkout v1.1.0  # Update to v1.1.0
cd ..
git add .workflow_core
git commit -m "chore: update ai_workflow_core to v1.1.0"
```

---

### What's the difference between versions?

**A**: See `CHANGELOG.md` for all changes.

**Major versions** (e.g., v1.0.0 → v2.0.0):
- Breaking changes
- Migration guide required
- Significant new features

**Minor versions** (e.g., v1.0.0 → v1.1.0):
- New features
- Backward compatible
- Safe to update

**Patch versions** (e.g., v1.0.0 → v1.0.1):
- Bug fixes only
- No breaking changes
- Always safe to update

---

### How do I rollback after a bad update?

**A**: Checkout previous version:

```bash
cd .workflow_core
git checkout v1.0.0  # Previous working version
cd ..
git add .workflow_core
git commit -m "chore: rollback ai_workflow_core to v1.0.0"
```

**See**: `docs/guides/MIGRATION_GUIDE.md` for rollback procedures.

---

## Relationship to Parent Project

### What's the relationship between ai_workflow_core and ai_workflow?

**A**:

| Project | Purpose | Language | Use Case |
|---------|---------|----------|----------|
| **ai_workflow_core** (this) | Configuration templates | YAML | Any project needing standardized config |
| **ai_workflow** (parent) | Workflow execution engine | Node.js | Projects needing AI workflow automation |

**Relationship**:
- ai_workflow_core was **extracted from** ai_workflow v3.0.0
- ai_workflow **uses** ai_workflow_core as foundation
- ai_workflow_core can be used **standalone** (without ai_workflow)

**Think of it like**:
- **ai_workflow_core** = Bootstrap CSS (just templates)
- **ai_workflow** = Full web framework (execution engine)

---

### Do I need both projects?

**A**: Depends on your needs:

**Use ai_workflow_core only** if you need:
- ✅ Configuration standardization
- ✅ Project type definitions
- ✅ Directory structure conventions
- ✅ Template files and schemas

**Use both** (ai_workflow_core + ai_workflow) if you need:
- ✅ Everything above, plus:
- ✅ Workflow step execution
- ✅ AI integration (GPT, Claude, etc.)
- ✅ Automated testing workflows
- ✅ Report generation

---

### Can I use ai_workflow_core without ai_workflow?

**A**: **Yes!** ai_workflow_core is standalone.

**Common use cases**:
- Configuration management across projects
- Standardizing directory structures
- Project kind validation
- Template distribution
- Foundation for custom automation tools

---

### Will ai_workflow_core work with my custom workflow engine?

**A**: **Yes!** It's language-agnostic and engine-agnostic.

**Integration points**:
- Read `.workflow-config.yaml` for project metadata
- Use `project_kinds.yaml` for validation rules
- Follow `.ai_workflow/` directory structure for artifacts
- Adapt script templates to your language

**Example**: Python workflow engine reading Node.js project config:
```python
import yaml

with open('.workflow-config.yaml') as f:
    config = yaml.safe_load(f)

project_kind = config['project']['kind']
test_command = config['tech_stack']['test_command']

# Use in your workflow...
```

---

## Customization and Extensibility

### Can I use this for private/proprietary projects?

**A**: **Yes**. MIT License allows commercial and private use.

**Requirements**:
- ✅ Include copyright notice (in LICENSE file)
- ✅ Include MIT license text (in LICENSE file)
- ✅ No warranty provided

**You are free to**:
- ✅ Use in proprietary projects
- ✅ Modify templates
- ✅ Sell products using it
- ✅ Not release source code of your project

---

### Can I contribute improvements back?

**A**: **Yes, please!** Contributions welcome.

**How to contribute**:
1. Read `docs/CONTRIBUTING.md`
2. Fork repository
3. Create feature branch
4. Make changes
5. Submit pull request

**What to contribute**:
- New project kinds
- Language-specific examples
- Bug fixes
- Documentation improvements
- Script templates

---

### How do I customize for my organization?

**A**: Three approaches:

**Approach 1**: Fork and customize
```bash
# Fork on GitHub
# Add as submodule using your fork
git submodule add https://github.com/YOUR-ORG/ai_workflow_core.git .workflow_core
```

**Approach 2**: Extend with custom configs
```yaml
# .workflow-config.yaml
project:
  kind: "generic"  # Base kind

organization:
  name: "My Company"
  standards_version: "2.1.0"
  custom_field: "value"
```

**Approach 3**: Layer wrapper templates
```
your-org-templates/
├── .workflow_core/  # Upstream submodule
└── company-templates/
    ├── org-config.yaml
    └── company-standards.md
```

---

## Troubleshooting

### Where do I start if something isn't working?

**A**: Follow this checklist:

1. **Run quick diagnosis**:
   ```bash
   git submodule status
   yamllint .workflow-config.yaml 2>&1
   grep "{{" .workflow-config.yaml
   ls -la .ai_workflow/
   ```

2. **Check**:
   - ✅ Submodule initialized?
   - ✅ Config syntax valid?
   - ✅ All placeholders replaced?
   - ✅ Directories exist?

3. **Read troubleshooting guide**: `docs/guides/TROUBLESHOOTING.md`

4. **Search issues**: [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)

---

### Why do I get "mapping values are not allowed here"?

**A**: YAML syntax error. Common causes:

**Missing quotes**:
```yaml
# ❌ Wrong
description: This: has colons

# ✅ Correct
description: "This: has colons"
```

**Indentation error**:
```yaml
# ❌ Wrong (3 spaces)
project:
   name: "Test"

# ✅ Correct (2 spaces)
project:
  name: "Test"
```

**See**: `docs/guides/TROUBLESHOOTING.md` § Configuration Problems

---

### How do I report a bug?

**A**: Create a GitHub issue with:

1. **Problem description**: What's broken?
2. **Environment**: OS, Git version, ai_workflow_core version
3. **Steps to reproduce**: How to trigger the bug?
4. **Expected vs actual**: What should happen vs what happens?
5. **Config sample**: Sanitized `.workflow-config.yaml` excerpt

**Template**: See `docs/guides/TROUBLESHOOTING.md` § Issue Template

---

## Still Have Questions?

**Resources**:
- **Quick Start**: `docs/guides/QUICK_START.md`
- **Integration Guide**: `docs/INTEGRATION.md`
- **Troubleshooting**: `docs/guides/TROUBLESHOOTING.md`
- **API References**: `docs/api/` directory
- **Examples**: `examples/shell/`, `examples/nodejs/`
- **GitHub Issues**: [github.com/mpbarbosa/ai_workflow_core/issues](https://github.com/mpbarbosa/ai_workflow_core/issues)

**Can't find your answer?**
- Search existing [GitHub Issues](https://github.com/mpbarbosa/ai_workflow_core/issues)
- Create new issue with `question` label
- Include as much context as possible

---

**Last Updated**: 2026-02-07  
**Document Version**: 1.0.0
