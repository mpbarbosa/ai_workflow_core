#!/usr/bin/env bash
#
# run_tests_docker.sh - Run the test suite inside a Docker container
#
# Usage:
#   ./scripts/run_tests_docker.sh [SUITE]
#
# Suites:
#   all        Run all tests: Jest + Python validators (default)
#   jest       Run Jest (TypeScript) tests only
#   validate   Run Python validator scripts only
#
# Examples:
#   ./scripts/run_tests_docker.sh
#   ./scripts/run_tests_docker.sh jest
#   ./scripts/run_tests_docker.sh validate
#
# Author: AI Workflow Automation
# Version: 1.0.0

set -euo pipefail

readonly GREEN='\033[0;32m'
readonly RED='\033[0;31m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

SUITE="${1:-all}"

print_color() { echo -e "${1}${2}${NC}"; }

usage() {
    cat << EOF
Usage: $(basename "$0") [SUITE]

Suites:
  all        Run all tests: Jest + Python validators (default)
  jest       Run Jest (TypeScript) tests only
  validate   Run Python validator scripts only

EOF
    exit 0
}

case "$SUITE" in
    all)      CMD="npm run test:all" ;;
    jest)     CMD="npm test" ;;
    validate) CMD="npm run validate:helpers" ;;
    -h|--help) usage ;;
    *)
        print_color "$RED" "Error: Unknown suite '${SUITE}'. Use: all, jest, validate"
        exit 1
        ;;
esac

print_color "$BLUE" "========================================="
print_color "$BLUE" "Docker Test Runner — ai_workflow_core"
print_color "$BLUE" "========================================="
print_color "$YELLOW" "Suite  : ${SUITE}"
print_color "$YELLOW" "Command: ${CMD}"
echo ""

cd "$REPO_ROOT"

if ! command -v docker &>/dev/null; then
    print_color "$RED" "Error: docker is not installed or not in PATH."
    exit 1
fi

if docker compose version &>/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &>/dev/null; then
    COMPOSE_CMD="docker-compose"
else
    print_color "$RED" "Error: neither 'docker compose' nor 'docker-compose' found."
    exit 1
fi

print_color "$BLUE" "Building test image..."
$COMPOSE_CMD build test

echo ""
print_color "$BLUE" "Running tests..."
echo ""

if $COMPOSE_CMD run --rm test $CMD; then
    echo ""
    print_color "$GREEN" "========================================="
    print_color "$GREEN" "✅ Tests passed!"
    print_color "$GREEN" "========================================="
else
    echo ""
    print_color "$RED" "========================================="
    print_color "$RED" "❌ Tests failed."
    print_color "$RED" "========================================="
    exit 1
fi
