# types.test.yaml
# Test suite for src/types.ts (interfaces, type guards, custom errors)

suite: ai_workflow_core types.ts

tests:
  - name: "isPromptRole returns true for valid PromptRole"
    steps:
      - import: { from: "../src/types", as: "types" }
      - call: { fn: "types.isPromptRole", args: [{ description: "desc", role_prefix: "prefix" }], as: "result" }
      - assert: { actual: "result", equals: true }

  - name: "isPromptRole returns false for missing fields"
    steps:
      - import: { from: "../src/types", as: "types" }
      - call: { fn: "types.isPromptRole", args: [{ description: "desc" }], as: "result1" }
      - call: { fn: "types.isPromptRole", args: [{ role_prefix: "prefix" }], as: "result2" }
      - call: { fn: "types.isPromptRole", args: [{}], as: "result3" }
      - assert: { actual: "result1", equals: false }
      - assert: { actual: "result2", equals: false }
      - assert: { actual: "result3", equals: false }

  - name: "isPromptRole returns false for non-object"
    steps:
      - import: { from: "../src/types", as: "types" }
      - call: { fn: "types.isPromptRole", args: [null], as: "result1" }
      - call: { fn: "types.isPromptRole", args: [42], as: "result2" }
      - call: { fn: "types.isPromptRole", args: ["string"], as: "result3" }
      - assert: { actual: "result1", equals: false }
      - assert: { actual: "result2", equals: false }
      - assert: { actual: "result3", equals: false }

  - name: "isPromptRolesConfig returns true for valid PromptRolesConfig"
    steps:
      - import: { from: "../src/types", as: "types" }
      - call: { fn: "types.isPromptRolesConfig", args: [{ roles: { admin: { description: "desc", role_prefix: "prefix" } } }], as: "result" }
      - assert: { actual: "result", equals: true }

  - name: "isPromptRolesConfig returns false for missing roles"
    steps:
      - import: { from: "../src/types", as: "types" }
      - call: { fn: "types.isPromptRolesConfig", args: [{}], as: "result" }
      - assert: { actual: "result", equals: false }

  - name: "isPromptRolesConfig returns false for non-object"
    steps:
      - import: { from: "../src/types", as: "types" }
      - call: { fn: "types.isPromptRolesConfig", args: [null], as: "result1" }
      - call: { fn: "types.isPromptRolesConfig", args: [42], as: "result2" }
      - call: { fn: "types.isPromptRolesConfig", args: ["string"], as: "result3" }
      - assert: { actual: "result1", equals: false }
      - assert: { actual: "result2", equals: false }
      - assert: { actual: "result3", equals: false }

  - name: "isPersonaConfig returns true for valid PersonaConfig"
    steps:
      - import: { from: "../src/types", as: "types" }
      - call: { fn: "types.isPersonaConfig", args: [{ role_ref: "admin" }], as: "result" }
      - assert: { actual: "result", equals: true }

  - name: "isPersonaConfig returns false for missing role_ref"
    steps:
      - import: { from: "../src/types", as: "types" }
      - call: { fn: "types.isPersonaConfig", args: [{}], as: "result" }
      - assert: { actual: "result", equals: false }

  - name: "isPersonaConfig returns false for non-object"
    steps:
      - import: { from: "../src/types", as: "types" }
      - call: { fn: "types.isPersonaConfig", args: [null], as: "result1" }
      - call: { fn: "types.isPersonaConfig", args: [42], as: "result2" }
      - call: { fn: "types.isPersonaConfig", args: ["string"], as: "result3" }
      - assert: { actual: "result1", equals: false }
      - assert: { actual: "result2", equals: false }
      - assert: { actual: "result3", equals: false }

  - name: "RoleNotFoundError sets correct properties and message"
    steps:
      - import: { from: "../src/types", as: "types" }
      - let: { error: { new: "types.RoleNotFoundError", args: ["missingRole", "personaA"] } }
      - assert: { actual: "error.roleRef", equals: "missingRole" }
      - assert: { actual: "error.personaKey", equals: "personaA" }
      - assert: { actual: "error.name", equals: "RoleNotFoundError" }
      - assert: { actual: "error.message", contains: "Role reference \"missingRole\" used by persona \"personaA\"" }

  - name: "InvalidConfigError sets correct properties and message"
    steps:
      - import: { from: "../src/types", as: "types" }
      - let: { error: { new: "types.InvalidConfigError", args: ["file.yaml", "bad yaml"] } }
      - assert: { actual: "error.filePath", equals: "file.yaml" }
      - assert: { actual: "error.name", equals: "InvalidConfigError" }
      - assert: { actual: "error.message", contains: "Failed to load config file \"file.yaml\"" }
      - assert: { actual: "error.message", contains: "bad yaml" }

  - name: "InvalidConfigError wraps inner error message"
    steps:
      - import: { from: "../src/types", as: "types" }
      - let: { cause: { new: "Error", args: ["parse failed"] } }
      - let: { error: { new: "types.InvalidConfigError", args: ["file.yaml", { ref: "cause" }] } }
      - assert: { actual: "error.message", contains: "parse failed" }
