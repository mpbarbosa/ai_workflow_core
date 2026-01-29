#!/bin/bash
# Test-Only Workflow Template
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKFLOW_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "🧪 Test-Only Workflow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Steps: 0,5,6,7,9 | Duration: ~8-10 min | Auto-commit: enabled"
echo ""

"${WORKFLOW_ROOT}/src/workflow/execute_tests_docs_workflow.sh" \
    --steps 0,5,6,7,9 \
    --smart-execution \
    --parallel \
    --auto-commit \
    "$@"
