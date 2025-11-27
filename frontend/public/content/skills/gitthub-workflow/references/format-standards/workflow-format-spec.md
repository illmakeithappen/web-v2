# Workflow Format Specification

This document defines the complete format specification for gitthub workflows, including metadata schema, step templates, and validation rules.

---

## Metadata Schema (YAML Frontmatter)

Every workflow MUST begin with YAML frontmatter containing the following fields:

```yaml
---
# Workflow Metadata (Required)
title: "string"
  # Format: Title Case, 3-8 words
  # Example: "Navigate Professional Video Editing Tool Selection"
  # Purpose: Human-readable workflow name

description: "string"
  # Format: Short one-line sentence from invocation prompt
  # Example: "create a gitthub workflow for comparing video editing tools"
  # Purpose: Brief explanation of what the workflow accomplishes

author: "string"
  # Author name or "Claude"
  # Example: "Claude", "John Smith"
  # Default: "Claude"

category: "workflow"
  # Standard value for all gitthub workflows
  # Options: workflow, skill, tool

type: "navigate | educate | deploy"
  # Options: navigate (comparison), educate (learning), deploy (implementation)
  # Purpose: Determines workflow structure and approach

difficulty: "beginner | intermediate | advanced"
  # Purpose: Sets user expectations for complexity
  # Collected from Question 1 in discovery phase

# NEW: Reference Materials (Optional but Recommended)
references: array[string] | []
  # Format: Array of file paths, URLs, attachments, or skill references
  # Collected from Question 2 in discovery phase
  # Examples:
  #   - "vault-web/docs/deployment-guide.md" (file path)
  #   - "https://docs.example.com/api-reference" (URL)
  #   - "skill:docker-config-generator" (skill reference)
  #   - "attached:architecture-diagram.pdf" (attachment)
  # Default: [] (empty array if no references)

# NEW: Context (Required)
context: "string"
  # Format: 2-3 sentences explaining goal and how references relate
  # Collected from Question 3 in discovery phase
  # Example: |
  #   I want to deploy a FastAPI application to production with a PostgreSQL database.
  #   The deployment-guide.md contains our team's standard practices for cloud deployments.
  #   Need to complete this within 2 weeks for a client demo.
  # Purpose: Provides background and motivation for the workflow

# Agent/Model Information (Required)
agent: "claude.ai | claude desktop | claude code"
  # Detected during workflow generation
  # Options: "claude.ai", "claude desktop", "claude code"
  # Purpose: Determines question flow (sequential vs. batched)

model: "claude-sonnet-4-5"
  # Standard model for all gitthub workflows

# Time & Effort (Required)
estimated_time: "string"
  # Format: "X-Y minutes" or "X-Y hours"
  # Examples: "90-120 minutes", "2-4 hours", "4-6 hours"
  # Navigate/Educate: 90-120 minutes typical
  # Deploy: Variable (2-6 hours typical)

total_steps: integer
  # Navigate/Educate: 6-8 steps
  # Deploy: 8-12 steps
  # Purpose: Quick overview of workflow length

# Tracking (Required)
created_date: "YYYY-MM-DD"
  # Format: ISO 8601 date
  # Example: "2025-11-18"

last_modified: "YYYY-MM-DD"
  # Format: ISO 8601 date
  # Example: "2025-11-18"

workflow_id: "string"
  # Format: YYYYMMDD_HHMMSS_author_category
  # Example: "20251118_143052_claude_workflow"
  # Purpose: Unique identifier for the workflow

status: "not started yet | in progress | finished"
  # Options: "not started yet", "in progress", "finished"
  # Default: "not started yet"
  # Purpose: Workflow execution tracking

# NEW: Tools (Optional)
tools: array[string] | []
  # Format: Array of non-obvious tools that yield productivity gains
  # Examples:
  #   - "render mcp (for managing Render deployments)"
  #   - "docker (for containerization)"
  #   - "github actions (for CI/CD)"
  # Default: [] (empty array)
  # Purpose: Highlights specialized tools beyond Claude/Claude Code

# NEW: Skills (Optional but Recommended)
skills: array[string] | []
  # Format: Array of skills to use or develop, with brief rationale
  # Generated from skill recommendation analysis
  # Examples:
  #   - "docker-config-generator (for creating optimized container configs)"
  #   - "postgres-migration-manager (for managing schema changes)"
  #   - "react-page-creator (for generating consistent components)"
  # Default: [] (empty array)
  # Purpose: Suggests related skills for reusability and automation

# Step Names (Required)
steps: array[string]
  # Format: Array of step titles in order
  # Example:
  # steps:
  #   - "Define Professional Requirements"
  #   - "Discover Three Strategic Paths"
  #   - "Build Budget-Focused Comparison Matrix"

# Deprecated/Optional Metadata (for backwards compatibility)
tags: array[string] | []
  # Format: lowercase, hyphenated, 3-5 tags
  # Examples: ["navigate", "video-editing", "professional-tools"]
  # Optional: May be deprecated in future versions

version: "string"
  # Format: Semantic versioning (e.g., "1.0", "1.1", "2.0")
  # Default: "1.0"
  # Optional: May be deprecated in future versions

prerequisites: array[string] | []
  # Example: ["Basic command line knowledge", "Docker installed"]
  # Default: [] (empty array)
  # Optional: May be deprecated in future versions

budget_constraint: string | null
  # Example: "Budget-conscious", "Free tools only"
  # Default: null
  # Optional: May be deprecated in future versions
---
```

---

## Workflow Document Structure

After the YAML frontmatter, the workflow document follows this structure:

```markdown
# [Workflow Title]

**Purpose:** [1-2 sentences describing what this workflow helps users accomplish]

**Target Completion Time:** [X hours or X-Y minutes]
**Total Steps:** [N]

---

## Step 1: [Action-Oriented Title]

**Instruction:**

```text
[3-5 lines of concise instruction]
```

**Deliverable:** _[10-20 word tangible outcome]_

**Uses:**
- Tools: [tool-name] (if applicable)
- References: [reference-name] (if applicable)
- Skills: [skill-name] (if applicable)

---

## Step 2: [Action-Oriented Title]

[Repeat structure...]

---

## Workflow Completion

By completing this [type] workflow, you will have:

- ✅ [Key outcome 1]
- ✅ [Key outcome 2]
- ✅ [Key outcome 3]
[List 5-7 major outcomes]

**Final Decision:** [Summary of what user achieves]

---

## Tips for Success

1. [Tip 1]
2. [Tip 2]
[5-8 practical tips specific to this workflow]

---

## Next Steps After Workflow

1. [Action 1]
2. [Action 2]
[3-5 concrete actions to take after completing workflow]

---

## [Optional: Resources Section]

[Links to relevant documentation, tools, communities]
```

---

## Step Format Template

Each step MUST follow this exact format:

```markdown
## Step X: Action-Oriented Title (3-5 words)

**Instruction:**

```text
Line 1: Primary action with Claude/Claude Code usage specified
Line 2-3: Key context, parameters, or requirements to include
Line 4: Reference to materials if applicable
Line 5: Expected format or structure (optional, only if needed)
```

**Deliverable:** _Tangible outcome in 10-20 words describing the artifact user will have_

**Uses:**
- Tools: [tool-name] (if this step uses specific tools)
- References: [reference-name] (if this step uses reference materials)
- Skills: [skill-name] (if this step uses or recommends skills)

---
```

### Step Title Requirements
- **Length:** 3-5 words maximum
- **Format:** Title Case
- **Start with:** Action verb (Define, Discover, Build, Analyze, Calculate, Map, Generate, Create, etc.)
- **Avoid:** Generic words like "Step", numbers, vague terms
- **Good:** "Build Budget-Focused Comparison Matrix"
- **Bad:** "Step 3: Analysis", "Do the Comparison", "Matrix"

### Instruction Requirements (CRITICAL)
- **Length:** 3-5 lines MAXIMUM (not 10, 20, or 30+ lines)
- **Line 1:** Always specify Claude or Claude Code usage with action verb
  - Start with: "Ask Claude", "Request Claude", "Have Claude", "Use Claude Code"
- **Lines 2-3:** List key points, context, or parameters
  - Use colons to introduce lists
  - Keep lists to 3-5 items maximum
  - Reference previous steps if building on earlier work
- **Lines 4-5:** (Optional) Specify output format or structure only if essential
- **Format:** Plain text in code block (```text ... ```)
- **Avoid:**
  - Numbered sub-lists with 8+ items (break into multiple steps instead)
  - Multiple paragraphs (combine into concise lines)
  - Detailed explanations (users ask Claude for details during execution)
  - Examples or walkthroughs (belong in the instruction during execution, not in workflow)
- **Skill Creation Prompts (if applicable):**
  - If step uses a recommended skill from frontmatter, add note AFTER closing code block
  - Format: `*Note: This step would benefit from the [skill-name] skill. Say "Help me create the [skill-name] skill" to build it first, or continue with [manual approach].*`
  - Gives users choice to create reusable skill before proceeding
  - Keep note concise (1 line with asterisk/italics for visual separation)

### Deliverable Requirements
- **Format:** `_Italicized sentence or phrase_` (underscore wrapping)
- **Length:** 10-20 words
- **Content:** Tangible, measurable outcome
  - Describes the ARTIFACT user will have (profile, matrix, plan, framework, etc.)
  - NOT a description of the process
  - Must be specific to this step's outcome
- **Good:** `_Professional requirements profile documenting client work needs and budget limits_`
- **Bad:** `_Understanding of requirements_` (too vague, not tangible)

---

## Instruction Writing Guidelines

### Action Verb Library

**For Navigate Workflows:**
- Ask Claude to [compare, evaluate, rank, analyze tradeoffs]
- Request Claude to [present, explain, demonstrate, walk through]
- Have Claude create [comparison matrix, decision framework, analysis]

**For Educate Workflows:**
- Ask Claude to explain [concept using analogy, principle progressively]
- Request Claude to demonstrate [with concrete example, step-by-step]
- Have Claude build [mental model, understanding, framework]

**For Deploy Workflows:**
- Use Claude Code to [generate, create, configure, setup]
- Ask Claude to [validate, verify, test, check]
- Request Claude to [deploy, install, initialize, run]

### Claude/Claude Code Usage Patterns

**Claude (conversational guidance):**
- "Ask Claude to guide you through..."
- "Request Claude to create a comparison..."
- "Have Claude explain the tradeoffs..."
- "Ask Claude to analyze your specific..."

**Claude Code (file operations, code generation):**
- "Use Claude Code to generate the initial..."
- "Have Claude Code create a configuration file..."
- "Request Claude Code to setup the project structure..."

### Context References

Always reference user's earlier inputs:
- "based on your Step 1 requirements"
- "using your answers from the needs assessment"
- "tailored to your priorities from earlier"
- "matching your constraints identified in Step 1"

---

## Deliverable Writing Guidelines

### Format Examples

**Good (Specific, Tangible, Measurable):**
- `_Professional requirements profile documenting client work needs, technical constraints, and budget limits_`
- `_Weighted comparison matrix scoring each approach on financial, capability, and business dimensions_`
- `_Implementation plan for top 2-3 tools with trial strategies, learning resources, and milestones_`
- `_Decision framework with priorities, deal-breakers, decision rules, and ranked recommendations_`

**Bad (Vague, Process-Oriented, Unmeasurable):**
- `_Understanding of your requirements_` (not tangible)
- `_Comparison of the different tools_` (not specific enough)
- `_Knowledge about costs_` (not measurable)
- `_Plan created_` (too generic)

### Components of Good Deliverables

1. **Artifact Type:** What format is the deliverable?
   - Profile, Matrix, Plan, Framework, Analysis, Roadmap, Checklist, etc.

2. **Content Scope:** What does it contain?
   - "documenting client work needs and budget limits"
   - "scoring each approach on financial dimensions"
   - "with trial strategies and success metrics"

3. **Specificity:** Tailored to this step
   - Not generic: "comparison table"
   - Specific: "weighted comparison matrix scoring each approach"

---

## Validation Rules

Before finalizing a workflow, verify:

### Metadata Validation
- [ ] Title is 3-8 words, Title Case
- [ ] Description is 10-25 words, lowercase, actionable
- [ ] Type matches workflow content (navigate/educate/deploy)
- [ ] Step count matches type guidelines (6-8 or 8-12)
- [ ] Tags are lowercase, hyphenated, 3-5 tags
- [ ] Dates are ISO 8601 format (YYYY-MM-DD)
- [ ] workflow_id matches file name

### Step Validation
- [ ] All step titles are 3-5 words, start with action verb
- [ ] All instructions are 3-5 lines maximum
- [ ] All instructions specify Claude/Claude Code usage
- [ ] All deliverables are 10-20 words, italicized
- [ ] Each step builds on previous steps logically
- [ ] No duplicate deliverables across steps

### Content Validation
- [ ] Estimated time is realistic (90-120 min for navigate/educate)
- [ ] All steps have clear, unique outcomes
- [ ] Instructions reference user's earlier inputs where relevant
- [ ] Deliverables are tangible and measurable
- [ ] Workflow achieves the stated purpose
- [ ] No instruction has 8+ sub-items (break into multiple steps)

### Quality Validation
- [ ] Target audience is clear (enthusiastic computer users, not developers)
- [ ] Language is simple, approachable, non-technical
- [ ] Each step is atomic (one clear action, not multiple sub-tasks)
- [ ] Workflow type best practices are followed (see type guides)

---

## Common Format Mistakes

### Instruction Format Mistakes

**❌ Too Long (15+ lines):**
```text
Ask Claude to guide you through a comprehensive professional video editing needs
assessment. Share specific details about:

1. Types of client projects you handle (weddings, corporate videos, commercials,
   social media content, documentaries, events, etc.)
2. Typical project deliverables (formats, resolutions, platforms where videos
   will be published)
[8+ more numbered items...]
```

**✅ Correct (3-5 lines):**
```text
Ask Claude to guide you through a professional video editing needs assessment
covering: client project types, typical deliverables, budget constraints, current
hardware, collaboration needs, and must-have features. Request that Claude
organize your answers into a requirements profile for tool selection.
```

### Deliverable Format Mistakes

**❌ Too Vague:**
- `_Understanding of requirements_`
- `_List of tools_`
- `_Analysis complete_`

**✅ Specific:**
- `_Professional requirements profile documenting client work needs and budget limits_`
- `_Three professional pathways with philosophy, pricing, and business implications_`
- `_1-year and 3-year TCO analysis with break-even calculations_`

---

## Example: Perfect Step

```markdown
## Step 3: Build Budget-Focused Comparison Matrix

**Instruction:**

```text
Have Claude create a comparison matrix evaluating each approach across: total
costs (1-year, 3-year projections), professional capabilities (features, workflow
efficiency, collaboration), and business factors (client perception, scalability,
support). Request scoring weighted to your Step 1 requirements.
```

**Deliverable:** _Weighted comparison matrix scoring each approach on financial, capability, and business dimensions_

**Uses:**
- Tools: Claude
- References: Step 1 requirements
- Skills: feature-comparison-matrix
```

**Why This Works:**
- **Title:** 4 words, action verb "Build", specific artifact "Budget-Focused Comparison Matrix"
- **Instruction:** 5 lines, starts with "Have Claude", lists key dimensions, references Step 1
- **Deliverable:** 14 words, specific artifact "weighted comparison matrix", lists what it scores
- **Uses:** Clearly shows which tools, references, and skills are used in this specific step

---

## Template for New Workflows

Use this template when creating new workflows:

```markdown
---
description: "[one-line description from invocation prompt]"
author: "[user name or Claude]"
category: "workflow"
type: "[navigate|educate|deploy]"
difficulty: "[beginner|intermediate|advanced]"
references:
  - "[file-path-or-url-or-skill-reference]"
  - "[another-reference]"
context: |
  [2-3 sentences explaining what user is trying to accomplish,
  how references relate to the task, and any constraints]
title: "[Action-Oriented Title in 3-8 Words]"
agent: "[claude.ai|claude desktop|claude code]"
model: "claude-sonnet-4-5"
created_date: "YYYY-MM-DD"
last_modified: "YYYY-MM-DD"
workflow_id: "YYYYMMDD_HHMMSS_author_category"
status: "not started yet"
tools:
  - "[non-obvious tool with rationale]"
skills:
  - "[skill name with rationale]"
steps:
  - "Step 1 Title"
  - "Step 2 Title"
estimated_time: "[X-Y minutes or X-Y hours]"
total_steps: [6-8 or 8-12]
tags: ["tag1", "tag2", "tag3"]
version: "1.0"
prerequisites: []
---

# [Workflow Title]

**Purpose:** [1-2 sentences]

**Target Completion Time:** [time]
**Total Steps:** [N]

---

## Step 1: [Title]

**Instruction:**

```text
[3-5 lines]
```

**Deliverable:** _[10-20 words]_

---

[Repeat for all steps...]

---

## Workflow Completion

By completing this [type] workflow, you will have:

- ✅ [Outcome 1]
- ✅ [Outcome 2]
[5-7 outcomes]

**Final Decision:** [Summary]

---

## Tips for Success

1. [Tip 1]
[5-8 tips]

---

## Next Steps After Workflow

1. [Action 1]
[3-5 actions]

---
```

---

This specification ensures consistency, quality, and usability across all gitthub workflows.
