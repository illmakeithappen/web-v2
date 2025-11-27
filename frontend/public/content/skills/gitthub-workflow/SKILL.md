---
# Basic Identity
name: gitthub-workflow
skill_id: gitthub-workflow
description: |
  Generate comprehensive, actionable gitthub workflows for complex tasks using a two-phase approach (conversational outline followed by structured expansion).
  This skill should be used when users say "create a gitthub workflow to..." or want to create step-by-step workflows to navigate/compare approaches, learn concepts progressively, or deploy/implement systems.
  Creates detailed workflows with clear instructions and deliverables, saved to vault-website/workflows directory.

# Classification
skill_type: workflow-generation
category: automation
difficulty: intermediate
language: markdown

# Metadata
author: Claude
created_date: 2025-11-15
last_modified: 2025-11-18
version: "1.1"
status: active

# Usage Information
estimated_time: 15-30 minutes
agent: claude.ai, claude desktop, claude code
model: claude-sonnet-4-5

# Organization
tags:
  - workflow-generation
  - automation
  - structured-output
  - two-phase-approach
  - discovery
  - user-guidance

# Requirements
prerequisites:
  - Understanding of workflow types (navigate/educate/deploy)
  - Access to vault-website/workflows directory for saving outputs
  - Familiarity with conversational discovery process

tools_required:
  - WebSearch (for researching best practices)
  - AskUserQuestion (for sequential discovery in Claude Code)
  - File writing capabilities (for saving workflows)

# References
references:
  - references/navigate-guide.md
  - references/educate-guide.md
  - references/deploy-guide.md
  - references/workflow-format-spec.md
  - references/reference-handling.md
  - references/skill-recommendations.md
  - references/best-practices.md

# Analytics
usage_count: 0

# Marketplace Integration
organization: gitthub
repository: https://github.com/gitthub-org/skills/tree/main/gitthub-workflow
homepage: https://gitthub.org/doc?section=skills&skill=gitthub-workflow
license: MIT
keywords:
  - workflow
  - automation
  - documentation
  - github
  - structured-guidance
  - conversational-design
  - progressive-learning
compatibility:
  - "Claude Code"
  - "Claude.ai"
  - "Claude API"
installation_method: plugin
---
# Gitthub Workflow Generator

Generate comprehensive, actionable workflows through sequential discovery, iterative refinement, and structured expansion.

---

## When to Use

- User says "create a gitthub workflow to..."
- User wants structured guidance for complex tasks
- User needs to compare approaches, learn concepts, or deploy systems

**Example triggers:**
- "Create a gitthub workflow to compare database options"
- "Create a gitthub workflow to learn Docker"
- "Create a gitthub workflow to deploy my app on Render"

---

## Workflow Types

1. **Navigate** - Comparison and decision-making (6-8 steps, 90-120 min)
   - Read: `references/navigate-guide.md`

2. **Educate** - Progressive learning (6-8 steps, 90-120 min)
   - Read: `references/educate-guide.md`

3. **Deploy** - Implementation and deployment (8-12 steps, variable time)
   - Read: `references/deploy-guide.md`

---

## The User Journey (12 Steps)

### Phase 1: Discovery & Outline

**1. Analyze Invocation**
- Use `<thinking>` to understand the request
- Extract one-line description for YAML `description` field

**2. Determine Type**
- Classify as navigate, educate, or deploy
- Keywords: compare/choose → navigate, learn/understand → educate, deploy/build → deploy

**3. Sequential Discovery Questions**

**CRITICAL:** Question flow depends on agent platform:
- **Claude.ai/Desktop:** Ask questions ONE AT A TIME sequentially
- **Claude Code:** Batch using AskUserQuestion tool

Ask exactly 7 questions:
1. **Proficiency:** beginner/intermediate/advanced → `difficulty`
2. **References:** file paths, URLs, attachments, skills → `references` array
3. **Context:** 2-3 sentences about goal → `context`
4-7. **Type-specific:** 4 discovery questions based on workflow type

**4. Research Best Practices**
- Use WebSearch for current approaches and best practices

**5. Read Type Guide**
- Load appropriate guide: navigate-guide.md, educate-guide.md, or deploy-guide.md

**6. Generate Draft Outline**
- Create 6-12 step outline based on discoveries
- Present to user: "Here's a draft outline. What would you like to change?"

**7. Refinement Loop**
- Iterate based on feedback until user approves

### Phase 2: Analysis & Expansion

**8. Finalization Analysis**
- **Reference Mapping:** Identify which references apply to which steps
- **Skill Recommendations:** Analyze for 1-3 skill opportunities based on workflow patterns and reference content

**9. Expand to Detailed Steps**
- Read `references/workflow-format-spec.md`
- Each step needs:
  - **Instruction:** 3-5 lines, starts with action verb, cites references
    - **If step uses a recommended skill:** Add inline note at end offering to create skill first
    - Format: "*Note: This step would benefit from the [skill-name] skill. Say 'Help me create the [skill-name] skill' to build it first, or continue with [manual approach].*"
  - **Deliverable:** 10-20 words, tangible outcome
  - **Uses:** Tools, references, skills used in this step
- **Skill Mapping:** Map workflow-level recommended skills to relevant steps
  - Review each recommended skill's purpose/rationale
  - Identify which steps would use or benefit from that skill
  - Add to those steps' "Uses:" section under "Skills: skill-name"
  - Add inline creation prompt to instruction text (see format above)
  - Example: Step 7 deployment → add brand-guideline-applier to Uses + inline prompt in instruction

**10. Generate YAML Frontmatter**
- Use structure from `vault-web/references/WORKFLOW Blueprint.md`
- Include: description, type, difficulty, references, context, skills, tools, steps

**11. Add Completion Section**

Create three subsections following `workflow-format-spec.md`:

**Workflow Completion:**
- List 5-7 major outcomes with ✅ checkmarks
- Add final outcome summary

**Tips for Success:**
- Provide 5-8 practical tips specific to this workflow type

**Next Steps After Workflow:**
- List 3-5 concrete next actions
- **IF skills were recommended in frontmatter:** Add as numbered step:
  - "**Create recommended skills for reuse:**"
  - List each skill with its rationale and prompt: "Say: 'Help me create the [skill-name] skill'"
  - Example: "**brand-guideline-applier** (for applying client brand PDFs) - Say: 'Help me create the brand-guideline-applier skill'"

**12. Present Complete Workflow**
- Show complete markdown
- Storage instructions: `vault-website/workflows/workflow_YYYYMMDD_NNN_title.md`
- **DO NOT save yourself** - let user save it

---

## Critical Requirements

**Step Format:**
- Instructions: 3-5 lines max (NOT 10+)
- Deliverables: 10-20 words, tangible artifacts
- Always specify Claude/Claude Code usage

**Discovery:**
- Detect agent platform for question flow
- Ask ALL 7 questions (proficiency, references, context, + 4 type-specific)

**References & Skills:**
- Map references to specific steps
- Recommend 1-3 skills with rationale
- Base recommendations on workflow analysis and reference content

**Quality:**
- Target: Enthusiastic computer users (not professional developers)
- Simple, approachable language
- Progressive flow to final goal

---

## YAML Frontmatter Template

```yaml
---
description: [one sentence from invocation]
author: [name or "Claude"]
category: workflow
type: navigate | educate | deploy
difficulty: beginner | intermediate | advanced
references:
  - [file paths, URLs, attachments, skill references]
context: |
  [2-3 sentences: goal, how references relate, constraints]
title: [generated title]
agent: claude.ai | claude desktop | claude code
model: claude-sonnet-4-5
created_date: YYYY-MM-DD
last_modified: YYYY-MM-DD
workflow_id: YYYYMMDD_HHMMSS_author_category
status: not started yet
tools:
  - [non-obvious tools with rationale]
skills:
  - [skills to use/develop with rationale]
steps:
  - [step titles]
estimated_time: [based on type]
total_steps: [number]
---
```

---

## Resources

**Type Guides:**
- `references/navigate-guide.md` - Navigate workflow system prompt
- `references/educate-guide.md` - Educate workflow system prompt
- `references/deploy-guide.md` - Deploy workflow system prompt

**Supporting Guides:**
- `references/workflow-format-spec.md` - Complete format specification
- `references/reference-handling.md` - Reference collection and mapping
- `references/skill-recommendations.md` - Skill analysis and suggestions
- `references/best-practices.md` - Detailed best practices

**Examples:**
- `references/examples/example-navigate.md`
- `references/examples/example-educate.md`
- `references/examples/example-deploy.md`

**External:**
- `vault-web/references/WORKFLOW Blueprint.md` - YAML structure
- `vault-web/references/workflow journey.md` - Complete user journey

---

## Quick Execution Flow

**Invocation** → **Determine type** → **Ask 7 questions** → **Draft outline** → **Refine with user** → **Map references** → **Recommend skills** → **Expand steps** → **Generate YAML** → **Present to user**

---

This skill creates high-quality workflows through structured discovery, iterative refinement, and comprehensive formatting.
