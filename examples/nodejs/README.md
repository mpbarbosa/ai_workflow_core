# Node.js Integration Example

🟡 **Complexity: Compact** - Essential patterns for quick setup

This example shows how to integrate `ai_workflow_core` into a Node.js project with best practices for dynamic codebases.

## Quick Start

```bash
# Initialize project
mkdir my_nodejs_project && cd my_nodejs_project
git init
npm init -y

# Add submodule (pinned to specific version)
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
cd .workflow_core && git checkout v1.0.2 && cd ..
git submodule update --init --recursive

# Copy and customize configuration
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml
# Edit .workflow-config.yaml with your project details

# Create directory structure
mkdir -p .ai_workflow/{backlog,summaries,logs,metrics,checkpoints,prompts,ml_models,.incremental_cache}

# Update .gitignore
cat >> .gitignore << 'EOF'

# AI Workflow artifacts
.ai_workflow/backlog/
.ai_workflow/summaries/
.ai_workflow/logs/
.ai_workflow/metrics/
.ai_workflow/checkpoints/
.ai_workflow/.incremental_cache/
EOF
```

## Version Management

This example demonstrates **version pinning** strategy for production systems.

```
my_nodejs_project/
├── .workflow_core/              # ai_workflow_core submodule
├── .ai_workflow/                # Workflow artifacts directory
├── .workflow-config.yaml        # Customized workflow config
├── .gitignore                   # Includes workflow and node_modules
├── package.json                 # Node.js configuration
├── src/
│   └── index.js                # Your source code
├── tests/
│   └── index.test.js           # Test files
├── docs/
│   └── README.md               # Documentation
└── README.md
```

## Setup Steps

### 1. Initialize Your Project

```bash
mkdir my_nodejs_project
cd my_nodejs_project
git init
npm init -y
```

### 2. Add ai_workflow_core Submodule

```bash
git submodule add https://github.com/mpbarbosa/ai_workflow_core.git .workflow_core
git submodule update --init --recursive
```

### 3. Copy and Customize Configuration

```bash
# Copy workflow config
cp .workflow_core/config/.workflow-config.yaml.template .workflow-config.yaml

# Append workflow patterns to gitignore
cat .workflow_core/config/.gitignore.template >> .gitignore

# Create workflow directory
cp -r .workflow_core/ai_workflow .ai_workflow
```

### 4. Configure for Node.js

Edit `.workflow-config.yaml`:

```yaml
project:
  name: "My Node.js App"
  type: "nodejs-application"
  description: "Node.js application with workflow automation"
  kind: "nodejs_api"
  version: "1.0.2"

tech_stack:
  primary_language: "javascript"
  build_system: "npm"
  test_framework: "jest"
  test_command: "npm test"
  lint_command: "eslint ."

structure:
  source_dirs:
    - src
  test_dirs:
    - tests
  docs_dirs:
    - docs
```

### 5. Install Dependencies

```bash
# Install Jest for testing
npm install --save-dev jest

# Install ESLint for linting
npm install --save-dev eslint

# Initialize ESLint
npx eslint --init
```

### 6. Configure package.json

Update `package.json`:

```json
{
  "name": "my-nodejs-project",
  "version": "1.0.2",
  "description": "Node.js application with workflow automation",
  "main": "src/index.js",
  "scripts": {
    "test": "jest",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "start": "node src/index.js"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "src/**/*.js"
    ]
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "jest": "^29.0.0"
  }
}
```

### 7. Create Project Structure

```bash
mkdir -p src tests docs

# Create sample source file
cat > src/index.js << 'EOF'
/**
 * Greet a person by name
 * @param {string} name - Name to greet
 * @returns {string} Greeting message
 */
function greet(name = 'World') {
    return `Hello, ${name}!`;
}

module.exports = { greet };

// Run if called directly
if (require.main === module) {
    const name = process.argv[2];
    console.log(greet(name));
}
EOF

# Create test file
cat > tests/index.test.js << 'EOF'
const { greet } = require('../src/index');

describe('greet', () => {
    test('greets with default name', () => {
        expect(greet()).toBe('Hello, World!');
    });

    test('greets with custom name', () => {
        expect(greet('Alice')).toBe('Hello, Alice!');
    });

    test('handles empty string', () => {
        expect(greet('')).toBe('Hello, !');
    });
});
EOF
```

### 8. Create README

```bash
cat > README.md << 'EOF'
# My Node.js Project

Node.js application with workflow automation.

## Installation

```bash
git clone <your-repo-url>
cd my_nodejs_project
git submodule update --init --recursive
npm install
```

## Usage

```bash
node src/index.js
node src/index.js Alice
```

## Testing

```bash
npm test
npm test -- --coverage  # With coverage
```

## Linting

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

## Workflow Integration

This project uses [ai_workflow_core](https://github.com/mpbarbosa/ai_workflow_core) for workflow automation.

Configuration: `.workflow-config.yaml`  
Artifacts: `.ai_workflow/`

## Scripts

- `npm start` - Run the application
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues
EOF
```

### 9. Optional: VS Code Integration

```bash
cp -r .workflow_core/config/.vscode .vscode
```

### 10. Optional: GitHub Integration

```bash
mkdir -p .github
cp -r .workflow_core/workflow-templates/workflows .github/

# Customize for Node.js
# Edit .github/workflows/*.yml
```

### 11. Commit Changes

```bash
git add .
git commit -m "Initial commit with ai_workflow_core integration"
```

## Usage

### Running the Application

```bash
npm start
# or
node src/index.js Alice
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- tests/index.test.js
```

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Workflow Artifacts

Artifacts are stored in `.ai_workflow/`:
- `backlog/` - Execution reports
- `summaries/` - AI summaries
- `logs/` - Detailed logs
- `metrics/` - Performance metrics
- `checkpoints/` - Resume points

## Customization

Edit `.workflow-config.yaml` to customize:
- Project name and description
- Test commands
- Lint commands
- Build system
- Directory structure

## Best Practices

1. Keep source code in `src/` directory
2. Keep tests in `tests/` directory with `.test.js` or `.spec.js` suffix
3. Use meaningful variable and function names
4. Write JSDoc comments for functions
5. Maintain high test coverage (>80%)
6. Follow ESLint rules consistently
7. Use semantic versioning
8. **Pin submodule to specific version tags for production**
9. **Run health checks before deployments**
10. **Update submodule only through tested PRs**

## Version Management Best Practices

### For Production

```bash
# Always pin to tags
cd .workflow_core && git checkout v1.0.2 && cd ..

# Never track branches in production
# Bad: git checkout main
# Good: git checkout v1.0.2
```

### For Development

```bash
# Can track main branch for latest features
cd .workflow_core && git checkout main && cd ..
git config -f .gitmodules submodule.workflow_core.branch main
```

### Regular Maintenance

```bash
# Weekly health check (add to CI/CD)
bash .workflow_core/scripts/check_integration_health.sh

# Monthly version review
cd .workflow_core && git fetch --tags && git tag -l && cd ..
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/integration-check.yml`:

```yaml
name: Integration Check

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run health check
        run: |
          bash .workflow_core/scripts/check_integration_health.sh
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint
```

## Dependencies

- **Jest**: Testing framework
- **ESLint**: Linting and code style
- **ai_workflow_core**: Workflow automation

## Resources

- [ai_workflow_core Documentation](../../README.md)
- [Integration Guide](../../docs/INTEGRATION.md)
- [Version Management Guide](../../docs/guides/VERSION_MANAGEMENT.md) - **Essential for dynamic codebases**
- [Integration Best Practices](../../docs/guides/INTEGRATION_BEST_PRACTICES.md) - **Maintenance strategies**
- [Jest Documentation](https://jestjs.io/)
- [ESLint Documentation](https://eslint.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Integration Strategy**: Version pinning with quarterly updates  
**Last Updated**: 2026-01-29  
**Example Version**: 1.1.0
