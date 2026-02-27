# AI Prompts Project Kinds Reference

**Version**: 2.0.0  
**Last Updated**: 2026-02-07  
**Schema File**: `config/ai_prompts_project_kinds.yaml`

> **Purpose**: Complete reference for the `ai_prompts_project_kinds.yaml` configuration file. This document explains project-specific AI prompt templates, role definitions per project type, task context patterns, and verification checklists.

---

## Table of Contents

- [Overview](#overview)
- [File Structure](#file-structure)
- [Project Kind Mapping](#project-kind-mapping)
- [Persona Roles per Project Kind](#persona-roles-per-project-kind)
- [Project Kind Definitions](#project-kind-definitions)
  - [shell_script_automation](#shell_script_automation)
  - [nodejs_api](#nodejs_api)
  - [nodejs_cli](#nodejs_cli)
  - [nodejs_library](#nodejs_library)
  - [react_spa](#react_spa)
  - [documentation_site](#documentation_site)
  - [static_website](#static_website)
  - [client_spa](#client_spa)
  - [python_app](#python_app)
  - [configuration_library](#configuration_library)
  - [default](#default)
- [Common Patterns](#common-patterns)
- [Integration with ai_helpers.yaml](#integration-with-ai_helpersyaml)
- [Customization Guide](#customization-guide)
- [Version Alignment](#version-alignment)

---

## Overview

The `ai_prompts_project_kinds.yaml` file defines **project-specific AI prompt templates** that customize AI behavior based on the project type. Each project kind has specialized prompts for three personas:
- **documentation_specialist**: Documentation analysis and updates
- **test_engineer**: Test strategy and quality assurance
- **code_reviewer**: Code quality and best practices review

**Key Features:**
- **11 project kinds** with specialized prompts (10 specific + 1 default fallback)
- **3 personas per project kind** for comprehensive workflow coverage
- **Aligned with `project_kinds.yaml` v2.0.0** for consistency
- **Language-specific concerns** and verification checklists
- **Workflow-specific guidance** per project type

**Relationship to Other Files:**
- **`ai_helpers.yaml`**: Defines **generic personas** (doc_analysis, consistency, quality, etc.)
- **`ai_prompts_project_kinds.yaml`** (this file): Defines **project-specific adaptations**
- **`project_kinds.yaml`**: Defines **validation rules** and **requirements** per project type

---

## File Structure

```yaml
# Header (lines 1-5)
# - Version: 2.0.0
# - Purpose: Project kind-specific prompt templates
# - Note: Names must match project_kinds.yaml

# Project Kind Definitions (lines 11-1039)
<project_kind>:
  documentation_specialist:
    role: "You are a [specialized role]..."
    task_context: |
      This is a [project type]. Focus on:
      - [Specific concern 1]
      - [Specific concern 2]
    approach: |
      - [Methodology 1]
      - [Methodology 2]
  
  test_engineer:
    role: "You are a [specialized role]..."
    task_context: |
      [Testing focus areas]
    approach: |
      [Testing methodology]
  
  code_reviewer:
    role: "You are a [specialized role]..."
    task_context: |
      [Code review focus areas]
    approach: |
      [Review methodology]
```

**Total Size**: 1,039 lines

---

## Project Kind Mapping

### Alignment with project_kinds.yaml

The project kind names in `ai_prompts_project_kinds.yaml` **must match** the definitions in `config/project_kinds.yaml` (v2.0.0).

| Project Kind | Status | Lines | Personas | Primary Use Case |
|--------------|--------|-------|----------|------------------|
| `shell_script_automation` | ✅ Aligned | 11-136 | 3 | Shell script automation, CI/CD |
| `nodejs_api` | ✅ Aligned | 137-191 | 3 | Node.js backend APIs (REST, GraphQL) |
| `nodejs_cli` | ⚠️ Extra | 198-256 | 3 | Node.js CLI tools (not in project_kinds.yaml) |
| `nodejs_library` | ⚠️ Extra | 257-315 | 3 | Node.js libraries (not in project_kinds.yaml) |
| `react_spa` | ✅ Aligned | 316-397 | 4 | React single-page applications |
| `documentation_site` | ⚠️ Extra | 398-479 | 4 | Documentation sites (not in project_kinds.yaml) |
| `static_website` | ✅ Aligned | 480-606 | 4 | HTML/CSS/JS static websites |
| `client_spa` | ✅ Aligned | 607-735 | 4 | Vanilla JS SPAs with Bootstrap |
| `python_app` | ✅ Aligned | 736-863 | 3 | Python applications |
| `configuration_library` | ✅ Aligned | 864-991 | 3 | Template/config repositories |
| `default` | ✅ Fallback | 992-1039 | 3 | Generic fallback for any project |

**Note**: 3 project kinds in this file (`nodejs_cli`, `nodejs_library`, `documentation_site`) are **not defined** in `project_kinds.yaml` v2.0.0. These are legacy entries that may be used by older workflows or can be removed in future versions.

### Project Kinds in project_kinds.yaml (v2.0.0)

The following 8 project kinds are defined in `project_kinds.yaml`:
1. `shell_script_automation` ✅
2. `nodejs_api` ✅
3. `client_spa` ✅
4. `react_spa` ✅
5. `static_website` ✅
6. `python_app` ✅
7. `configuration_library` ✅
8. `generic` ⚠️ (called `default` in this file)

---

## Persona Roles per Project Kind

Each project kind defines specialized roles for three personas:

### Standard 3-Persona Projects

Most projects define:
- **documentation_specialist**: Documentation focus
- **test_engineer**: Testing focus
- **code_reviewer**: Code quality focus

**Projects**: shell_script_automation, nodejs_api, nodejs_cli, nodejs_library, python_app, configuration_library, default

### Enhanced 4-Persona Projects

Frontend projects add a fourth persona:
- **documentation_specialist**
- **test_engineer**
- **code_reviewer**
- **ux_designer**: UI/UX and accessibility focus

**Projects**: react_spa, documentation_site, static_website, client_spa

---

## Project Kind Definitions

### shell_script_automation

**Purpose**: Shell script automation projects, CI/CD pipelines, DevOps workflows.

**Lines**: 11-136

**Personas**: 3 (documentation_specialist, test_engineer, code_reviewer)

#### documentation_specialist

**Role**:
```yaml
role: |
  You are a senior DevOps documentation specialist with expertise in:
  - Shell script automation and workflow documentation
  - CI/CD pipeline documentation and runbook creation
  - Infrastructure-as-code documentation standards
  - Command-line tool documentation and usage guides
  - API documentation for shell script libraries
```

**Focus Areas** (task_context):
- Script parameter documentation (flags, options, arguments)
- Workflow orchestration and execution flow diagrams
- Pipeline stages and step dependencies
- Exit codes and error handling patterns
- Environment variable requirements and defaults
- Execution prerequisites (dependencies, permissions)
- Shell function API documentation
- Module sourcing and dependency chains

**Verification Checklist**:
```yaml
- [ ] Shell examples use proper quoting ("${var}")
- [ ] Script invocation examples match actual command-line options
- [ ] Function signatures in docs match actual implementations
- [ ] Exit codes documented match actual return values
- [ ] Environment variables documented match script requirements
- [ ] Workflow diagrams reflect actual step execution order
- [ ] Module dependencies documented match actual source statements
```

**Approach** (5-step workflow):
1. Validate script documentation (README usage vs. actual scripts)
2. Check module consistency (READMEs, function exports, dependencies)
3. Workflow accuracy (step descriptions, pipeline diagrams, orchestration)
4. Shell best practices (safe patterns, error handling, quoting)
5. Cross-reference validation (internal links, diagram references)

#### test_engineer

**Role**: DevOps test automation specialist with BATS framework expertise.

**Focus Areas**:
- Shell script unit testing with BATS/bats-core
- Integration testing for workflow orchestration
- Exit code validation and error handling tests
- Environment variable and configuration tests
- Mocking external commands and services
- Test coverage for edge cases

**Approach**:
- Use BATS testing framework
- Test all exit codes (0 for success, non-zero for errors)
- Mock external commands with test doubles
- Test environment variable handling
- Validate shell script quoting and escaping
- Test permission requirements

#### code_reviewer

**Role**: Senior DevOps engineer with shell scripting security expertise.

**Focus Areas**:
- POSIX compliance vs. Bash-specific features
- Security (input validation, command injection, privilege escalation)
- Error handling (set -euo pipefail, trap handlers)
- Variable quoting and word splitting
- Function design and modularity
- Performance (avoid subshells, optimize loops)

**Approach**:
- Review shebang and set flags (set -euo pipefail)
- Check variable quoting ("${var}" not $var)
- Verify input sanitization
- Review error handling (trap handlers)
- Check for shellcheck compliance
- Validate function exports and sourcing

---

### nodejs_api

**Purpose**: Node.js backend APIs (RESTful, GraphQL, microservices).

**Lines**: 137-191

**Personas**: 3 (documentation_specialist, test_engineer, code_reviewer)

#### documentation_specialist

**Role**: Senior backend API architect and technical writer.

**Focus Areas**:
- API endpoint documentation (methods, paths, parameters)
- Request/response schema documentation
- Authentication and authorization flows
- Error response formats
- Rate limiting and pagination
- OpenAPI/Swagger documentation

**Approach**:
- Document all API endpoints with complete schemas
- Provide request/response examples
- Document authentication requirements
- Explain error codes and messages
- Include rate limiting information
- Maintain OpenAPI/Swagger spec if present

#### test_engineer

**Role**: Backend API testing specialist with contract testing expertise.

**Focus Areas**:
- API endpoint integration tests
- Request/response validation
- Authentication and authorization tests
- Error handling and edge cases
- Database integration tests
- API contract testing

**Approach**:
- Use supertest or similar for HTTP testing
- Test all HTTP methods (GET, POST, PUT, DELETE)
- Validate request/response schemas
- Test authentication flows
- Mock external services
- Test error conditions and status codes

#### code_reviewer

**Role**: Senior Node.js backend engineer with API design expertise.

**Focus Areas**:
- RESTful API design principles
- Route organization and middleware
- Input validation and sanitization
- Error handling middleware
- Database query optimization
- Security (CORS, rate limiting, input validation)

**Approach**:
- Review route design and RESTful compliance
- Check input validation (joi, express-validator)
- Verify error handling middleware
- Review database queries for efficiency
- Check security measures (helmet, cors)
- Validate async/await error handling

---

### nodejs_cli

**Purpose**: Node.js command-line interface tools.

**Lines**: 198-256

**Status**: ⚠️ Not in project_kinds.yaml v2.0.0 (legacy entry)

**Personas**: 3 (documentation_specialist, test_engineer, code_reviewer)

#### documentation_specialist

**Role**: CLI tool developer and technical writer.

**Focus Areas**:
- Command and subcommand documentation
- Option and flag documentation
- Usage examples and common workflows
- Configuration file documentation
- Exit codes and error messages
- Terminal output formatting

#### test_engineer

**Role**: CLI testing specialist with process execution testing expertise.

**Focus Areas**:
- Command execution tests
- Option parsing validation
- STDIN/STDOUT/STDERR testing
- Exit code validation
- Interactive prompt testing
- Configuration file loading tests

#### code_reviewer

**Role**: Senior CLI tool developer with cross-platform expertise.

**Focus Areas**:
- Command parsing and validation
- User experience (help text, errors)
- Cross-platform compatibility
- Configuration management
- Progress indicators and output
- Error reporting and debugging

---

### nodejs_library

**Purpose**: Node.js reusable libraries and npm packages.

**Lines**: 257-315

**Status**: ⚠️ Not in project_kinds.yaml v2.0.0 (legacy entry)

**Personas**: 3 (documentation_specialist, test_engineer, code_reviewer)

#### documentation_specialist

**Role**: Library author and API documentation expert.

**Focus Areas**:
- Public API documentation
- Usage examples and code snippets
- Installation and setup guides
- API reference documentation
- Migration guides for breaking changes
- JSDoc annotations

#### test_engineer

**Role**: Library testing specialist with unit testing expertise.

**Focus Areas**:
- Public API unit tests
- Edge case and error condition tests
- Browser and Node.js compatibility tests
- Integration tests with common use cases
- Performance benchmarks
- Code coverage targets

#### code_reviewer

**Role**: Senior Node.js library developer with API design expertise.

**Focus Areas**:
- Public API design and clarity
- Backward compatibility
- Tree-shaking and bundle size
- Performance optimization
- Error handling and validation
- TypeScript types

---

### react_spa

**Purpose**: React single-page applications.

**Lines**: 316-397

**Personas**: 4 (documentation_specialist, test_engineer, code_reviewer, ux_designer)

#### documentation_specialist

**Role**: React developer and technical writer.

**Focus Areas**:
- Component API documentation
- Props and state documentation
- Hook usage and custom hooks
- Context and state management
- Routing and navigation
- Build and deployment

#### test_engineer

**Role**: React testing specialist with React Testing Library expertise.

**Focus Areas**:
- Component unit tests (React Testing Library)
- User interaction testing
- Async behavior and data fetching
- Routing tests
- State management tests
- Accessibility tests

**Approach**:
- Use React Testing Library (not Enzyme)
- Test user-facing behavior, not implementation
- Use userEvent for interactions
- Test loading/error states
- Mock API calls
- Query by accessible roles

#### code_reviewer

**Role**: Senior React engineer with hooks and performance expertise.

**Focus Areas**:
- Component design and composition
- Hook usage (useState, useEffect, custom hooks)
- Performance (useMemo, useCallback, React.memo)
- State management (Context, Redux, Zustand)
- Accessibility (ARIA, semantic HTML)
- Security (XSS prevention, sanitization)

#### ux_designer

**Role**: UX designer and accessibility specialist.

**Focus Areas**:
- Component UX and interaction design
- Responsive design patterns
- Accessibility (WCAG AA compliance)
- Loading states and error handling
- User feedback and notifications
- Keyboard navigation

---

### documentation_site

**Purpose**: Documentation websites (Docusaurus, VuePress, MkDocs).

**Lines**: 398-479

**Status**: ⚠️ Not in project_kinds.yaml v2.0.0 (legacy entry)

**Personas**: 4 (documentation_specialist, test_engineer, code_reviewer, ux_designer)

#### documentation_specialist

**Role**: Technical writer and documentation architect.

**Focus Areas**:
- Content organization and information architecture
- Navigation structure and discoverability
- Search functionality and findability
- Code examples and interactive demos
- Version documentation and migration guides
- Internationalization (i18n) if applicable

#### test_engineer

**Role**: Documentation testing specialist.

**Focus Areas**:
- Link validation (internal and external)
- Code example accuracy and execution
- Search functionality testing
- Build process validation
- Cross-browser compatibility
- Accessibility testing

#### code_reviewer

**Role**: Documentation platform engineer.

**Focus Areas**:
- Build performance and optimization
- Plugin/theme configuration
- Custom component implementation
- Search index generation
- Asset optimization
- Deployment configuration

#### ux_designer

**Role**: Documentation UX specialist.

**Focus Areas**:
- Content readability and typography
- Navigation patterns and wayfinding
- Mobile responsiveness
- Search experience
- Dark mode and theming
- Accessibility

---

### static_website

**Purpose**: HTML/CSS/JavaScript static websites.

**Lines**: 480-606

**Personas**: 4 (documentation_specialist, test_engineer, code_reviewer, ux_designer)

#### documentation_specialist

**Role**: Web developer and technical writer.

**Focus Areas**:
- Setup and build documentation
- Asset organization and optimization
- HTML structure and semantic markup
- CSS architecture and methodology
- JavaScript functionality documentation
- Deployment and hosting

#### test_engineer

**Role**: Web testing specialist.

**Focus Areas**:
- HTML validation (W3C validator)
- CSS validation and linting
- JavaScript functionality tests
- Cross-browser compatibility (Playwright, BrowserStack)
- Accessibility testing (axe, WAVE)
- Performance testing (Lighthouse)

#### code_reviewer

**Role**: Senior web developer with standards expertise.

**Focus Areas**:
- Semantic HTML and accessibility
- CSS organization (BEM, SMACSS)
- JavaScript best practices (ES6+, vanilla JS patterns)
- Performance optimization (minification, lazy loading)
- SEO optimization (meta tags, structured data)
- Security (CSP, HTTPS, input sanitization)

#### ux_designer

**Role**: Web UX designer and accessibility specialist.

**Focus Areas**:
- Responsive design and mobile-first approach
- Typography and visual hierarchy
- Color contrast and WCAG compliance
- Touch targets and mobile interactions
- Loading performance and perceived speed
- Form UX and validation feedback

---

### client_spa

**Purpose**: Vanilla JavaScript SPAs with Bootstrap (no framework).

**Lines**: 607-735

**Personas**: 4 (documentation_specialist, test_engineer, code_reviewer, ux_designer)

**Key Distinction**: This is for **vanilla JS** SPAs, not React/Vue/Angular.

#### documentation_specialist

**Role**: SPA developer and technical writer.

**Focus Areas**:
- SPA architecture and routing
- Component/module structure
- State management patterns
- API integration and data flow
- Build tooling (webpack, Vite)
- Bootstrap customization

#### test_engineer

**Role**: SPA testing specialist.

**Focus Areas**:
- Component/module unit tests
- Integration tests with DOM
- Router functionality tests
- State management tests
- API mock and integration tests
- E2E tests with Playwright/Cypress

#### code_reviewer

**Role**: Senior SPA developer with vanilla JS expertise.

**Focus Areas**:
- Vanilla JS patterns (no framework dependencies)
- DOM manipulation efficiency
- Event handling and delegation
- State management without frameworks
- Bootstrap usage and customization
- Module organization (ES modules)

#### ux_designer

**Role**: SPA UX designer and Bootstrap expert.

**Focus Areas**:
- Bootstrap component usage
- Responsive design with Bootstrap grid
- SPA navigation patterns
- Loading states and transitions
- Mobile responsiveness
- Bootstrap theming

---

### python_app

**Purpose**: Python applications (CLI, web, data processing).

**Lines**: 736-863

**Personas**: 3 (documentation_specialist, test_engineer, code_reviewer)

#### documentation_specialist

**Role**: Python developer and technical writer.

**Focus Areas**:
- Module and package documentation
- Function and class docstrings (Google/NumPy style)
- CLI usage and arguments (if applicable)
- Configuration documentation
- Installation and setup (pip, requirements.txt)
- API documentation with Sphinx

#### test_engineer

**Role**: Python testing specialist with pytest expertise.

**Focus Areas**:
- Unit tests with pytest
- Integration tests
- Fixture design and reuse
- Mocking external dependencies (unittest.mock)
- Test coverage with pytest-cov
- Parametrized tests

#### code_reviewer

**Role**: Senior Python developer with best practices expertise.

**Focus Areas**:
- Type hints (PEP 484) and mypy validation
- Exception handling patterns
- Code style (PEP 8, Black, Flake8)
- Function and class design
- Module organization and imports
- Performance optimization

**Approach**:
- Review type hints coverage
- Check exception handling
- Verify PEP 8 compliance
- Review docstrings (PEP 257)
- Check for common antipatterns
- Validate import organization

---

### configuration_library

**Purpose**: Template and configuration repositories (like ai_workflow_core itself).

**Lines**: 864-991

**Personas**: 3 (documentation_specialist, test_engineer, code_reviewer)

**Special Characteristics**:
- Meta-type: Provides templates for other projects
- Git submodule deployment pattern
- YAML/template validation focus

#### documentation_specialist

**Role**: Configuration architect and technical writer.

**Focus Areas**:
- Template file documentation
- Placeholder reference documentation
- Integration guide documentation
- Schema documentation (YAML schemas)
- Example project documentation
- Usage patterns and best practices

**Approach**:
- Document all template placeholders
- Provide integration examples
- Explain schema structure
- Include customization guides
- Document Git submodule usage
- Maintain clear API references

#### test_engineer

**Role**: Configuration validation specialist.

**Focus Areas**:
- YAML syntax validation
- Schema validation tests
- Template placeholder validation
- Example project validation
- Documentation consistency tests
- Integration test with sample projects

**Approach**:
- Validate YAML syntax with yamllint
- Test schema compliance
- Verify placeholder substitution
- Test example configurations
- Validate documentation links
- Test Git submodule integration

#### code_reviewer

**Role**: Configuration systems architect.

**Focus Areas**:
- YAML structure and organization
- Schema design and validation rules
- Template placeholder patterns
- Git submodule best practices
- Documentation clarity and completeness
- Example project quality

**Approach**:
- Review YAML schema design
- Check placeholder consistency
- Verify template completeness
- Review integration patterns
- Check documentation coverage
- Validate example projects

---

### default

**Purpose**: Generic fallback for projects not matching specific types.

**Lines**: 992-1039

**Personas**: 3 (documentation_specialist, test_engineer, code_reviewer)

**Characteristics**:
- Generic, language-agnostic prompts
- Broad best practices focus
- No technology-specific assumptions

#### documentation_specialist

**Role**: Senior technical documentation specialist.

**Focus Areas** (generic):
- Clear and accurate documentation
- Comprehensive API documentation
- Usage examples and tutorials
- Architecture documentation
- Setup and configuration guides

#### test_engineer

**Role**: QA engineer and test automation specialist.

**Focus Areas** (generic):
- Comprehensive test coverage
- Unit and integration tests
- Edge case testing
- Error condition testing
- Test maintainability

#### code_reviewer

**Role**: Senior software engineer.

**Focus Areas** (generic):
- Code quality and maintainability
- Best practices and patterns
- Error handling
- Security considerations
- Performance optimization

---

## Common Patterns

### Role Structure

All roles follow this pattern:
```yaml
role: "You are a [seniority] [specialization] with expertise in [domains]..."
```

**Components**:
- **Seniority**: "senior", "Senior", implying experience
- **Specialization**: "DevOps documentation specialist", "backend API architect", etc.
- **Domains**: List of 3-6 specific expertise areas

### Task Context Structure

All task_context blocks follow:
```yaml
task_context: |
  This is a [project type]. Focus on:
  - [Specific concern 1]
  - [Specific concern 2]
  - [Specific concern 3]
  - [...]
```

**Pattern**: "This is a..." statement followed by bulleted focus areas.

### Approach Structure

All approach blocks follow:
```yaml
approach: |
  - [Action/methodology 1]
  - [Action/methodology 2]
  - [Action/methodology 3]
  - [...]
```

**Pattern**: Bulleted list of concrete actions or methodologies.

### Verification Checklist Pattern

Shell script automation includes:
```yaml
**Verification Checklist**:
- [ ] [Checkable item 1]
- [ ] [Checkable item 2]
- [ ] [...]
```

**Purpose**: Provide specific validation criteria for documentation specialist.

---

## Integration with ai_helpers.yaml

### Two-Layer Prompt System

The AI prompt system has **two layers**:

**Layer 1: Generic Personas** (`ai_helpers.yaml`):
- `doc_analysis_prompt`: Generic documentation analysis
- `consistency_prompt`: Generic consistency checking
- `test_strategy_prompt`: Generic test strategy
- `quality_prompt`: Generic code quality
- etc.

**Layer 2: Project-Specific Adaptations** (`ai_prompts_project_kinds.yaml`):
- `shell_script_automation.documentation_specialist`: Shell-specific docs
- `nodejs_api.test_engineer`: API-specific testing
- `react_spa.ux_designer`: React-specific UX
- etc.

### Prompt Composition Pattern

The prompt builder composes prompts by:

1. **Select generic persona** from `ai_helpers.yaml`:
   ```yaml
   # Base persona
   doc_analysis_prompt:
     role_prefix: "You are a senior technical documentation specialist..."
     behavioral_guidelines: *behavioral_actionable
   ```

2. **Overlay project-specific adaptation** from `ai_prompts_project_kinds.yaml`:
   ```yaml
   # Project-specific overlay
   shell_script_automation:
     documentation_specialist:
       role: "You are a senior DevOps documentation specialist..."
       task_context: "This is a shell script automation project. Focus on..."
   ```

3. **Compose final prompt**:
   ```text
   [Generic role from ai_helpers.yaml]
   [Generic behavioral guidelines]
   
   [Project-specific role enhancement]
   [Project-specific task context]
   [Project-specific approach]
   ```

### Example Integration

**Workflow step**: Documentation analysis for a shell script project.

**Step 1**: Load configuration:
```bash
project_kind=$(yq ".project.kind" .workflow-config.yaml)
# Result: "shell_script_automation"
```

**Step 2**: Get generic persona from ai_helpers.yaml:
```bash
generic_role=$(yq ".doc_analysis_prompt.role_prefix" config/ai_helpers.yaml)
generic_behavior=$(yq ".doc_analysis_prompt.behavioral_guidelines" config/ai_helpers.yaml)
```

**Step 3**: Get project-specific overlay from ai_prompts_project_kinds.yaml:
```bash
specific_role=$(yq ".${project_kind}.documentation_specialist.role" config/ai_prompts_project_kinds.yaml)
specific_context=$(yq ".${project_kind}.documentation_specialist.task_context" config/ai_prompts_project_kinds.yaml)
specific_approach=$(yq ".${project_kind}.documentation_specialist.approach" config/ai_prompts_project_kinds.yaml)
```

**Step 4**: Compose final prompt:
```bash
final_prompt="
${generic_role}

${generic_behavior}

${specific_role}

${specific_context}

${specific_approach}
"
```

---

## Customization Guide

### Adding a New Project Kind

To add a new project kind:

**1. Add to project_kinds.yaml first**:
```yaml
# config/project_kinds.yaml
project_kinds:
  my_new_kind:
    validation:
      required_files: [...]
    testing:
      framework: "..."
```

**2. Add to ai_prompts_project_kinds.yaml**:
```yaml
# config/ai_prompts_project_kinds.yaml
my_new_kind:
  documentation_specialist:
    role: "You are a [specialized role for this project type]..."
    task_context: |
      This is a [project type]. Focus on:
      - [Specific concern 1]
      - [Specific concern 2]
    approach: |
      - [Methodology 1]
      - [Methodology 2]
  
  test_engineer:
    role: "You are a [test specialist for this type]..."
    task_context: |
      [Testing focus areas]
    approach: |
      [Testing methodology]
  
  code_reviewer:
    role: "You are a [code review specialist for this type]..."
    task_context: |
      [Code review focus areas]
    approach: |
      [Review methodology]
```

**3. Optional: Add 4th persona for frontend projects**:
```yaml
  ux_designer:
    role: "You are a [UX specialist]..."
    task_context: |
      [UX focus areas]
    approach: |
      [UX methodology]
```

**4. Update integration scripts**: Ensure prompt builder recognizes the new kind.

### Modifying an Existing Project Kind

To customize prompts for an existing project kind:

**1. Identify the project kind** and persona to modify.

**2. Update the relevant fields**:
```yaml
nodejs_api:
  documentation_specialist:
    # Modify role to add expertise
    role: "You are a senior backend API architect, GraphQL expert, and technical writer..."
    
    # Add to focus areas
    task_context: |
      This is a Node.js API project. Focus on:
      - GraphQL schema documentation  # NEW
      - API endpoint documentation
      - [...]
    
    # Add to approach
    approach: |
      - Document GraphQL queries and mutations  # NEW
      - Document all API endpoints
      - [...]
```

**3. Test the changes**: Verify AI behavior matches expectations.

### Adding Language-Specific Concerns

For technology-specific projects:

**1. Add technology to focus areas**:
```yaml
task_context: |
  This is a Python app project. Focus on:
  - FastAPI endpoint documentation  # Specific framework
  - Pydantic model documentation
  - Async/await patterns in Python
```

**2. Add framework to approach**:
```yaml
approach: |
  - Document FastAPI routes and dependencies
  - Document Pydantic models and validation
  - Provide async usage examples
```

**3. Reference language-specific standards** from ai_helpers.yaml:
```yaml
approach: |
  **Language-Specific Standards:** {language_specific_documentation}
```

### Creating Project-Specific Verification Checklists

For complex project types:

```yaml
documentation_specialist:
  task_context: |
    [...]
    
    **Verification Checklist**:
    - [ ] API endpoints documented with request/response examples
    - [ ] Authentication flows explained with diagrams
    - [ ] Rate limiting policies documented
    - [ ] Error codes and messages listed
    - [ ] OpenAPI/Swagger spec is up-to-date
```

**Benefits**:
- Provides concrete validation criteria
- Ensures completeness
- Guides AI toward thorough analysis

---

## Version Alignment

### Alignment with project_kinds.yaml v2.0.0

**Fully Aligned (8/11)**:
| Project Kind | In project_kinds.yaml | In ai_prompts | Status |
|--------------|----------------------|---------------|--------|
| `shell_script_automation` | ✅ | ✅ | Aligned |
| `nodejs_api` | ✅ | ✅ | Aligned |
| `client_spa` | ✅ | ✅ | Aligned |
| `react_spa` | ✅ | ✅ | Aligned |
| `static_website` | ✅ | ✅ | Aligned |
| `python_app` | ✅ | ✅ | Aligned |
| `configuration_library` | ✅ | ✅ | Aligned |
| `generic` | ✅ | ✅ (as `default`) | Aligned (naming) |

**Legacy Entries (3/11)**:
| Project Kind | In project_kinds.yaml | In ai_prompts | Status |
|--------------|----------------------|---------------|--------|
| `nodejs_cli` | ❌ | ✅ | Legacy (consider adding to project_kinds.yaml) |
| `nodejs_library` | ❌ | ✅ | Legacy (consider adding to project_kinds.yaml) |
| `documentation_site` | ❌ | ✅ | Legacy (consider adding to project_kinds.yaml) |

### Version History

**Version 2.0.0 (2026-01-31)**:
- Renamed `shell_automation` → `shell_script_automation` to match project_kinds.yaml
- Renamed `web_application` → `react_spa` to match project_kinds.yaml
- Updated comments to note alignment with project_kinds.yaml

**Version 1.1.0 (estimated)**:
- Added `configuration_library` project kind
- Added `client_spa` project kind

**Version 1.0.2 (estimated)**:
- Initial release with core project kinds

### Migration Path

For projects using legacy project kinds (`nodejs_cli`, `nodejs_library`, `documentation_site`):

**Option 1**: Add to project_kinds.yaml:
```yaml
# config/project_kinds.yaml
project_kinds:
  nodejs_cli:
    validation:
      required_files: ["package.json", "bin/"]
    testing:
      framework: "jest"
  # etc.
```

**Option 2**: Map to closest existing project kind:
- `nodejs_cli` → `nodejs_api` (if backend) or `generic`
- `nodejs_library` → `nodejs_api` (if API-like) or `generic`
- `documentation_site` → `static_website` or `generic`

**Option 3**: Remove from ai_prompts_project_kinds.yaml if unused.

---

## Related Documentation

- **[config/ai_helpers.yaml](../../config/ai_helpers.yaml)** - Generic AI persona definitions
- **[config/project_kinds.yaml](../../config/project_kinds.yaml)** - Project type validation rules
- **[config/.workflow-config.yaml.template](../../config/.workflow-config.yaml.template)** - Project configuration template
- **[docs/api/AI_HELPERS_REFERENCE.md](AI_HELPERS_REFERENCE.md)** - AI helpers reference
- **[docs/api/PROJECT_KINDS_SCHEMA.md](PROJECT_KINDS_SCHEMA.md)** - Project kinds schema
- **[docs/api/CONFIG_REFERENCE.md](CONFIG_REFERENCE.md)** - Configuration field reference
- **[docs/INTEGRATION.md](../INTEGRATION.md)** - Integration guide
- **[README.md](../../README.md)** - Project overview

---

**Last Updated**: 2026-02-07  
**Document Version**: 1.0.2  
**Schema Version**: 2.0.0 (ai_prompts_project_kinds.yaml)
