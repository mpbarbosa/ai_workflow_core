#!/usr/bin/env python3
"""
Validate GitHub Copilot Prompt Files

Validates all *.prompt.md files in:
  - templates/prompts/   (distributable prompt files for consuming projects)
  - .github/prompts/     (internal contributor tooling for this repo)

Checks:
  1. Naming convention: filename must end in .prompt.md
  2. YAML frontmatter: must be present, valid, and include 'agent' and 'description'
  3. Variable syntax: all ${input:...} variables must follow the expected pattern

Usage:
    python3 scripts/validate_prompt_files.py

Exit codes:
    0 - All prompt files are valid
    1 - Validation errors found
    2 - Script error (missing dependencies, etc.)

Version: 1.0.0
Last Updated: 2026-06-04
"""

import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML is required. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(2)

# ============================================================================
# CONFIGURATION
# ============================================================================

REPO_ROOT = Path(__file__).parent.parent

PROMPT_DIRS = [
    REPO_ROOT / "templates" / "prompts",
    REPO_ROOT / ".github" / "prompts",
]

REQUIRED_FRONTMATTER_FIELDS = ["agent", "description"]

# Matches well-formed ${input:identifier:prompt text} variables.
# identifier: one or more word characters (letters, digits, underscore)
# prompt text: any non-empty string not containing unbalanced braces
VALID_INPUT_VAR = re.compile(r"\$\{input:[A-Za-z_][A-Za-z0-9_]*:[^}]+\}")

# Matches anything that looks like an attempted ${input:...} but is malformed
ATTEMPTED_INPUT_VAR = re.compile(r"\$\{input:[^}]*\}")


# ============================================================================
# VALIDATION
# ============================================================================

def parse_frontmatter(content: str, filepath: Path) -> tuple[dict | None, list[str]]:
    """Extract and parse YAML frontmatter from a prompt file. Returns (data, errors)."""
    errors: list[str] = []

    if not content.startswith("---"):
        errors.append("Missing frontmatter: file must start with '---'")
        return None, errors

    end = content.find("\n---", 3)
    if end == -1:
        errors.append("Malformed frontmatter: opening '---' has no closing '---'")
        return None, errors

    raw = content[3:end].strip()
    try:
        data = yaml.safe_load(raw)
    except yaml.YAMLError as exc:
        errors.append(f"Invalid YAML in frontmatter: {exc}")
        return None, errors

    if not isinstance(data, dict):
        errors.append("Frontmatter must be a YAML mapping")
        return None, errors

    return data, errors


def validate_frontmatter_fields(data: dict) -> list[str]:
    """Check required fields are present and non-empty."""
    errors: list[str] = []
    for field in REQUIRED_FRONTMATTER_FIELDS:
        if field not in data:
            errors.append(f"Missing required frontmatter field: '{field}'")
        elif not data[field]:
            errors.append(f"Frontmatter field '{field}' must not be empty")
    return errors


def validate_input_variables(body: str) -> list[str]:
    """Check all ${input:...} variable usages are well-formed."""
    errors: list[str] = []
    for match in ATTEMPTED_INPUT_VAR.finditer(body):
        token = match.group()
        if not VALID_INPUT_VAR.fullmatch(token):
            errors.append(
                f"Malformed input variable '{token}' — "
                "expected format: ${{input:identifier:prompt text}}"
            )
    return errors


def validate_file(path: Path) -> list[str]:
    """Run all checks on a single .prompt.md file. Returns a list of error strings."""
    errors: list[str] = []

    # 1. Naming convention
    if not path.name.endswith(".prompt.md"):
        errors.append(f"Naming violation: '{path.name}' must end in '.prompt.md'")
        return errors  # remaining checks assume correct extension

    content = path.read_text(encoding="utf-8")

    # 2. Frontmatter presence + YAML validity
    data, fm_errors = parse_frontmatter(content, path)
    errors.extend(fm_errors)

    # 3. Required fields (only if frontmatter parsed successfully)
    if data is not None:
        errors.extend(validate_frontmatter_fields(data))

    # 4. Input variable syntax (scan the entire file body after frontmatter)
    body_start = content.find("\n---", 3)
    body = content[body_start + 4:] if body_start != -1 else content
    errors.extend(validate_input_variables(body))

    return errors


# ============================================================================
# RUNNER
# ============================================================================

def main() -> int:
    found_files = False
    total_errors = 0

    for directory in PROMPT_DIRS:
        if not directory.exists():
            continue

        prompt_files = sorted(directory.glob("*.prompt.md"))
        if not prompt_files:
            continue

        found_files = True
        print(f"\nValidating {directory.relative_to(REPO_ROOT)}/")

        for path in prompt_files:
            errors = validate_file(path)
            rel = path.relative_to(REPO_ROOT)
            if errors:
                print(f"  ❌ {rel}")
                for err in errors:
                    print(f"       {err}")
                total_errors += len(errors)
            else:
                print(f"  ✅ {rel}")

    if not found_files:
        print("⚠️  No prompt files found in templates/prompts/ or .github/prompts/")
        return 0

    print()
    if total_errors == 0:
        print(f"✅ All prompt files are valid")
        return 0
    else:
        print(f"❌ {total_errors} error(s) found in prompt files")
        return 1


if __name__ == "__main__":
    sys.exit(main())
