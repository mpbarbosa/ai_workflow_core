# loader.test.yaml
# Test suite for src/index.ts public API (ai_workflow_core config-loader)
# Covers: happy paths, edge cases, error scenarios

suite: ai_workflow_core index.ts API

tests:
  - name: "should export all expected types"
    steps:
      - import: { from: "../src/index", as: "api" }
      - assert: { actual: "typeof api.AIHelpersConfig", equals: "function" }
      - assert: { actual: "typeof api.PersonaConfig", equals: "function" }
      - assert: { actual: "typeof api.PromptRole", equals: "function" }
      - assert: { actual: "typeof api.PromptRolesConfig", equals: "function" }
      - assert: { actual: "typeof api.ResolvedPersona", equals: "function" }

  - name: "should export type guards"
    steps:
      - import: { from: "../src/index", as: "api" }
      - assert: { actual: "typeof api.isPersonaConfig", equals: "function" }
      - assert: { actual: "typeof api.isPromptRole", equals: "function" }
      - assert: { actual: "typeof api.isPromptRolesConfig", equals: "function" }

  - name: "should export custom errors"
    steps:
      - import: { from: "../src/index", as: "api" }
      - assert: { actual: "typeof api.InvalidConfigError", equals: "function" }
      - assert: { actual: "typeof api.RoleNotFoundError", equals: "function" }

  - name: "should export config loading and resolution functions"
    steps:
      - import: { from: "../src/index", as: "api" }
      - assert: { actual: "typeof api.loadPersonas", equals: "function" }
      - assert: { actual: "typeof api.loadPromptRoles", equals: "function" }
      - assert: { actual: "typeof api.resolveAllPersonas", equals: "function" }
      - assert: { actual: "typeof api.resolvePersona", equals: "function" }

  - name: "loadPersonas returns personas on valid config"
    steps:
      - import: { from: "../src/index", as: "api" }
      - call: { fn: "api.loadPersonas", args: [{ personas: [{ id: "test", name: "Test" }] }], as: "result" }
      - assert: { actual: "result[0].id", equals: "test" }
      - assert: { actual: "result[0].name", equals: "Test" }

  - name: "loadPromptRoles returns roles on valid config"
    steps:
      - import: { from: "../src/index", as: "api" }
      - call: { fn: "api.loadPromptRoles", args: [{ roles: [{ id: "admin", description: "Admin" }] }], as: "result" }
      - assert: { actual: "result[0].id", equals: "admin" }
      - assert: { actual: "result[0].description", equals: "Admin" }

  - name: "resolveAllPersonas resolves all personas"
    steps:
      - import: { from: "../src/index", as: "api" }
      - call: { fn: "api.resolveAllPersonas", args: [[{ id: "p1", name: "Persona1" }]], as: "result" }
      - assert: { actual: "result[0].id", equals: "p1" }
      - assert: { actual: "result[0].name", equals: "Persona1" }

  - name: "resolvePersona resolves a single persona"
    steps:
      - import: { from: "../src/index", as: "api" }
      - call: { fn: "api.resolvePersona", args: [{ id: "p2", name: "Persona2" }], as: "result" }
      - assert: { actual: "result.id", equals: "p2" }
      - assert: { actual: "result.name", equals: "Persona2" }

  - name: "isPersonaConfig returns true for valid persona"
    steps:
      - import: { from: "../src/index", as: "api" }
      - call: { fn: "api.isPersonaConfig", args: [{ id: "x", name: "X" }], as: "result" }
      - assert: { actual: "result", equals: true }

  - name: "isPromptRole returns true for valid role"
    steps:
      - import: { from: "../src/index", as: "api" }
      - call: { fn: "api.isPromptRole", args: [{ id: "r", description: "Role" }], as: "result" }
      - assert: { actual: "result", equals: true }

  - name: "isPromptRolesConfig returns true for valid config"
    steps:
      - import: { from: "../src/index", as: "api" }
      - call: { fn: "api.isPromptRolesConfig", args: [{ roles: [{ id: "r", description: "Role" }] }], as: "result" }
      - assert: { actual: "result", equals: true }

  - name: "loadPersonas throws InvalidConfigError on bad config"
    steps:
      - import: { from: "../src/index", as: "api" }
      - try:
          call: { fn: "api.loadPersonas", args: [null] }
        catch:
          assert: { actual: "error instanceof api.InvalidConfigError", equals: true }

  - name: "loadPromptRoles throws InvalidConfigError on bad config"
    steps:
      - import: { from: "../src/index", as: "api" }
      - try:
          call: { fn: "api.loadPromptRoles", args: [null] }
        catch:
          assert: { actual: "error instanceof api.InvalidConfigError", equals: true }

  - name: "resolvePersona throws RoleNotFoundError for missing persona"
    steps:
      - import: { from: "../src/index", as: "api" }
      - try:
          call: { fn: "api.resolvePersona", args: [null] }
        catch:
          assert: { actual: "error instanceof api.RoleNotFoundError", equals: true }

  - name: "isPersonaConfig returns false for invalid input"
    steps:
      - import: { from: "../src/index", as: "api" }
      - call: { fn: "api.isPersonaConfig", args: [42], as: "result" }
      - assert: { actual: "result", equals: false }

  - name: "isPromptRole returns false for invalid input"
    steps:
      - import: { from: "../src/index", as: "api" }
      - call: { fn: "api.isPromptRole", args: [42], as: "result" }
      - assert: { actual: "result", equals: false }

  - name: "isPromptRolesConfig returns false for invalid input"
    steps:
      - import: { from: "../src/index", as: "api" }
      - call: { fn: "api.isPromptRolesConfig", args: [42], as: "result" }
      - assert: { actual: "result", equals: false }
