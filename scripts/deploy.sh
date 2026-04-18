#!/usr/bin/env bash
#
# deploy.sh - Merge prompt templates, validate, and publish ai_workflow_core to npm
#
# Usage:
#   ./scripts/deploy.sh [npm-publish-args...]
#
# Examples:
#   ./scripts/deploy.sh
#   ./scripts/deploy.sh --tag next
#
# Requirements:
#   - NPM_TOKEN must be set to an npm Automation token
#

set -euo pipefail

readonly GREEN='\033[0;32m'
readonly RED='\033[0;31m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

TEMP_NPMRC=''

print_color() { echo -e "${1}${2}${NC}"; }

usage() {
    cat << EOF
Usage: $(basename "$0") [npm-publish-args...]

Merges prompt templates, validates the repository, and publishes the package to npm.

Environment:
  NPM_TOKEN   Required npm Automation token used for publishing

Examples:
  $(basename "$0")
  $(basename "$0") --tag next
EOF
    exit 0
}

cleanup() {
    if [[ -n "${TEMP_NPMRC}" && -f "${TEMP_NPMRC}" ]]; then
        rm -f "${TEMP_NPMRC}"
    fi
}

trap cleanup EXIT

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    usage
fi

if ! command -v npm &>/dev/null; then
    print_color "$RED" "Error: npm is not installed or not in PATH."
    exit 1
fi

if [[ -z "${NPM_TOKEN:-}" ]]; then
    print_color "$RED" "Error: NPM_TOKEN is not set."
    print_color "$YELLOW" "Set NPM_TOKEN to an npm Automation token before deploying."
    exit 1
fi

TEMP_NPMRC="$(mktemp "${TMPDIR:-/tmp}/ai_workflow_core-npmrc.XXXXXX")"
chmod 600 "${TEMP_NPMRC}"

cat > "${TEMP_NPMRC}" << EOF
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
registry=https://registry.npmjs.org/
always-auth=true
EOF

print_color "$BLUE" "========================================="
print_color "$BLUE" "Deploying ai_workflow_core"
print_color "$BLUE" "========================================="
print_color "$YELLOW" "Repository: ${REPO_ROOT}"
if [[ "$#" -gt 0 ]]; then
    print_color "$YELLOW" "npm args  : $*"
fi
echo ""

cd "${REPO_ROOT}"

print_color "$BLUE" "Running lint..."
npm run lint
echo ""

print_color "$BLUE" "Building TypeScript sources..."
npm run build
echo ""

print_color "$BLUE" "Running test suite..."
npm test
echo ""

print_color "$BLUE" "Merging prompt templates..."
npm run build:helpers
echo ""

print_color "$BLUE" "Validating merged prompt templates..."
npm run validate:helpers
echo ""

print_color "$BLUE" "Publishing to npm..."
NPM_CONFIG_USERCONFIG="${TEMP_NPMRC}" npm publish "$@"
echo ""

print_color "$GREEN" "========================================="
print_color "$GREEN" "✅ Deployment completed successfully."
print_color "$GREEN" "========================================="
