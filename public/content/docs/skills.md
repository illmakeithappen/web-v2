# Skills

**Skills are reusable capabilities that give AI consistent, repeatable behavior.**

A skill is a focused set of instructions that teaches AI how to do something specific. Once loaded, the AI can apply the skill whenever relevant - formatting code a certain way, analyzing data with a specific framework, or generating content in a particular style.

## What are Skills?

Skills are:
- **Concentrated instructions** - A single document encoding expertise
- **Context-aware** - AI applies them when the situation matches
- **Composable** - Multiple skills can work together
- **Portable** - Same skill works across sessions and tools

## Why Use Skills?

### Benefits
- **Consistency** - Get the same quality output every time
- **Efficiency** - Stop re-explaining the same requirements
- **Expertise capture** - Turn tribal knowledge into reusable assets
- **Team alignment** - Everyone uses the same standards

### Common Use Cases
- **Code formatting** - Enforce style guides automatically
- **Documentation** - Generate consistent README structures
- **Analysis** - Apply frameworks systematically (SWOT, risk assessment)
- **Content creation** - Maintain brand voice across outputs
- **Review processes** - Standardize code review checklists

## Skill Architecture

```
┌─────────────────────────────────────────────┐
│              SKILL FILE (SKILL.md)           │
├─────────────────────────────────────────────┤
│  Frontmatter (metadata)                      │
│  - name, description, tags                   │
│  - when to invoke                            │
│  - version, author                           │
├─────────────────────────────────────────────┤
│  Instructions                                │
│  - What the skill does                       │
│  - How to apply it                           │
│  - Output format                             │
│  - Examples                                  │
└─────────────────────────────────────────────┘
         │
         │ (optional)
         ▼
┌─────────────────────────────────────────────┐
│              REFERENCES FOLDER               │
├─────────────────────────────────────────────┤
│  guides/       - How-to documentation        │
│  examples/     - Sample inputs/outputs       │
│  standards/    - Format specifications       │
│  patterns/     - Reusable templates          │
│  prompts/      - Supporting prompt fragments │
└─────────────────────────────────────────────┘
```

## Skill Anatomy

Every skill follows the same structure:

```yaml
---
name: Skill Name
description: What this skill enables
version: 1.0.0
author: Your Name
tags: [category, domain, type]
invoke_when: |
  Description of when AI should apply this skill
---

# Skill Name

Brief overview of what this skill does and why it exists.

## Instructions

Detailed instructions for the AI:
- What to look for
- How to process information
- What output to produce

## Output Format

Specify the expected output structure:
- Headers to include
- Sections to cover
- Formatting rules

## Examples

### Input Example
```
Show sample input
```

### Output Example
```
Show expected output
```

## Notes

Additional context, edge cases, or considerations.
```

## Types of Skills

### Formatting Skills
Transform content into specific formats.
- Markdown style guides
- Code formatting rules
- Documentation templates

### Analysis Skills
Apply frameworks to evaluate information.
- SWOT analysis
- Risk assessment
- Code review checklists

### Generation Skills
Create content following specific patterns.
- README generators
- API documentation
- Commit message formatters

### Process Skills
Guide multi-step operations.
- Deployment procedures
- Review workflows
- Testing strategies

## Building Effective Skills

### Key Principles

1. **Single Purpose** - One skill, one job
2. **Clear Triggers** - Specify exactly when to apply
3. **Concrete Examples** - Show, don't just tell
4. **Measurable Output** - Define what "correct" looks like
5. **Iteration** - Refine based on actual usage

### Common Mistakes

- **Too broad** - Skills that try to do everything do nothing well
- **Too vague** - "Write good code" isn't actionable
- **No examples** - AI learns best from concrete samples
- **Missing edge cases** - Consider what happens in unusual situations

## Skills vs Other Concepts

| Feature | Skills | Workflows | MCP Servers | Subagents |
|---------|--------|-----------|-------------|-----------|
| **Purpose** | Shape AI behavior | Guide processes | Connect tools | Delegate tasks |
| **Persistence** | Loaded into context | Used per process | Always available | Per-task |
| **Complexity** | Single capability | Multi-step | System integration | Agent orchestration |
| **Output** | Consistent format | Completed task | Data/actions | Specialized results |

### Skills vs MCP Servers

**Skills** tell AI *how* to think and format. **MCP servers** give AI *what* to access. A skill might tell AI how to write SQL queries; an MCP server actually executes them.

### Skills vs Subagents

**Skills** are instructions loaded into the main AI. **Subagents** are separate AI instances for specific tasks. Skills modify behavior; subagents delegate work.

## Resources in This Section

Browse the skill entries below to find:
- **Guides** - How to build effective skills
- **Examples** - Real-world skill implementations
- **Standards** - Best practices and patterns
- **Templates** - Starting points for common skill types
- **Prompts** - Reusable prompt fragments

---

**Ready to create your first skill?** Select an entry from the navigation to learn from examples, or use **Cmd+K** to search for specific topics.
