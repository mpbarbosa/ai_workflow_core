/**
 * types.ts — Core TypeScript interfaces and type guards for the prompt
 * config-loader module.
 *
 * These types model two YAML config files consumed by loader.ts:
 *
 * | YAML file                       | Root type           |
 * |---------------------------------|---------------------|
 * | `config/prompt_roles.yaml`      | {@link PromptRolesConfig} |
 * | `config/ai_helpers.yaml`        | {@link AIHelpersConfig}   |
 *
 * The resolved output produced by {@link resolvePersona} /
 * {@link resolveAllPersonas} is represented by {@link ResolvedPersona}.
 *
 * **Type guard functions** (`is*`) are exported for runtime validation and
 * are used internally by loader.ts to validate file contents before returning
 * them to callers.
 */

// ---------------------------------------------------------------------------
// config/prompt_roles.yaml schema
// ---------------------------------------------------------------------------

/** A single named role entry from config/prompt_roles.yaml.
 *
 * @see `config/prompt_roles.yaml` — `roles.<name>` entry
 */
export interface PromptRole {
  /** *(required)* One-line human-readable summary of what this role does. */
  readonly description: string;
  /** *(required)* The full role/identity text injected at prompt construction time. */
  readonly role_prefix: string;
}

/** The top-level shape of config/prompt_roles.yaml.
 *
 * @see `config/prompt_roles.yaml`
 * @example
 * ```yaml
 * roles:
 *   developer: { description: "...", role_prefix: "..." }
 * ```
 */
export interface PromptRolesConfig {
  /** *(required)* Map of role name → {@link PromptRole}. */
  readonly roles: Record<string, PromptRole>;
}

// ---------------------------------------------------------------------------
// config/ai_helpers.yaml schema
// ---------------------------------------------------------------------------

/**
 * A single persona entry from config/ai_helpers.yaml.
 *
 * After the refactor, personas no longer carry an inline `role_prefix`.
 * Instead they carry a `role_ref` key that points to an entry in
 * {@link PromptRolesConfig}.roles.
 *
 * @see `config/ai_helpers.yaml` — top-level persona keys
 */
export interface PersonaConfig {
  /** *(required)* Key referencing an entry in {@link PromptRolesConfig}.roles. */
  role_ref: string;
  /** *(optional)* YAML anchor alias for shared behavioral guidelines. */
  behavioral_guidelines?: string;
  /** *(optional)* Prompt template with `{variable}` placeholders. */
  task_template?: string;
  /** *(optional)* Step-by-step methodology text injected into the prompt. */
  approach?: string;
  /** Any additional fields that may appear in persona definitions. */
  [key: string]: unknown;
}

/** The top-level shape of config/ai_helpers.yaml.
 *
 * The map may contain `PersonaConfig` entries (identified by a `role_ref`
 * field) as well as arbitrary lookup tables (e.g., `language_specific_*`).
 * Use {@link isPersonaConfig} to narrow individual values.
 *
 * @see `config/ai_helpers.yaml`
 */
export type AIHelpersConfig = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Resolved output  (produced by loader.ts resolvePersona / resolveAllPersonas)
// ---------------------------------------------------------------------------

/**
 * A fully resolved persona — identical to {@link PersonaConfig} but with
 * `role_ref` replaced by the concrete `role_prefix` text from
 * {@link PromptRolesConfig}.
 *
 * Produced by {@link resolvePersona} in `src/loader.ts`.
 */
export interface ResolvedPersona extends Omit<PersonaConfig, 'role_ref'> {
  /** *(required)* The resolved role/identity text (no longer a reference key). */
  readonly role_prefix: string;
  /** *(required)* The original role_ref key, preserved for traceability. */
  readonly role_ref: string;
}

// ---------------------------------------------------------------------------
// Custom error types  (thrown by loader.ts)
// ---------------------------------------------------------------------------

/** Thrown when a `role_ref` key in ai_helpers.yaml has no matching entry
 *  in prompt_roles.yaml. */
export class RoleNotFoundError extends Error {
  constructor(
    public readonly roleRef: string,
    public readonly personaKey: string,
  ) {
    super(
      `Role reference "${roleRef}" used by persona "${personaKey}" was not found ` +
        `in prompt_roles.yaml. Add an entry under roles.${roleRef} or correct the role_ref key.`,
    );
    this.name = 'RoleNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown when a config file cannot be parsed (missing file, bad YAML, wrong
 *  top-level shape, etc.). */
export class InvalidConfigError extends Error {
  constructor(
    public readonly filePath: string,
    cause: unknown,
  ) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    super(`Failed to load config file "${filePath}": ${reason}`);
    this.name = 'InvalidConfigError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ---------------------------------------------------------------------------
// Type guards  (required: used by loader.ts for runtime YAML validation)
// ---------------------------------------------------------------------------

/** Returns true if `value` is a valid PromptRole object. */
export function isPromptRole(value: unknown): value is PromptRole {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v['description'] === 'string' && typeof v['role_prefix'] === 'string';
}

/** Returns true if `value` is a valid PromptRolesConfig object. */
export function isPromptRolesConfig(value: unknown): value is PromptRolesConfig {
  if (typeof value !== 'object' || value === null) { return false; }
  const v = value as Record<string, unknown>;
  if (typeof v['roles'] !== 'object' || v['roles'] === null) { return false; }
  return Object.values(v['roles'] as Record<string, unknown>).every(isPromptRole);
}

/** Returns true if `value` is a valid PersonaConfig object (has role_ref). */
export function isPersonaConfig(value: unknown): value is PersonaConfig {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v['role_ref'] === 'string';
}
