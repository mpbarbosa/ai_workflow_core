---
agent: 'agent'
description: 'Scaffold a new persona entry in the appropriate config/ai_helpers/ sub-file'
---

${input:personaKey:Key for the new persona (snake_case ending in _prompt, e.g. api_gateway_engineer_prompt)}
${input:targetRoleRef:Which role from config/prompt_roles.yaml does this persona use? (snake_case key, e.g. api_gateway_engineer)}

**Do not edit `config/ai_helpers.yaml` directly — it is a generated file.**

Read the following files to orient yourself:
- `config/ai_helpers/index.yaml` — maps persona keys to their sub-files; check the provided persona key is not already defined
- `config/prompt_roles.yaml` — verify the provided role ref exists under `roles:`; if it does not, stop and report the missing role (use `add-role` first)
- `config/ai_helpers/_anchors.yaml` — understand the three available behavioral guideline anchors: `*behavioral_actionable`, `*behavioral_structured`, `*behavioral_generative`

Then choose the right sub-file by matching the persona's domain to the existing groupings in `index.yaml`:
- `documentation_prompts.yaml` — doc analysis, consistency, technical writing
- `engineering_prompts.yaml` — requirements, testing, code quality
- `frontend_ux_prompts.yaml` — UI, UX, browser, E2E
- `specialist_prompts.yaml` — language-specific, debugging, version management
- `library_prompts.yaml` — library architecture, SDK, API design
- `review_prompts.yaml` — security, accessibility, performance, API contract

Read the chosen sub-file and copy the structure of the nearest existing persona. Then:

1. **Append the new persona** at the end of the chosen sub-file (replace `<personaKey>` and `<targetRoleRef>` with the provided inputs):
   ```yaml
   <personaKey>:
     role_ref: <targetRoleRef>  # resolved from config/prompt_roles.yaml
     behavioral_guidelines: *behavioral_actionable
     task_template: |
       **YOUR TASK**: [Describe the primary task this persona performs]

       [Add relevant context placeholders as needed, e.g.:]
       **Provided context**: {file_contents}

       **REQUIRED ACTIONS**:
       1. [First action]
       2. [Second action]
   ```
   Choose the behavioral guideline anchor that fits the task type:
   - `*behavioral_actionable` — review or analysis tasks that may require concrete output
   - `*behavioral_structured` — consistency or audit tasks requiring structured findings
   - `*behavioral_generative` — pure-generation tasks (commits, test files, stubs)

2. **Add the mapping to `config/ai_helpers/index.yaml`** under the correct sub-file comment block:
   ```yaml
   <personaKey>: <chosen-sub-file>.yaml
   ```

3. **Regenerate the monolith**:
   ```bash
   python3 scripts/build_ai_helpers.py
   ```

4. **Run `npm test`** to verify the `role_ref` resolves correctly and no coverage thresholds are broken.

Report: the sub-file chosen and why, the exact YAML block added, and the test result.
