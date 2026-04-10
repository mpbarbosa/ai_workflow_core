/**
 * loader.test.ts — Unit tests for the config-loader module.
 *
 * Tests cover:
 *   - loadPromptRoles: happy path, missing file, bad YAML, wrong shape
 *   - loadPersonas: happy path, missing file, bad YAML, non-object YAML
 *   - resolvePersona: happy path, missing role_ref throws RoleNotFoundError
 *   - resolveAllPersonas: happy path, skips non-persona entries,
 *     throws on unresolvable ref
 */

import path from 'path';
import {
  InvalidConfigError,
  isPersonaConfig,
  isPromptRole,
  isPromptRolesConfig,
  listPersonas,
  loadPersonas,
  loadPromptRoles,
  resolveAllPersonas,
  resolvePersona,
  RoleNotFoundError,
} from '../index';
import type { AIHelpersConfig, PersonaConfig, PromptRolesConfig } from '../index';

// ---------------------------------------------------------------------------
// Fixture paths
// ---------------------------------------------------------------------------

const FIXTURES = path.join(__dirname, 'fixtures');
const PROMPT_ROLES_YAML = path.join(FIXTURES, 'prompt_roles.yaml');
const AI_HELPERS_YAML = path.join(FIXTURES, 'ai_helpers.yaml');
const BAD_YAML = path.join(FIXTURES, 'bad_yaml.yaml');
const MISSING_FILE = path.join(FIXTURES, 'does_not_exist.yaml');

// ---------------------------------------------------------------------------
// loadPromptRoles
// ---------------------------------------------------------------------------

describe('loadPromptRoles', () => {
  let config: PromptRolesConfig;

  beforeEach(async () => {
    config = await loadPromptRoles(PROMPT_ROLES_YAML);
  });

  it('loads a valid prompt_roles.yaml and returns PromptRolesConfig', () => {
    expect(config).toHaveProperty('roles');
    expect(typeof config.roles).toBe('object');
    expect(config.roles['test_role_a']).toBeDefined();
    expect(config.roles['test_role_b']).toBeDefined();
  });

  it('returns roles with correct description and role_prefix fields', () => {
    const roleA = config.roles['test_role_a'];
    expect(roleA.description).toBe('Role A for testing');
    expect(roleA.role_prefix).toContain('senior test engineer');
  });

  it('throws InvalidConfigError for a missing file', async () => {
    await expect(loadPromptRoles(MISSING_FILE)).rejects.toThrow(InvalidConfigError);
    await expect(loadPromptRoles(MISSING_FILE)).rejects.toThrow(/does_not_exist\.yaml/);
  });

  it('throws InvalidConfigError for malformed YAML', async () => {
    await expect(loadPromptRoles(BAD_YAML)).rejects.toThrow(InvalidConfigError);
  });

  it('throws InvalidConfigError when file lacks top-level "roles" key', async () => {
    // ai_helpers.yaml has no top-level "roles" key
    await expect(loadPromptRoles(AI_HELPERS_YAML)).rejects.toThrow(InvalidConfigError);
    await expect(loadPromptRoles(AI_HELPERS_YAML)).rejects.toThrow(/roles/i);
  });
});

// ---------------------------------------------------------------------------
// loadPersonas
// ---------------------------------------------------------------------------

describe('loadPersonas', () => {
  let config: AIHelpersConfig;

  beforeEach(async () => {
    config = await loadPersonas(AI_HELPERS_YAML);
  });

  it('loads a valid ai_helpers.yaml and returns an object', () => {
    expect(typeof config).toBe('object');
    expect(config).not.toBeNull();
  });

  it('includes persona_alpha and persona_beta from the fixture', () => {
    expect(config['persona_alpha']).toBeDefined();
    expect(config['persona_beta']).toBeDefined();
  });

  it('throws InvalidConfigError for a missing file', async () => {
    await expect(loadPersonas(MISSING_FILE)).rejects.toThrow(InvalidConfigError);
    await expect(loadPersonas(MISSING_FILE)).rejects.toThrow(/does_not_exist\.yaml/);
  });

  it('throws InvalidConfigError for malformed YAML', async () => {
    await expect(loadPersonas(BAD_YAML)).rejects.toThrow(InvalidConfigError);
  });
});

// ---------------------------------------------------------------------------
// resolvePersona
// ---------------------------------------------------------------------------

describe('resolvePersona', () => {
  let roles: PromptRolesConfig;

  beforeEach(async () => {
    roles = await loadPromptRoles(PROMPT_ROLES_YAML);
  });

  it('resolves role_ref to role_prefix from PromptRolesConfig', () => {
    const persona: PersonaConfig = {
      role_ref: 'test_role_a',
      task_template: 'Analyse {file}.',
    };
    const resolved = resolvePersona(persona, 'my_persona', roles);
    expect(resolved.role_prefix).toContain('senior test engineer');
    expect(resolved.role_ref).toBe('test_role_a');
  });

  it('preserves all original persona fields in the resolved output', () => {
    const persona: PersonaConfig = {
      role_ref: 'test_role_b',
      behavioral_guidelines: 'be concise',
      task_template: 'Update docs.',
      approach: '1. Read\n2. Write',
    };
    const resolved = resolvePersona(persona, 'my_persona', roles);
    expect(resolved.behavioral_guidelines).toBe('be concise');
    expect(resolved.task_template).toBe('Update docs.');
    expect(resolved.approach).toBe('1. Read\n2. Write');
  });

  it('throws RoleNotFoundError when role_ref has no match in roles', () => {
    const persona: PersonaConfig = { role_ref: 'nonexistent_role' };
    expect(() => resolvePersona(persona, 'bad_persona', roles)).toThrow(RoleNotFoundError);
  });

  it('RoleNotFoundError carries roleRef and personaKey properties', () => {
    const persona: PersonaConfig = { role_ref: 'nonexistent_role' };
    let thrown: RoleNotFoundError | undefined;
    try {
      resolvePersona(persona, 'bad_persona', roles);
    } catch (err) {
      thrown = err as RoleNotFoundError;
    }
    expect(thrown).toBeInstanceOf(RoleNotFoundError);
    expect(thrown!.roleRef).toBe('nonexistent_role');
    expect(thrown!.personaKey).toBe('bad_persona');
    expect(thrown!.name).toBe('RoleNotFoundError');
  });
});

// ---------------------------------------------------------------------------
// listPersonas
// ---------------------------------------------------------------------------

describe('listPersonas', () => {
  let config: AIHelpersConfig;

  beforeEach(async () => {
    config = await loadPersonas(AI_HELPERS_YAML);
  });

  it('returns only persona keys (entries with role_ref)', () => {
    const keys = listPersonas(config);
    expect(keys).toContain('persona_alpha');
    expect(keys).toContain('persona_beta');
  });

  it('excludes non-persona entries (entries without role_ref)', () => {
    const keys = listPersonas(config);
    expect(keys).not.toContain('language_specific_docs');
  });

  it('returns a sorted array', () => {
    const keys = listPersonas(config);
    const sorted = [...keys].sort();
    expect(keys).toEqual(sorted);
  });

  it('returns an empty array for an empty config', () => {
    expect(listPersonas({})).toEqual([]);
  });

  it('excludes YAML anchor scalar entries (values that are not PersonaConfig)', () => {
    const configWithAnchor: AIHelpersConfig = {
      ...config,
      _behavioral_actionable: 'be concise and actionable',
    };
    const keys = listPersonas(configWithAnchor);
    expect(keys).not.toContain('_behavioral_actionable');
  });
});

// ---------------------------------------------------------------------------
// resolveAllPersonas
// ---------------------------------------------------------------------------

describe('resolveAllPersonas', () => {
  let roles: PromptRolesConfig;
  let config: AIHelpersConfig;

  beforeEach(async () => {
    roles = await loadPromptRoles(PROMPT_ROLES_YAML);
    config = await loadPersonas(AI_HELPERS_YAML);
  });

  it('resolves all persona entries from ai_helpers.yaml fixture', () => {
    const resolved = resolveAllPersonas(config, roles);
    expect(resolved['persona_alpha']).toBeDefined();
    expect(resolved['persona_beta']).toBeDefined();
  });

  it('resolved persona has correct role_prefix', () => {
    const resolved = resolveAllPersonas(config, roles);
    expect(resolved['persona_alpha'].role_prefix).toContain('senior test engineer');
    expect(resolved['persona_beta'].role_prefix).toContain('documentation specialist');
  });

  it('skips non-persona entries (entries without role_ref)', () => {
    const resolved = resolveAllPersonas(config, roles);
    // language_specific_docs has no role_ref — must not appear in output
    expect(resolved['language_specific_docs']).toBeUndefined();
  });

  it('throws RoleNotFoundError when a persona has an unresolvable role_ref', () => {
    // Inject a bad entry
    config['broken_persona'] = { role_ref: 'does_not_exist' };
    expect(() => resolveAllPersonas(config, roles)).toThrow(RoleNotFoundError);
  });
});

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

describe('isPromptRole', () => {
  it('returns true for a valid PromptRole object', () => {
    expect(isPromptRole({ description: 'Test', role_prefix: 'You are...' })).toBe(true);
  });

  it('returns false when description is missing', () => {
    expect(isPromptRole({ role_prefix: 'You are...' })).toBe(false);
  });

  it('returns false when role_prefix is missing', () => {
    expect(isPromptRole({ description: 'Test' })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isPromptRole(null)).toBe(false);
  });

  it('returns false for a primitive', () => {
    expect(isPromptRole('string')).toBe(false);
  });
});

describe('isPromptRolesConfig', () => {
  it('returns true for a valid PromptRolesConfig', () => {
    expect(isPromptRolesConfig({ roles: {} })).toBe(true);
  });

  it('returns false when roles is missing', () => {
    expect(isPromptRolesConfig({ other: {} })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isPromptRolesConfig(null)).toBe(false);
  });
});

describe('isPersonaConfig', () => {
  it('returns true when role_ref is a string', () => {
    expect(isPersonaConfig({ role_ref: 'some_role' })).toBe(true);
  });

  it('returns false when role_ref is missing', () => {
    expect(isPersonaConfig({ task_template: 'do something' })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isPersonaConfig(null)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Error classes
// ---------------------------------------------------------------------------

describe('InvalidConfigError', () => {
  it('sets name to "InvalidConfigError"', () => {
    const err = new InvalidConfigError('/some/file.yaml', 'bad content');
    expect(err.name).toBe('InvalidConfigError');
  });

  it('includes filePath in the message', () => {
    const err = new InvalidConfigError('/some/file.yaml', 'reason');
    expect(err.message).toContain('/some/file.yaml');
  });

  it('includes cause in the message', () => {
    const err = new InvalidConfigError('/some/file.yaml', new Error('parse failed'));
    expect(err.message).toContain('parse failed');
  });

  it('is instanceof Error', () => {
    expect(new InvalidConfigError('/f', 'x')).toBeInstanceOf(Error);
  });
});

describe('RoleNotFoundError', () => {
  it('sets name to "RoleNotFoundError"', () => {
    const err = new RoleNotFoundError('my_role', 'my_persona');
    expect(err.name).toBe('RoleNotFoundError');
  });

  it('exposes roleRef and personaKey properties', () => {
    const err = new RoleNotFoundError('my_role', 'my_persona');
    expect(err.roleRef).toBe('my_role');
    expect(err.personaKey).toBe('my_persona');
  });

  it('includes role and persona in the message', () => {
    const err = new RoleNotFoundError('my_role', 'my_persona');
    expect(err.message).toContain('my_role');
    expect(err.message).toContain('my_persona');
  });

  it('is instanceof Error', () => {
    expect(new RoleNotFoundError('r', 'p')).toBeInstanceOf(Error);
  });
});
