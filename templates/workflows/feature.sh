#!/bin/bash
# Feature Workflow Template
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKFLOW_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "🚀 Feature Development Workflow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Full workflow | Duration: ~15-20 min | Auto-commit: enabled"
echo ""

"${WORKFLOW_ROOT}/src/workflow/execute_tests_docs_workflow.sh" \
    --smart-execution \
    --parallel \
    --auto-commit \
    "$@"
