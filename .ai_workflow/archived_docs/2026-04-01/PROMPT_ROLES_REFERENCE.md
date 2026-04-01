# PROMPT_ROLES_REFERENCE.md — Prompt Roles API Reference

**Version**: 1.0.0  
**Last Updated**: 2026-04-01  
**File**: `config/prompt_roles.yaml`  
**Module**: `src/loader.ts`

---

## Table of Contents

1. [Overview](#overview)
2. [prompt_roles.yaml Schema](#prompt_rolesyaml-schema)
3. [role_ref Pattern in ai_helpers.yaml](#role_ref-pattern-in-ai_helpersyaml)
4. [TypeScript Interfaces](#typescript-interfaces)
5. [Loader API](#loader-api)
6. [Error Types](#error-types)
7. [Type Guards](#type-guards)
8. [Usage Examples](#usage-examples)
9. [Available Role Keys](#available-role-keys)

---

## Overview

`config/prompt_roles.yaml` is the **single source of truth** for all AI persona role
definitions in the ai_workflow_core system.

Prior to v1.2.0, each persona in `ai_helpers.yaml` carried its own inline `role_prefix:`
block, duplicating large text blobs and making cross-project reuse impossible. The new
system separates the *what* (role definitions in `prompt_roles.yaml`) from the *how*
(task templates and approach in `ai_helpers.yaml`):

```
prompt_roles.yaml       ai_helpers.yaml
─────────────────       ────────────────
roles:                  doc_analysis_prompt:
  doc_analysis:   ◄───    role_ref: doc_analysis
    description: "..."    behavioral_guidelines: ...
    role_prefix: |        task_template: |
      You are a ...         Analyse {changed_files}...
```

The TypeScript config-loader (`src/loader.ts`) resolves `role_ref:` keys to the full
`role_prefix` text at load time, producing `ResolvedPersona` objects ready for use
in prompt construction.

---

## prompt_roles.yaml Schema

```yaml
roles:
  <role_key>:                 # snake_case identifier, unique within the file
    description: "<string>"  # One-line human-readable summary (used in docs/tooling)
    role_prefix: |            # Multi-line literal block — the actual prompt identity text
      You are a senior ...
```

### Field Specifications

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | `string` | ✅ | One-line summary. Used in documentation and error messages. |
| `role_prefix` | `string` (literal block `\|`) | ✅ | The full role/identity text injected into the AI prompt at construction time. |

### Naming Convention

- Role keys use **snake_case** (e.g., `doc_analysis`, `e2e_test_engineer`)
- Role keys are the **logical role name**, not the persona key from `ai_helpers.yaml`  
  (e.g., `doc_analysis` not `doc_analysis_prompt`)
- Keys must be unique within the `roles:` mapping

---

## role_ref Pattern in ai_helpers.yaml

After the v1.2.0 refactor, persona entries in `ai_helpers.yaml` use `role_ref:` instead
of the old inline `role_prefix:` block:

```yaml
# ✅ v1.2.0+ pattern
doc_analysis_prompt:
  role_ref: doc_analysis          # key into prompt_roles.yaml > roles
  behavioral_guidelines: *behavioral_actionable
  task_template: |
    **YOUR TASK**: Analyse the changed files...
  approach: |
    **Methodology**:
    1. Scan changed files...

# ❌ old v1.0.x pattern (no longer used)
doc_analysis_prompt:
  role_prefix: |
    You are a senior technical documentation specialist...
  behavioral_guidelines: *behavioral_actionable
  ...
```

### Adding a New Persona

1. Add an entry to `config/prompt_roles.yaml` under `roles:`:
   ```yaml
   my_new_role:
     description: "Brief summary"
     role_prefix: |
       You are a senior ...
   ```
2. Add (or update) the persona in `ai_helpers.yaml`:
   ```yaml
   my_persona_prompt:
     role_ref: my_new_role
     behavioral_guidelines: *behavioral_actionable
     task_template: |
       ...
   ```
3. Run `npm test` — the test suite validates all `role_ref` keys resolve correctly.

---

## TypeScript Interfaces

Defined in `src/types.ts` and re-exported from `src/index.ts`.

### `PromptRole`

Represents a single entry under `roles:` in `prompt_roles.yaml`.

```typescript
interface PromptRole {
  description: string;  // one-line summary
  role_prefix: string;  // full role/identity text
}
```

### `PromptRolesConfig`

The top-level shape of `prompt_roles.yaml`.

```typescript
interface PromptRolesConfig {
  roles: Record<string, PromptRole>;
}
```

### `PersonaConfig`

A single raw persona entry from `ai_helpers.yaml` (post-refactor).

```typescript
interface PersonaConfig {
  role_ref: string;                  // references PromptRolesConfig.roles key
  behavioral_guidelines?: string;
  task_template?: string;
  approach?: string;
  [key: string]: unknown;            // additional fields allowed
}
```

### `ResolvedPersona`

The fully resolved persona — `role_ref` is preserved and `role_prefix` is populated.

```typescript
interface ResolvedPersona extends Omit<PersonaConfig, 'role_ref'> {
  role_prefix: string;  // resolved from PromptRolesConfig
  role_ref: string;     // original key, preserved for traceability
}
```

### `AIHelpersConfig`

The top-level shape of `ai_helpers.yaml`.

```typescript
type AIHelpersConfig = Record<string, PersonaConfig | unknown>;
```

---

## Loader API

All functions are exported from `src/index.ts` (and `src/loader.ts`).

### `loadPromptRoles(filePath: string): PromptRolesConfig`

Reads, parses, and validates a `prompt_roles.yaml` file.

**Parameters:**
- `filePath` — absolute or relative path to the YAML file

**Returns:** A validated `PromptRolesConfig` object.

**Throws:**
- `InvalidConfigError` — file not found, unreadable, invalid YAML, or missing `roles:` key

```typescript
import { loadPromptRoles } from 'ai_workflow_core';

const roles = loadPromptRoles('config/prompt_roles.yaml');
console.log(Object.keys(roles.roles)); // ['doc_analysis', 'consistency', ...]
```

---

### `loadPersonas(filePath: string): AIHelpersConfig`

Reads and parses an `ai_helpers.yaml` file. Does not validate or resolve `role_ref` keys.

**Parameters:**
- `filePath` — absolute or relative path to the YAML file

**Returns:** A raw `AIHelpersConfig` object (keyed by persona name).

**Throws:**
- `InvalidConfigError` — file not found, invalid YAML, or non-object top-level value

```typescript
import { loadPersonas } from 'ai_workflow_core';

const personas = loadPersonas('config/ai_helpers.yaml');
```

---

### `resolvePersona(persona, personaKey, roles): ResolvedPersona`

Resolves a single `PersonaConfig`'s `role_ref` to the full `role_prefix` text.

**Parameters:**
- `persona: PersonaConfig` — the raw persona object
- `personaKey: string` — the persona's key in `ai_helpers.yaml` (used in error messages)
- `roles: PromptRolesConfig` — the loaded roles config

**Returns:** A `ResolvedPersona` with `role_prefix` populated.

**Throws:**
- `RoleNotFoundError` — when `persona.role_ref` has no match in `roles.roles`

```typescript
import { loadPromptRoles, resolvePersona } from 'ai_workflow_core';
import type { PersonaConfig } from 'ai_workflow_core';

const roles = loadPromptRoles('config/prompt_roles.yaml');
const persona: PersonaConfig = { role_ref: 'doc_analysis', task_template: '...' };
const resolved = resolvePersona(persona, 'doc_analysis_prompt', roles);
console.log(resolved.role_prefix); // "You are a senior technical documentation specialist..."
```

---

### `resolveAllPersonas(config, roles): Record<string, ResolvedPersona>`

Iterates over all entries in an `AIHelpersConfig`, resolves every `PersonaConfig`
(entries with a `role_ref` field), and returns a map of resolved personas.
Non-persona entries (e.g., `language_specific_*` lookup tables) are silently skipped.

**Parameters:**
- `config: AIHelpersConfig` — loaded from `ai_helpers.yaml`
- `roles: PromptRolesConfig` — loaded from `prompt_roles.yaml`

**Returns:** `Record<string, ResolvedPersona>` — only persona entries, keyed by name.

**Throws:**
- `RoleNotFoundError` — if any persona has an unresolvable `role_ref`

```typescript
import { loadPromptRoles, loadPersonas, resolveAllPersonas } from 'ai_workflow_core';

const roles = loadPromptRoles('config/prompt_roles.yaml');
const config = loadPersonas('config/ai_helpers.yaml');
const resolved = resolveAllPersonas(config, roles);

// Access any resolved persona:
console.log(resolved['doc_analysis_prompt'].role_prefix);
console.log(resolved['typescript_developer_prompt'].task_template);
```

---

## Error Types

### `RoleNotFoundError`

Thrown when a `role_ref` key in `ai_helpers.yaml` does not match any entry in
`prompt_roles.yaml`.

```typescript
class RoleNotFoundError extends Error {
  readonly roleRef: string;     // the unresolvable key (e.g., "nonexistent_role")
  readonly personaKey: string;  // the persona that referenced it (e.g., "my_prompt")
  readonly name: 'RoleNotFoundError';
}
```

**How to fix:** Add the missing role to `config/prompt_roles.yaml` under `roles:`,
or correct the `role_ref:` value in `ai_helpers.yaml`.

---

### `InvalidConfigError`

Thrown when a config file cannot be loaded or parsed.

```typescript
class InvalidConfigError extends Error {
  readonly filePath: string;  // path to the problematic file
  readonly name: 'InvalidConfigError';
}
```

Common causes:
- File does not exist or is not readable
- YAML is malformed (syntax error)
- Top-level YAML structure does not match the expected schema

---

## Type Guards

Exported from `src/index.ts` for runtime validation.

| Function | Validates |
|----------|-----------|
| `isPromptRole(value)` | `value` is a `PromptRole` (has `description` and `role_prefix` strings) |
| `isPromptRolesConfig(value)` | `value` is a `PromptRolesConfig` (has a `roles` object) |
| `isPersonaConfig(value)` | `value` is a `PersonaConfig` (has a `role_ref` string) |

```typescript
import { isPromptRole, isPersonaConfig } from 'ai_workflow_core';

if (isPromptRole(someValue)) {
  console.log(someValue.role_prefix); // type-safe
}
```

---

## Usage Examples

### Minimal integration

```typescript
import path from 'path';
import { loadPromptRoles, loadPersonas, resolveAllPersonas } from 'ai_workflow_core';

const coreDir = path.join(__dirname, '.workflow_core');

const roles = loadPromptRoles(path.join(coreDir, 'config/prompt_roles.yaml'));
const personas = loadPersonas(path.join(coreDir, 'config/ai_helpers.yaml'));
const resolved = resolveAllPersonas(personas, roles);

// Build a prompt for a specific persona
const persona = resolved['doc_analysis_prompt'];
const prompt = [
  persona.role_prefix,
  persona.task_template?.replace('{changed_files}', myChangedFiles) ?? '',
].join('\n\n');
```

### Error handling

```typescript
import {
  loadPromptRoles,
  loadPersonas,
  resolveAllPersonas,
  InvalidConfigError,
  RoleNotFoundError,
} from 'ai_workflow_core';

try {
  const roles = loadPromptRoles('config/prompt_roles.yaml');
  const personas = loadPersonas('config/ai_helpers.yaml');
  const resolved = resolveAllPersonas(personas, roles);
  return resolved;
} catch (err) {
  if (err instanceof RoleNotFoundError) {
    console.error(`Config error: role "${err.roleRef}" missing for persona "${err.personaKey}"`);
  } else if (err instanceof InvalidConfigError) {
    console.error(`Cannot load config file: ${err.filePath}`);
    console.error(err.message);
  }
  throw err;
}
```

---

## Available Role Keys

The following role keys are defined in `config/prompt_roles.yaml` (v1.0.0):

### Documentation
| Key | Description |
|-----|-------------|
| `doc_analysis` | Incremental documentation updater |
| `consistency` | Documentation consistency auditor |
| `technical_writer` | Comprehensive documentation architect |
| `requirements_engineer` | Requirements elicitation and specification specialist |
| `step2_consistency` | Pipeline step 2: consistency auditor |
| `step3_script_refs` | Pipeline step 3: shell script documentation specialist |
| `step4_directory` | Pipeline step 4: project structure architect |
| `markdown_lint` | Markdown best practices specialist |

### Front-End Development
| Key | Description |
|-----|-------------|
| `front_end_developer` | Senior front-end developer (modern JS frameworks) |
| `ui_ux_designer` | UI/UX design and accessibility specialist |
| `e2e_test_engineer` | End-to-end test engineer and browser automation specialist |

### Testing & Quality
| Key | Description |
|-----|-------------|
| `test_strategy` | Test strategy architect (WHAT to test) |
| `single_file_test` | Test suite generator (HOW to write tests) |
| `quality` | File-level code quality reviewer |
| `step5_test_review` | Pipeline step 5: test implementation reviewer |
| `step7_test_exec` | Pipeline step 7: CI/CD test results analyst |
| `step9_code_quality` | Pipeline step 9: system-wide quality engineer |
| `issue_extraction` | Technical PM for issue extraction and categorization |

### Development & Engineering
| Key | Description |
|-----|-------------|
| `configuration_specialist` | DevOps and configuration management expert |
| `step8_dependencies` | Pipeline step 8: dependency security specialist |
| `step11_git_commit` | Git workflow and conventional commits specialist |
| `step13_prompt_engineer` | Pipeline step 13: AI prompt engineer |
| `version_manager` | Semantic versioning and version bump expert |
| `javascript_developer` | JavaScript/npm package management specialist |
| `typescript_developer` | TypeScript type system and strict-mode specialist |

### Debugging
| Key | Description |
|-----|-------------|
| `observer_pattern_debugger` | Observer/event-driven architecture debugger |
| `async_flow_debugger` | Async flow and Promise chain debugger |
| `data_structure_debugger` | Data structure and API contract debugger |

### Cloud & Infrastructure
| Key | Description |
|-----|-------------|
| `aws_cloud_architect` | Senior AWS Cloud Architect |
