#!/bin/bash
set -euo pipefail

################################################################################
# Error Handling Template
# Purpose: Standard error handling patterns for workflow scripts
# Usage: Source this file or copy the patterns into your scripts
################################################################################

# Exit codes
readonly EXIT_SUCCESS=0
readonly EXIT_GENERAL_ERROR=1
readonly EXIT_INVALID_ARGUMENT=2
readonly EXIT_MISSING_DEPENDENCY=3
readonly EXIT_FILE_NOT_FOUND=4
readonly EXIT_PERMISSION_DENIED=5

# Error handling function
error() {
    local msg="${1:-Unknown error}"
    local exit_code="${2:-${EXIT_GENERAL_ERROR}}"
    echo "ERROR: ${msg}" >&2
    exit "${exit_code}"
}

# Warning function
warn() {
    local msg="${1:-Unknown warning}"
    echo "WARNING: ${msg}" >&2
}

# Info function
info() {
    local msg="${1}"
    echo "INFO: ${msg}"
}

# Debug function (only prints if DEBUG env var is set)
debug() {
    if [[ "${DEBUG:-0}" == "1" ]]; then
        local msg="${1}"
        echo "DEBUG: ${msg}" >&2
    fi
}

# Trap handler for cleanup
cleanup() {
    local exit_code=$?
    debug "Cleanup handler called with exit code: ${exit_code}"
    # Add cleanup logic here
    # Remove temporary files, restore state, etc.
}

# Set trap for cleanup on exit
trap cleanup EXIT

# Require command exists
require_command() {
    local cmd="${1}"
    local package="${2:-${cmd}}"
    
    if ! command -v "${cmd}" &> /dev/null; then
        error "Required command '${cmd}' not found. Install '${package}' first." "${EXIT_MISSING_DEPENDENCY}"
    fi
    debug "Command '${cmd}' is available"
}

# Require file exists
require_file() {
    local file="${1}"
    local description="${2:-file}"
    
    if [[ ! -f "${file}" ]]; then
        error "Required ${description} not found: ${file}" "${EXIT_FILE_NOT_FOUND}"
    fi
    debug "File '${file}' exists"
}

# Require directory exists
require_directory() {
    local dir="${1}"
    local description="${2:-directory}"
    
    if [[ ! -d "${dir}" ]]; then
        error "Required ${description} not found: ${dir}" "${EXIT_FILE_NOT_FOUND}"
    fi
    debug "Directory '${dir}' exists"
}

# Safe command execution with error handling
safe_exec() {
    local cmd="${1}"
    shift
    local args=("$@")
    
    debug "Executing: ${cmd} ${args[*]}"
    
    if ! "${cmd}" "${args[@]}"; then
        error "Command failed: ${cmd} ${args[*]}" "${EXIT_GENERAL_ERROR}"
    fi
}

# Example usage in a script:
# source "$(dirname "${BASH_SOURCE[0]}")/templates/error_handling.sh"
# require_command "git"
# require_file "package.json" "configuration file"
# safe_exec npm install
