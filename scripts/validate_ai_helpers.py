#!/usr/bin/env python3
"""
validate_ai_helpers.py — Validate ai_helpers sub-files and the merged artifact.

Usage:
    python3 scripts/validate_ai_helpers.py [--all] [file ...]

Checks performed:
  1. YAML syntax — each file is parseable
  2. Persona schema — every top-level key whose value contains 'role_ref' is
     validated against config/ai_helpers.schema.json (PersonaConfig shape)
  3. role_ref completeness — every role_ref value is present in prompt_roles.yaml

Exit codes:
  0  all checks passed
  1  one or more validation errors found
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("ERROR: PyYAML is required. Install with: pip install pyyaml")

try:
    import jsonschema
except ImportError:
    sys.exit("ERROR: jsonschema is required. Install with: pip install jsonschema")

REPO_ROOT = Path(__file__).parent.parent
SCHEMA_FILE = REPO_ROOT / "config" / "ai_helpers.schema.json"
SUB_FILES_DIR = REPO_ROOT / "config" / "ai_helpers"
ARTIFACT = REPO_ROOT / "config" / "ai_helpers.yaml"
PROMPT_ROLES = REPO_ROOT / "config" / "prompt_roles.yaml"

SUB_FILES = [
    "_anchors.yaml",
    "documentation_prompts.yaml",
    "frontend_ux_prompts.yaml",
    "engineering_prompts.yaml",
    "workflow_steps.yaml",
    "language_tables.yaml",
    "specialist_prompts.yaml",
    "library_prompts.yaml",
    "review_prompts.yaml",
]


def load_schema() -> dict:
    with open(SCHEMA_FILE) as f:
        return json.load(f)


ANCHORS_FILE = SUB_FILES_DIR / "_anchors.yaml"


def _load_with_anchors(path: Path) -> tuple[dict | None, str | None]:
    """Load a YAML sub-file, prepending anchor definitions if needed."""
    raw = path.read_text()
    # Non-anchor sub-files use aliases defined in _anchors.yaml — prepend them.
    # Skip for _anchors.yaml itself and for the merged artifact (which already contains them).
    if path != ANCHORS_FILE and path != ARTIFACT and ANCHORS_FILE.exists():
        anchors_raw = ANCHORS_FILE.read_text()
        raw = anchors_raw + "\n" + raw
    try:
        data = yaml.safe_load(raw) or {}
        return data, None
    except yaml.YAMLError as e:
        return None, str(e)


def load_yaml(path: Path) -> dict | None:
    try:
        with open(path) as f:
            return yaml.safe_load(f) or {}
    except yaml.YAMLError as e:
        return None, str(e)


def load_known_roles() -> set[str]:
    if not PROMPT_ROLES.exists():
        return set()
    with open(PROMPT_ROLES) as f:
        data = yaml.safe_load(f) or {}
    roles = data.get("roles", {})
    return set(roles.keys()) if isinstance(roles, dict) else set()


def validate_file(path: Path, schema: dict, known_roles: set[str]) -> list[str]:
    errors = []

    # 1. YAML syntax (prepend anchors for sub-files that use aliases)
    data, err = _load_with_anchors(path)
    if err:
        errors.append(f"YAML parse error: {err}")
        return errors
    if not isinstance(data, dict):
        errors.append("Top-level YAML value is not a mapping")
        return errors

    persona_validator = jsonschema.Draft7Validator(schema["definitions"]["PersonaConfig"])

    for key, value in data.items():
        if not isinstance(value, dict):
            continue  # string anchor or non-object — skip
        if "role_ref" not in value:
            continue  # language table or other non-persona — skip

        # 2. Persona schema validation
        schema_errors = list(persona_validator.iter_errors(value))
        for err in schema_errors:
            path_str = " > ".join(str(p) for p in err.absolute_path) if err.absolute_path else "(root)"
            errors.append(f"  [{key}] schema error at {path_str}: {err.message}")

        # 3. role_ref resolution check
        if known_roles:
            role_ref = value.get("role_ref", "")
            if role_ref and role_ref not in known_roles:
                errors.append(f"  [{key}] role_ref '{role_ref}' not found in prompt_roles.yaml")

    return errors


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("files", nargs="*", help="Specific YAML files to validate (default: all sub-files + artifact)")
    parser.add_argument("--all", action="store_true", help="Validate sub-files and the merged artifact")
    args = parser.parse_args()

    schema = load_schema()
    known_roles = load_known_roles()

    if args.files:
        targets = [Path(f) for f in args.files]
    else:
        targets = [SUB_FILES_DIR / f for f in SUB_FILES]
        if args.all or not args.files:
            targets.append(ARTIFACT)

    total_errors = 0
    for path in targets:
        if not path.exists():
            print(f"⚠  {path}: file not found — skipping")
            continue

        errors = validate_file(path, schema, known_roles)
        rel = path.relative_to(REPO_ROOT) if path.is_relative_to(REPO_ROOT) else path
        if errors:
            print(f"✗ {rel} — {len(errors)} error(s):")
            for e in errors:
                print(f"    {e}")
            total_errors += len(errors)
        else:
            data, _ = _load_with_anchors(path)
            persona_count = sum(1 for v in data.values() if isinstance(v, dict) and "role_ref" in v) if isinstance(data, dict) else 0
            print(f"✓ {rel}  ({persona_count} personas validated)")

    if total_errors:
        print(f"\n{total_errors} total error(s) found.")
        sys.exit(1)
    else:
        print(f"\nAll {len(targets)} file(s) valid.")


if __name__ == "__main__":
    main()
