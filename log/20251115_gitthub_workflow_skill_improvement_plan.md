# Gitthub Workflow Skill Improvement Plan

**Date:** 2025-11-15
**Purpose:** Comprehensive architecture and improvement roadmap for the gitthub-workflow skill based on best practices research

---

## Executive Summary

The gitthub-workflow skill currently has **428 lines in SKILL.md** which violates the progressive disclosure principle. Based on research into prompt engineering best practices (2025) and Anthropic's Agent Skills architecture, the main improvement is to **modularize the skill using progressive disclosure** by moving detailed content to references and creating focused system prompts for each workflow type.

---

## Research Findings: Best Practices

### 1. Progressive Disclosure (Anthropic's Core Principle)
- **Level 1:** Metadata (name + description) - ~100 tokens, always loaded
- **Level 2:** SKILL.md body - <5k words (~6,000 tokens), loaded when skill triggers
- **Level 3:** References - Unlimited, loaded only as needed by Claude

**Current Problem:** SKILL.md is 428 lines with extensive procedural details, examples, and templates that should be in references.

### 2. System Prompts Best Practices (2025)
- **Clarity & Specificity:** Explicit guidelines and requirements
- **Structured Output:** Define exact format expectations upfront
- **Step-by-Step Instructions:** Break complex tasks into manageable parts
- **Examples & Few-Shot Prompting:** Show rather than tell
- **Delimiters:** Clear boundaries for instructions, examples, parameters

**Current Problem:** Workflow type guides (navigate/educate/deploy) are too brief (59-62 lines) and lack structured system prompt format.

### 3. Modular Architecture
- **Single Responsibility:** Each reference file has one clear purpose
- **Composability:** References can be loaded independently or together
- **Token Efficiency:** No context penalty for bundled content that isn't used

**Current Strength:** Skill already has good separation (SKILL.md + 6 reference files).

---

## Current Architecture Analysis

### File Structure
```
gitthub-workflow/
├── SKILL.md (428 lines) ⚠️ TOO LARGE
├── references/
│   ├── navigate-guide.md (59 lines) ⚠️ TOO BRIEF
│   ├── educate-guide.md (61 lines) ⚠️ TOO BRIEF
│   ├── deploy-guide.md (62 lines) ⚠️ TOO BRIEF
│   ├── example-navigate.md (158 lines) ✅ GOOD
│   ├── example-educate.md (157 lines) ✅ GOOD
│   └── example-deploy.md (210 lines) ✅ GOOD
```

### Problems Identified

#### 1. SKILL.md is Too Large (428 lines)
**Contains:**
- Overview (9 lines) ✅
- When to Use (17 lines) ✅
- Workflow Types (17 lines) ✅
- Two-Phase Process (200+ lines) ⚠️ SHOULD BE IN REFERENCES
- Quality Guidelines (30+ lines) ⚠️ SHOULD BE IN REFERENCES
- Workflow Features (25+ lines) ⚠️ SHOULD BE IN REFERENCES
- Complete Example (50+ lines) ⚠️ DUPLICATES REFERENCES
- Tips for Success (17 lines) ⚠️ SHOULD BE IN REFERENCES
- Resources list (5 lines) ✅

**Issue:** Violates progressive disclosure - loads ~6,000 tokens even when Claude only needs to know "when to trigger" the skill.

#### 2. Workflow Type Guides Are Too Brief (59-62 lines)
**Contains:**
- Brief description (2 lines)
- System prompt instructions (8 lines)
- Characteristics (6 lines)
- Design principles (6 lines)
- Best practices (8 lines)
- Example steps (4 lines)
- Outline generation template (8 lines)

**Issue:** Lacks structured system prompt format, specific output constraints, error handling, validation rules, and comprehensive examples.

#### 3. Lack of Standardized Templates
**Missing:**
- JSON schema for workflow metadata
- Instruction format template with character/line limits
- Deliverable format template
- Step validation checklist
- Common failure patterns and solutions

---

## Improvement Plan

### Phase 1: Restructure SKILL.md (Progressive Disclosure)

**Goal:** Reduce SKILL.md from 428 lines to ~150 lines (~2,000 tokens)

**New SKILL.md Structure:**
```markdown
---
name: gitthub-workflow
description: [KEEP EXISTING]
---

# Gitthub Workflow Generator [~15 lines]
- Overview (what it does)
- When to use this skill (triggers)
- Workflow types (brief 1-sentence each)

## Workflow Generation Process [~20 lines]
- Phase 1: Discovery (read appropriate guide)
- Phase 2: Expansion (read workflow-format-spec.md)
- Phase 3: Save (read file-naming-conventions.md)

## Getting Started [~10 lines]
- How to invoke the skill
- What to expect from the process
- Reference files available

## References [~10 lines]
- List of all reference files with 1-line descriptions
- When Claude should read each file

## Tips for Success [~10 lines]
- Top 5 most critical tips only
- Link to references/best-practices.md for full list
```

**What Moves to References:**
- `references/workflow-generation-process.md` - Full Phase 1 & 2 details
- `references/quality-guidelines.md` - All quality standards
- `references/workflow-format-spec.md` - Complete format template
- `references/best-practices.md` - All 11 tips + detailed explanations
- `references/file-naming-conventions.md` - Naming rules and examples
- `references/common-patterns.md` - Good/bad instruction examples

---

### Phase 2: Enhance Workflow Type Guides (System Prompts)

**Goal:** Transform brief guides (59-62 lines) into comprehensive system prompts (150-200 lines)

**New Structure for Each Guide (navigate-guide.md, educate-guide.md, deploy-guide.md):**

```markdown
# [Type] Workflow System Prompt

## Role & Context
You are an expert workflow designer specializing in [TYPE] workflows.
[2-3 paragraphs defining the role, philosophy, and approach]

## Core Objective
[Single paragraph stating the primary goal]

## Workflow Characteristics
[Existing section - enhanced with examples]

## Step-by-Step Process

### Phase 1: Discovery
1. Analyze user request
2. Identify workflow type
3. Research current best practices (WebSearch)
4. Ask clarification questions (AskUserQuestion tool)
   - [Specific question patterns for this type]
   - [Example AskUserQuestion JSON for this type]

### Phase 2: Outline Generation
1. Read this guide completely
2. Generate 6-8 modules (for navigate/educate) or 8-12 modules (for deploy)
3. Present outline to user
4. Refinement loop

### Phase 3: Expansion
1. Read references/workflow-format-spec.md
2. Expand each module to 1-2 steps
3. Ensure each step has:
   - Action-oriented title
   - 3-5 line instruction
   - Clear deliverable
   - Claude/Claude Code usage specified

## Output Format Specification

### Metadata Requirements
[JSON schema for YAML frontmatter]

### Step Format Template
[Exact template with character/line limits]

### Instruction Guidelines
- Maximum 5 lines
- Start with action verb
- Specify Claude usage
- Include context from user's answers

### Deliverable Guidelines
- Format: _Italicized sentence_
- Length: 10-20 words
- Must be measurable/tangible
- Specific to the step outcome

## [Type]-Specific Best Practices

### For [Navigate/Educate/Deploy]:
1. [Specific practice 1 with example]
2. [Specific practice 2 with example]
3. [Specific practice 3 with example]
...

## Quality Validation Checklist

Before finalizing workflow, verify:
- [ ] Title is clear and specific
- [ ] Description matches actual workflow
- [ ] Type is correct (navigate/educate/deploy)
- [ ] Step count matches type guidelines (6-8 or 8-12)
- [ ] All instructions are 3-5 lines maximum
- [ ] All steps have clear deliverables
- [ ] Claude usage specified in every step
- [ ] Estimated time is realistic
- [ ] Metadata is complete and accurate

## Common Patterns for [Type]

### Excellent Step Examples
[5-10 examples of perfect steps for this type]

### Common Mistakes to Avoid
[5-10 anti-patterns specific to this type]

## Error Handling

### If user request is unclear:
[Specific questions to ask]

### If workflow type mismatch:
[How to suggest alternative type]

### If scope is too large:
[How to break into multiple workflows]

## Examples

### Complete Workflow Example
[Link to example-[type].md]

### Step-by-Step Walkthrough
[Annotated example showing thought process]
```

**Estimated Lines:** ~150-200 per guide (vs. current 59-62)

---

### Phase 3: Create New Reference Files

**New Files to Create:**

#### 1. `references/workflow-format-spec.md` (~100 lines)
- Complete metadata schema (JSON)
- Step format template (exact markdown)
- Deliverable format rules
- Character/line limits for each section
- Validation rules

#### 2. `references/quality-guidelines.md` (~80 lines)
- Workflow-wide standards
- Step-specific standards
- Target audience guidelines
- Language and tone requirements
- Common patterns (moved from SKILL.md)

#### 3. `references/best-practices.md` (~60 lines)
- All 11 tips with detailed explanations
- When to apply each practice
- Examples of each practice in action
- Common pitfalls to avoid

#### 4. `references/workflow-generation-process.md` (~120 lines)
- Complete Phase 1 & 2 details (moved from SKILL.md)
- Extended thinking guidelines
- WebSearch strategies
- AskUserQuestion patterns
- Refinement loop process

#### 5. `references/file-naming-conventions.md` (~30 lines)
- Format: `workflow_YYYYMMDD_NNN_snake_case_title.md`
- Rules for each component
- Examples (good and bad)
- How to determine sequential number

#### 6. `references/common-patterns.md` (~50 lines)
- Good instruction examples (expanded)
- Poor instruction examples (expanded)
- Action verb library
- Claude usage patterns
- Deliverable format examples

---

## Architecture Diagram

### Current Architecture (Flat, Heavy SKILL.md)
```
SKILL.md (428 lines) ──┐
                       ├─→ Claude loads all 428 lines when skill triggers
                       │
references/            │
├── navigate-guide.md  ├─→ Claude reads when generating navigate workflow
├── educate-guide.md   ├─→ Claude reads when generating educate workflow
├── deploy-guide.md    ├─→ Claude reads when generating deploy workflow
├── example-*.md       └─→ Used as reference examples
```

**Problem:** 428 lines (~6,000 tokens) loaded every time, even if user just wants to know when to use the skill.

### Proposed Architecture (Modular, Progressive Disclosure)
```
SKILL.md (~150 lines) ──┐
                        ├─→ Lean orchestration layer
                        │   - When to use
                        │   - High-level process
                        │   - Pointer to references
                        │
references/             │
├── Workflow Type Guides (150-200 lines each)
│   ├── navigate-guide.md    ──→ Comprehensive system prompt
│   ├── educate-guide.md     ──→ Comprehensive system prompt
│   └── deploy-guide.md      ──→ Comprehensive system prompt
│
├── Core References (new)
│   ├── workflow-format-spec.md       ──→ Template & validation
│   ├── quality-guidelines.md         ──→ Standards & requirements
│   ├── best-practices.md             ──→ All tips expanded
│   ├── workflow-generation-process.md ──→ Phase 1 & 2 details
│   ├── file-naming-conventions.md    ──→ Naming rules
│   └── common-patterns.md            ──→ Examples library
│
└── Examples (existing)
    ├── example-navigate.md   ──→ Full workflow example
    ├── example-educate.md    ──→ Full workflow example
    └── example-deploy.md     ──→ Full workflow example
```

**Benefits:**
1. **Initial load:** ~2,000 tokens (vs. 6,000)
2. **Targeted loading:** Claude reads only relevant guide + needed references
3. **Modularity:** Each reference has single responsibility
4. **Scalability:** Easy to add new workflow types or references
5. **Maintainability:** Changes to format don't require updating SKILL.md

---

## Priority Improvements

### Must Do (Critical)
1. ✅ **Add AskUserQuestion tool to SKILL.md** (DONE)
2. ✅ **Add 3-5 line instruction requirement** (DONE)
3. ⚠️ **Refactor SKILL.md to 150 lines** (extract to references)
4. ⚠️ **Enhance workflow type guides to 150-200 lines** (comprehensive system prompts)

### Should Do (High Value)
5. **Create `workflow-format-spec.md`** (JSON schema + templates)
6. **Create `quality-guidelines.md`** (move from SKILL.md)
7. **Create `best-practices.md`** (expand 11 tips with examples)
8. **Create `common-patterns.md`** (move from SKILL.md, expand examples)

### Nice to Have (Enhancement)
9. **Create `workflow-generation-process.md`** (detailed Phase 1 & 2)
10. **Create `file-naming-conventions.md`** (move from SKILL.md)
11. **Add validation checklist to each type guide**
12. **Add error handling section to each type guide**

---

## Manual Editing Guide

### Files You Should Edit Manually

#### Priority 1: Enhance System Prompts (Most Important)

**File:** `references/navigate-guide.md`
**Current:** 59 lines
**Target:** 150-200 lines

**What to Add:**
1. **Role & Context** section (5-10 lines)
   - Define the expert persona
   - Explain navigate philosophy
   - Set expectations for comparative analysis

2. **Step-by-Step Process** section (30-40 lines)
   - Detailed Phase 1: Discovery with AskUserQuestion examples
   - Detailed Phase 2: Outline generation rules
   - Detailed Phase 3: Expansion with format constraints

3. **Output Format Specification** section (20-30 lines)
   - JSON schema for metadata
   - Step template with character limits
   - Instruction format rules (3-5 lines, action verbs)
   - Deliverable format rules (10-20 words, measurable)

4. **Quality Validation Checklist** section (15-20 lines)
   - Pre-flight checks before finalizing workflow
   - Navigate-specific validation rules
   - Step count verification (6-8 steps)
   - Instruction length verification

5. **Common Patterns** section (20-30 lines)
   - 10 excellent navigate step examples
   - 10 common navigate mistakes
   - Navigate-specific action verbs
   - Comparison/tradeoff language patterns

6. **Error Handling** section (10-15 lines)
   - What to do if user request is unclear
   - How to suggest educate or deploy if better fit
   - How to scope down if request is too large

**Copy this structure to:**
- `references/educate-guide.md`
- `references/deploy-guide.md`

---

#### Priority 2: Create Format Specification

**File:** `references/workflow-format-spec.md` (NEW)
**Target:** 100-120 lines

**What to Include:**

1. **Metadata Schema** (30 lines)
```yaml
# Example YAML frontmatter with descriptions
title: "string, 3-8 words, title case"
description: "string, 10-20 words, lowercase, actionable"
type: "navigate | educate | deploy"
difficulty: "beginner | intermediate | advanced"
status: "active | draft | archived"
estimated_time: "string, format: 'X-Y minutes' or 'X hours'"
total_steps: "integer, 6-8 (navigate/educate) or 8-12 (deploy)"
tags: "array[string], 3-5 tags, lowercase, hyphenated"
created_date: "YYYY-MM-DD"
workflow_id: "workflow_YYYYMMDD_NNN"
```

2. **Step Format Template** (20 lines)
```markdown
## Step X: Action-Oriented Title (3-5 words)

**Instruction:**

```text
Line 1: Primary action with Claude/Claude Code usage specified
Line 2-3: Key context or parameters to include
Line 4-5: Expected format or output structure (optional)
```

**Deliverable:** _Tangible outcome in 10-20 words_
```

3. **Instruction Writing Rules** (20 lines)
   - Maximum 5 lines (hard limit)
   - Start with action verb (Ask, Request, Have, Use, Create)
   - Specify Claude or Claude Code in first line
   - Include context from user's Step 1 answers
   - List key points, not full sentences
   - Avoid numbered sub-lists (break into multiple steps instead)

4. **Deliverable Writing Rules** (15 lines)
   - Format: `_Italicized sentence or phrase_`
   - Length: 10-20 words
   - Must be tangible/measurable
   - Describes the artifact user will have
   - Not a description of the process

5. **Complete Example** (15 lines)
   - Perfect step with annotations

---

#### Priority 3: Slim Down SKILL.md

**File:** `SKILL.md`
**Current:** 428 lines
**Target:** 150 lines

**What to Keep:**
```markdown
# Gitthub Workflow Generator (10 lines)
- Brief overview
- Core value proposition

## When to Use This Skill (15 lines)
- User triggers
- Workflow types (1 sentence each)
- Example requests

## Workflow Generation Process (25 lines)
### Phase 1: Discovery
Read appropriate guide: navigate-guide.md, educate-guide.md, or deploy-guide.md

### Phase 2: Expansion
Read references/workflow-format-spec.md for format requirements

### Phase 3: Save
Read references/file-naming-conventions.md for naming rules
Save to vault-website/workflows/

## Getting Started (20 lines)
- How the skill works
- What to expect from each phase
- Example interaction flow

## Quick Reference (40 lines)
- AskUserQuestion tool usage (keep existing)
- 3-5 line instruction requirement (keep existing)
- Workflow type quick reference table

## Resources (20 lines)
- List all reference files with 1-line descriptions
- When to read each file

## Tips (20 lines)
- Top 5 most critical tips
- Link to references/best-practices.md for full list
```

**What to Move:**
- Two-Phase Process details → `references/workflow-generation-process.md`
- Quality Guidelines → `references/quality-guidelines.md`
- Common Patterns → `references/common-patterns.md`
- Complete Example → Already in example-*.md files
- Full Tips list → `references/best-practices.md`
- Workflow Features → `references/workflow-format-spec.md`

---

## Implementation Checklist

### Phase 1: Foundation (Do First)
- [ ] Create `references/workflow-format-spec.md` with JSON schema and templates
- [ ] Enhance `references/navigate-guide.md` from 59 to 150-200 lines
- [ ] Enhance `references/educate-guide.md` from 61 to 150-200 lines
- [ ] Enhance `references/deploy-guide.md` from 62 to 150-200 lines

### Phase 2: Extraction (Do Second)
- [ ] Create `references/quality-guidelines.md` (extract from SKILL.md)
- [ ] Create `references/best-practices.md` (extract from SKILL.md)
- [ ] Create `references/common-patterns.md` (extract from SKILL.md)
- [ ] Create `references/workflow-generation-process.md` (extract from SKILL.md)

### Phase 3: Refactor (Do Last)
- [ ] Slim down SKILL.md from 428 to ~150 lines
- [ ] Update SKILL.md to reference new files
- [ ] Test workflow generation with new structure
- [ ] Validate progressive disclosure works correctly

---

## Expected Outcomes

### Token Efficiency
- **Before:** 6,000 tokens loaded on skill trigger
- **After:** 2,000 tokens loaded on skill trigger
- **Savings:** 4,000 tokens (67% reduction)

### Quality Improvements
- **Clearer system prompts:** 150-200 line guides with comprehensive instructions
- **Standardized templates:** JSON schema and format specifications
- **Better validation:** Checklists and error handling
- **Consistent output:** All workflows follow exact same format

### Maintainability
- **Modular:** Each reference has single responsibility
- **Scalable:** Easy to add new workflow types
- **Discoverable:** Clear file organization
- **Testable:** Each component can be validated independently

---

## Next Steps

1. **Review this plan** - Confirm approach aligns with your vision
2. **Prioritize sections** - Which enhancements are most valuable?
3. **Manual edits** - Start with Priority 1 (enhance system prompts)
4. **Test & iterate** - Generate test workflows, validate improvements
5. **Document** - Update any external documentation referencing the skill

---

**Questions to Consider:**

1. Should workflow type guides have different structures, or standardized?
2. How much automation vs. human judgment in workflow generation?
3. Should we add more workflow types (e.g., "debug", "refactor", "migrate")?
4. Should validation be enforced (hard errors) or advisory (suggestions)?
5. How should skill handle edge cases (unclear request, wrong type, too large scope)?
