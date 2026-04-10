/**
 * loader.ts — Config loading and role-reference resolution for the
 * ai_workflow_core prompt system.
 *
 * Reads two YAML config files and resolves persona role references:
 *
 * | File                        | Loader function        | Return type          |
 * |-----------------------------|------------------------|----------------------|
 * | `config/prompt_roles.yaml`  | {@link loadPromptRoles} | {@link PromptRolesConfig} |
 * | `config/ai_helpers.yaml`    | {@link loadPersonas}    | {@link AIHelpersConfig}   |
 *
 * After loading, pass both objects to {@link resolveAllPersonas} (or
 * {@link resolvePersona} for a single entry) to produce
 * {@link ResolvedPersona} objects with concrete `role_prefix` text.
 */

import { promises as fsPromises } from 'fs';
import { load as parseYaml } from 'js-yaml';
import {
  AIHelpersConfig,
  InvalidConfigError,
  isPersonaConfig,
  isPromptRolesConfig,
  PersonaConfig,
  PromptRolesConfig,
  ResolvedPersona,
  RoleNotFoundError,
} from './types';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Reads and parses a YAML file from `filePath`.
 * Throws InvalidConfigError on any filesystem or YAML parse error.
 */
async function readYamlFile(filePath: string): Promise<unknown> {
  try {
    const raw = await fsPromises.readFile(filePath, 'utf8');
    return parseYaml(raw);
  } catch (err) {
    throw new InvalidConfigError(filePath, err);
  }
}

// ---------------------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------------------

/**
 * Loads and validates `config/prompt_roles.yaml` (or a custom path).
 *
 * Validates that the file has the expected top-level shape (`roles:` mapping)
 * and that every role entry has `description` and `role_prefix` string fields.
 *
 * @param filePath - Path to `prompt_roles.yaml`
 *                   (default usage: `config/prompt_roles.yaml`).
 * @returns        A validated {@link PromptRolesConfig} object.
 * @throws         {@link InvalidConfigError} if the file is missing,
 *                 unreadable, invalid YAML, or fails shape validation.
 */
export async function loadPromptRoles(filePath: string): Promise<PromptRolesConfig> {
  const raw = await readYamlFile(filePath);
  if (!isPromptRolesConfig(raw)) {
    throw new InvalidConfigError(
      filePath,
      'Expected a top-level "roles:" mapping but got: ' + JSON.stringify(raw)?.slice(0, 80),
    );
  }
  return raw;
}

/**
 * Loads and parses `config/ai_helpers.yaml` (or a custom path).
 *
 * The returned object is a raw parsed YAML map. Individual persona entries
 * are not validated here — use {@link resolvePersona} or
 * {@link resolveAllPersonas} to validate and resolve role references.
 *
 * @param filePath - Path to `ai_helpers.yaml`
 *                   (default usage: `config/ai_helpers.yaml`).
 * @returns        An {@link AIHelpersConfig} object (`Record<string, unknown>`).
 * @throws         {@link InvalidConfigError} if the file is missing or contains
 *                 invalid YAML.
 */
export async function loadPersonas(filePath: string): Promise<AIHelpersConfig> {
  const raw = await readYamlFile(filePath);
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new InvalidConfigError(
      filePath,
      'Expected a top-level YAML mapping but got: ' + typeof raw,
    );
  }
  return raw as AIHelpersConfig;
}

/**
 * Resolves the `role_ref` key in a single {@link PersonaConfig} to the full
 * `role_prefix` text from a {@link PromptRolesConfig}.
 *
 * @param persona    - A raw {@link PersonaConfig} (must have a `role_ref` field).
 * @param personaKey - The top-level key from `ai_helpers.yaml` (used in error messages).
 * @param roles      - The loaded {@link PromptRolesConfig} from `prompt_roles.yaml`.
 * @returns          A {@link ResolvedPersona} with `role_prefix` populated.
 * @throws           {@link RoleNotFoundError} if `persona.role_ref` has no matching
 *                   entry in `roles.roles`.
 */
export function resolvePersona(
  persona: PersonaConfig,
  personaKey: string,
  roles: PromptRolesConfig,
): ResolvedPersona {
  const roleEntry = roles.roles[persona.role_ref];
  if (!roleEntry) {
    throw new RoleNotFoundError(persona.role_ref, personaKey);
  }
  return {
    ...persona,
    role_prefix: roleEntry.role_prefix,
  };
}

/**
 * Returns a sorted array of all persona keys in the given helpers config.
 *
 * Uses the same structural definition as {@link resolveAllPersonas}: an entry
 * is a persona if and only if it satisfies {@link isPersonaConfig} (i.e., it
 * has a `role_ref` string field). Non-persona entries such as language lookup
 * tables and YAML anchor scalars are automatically excluded.
 *
 * @param config - The raw {@link AIHelpersConfig} loaded from `ai_helpers.yaml`.
 * @returns      A sorted `string[]` of all persona keys present in `config`.
 */
export function listPersonas(config: AIHelpersConfig): string[] {
  return Object.entries(config)
    .filter(([, value]) => isPersonaConfig(value))
    .map(([key]) => key)
    .sort();
}

/**
 * Iterates over all entries in an {@link AIHelpersConfig}, resolves every entry
 * that is a {@link PersonaConfig} (has a `role_ref`), and returns a map of
 * {@link ResolvedPersona} objects keyed by persona name.
 *
 * Non-persona entries (e.g., `language_specific_*` lookup tables) are silently
 * skipped and not included in the output.
 *
 * @param config - The raw {@link AIHelpersConfig} loaded from `ai_helpers.yaml`.
 * @param roles  - The loaded {@link PromptRolesConfig} from `prompt_roles.yaml`.
 * @returns      A `Record` mapping persona keys to {@link ResolvedPersona} objects.
 * @throws       {@link RoleNotFoundError} if any persona's `role_ref` is unresolvable.
 */
export function resolveAllPersonas(
  config: AIHelpersConfig,
  roles: PromptRolesConfig,
): Record<string, ResolvedPersona> {
  const resolved: Record<string, ResolvedPersona> = {};
  for (const [key, value] of Object.entries(config)) {
    if (isPersonaConfig(value)) {
      resolved[key] = resolvePersona(value, key, roles);
    }
  }
  return resolved;
}
