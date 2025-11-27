# Workflow Generation Best Practices

This document provides detailed best practices for generating high-quality gitthub workflows across all types (navigate, educate, deploy).

---

## The 11 Essential Practices

### 1. Always Use Extended Thinking in Discovery Phase

**Why it matters:**
Extended thinking dramatically improves workflow quality by allowing you to deeply analyze the user's request, identify nuances, and plan a comprehensive approach before generating content.

**What to think about:**
- What is the user really asking for?
- What's their technical skill level?
- What are their constraints (time, budget, experience)?
- What's the best workflow type for this request?
- What are the key phases/steps needed?
- What common pitfalls should I anticipate?
- How can I make this maximally useful for them?

**Example:**
```
User request: "create a workflow for deploying a FastAPI app"

<thinking>
- User wants to DEPLOY (implementation) → deploy workflow
- FastAPI is Python framework → need Python environment setup
- "Deploying" suggests they have code or will build it → need to clarify
- Key phases: prerequisites, build app, test locally, configure prod, deploy
- Common pitfalls: CORS issues, environment variables, database connections
- Should deploy to where? Need to ask - Render, AWS, Vercel?
- Skill level? Beginner might need more hand-holding
- 8-12 steps: setup (2), build (3-4), test (1), deploy (2-3), verify (1)
</thinking>
```

**When to use:**
- EVERY workflow generation, before making any other decisions
- Minimum 5-10 lines of thinking
- Review thinking before proceeding to next phase

---

### 2. Always Use Web Search for Current Best Practices

**Why it matters:**
Technology changes rapidly. Web search ensures you're recommending current best practices, tools, and approaches (as of 2025), not outdated information.

**What to search for:**
- "[technology] best practices 2025"
- "[workflow topic] guide 2025"
- "how to [task] 2025"
- "[tool] vs [alternative] 2025"

**Example searches:**
```
Navigate workflow: "video editing software comparison 2025"
Educate workflow: "explain REST APIs simply 2025"
Deploy workflow: "deploy FastAPI to Render 2025"
```

**What to look for in results:**
- Current tool versions and recommendations
- Recent changes or deprecations
- New best practices that emerged
- Common gotchas and solutions
- Real-world examples and tutorials

**When to use:**
- EVERY workflow generation during discovery phase
- Before generating outline
- When recommending specific tools or approaches

---

### 3. Always Use AskUserQuestion Tool for Clarifying Questions

**Why it matters:**
Interactive menu selection provides MUCH better UX than listing text questions. Users can quickly select options instead of typing long answers.

**How to use:**
```json
{
  "questions": [
    {
      "question": "What's your technical experience level?",
      "header": "Experience",
      "multiSelect": false,
      "options": [
        {"label": "Complete beginner", "description": "Never done this before"},
        {"label": "Some basics", "description": "Basic familiarity, want guidance"},
        {"label": "Intermediate", "description": "Some experience, leveling up"},
        {"label": "Advanced", "description": "Experienced, optimizing approach"}
      ]
    },
    {
      "question": "Which components do you need?",
      "header": "Requirements",
      "multiSelect": true,
      "options": [
        {"label": "Database", "description": "PostgreSQL, MongoDB, etc."},
        {"label": "Authentication", "description": "User login system"},
        {"label": "API", "description": "REST or GraphQL endpoints"},
        {"label": "Frontend", "description": "React, Vue, or static site"}
      ]
    }
  ]
}
```

**Best practices:**
- Use 2-4 questions maximum (don't overwhelm)
- Make options mutually exclusive unless multiSelect: true
- Keep header text short (max 12 characters)
- Provide clear descriptions for each option
- Use multiSelect: false for single-choice questions
- Use multiSelect: true when choices aren't mutually exclusive

**When to use:**
- EVERY workflow generation during discovery phase
- After extended thinking, before generating outline
- To clarify technical level, requirements, constraints, timeline

---

### 4. Read the Appropriate Type Guide Before Generating

**Why it matters:**
Each workflow type (navigate, educate, deploy) has specific structure, best practices, and patterns. Reading the guide ensures you follow the right approach.

**Which guide to read:**
- Navigate workflows → read `references/navigate-guide.md`
- Educate workflows → read `references/educate-guide.md`
- Deploy workflows → read `references/deploy-guide.md`

**What to focus on:**
- Workflow characteristics (step count, time, focus)
- Typical structure for that type
- Type-specific best practices (8 practices per guide)
- Common patterns and anti-patterns
- Quality validation checklist

**When to read:**
- Before generating outline
- Reference during expansion phase
- Check validation checklist before finalizing

---

### 5. Don't Skip the Refinement Loop

**Why it matters:**
User feedback during outline phase significantly improves final workflow quality. Users know their context best and can spot misalignments early.

**How refinement works:**

**Step 1: Generate outline (6-12 steps)**
Show step titles with brief descriptions

**Step 2: Present to user**
Ask: "Does this outline match what you're looking for? Any steps to add, remove, or adjust?"

**Step 3: Incorporate feedback**
- Add steps user requested
- Remove steps that don't fit
- Reorder for better flow
- Adjust scope/depth based on feedback

**Step 4: Get approval**
Only proceed to expansion when user confirms outline is good

**Example refinement:**
```
User: "I don't need Step 3 about pricing, I already chose a tool. Focus more on configuration."

Response: "Got it! I'll remove Step 3 (pricing comparison) and expand Step 5
(configuration) into two steps: basic configuration and advanced settings."
```

**When to use:**
- EVERY workflow generation
- After presenting outline
- Before expanding to detailed steps
- May iterate 2-3 times until user is satisfied

---

### 6. Keep Steps Atomic

**Why it matters:**
Each step should be ONE clear action that produces ONE deliverable. Multiple sub-tasks in a single step overwhelm users and make it hard to track progress.

**What "atomic" means:**
- Single, focused action
- Single, clear deliverable
- Completable before moving to next step
- Can't be broken down further without losing coherence

**Good atomic steps:**
```markdown
## Step 3: Create Comparison Matrix

**Instruction:**

```text
Ask Claude to create comparison table for 4 tools covering: pricing, features,
ease of use, platform support, and learning curve. Request personalized
recommendation based on your requirements from Step 1.
```

**Deliverable:** _Comparison matrix with 4 tools rated across 5 criteria_
```

**Bad non-atomic step (3 sub-tasks):**
```markdown
## Step 3: Research, Compare, and Decide

**Instruction:**

```text
Research available tools, create comparison table, and make final decision
```

**Deliverable:** _Decision made_
```

**Problems:**
- "Research" is one action
- "Create comparison" is another action
- "Make decision" is a third action
- Should be 3 separate steps

**How to fix:**
```markdown
## Step 3: Identify Candidate Tools

**Instruction:**

```text
Ask Claude to identify 4-5 leading tools for your use case based on current
market research (2025). Request brief description of each tool's primary
strengths and typical users.
```

**Deliverable:** _List of 4-5 candidate tools with descriptions_

---

## Step 4: Create Comparison Matrix

**Instruction:**

```text
Ask Claude to create comparison table for the candidate tools covering: pricing,
features, ease of use, platform support, and learning curve. Request scoring
based on your priorities from Step 1.
```

**Deliverable:** _Comparison matrix with tools rated across 5 criteria_

---

## Step 5: Make Informed Decision

**Instruction:**

```text
Request Claude to analyze the comparison matrix and recommend the best-fit tool
for your specific requirements. Ask for rationale, potential tradeoffs, and
any deal-breakers to confirm before committing.
```

**Deliverable:** _Final tool selection with clear rationale and understood tradeoffs_
```

**When to apply:**
- Every step in every workflow
- If instruction lists 3+ sub-tasks, split into multiple steps
- If deliverable is vague ("research done"), it's probably not atomic

---

### 7. Keep Instructions Concise (3-5 Lines Maximum)

**CRITICAL PRACTICE - MOST COMMON MISTAKE**

**Why it matters:**
Long instructions (10, 20, 30+ lines) overwhelm users and reduce clarity. Users can ask Claude for details during execution. Instructions should focus on KEY POINTS only.

**The rule:**
- Minimum: 2 lines (if truly simple)
- Target: 3-4 lines (ideal)
- Maximum: 5 lines (absolute limit)
- NEVER: 10+ lines (too verbose)

**Good example (4 lines):**
```text
Ask Claude to create comparison table for the shortlisted tools covering:
pricing, ease of use, key features, platform support, and learning curve.
Request that Claude highlight which tool best fits your specific requirements
from Step 1 and identify any potential deal-breakers.
```

**Bad example (15 lines - TOO LONG):**
```text
Ask Claude to create a comprehensive comparison table for video editing tools.
The table should include the following criteria:

1. Pricing (monthly, annual, one-time purchase)
2. Ease of use rating (scale 1-10)
3. Key features (list top 5 for each tool)
4. Platform support (Windows, Mac, Linux, web-based)
5. Learning curve (beginner-friendly, intermediate, advanced)
6. Export formats supported
7. Collaboration features available
8. Customer support quality and responsiveness
9. Size of user community
10. Performance with 4K video editing

Request that Claude highlight which tool best fits your budget and specific needs.
Also ask Claude to identify any deal-breakers for your particular use case.
```

**How to condense:**
1. List key points (not exhaustive details)
2. Group related criteria
3. Trust user can ask Claude for elaboration
4. Focus on what's unique to this step

**Fixed version (4 lines):**
```text
Ask Claude to create comparison table for the shortlisted tools covering:
pricing, ease of use, key features, platform support, and learning curve.
Request that Claude highlight which tool best fits your specific requirements
and identify any potential deal-breakers for your use case.
```

**When to apply:**
- EVERY single step instruction
- Check word count: ~50-100 words typical
- If instruction has numbered list with 8+ items, break into multiple steps

---

### 8. Specify Claude Usage in Every Step

**Why it matters:**
Workflows are tools for using Claude/Claude Code effectively. Every step MUST specify how the user should engage with Claude/Claude Code.

**Claude vs. Claude Code:**

**Claude (conversational):**
- Explanations and teaching
- Comparisons and analysis
- Decision-making guidance
- Conceptual understanding
- Walkthroughs and examples

**Claude Code (implementation):**
- File generation
- Code writing
- Configuration creation
- Project scaffolding
- Schema design

**Good Claude usage examples:**
```text
Ask Claude to explain authentication using a simple analogy...
Request Claude to create a comparison table showing...
Have Claude walk through the deployment process step-by-step...
```

**Good Claude Code usage examples:**
```text
Use Claude Code to generate the initial project structure...
Request Claude Code to create database schema files...
Have Claude Code write API endpoints with error handling...
```

**Bad (no tool specified):**
```text
Create a comparison table ← WHO creates it?
Generate configuration files ← HOW?
Research authentication methods ← USING WHAT?
```

**Sentence starters:**
- "Ask Claude to..."
- "Request Claude to..."
- "Have Claude..."
- "Use Claude Code to..."
- "Request Claude Code to..."
- "Have Claude Code..."

**When to apply:**
- EVERY step in EVERY workflow
- First sentence of instruction should specify tool
- If instruction doesn't mention Claude/Claude Code, it's wrong

---

### 9. Be Concrete with Deliverables

**Why it matters:**
Vague deliverables ("better understanding", "research done") don't give users a clear checkpoint. Concrete deliverables let users verify progress and know when to move forward.

**What makes a deliverable concrete:**
- Specific artifact (file, document, decision, configuration)
- Measurable outcome (can verify it exists)
- Clear format (table, schema, list, diagram)
- Tangible result (something you can point to)

**Good concrete deliverables:**
- ✅ _Comparison matrix with 4 tools rated across 5 criteria with recommendation_
- ✅ _Complete database schema file (schema.sql) with tables, indexes, and relationships_
- ✅ _Clear understanding of authentication flow with security best practices documented_
- ✅ _Project structure with configuration files, dependencies installed, and verified working_
- ✅ _Live deployment on Render with verified health check and database connection_

**Bad vague deliverables:**
- ❌ _Better understanding_ (of what? how to verify?)
- ❌ _Research complete_ (what did you learn? where is it?)
- ❌ _Configuration done_ (what got configured? can I see it?)
- ❌ _Files created_ (which files? what's in them?)
- ❌ _Decision made_ (what was decided? what's the rationale?)

**How to make deliverables concrete:**

**Pattern 1: Specify the artifact**
- "Comparison table..." → "Comparison table with 4 tools rated across 5 criteria"
- "Files created..." → "Complete project structure with package.json, main.py, and config.yml"

**Pattern 2: Add measurable details**
- "Understanding of APIs" → "Clear understanding of REST APIs with examples of GET, POST, PUT, DELETE"
- "Schema designed" → "Database schema with 5 tables, relationships, and indexes defined"

**Pattern 3: Include verification criteria**
- "Deployment complete" → "Live deployment on Render with working health check endpoint"
- "Tests written" → "Passing test suite with 15 tests covering all endpoints"

**Format: 10-20 words (not 3, not 40)**
- Too short: "Comparison table" (what's in it?)
- Too long: "A comprehensive, thoroughly researched, and carefully analyzed comparison table..." (redundant)
- Just right: "Comparison matrix with 4 tools rated across 5 criteria with recommendation"

**When to apply:**
- EVERY step in EVERY workflow
- Check each deliverable: can user verify it exists?
- If deliverable is vague, add specifics

---

### 10. Follow Naming Convention

**Why it matters:**
Consistent file naming enables organization, sorting, and automation. All workflows must follow the same pattern for discoverability.

**The pattern:**
```
vault-website/workflows/workflow_YYYYMMDD_NNN_snake_case_title.md
```

**Components:**
- Directory: `vault-website/workflows/` (always)
- Prefix: `workflow_` (always)
- Date: `YYYYMMDD` (current date, e.g., 20251115)
- Sequential: `NNN` (001, 002, 003... with leading zeros)
- Title: `snake_case_title` (lowercase, underscores)

**Examples:**
- ✅ `vault-website/workflows/workflow_20251115_001_deploy_fastapi_app_to_render.md`
- ✅ `vault-website/workflows/workflow_20251115_007_navigate_video_editing_tool_selection.md`
- ❌ `workflow_20251115_1_deploy_app.md` (missing directory, no leading zeros)
- ❌ `vault-website/workflows/Deploy_FastAPI.md` (wrong format entirely)

**How to determine sequential number:**
1. List files in `vault-website/workflows/` with current date
2. Find highest `NNN` used today
3. Add 1, format with leading zeros

**When to apply:**
- EVERY workflow when saving
- Double-check before writing file
- Confirm filename to user after saving

**See:** `references/file-naming-conventions.md` for complete details

---

### 11. Check Examples for Quality Standards

**Why it matters:**
Example workflows demonstrate the quality bar and proper formatting. Checking examples before generating ensures your workflow meets standards.

**Which examples to check:**

**For Navigate workflows:**
- Read: `references/example-navigate.md`
- See: Step structure, instruction length, deliverable format
- Note: How comparisons are structured, decision criteria used

**For Educate workflows:**
- Read: `references/example-educate.md`
- See: Progressive learning structure, analogy usage
- Note: How concepts build on each other, mental models created

**For Deploy workflows:**
- Read: `references/example-deploy.md`
- See: Implementation steps, validation checkpoints
- Note: Error handling, testing integration, verification steps

**What to look for:**
- Instruction length (3-5 lines)
- Deliverable specificity (10-20 words)
- Step atomicity (single action)
- Claude usage specification
- Progressive flow

**When to use:**
- Before generating outline (review structure)
- During expansion (check formatting)
- Before finalizing (validate quality)

---

## Workflow Generation Checklist

Use this checklist for EVERY workflow generation:

### Discovery Phase
- [ ] Used extended thinking (5-10+ lines analyzing request)
- [ ] Performed web search for current best practices
- [ ] Used AskUserQuestion tool for clarifying questions (2-4 questions)
- [ ] Read appropriate type guide (navigate/educate/deploy)
- [ ] Identified workflow type correctly based on user's goal

### Outline Phase
- [ ] Generated 6-8 steps (navigate/educate) or 8-12 steps (deploy)
- [ ] Each step has clear title and brief description
- [ ] Presented outline to user
- [ ] Incorporated user feedback
- [ ] Got user approval before expanding

### Expansion Phase
- [ ] Read format spec: `references/workflow-format-spec.md`
- [ ] Each instruction is 3-5 lines maximum
- [ ] Each instruction specifies Claude or Claude Code usage
- [ ] Each deliverable is 10-20 words and concrete
- [ ] Steps are atomic (single action each)
- [ ] Steps flow progressively
- [ ] Checked example workflow for quality standards

### Finalization Phase
- [ ] Added complete YAML metadata
- [ ] Added completion section
- [ ] Added tips for success
- [ ] Determined correct filename with date and sequential number
- [ ] Saved to `vault-website/workflows/workflow_YYYYMMDD_NNN_title.md`
- [ ] Confirmed filename to user

---

## Common Mistakes and How to Avoid Them

### Mistake 1: Skipping Discovery
**Problem:** Jumping straight to generating outline without thinking or asking questions
**Solution:** Always use extended thinking + web search + AskUserQuestion

### Mistake 2: Instructions Too Long
**Problem:** Writing 10-30 line instructions that overwhelm users
**Solution:** Keep to 3-5 lines, list key points only, trust user to ask Claude for details

### Mistake 3: Vague Deliverables
**Problem:** "Better understanding", "Research complete", "Configuration done"
**Solution:** Specify artifact, format, and verification criteria (10-20 words)

### Mistake 4: Multi-Task Steps
**Problem:** One step tries to do 3-5 different things
**Solution:** Break into separate atomic steps, each with single action

### Mistake 5: Missing Claude Usage
**Problem:** Instructions don't specify how to use Claude/Claude Code
**Solution:** Every instruction starts with "Ask Claude..." or "Use Claude Code..."

### Mistake 6: Wrong Workflow Type
**Problem:** Creating navigate workflow when user wants to learn (educate)
**Solution:** Analyze intent carefully - COMPARE=navigate, LEARN=educate, BUILD=deploy

### Mistake 7: Skipping Refinement
**Problem:** Expanding to full workflow without user feedback on outline
**Solution:** Always present outline, get feedback, iterate until approved

### Mistake 8: Ignoring Type Guide
**Problem:** Not reading navigate/educate/deploy guide before generating
**Solution:** Always read appropriate guide to understand structure and patterns

### Mistake 9: Inconsistent Naming
**Problem:** Saving files with wrong format or location
**Solution:** Always follow `workflow_YYYYMMDD_NNN_snake_case_title.md` pattern

### Mistake 10: No Quality Check
**Problem:** Not reviewing examples or format spec before finalizing
**Solution:** Check example workflow and run through validation checklist

---

## Quick Reference Card

**For every workflow generation:**

1. ✅ **Think** - Extended thinking about request
2. ✅ **Search** - Web search for current best practices
3. ✅ **Ask** - AskUserQuestion tool for clarifying questions
4. ✅ **Read** - Read appropriate type guide
5. ✅ **Outline** - Generate 6-12 step outline
6. ✅ **Refine** - Get user feedback and iterate
7. ✅ **Expand** - 3-5 lines per instruction, 10-20 words per deliverable
8. ✅ **Check** - Review example workflow
9. ✅ **Save** - Follow naming convention
10. ✅ **Confirm** - Tell user the filename

**Remember:**
- Instructions: 3-5 lines MAX
- Deliverables: 10-20 words, concrete
- Steps: Atomic (single action)
- Claude usage: ALWAYS specified
- Examples: Check before finalizing

---

This best practices guide ensures consistent, high-quality workflow generation across all types and contexts.
