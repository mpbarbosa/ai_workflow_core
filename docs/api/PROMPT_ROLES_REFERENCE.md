# TypeScript Loader API Reference

**Module**: `ai_workflow_core` (`src/`)
**Version**: 1.6.0
**Last Updated**: 2026-04-10

This document covers the public TypeScript API exposed by `src/index.ts`.
For YAML configuration file schemas, see:
- [AI_HELPERS_REFERENCE.md](AI_HELPERS_REFERENCE.md) — `config/ai_helpers.yaml`
- [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md) — `.workflow-config.yaml`

---

## Table of Contents

- [Overview](#overview)
- [Installation / Submodule Usage](#installation--submodule-usage)
- [Types and Interfaces](#types-and-interfaces)
  - [PromptRole](#promptrole)
  - [PromptRolesConfig](#promptrolesconfig)
  - [PersonaConfig](#personaconfig)
  - [AIHelpersConfig](#aihelpersconfig)
  - [ResolvedPersona](#resolvedpersona)
  - [ConfigValidationResult](#configvalidationresult)
- [Loader Functions](#loader-functions)
  - [loadPromptRoles](#loadpromproles)
  - [loadPersonas](#loadpersonas)
  - [validateConfig](#validateconfig)
  - [listPersonas](#listpersonas)
  - [resolvePersona](#resolvepersona)
  - [resolveAllPersonas](#resolveallpersonas)
- [Type Guards](#type-guards)
  - [isPromptRole](#ispromprole)
  - [isPromptRolesConfig](#ispromptrolesconfig)
  - [isPersonaConfig](#ispersonaconfig)
- [Custom Errors](#custom-errors)
  - [InvalidConfigError](#invalidconfigerror)
  - [RoleNotFoundError](#rolenotfounderror)
- [Integration Examples](#integration-examples)
- [Error Handling Guide](#error-handling-guide)

---

## Overview

The TypeScript loader module (`src/`) provides runtime loading, validation,
and resolution of the two YAML configuration files that drive the AI persona
system:

| YAML file | Loader function | Return type |
|---|---|---|
| `config/prompt_roles.yaml` | `loadPromptRoles` | `PromptRolesConfig` |
| `config/ai_helpers.yaml` | `loadPersonas` | `AIHelpersConfig` |

**Typical workflow:**

```
loadPromptRoles() ──┐
                    ├──► validateConfig() ──► resolveAllPersonas() ──► use ResolvedPersona[]
loadPersonas()   ──┘                         (or resolvePersona() for single)
                    └──► listPersonas()       (persona key inventory)
```

---

## Installation / Submodule Usage

When consuming this repository as a Git submodule, the TypeScript sources are
available under `src/`. Import via the package entry point:

```typescript
import {
  loadPromptRoles,
  loadPersonas,
  validateConfig,
  listPersonas,
  resolveAllPersonas,
} from 'ai_workflow_core';
```

---

## Types and Interfaces

### PromptRole

A single named role entry from `config/prompt_roles.yaml`.

```typescript
interface PromptRole {
  readonly description: string;  // one-line summary of the role
  readonly role_prefix: string;  // full identity text injected at prompt time
}
```

### PromptRolesConfig

The top-level shape of `config/prompt_roles.yaml`.

```typescript
interface PromptRolesConfig {
  readonly roles: Record<string, PromptRole>;
}
```

**YAML shape**:
```yaml
roles:
  my_role:
    description: "Senior TypeScript developer"
    role_prefix: |
      You are a senior TypeScript developer ...
```

### PersonaConfig

A single persona entry from `config/ai_helpers.yaml`. Personas are
identified at runtime by the presence of a `role_ref` string field.

```typescript
interface PersonaConfig {
  role_ref: string;               // references a key in PromptRolesConfig.roles
  behavioral_guidelines?: string; // optional YAML anchor alias for shared guidelines
  task_template?: string;         // prompt template with {placeholder} variables
  approach?: string;              // step-by-step methodology text
  [key: string]: unknown;         // additional fields allowed
}
```

### AIHelpersConfig

The top-level shape of `config/ai_helpers.yaml`. Deliberately loose to
accommodate non-persona entries (language lookup tables, YAML anchor scalars).

```typescript
type AIHelpersConfig = Record<string, unknown>;
```

Use `isPersonaConfig(value)` to narrow individual values to `PersonaConfig`.

### ResolvedPersona

A fully resolved persona — identical to `PersonaConfig` but with the
`role_ref` key replaced by the concrete `role_prefix` text. Produced by
`resolvePersona` / `resolveAllPersonas`.

```typescript
interface ResolvedPersona extends Omit<PersonaConfig, 'role_ref'> {
  readonly role_prefix: string; // resolved role/identity text
  readonly role_ref: string;    // original role_ref key (preserved for traceability)
}
```

### ConfigValidationResult

Return type of `validateConfig`. Contains all unresolvable `role_ref` errors
found in a helpers config.

```typescript
interface ConfigValidationResult {
  readonly valid: boolean;    // true if all role_refs resolved
  readonly errors: string[];  // sorted list of error messages (empty when valid)
}
```

---

## Loader Functions

### loadPromptRoles

```typescript
async function loadPromptRoles(filePath: string): Promise<PromptRolesConfig>
```

Loads and validates `config/prompt_roles.yaml` (or a custom path).

**Parameters**:
- `filePath` — Path to the YAML file (typically `config/prompt_roles.yaml`).

**Returns**: A validated `PromptRolesConfig` object.

**Throws**: `InvalidConfigError` if the file is missing, unreadable, invalid
YAML, or fails shape validation (missing `roles:` mapping or malformed role
entries).

**Example**:
```typescript
const roles = await loadPromptRoles('config/prompt_roles.yaml');
console.log(Object.keys(roles.roles)); // ['developer', 'doc_analyst', ...]
```

---

### loadPersonas

```typescript
async function loadPersonas(filePath: string): Promise<AIHelpersConfig>
```

Loads and parses `config/ai_helpers.yaml` (or a custom path). Individual
`role_ref` references are **not** validated here — call `validateConfig` or
`resolveAllPersonas` to check cross-file integrity.

**Parameters**:
- `filePath` — Path to the YAML file (typically `config/ai_helpers.yaml`).

**Returns**: An `AIHelpersConfig` object (`Record<string, unknown>`).

**Throws**: `InvalidConfigError` if the file is missing or contains invalid
YAML.

**Example**:
```typescript
const config = await loadPersonas('config/ai_helpers.yaml');
```

---

### validateConfig

```typescript
function validateConfig(
  helpersConfig: AIHelpersConfig,
  rolesConfig: PromptRolesConfig,
): ConfigValidationResult
```

Pre-flight check: validates that every persona in `helpersConfig` has a
`role_ref` that exists as an **own property** of `rolesConfig.roles`. Unlike
`resolveAllPersonas` (which throws on the first bad reference), this function
collects **all** unresolvable references before returning.

Non-persona entries (language tables, YAML anchor scalars) are silently
ignored.

> **Scope note**: This function only checks cross-file `role_ref` integrity.
> It does not validate the overall YAML shape — that is handled by
> `loadPromptRoles` and `loadPersonas` individually.

**Parameters**:
- `helpersConfig` — The raw `AIHelpersConfig` loaded from `ai_helpers.yaml`.
- `rolesConfig` — The loaded `PromptRolesConfig` from `prompt_roles.yaml`.

**Returns**: `ConfigValidationResult` with `valid` and a sorted `errors` array.

**Example**:
```typescript
const result = validateConfig(helpersConfig, rolesConfig);
if (!result.valid) {
  console.error('Config validation failed:');
  result.errors.forEach(e => console.error(' -', e));
  process.exit(1);
}
```

---

### listPersonas

```typescript
function listPersonas(config: AIHelpersConfig): string[]
```

Returns a sorted array of all persona key names in the given helpers config.
An entry is a persona if and only if it satisfies `isPersonaConfig` (i.e.,
it has a `role_ref` string field). Non-persona entries are automatically
excluded.

**Parameters**:
- `config` — The raw `AIHelpersConfig` loaded from `ai_helpers.yaml`.

**Returns**: Sorted `string[]` of persona keys.

**Example**:
```typescript
const keys = listPersonas(config);
// ['accessibility_review_prompt', 'api_contract_reviewer_prompt', ...]
```

---

### resolvePersona

```typescript
function resolvePersona(
  persona: PersonaConfig,
  personaKey: string,
  roles: PromptRolesConfig,
): ResolvedPersona
```

Resolves the `role_ref` in a single `PersonaConfig` to the full `role_prefix`
text from a `PromptRolesConfig`. Uses `Object.prototype.hasOwnProperty.call`
for the role lookup (not `in`) to avoid false positives on inherited
properties.

**Parameters**:
- `persona` — A raw `PersonaConfig` (must have a `role_ref` field).
- `personaKey` — The top-level key from `ai_helpers.yaml` (used in error messages).
- `roles` — The loaded `PromptRolesConfig` from `prompt_roles.yaml`.

**Returns**: A `ResolvedPersona` with `role_prefix` populated.

**Throws**: `RoleNotFoundError` if `persona.role_ref` has no matching entry
in `roles.roles`.

---

### resolveAllPersonas

```typescript
function resolveAllPersonas(
  config: AIHelpersConfig,
  roles: PromptRolesConfig,
): Record<string, ResolvedPersona>
```

Iterates over all entries in an `AIHelpersConfig`, resolves every persona
(entry with a `role_ref`), and returns a map of `ResolvedPersona` objects.
Non-persona entries are silently skipped.

Call `validateConfig` first if you want to surface all errors before resolving.

**Parameters**:
- `config` — The raw `AIHelpersConfig` loaded from `ai_helpers.yaml`.
- `roles` — The loaded `PromptRolesConfig` from `prompt_roles.yaml`.

**Returns**: `Record<string, ResolvedPersona>` keyed by persona name.

**Throws**: `RoleNotFoundError` on the **first** unresolvable `role_ref`.

---

## Type Guards

### isPromptRole

```typescript
function isPromptRole(value: unknown): value is PromptRole
```

Returns `true` if `value` is a valid `PromptRole` object (has `description`
and `role_prefix` string fields).

---

### isPromptRolesConfig

```typescript
function isPromptRolesConfig(value: unknown): value is PromptRolesConfig
```

Returns `true` if `value` is a valid `PromptRolesConfig` (has a `roles`
mapping where every entry satisfies `isPromptRole`).

---

### isPersonaConfig

```typescript
function isPersonaConfig(value: unknown): value is PersonaConfig
```

Returns `true` if `value` is a valid `PersonaConfig` object (has a
`role_ref` string field). This is the canonical persona-detection check
used by `listPersonas`, `validateConfig`, and `resolveAllPersonas`.

---

## Custom Errors

### InvalidConfigError

Thrown when a config file cannot be loaded or parsed.

```typescript
class InvalidConfigError extends Error {
  readonly filePath: string;
  // message: `Failed to load config file "${filePath}": ${reason}`
}
```

**Thrown by**: `loadPromptRoles`, `loadPersonas`

**Causes**: File not found, file unreadable, invalid YAML, wrong top-level shape.

---

### RoleNotFoundError

Thrown when a `role_ref` key in `ai_helpers.yaml` has no matching entry in
`prompt_roles.yaml`.

```typescript
class RoleNotFoundError extends Error {
  readonly roleRef: string;    // the unresolvable role_ref value
  readonly personaKey: string; // the persona key that referenced it
  // message: `Role reference "${roleRef}" used by persona "${personaKey}" was not found ...`
}
```

**Thrown by**: `resolvePersona`, `resolveAllPersonas`

**Resolution**: Add an entry under `roles.${roleRef}` in `prompt_roles.yaml`,
or correct the `role_ref` key in `ai_helpers.yaml`. Run
`python3 scripts/build_ai_helpers.py --validate` to regenerate and verify.

---

## Integration Examples

### Full load-validate-resolve pipeline

```typescript
import {
  loadPersonas,
  loadPromptRoles,
  resolveAllPersonas,
  validateConfig,
} from 'ai_workflow_core';

const roles  = await loadPromptRoles('config/prompt_roles.yaml');
const config = await loadPersonas('config/ai_helpers.yaml');

const result = validateConfig(config, roles);
if (!result.valid) {
  result.errors.forEach(e => console.error(e));
  process.exit(1);
}

const personas = resolveAllPersonas(config, roles);
const docAnalyst = personas['doc_analysis_prompt'];
console.log(docAnalyst.role_prefix); // full identity text
```

### Listing available personas

```typescript
import { listPersonas, loadPersonas } from 'ai_workflow_core';

const config = await loadPersonas('config/ai_helpers.yaml');
const keys   = listPersonas(config);
console.log(`${keys.length} personas available`);
```

### Resolving a single persona

```typescript
import { isPersonaConfig, loadPersonas, loadPromptRoles, resolvePersona } from 'ai_workflow_core';

const roles  = await loadPromptRoles('config/prompt_roles.yaml');
const config = await loadPersonas('config/ai_helpers.yaml');
const entry  = config['aws_cloud_architect_prompt'];

if (isPersonaConfig(entry)) {
  const persona = resolvePersona(entry, 'aws_cloud_architect_prompt', roles);
  console.log(persona.role_prefix);
}
```

### CI pre-flight check script

```typescript
// scripts/validate-config.ts
import { loadPersonas, loadPromptRoles, validateConfig } from 'ai_workflow_core';

const roles  = await loadPromptRoles('config/prompt_roles.yaml');
const config = await loadPersonas('config/ai_helpers.yaml');
const result = validateConfig(config, roles);

if (!result.valid) {
  console.error(`Config validation failed (${result.errors.length} errors):`);
  result.errors.forEach(e => console.error(` - ${e}`));
  process.exit(1);
}

console.log('Config valid.');
```

---

## Error Handling Guide

| Scenario | Error thrown | Resolution |
|---|---|---|
| YAML file not found | `InvalidConfigError` | Check the `filePath` argument; verify the file exists |
| Invalid YAML syntax | `InvalidConfigError` | Run `yamllint -d relaxed config/ai_helpers.yaml` |
| Wrong YAML top-level shape | `InvalidConfigError` | Ensure `prompt_roles.yaml` has a top-level `roles:` mapping |
| `role_ref` not in roles | `RoleNotFoundError` | Run `validateConfig` first to get all errors at once; add missing role to `prompt_roles.yaml` |
| `validateConfig` returns errors | (no throw) | Inspect `result.errors`; each message names the persona key and missing role_ref |
