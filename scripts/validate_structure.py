#!/usr/bin/env python3
"""
Validate Directory Structure

Validates ai_workflow_core repository directory structure for:
- Empty directories (excluding allowed exceptions)
- Undocumented directories (not in known structure)
- Required directories present
- Structure consistency

Usage:
    python3 scripts/validate_structure.py [--fix]

Options:
    --fix    Automatically remove empty directories (except allowed)
    --quiet  Suppress informational output

Exit codes:
    0 - Structure is valid
    1 - Validation errors found
    2 - Script error (missing dependencies, etc.)

Author: ai_workflow_core team
Version: 1.0.2
Last Updated: 2026-01-31
"""

import os
import sys
import argparse
from pathlib import Path
from typing import List, Set, Tuple

# ============================================================================
# CONFIGURATION
# ============================================================================

# Required top-level directories that must exist
REQUIRED_DIRS = [
    'config',
    'docs',
    'examples',
    'scripts',
    'workflow-templates',
    '.github',
]

# Known/documented directories (from copilot-instructions.md)
KNOWN_STRUCTURE = {
    '.github',                          # GitHub metadata
    '.ai_workflow',                     # Workflow artifacts (for dogfooding)
    '.ai_workflow/backlog',
    '.ai_workflow/summaries',
    '.ai_workflow/logs',
    '.ai_workflow/metrics',
    '.ai_workflow/checkpoints',
    '.ai_workflow/prompts',
    '.ai_workflow/ml_models',
    '.ai_workflow/.incremental_cache',
    'config',                           # Configuration templates
    'docs',                             # Documentation
    'docs/api',                         # API references
    'docs/guides',                      # User guides
    'docs/advanced',                    # Advanced guides
    'docs/developers',                  # Developer guides
    'docs/diagrams',                    # Visual aids and diagrams
    'docs/misc',                        # Documentation tracking
    'examples',                         # Language integration examples
    'examples/shell',                   # Shell integration
    'examples/nodejs',                  # Node.js integration
    'scripts',                          # Utility scripts
    'workflow-templates',               # GitHub workflow templates
    'workflow-templates/workflows',     # Workflow YAML files
}

# Directories that are allowed to be empty
ALLOWED_EMPTY_DIRS = {
    '.ai_workflow',                     # May be empty initially
    '.ai_workflow/backlog',
    '.ai_workflow/summaries',
    '.ai_workflow/logs',
    '.ai_workflow/metrics',
    '.ai_workflow/checkpoints',
    '.ai_workflow/prompts',
    '.ai_workflow/ml_models',
    '.ai_workflow/.incremental_cache',
    'docs/misc',                        # May have tracking files only
}

# Directories to exclude from scanning
EXCLUDED_DIRS = {
    '.git',                             # Git metadata
    'node_modules',                     # Node.js dependencies
    '__pycache__',                      # Python cache
    '.venv',                            # Python virtual environment
    'venv',
    '.pytest_cache',                    # Pytest cache
    '.mypy_cache',                      # MyPy cache
}


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def get_project_root() -> Path:
    """Get the project root directory (where this script's parent is)."""
    script_path = Path(__file__).resolve()
    return script_path.parent.parent


def is_directory_empty(path: Path) -> bool:
    """Check if directory is empty (no files, only subdirectories allowed)."""
    try:
        items = list(path.iterdir())
        # Empty if no items
        if not items:
            return True
        # Empty if only contains empty subdirectories
        return all(item.is_dir() and is_directory_empty(item) for item in items)
    except PermissionError:
        return False


def get_all_directories(root: Path, exclude: Set[str]) -> List[Path]:
    """Get all directories in root, excluding specified patterns."""
    directories = []
    
    def scan_directory(current_path: Path):
        try:
            for item in current_path.iterdir():
                if not item.is_dir():
                    continue
                
                # Skip excluded directories
                if item.name in exclude:
                    continue
                
                # Get relative path from root
                rel_path = item.relative_to(root)
                
                # Skip if parent is excluded
                if any(part in exclude for part in rel_path.parts):
                    continue
                
                directories.append(item)
                scan_directory(item)
                
        except PermissionError:
            pass
    
    scan_directory(root)
    return directories


# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

def check_required_directories(root: Path, quiet: bool = False) -> Tuple[bool, List[str]]:
    """Check that all required directories exist."""
    issues = []
    
    for req_dir in REQUIRED_DIRS:
        dir_path = root / req_dir
        if not dir_path.exists():
            issues.append(f"Missing required directory: {req_dir}/")
        elif not dir_path.is_dir():
            issues.append(f"Required path is not a directory: {req_dir}")
    
    if not quiet and not issues:
        print("✅ All required directories present")
    
    return len(issues) == 0, issues


def check_empty_directories(root: Path, quiet: bool = False) -> Tuple[bool, List[str]]:
    """Check for empty directories that shouldn't be empty."""
    issues = []
    all_dirs = get_all_directories(root, EXCLUDED_DIRS)
    
    for dir_path in all_dirs:
        rel_path = dir_path.relative_to(root)
        rel_path_str = str(rel_path)
        
        # Skip allowed empty directories
        if rel_path_str in ALLOWED_EMPTY_DIRS:
            continue
        
        if is_directory_empty(dir_path):
            issues.append(f"Empty directory: {rel_path_str}/")
    
    if not quiet:
        if not issues:
            print("✅ No unexpected empty directories")
        else:
            print(f"⚠️  Found {len(issues)} unexpected empty directories")
    
    return len(issues) == 0, issues


def check_undocumented_directories(root: Path, quiet: bool = False) -> Tuple[bool, List[str]]:
    """Check for directories not in the known structure."""
    issues = []
    all_dirs = get_all_directories(root, EXCLUDED_DIRS)
    
    for dir_path in all_dirs:
        rel_path = dir_path.relative_to(root)
        rel_path_str = str(rel_path)
        
        # Check if this directory or any parent is in known structure
        is_known = False
        current = rel_path_str
        
        while current:
            if current in KNOWN_STRUCTURE:
                is_known = True
                break
            # Check parent
            parent = str(Path(current).parent)
            if parent == '.' or parent == current:
                break
            current = parent
        
        if not is_known:
            issues.append(f"Undocumented directory: {rel_path_str}/")
    
    if not quiet:
        if not issues:
            print("✅ All directories documented in known structure")
        else:
            print(f"⚠️  Found {len(issues)} undocumented directories")
    
    return len(issues) == 0, issues


def remove_empty_directories(root: Path, quiet: bool = False) -> int:
    """Remove empty directories (except allowed ones)."""
    removed_count = 0
    all_dirs = get_all_directories(root, EXCLUDED_DIRS)
    
    # Sort by depth (deepest first) to handle nested empty directories
    all_dirs_sorted = sorted(all_dirs, key=lambda p: len(p.parts), reverse=True)
    
    for dir_path in all_dirs_sorted:
        rel_path = dir_path.relative_to(root)
        rel_path_str = str(rel_path)
        
        # Skip allowed empty directories
        if rel_path_str in ALLOWED_EMPTY_DIRS:
            continue
        
        if is_directory_empty(dir_path):
            try:
                dir_path.rmdir()
                removed_count += 1
                if not quiet:
                    print(f"  Removed: {rel_path_str}/")
            except Exception as e:
                if not quiet:
                    print(f"  Failed to remove {rel_path_str}/: {e}")
    
    return removed_count


# ============================================================================
# MAIN VALIDATION
# ============================================================================

def validate_structure(root: Path, fix: bool = False, quiet: bool = False) -> int:
    """
    Validate repository structure.
    
    Args:
        root: Project root directory
        fix: If True, automatically remove empty directories
        quiet: If True, suppress informational output
    
    Returns:
        0 if valid, 1 if issues found, 2 if error
    """
    if not quiet:
        print("=" * 70)
        print("AI Workflow Core - Structure Validation")
        print("=" * 70)
        print(f"Root: {root}")
        print()
    
    all_valid = True
    all_issues = []
    
    # Check 1: Required directories
    if not quiet:
        print("[1/3] Checking required directories...")
    valid, issues = check_required_directories(root, quiet)
    all_valid = all_valid and valid
    all_issues.extend(issues)
    if not quiet:
        print()
    
    # Check 2: Empty directories
    if not quiet:
        print("[2/3] Checking for empty directories...")
    valid, issues = check_empty_directories(root, quiet)
    all_valid = all_valid and valid
    all_issues.extend(issues)
    
    if fix and issues:
        if not quiet:
            print("\n🔧 Fixing: Removing empty directories...")
        removed = remove_empty_directories(root, quiet)
        if not quiet:
            print(f"✅ Removed {removed} empty directories")
        # Re-check after fix
        valid, issues = check_empty_directories(root, quiet=True)
        all_valid = all_valid and valid
    
    if not quiet:
        print()
    
    # Check 3: Undocumented directories
    if not quiet:
        print("[3/3] Checking for undocumented directories...")
    valid, issues = check_undocumented_directories(root, quiet)
    all_valid = all_valid and valid
    all_issues.extend(issues)
    if not quiet:
        print()
    
    # Summary
    if not quiet:
        print("=" * 70)
        if all_valid:
            print("✅ Structure validation PASSED")
            print()
            print("Repository structure is clean and documented.")
        else:
            print("❌ Structure validation FAILED")
            print()
            print(f"Found {len(all_issues)} issues:")
            for issue in all_issues:
                print(f"  • {issue}")
            print()
            if not fix:
                print("Tip: Run with --fix to automatically remove empty directories")
        print("=" * 70)
    
    return 0 if all_valid else 1


# ============================================================================
# COMMAND LINE INTERFACE
# ============================================================================

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Validate ai_workflow_core directory structure',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Validate structure
  python3 scripts/validate_structure.py

  # Validate and fix empty directories
  python3 scripts/validate_structure.py --fix

  # Quiet mode (only errors)
  python3 scripts/validate_structure.py --quiet

Exit codes:
  0 - Structure is valid
  1 - Validation errors found
  2 - Script error
        """
    )
    
    parser.add_argument(
        '--fix',
        action='store_true',
        help='Automatically remove empty directories (except allowed)'
    )
    
    parser.add_argument(
        '--quiet',
        action='store_true',
        help='Suppress informational output (only show errors)'
    )
    
    parser.add_argument(
        '--version',
        action='version',
        version='validate_structure.py 1.0.2'
    )
    
    args = parser.parse_args()
    
    try:
        root = get_project_root()
        exit_code = validate_structure(root, fix=args.fix, quiet=args.quiet)
        sys.exit(exit_code)
    
    except KeyboardInterrupt:
        print("\n\n⚠️  Validation interrupted by user")
        sys.exit(2)
    
    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        if not args.quiet:
            import traceback
            traceback.print_exc()
        sys.exit(2)


if __name__ == '__main__':
    main()
