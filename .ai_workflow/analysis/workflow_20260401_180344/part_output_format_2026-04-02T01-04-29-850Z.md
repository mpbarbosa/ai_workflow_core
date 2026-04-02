# Part Analysis: OUTPUT FORMAT

**Run:** workflow_20260401_180344  
**Section:** OUTPUT FORMAT  
**Generated:** 2026-04-02T01:04:29.862Z

---

## Alignment Score: 9/10

## Summary
The OUTPUT FORMAT section provides clear, actionable instructions for reviewers to deliver TypeScript code corrections, justifications, and severity flags. The format is technically sound and matches best practices for code review. The instructions are precise and relevant for TypeScript, but could be slightly improved for clarity and completeness.

## Findings
- The section correctly specifies fenced code blocks with the `typescript` tag, which matches standard markdown and TypeScript documentation practices.
- Severity flagging (🔴, 🟡, 🟢) is well-defined and actionable.
- The section instructs reviewers to note breaking changes, which is important for downstream consumers.
- No direct references to files or APIs in the codebase, so no risk of outdated or incorrect file references.

## Suggestions
1. Clarify that each change justification should be concise (e.g., "one sentence per change").
2. Suggest including line numbers or code context when possible for easier downstream application.
3. Add a note to avoid speculative type changes unless evidence of unsafety is present.
4. Optionally, provide an example output for reviewers to emulate.