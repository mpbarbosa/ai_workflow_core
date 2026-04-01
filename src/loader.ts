/**
 * loader.ts — Config loading and role-reference resolution for the
 * ai_workflow_core prompt system.
 *
 * Public API:
 *   loadPromptRoles(filePath)  → PromptRolesConfig
 *   loadPersonas(filePath)     → AIHelpersConfig
 *   resolvePersona(persona, personaKey, roles) → ResolvedPersona
 *   resolveAllPersonas(config, roles) → Record<string, ResolvedPersona>
 */

import { readFileSync } from 'fs';
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
function readYamlFile(filePath: string): unknown {
  try {
    const raw = readFileSync(filePath, 'utf8');
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
 * @param filePath - Absolute or relative path to prompt_roles.yaml.
 * @returns        A validated PromptRolesConfig object.
 * @throws         InvalidConfigError if the file is missing, unreadable,
 *                 invalid YAML, or does not have the expected top-level shape.
 */
export function loadPromptRoles(filePath: string): PromptRolesConfig {
  const raw = readYamlFile(filePath);
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
 * are not validated here — use resolvePersona / resolveAllPersonas to
 * validate and resolve role references.
 *
 * @param filePath - Absolute or relative path to ai_helpers.yaml.
 * @returns        An AIHelpersConfig object (Record<string, unknown>).
 * @throws         InvalidConfigError if the file is missing or contains
 *                 invalid YAML.
 */
export function loadPersonas(filePath: string): AIHelpersConfig {
  const raw = readYamlFile(filePath);
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new InvalidConfigError(
      filePath,
      'Expected a top-level YAML mapping but got: ' + typeof raw,
    );
  }
  return raw as AIHelpersConfig;
}

/**
 * Resolves the `role_ref` key in a single PersonaConfig to the full
 * `role_prefix` text from a PromptRolesConfig.
 *
 * @param persona    - The raw PersonaConfig (must have a `role_ref` field).
 * @param personaKey - The top-level key used in ai_helpers.yaml (for error msgs).
 * @param roles      - The loaded PromptRolesConfig to look up the ref in.
 * @returns          A ResolvedPersona with `role_prefix` populated.
 * @throws           RoleNotFoundError if persona.role_ref has no match in roles.
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
 * Iterates over all entries in an AIHelpersConfig, resolves every entry
 * that is a PersonaConfig (has a `role_ref`), and returns a map of
 * ResolvedPersona objects keyed by persona name.
 *
 * Non-persona entries (e.g., language_specific_* lookup tables) are silently
 * skipped and not included in the output.
 *
 * @param config - The raw AIHelpersConfig loaded from ai_helpers.yaml.
 * @param roles  - The loaded PromptRolesConfig used for resolution.
 * @returns      A Record mapping persona keys to ResolvedPersona objects.
 * @throws       RoleNotFoundError if any persona's role_ref is unresolvable.
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
