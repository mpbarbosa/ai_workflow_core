/**
 * index.ts — Public API for the ai_workflow_core config-loader module.
 *
 * Usage:
 *   import { loadPromptRoles, loadPersonas, resolveAllPersonas } from 'ai_workflow_core';
 *
 * See docs/api/PROMPT_ROLES_REFERENCE.md for full documentation.
 */

// Types and interfaces
export type {
  AIHelpersConfig,
  ConfigValidationResult,
  PersonaConfig,
  PromptRole,
  PromptRolesConfig,
  ResolvedPersona,
} from './types';

// Type guards
export { isPersonaConfig, isPromptRole, isPromptRolesConfig } from './types';

// Custom errors
export { InvalidConfigError, RoleNotFoundError } from './types';

// Config loading and resolution functions
export { listPersonas, loadPersonas, loadPromptRoles, resolveAllPersonas, resolvePersona, validateConfig } from './loader';
