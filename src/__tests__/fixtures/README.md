# src/__tests__/fixtures

This directory contains **YAML test-data files** used by the Jest unit-test suite in `src/__tests__/loader.test.ts`.

## Files

| File | Purpose |
|------|---------|
| `ai_helpers.yaml` | Minimal valid `ai_helpers.yaml` fixture. Contains two persona entries (`persona_alpha`, `persona_beta`) and a non-persona entry (`language_specific_docs`) to test `resolveAllPersonas` filtering. |
| `prompt_roles.yaml` | Minimal valid `prompt_roles.yaml` fixture. Defines two roles (`test_role_a`, `test_role_b`) referenced by the persona fixtures. |
| `bad_yaml.yaml` | Intentionally malformed YAML (unclosed bracket) used to test that loaders throw `InvalidConfigError` on parse errors. |

## Conventions

- Keep fixtures **minimal** — include only the fields required for the tests that use them.
- Never store real secrets, credentials, or production configuration in fixtures.
- When adding a new fixture, document it in the table above and reference it via the named constants at the top of `loader.test.ts` (e.g. `const MY_FIXTURE = path.join(FIXTURES, 'my_fixture.yaml')`).
