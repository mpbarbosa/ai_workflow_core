# Documentation Diagrams and Visual Aids

**Version**: 1.0.0  
**Last Updated**: 2026-02-07  
**Audience**: Documentation contributors and visual learners

> **Purpose**: Collection of diagrams, flowcharts, and visual aids to enhance understanding of ai_workflow_core. These diagrams use text-based formats (Mermaid, ASCII art, PlantUML) that render in GitHub and other markdown viewers.

---

## Table of Contents

- [Architecture Diagrams](#architecture-diagrams)
- [Integration Flow Diagrams](#integration-flow-diagrams)
- [Directory Structure Visualizations](#directory-structure-visualizations)
- [Workflow Diagrams](#workflow-diagrams)
- [CI/CD Pipeline Diagrams](#cicd-pipeline-diagrams)
- [Decision Trees](#decision-trees)
- [Sequence Diagrams](#sequence-diagrams)
- [How to Use These Diagrams](#how-to-use-these-diagrams)
- [Creating New Diagrams](#creating-new-diagrams)

---

## Architecture Diagrams

### System Overview

```mermaid
graph TB
    subgraph "Your Project"
        A[Project Repository]
        B[.workflow-config.yaml]
        C[.ai_workflow/ directory]
        D[Source Code]
        E[Tests]
    end
    
    subgraph "ai_workflow_core (Submodule)"
        F[.workflow_core/]
        G[config/ templates]
        H[scripts/ utilities]
        I[docs/ guides]
        J[examples/]
    end
    
    subgraph "External Systems"
        K[CI/CD Platform]
        L[Parent ai_workflow<br/>Execution Engine]
    end
    
    A --> F
    A --> B
    A --> C
    B -.reads config.-> G
    D --> E
    K -.triggers.-> A
    L -.optional.-> A
    
    style F fill:#e1f5ff
    style G fill:#ffe1e1
    style B fill:#fff4e1
```

**Description**: Shows the relationship between your project, ai_workflow_core submodule, and external systems.

---

### Template System Architecture

```mermaid
graph LR
    A[Template Files<br/>.workflow_core/config/] --> B[Copy & Customize]
    B --> C[Your Project<br/>.workflow-config.yaml]
    C --> D[Replace<br/>Placeholders]
    D --> E[Validated Config]
    E --> F[Use in Scripts<br/>& Workflows]
    
    G[project_kinds.yaml] -.defines rules.-> E
    H[Validation Scripts] -.check against.-> E
    
    style A fill:#ffe1e1
    style C fill:#fff4e1
    style E fill:#e1ffe1
```

**Description**: Illustrates the template customization flow from ai_workflow_core to your project.

---

### Configuration Layer Model

```mermaid
graph TD
    subgraph "Layer 1: Core Templates"
        A[project_kinds.yaml<br/>8 project types]
        B[.workflow-config.yaml.template<br/>Placeholders]
        C[ai_helpers.yaml<br/>AI personas]
    end
    
    subgraph "Layer 2: Project Config"
        D[.workflow-config.yaml<br/>Customized]
        E[Custom Workflows]
    end
    
    subgraph "Layer 3: Runtime"
        F[CI/CD Jobs]
        G[Local Scripts]
        H[Automation Tools]
    end
    
    A --> D
    B --> D
    C -.guides.-> D
    D --> F
    D --> G
    D --> H
    E --> F
    E --> G
    
    style A fill:#ffe1e1
    style B fill:#ffe1e1
    style C fill:#ffe1e1
    style D fill:#fff4e1
    style F fill:#e1ffe1
    style G fill:#e1ffe1
    style H fill:#e1ffe1
```

**Description**: Three-layer architecture showing how templates flow to runtime execution.

---

## Integration Flow Diagrams

### Initial Setup Flow

```mermaid
flowchart TD
    Start([Start]) --> A{Git repo<br/>initialized?}
    A -->|No| B[git init]
    A -->|Yes| C[Add submodule]
    B --> C
    C --> D[git submodule add<br/>ai_workflow_core]
    D --> E[Copy template]
    E --> F[cp .workflow-config.yaml.template<br/>.workflow-config.yaml]
    F --> G[Edit config]
    G --> H{All placeholders<br/>replaced?}
    H -->|No| I[Replace {{PLACEHOLDERS}}<br/>with actual values]
    I --> H
    H -->|Yes| J[Create artifact dirs]
    J --> K[mkdir -p .ai_workflow/...]
    K --> L[Update .gitignore]
    L --> M[Commit changes]
    M --> End([Setup Complete])
    
    style Start fill:#e1f5ff
    style End fill:#e1ffe1
    style H fill:#fff4e1
    style I fill:#ffe1e1
```

**Description**: Complete setup flow from initialization to commit.

---

### Configuration Flow

```mermaid
sequenceDiagram
    participant User
    participant Template as .workflow-config.yaml.template
    participant Config as .workflow-config.yaml
    participant Validator as yamllint
    participant ProjectKinds as project_kinds.yaml
    participant Script as CI/CD Script
    
    User->>Template: Copy template
    Template-->>Config: Create .workflow-config.yaml
    User->>Config: Replace placeholders
    User->>Validator: yamllint .workflow-config.yaml
    Validator-->>User: Syntax OK
    Script->>Config: Read configuration
    Config-->>Script: project.kind = "nodejs_api"
    Script->>ProjectKinds: Lookup validation rules
    ProjectKinds-->>Script: Rules for nodejs_api
    Script->>Script: Apply rules & execute
```

**Description**: Sequence of events from template to execution.

---

### Submodule Update Flow

```mermaid
flowchart LR
    A[Check current<br/>version] --> B{Update<br/>available?}
    B -->|No| C[No action needed]
    B -->|Yes| D[Create feature<br/>branch]
    D --> E[cd .workflow_core]
    E --> F[git fetch --tags]
    F --> G[git checkout<br/>v1.1.0]
    G --> H[cd ..]
    H --> I[Test integration]
    I --> J{Tests<br/>pass?}
    J -->|No| K[Fix issues or<br/>rollback]
    J -->|Yes| L[git add<br/>.workflow_core]
    L --> M[Commit & push]
    
    style B fill:#fff4e1
    style J fill:#fff4e1
    style K fill:#ffe1e1
    style M fill:#e1ffe1
```

**Description**: Safe submodule update process with testing.

---

## Directory Structure Visualizations

### Standard Project Structure

```
project-root/
│
├── .workflow_core/              # 🔹 Git submodule
│   ├── config/                  # Template configurations
│   │   ├── .workflow-config.yaml.template
│   │   ├── project_kinds.yaml
│   │   └── ai_helpers.yaml
│   ├── scripts/                 # Utility script templates
│   ├── docs/                    # Documentation
│   └── examples/                # Integration examples
│
├── .ai_workflow/                # 🔸 Generated artifacts (gitignored)
│   ├── backlog/                 # Execution reports
│   ├── summaries/               # AI summaries
│   ├── logs/                    # Execution logs
│   ├── metrics/                 # Performance metrics
│   ├── checkpoints/             # Resume points
│   ├── prompts/                 # AI prompt logs (optional commit)
│   ├── ml_models/               # ML models (optional commit)
│   └── .incremental_cache/      # Incremental processing cache
│
├── .workflow-config.yaml        # 🔹 Customized config (committed)
├── .gitignore                   # Includes .ai_workflow/ patterns
├── .gitmodules                  # Submodule configuration
│
├── src/                         # Your source code
├── tests/                       # Your tests
├── docs/                        # Your documentation
└── README.md                    # Your project README
```

**Legend**:
- 🔹 **Blue** = Files to commit to Git
- 🔸 **Orange** = Generated files (usually gitignored)

---

### Multi-Language Project Structure

```
monorepo/
│
├── .workflow_core/              # Submodule (shared config)
├── .workflow-config.yaml        # Root configuration
│
├── backend/                     # 🐍 Python service
│   ├── src/
│   ├── tests/
│   └── requirements.txt
│
├── frontend/                    # ⚛️  React SPA
│   ├── src/
│   ├── tests/
│   └── package.json
│
├── api-gateway/                 # 🟢 Node.js gateway
│   ├── src/
│   ├── tests/
│   └── package.json
│
├── shared/                      # 📦 Shared code
│   ├── types/                   # TypeScript types
│   └── utils/                   # Utilities
│
└── .ai_workflow/                # Shared artifacts
    ├── logs/
    │   ├── backend/
    │   ├── frontend/
    │   └── api-gateway/
    └── metrics/
```

---

### Artifact Directory Deep Dive

```
.ai_workflow/
│
├── backlog/                     # 📋 Execution reports & dev artifacts
│   ├── session_20260207_143022.json
│   ├── task_analysis.md
│   └── feature_implementation.md
│
├── summaries/                   # 📝 AI-generated summaries
│   ├── daily_summary_20260207.md
│   └── weekly_summary_2026W06.md
│
├── logs/                        # 📊 Execution logs
│   ├── workflow_20260207_143022.log
│   ├── test_results.xml
│   └── build_20260207.log
│
├── metrics/                     # 📈 Performance metrics
│   ├── test_coverage.json
│   ├── build_time_series.json
│   └── deployment_metrics.json
│
├── checkpoints/                 # 💾 Resume points
│   ├── deploy_20260207_step3.json
│   └── migration_20260207_checkpoint.json
│
├── prompts/                     # 🤖 AI prompt logs (optional commit)
│   ├── doc_generation_prompts.json
│   └── test_generation_prompts.json
│
├── ml_models/                   # 🧠 ML models (optional commit)
│   ├── code_classifier_v1.pkl
│   └── test_generator_model/
│
└── .incremental_cache/          # ⚡ Incremental cache (gitignored)
    ├── file_hashes.json
    └── dependency_graph.json
```

---

## Workflow Diagrams

### Standard Development Workflow

```mermaid
flowchart TD
    A[Feature Request] --> B[Create Branch]
    B --> C[Local Development]
    C --> D[Run Tests Locally]
    D --> E{Tests Pass?}
    E -->|No| C
    E -->|Yes| F[Commit Changes]
    F --> G[Push to Remote]
    G --> H[CI/CD Triggered]
    H --> I[Lint Code]
    I --> J[Run Tests]
    J --> K[Build Artifacts]
    K --> L{All Checks Pass?}
    L -->|No| M[Fix Issues]
    M --> C
    L -->|Yes| N[Create PR]
    N --> O[Code Review]
    O --> P{Approved?}
    P -->|No| Q[Address Feedback]
    Q --> C
    P -->|Yes| R[Merge to Main]
    R --> S[Deploy to Staging]
    S --> T{Staging OK?}
    T -->|No| U[Rollback]
    T -->|Yes| V[Deploy to Production]
    
    style A fill:#e1f5ff
    style V fill:#e1ffe1
    style E fill:#fff4e1
    style L fill:#fff4e1
    style P fill:#fff4e1
    style T fill:#fff4e1
```

---

### Deployment Workflow

```mermaid
stateDiagram-v2
    [*] --> Development
    Development --> Staging: Merge to develop
    Staging --> PreProduction: Manual promotion
    PreProduction --> Production: Manual approval
    Production --> [*]: Deployed
    
    Production --> Rollback: Issues detected
    Rollback --> PreProduction: Fix & redeploy
    
    note right of Development
        Auto-deploy on commit
        Run: lint, test, build
    end note
    
    note right of Staging
        Auto-deploy from develop
        Integration tests
    end note
    
    note right of PreProduction
        Manual gate
        Load testing
    end note
    
    note right of Production
        Manual approval required
        Blue-green deployment
    end note
```

---

### Test Workflow Hierarchy

```mermaid
graph TB
    A[Developer] --> B[Write Code]
    B --> C[Unit Tests<br/>Fast, Isolated]
    C --> D{Pass?}
    D -->|No| B
    D -->|Yes| E[Integration Tests<br/>Components Together]
    E --> F{Pass?}
    F -->|No| B
    F -->|Yes| G[E2E Tests<br/>Full System]
    G --> H{Pass?}
    H -->|No| B
    H -->|Yes| I[Performance Tests<br/>Load & Stress]
    I --> J{Pass?}
    J -->|No| K[Optimize]
    K --> B
    J -->|Yes| L[Ready to Deploy]
    
    style C fill:#e1f5ff
    style E fill:#e1f0ff
    style G fill:#e1e5ff
    style I fill:#e1daff
    style L fill:#e1ffe1
```

---

## CI/CD Pipeline Diagrams

### GitHub Actions Pipeline

```mermaid
graph LR
    A[Push/PR] --> B[Checkout Code<br/>with Submodules]
    B --> C[Read Config<br/>.workflow-config.yaml]
    C --> D[Setup Environment<br/>Node/Python/Go]
    D --> E[Install Dependencies<br/>npm/pip/go mod]
    E --> F[Run Linter<br/>from config]
    F --> G[Run Tests<br/>from config]
    G --> H[Build<br/>if required]
    H --> I{Branch?}
    I -->|develop| J[Deploy to Staging]
    I -->|main| K[Deploy to Production]
    I -->|feature/*| L[Preview Deploy]
    
    style A fill:#e1f5ff
    style C fill:#fff4e1
    style J fill:#ffe1e1
    style K fill:#e1ffe1
    style L fill:#f0e1ff
```

---

### Multi-Platform CI/CD

```mermaid
graph TB
    subgraph "Source Control"
        A[Git Push]
    end
    
    subgraph "GitHub Actions"
        B1[Job: Lint]
        B2[Job: Test]
        B3[Job: Build]
    end
    
    subgraph "GitLab CI"
        C1[Stage: Lint]
        C2[Stage: Test]
        C3[Stage: Build]
    end
    
    subgraph "Jenkins"
        D1[Stage: Lint]
        D2[Stage: Test]
        D3[Stage: Build]
    end
    
    subgraph "All Read Same Config"
        E[.workflow-config.yaml<br/>Single Source of Truth]
    end
    
    A --> B1 & C1 & D1
    B1 & C1 & D1 --> E
    E --> B2 & C2 & D2
    B2 & C2 & D2 --> B3 & C3 & D3
    
    style E fill:#fff4e1
```

**Description**: How different CI/CD platforms use the same configuration.

---

## Decision Trees

### Choosing Project Kind

```mermaid
graph TD
    Start{What type of<br/>project?}
    
    Start -->|Scripts| A{Primary<br/>language?}
    A -->|Bash/Shell| B[shell_script_automation]
    
    Start -->|Web App| C{Frontend<br/>framework?}
    C -->|React| D[react_spa]
    C -->|Vanilla JS| E[client_spa]
    C -->|Static HTML| F[static_website]
    
    Start -->|Backend| G{Language?}
    G -->|Node.js| H[nodejs_api]
    G -->|Python| I[python_app]
    
    Start -->|Config/Templates| J[configuration_library]
    
    Start -->|Other| K[generic]
    
    style B fill:#e1ffe1
    style D fill:#e1ffe1
    style E fill:#e1ffe1
    style F fill:#e1ffe1
    style H fill:#e1ffe1
    style I fill:#e1ffe1
    style J fill:#e1ffe1
    style K fill:#ffe1e1
```

---

### Troubleshooting Decision Tree

```mermaid
graph TD
    A[Problem?] --> B{Type?}
    
    B -->|Submodule| C{.workflow_core<br/>empty?}
    C -->|Yes| D[git submodule<br/>update --init]
    C -->|No| E{Shows as<br/>modified?}
    E -->|Yes| F[git submodule<br/>update]
    
    B -->|Config| G{YAML<br/>error?}
    G -->|Yes| H[yamllint<br/>.workflow-config.yaml]
    G -->|No| I{Placeholders<br/>remain?}
    I -->|Yes| J[Replace all<br/>{{PLACEHOLDERS}}]
    
    B -->|Tests| K{Tests<br/>fail?}
    K -->|Yes| L[Check test_command<br/>in config]
    
    B -->|Deployment| M{Deploy<br/>fails?}
    M -->|Yes| N[Check credentials<br/>& permissions]
    
    style D fill:#e1ffe1
    style F fill:#e1ffe1
    style H fill:#e1ffe1
    style J fill:#e1ffe1
    style L fill:#e1ffe1
    style N fill:#e1ffe1
```

---

## Sequence Diagrams

### User Integration Sequence

```mermaid
sequenceDiagram
    actor User
    participant Git
    participant Submodule as .workflow_core
    participant Template as .yaml.template
    participant Config as .workflow-config.yaml
    participant CI as CI/CD
    
    User->>Git: git init
    User->>Git: git submodule add ai_workflow_core
    Git->>Submodule: Clone submodule
    Submodule-->>Git: Cloned
    
    User->>Template: Copy template
    Template->>Config: Create config file
    
    User->>Config: Edit & replace placeholders
    Config-->>User: Configuration ready
    
    User->>Git: git add & commit
    User->>Git: git push
    
    Git->>CI: Trigger pipeline
    CI->>Submodule: Load submodule
    CI->>Config: Read configuration
    Config-->>CI: project_kind, test_command
    CI->>CI: Execute tests & build
    CI-->>User: Pipeline result
```

---

### Multi-Language Test Execution

```mermaid
sequenceDiagram
    participant CI as CI/CD Runner
    participant Config as .workflow-config.yaml
    participant Backend as Python Backend
    participant Frontend as React Frontend
    participant CLI as Go CLI
    participant Report as Test Reports
    
    CI->>Config: Read configuration
    Config-->>CI: Multi-language detected
    
    par Parallel Testing
        CI->>Backend: pytest
        Backend-->>Report: Python results
    and
        CI->>Frontend: npm test
        Frontend-->>Report: JavaScript results
    and
        CI->>CLI: go test
        CLI-->>Report: Go results
    end
    
    Report->>CI: Aggregate results
    CI->>CI: All passed?
    alt All tests pass
        CI->>CI: Continue to build
    else Any test fails
        CI->>CI: Fail pipeline
    end
```

---

### Deployment Approval Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git
    participant CI as CI/CD
    participant Staging
    participant Approver
    participant Production
    
    Dev->>Git: Push to main
    Git->>CI: Trigger pipeline
    CI->>CI: Run tests & build
    CI->>Staging: Auto-deploy
    Staging-->>CI: Health check OK
    
    CI->>Approver: Request approval
    Note over Approver: Manual review
    
    alt Approved
        Approver->>CI: Approve deployment
        CI->>Production: Deploy
        Production-->>CI: Deployment complete
        CI->>Dev: Notify success
    else Rejected
        Approver->>CI: Reject
        CI->>Dev: Notify rejection
    end
```

---

## How to Use These Diagrams

### In Documentation

**Include diagrams in markdown**:

````markdown
## Architecture

The following diagram shows the system architecture:

```mermaid
graph TD
    A[Your Project] --> B[ai_workflow_core]
    B --> C[Configuration]
```
````

### Viewing Diagrams

**Platforms that render Mermaid**:
- ✅ GitHub (native support)
- ✅ GitLab (native support)
- ✅ VS Code (with Mermaid extension)
- ✅ Markdown Preview Enhanced
- ✅ Obsidian
- ✅ Notion

**Export as images**:
1. Use [Mermaid Live Editor](https://mermaid.live/)
2. Paste diagram code
3. Export as PNG/SVG

### In Presentations

**Convert to slides**:
```bash
# Using Marp
marp diagram.md -o diagram.pdf

# Using reveal.js
pandoc diagram.md -t revealjs -o diagram.html
```

---

## Creating New Diagrams

### Mermaid Syntax Basics

**Flowchart**:
```mermaid
graph TD
    A[Start] --> B[Process]
    B --> C{Decision}
    C -->|Yes| D[End]
    C -->|No| A
```

**Sequence Diagram**:
```mermaid
sequenceDiagram
    Alice->>Bob: Hello
    Bob-->>Alice: Hi
```

**State Diagram**:
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Active: start
    Active --> [*]: stop
```

**Class Diagram**:
```mermaid
classDiagram
    class Project {
        +String name
        +String kind
        +test()
    }
```

---

### ASCII Art for Simple Diagrams

**Box and Arrow**:
```
┌─────────────┐
│   Project   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Config    │
└─────────────┘
```

**Tree Structure**:
```
project/
├── src/
│   ├── main.js
│   └── lib/
│       └── utils.js
└── tests/
    └── main.test.js
```

---

### PlantUML (Alternative to Mermaid)

**Component Diagram**:
```plantuml
@startuml
[Your Project] --> [ai_workflow_core]
[ai_workflow_core] --> [Configuration]
@enduml
```

**Use Case Diagram**:
```plantuml
@startuml
actor User
User --> (Setup Project)
User --> (Run Tests)
User --> (Deploy)
@enduml
```

---

### Tools for Creating Diagrams

**Online Tools**:
- [Mermaid Live Editor](https://mermaid.live/) - Mermaid diagrams
- [PlantUML Online](http://www.plantuml.com/plantuml/) - PlantUML diagrams
- [Excalidraw](https://excalidraw.com/) - Hand-drawn style
- [Draw.io](https://app.diagrams.net/) - General diagrams

**Command-line Tools**:
```bash
# Install mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Generate diagram
mmdc -i diagram.mmd -o diagram.png

# Install PlantUML
sudo apt install plantuml

# Generate diagram
plantuml diagram.puml
```

**VS Code Extensions**:
- Mermaid Preview
- PlantUML
- Markdown Preview Mermaid Support
- Draw.io Integration

---

## Diagram Best Practices

### 1. Keep It Simple
- ❌ Don't: Include every detail
- ✅ Do: Show key components and relationships
- ✅ Do: Create multiple simple diagrams vs one complex diagram

### 2. Use Consistent Styling
```mermaid
graph TD
    A[User Action]
    B[System Process]
    C[External System]
    D[Decision Point]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1e1
    style D fill:#f0e1ff
```

**Color key**:
- 🔵 Blue: User actions
- 🟡 Yellow: System processes
- 🔴 Red: External systems
- 🟣 Purple: Decision points

### 3. Add Context
- Include diagram title
- Add legend when needed
- Provide description below diagram
- Explain non-obvious symbols

### 4. Make It Accessible
- Use text-based formats (Mermaid, PlantUML)
- Provide alt text for images
- Use high contrast colors
- Include text description for screen readers

### 5. Version Control
- Store diagrams as code (`.mmd`, `.puml` files)
- Track changes in Git
- Include generation date in comments
- Document diagram dependencies

---

## Contributing Diagrams

### Submission Guidelines

1. **Use text-based format** (Mermaid preferred)
2. **Place in `docs/diagrams/` directory**
3. **Follow naming convention**: `diagram-name.mmd` or `diagram-name.md`
4. **Include metadata**:
   ```markdown
   <!-- 
   Title: Architecture Overview
   Author: username
   Date: 2026-02-07
   Purpose: Show system components
   -->
   ```

5. **Update this index** with link to new diagram

### Diagram Checklist

- [ ] Diagram serves clear purpose
- [ ] Uses Mermaid or PlantUML syntax
- [ ] Renders correctly on GitHub
- [ ] Includes title and description
- [ ] Uses consistent styling
- [ ] Referenced in appropriate documentation
- [ ] Source code committed (`.mmd` file)

---

## Resources

### Documentation
- [Mermaid Documentation](https://mermaid.js.org/)
- [PlantUML Guide](https://plantuml.com/guide)
- [GitHub Mermaid Support](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/)

### Tools
- [Mermaid Live Editor](https://mermaid.live/)
- [PlantUML Online](http://www.plantuml.com/plantuml/)
- [Excalidraw](https://excalidraw.com/)
- [ASCII Flow](https://asciiflow.com/) - ASCII diagrams

### Examples
- **This document** - Various diagram types
- `docs/ARCHITECTURE.md` - Architecture diagrams
- `docs/INTEGRATION.md` - Integration flow diagrams

---

**Last Updated**: 2026-02-07  
**Document Version**: 1.0.0  
**Total Diagrams**: 20+ examples

