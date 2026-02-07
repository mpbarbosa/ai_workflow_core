# AI Helpers Reference

**Version**: 5.0.0  
**Last Updated**: 2026-02-07  
**Schema File**: `config/ai_helpers.yaml`

> **Purpose**: Complete reference for the `ai_helpers.yaml` configuration file. This document explains the AI persona system, YAML anchor patterns for token efficiency, language-specific standards injection, and prompt builder integration patterns.

---

## Table of Contents

- [Overview](#overview)
- [File Structure](#file-structure)
- [Token Efficiency System](#token-efficiency-system)
- [YAML Anchor Pattern](#yaml-anchor-pattern)
- [AI Persona Definitions](#ai-persona-definitions)
  - [doc_analysis_prompt](#doc_analysis_prompt)
  - [consistency_prompt](#consistency_prompt)
  - [technical_writer_prompt](#technical_writer_prompt)
  - [test_strategy_prompt](#test_strategy_prompt)
  - [quality_prompt](#quality_prompt)
  - [issue_extraction_prompt](#issue_extraction_prompt)
  - [markdown_lint_prompt](#markdown_lint_prompt)
  - [version_manager_prompt](#version_manager_prompt)
- [Language-Specific Standards](#language-specific-standards)
- [Version History](#version-history)
- [Integration Patterns](#integration-patterns)
- [Customization Guide](#customization-guide)

---

## Overview

The `ai_helpers.yaml` file defines **AI persona templates** used by workflow automation systems. Each persona represents a specialized AI role (documentation specialist, test engineer, code reviewer, etc.) with specific expertise, behavioral guidelines, and task templates.

**Key Features:**
- **8 core AI personas** for different workflow stages
- **Token efficiency optimization** (~1,400-1,500 tokens saved per workflow)
- **YAML anchors** for DRY principle and maintainability
- **Language-specific injection** for polyglot support (8 languages)
- **Prompt builder integration** for dynamic composition

**Use Cases:**
- Workflow automation systems that need AI-powered code review, testing, documentation
- CI/CD pipelines with AI-assisted quality gates
- Documentation generation and consistency checking
- Test strategy and quality analysis
- Version management with semantic versioning

---

## File Structure

The file is organized into four main sections:

```yaml
# 1. CUMULATIVE TOKEN EFFICIENCY SUMMARY (lines 5-106)
#    - Token savings breakdown by optimization type
#    - Cost impact analysis ($21-22.50/month savings for 500 workflows)
#    - Version history of optimizations (v3.0.0 → v5.0.0)

# 2. REUSABLE BEHAVIORAL GUIDELINES (lines 108-130)
#    - YAML anchors (&behavioral_actionable, &behavioral_structured)
#    - Shared behavioral patterns across personas

# 3. AI PERSONA DEFINITIONS (lines 132-2034)
#    - 8 core personas with role, task, approach, output format
#    - Each persona uses anchors for token efficiency

# 4. LANGUAGE-SPECIFIC STANDARDS (lines 1585-2034)
#    - Documentation standards per language (JSDoc, PEP 257, godoc, etc.)
#    - Code quality standards per language
#    - Testing standards per language
```

**Total Size**: 2,064 lines

---

## Token Efficiency System

### Summary

**Total Savings**: ~1,400-1,500 tokens per workflow (vs. v3.0.0 baseline)

**Breakdown by Optimization:**
- Output format simplification (v4.0.0): ~550 tokens
- Language-specific injection cleanup (v4.0.0): ~340 tokens
- Anchor pattern implementation (v3.2.0): ~260-390 tokens
- Verbose section headers (v3.5.0): ~105-210 tokens
- Redundant output warnings (v3.6.0): ~40-50 tokens
- Test strategy separation (v3.3.0): ~100-150 tokens
- Redundant test context (v4.0.0): ~55 tokens

**Cost Impact** (GPT-4 @ $0.03/1K input tokens):
- Per workflow: ~$0.042-0.045 saved
- 500 workflows/month: ~$21-22.50/month
- Annual savings: ~$252-270/year

### Optimization Strategies

**1. YAML Anchors for Behavioral Guidelines**
```yaml
# Define once, reference everywhere
_behavioral_actionable: &behavioral_actionable |
  **Critical Behavioral Guidelines**:
  - ALWAYS provide concrete, actionable output
  - Make informed decisions based on available context
  
# Reference in personas
doc_analysis_prompt:
  behavioral_guidelines: *behavioral_actionable
```

**2. Role Prefix + Guidelines Pattern**
```yaml
# Split role into two parts for flexibility
role_prefix: |
  You are a senior technical documentation specialist...

behavioral_guidelines: *behavioral_actionable

# Legacy field for backward compatibility
role: |
  [Full combined role text]
```

**3. Language-Specific Injection**
```yaml
# Template placeholder in prompts
approach: |
  **Language-Specific Standards:** {language_specific_documentation}

# Populated at runtime based on project language
language_specific_documentation:
  javascript: { JSDoc standards }
  python: { PEP 257 standards }
```

**4. Output Format Simplification**
- Removed rigid templates from 5 prompts (v4.0.0)
- Changed from prescriptive structure to flexible guidance
- Example: `consistency_prompt` output format: 26 lines → 5 lines (~295 tokens saved)

---

## YAML Anchor Pattern

### Behavioral Guidelines Anchors

The file defines two reusable behavioral guideline anchors:

#### 1. `&behavioral_actionable`

**Purpose**: For personas that must produce concrete output without asking questions.

**Content**:
```yaml
_behavioral_actionable: &behavioral_actionable |
  **Critical Behavioral Guidelines**:
  - ALWAYS provide concrete, actionable output (never ask clarifying questions)
  - If documentation is accurate, explicitly say "No updates needed - documentation is current"
  - Only update what is truly outdated or incorrect
  - Make informed decisions based on available context
  - Default to "no changes" rather than making unnecessary modifications
```

**Used By**:
- `doc_analysis_prompt`
- `technical_writer_prompt`
- `version_manager_prompt`

#### 2. `&behavioral_structured`

**Purpose**: For personas that must provide structured analysis with specific findings.

**Content**:
```yaml
_behavioral_structured: &behavioral_structured |
  **Critical Behavioral Guidelines**:
  - ALWAYS provide structured, prioritized analysis (never general observations)
  - Identify specific files, line numbers, and exact issues
  - Include concrete recommended fixes for each problem
  - Prioritize issues by severity and impact on user experience
  - Focus on accuracy and consistency over style preferences
  - Default to "no issues found" only when documentation is truly consistent
```

**Used By**:
- `consistency_prompt`

### Anchor Integration Pattern

Each persona uses anchors to compose the final role text:

```yaml
persona_name_prompt:
  # Modern pattern (v3.2.0+)
  role_prefix: |
    [Specific expertise and domain knowledge]
  
  behavioral_guidelines: *behavioral_actionable  # Reference anchor
  
  # Legacy field (backward compatibility)
  role: |
    [Full combined role text = role_prefix + behavioral_guidelines]
```

**Prompt Builder Integration**: The `ai_helpers.sh` script (or equivalent) composes the final prompt by combining `role_prefix + behavioral_guidelines` at runtime.

---

## AI Persona Definitions

### Overview of Personas

| Persona | Purpose | Behavioral Pattern | Line Range |
|---------|---------|-------------------|------------|
| `doc_analysis_prompt` | Analyze code changes and update documentation | Actionable | 136-212 |
| `consistency_prompt` | Check documentation consistency and accuracy | Structured | 214-318 |
| `technical_writer_prompt` | Create comprehensive documentation from scratch | Actionable | 320-475 |
| `test_strategy_prompt` | Design test strategies and coverage analysis | Structured | 477-547 |
| `quality_prompt` | Code quality analysis and best practices review | Structured | 549-580 |
| `issue_extraction_prompt` | Extract actionable issues from analysis reports | Actionable | 582-1404 |
| `markdown_lint_prompt` | Markdown formatting and style consistency | Structured | 1406-1583 |
| `version_manager_prompt` | Semantic version bump recommendations | Actionable | 2036-2063 |

---

### doc_analysis_prompt

**Purpose**: Analyze code changes and make specific edits to update documentation.

**Behavioral Pattern**: Actionable (uses `&behavioral_actionable`)

**Use Cases**:
- Post-commit documentation updates
- Pull request documentation validation
- Incremental documentation maintenance
- Documentation drift detection

#### Fields

**`role_prefix`** (lines 138-140):
```yaml
role_prefix: |
  You are a senior technical documentation specialist with expertise in software 
  architecture documentation, API documentation, and developer experience (DX) optimization.
```

**`behavioral_guidelines`** (line 142):
```yaml
behavioral_guidelines: *behavioral_actionable
```
References the `&behavioral_actionable` anchor for consistent behavior across personas.

**`task_template`** (lines 156-174):
```yaml
task_template: |
  **YOUR TASK**: Analyze the changed files and make specific edits to update the documentation.
  
  **Changed files**: {changed_files}
  **Documentation to review**: {doc_files}
  
  **REQUIRED ACTIONS**:
  1. **Read the changes**: Examine what was modified in each changed file
  2. **Identify documentation impact**: Determine which docs need updates
  3. **Determine changes**: Identify exact sections requiring updates
  4. **Verify accuracy**: Ensure examples and references are still correct
  
  **OUTPUT FORMAT**: Use edit blocks showing before/after, or provide specific line-by-line changes.
```

**Template Placeholders**:
- `{changed_files}` - List of modified files in the commit/PR
- `{doc_files}` - List of documentation files to review
- `{language_specific_documentation}` - Injected based on project language

**`approach`** (lines 176-212):
Defines a 4-step methodology:
1. **Analyze Changes**: Use workspace context to examine modifications
2. **Prioritize Updates**: Start with README.md, copilot-instructions.md
3. **Edit Surgically**: Provide exact text changes only where needed
4. **Verify Consistency**: Maintain project standards

**Language-Specific Injection** (line 205):
```yaml
**Language-Specific Standards:** {language_specific_documentation}
```
This placeholder is populated at runtime based on the project's `primary_language` setting.

#### Example Usage

```bash
# In a workflow script
changed_files="src/api.js,src/utils.js"
doc_files="README.md,docs/API.md"

# Prompt builder composes final prompt
role_text="${role_prefix}\n\n${behavioral_guidelines}"
task_text=$(substitute_placeholders "$task_template" \
  changed_files="$changed_files" \
  doc_files="$doc_files")
```

---

### consistency_prompt

**Purpose**: Perform comprehensive documentation consistency analysis.

**Behavioral Pattern**: Structured (uses `&behavioral_structured`)

**Use Cases**:
- Documentation quality audits
- Pre-release consistency checks
- Cross-reference validation
- Terminology standardization

#### Fields

**`role_prefix`** (lines 216-222):
```yaml
role_prefix: |
  You are a senior technical documentation specialist and information architect with deep expertise in:
  - Content consistency analysis and cross-reference validation
  - Documentation quality assurance and accessibility standards
  - Technical writing best practices and style guide enforcement
  - Information architecture and content organization
  - Documentation testing and accuracy verification
```

**`behavioral_guidelines`** (line 224):
```yaml
behavioral_guidelines: *behavioral_structured
```
Uses the structured analysis anchor for prioritized, specific findings.

**`task_template`** (lines 243-276):
Defines 4 analysis areas:
1. **Consistency Issues** (Highest Priority): Cross-references, terminology, versions, formatting
2. **Completeness Gaps** (High Priority): New features, API docs, examples, prerequisites
3. **Accuracy Verification** (Critical Priority): Code alignment, version accuracy, feature status
4. **Quality & Usability** (Medium Priority): Clarity, structure, navigation, accessibility

**`approach`** (lines 278-318):
4-step methodology:
1. **Prioritize by Category**: Critical → User → Developer → Archive
2. **Systematic Validation**: Cross-references, terminology, versions, examples
3. **Structured Reporting**: Organize by severity (Critical > High > Medium > Low)
4. **Actionable Recommendations**: File path, line number, problem, fix, impact

#### Output Structure

```markdown
**Executive Summary**: [2-3 sentences]

## Critical Issues
- **README.md:45**: Version listed as 2.3.0 but source is 2.4.0
  - Fix: Update version to 2.4.0
  - Impact: Users may download wrong version

## High Priority Issues
[Similar structure]

## Summary Statistics
- Critical: 3 issues
- High: 7 issues
- Estimated fix time: 30 minutes
```

---

### technical_writer_prompt

**Purpose**: Create comprehensive documentation from scratch for undocumented or new projects.

**Behavioral Pattern**: Actionable (uses `&behavioral_actionable`)

**Use Cases**:
- Bootstrap documentation for new projects
- Document legacy codebases
- Create missing API documentation
- Generate architecture guides from code

**Added**: v5.0.0 (2026-01-30)

#### Fields

**`role_prefix`** (lines 326-334):
```yaml
role_prefix: |
  You are a senior technical writer and documentation architect with expertise in:
  - Analyzing existing documentation to identify gaps and missing sections
  - Creating comprehensive documentation from scratch for undocumented codebases
  - API documentation generation (functions, classes, modules, REST APIs)
  - Architecture documentation (system design, data flow, component diagrams)
  - User-facing documentation (getting started, tutorials, how-to guides)
  - Developer documentation (contributing guides, testing, deployment)
  - Code documentation (inline comments, docstrings, function headers)
```

**`task_template`** (lines 356-475):
Two-phase approach:
1. **Analysis Phase**: Identify missing/incomplete documentation
2. **Creation Phase**: Generate documentation for 4 types:
   - API Documentation
   - Architecture Documentation
   - User Guides
   - Developer Guides

**Template Placeholders**:
- `{project_name}` - Project name
- `{project_description}` - Brief description
- `{primary_language}` - Programming language
- `{doc_count}` - Number of existing doc files
- `{source_files}` - Number of source files

**Critical Instruction** (line 359):
```yaml
**CRITICAL**: You MUST proceed with the analysis and documentation generation. 
Do NOT ask what to write or for clarification. Use available context to make informed decisions.
```

#### Complementary Personas

The `technical_writer_prompt` complements two existing documentation personas:

| Persona | Use Case |
|---------|----------|
| `technical_writer_prompt` | **Comprehensive** from-scratch documentation creation |
| `doc_analysis_prompt` | **Incremental** change-driven documentation updates |
| `consistency_prompt` | **Quality assurance** and auditing |

---

### test_strategy_prompt

**Purpose**: Design test strategies, identify coverage gaps, and recommend test cases.

**Behavioral Pattern**: Structured (uses `&behavioral_structured`)

**Use Cases**:
- Test planning for new features
- Coverage gap analysis
- Test architecture design
- Quality gate recommendations

#### Fields

**`role_prefix`** (lines 479-486):
```yaml
role_prefix: |
  You are a Senior Test Architect and Quality Engineering Strategist with expertise in:
  - Test strategy design (unit, integration, E2E, performance, security)
  - Coverage analysis and gap identification
  - Risk-based testing prioritization
  - Test architecture and framework selection
  - Quality metrics and KPI definition
```

**`task_template`** (lines 496-547):
Defines strategic test planning activities:
- Coverage gap identification
- Test case generation
- Risk prioritization
- Framework recommendations

**Separation from Implementation** (v3.3.0):
```yaml
# test_strategy_prompt: WHAT to test (strategic)
# step5_test_review_prompt: HOW to test (tactical implementation)
```

This separation saves ~100-150 tokens by eliminating duplicate instructions.

---

### quality_prompt

**Purpose**: Code quality analysis and best practices review.

**Behavioral Pattern**: Structured analysis

**Use Cases**:
- Code review automation
- Pre-commit quality gates
- Technical debt identification
- Best practices enforcement

#### Fields

**`role_prefix`** (lines 551-559):
```yaml
role_prefix: |
  You are a Senior Software Architect and Code Quality Expert with 15+ years of experience in:
  - Code review and quality assessment across multiple languages
  - Design patterns and architectural best practices
  - Performance optimization and scalability analysis
  - Security vulnerability identification
  - Technical debt assessment and refactoring strategies
  - Team leadership and mentoring on code quality standards
```

**Authority Enhancement** (v4.0.0): Added credentials ("15+ years of experience") to strengthen role authority (+20 tokens, intentional trade-off for quality).

**Language-Specific Injection**:
```yaml
approach: |
  **Language-Specific Standards:** {language_specific_quality}
```

Populated at runtime with language-specific antipatterns, best practices, and focus areas.

---

### issue_extraction_prompt

**Purpose**: Extract actionable issues from AI analysis reports.

**Behavioral Pattern**: Actionable

**Use Cases**:
- Parse AI-generated analysis into structured issues
- Create GitHub issues from analysis reports
- Generate task lists from quality reviews
- Convert analysis into actionable items

#### Fields

**`role_prefix`** (lines 584-590):
```yaml
role_prefix: |
  You are an Issue Extraction Specialist with expertise in:
  - Parsing technical analysis reports
  - Converting findings into actionable issues
  - Prioritizing and categorizing problems
  - Writing clear issue descriptions with context
  - Extracting key information from verbose logs
```

**Key Responsibility**: Transform verbose AI analysis into structured, actionable issue reports suitable for issue trackers.

---

### markdown_lint_prompt

**Purpose**: Markdown formatting and style consistency validation.

**Behavioral Pattern**: Structured

**Use Cases**:
- Documentation style enforcement
- Markdown linting automation
- Formatting consistency checks
- Link validation

#### Fields

**`role_prefix`** (lines 1408-1414):
```yaml
role_prefix: |
  You are a Documentation Quality Specialist with expertise in:
  - Markdown syntax and best practices
  - Documentation formatting standards
  - Link validation and reference checking
  - Style guide enforcement
  - Accessibility in documentation
```

**Output Format Simplification** (v4.0.0):
Removed word count requirement (~10 tokens saved) for more flexible output.

---

### version_manager_prompt

**Purpose**: Analyze changes and recommend semantic version bumps.

**Behavioral Pattern**: Actionable (uses `&behavioral_actionable`)

**Use Cases**:
- Automated version management
- Semantic versioning enforcement
- Release preparation
- Changelog generation

#### Fields

**`role_prefix`** (line 2037):
```yaml
role_prefix: "You are a Version Manager and Semantic Versioning Expert"
```

**`specific_expertise`** (lines 2040-2050):
```yaml
specific_expertise: |
  Analyze code changes and determine appropriate semantic version bumps following semver.org:
  - MAJOR (X.0.0): Breaking changes, API modifications, removed features
  - MINOR (X.Y.0): New features, enhancements, additive changes
  - PATCH (X.Y.Z): Bug fixes, documentation updates, refactoring
  
  Consider:
  - Scope of changes (files modified, lines changed)
  - Type of modifications (API changes vs internal refactoring)
  - Impact on consumers (breaking vs backward compatible)
  - Conventional commit messages if available
```

**`output_format`** (lines 2059-2062):
```yaml
output_format: |
  Bump Type: [major|minor|patch]
  Reasoning: [2-3 sentence explanation]
  Confidence: [high|medium|low]
```

---

## Language-Specific Standards

### Overview

The file defines standards for **8 programming languages** across **3 categories**:

1. **Documentation Standards** (`language_specific_documentation`, lines 1585-1718)
2. **Code Quality Standards** (`language_specific_quality`, lines 1720-1903)
3. **Testing Standards** (`language_specific_testing`, lines 1905-2034)

These standards are **dynamically injected** into prompts based on the project's `primary_language` configuration.

### Supported Languages

| Language | Doc Format | Quality Linter | Test Framework |
|----------|------------|----------------|----------------|
| JavaScript | JSDoc 3 | ESLint, Prettier | Jest, Mocha, Vitest |
| Python | PEP 257 (Google/NumPy) | Pylint, Black, Mypy | pytest, unittest |
| Go | godoc | go vet, golangci-lint | testing, testify |
| Java | Javadoc | Checkstyle, PMD | JUnit, TestNG |
| Ruby | YARD | RuboCop | RSpec, Minitest |
| Rust | rustdoc | Clippy | cargo test |
| C++ | Doxygen | clang-tidy | Google Test, Catch2 |
| Bash | ShellDoc | shellcheck, shfmt | bats, bats-core |

### language_specific_documentation

**Purpose**: Define documentation format standards per language.

**Structure**:
```yaml
language_specific_documentation:
  <language>:
    key_points: |
      • [List of documentation standards]
    doc_format: "<Format name>"
    example_snippet: |
      [Code example with proper documentation]
```

**Example - JavaScript**:
```yaml
javascript:
  key_points: |
    • Use JSDoc format with @param, @returns, @throws tags
    • Document async/await patterns and promise chains
    • Include TypeScript types when applicable
    • Reference npm packages with correct versions
    • Follow MDN Web Docs style for web APIs
  doc_format: "JSDoc 3"
  example_snippet: |
    /**
     * Fetches user data from the API
     * @param {string} userId - User identifier
     * @returns {Promise<User>} User object
     * @throws {Error} If user not found
     */
    async function getUser(userId) { ... }
```

**Example - Python**:
```yaml
python:
  key_points: |
    • Follow PEP 257 docstring conventions
    • Use type hints (PEP 484) consistently
    • Document exceptions with raises sections
    • Use Google/NumPy format for complex functions
    • Include examples in public API docstrings
  doc_format: "PEP 257 (Google/NumPy style)"
  example_snippet: |
    def calculate_average(numbers: list[float]) -> float:
        """Calculate arithmetic mean of numbers.
        Args:
            numbers: List of numeric values
        Returns:
            Arithmetic mean
        Raises:
            ValueError: If list is empty
        """
```

### language_specific_quality

**Purpose**: Define code quality standards and antipatterns per language.

**Structure**:
```yaml
language_specific_quality:
  <language>:
    focus_areas:
      - [List of quality concerns specific to language]
    antipatterns:
      - [Common mistakes to avoid]
    best_practices:
      - [Recommended patterns and practices]
```

**Example - JavaScript**:
```yaml
javascript:
  focus_areas:
    - "Async/await error handling"
    - "Promise chain management"
    - "Memory leaks in closures"
    - "Event listener cleanup"
    - "Bundle size optimization"
  
  antipatterns:
    - "Callback hell"
    - "Unhandled promise rejections"
    - "Mutation of props in React"
    - "Missing error boundaries"
    - "Synchronous loops with async calls"
  
  best_practices:
    - "Use const/let instead of var"
    - "Prefer async/await over raw promises"
    - "Use ESLint and Prettier"
    - "Implement proper error handling"
    - "Write testable, pure functions"
```

### language_specific_testing

**Purpose**: Define testing standards and frameworks per language.

**Structure**:
```yaml
language_specific_testing:
  <language>:
    test_framework: "<Primary framework>"
    coverage_target: <percentage>
    test_types:
      - unit: [Unit testing guidelines]
      - integration: [Integration testing guidelines]
      - e2e: [End-to-end testing guidelines]
    best_practices:
      - [Testing best practices]
    antipatterns:
      - [Testing mistakes to avoid]
```

**Example - Python**:
```yaml
python:
  test_framework: "pytest"
  coverage_target: 80
  test_types:
    - unit: "Use pytest fixtures, parametrize tests, mock external dependencies"
    - integration: "Test database interactions with test containers or fixtures"
    - e2e: "Use pytest-playwright or selenium for UI testing"
  best_practices:
    - "Use pytest fixtures for test data"
    - "Parametrize tests to avoid duplication"
    - "Mock external APIs and services"
    - "Use pytest-cov for coverage reporting"
    - "Organize tests to mirror source structure"
  antipatterns:
    - "Tests depending on execution order"
    - "Shared mutable state between tests"
    - "Testing implementation details"
    - "Overly broad try/except in tests"
```

---

## Version History

### Version 5.0.0 (2026-01-30)

**Changes**:
- Added `technical_writer_prompt` for comprehensive from-scratch documentation
- Use case: Bootstrap documentation for undocumented/new projects
- Complements `doc_analysis_prompt` (incremental) and `consistency_prompt` (auditing)
- Follows v4.0.0 token efficiency patterns (anchors, concise output)
- Language-agnostic with dynamic language-specific standards injection

**Token Impact**: Minimal (new persona addition, no optimization changes)

### Version 4.0.0 (2025-12-24)

**Major Changes**:
1. **Output format simplification**: Removed rigid templates from 5 prompts (~550 tokens)
   - `consistency_prompt`: 26 lines → 5 lines (~295 tokens)
   - `ai_log_analysis_prompt`: 13 lines → 4 lines (~50 tokens)
   - `step9_code_quality_prompt`: 9 lines → 3 lines (~45 tokens)
   - `markdown_lint_prompt`: Removed word count requirement (~10 tokens)
   - `step13_prompt_engineer_prompt`: Condensed framework (~150 tokens)

2. **Language-specific injection cleanup**: Removed verbose comments (~340 tokens)
   - Affected: `doc_analysis`, `step2_consistency`, `step3_script_refs`, `step5_test_review`, `step9_code_quality`
   - Before: 6-8 lines with implementation details
   - After: Single line reference

3. **Redundant test context**: Consolidated duplicate framework info (~55 tokens)

4. **Git commit format fix**: Removed code blocks from example (critical contradiction)

5. **Authority enhancement**: Quality prompt role strengthened (+20 tokens)

**Net Token Savings**: ~950 tokens (optimizations) - 70 tokens (enhancements) = ~880 net

### Version 3.6.0

**Changes**:
- Removed redundant "output only raw text" warnings from `step11_git_commit_prompt`
- Consolidated 3 repetitions into single authoritative instruction
- Cleaned up output_format field

**Token Savings**: ~40-50 tokens per workflow

### Version 3.5.0

**Changes**:
- Standardized verbose section headers for consistency
- "Analysis Tasks" → "Tasks" (10 occurrences)
- "Expected Output" → "Output" (11 occurrences)

**Token Savings**: ~105-210 tokens per workflow

### Version 3.4.0

**Changes**:
- Added language-specific context injection to 4 additional prompts:
  - `doc_analysis_prompt`: Language-specific documentation standards
  - `step2_consistency_prompt`: Language-aware validation
  - `step3_script_refs_prompt`: Language-specific documentation formats
  - `step9_code_quality_prompt`: Language-specific quality rules

**Impact**: Improved relevance and consistency across all tech stacks

### Version 3.3.0

**Changes**:
- Separated strategic (`test_strategy_prompt`) from tactical (`step5_test_review_prompt`)
- Removed overlapping "Coverage Gap Identification" from step5
- Clarified boundaries: WHAT to test vs HOW to test

**Token Savings**: ~100-150 tokens

### Version 3.2.0

**Changes**:
- Applied `role_prefix` + `behavioral_guidelines` pattern to ALL 15 personas
- Introduced YAML anchor system for DRY principle

**Token Savings**: ~260-390 tokens per workflow (20-30 tokens × 13 personas)

### Version 3.1.1

**Changes**:
- Replaced emoji checkmarks (❌ ✓) with text markers (Bad: | Good:)

**Token Savings**: ~5-10 tokens per usage

---

## Integration Patterns

### Prompt Builder Integration

The `ai_helpers.yaml` file is designed to work with a **prompt builder script** (e.g., `ai_helpers.sh`, `prompt_builder.py`) that:

1. **Loads the YAML file**: Parse the configuration
2. **Selects a persona**: Choose appropriate prompt for the workflow step
3. **Composes the role**: Combine `role_prefix` + `behavioral_guidelines`
4. **Substitutes placeholders**: Replace `{changed_files}`, `{doc_files}`, etc.
5. **Injects language standards**: Populate `{language_specific_documentation}`, etc.
6. **Constructs final prompt**: Assemble role + task + approach + output format

**Example Workflow**:
```bash
#!/usr/bin/env bash
# Simplified prompt builder example

# 1. Load persona from YAML
persona="doc_analysis_prompt"
role_prefix=$(yq ".${persona}.role_prefix" config/ai_helpers.yaml)
behavioral=$(yq "._behavioral_actionable" config/ai_helpers.yaml)
task_template=$(yq ".${persona}.task_template" config/ai_helpers.yaml)

# 2. Compose role
role="${role_prefix}\n\n${behavioral}"

# 3. Substitute placeholders
task=$(echo "$task_template" | sed "s/{changed_files}/$changed_files/g")

# 4. Inject language standards
language=$(yq ".project.tech_stack.primary_language" .workflow-config.yaml)
lang_docs=$(yq ".language_specific_documentation.${language}" config/ai_helpers.yaml)
task=$(echo "$task" | sed "s/{language_specific_documentation}/$lang_docs/g")

# 5. Construct final prompt
final_prompt="${role}\n\n${task}"

# 6. Send to AI
echo "$final_prompt" | ai_call
```

### Project Configuration Integration

The personas reference configuration from `.workflow-config.yaml`:

```yaml
# .workflow-config.yaml
project:
  name: "My Project"
  type: "nodejs-application"
  
tech_stack:
  primary_language: "javascript"
  test_framework: "jest"
  
structure:
  source_dirs:
    - src
  docs_dirs:
    - docs
```

**Language-Specific Injection Example**:
```bash
# Prompt builder reads primary_language from config
primary_language=$(yq ".tech_stack.primary_language" .workflow-config.yaml)

# Injects appropriate language standards into prompts
lang_standards=$(yq ".language_specific_documentation.${primary_language}" config/ai_helpers.yaml)
prompt=$(echo "$prompt_template" | sed "s/{language_specific_documentation}/$lang_standards/g")
```

### Workflow Step Mapping

Different workflow steps use different personas:

| Workflow Step | Persona | Purpose |
|---------------|---------|---------|
| Step 1: Documentation Analysis | `doc_analysis_prompt` | Update docs based on code changes |
| Step 2: Consistency Check | `consistency_prompt` | Validate documentation quality |
| Step 3: Test Strategy | `test_strategy_prompt` | Design test plan |
| Step 4: Code Quality | `quality_prompt` | Review code quality |
| Step 5: Version Management | `version_manager_prompt` | Determine version bump |
| Step 6: Markdown Linting | `markdown_lint_prompt` | Check markdown formatting |
| Bootstrap: Documentation Creation | `technical_writer_prompt` | Create docs from scratch |

---

## Customization Guide

### Adding a New Persona

To add a new persona to `config/ai_helpers.yaml`:

**1. Define the persona structure**:
```yaml
my_new_persona_prompt:
  # Modern pattern (recommended)
  role_prefix: |
    You are a [role] with expertise in:
    - [Specific expertise area 1]
    - [Specific expertise area 2]
  
  behavioral_guidelines: *behavioral_actionable  # or *behavioral_structured
  
  # Legacy field (backward compatibility)
  role: |
    [Full combined role text]
  
  task_template: |
    **YOUR TASK**: [Clear task description]
    
    [Context and requirements]
    
    **REQUIRED ACTIONS**:
    1. [Action 1]
    2. [Action 2]
  
  approach: |
    **Methodology**:
    1. [Step 1]
    2. [Step 2]
    
    **Language-Specific Standards:** {language_specific_documentation}
  
  output_format: |
    [Expected output structure]
```

**2. Choose appropriate behavioral anchor**:
- Use `*behavioral_actionable` if persona must produce concrete output without questions
- Use `*behavioral_structured` if persona must provide prioritized analysis

**3. Add language-specific injection** (if applicable):
```yaml
approach: |
  **Language-Specific Standards:** {language_specific_documentation}
  # or
  **Quality Standards:** {language_specific_quality}
  # or
  **Testing Standards:** {language_specific_testing}
```

**4. Document placeholders**:
```yaml
# Clearly document expected placeholders in comments
# Template Placeholders:
# - {changed_files}: List of modified files
# - {doc_files}: List of documentation files
```

**5. Update integration scripts**: Ensure prompt builder recognizes the new persona.

### Modifying Behavioral Guidelines

To change behavioral guidelines:

**1. Update the anchor definition**:
```yaml
_behavioral_actionable: &behavioral_actionable |
  **Critical Behavioral Guidelines**:
  - [Modify or add guidelines]
```

**2. Changes propagate automatically** to all personas using `*behavioral_actionable`

**3. Test impact**: Verify personas still behave correctly with new guidelines

**Warning**: Changes to anchors affect ALL personas using them. Test thoroughly.

### Adding Language Support

To add a new language:

**1. Add documentation standards**:
```yaml
language_specific_documentation:
  rust:
    key_points: |
      • Use Rust doc comments (///)
      • Include compilable examples
    doc_format: "rustdoc"
    example_snippet: |
      /// Calculates the sum.
      /// # Examples
      /// ```
      /// assert_eq!(add(2, 3), 5);
      /// ```
```

**2. Add quality standards**:
```yaml
language_specific_quality:
  rust:
    focus_areas:
      - "Ownership and borrowing"
      - "Error handling with Result"
    antipatterns:
      - "Unnecessary cloning"
      - "Panic in library code"
    best_practices:
      - "Use Result for errors"
      - "Prefer iterators over loops"
```

**3. Add testing standards**:
```yaml
language_specific_testing:
  rust:
    test_framework: "cargo test"
    coverage_target: 80
    test_types:
      - unit: "Use #[cfg(test)] modules"
      - integration: "tests/ directory"
    best_practices:
      - "Test public APIs"
      - "Use property-based testing"
```

**4. Update project_kinds.yaml**: Add language to appropriate project kinds.

### Token Optimization Best Practices

When modifying prompts:

**1. Use YAML anchors** for repeated content:
```yaml
_common_output: &common_output |
  - Use markdown formatting
  - Be specific and actionable

persona1:
  output_format: *common_output

persona2:
  output_format: *common_output
```

**2. Avoid rigid output templates**: Use flexible guidance instead:
```yaml
# Bad (rigid)
output_format: |
  ## Section 1
  [Content]
  ## Section 2
  [Content]

# Good (flexible)
output_format: |
  Use markdown headings to organize findings by severity.
```

**3. Remove redundant warnings**: Say it once, clearly:
```yaml
# Bad (redundant)
approach: |
  IMPORTANT: Only output raw text.
  CRITICAL: Output raw text only.
  WARNING: Do not add formatting.

# Good (single clear instruction)
approach: |
  Output only raw text without additional formatting.
```

**4. Use placeholders** instead of duplicating language-specific content:
```yaml
# Bad (duplicated)
persona1:
  approach: |
    For JavaScript: Use JSDoc...
    For Python: Use PEP 257...

# Good (injected)
persona1:
  approach: |
    **Language-Specific Standards:** {language_specific_documentation}
```

**5. Track token savings**: Document optimization impact in version history.

---

## Related Documentation

- **[config/.workflow-config.yaml.template](../../config/.workflow-config.yaml.template)** - Project configuration template
- **[config/ai_prompts_project_kinds.yaml](../../config/ai_prompts_project_kinds.yaml)** - Project-specific AI prompts
- **[config/project_kinds.yaml](../../config/project_kinds.yaml)** - Project type definitions
- **[docs/api/CONFIG_REFERENCE.md](CONFIG_REFERENCE.md)** - Configuration field reference
- **[docs/api/PROJECT_KINDS_SCHEMA.md](PROJECT_KINDS_SCHEMA.md)** - Project kinds schema
- **[docs/INTEGRATION.md](../INTEGRATION.md)** - Integration guide
- **[README.md](../../README.md)** - Project overview

---

**Last Updated**: 2026-02-07  
**Document Version**: 1.0.0  
**Schema Version**: 5.0.0 (ai_helpers.yaml)
