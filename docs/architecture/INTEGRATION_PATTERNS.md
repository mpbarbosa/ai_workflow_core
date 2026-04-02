# Integration Patterns

> This document provides a summary of integration patterns for `ai_workflow_core`.
> For the full, step-by-step integration guide see **[docs/INTEGRATION.md](../INTEGRATION.md)**.

## Overview

`ai_workflow_core` is designed to be consumed as a **Git submodule**. The following patterns describe the most common integration scenarios.

## Pattern 1: Basic Submodule Integration

Add the library to any project and copy the configuration template:

```bash
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
# Replace {{PLACEHOLDER}} values in .workflow-config.yaml
```

See [docs/INTEGRATION.md](../INTEGRATION.md) for the full walkthrough.

## Pattern 2: With GitHub Actions

Copy the provided workflow templates to your project:

```bash
cp .workflow_core/workflow-templates/workflows/*.yml .github/workflows/
```

See [docs/INTEGRATION.md](../INTEGRATION.md#github-actions-integration) for details.

## Pattern 3: Fork and Customize

For teams with non-standard requirements, fork `ai_workflow_core`, extend
`config/project_kinds.yaml`, and reference your fork as the submodule remote.

## References

- [docs/INTEGRATION.md](../INTEGRATION.md) — Step-by-step integration guide
- [docs/ARCHITECTURE.md](../ARCHITECTURE.md#integration-patterns) — Architecture-level integration patterns
- [docs/api/CONFIG_REFERENCE.md](../api/CONFIG_REFERENCE.md) — Configuration field reference
