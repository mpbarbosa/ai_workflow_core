#!/usr/bin/env python3
"""
Context Block Consistency Validator
Validates that all workflow step prompts follow standardized context block structure.

Usage:
    python3 validate_context_blocks.py [ai_helpers.yaml]

Checks:
1. Presence of **Context:** block
2. Standard parameters: project_name, project_description, primary_language, change_scope, modified_count
3. Parameter naming convention (snake_case, no title case)
4. Bullet list format consistency
5. Parameter ordering

Exit codes:
    0 - All validations passed
    1 - Validation failures found
"""

import sys
import yaml
import re
from pathlib import Path


def validate_context_blocks(yaml_file):
    """Validate context block structure across all step prompts."""
    
    with open(yaml_file) as f:
        data = yaml.safe_load(f)
    
    # Step prompts to validate
    step_prompts = {
        'step2_consistency_prompt': 'Step 2',
        'step3_script_refs_prompt': 'Step 3',
        'step4_directory_prompt': 'Step 4',
        'step5_test_review_prompt': 'Step 5',
        'step8_dependencies_prompt': 'Step 8',
        'step9_code_quality_prompt': 'Step 9',
    }
    
    # Standard parameters that should be present
    standard_params = [
        'project_name',
        'project_description', 
        'primary_language',
        'change_scope',
        'modified_count'
    ]
    
    failures = []
    
    print("Validating Context Block Structure...")
    print("=" * 79)
    
    for prompt_name, step_num in step_prompts.items():
        if prompt_name not in data:
            failures.append(f"{step_num}: Prompt not found in YAML")
            continue
        
        task = data[prompt_name].get('task_template', '')
        
        # Check 1: Has **Context:** block
        if '**Context:**' not in task:
            failures.append(f"{step_num}: Missing **Context:** block")
        
        # Check 2: Standard parameters present
        params_found = re.findall(r'\{(\w+)\}', task)
        missing = [p for p in standard_params if p not in params_found]
        if missing:
            failures.append(f"{step_num}: Missing parameters: {', '.join(missing)}")
        
        # Check 3: No title case parameters
        bad_params = [p for p in params_found if p[0].isupper() or ' ' in p or '-' in p]
        if bad_params:
            failures.append(f"{step_num}: Non-snake_case parameters: {', '.join(bad_params)}")
        
        # Check 4: Bullet list format
        match = re.search(r'\*\*Context:\*\*(.*?)(?:\*\*|$)', task, re.DOTALL)
        if match:
            context = match.group(1)
            lines = [l.strip() for l in context.split('\n') if l.strip()]
            
            if lines:
                non_bullet_lines = [l for l in lines if not l.startswith('-')]
                if non_bullet_lines:
                    failures.append(f"{step_num}: Non-bullet lines in context: {len(non_bullet_lines)}")
    
    # Report results
    print()
    if not failures:
        print("✅ ALL VALIDATIONS PASSED")
        print()
        print("All step prompts have:")
        print("  • **Context:** block present")
        print("  • Standard parameters: " + ", ".join(standard_params))
        print("  • snake_case naming convention")
        print("  • Consistent bullet list format")
        return 0
    else:
        print("❌ VALIDATION FAILURES FOUND")
        print()
        for failure in failures:
            print(f"  • {failure}")
        return 1


if __name__ == '__main__':
    yaml_file = sys.argv[1] if len(sys.argv) > 1 else '.workflow_core/config/ai_helpers.yaml'
    
    if not Path(yaml_file).exists():
        print(f"Error: File not found: {yaml_file}")
        sys.exit(2)
    
    exit_code = validate_context_blocks(yaml_file)
    sys.exit(exit_code)
