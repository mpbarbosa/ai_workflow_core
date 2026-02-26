# User Guides

**Purpose**: Step-by-step guides and how-to documentation for users of ai_workflow_core.

## What Belongs Here

✅ **User-focused guides**:
- Quick start guides
- Setup tutorials
- Migration procedures
- Troubleshooting guides
- FAQs
- Best practices
- Integration guides

❌ **What does NOT belong here**:
- API references (→ `docs/api/`)
- Developer contributions (→ `docs/developers/`)
- Advanced customization (→ `docs/advanced/`)
- Visual diagrams (→ `docs/diagrams/`)

## Current Files

| File | Description | Lines |
|------|-------------|-------|
| [QUICK_START.md](QUICK_START.md) | 5-minute setup guide | 387 |
| [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) | Version upgrade procedures | 650 |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 25+ solutions across 8 categories | 787 |
| [FAQ.md](FAQ.md) | 40+ questions answered | 782 |
| [STRUCTURE_VALIDATION_TUTORIAL.md](STRUCTURE_VALIDATION_TUTORIAL.md) | Structure validation setup | 638 |
| [INTEGRATION_BEST_PRACTICES.md](INTEGRATION_BEST_PRACTICES.md) | Integration recommendations | (existing) |
| [VERSION_MANAGEMENT.md](VERSION_MANAGEMENT.md) | Version management strategies | (existing) |
| [PROJECT_REFERENCE.md](PROJECT_REFERENCE.md) ⚠️ | Parent project reference | (existing) |
| [ML_OPTIMIZATION_GUIDE.md](ML_OPTIMIZATION_GUIDE.md) ⚠️ | Parent project ML guide | (existing) |
| [MULTI_STAGE_PIPELINE_GUIDE.md](MULTI_STAGE_PIPELINE_GUIDE.md) ⚠️ | Parent project pipelines | (existing) |

**Total**: 10 files, 3,000+ lines

⚠️ Files marked with warning reference parent ai_workflow project features (not ai_workflow_core)

## Adding New User Guides

When adding new user guides to this directory:

1. **Name the file**: `<TOPIC>_GUIDE.md` or `<TOPIC>.md` (e.g., `TESTING_GUIDE.md`, `FAQ.md`)
2. **Follow the structure**:
   ```markdown
   # Guide Title
   
   **Version**: 1.0.1
   **Last Updated**: YYYY-MM-DD
   **Audience**: Beginners/Intermediate/Advanced
   
   > **Purpose**: One-line description of what user will learn
   
   ## Table of Contents
   ## Prerequisites
   ## Step-by-Step Instructions
   ## Common Issues
   ## Next Steps
   ```
3. **Update this README**: Add your file to the table above
4. **Link appropriately**: Update main README.md and related docs
5. **Focus on HOW**: Explain how to accomplish tasks, not just what things are

## Style Guidelines

- **Conversational tone**: Write like teaching a colleague
- **Step-by-step**: Break complex tasks into numbered steps
- **Examples**: Show real commands and expected output
- **Troubleshooting**: Include common errors and solutions
- **Visual aids**: Use code blocks, tables, diagrams
- **Prerequisites**: List what users need before starting
- **Next steps**: Guide users to related documentation

## Guide Types

### Quick Start Guides
- Goal: Get users running in < 10 minutes
- Structure: Prerequisites → Setup → Verification → Next Steps
- Example: QUICK_START.md

### Migration Guides
- Goal: Update between versions safely
- Structure: Changes → Backup → Upgrade → Validate → Rollback
- Example: MIGRATION_GUIDE.md

### Troubleshooting Guides
- Goal: Solve common problems quickly
- Structure: Problem categories → Symptoms → Solutions → Prevention
- Example: TROUBLESHOOTING.md

### FAQ Documents
- Goal: Answer common questions quickly
- Structure: Categories → Q&A pairs → Related docs
- Example: FAQ.md

### Tutorial Guides
- Goal: Teach a specific skill step-by-step
- Structure: Learning objectives → Prerequisites → Steps → Practice → Summary
- Example: STRUCTURE_VALIDATION_TUTORIAL.md

## Good vs. Not-So-Good Examples

**✅ Good user guide**:
- "How to integrate ai_workflow_core in 5 minutes"
- "Troubleshooting submodule errors"
- "FAQ: Common configuration questions"
- "Step-by-step: Setting up pre-commit hooks"

**❌ Not user guide** (belongs elsewhere):
- "Configuration field reference" → `docs/api/CONFIG_REFERENCE.md`
- "Template authoring specification" → `docs/developers/`
- "CI/CD advanced patterns" → `docs/advanced/`
- "Architecture decision records" → `docs/ARCHITECTURE.md`

---

**Last Updated**: 2026-02-07
