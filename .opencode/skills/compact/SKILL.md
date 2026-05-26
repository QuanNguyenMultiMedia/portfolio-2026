---
name: compact
description: Generates a compact .md handoff document summarizing the current codebase state, key decisions, and next steps for another agent to continue working seamlessly.
---

# Compact Handoff Skill

When invoked, this skill produces a markdown handoff file (`HANDOFF.md`) containing:

## Required Sections

1. **Project State** — One-line summary of the overall status
2. **Active Work** — What was just being worked on, why, and what approach was taken
3. **Key Files Changed** — Paths + one-line description of each change
4. **Current Issues** — Any unresolved bugs, regressions, or known problems
5. **Next Steps** — The exact next thing another agent should do, in order
6. **Architecture Decisions** — Any tradeoffs or design choices made that affect future work
7. **Quick Reference** — Commands to build, lint, dev, test

## Rules

- Keep the file UNDER 100 lines — this is a "compact" handoff
- Use headings, lists, and code blocks — no prose paragraphs
- Include file paths with line references for changed code
- Be honest about what's broken; don't hide caveats
- Assume the next agent has NO context from this conversation

## Output

Write the file to `HANDOFF.md` in the project root.
