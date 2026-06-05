---
agent: 'agent'
description: 'Scaffold a new role entry in config/prompt_roles.yaml'
---

${input:roleName:Name for the new role (snake_case, e.g. api_gateway_engineer)}
${input:roleDescription:One-line description of this role's focus}

Read `config/prompt_roles.yaml` in full to understand:
- The existing role structure (`description` + `role_prefix` under `roles:`)
- The current version number and changelog header
- Which section the new role belongs in (Documentation, Engineering, Front-end, Specialist, etc.) based on similar existing roles

Then:

1. **Verify the role key is unique.** If the provided role name already exists under `roles:`, stop and report the conflict.

2. **Choose the right section.** Place the new entry near roles with similar responsibilities. Add a brief comment line above the entry if a new section is needed.

3. **Scaffold the entry** following this exact structure (replace `<roleName>` and `<roleDescription>` with the provided inputs):
   ```yaml
     <roleName>:
       description: "<roleDescription>"
       role_prefix: |
         You are a [senior/principal/specialist] [role title] with expertise in:
         - [domain area 1]
         - [domain area 2]
         - [domain area 3]
   ```
   Write a `role_prefix` that is specific and actionable — model it on the closest existing role in the file.

4. **Bump the patch version** in the file header (e.g., `1.7.0` → `1.7.1`) and add a changelog entry in the header's changelog block:
   ```
   # - X.Y.Z (YYYY-MM-DD): Added <roleName> role
   #   - [one-line description of what this role covers]
   ```

5. **Run `npm test`** to verify the new role is valid and no `role_ref` links are broken.

Report: the exact YAML block you added, which section it landed in, and the new version number.
