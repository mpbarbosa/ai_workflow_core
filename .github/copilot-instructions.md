# GitHub Copilot Instructions: ai_workflow_core

> **Purpose:** Durable, high-signal guidance for Copilot-assisted development in this repository. Focus on stable architecture, design principles, documentation sync, and validation. Link to authoritative docs for details.

---

## Scope

- `ai_workflow_core` is a language-agnostic foundational template system for AI-powered workflow automation.
- This repository provides configuration templates, schemas, and loader utilities for use as a submodule in other projects.
- It does **not** implement workflow execution, step orchestration, or runtime logic.

---

## Copilot Guidance

### Architecture and Boundaries

- **Source:** All primary modules and public API are in `src/`.
- **Supporting surfaces:** `.workflow-config.yaml` (project-local config), `.ai_workflow/` (runtime artifacts, cache, checkpoints).
- **Public entry points:** `main -> dist/index.js`, `types -> dist/index.d.ts`.
- **No execution engine:** Do not reference or assume workflow execution or orchestration logic.

### Design Principles

- **Language-agnostic:** Templates and schemas must remain language-neutral.
- **Placeholder syntax:** Use `{{PLACEHOLDER}}` in templates; never substitute project-specific values in core templates.
- **Separation of concerns:** Keep configuration, documentation, and examples clearly separated.
- **Documentation alignment:** All user-facing changes to templates or schemas must be reflected in the relevant documentation.

### Documentation Sync

- **Update authoritative docs** for user-facing changes:
  - `README.md` for overview, usage, and placeholder reference.
  - `docs/ARCHITECTURE.md` for architecture or layout changes.
  - `docs/guides/MIGRATION_GUIDE.md` for migration or breaking changes.
  - `CHANGELOG.md` for all significant changes.
- **Do not duplicate** inventories, command lists, or status snapshots here—link to the above docs instead.

### Validation

- **Always validate substantive changes** with:
  - `npm run lint`
  - `npm test`
  - `npm run build`
- For configuration or template changes, validate YAML syntax and placeholder documentation as described in the authoritative docs.

### References

- [README.md](../README.md) – Project overview, usage, placeholder reference
- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) – Architecture and design
- [docs/guides/MIGRATION_GUIDE.md](../docs/guides/MIGRATION_GUIDE.md) – Migration and breaking changes
- [CHANGELOG.md](../CHANGELOG.md) – Version history

---

**Do not include implementation status, numeric inventories, or workflow/command lists here. Do not reference workflow execution or runtime logic. Link to authoritative docs for details.**

_Last updated: 2026-04-18 • For Copilot-assisted development in ai_workflow_core_
