# Architecture Decision Records (ADR)

> This file lists the key architectural decisions for `ai_workflow_core`.
> The full rationale for each ADR is documented in
> **[docs/ARCHITECTURE.md — Architectural Decision Records](../ARCHITECTURE.md#architectural-decision-records)**.

## Index

| ID | Title | Status |
|----|-------|--------|
| ADR-001 | Use Git Submodules for Distribution | Accepted |
| ADR-002 | Separate `.github/` and `workflow-templates/` Directories | Accepted |
| ADR-003 | Placeholder Format `{{UPPERCASE}}` | Accepted |
| ADR-004 | Version Schemas Separately from Core | Accepted |
| ADR-005 | Use Underscores for `PROJECT_KIND`, Hyphens for `PROJECT_TYPE` | Accepted |

## Summary

### ADR-001 — Use Git Submodules for Distribution

Distribute `ai_workflow_core` as a Git submodule rather than an npm/pip package so that
consuming projects can pin an exact commit and receive updates via `git submodule update`.

### ADR-002 — Separate `.github/` and `workflow-templates/`

Keep `.github/` for repository-level metadata and CI for this repo; keep
`workflow-templates/` for workflow templates that consuming projects copy.

### ADR-003 — Placeholder Format `{{UPPERCASE}}`

Use `{{PLACEHOLDER_NAME}}` (double braces, uppercase, underscores) for all
template substitution tokens to make them grep-able and visually distinct.

### ADR-004 — Version Schemas Separately from Core

`config/project_kinds.yaml` carries its own `schema_version` field so that the
schema can evolve independently of the library version.

### ADR-005 — Use Underscores for `PROJECT_KIND`, Hyphens for `PROJECT_TYPE`

`kind` values use underscores (e.g., `nodejs_api`) for YAML key compatibility;
`type` values use hyphens (e.g., `nodejs-application`) for readability in prose.

## References

- [docs/ARCHITECTURE.md](../ARCHITECTURE.md#architectural-decision-records) — Full ADR text with rationale
