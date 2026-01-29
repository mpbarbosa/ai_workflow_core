# Templates

## Purpose
Reusable code templates and patterns for workflow scripts.

## Contents

### error_handling.sh
Standard error handling patterns including:
- Exit code constants
- Error/warning/info/debug functions
- Cleanup trap handlers
- Dependency checking functions
- Safe command execution wrappers

## Usage

### In a new script:
```bash
#!/bin/bash
set -euo pipefail

# Source the error handling template
source "$(dirname "${BASH_SOURCE[0]}")/../templates/error_handling.sh"

# Use the functions
require_command "git"
require_file "package.json" "configuration file"
info "Starting process..."
```

### Copy patterns into existing scripts:
Copy relevant functions and patterns directly into your script when you need specific error handling capabilities.

## Best Practices

1. Always use `set -euo pipefail` at the top of shell scripts
2. Use descriptive error messages
3. Use appropriate exit codes
4. Add cleanup handlers with trap
5. Check for required dependencies early
6. Use debug logging for troubleshooting
