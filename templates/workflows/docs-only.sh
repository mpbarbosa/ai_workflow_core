#!/bin/bash
# Documentation-Only Workflow Template
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKFLOW_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "📝 Documentation-Only Workflow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Steps: 0,1,2,4,12 | Duration: ~3-4 min | Auto-commit: enabled"
echo ""

"${WORKFLOW_ROOT}/src/workflow/execute_tests_docs_workflow.sh" \
    --steps 0,1,2,4,12 \
    --smart-execution \
    --parallel \
    --auto-commit \
    "$@"
