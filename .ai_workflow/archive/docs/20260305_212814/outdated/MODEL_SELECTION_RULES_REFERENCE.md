# Model Selection Rules API Reference

**Version**: 3.2.0  
**Configuration File**: [`config/model_selection_rules.yaml`](../../config/model_selection_rules.yaml)  
**Last Updated**: 2026-02-09

## Table of Contents

- [Overview](#overview)
- [Feature Toggle](#feature-toggle)
- [Complexity Thresholds](#complexity-thresholds)
- [Model Preferences by Tier](#model-preferences-by-tier)
- [Complexity Calculation Weights](#complexity-calculation-weights)
- [Step-Specific Overrides](#step-specific-overrides)
- [Supported Models](#supported-models)
- [Fallback Behavior](#fallback-behavior)
- [Performance Tuning](#performance-tuning)
- [Experimental Features](#experimental-features)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Model Selection Rules configuration enables **intelligent AI model selection** based on task complexity. Instead of using a single model for all workflow steps, the system analyzes each step's complexity and selects the most appropriate AI model from GitHub Copilot's available options.

**Key Benefits:**
- **Cost Optimization**: Use lightweight models for simple tasks, reserving expensive models for complex reasoning
- **Performance**: Fast models for quick edits, deep reasoning models for architecture decisions
- **Flexibility**: Override model selection per workflow step
- **Adaptability**: Complexity-based automatic selection with manual override capability

**Related Documentation:**
- [AI Helpers Reference](AI_HELPERS_REFERENCE.md) - AI personas and prompts
- [Config Reference](CONFIG_REFERENCE.md) - Main workflow configuration
- [Project Kinds Schema](PROJECT_KINDS_SCHEMA.md) - Project type definitions

---

## Feature Toggle

### `model_selection`

Controls whether intelligent model selection is enabled.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `enabled` | boolean | Yes | `true` | Enable/disable model selection feature |

**Configuration:**
```yaml
model_selection:
  enabled: true  # Set to false to use default models only
```

**Behavior:**
- `enabled: true` - System analyzes complexity and selects appropriate models
- `enabled: false` - All steps use default model from `fallback.default_model`

**Use Cases:**
- **Enable** for production workflows to optimize costs and performance
- **Disable** for testing/debugging when you want consistent model behavior
- **Disable** if your organization restricts certain AI models

---

## Complexity Thresholds

### `thresholds`

Defines score ranges (0-100 scale) that map complexity to model tiers.

| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `tier_1_max` | integer | 0-100 | `25` | Maximum score for Tier 1 (fast models) |
| `tier_2_max` | integer | 0-100 | `60` | Maximum score for Tier 2 (balanced) |
| `tier_3_max` | integer | 0-100 | `90` | Maximum score for Tier 3 (deep reasoning) |

**Tier Mapping:**
- **Tier 1**: Score 0-25 → Fast models (simple edits, quick questions)
- **Tier 2**: Score 26-60 → Balanced models (general coding tasks)
- **Tier 3**: Score 61-90 → Deep reasoning models (complex logic)
- **Tier 4**: Score 91+ → Agentic models (architecture, design)

**Configuration:**
```yaml
thresholds:
  tier_1_max: 25    # 0-25 = Tier 1
  tier_2_max: 60    # 26-60 = Tier 2
  tier_3_max: 90    # 61-90 = Tier 3
  # 91+ = Tier 4
```

**Customization Examples:**

*Conservative (favor faster models):*
```yaml
thresholds:
  tier_1_max: 40    # Expand fast model range
  tier_2_max: 75    # Expand balanced model range
  tier_3_max: 95    # Smaller deep reasoning range
```

*Aggressive (favor quality):*
```yaml
thresholds:
  tier_1_max: 15    # Narrow fast model range
  tier_2_max: 50    # Use deep reasoning more often
  tier_3_max: 85    # Larger agentic model range
```

---

## Model Preferences by Tier

### `tier_preferences`

Defines model selection for each complexity tier.

#### Structure

Each tier contains:
- `primary`: Preferred model for this tier
- `alternatives`: Fallback models if primary unavailable
- `description`: Human-readable tier purpose

#### Tier 1: Fast Models

**Use Cases**: Simple edits, documentation typo fixes, variable renames

```yaml
tier_1_fast:
  primary: claude-haiku-4.5
  alternatives:
    - gpt-5-mini
    - gemini-3-flash
  description: "Fast, lightweight coding questions and simple edits"
```

**Characteristics:**
- Response time: < 2 seconds
- Cost: Low
- Complexity handling: Simple/straightforward tasks

**Example Tasks:**
- Fix spelling in documentation
- Add missing import statement
- Rename variable across files
- Update version number

#### Tier 2: Balanced Models

**Use Cases**: General coding, moderate refactoring, test updates

```yaml
tier_2_balanced:
  primary: claude-sonnet-4.5
  alternatives:
    - gpt-5.1-codex
    - gpt-5-mini
  description: "General-purpose coding with balanced performance"
```

**Characteristics:**
- Response time: 3-5 seconds
- Cost: Medium
- Complexity handling: Multi-step reasoning, pattern recognition

**Example Tasks:**
- Implement new function with moderate logic
- Refactor code for better readability
- Write integration tests
- Update API endpoints

#### Tier 3: Deep Reasoning Models

**Use Cases**: Complex algorithms, architectural decisions, security reviews

```yaml
tier_3_deep:
  primary: claude-opus-4.5
  alternatives:
    - gpt-5.2
    - claude-sonnet-4.0
    - gemini-3-pro
  description: "Deep reasoning for complex problem-solving"
```

**Characteristics:**
- Response time: 5-10 seconds
- Cost: High
- Complexity handling: Multi-step reasoning, edge cases, optimization

**Example Tasks:**
- Design database schema
- Implement complex algorithm (sorting, graph traversal)
- Security vulnerability analysis
- Performance optimization strategy

#### Tier 4: Agentic Models

**Use Cases**: System architecture, design patterns, multi-file refactoring

```yaml
tier_4_agentic:
  primary: claude-opus-4.6
  alternatives:
    - gpt-5.2-codex
    - gpt-5.1-codex-max
  description: "Agentic software development and architecture"
```

**Characteristics:**
- Response time: 10-15 seconds
- Cost: Very High
- Complexity handling: System-level reasoning, architectural patterns

**Example Tasks:**
- Design microservices architecture
- Plan migration from monolith to microservices
- Implement design patterns (Factory, Observer, etc.)
- Multi-file refactoring with dependency analysis

---

## Complexity Calculation Weights

### Overview

The system calculates complexity scores based on change type (code, documentation, tests) and applies weighted factors.

### Code Complexity

```yaml
complexity_weights:
  code:
    cyclomatic_multiplier: 2.0      # Weight for cyclomatic complexity
    lines_per_point: 10             # Lines changed per complexity point
    function_depth_multiplier: 1.5  # Weight for function nesting depth
    semantic_factors:
      minor_change: 5               # Variable rename, typo fix
      enhancement: 15               # New function, moderate refactor
      major_refactor: 30            # Restructure, design pattern
      architectural_change: 50      # System-level change
```

**Calculation Formula:**
```
code_complexity = (lines_changed / lines_per_point) * cyclomatic_multiplier 
                + (nesting_depth * function_depth_multiplier)
                + semantic_factor
```

**Example:**
- 50 lines changed, cyclomatic complexity 5, nesting depth 2, enhancement
- Score = (50/10) * 2.0 + (2 * 1.5) + 15 = 5 + 3 + 15 = **23** → **Tier 1**

### Documentation Complexity

```yaml
complexity_weights:
  documentation:
    words_per_point: 100            # Words changed per complexity point
    files_multiplier: 0.5           # Weight per file affected
    structural_multiplier: 2.0      # Weight for structural changes
    primary_doc_modifier: 5.0       # Extra weight for README/index changes
```

**Calculation Formula:**
```
doc_complexity = (words_changed / words_per_point)
               + (files_affected * files_multiplier)
               + (structural_changes * structural_multiplier)
               + (is_primary_doc ? primary_doc_modifier : 0)
```

**Example:**
- 500 words changed, 2 files, no structural changes, not primary doc
- Score = (500/100) + (2 * 0.5) + 0 + 0 = 5 + 1 + 0 + 0 = **6** → **Tier 1**

### Test Complexity

```yaml
complexity_weights:
  tests:
    cases_multiplier: 1.5           # Weight per test case
    lines_per_point: 20             # Lines changed per complexity point
    coverage_multiplier: 2.0        # Weight for coverage impact
    coverage_factors:
      minor_update: 5               # Update existing test
      new_coverage: 15              # Add new test coverage
      major_expansion: 30           # Comprehensive test suite
```

**Calculation Formula:**
```
test_complexity = (lines_changed / lines_per_point)
                + (test_cases * cases_multiplier)
                + (coverage_impact * coverage_multiplier)
                + coverage_factor
```

**Example:**
- 100 test lines, 3 new test cases, major coverage expansion
- Score = (100/20) + (3 * 1.5) + (1 * 2.0) + 30 = 5 + 4.5 + 2 + 30 = **41.5** → **Tier 2**

---

## Step-Specific Overrides

### Purpose

Override automatic complexity-based model selection for specific workflow steps.

### Override Types

#### Category Override

Force a step to use specific complexity calculation category:

```yaml
step_overrides:
  step_01_documentation:
    category: documentation  # Use doc complexity instead of code
```

#### Tier Adjustment

Adjust tier up or down from calculated tier:

```yaml
step_overrides:
  step_06_test_gen:
    tier_adjustment: +1  # Bump up one tier
    reason: "Test generation requires reasoning about code behavior"
```

#### Force Specific Tier

Always use a specific tier regardless of complexity:

```yaml
step_overrides:
  step_13_prompt_engineer:
    force_tier: tier_3_deep
    reason: "Meta-analysis requires sophisticated reasoning"
```

### Available Overrides

| Step | Override Type | Value | Reason |
|------|--------------|-------|--------|
| `step_01_documentation` | Category | `documentation` | Uses doc complexity |
| `step_02_consistency` | Category | `documentation` | Validation uses doc tier |
| `step_03_script_refs` | Category | `code` | Script analysis |
| `step_05_test_review` | Category | `tests` | Test review |
| `step_06_test_gen` | Tier Adjust | `+1` | Test generation needs reasoning |
| `step_09_code_quality` | Category | `code` | Code quality check |
| `step_13_prompt_engineer` | Force Tier | `tier_3_deep` | Meta-analysis |
| `step_14_ux_analysis` | Force Tier | `tier_3_deep` | UI/UX reasoning |

### Custom Overrides

Add your own step overrides:

```yaml
step_overrides:
  my_custom_step:
    force_tier: tier_2_balanced
    reason: "Custom logic requires balanced model"
```

---

## Supported Models

### Available Models

Complete list of models validated when using `--force-model` flag:

**Claude Models:**
- `claude-haiku-4.5` (Tier 1 primary)
- `claude-sonnet-4.0` (Tier 3 alternative)
- `claude-sonnet-4.5` (Tier 2 primary, fallback default)
- `claude-opus-4.1`
- `claude-opus-4.5` (Tier 3 primary)
- `claude-opus-4.6` (Tier 4 primary)

**GPT Models:**
- `gpt-4.1`
- `gpt-5`
- `gpt-5-mini` (Tier 1 alternative)
- `gpt-5.1`
- `gpt-5.1-codex` (Tier 2 alternative)
- `gpt-5.1-codex-mini`
- `gpt-5.1-codex-max` (Tier 4 alternative)
- `gpt-5.2` (Tier 3 alternative)
- `gpt-5.2-codex` (Tier 4 alternative)

**Gemini Models:**
- `gemini-2.5-pro`
- `gemini-3-flash` (Tier 1 alternative)
- `gemini-3-pro` (Tier 3 alternative)

**Other Models:**
- `grok-code-fast-1`
- `qwen2.5`
- `raptor-mini`

### Model Comparison

Based on [GitHub Copilot Model Comparison](https://docs.github.com/en/copilot/reference/ai-models/model-comparison):

| Model | Speed | Cost | Best For |
|-------|-------|------|----------|
| Claude Haiku 4.5 | ⚡⚡⚡ Fast | 💰 Low | Simple edits, quick fixes |
| GPT-5 Mini | ⚡⚡⚡ Fast | 💰 Low | Lightweight coding tasks |
| Claude Sonnet 4.5 | ⚡⚡ Medium | 💰💰 Medium | General development |
| GPT-5.1 Codex | ⚡⚡ Medium | 💰💰 Medium | Coding tasks |
| Claude Opus 4.5 | ⚡ Slow | 💰💰💰 High | Complex algorithms |
| GPT-5.2 | ⚡ Slow | 💰💰💰 High | Deep reasoning |
| Claude Opus 4.6 | ⚡ Slowest | 💰💰💰💰 Very High | Architecture, design |

---

## Fallback Behavior

### Configuration

```yaml
fallback:
  on_failure: use_defaults        # What to do when selection fails
  default_model: claude-sonnet-4.5  # Default model
  enable_logging: true             # Log selection decisions
  warn_on_fallback: true           # Warn if fallback used
```

### Fallback Options

| Option | Behavior | Use Case |
|--------|----------|----------|
| `use_defaults` | Use `default_model` | Production (graceful degradation) |
| `abort_workflow` | Stop workflow execution | Testing (strict validation) |
| `skip_ai_steps` | Skip AI-powered steps | Emergency (AI unavailable) |

### Fallback Scenarios

**1. Primary Model Unavailable**
```
Selected: claude-opus-4.5 (Tier 3)
Fallback: claude-sonnet-4.0 (Tier 3 alternative)
Warning: Primary model unavailable, using alternative
```

**2. All Tier Models Unavailable**
```
Selected: Tier 3 models
Fallback: claude-sonnet-4.5 (default_model)
Warning: All tier models unavailable, using default
```

**3. Model Selection Disabled**
```
Feature: model_selection.enabled = false
Result: All steps use claude-sonnet-4.5 (default_model)
```

---

## Performance Tuning

### Configuration

```yaml
performance:
  max_analysis_time: 5        # Max time for complexity analysis (seconds)
  cache_definitions: true     # Cache model definitions between steps
  parallel_analysis: false    # Enable parallel complexity calculation (future)
```

### Tuning Guidelines

**For Fast Workflows:**
```yaml
performance:
  max_analysis_time: 3        # Quick analysis
  cache_definitions: true     # Reduce overhead
  parallel_analysis: false    # Sequential (stable)
```

**For Accuracy:**
```yaml
performance:
  max_analysis_time: 10       # Thorough analysis
  cache_definitions: true     # Still cache
  parallel_analysis: false    # Sequential (reliable)
```

**Performance Impact:**
- Model selection adds **1-5 seconds** per workflow run
- Caching reduces overhead to **< 1 second** for subsequent steps
- Parallel analysis (future) may reduce to **< 2 seconds total**

---

## Experimental Features

### Configuration

```yaml
experimental:
  ml_based_selection: false      # ML-driven model selection
  adaptive_thresholds: false     # Dynamic threshold adjustment
  enable_ab_testing: false       # A/B test different models
```

### ML-Based Selection

**Status**: Experimental (requires historical data)

**How it works:**
1. Collect historical step execution data (complexity, model, outcome)
2. Train ML model to predict optimal model per step type
3. Use ML predictions instead of rule-based selection

**Requirements:**
- Minimum 100 workflow executions with varied complexity
- Step success/failure metrics
- Model performance data (time, cost, quality)

### Adaptive Thresholds

**Status**: Experimental

**How it works:**
1. Monitor model performance over time
2. Adjust thresholds when models consistently over/under-perform
3. Example: If Tier 2 models handle Tier 3 complexity well, raise `tier_2_max`

**Benefits:**
- Self-tuning system
- Adapts to model improvements
- Optimizes cost/performance trade-off

### A/B Testing

**Status**: Experimental

**How it works:**
1. Split workflow executions into groups
2. Group A uses primary model, Group B uses alternative
3. Compare performance metrics (time, cost, quality)
4. Adjust model preferences based on results

**Use Cases:**
- Validate new models
- Compare providers (Claude vs GPT vs Gemini)
- Optimize cost without sacrificing quality

---

## Usage Examples

### Example 1: Default Configuration

**Scenario**: Standard workflow with automatic model selection

**Configuration:**
```yaml
model_selection:
  enabled: true

thresholds:
  tier_1_max: 25
  tier_2_max: 60
  tier_3_max: 90

tier_preferences:
  tier_1_fast:
    primary: claude-haiku-4.5
```

**Workflow Execution:**
```
Step 1 (Documentation update - 200 words):
  Complexity: 8 → Tier 1
  Model: claude-haiku-4.5
  
Step 3 (Script refactor - 150 lines):
  Complexity: 35 → Tier 2
  Model: claude-sonnet-4.5
  
Step 13 (Prompt engineering):
  Override: force_tier = tier_3_deep
  Model: claude-opus-4.5
```

### Example 2: Cost-Optimized Configuration

**Scenario**: Minimize costs, favor fast models

**Configuration:**
```yaml
model_selection:
  enabled: true

thresholds:
  tier_1_max: 40    # Expanded fast model range
  tier_2_max: 75
  tier_3_max: 95

tier_preferences:
  tier_1_fast:
    primary: gpt-5-mini        # Cheapest option
  tier_2_balanced:
    primary: gpt-5.1-codex     # Lower cost than Claude
```

**Expected Savings**: 30-50% compared to default configuration

### Example 3: Quality-Focused Configuration

**Scenario**: Maximize quality, willing to pay more

**Configuration:**
```yaml
model_selection:
  enabled: true

thresholds:
  tier_1_max: 15    # Narrow fast model range
  tier_2_max: 50    # Use Tier 3 more often
  tier_3_max: 85

tier_preferences:
  tier_1_fast:
    primary: claude-sonnet-4.5  # Use better model for Tier 1
  tier_2_balanced:
    primary: claude-opus-4.5    # Use Tier 3 for Tier 2
```

**Expected Improvement**: 10-20% better output quality

### Example 4: Disabled Model Selection

**Scenario**: Testing, consistent model for all steps

**Configuration:**
```yaml
model_selection:
  enabled: false

fallback:
  default_model: claude-sonnet-4.5
```

**Workflow Execution:**
```
All steps use: claude-sonnet-4.5
No complexity analysis performed
```

---

## Best Practices

### 1. Start with Defaults

Begin with default configuration and adjust based on actual performance:

```yaml
# Start here
model_selection:
  enabled: true

thresholds:
  tier_1_max: 25
  tier_2_max: 60
  tier_3_max: 90
```

**Monitor:**
- Total cost per workflow run
- Time per step
- Output quality (subjective review)

### 2. Tune Thresholds Gradually

Adjust thresholds in small increments (5-10 points):

```yaml
# If too many steps use expensive models
thresholds:
  tier_1_max: 30  # Was 25, +5
  tier_2_max: 65  # Was 60, +5
```

### 3. Use Step Overrides Sparingly

Only override when necessary:

✅ **Good:**
```yaml
step_overrides:
  step_13_prompt_engineer:
    force_tier: tier_3_deep
    reason: "Meta-analysis requires deep reasoning"
```

❌ **Bad (over-specification):**
```yaml
step_overrides:
  step_01_documentation:
    force_tier: tier_1_fast
  step_02_consistency:
    force_tier: tier_1_fast
  step_03_script_refs:
    force_tier: tier_2_balanced
  # ... overriding every step defeats the purpose
```

### 4. Enable Logging

Always enable logging to understand model selection decisions:

```yaml
fallback:
  enable_logging: true
  warn_on_fallback: true
```

**Log Output:**
```
[Model Selection] Step 1: Complexity 8 → Tier 1 → claude-haiku-4.5
[Model Selection] Step 3: Complexity 35 → Tier 2 → claude-sonnet-4.5
[Model Selection] Step 13: Override tier_3_deep → claude-opus-4.5
```

### 5. Test Model Alternatives

Rotate through alternatives to find best performance:

```yaml
tier_preferences:
  tier_2_balanced:
    primary: claude-sonnet-4.5
    alternatives:
      - gpt-5.1-codex     # Test this
      - claude-sonnet-4.0
```

**Testing Approach:**
1. Run workflow 5 times with primary model
2. Temporarily swap primary and alternative
3. Run workflow 5 times with alternative
4. Compare: cost, time, quality
5. Update configuration with best performer

### 6. Document Custom Overrides

Always add `reason` field to custom overrides:

```yaml
step_overrides:
  my_custom_step:
    force_tier: tier_3_deep
    reason: "Complex algorithm generation requires deep reasoning"
```

---

## Troubleshooting

### Issue: All Steps Using Default Model

**Symptoms:**
- Every step uses `claude-sonnet-4.5`
- No complexity analysis in logs

**Diagnosis:**
```yaml
# Check if model selection is disabled
model_selection:
  enabled: false  # ← Problem
```

**Solution:**
```yaml
model_selection:
  enabled: true
```

---

### Issue: Unexpected Model Selection

**Symptoms:**
- Simple task uses expensive Tier 3 model
- Complex task uses fast Tier 1 model

**Diagnosis:**
Check step overrides:
```yaml
step_overrides:
  step_01_documentation:
    force_tier: tier_3_deep  # ← Unnecessary override
```

**Solution:**
Remove or adjust override:
```yaml
step_overrides:
  step_01_documentation:
    category: documentation  # Better: use doc complexity
```

---

### Issue: Primary Model Always Unavailable

**Symptoms:**
- Always falling back to alternatives
- Warnings in every workflow run

**Diagnosis:**
Primary model not in your GitHub Copilot subscription

**Solution 1: Update preferences**
```yaml
tier_preferences:
  tier_2_balanced:
    primary: gpt-5.1-codex  # Use model you have access to
```

**Solution 2: Adjust fallback**
```yaml
fallback:
  default_model: gpt-5.1-codex  # Model in your subscription
  warn_on_fallback: false       # Silence warnings
```

---

### Issue: High Costs

**Symptoms:**
- Workflow costs more than expected
- Many steps using Tier 3/4 models

**Diagnosis:**
Check complexity scores:
```bash
# Enable verbose logging
grep "Complexity" workflow.log

# Look for high scores
# Example: Step 1: Complexity 75 → Tier 3
```

**Solution 1: Adjust thresholds (favor cheaper models)**
```yaml
thresholds:
  tier_1_max: 35    # Was 25, expanded range
  tier_2_max: 70    # Was 60, expanded range
  tier_3_max: 95    # Was 90
```

**Solution 2: Use cheaper alternatives**
```yaml
tier_preferences:
  tier_3_deep:
    primary: gpt-5.2  # Cheaper than Claude Opus
```

---

### Issue: Slow Workflow Execution

**Symptoms:**
- Workflow takes significantly longer
- Model selection adds 10+ seconds

**Diagnosis:**
```yaml
performance:
  max_analysis_time: 30  # ← Too high
  cache_definitions: false  # ← Missing cache
```

**Solution:**
```yaml
performance:
  max_analysis_time: 5      # Reasonable limit
  cache_definitions: true   # Enable caching
```

---

### Issue: Model Selection Fails

**Symptoms:**
- Workflow aborts with model selection error
- No model selected for step

**Diagnosis:**
Check fallback behavior:
```yaml
fallback:
  on_failure: abort_workflow  # ← Strict mode
```

**Solution:**
```yaml
fallback:
  on_failure: use_defaults  # Graceful degradation
  default_model: claude-sonnet-4.5
```

---

## Related Documentation

### Configuration References
- **[Config Reference](CONFIG_REFERENCE.md)** - Main `.workflow-config.yaml` fields
- **[Project Kinds Schema](PROJECT_KINDS_SCHEMA.md)** - Project type definitions
- **[Placeholder Reference](PLACEHOLDER_REFERENCE.md)** - Placeholder patterns

### AI Configuration
- **[AI Helpers Reference](AI_HELPERS_REFERENCE.md)** - AI personas and prompts
- **[AI Prompts Reference](AI_PROMPTS_REFERENCE.md)** - Project-specific prompts

### User Guides
- **[Quick Start](../guides/QUICK_START.md)** - Getting started guide
- **[Integration Guide](../INTEGRATION.md)** - Detailed integration steps
- **[Troubleshooting](../guides/TROUBLESHOOTING.md)** - Common issues and solutions

---

**Last Updated**: 2026-02-09  
**Version**: 3.2.0  
**Maintainer**: ai_workflow_core team
