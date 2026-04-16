# GitHub Copilot Instructions: ai_workflow_core

> **Purpose:** This file provides durable, high-signal guidance for Copilot-assisted development in the `ai_workflow_core` repository. It is not a project handbook or reference manual—keep content focused on Copilot-relevant architecture, design, documentation sync, and validation rules. Link to authoritative docs for details.

---

## Scope and Role

- **ai_workflow_core** is a language-agnostic foundational template system for AI-powered workflow automation.
- This repository provides configuration templates, schemas, and examples for use as a Git submodule in other projects.
- It is **not** a workflow execution engine; do not reference or assume step orchestration or runtime logic here.

---

## Durable Copilot Guidance

### 1. Architecture and Boundaries

- **Templates and Schemas Only:** All code and configuration in this repo is for template, schema, or documentation purposes. No execution logic or runtime orchestration is present.
- **Supporting Surfaces:** Key files include `.workflow-config.yaml` (project-local config) and `.ai_workflow/` (runtime artifacts, cache, checkpoints).
- **No Source Layers:** There are no stable source code layers or public package entry points in this repository.

### 2. Design Principles

- **Language-Agnostic:** All templates and schemas must remain language-neutral.
- **Placeholder Patterns:** Use `{{PLACEHOLDER}}` syntax in templates. Never replace placeholders with project-specific values in core templates.
- **Separation of Concerns:** Keep configuration, documentation, and example integrations clearly separated.
- **Documentation Alignment:** All user-facing changes to templates or schemas must be reflected in the relevant documentation (see below).

### 3. Documentation Sync Rules

- **Update authoritative docs** when making user-facing changes:
  - `README.md` for project overview, usage, and placeholder reference.
  - `docs/ARCHITECTURE.md` for architecture or layout changes.
  - `docs/guides/MIGRATION_GUIDE.md` for migration or breaking changes.
  - `CHANGELOG.md` for all significant changes.
- **Do not duplicate** inventories, command lists, or status snapshots here—link to the above docs instead.

### 4. Validation Commands

- **Always validate substantive changes** with:
  - `npm run lint`
  - `npm test`
  - `npm run build`
- Use narrower scripts only for intentionally scoped tasks.
- For configuration or template changes, validate YAML syntax and placeholder documentation as described in the authoritative docs.

### 5. Reference and Integration

- **For detailed reference:** See `README.md`, `docs/ARCHITECTURE.md`, and `CHANGELOG.md`.
- **For integration patterns:** See `.workflow-config.yaml` and `.ai_workflow/` in this repo, and refer to the parent project ([ai_workflow](https://github.com/mpbarbosa/ai_workflow)) for execution engine details.
- **For migration or compatibility:** See `docs/guides/MIGRATION_GUIDE.md`.

---

## What to Avoid

- Do **not** include implementation status, numeric inventories, or workflow/command lists—these belong in the main documentation.
- Do **not** reference or describe workflow execution, step orchestration, or runtime logic—this repository does not provide those features.
- Do **not** copy detailed reference material—link to the authoritative document instead.

---

## Authoritative References

- [README.md](../README.md) – Project overview, usage, placeholder reference
- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) – Architecture and design
- [docs/guides/MIGRATION_GUIDE.md](../docs/guides/MIGRATION_GUIDE.md) – Migration and breaking changes
- [CHANGELOG.md](../CHANGELOG.md) – Version history

---

_Last updated: 2026-04-16 • For Copilot-assisted development in ai_workflow_core_
