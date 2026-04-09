# config/ai_helpers/

These are the **source sub-files** for `config/ai_helpers.yaml`.

## Structure

| File | Contents |
|---|---|
| `_anchors.yaml` | 3 shared behavioral YAML anchors (`*behavioral_actionable`, `*behavioral_structured`, `*behavioral_generative`) |
| `documentation_prompts.yaml` | `doc_analysis_prompt`, `consistency_prompt`, `technical_writer_prompt` |
| `frontend_ux_prompts.yaml` | `front_end_developer_prompt`, `e2e_test_engineer_prompt`, `ui_ux_designer_prompt`, `tui_ux_designer_prompt` |
| `engineering_prompts.yaml` | `requirements_engineer_prompt`, `test_strategy_prompt`, `single_file_test_prompt`, `quality_prompt`, `issue_extraction_prompt` |
| `workflow_steps.yaml` | `step2_*` … `step14_*` + `error_resilience_prompt`, `markdown_lint_prompt`, `configuration_specialist_prompt` |
| `language_tables.yaml` | `language_specific_documentation`, `language_specific_quality`, `language_specific_testing` |
| `specialist_prompts.yaml` | `version_manager_prompt`, `aws_cloud_architect_prompt`, `javascript_developer_prompt`, `typescript_developer_prompt`, debugger personas, and other specialists |
| `library_prompts.yaml` | `library_architect_prompt`, `pattern_engineer_prompt`, `library_release_engineer_prompt`, `core_fetch_engineer_prompt`, `api_type_system_engineer_prompt`, `framework_integration_engineer_prompt`, `spec_architect_prompt` |
| `review_prompts.yaml` | `security_analyst_prompt`, `api_contract_reviewer_prompt`, `cli_tui_engineer_prompt`, `llm_integration_engineer_prompt`, `devx_engineer_prompt`, `core_pipeline_engineer_prompt`, `accessibility_review_prompt`, `performance_review_prompt` |

## Editing

Edit sub-files directly. **Do not edit `config/ai_helpers.yaml` directly** — it is a generated artifact.

After editing, regenerate the artifact:

```bash
python3 scripts/build_ai_helpers.py --validate
```

Or via npm:

```bash
npm run build:helpers
```

## Merge Order

The build script merges sub-files in the order listed above (`_anchors.yaml` first, always).
`_anchors.yaml` **must** be first because YAML aliases (`*behavioral_*`) are resolved at parse
time and must follow their anchor definitions in the document.

## Backward Compatibility

Consumer projects (`ai_workflow.js`, `olinda_prompter`) load `config/ai_helpers.yaml` via
hardcoded paths. The generated artifact keeps those integrations working without any changes.
