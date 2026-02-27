# Language Integration Examples

This directory contains language-specific integration examples showing how to use `ai_workflow_core` as a Git submodule in different project types.

## Available Examples

| Example | Status | Lines | Description |
|---------|--------|-------|-------------|
| [shell/](shell/) | ✅ Complete | 630+ | Shell script automation projects with BATS testing |
| [nodejs/](nodejs/) | ✅ Complete | 600+ | Node.js applications with npm/jest |
| python/ | 🚧 Planned | - | Python applications with pytest |
| java/ | 🚧 Planned | - | Java/Maven projects |
| go/ | 🚧 Planned | - | Go projects with go test |

---

## Creating a New Example

### 1. Directory Structure Template

Each example should follow this structure:

```
examples/<language>/
├── README.md                        # Comprehensive integration guide
├── .workflow-config.yaml.example    # Fully populated config (no placeholders)
├── .gitignore.example               # Example .gitignore patterns
├── src/                             # Example source code
│   ├── main.<ext>                   # Main entry point
│   └── lib/                         # Library/module examples
│       └── utils.<ext>              # Utility functions
├── tests/                           # Example test files
│   ├── test_main.<ext>              # Main tests
│   └── test_utils.<ext>             # Utility tests
└── docs/                            # Example documentation (optional)
    └── README.md
```

### 2. README.md Required Sections

Your example README.md must include these sections:

#### 2.1 Header & Overview
```markdown
# <Language> Integration Example

Brief description of what this example demonstrates.

**Project Kind**: `<project_kind>` (from config/project_kinds.yaml)
**Complexity**: Beginner/Intermediate/Advanced
```

#### 2.2 Directory Structure
- Show complete project structure with `.workflow_core/` submodule
- Include `.ai_workflow/` artifact directories
- Show typical language-specific directories

#### 2.3 Prerequisites
- List required tools and versions
- Include installation commands for major platforms (Linux, macOS, Windows)
- Note optional tools clearly

#### 2.4 Setup Steps
Detailed step-by-step instructions:
1. Create project directory
2. Initialize Git repository
3. Add ai_workflow_core as submodule
4. Copy and customize configuration template
5. Create artifact directory structure
6. Update .gitignore

#### 2.5 Configuration Example
- Show `.workflow-config.yaml` with **actual values** (NO placeholders)
- Explain key configuration choices
- Reference project kind from `config/project_kinds.yaml`

#### 2.6 Example Code
Include practical, working examples:
- Main entry point showing basic functionality
- Library/module with reusable functions
- Test file demonstrating testing approach
- Use realistic scenarios (not "hello world" unless beginner level)

#### 2.7 Integration Workflow
- Step-by-step workflow for using the configuration
- How to run tests
- How to run linters
- How to validate configuration

#### 2.8 Testing & Validation
- How to run the test suite
- Expected test output
- Coverage expectations (reference project kind standards)

#### 2.9 Common Pitfalls
- Language-specific gotchas
- Integration issues and solutions
- Version compatibility notes

#### 2.10 Troubleshooting
- Common error messages and fixes
- Debugging tips
- Where to get help

#### 2.11 Additional Resources
- Links to official documentation
- Style guides relevant to the language
- Testing framework documentation

---

### 3. Configuration Checklist

Before submitting your example, verify:

#### Project Kind Alignment
- [ ] Selected project_kind exists in `config/project_kinds.yaml`
- [ ] Configuration matches project_kind validation rules
- [ ] Test framework specified matches project_kind requirements
- [ ] Linter specified matches project_kind recommendations

#### Configuration File (.workflow-config.yaml.example)
- [ ] All placeholders replaced with actual values
- [ ] PROJECT_TYPE uses hyphens (e.g., "nodejs-application")
- [ ] PROJECT_KIND uses underscores (e.g., "nodejs_api")
- [ ] Version format: "1.0.2" (no 'v' prefix)
- [ ] Test command is executable and works
- [ ] Lint command is executable and works
- [ ] Comments explain non-obvious choices

#### Example Code Quality
- [ ] Code follows language best practices
- [ ] Code is realistic and practical (not trivial)
- [ ] Code includes comments explaining key concepts
- [ ] All example code is functional and tested
- [ ] File naming follows language conventions

#### Testing
- [ ] Test files included and functional
- [ ] Tests can be run with single command
- [ ] Tests pass successfully
- [ ] Test framework matches project_kind specification

#### Documentation
- [ ] README.md includes all required sections
- [ ] README.md is 400+ lines (comprehensive, not minimal)
- [ ] Code examples use proper markdown syntax
- [ ] Commands are tested and work as documented
- [ ] File paths use inline code formatting

#### Integration
- [ ] Submodule integration workflow clearly documented
- [ ] .gitignore.example includes appropriate patterns
- [ ] Artifact directory structure documented
- [ ] Example can be followed start-to-finish successfully

---

### 4. Testing Your Example

Before submitting, test your example by:

1. **Fresh Setup Test**
   ```bash
   # Create test directory
   mkdir test_example
   cd test_example
   
   # Follow your README.md instructions exactly
   # Verify each step works as documented
   ```

2. **Validation Tests**
   ```bash
   # Verify YAML syntax
   python3 -c "import yaml; yaml.safe_load(open('.workflow-config.yaml.example'))"
   
   # Run linter (as documented)
   <your_lint_command>
   
   # Run tests (as documented)
   <your_test_command>
   ```

3. **Beginner Test**
   - Have someone unfamiliar with the language follow your README
   - Note any confusing sections
   - Revise based on feedback

---

### 5. Example Complexity Guidelines

#### Beginner Examples
- Focus on basic integration
- Minimal dependencies
- Clear, simple code structure
- Extensive comments and explanations
- **Target**: 400-500 lines README

#### Intermediate Examples
- Realistic project structure
- Common dependencies
- Best practices demonstrated
- Moderate comments
- **Target**: 500-700 lines README

#### Advanced Examples
- Complex project structure
- Multiple modules/packages
- Advanced patterns (testing, CI/CD, etc.)
- Assumes language knowledge
- **Target**: 700+ lines README

---

### 6. Reference Examples

Use these as templates:

- **[shell/README.md](shell/README.md)** - Comprehensive shell script example (630+ lines)
  - Beginner-friendly
  - Detailed prerequisites and setup
  - Practical examples (backup script, utility library, test runner)
  
- **[nodejs/README.md](nodejs/README.md)** - Comprehensive Node.js example (600+ lines)
  - Intermediate level
  - Modern JavaScript (ESM modules)
  - Jest testing with practical examples
  - CI/CD integration

**Match or exceed** the detail level of these examples.

---

### 7. Language-Specific Considerations

#### Shell Scripts
- Test framework: BATS, bash_unit, or shell-script based
- Linter: shellcheck (required)
- Style: Google Shell Style Guide
- File extension: .sh

#### Node.js
- Package manager: npm (preferred), yarn, pnpm
- Test framework: jest (preferred), mocha, vitest
- Linter: eslint (required) + prettier
- Style: Airbnb or Standard

#### Python
- Package manager: pip + requirements.txt
- Test framework: pytest (preferred), unittest
- Linter: pylint, black (formatter), mypy (types)
- Style: PEP 8
- Docstrings: Google or NumPy format

#### Java
- Build system: Maven (preferred), Gradle
- Test framework: JUnit 5
- Linter: Checkstyle, SpotBugs
- Style: Google Java Style Guide

#### Go
- Build system: go modules (go.mod)
- Test framework: go test (built-in)
- Linter: golangci-lint
- Style: Effective Go

See `config/project_kinds.yaml` for complete validation rules per language/project type.

---

### 8. Submission Process

1. **Create Your Example**
   - Follow this guide
   - Use existing examples as reference
   - Test thoroughly

2. **Self-Review Checklist**
   - Complete the Configuration Checklist above
   - Verify all commands work
   - Check README.md formatting

3. **Create Pull Request**
   - Title: "Add [language] integration example"
   - Description: Link to this guide, note any deviations
   - Include testing evidence (screenshots/output)

4. **Address Review Feedback**
   - Reviewers will check against this guide
   - Be prepared to expand minimal sections
   - Ensure comprehensive documentation

---

## Quick Decision Guide

**"Should I create a new example for [X]?"**

✅ **YES** if:
- Language has project_kind defined in `config/project_kinds.yaml`
- Language is commonly used in automation/workflows
- No example exists yet
- You can create comprehensive documentation (400+ lines)

⏸️ **MAYBE** if:
- Language is niche but has valid use case
- You can demonstrate unique integration pattern
- Willing to maintain the example long-term

❌ **NO** if:
- Example already exists and is comprehensive
- Language doesn't fit workflow automation use cases
- Would duplicate existing example with minimal differences

---

## Getting Help

- **Documentation**: See [docs/INTEGRATION.md](../docs/INTEGRATION.md) for complete integration guide
- **Architecture**: See [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for system design
- **Contributing**: See [docs/CONTRIBUTING.md](../docs/CONTRIBUTING.md) for contribution guidelines
- **Project Kinds**: See [config/project_kinds.yaml](../config/project_kinds.yaml) for validation rules
- **Issues**: Open a GitHub issue if you need clarification

---

**Version**: 1.0.2  
**Last Updated**: 2026-01-31  
**Maintainer**: ai_workflow_core team

---

## Example Roadmap

Planned future examples (contributions welcome):

1. **Python** - pytest-based application (HIGH PRIORITY)
2. **Java/Maven** - Spring Boot API example
3. **Go** - CLI tool with cobra
4. **TypeScript** - Node.js API with TypeScript
5. **Ruby** - Rails application
6. **Rust** - CLI tool with clap

Want to contribute? Follow this guide and open a PR!
