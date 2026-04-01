/**
 * types.ts — Core TypeScript interfaces and type guards for the prompt
 * config-loader module.
 *
 * These types model the two YAML config files:
 *   - config/prompt_roles.yaml  (PromptRole / PromptRolesConfig)
 *   - config/ai_helpers.yaml    (PersonaConfig / AIHelpersConfig)
 *
 * and the resolved output produced by loader.ts (ResolvedPersona).
 */

// ---------------------------------------------------------------------------
// prompt_roles.yaml schema
// ---------------------------------------------------------------------------

/** A single named role entry from config/prompt_roles.yaml. */
export interface PromptRole {
  /** One-line human-readable summary of what this role does. */
  description: string;
  /** The full role/identity text injected at prompt construction time. */
  role_prefix: string;
}

/** The top-level shape of config/prompt_roles.yaml. */
export interface PromptRolesConfig {
  roles: Record<string, PromptRole>;
}

// ---------------------------------------------------------------------------
// ai_helpers.yaml schema
// ---------------------------------------------------------------------------

/**
 * A single persona entry from config/ai_helpers.yaml.
 *
 * After the refactor, personas no longer carry an inline `role_prefix`.
 * Instead they carry a `role_ref` key that points to an entry in
 * PromptRolesConfig.roles.
 */
export interface PersonaConfig {
  /** Key referencing an entry in PromptRolesConfig.roles. */
  role_ref: string;
  /** YAML anchor alias for shared behavioral guidelines (optional). */
  behavioral_guidelines?: string;
  /** Prompt template with `{variable}` placeholders (optional). */
  task_template?: string;
  /** Step-by-step methodology text injected into the prompt (optional). */
  approach?: string;
  /** Any additional fields that may appear in persona definitions. */
  [key: string]: unknown;
}

/** The top-level shape of config/ai_helpers.yaml. */
export type AIHelpersConfig = Record<string, PersonaConfig | unknown>;

// ---------------------------------------------------------------------------
// Resolved output
// ---------------------------------------------------------------------------

/**
 * A fully resolved persona — identical to PersonaConfig but with
 * `role_ref` replaced by the concrete `role_prefix` text from
 * PromptRolesConfig.
 */
export interface ResolvedPersona extends Omit<PersonaConfig, 'role_ref'> {
  /** The resolved role/identity text (no longer a reference key). */
  role_prefix: string;
  /** The original role_ref key, preserved for traceability. */
  role_ref: string;
}

// ---------------------------------------------------------------------------
// Custom error types
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
// Type guards
// ---------------------------------------------------------------------------

/** Returns true if `value` is a valid PromptRole object. */
export function isPromptRole(value: unknown): value is PromptRole {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v['description'] === 'string' && typeof v['role_prefix'] === 'string';
}

/** Returns true if `value` is a valid PromptRolesConfig object. */
export function isPromptRolesConfig(value: unknown): value is PromptRolesConfig {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v['roles'] === 'object' && v['roles'] !== null;
}

/** Returns true if `value` is a valid PersonaConfig object (has role_ref). */
export function isPersonaConfig(value: unknown): value is PersonaConfig {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v['role_ref'] === 'string';
}
