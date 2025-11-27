# Workflow Generation Process

This document provides detailed guidance for the complete workflow generation process, from initial user request through final delivery.

---

## Overview

Workflow generation follows a **two-phase approach**:

**Phase 1: Conversational Outline** (Interactive)
- Discovery with extended thinking and web search
- Interactive clarifying questions (AskUserQuestion tool)
- Outline generation based on user answers
- Refinement loop until user approves

**Phase 2: Structured Expansion** (Deterministic)
- Read format specification and type guide
- Expand outline to detailed steps
- Add metadata and finalization elements
- Present workflow to user with storage instructions (DO NOT save yourself)

---

## Phase 1: Conversational Outline (Interactive)

### Step 1: Discovery with Extended Thinking

**Goal:** Deeply understand the user's request before making any decisions.

#### 1.1 Use Extended Thinking

Use `<thinking>` tags to analyze the user's request comprehensively:

**What to analyze:**
```
<thinking>
1. What is the user trying to accomplish?
   - Explicit goal stated in their request
   - Implicit needs or context
   - End outcome they're seeking

2. What workflow type is most appropriate?
   - NAVIGATE: Comparing options, making decisions
   - EDUCATE: Learning concepts, building understanding
   - DEPLOY: Implementing, building, deploying solutions

3. What's their likely skill level?
   - Beginner, intermediate, or advanced?
   - Indicators from language used
   - Domain expertise signals

4. What constraints might they have?
   - Time (quick turnaround vs. thorough learning)
   - Budget (free tools vs. premium)
   - Platform (specific tech stack mentioned)
   - Experience (hand-holding vs. advanced guidance)

5. What current best practices apply?
   - Recent changes in the domain (2025)
   - Recommended tools or approaches
   - Deprecated methods to avoid

6. What critical questions would refine the workflow?
   - Experience level
   - Specific use case or context
   - Constraints (budget, time, platform)
   - Success criteria
   - Scope (comprehensive vs. focused)

7. What's the ideal structure?
   - How many steps (6-8 for navigate/educate, 8-12 for deploy)
   - Key phases or milestones
   - Progressive flow toward goal
   - Critical checkpoints

8. What common pitfalls should I anticipate?
   - Domain-specific gotchas
   - Common mistakes beginners make
   - Edge cases to address
   - Security/performance considerations
</thinking>
```

**Minimum thinking length:** 5-10 lines covering key analysis points

**Example extended thinking:**
```
User request: "create a workflow to help me deploy a FastAPI app to Render"

<thinking>
- User wants to DEPLOY (implementation) → deploy workflow type
- FastAPI is Python web framework → need Python environment
- Render is deployment platform → platform-specific configuration needed
- "Deploy" suggests they may or may not have existing app → need to clarify
- Key phases: prerequisites, app development, local testing, production config, deployment
- Skill level unknown → should ask (affects detail level)
- Common pitfalls: environment variables, CORS, database connections, build commands
- Recent 2025 best practices: Docker multi-stage builds, health checks, proper logging
- Structure: 8-12 steps typical for deploy workflow
  1-2: Setup environment
  3-5: Build/configure app
  6-7: Test locally
  8-9: Configure production
  10-11: Deploy and verify
  12: (Optional) monitoring/next steps
- Critical questions: Do they have existing app? Skill level? Database needed? API only or frontend too?
</thinking>
```

#### 1.2 Use Web Search for Current Best Practices

**Goal:** Ensure recommendations are current (2025) and reflect latest best practices.

**What to search:**

For **Navigate workflows** (comparison/decision):
```
"[topic] comparison 2025"
"best [tool type] 2025"
"[tool A] vs [tool B] 2025"
"how to choose [tool type] 2025"
```

Examples:
- "video editing software comparison 2025"
- "best deployment platforms 2025"
- "DaVinci Resolve vs Adobe Premiere 2025"

For **Educate workflows** (learning/understanding):
```
"[topic] explained simply 2025"
"how [concept] works 2025"
"[topic] tutorial 2025"
"understanding [concept] 2025"
```

Examples:
- "REST APIs explained simply 2025"
- "how authentication works 2025"
- "database types tutorial 2025"

For **Deploy workflows** (implementation):
```
"deploy [technology] to [platform] 2025"
"[technology] deployment guide 2025"
"[platform] best practices 2025"
"[technology] production setup 2025"
```

Examples:
- "deploy FastAPI to Render 2025"
- "Next.js deployment guide 2025"
- "PostgreSQL production setup 2025"

**What to look for in results:**
- Current tool versions and recommendations
- Recent changes or deprecations
- New best practices that emerged
- Common gotchas and solutions
- Real-world examples and case studies
- Security/performance considerations

**How to use search results:**
- Identify 2-4 leading options/approaches
- Note key differences or tradeoffs
- Collect current best practices
- Identify common mistakes to avoid
- Find concrete examples to reference

#### 1.3 Use AskUserQuestion Tool

**Goal:** Clarify user's context, constraints, and requirements through interactive menu selection.

**Why interactive questions:**
- Much better UX than asking text questions
- Users can quickly select from options
- Reduces back-and-forth clarification
- Ensures you get structured, actionable answers

**How to use AskUserQuestion:**

```json
{
  "questions": [
    {
      "question": "What's your experience level with [topic]?",
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
      "question": "Which constraints should the workflow prioritize?",
      "header": "Constraints",
      "multiSelect": true,
      "options": [
        {"label": "Budget", "description": "Cost-conscious, free/affordable options"},
        {"label": "Time", "description": "Fast results, minimal time"},
        {"label": "Simplicity", "description": "Easy to understand and implement"},
        {"label": "Scalability", "description": "Production-ready, enterprise-grade"}
      ]
    },
    {
      "question": "What's your primary goal for this workflow?",
      "header": "Goal",
      "multiSelect": false,
      "options": [
        {"label": "Learning", "description": "Understand concepts deeply"},
        {"label": "Decision-making", "description": "Choose the best option"},
        {"label": "Implementation", "description": "Build and deploy working solution"},
        {"label": "Optimization", "description": "Improve existing setup"}
      ]
    }
  ]
}
```

**Question Types to Ask:**

**Question 1: Experience Level (multiSelect: false)**
- Determines depth and detail level
- Affects language complexity
- Influences step granularity

Options:
- Complete beginner
- Some basics
- Intermediate
- Advanced

**Question 2: Primary Goal/Use Case (multiSelect: false)**
- Determines workflow type confirmation
- Affects scope and focus
- Influences examples used

Options (navigate):
- Professional work
- Personal project
- Learning/exploration
- Client deliverables

Options (educate):
- Personal curiosity
- Work project
- Career development
- Teaching others

Options (deploy):
- Learning project (flexible timeline)
- Work deadline (week or less)
- Production urgent (ASAP)
- Portfolio piece (quality focus)

**Question 3: Requirements/Components (multiSelect: true)**
- Determines scope of workflow
- Affects step breakdown
- Identifies critical features

Options (deploy workflows):
- Database (PostgreSQL, MongoDB, etc.)
- Authentication (user login system)
- API (REST or GraphQL endpoints)
- Frontend (React, Vue, static site)
- File storage (S3, local, CDN)
- Real-time features (WebSockets)

**Question 4: Constraints (multiSelect: true)**
- Affects tool/approach recommendations
- Determines complexity level
- Influences timeline

Options:
- Budget (cost-conscious)
- Time (fast turnaround)
- Simplicity (easy to understand)
- Scalability (production-ready)
- Security (high compliance)
- Performance (low latency)

**AskUserQuestion Best Practices:**

1. **Question count:** 2-4 questions (don't overwhelm)
2. **Header length:** Max 12 characters (appears as chip/tag)
3. **Option labels:** 1-5 words (concise)
4. **Option descriptions:** 5-10 words (helpful context)
5. **MultiSelect usage:**
   - `false` for mutually exclusive choices (experience level, primary goal)
   - `true` for multiple applicable items (constraints, requirements, features)
6. **Option count:** 2-4 options per question (manageable)
7. **Clear language:** No jargon in questions or options

---

### Step 2: Generate Outline from Answers

**Goal:** Create high-level workflow structure based on discovery insights.

#### 2.1 Read Appropriate Type Guide

**Before generating outline, read the guide for chosen workflow type:**

```
Navigate workflows → Read references/navigate-guide.md
Educate workflows → Read references/educate-guide.md
Deploy workflows → Read references/deploy-guide.md
```

**What to focus on:**
- Typical structure for that workflow type
- Step count requirements (6-8 or 8-12)
- Key phases specific to that type
- Type-specific best practices
- Common patterns and anti-patterns

#### 2.2 Determine Workflow Structure

**Navigate Workflow Structure (6-8 steps):**

Typical flow:
1. Assess requirements/needs
2. Identify candidate options (2-4 options)
3. Create comparison matrix
4. Analyze tradeoffs
5. Evaluate against priorities
6. Make informed decision
7. (Optional) Create implementation plan
8. (Optional) Document decision rationale

**Educate Workflow Structure (6-8 steps):**

Typical flow:
1. Understand context/motivation (why it matters)
2. Learn foundational concepts (with analogies)
3. Explore key components/categories
4. Understand how it works (step-by-step)
5. Learn when/why to use different approaches
6. See real-world applications
7. Build decision framework/mental model
8. (Optional) Create personal reference

**Deploy Workflow Structure (8-12 steps):**

Typical flow:
1. Install prerequisites
2. Initialize project structure
3. Configure core component (e.g., database)
4. Build feature 1 (e.g., authentication)
5. Build feature 2 (e.g., API endpoints)
6. Build feature 3 (e.g., frontend)
7. Integrate components
8. Test locally
9. Configure production environment
10. Deploy to platform
11. Verify deployment works
12. (Optional) Setup monitoring/next steps

#### 2.3 Generate Outline

**Outline format:**

```markdown
## Proposed Workflow Outline

**Workflow Type:** [navigate/educate/deploy]
**Total Steps:** [6-8 or 8-12]
**Estimated Time:** [X-Y minutes/hours]

### Step 1: [Title]
[1-2 sentence description of what this step accomplishes]

### Step 2: [Title]
[1-2 sentence description]

[...continue for all steps...]
```

**Example Navigate Outline:**

```markdown
## Proposed Workflow Outline

**Workflow Type:** Navigate
**Total Steps:** 7
**Estimated Time:** 90-120 minutes

### Step 1: Assess Professional Video Editing Needs
Identify your client types, typical deliverables, budget constraints, and current hardware to create a requirements profile.

### Step 2: Identify Leading Video Editing Tools
Research and shortlist 4-5 professional video editing tools based on current market leaders (2025).

### Step 3: Create Feature Comparison Matrix
Compare shortlisted tools across key criteria: pricing, ease of use, key features, platform support, and learning curve.

### Step 4: Evaluate Pricing Models
Analyze total cost of ownership including licensing, subscriptions, hardware requirements, and training time.

### Step 5: Assess Workflow Integration
Evaluate how each tool integrates with your existing workflow, file formats, collaboration needs, and client requirements.

### Step 6: Make Informed Tool Selection
Synthesize comparison data to select the best-fit tool for your professional needs with clear rationale and understood tradeoffs.

### Step 7: Create Implementation Plan
Develop plan for tool adoption including purchase, training timeline, workflow migration, and client communication.
```

**Example Educate Outline:**

```markdown
## Proposed Workflow Outline

**Workflow Type:** Educate
**Total Steps:** 7
**Estimated Time:** 90-120 minutes

### Step 1: Understand Why Authentication Matters
Explore what happens without authentication (security risks, data breaches) and why it's critical for web applications.

### Step 2: Learn Core Authentication Concepts
Build mental model of authentication, authorization, and sessions using simple analogies and clear definitions.

### Step 3: Explore Authentication Methods
Discover four common authentication approaches: passwords, tokens, OAuth, and biometrics with pros/cons for each.

### Step 4: Walk Through Complete Login Flow
Step-by-step understanding of authentication process from credentials entry to token validation with diagram.

### Step 5: Learn When to Use Each Method
Build decision framework for selecting authentication method based on security, UX, complexity, and cost.

### Step 6: See Real-World Authentication Examples
Examine how familiar apps (Gmail, banking, social media) implement authentication with security best practices.

### Step 7: Build Personal Authentication Reference
Create customized guide documenting authentication concepts, decision criteria, and implementation notes for future reference.
```

**Example Deploy Outline:**

```markdown
## Proposed Workflow Outline

**Workflow Type:** Deploy
**Total Steps:** 11
**Estimated Time:** 3-4 hours

### Step 1: Install Development Prerequisites
Set up Python 3.11+, PostgreSQL 15+, Git, and Docker with verification that each tool works correctly.

### Step 2: Initialize FastAPI Project Structure
Create project scaffolding with proper folder structure, configuration files, and dependencies installed.

### Step 3: Configure PostgreSQL Database
Set up database connection, create schema with tables and relationships, and verify connection works.

### Step 4: Build Authentication API
Create user registration, login, logout, and password reset endpoints with JWT tokens and security measures.

### Step 5: Implement Core API Endpoints
Build main application endpoints with error handling, input validation, and proper HTTP status codes.

### Step 6: Add Logging and Monitoring
Integrate logging system, health check endpoint, and basic error tracking for production readiness.

### Step 7: Write Comprehensive Test Suite
Create tests covering authentication, API endpoints, error handling, and edge cases with passing results.

### Step 8: Test Application Locally
Run application locally, verify all endpoints work, test authentication flow, and fix any errors.

### Step 9: Configure Production Environment
Create Dockerfile, environment variables for production, and Render deployment configuration.

### Step 10: Deploy to Render Platform
Push to GitHub, connect to Render, configure build settings, and trigger deployment.

### Step 11: Verify Production Deployment
Test live application endpoints, verify database connection, check logging works, and confirm health check passes.
```

#### 2.4 Present Outline to User

**Present the outline and ask for feedback:**

```
Here's the proposed workflow outline:

[Show outline]

Does this structure match what you're looking for? Any steps you'd like to:
- Add (missing steps)
- Remove (not needed)
- Adjust (different focus or order)
- Clarify (need more detail on what it covers)
```

---

### Step 3: Refinement Loop

**Goal:** Iterate on outline based on user feedback until approved.

#### 3.1 Listen to User Feedback

**Common feedback types:**

**"Add a step about X"**
- Insert new step in appropriate place
- Maintain progressive flow
- Renumber subsequent steps

**"Remove step Y"**
- Delete the step
- Renumber remaining steps
- Ensure flow still makes sense

**"I don't need Z, focus more on W"**
- Remove/reduce Z coverage
- Expand W into multiple steps if needed
- Adjust scope accordingly

**"This is too basic/advanced"**
- Adjust depth level
- Change language complexity
- Modify step granularity

**"I already know X, skip to Y"**
- Remove prerequisite steps
- Start from more advanced point
- Maintain necessary context

#### 3.2 Revise Outline

Use conditional thinking to understand feedback:

```
<thinking>
User said: "I don't need pricing comparison, I already chose the tool. Focus on configuration."

This means:
- Remove pricing step (Step 4 in original outline)
- Expand configuration step into 2-3 detailed steps
- Adjust total step count
- Shift from navigate (choosing tool) to deploy (implementing tool)
- May need to change workflow type entirely
</thinking>
```

**Revise outline based on understanding:**

```markdown
## Revised Workflow Outline

**Workflow Type:** Deploy (changed from Navigate based on feedback)
**Total Steps:** 9
**Estimated Time:** 2-3 hours

### Step 1: Install Video Editing Tool
Download and install [specific tool user chose] with proper configuration for your system.

### Step 2: Configure Basic Settings
Set up project preferences, keyboard shortcuts, workspace layout, and import/export settings.

### Step 3: Configure Advanced Features
Enable GPU acceleration, optimize proxy settings, configure auto-save, and set up collaboration features.

[...continue with revised steps...]
```

#### 3.3 Get Approval

Present revised outline and ask:

```
Here's the updated outline based on your feedback:

[Show revised outline]

Does this better match what you need? Ready to proceed to detailed steps?
```

**If user approves:** Proceed to Phase 2

**If user has more feedback:** Return to Step 3.1 and iterate again

**Maximum iterations:** 3-4 rounds (if still not aligned, may need to restart discovery)

---

## Phase 2: Structured Expansion (Deterministic)

### Step 4: Read Format Specification

**Before expanding, read the format specification:**

```
Read references/workflow-format-spec.md
```

**Key requirements to note:**
- YAML metadata schema (required fields)
- Step format template (title, instruction, deliverable)
- Instruction writing guidelines (3-5 lines maximum)
- Deliverable writing guidelines (10-20 words, tangible)
- Validation rules

---

### Step 5: Expand Each Step to Detailed Format

**For each step in approved outline, create detailed step with:**

1. **Step Number and Title** (3-5 words, action verb)
2. **Instruction** (3-5 lines, Claude usage specified)
3. **Deliverable** (10-20 words, concrete outcome)

**Step Format Template:**

```markdown
## Step X: Action-Oriented Title

**Instruction:**

```text
Line 1: Ask/Request/Have [Claude/Claude Code] to [action] covering [key points]
Line 2-3: [List 3-5 key dimensions, parameters, or requirements]
Line 4-5: [Optional: specify format, reference earlier steps, or validation]
```

**Deliverable:** _Concrete, measurable outcome in 10-20 words_
```

**Example Expansion:**

**From outline:**
> Step 3: Create Feature Comparison Matrix
> Compare shortlisted tools across key criteria: pricing, ease of use, features, platform support, learning curve.

**Expanded to detailed step:**

```markdown
## Step 3: Create Feature Comparison Matrix

**Instruction:**

```text
Ask Claude to create a comparison table for the 4 shortlisted tools covering:
pricing, ease of use, key features, platform support, and learning curve.
Request that Claude highlight which tool best fits your specific requirements.
```

**Deliverable:** _Comparison matrix with 4 tools rated across 5 criteria with personalized recommendation_
```

**Expansion Process:**

For each step:

1. **Read outline step** - understand the goal
2. **Choose appropriate pattern** - from references/common-patterns.md
3. **Adapt pattern** - to specific context from user's answers
4. **Verify requirements:**
   - Instruction is 3-5 lines
   - Claude/Claude Code usage specified
   - Deliverable is 10-20 words
   - Deliverable is concrete and measurable
5. **Check progressive flow** - builds on previous steps

---

### Step 6: Add Metadata

**Create complete YAML frontmatter:**

```yaml
---
title: "Workflow Title in Title Case"
description: "lowercase description in 10-25 words, actionable and specific"
type: "navigate" # or "educate" or "deploy"
workflow_id: "workflow_YYYYMMDD_NNN"
version: "1.0"
author: "Claude Code with gitthub-workflow skill"
created_date: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
estimated_time: "90-120 minutes" # or "2-3 hours" for deploy
total_steps: 7 # or 6-8 (navigate/educate) or 8-12 (deploy)
difficulty: "beginner" # or "intermediate" or "advanced"
tags:
  - "navigate" # or "educate" or "deploy"
  - "specific-topic"
  - "domain"
  - "tool-or-platform"
prerequisites:
  - "Basic computer skills"
  - "Specific requirement if applicable"
tools_required:
  - "Access to Claude or Claude Code"
  - "Specific tools for deploy workflows"
target_audience: "Enthusiastic computer users exploring [topic]"
---
```

**Field Guidelines:**

- **title:** 3-8 words, Title Case, descriptive
- **description:** 10-25 words, lowercase, actionable (e.g., "compare...", "learn...", "deploy...")
- **type:** Must be "navigate", "educate", or "deploy"
- **workflow_id:** Format: `workflow_YYYYMMDD_NNN`
- **estimated_time:** "X-Y minutes" (navigate/educate) or "X-Y hours" (deploy)
- **total_steps:** 6-8 (navigate/educate) or 8-12 (deploy)
- **difficulty:** "beginner", "intermediate", or "advanced"
- **tags:** Always include type + 2-4 specific tags
- **prerequisites:** List 1-3 requirements
- **tools_required:** List specific tools (always include "Access to Claude")
- **target_audience:** Brief description of who workflow is for

---

### Step 7: Add Completion Section

**After all steps, add completion guidance:**

```markdown
---

## Workflow Complete! 🎉

You've successfully [completed outcome based on workflow type].

**What you've accomplished:**
- [Key deliverable 1]
- [Key deliverable 2]
- [Key deliverable 3]

**Next Steps:**
- [Optional next action 1]
- [Optional next action 2]
- [Optional next action 3]

**Tips for Success:**
1. [Tip related to maintenance/improvement]
2. [Tip related to common gotcha]
3. [Tip related to advanced usage]
```

**Examples:**

**Navigate completion:**
```markdown
## Workflow Complete! 🎉

You've successfully selected the best video editing tool for your professional needs.

**What you've accomplished:**
- Comprehensive requirements assessment
- Comparison of leading tools across key criteria
- Informed decision with clear rationale
- Implementation plan for tool adoption

**Next Steps:**
- Purchase or trial the selected tool
- Complete onboarding/training
- Migrate one project to test workflow
- Gradually transition all projects

**Tips for Success:**
1. Document your workflows as you learn - build your own reference
2. Join the tool's community for tips and troubleshooting
3. Revisit this comparison in 12 months as tools evolve
```

**Educate completion:**
```markdown
## Workflow Complete! 🎉

You've successfully built a comprehensive understanding of authentication concepts.

**What you've accomplished:**
- Deep understanding of why authentication matters
- Clear mental model of authentication fundamentals
- Knowledge of when to use different authentication methods
- Decision framework for selecting approaches
- Personal reference document for future projects

**Next Steps:**
- Implement authentication in a practice project
- Explore advanced topics (2FA, OAuth flows, session management)
- Study real-world authentication implementations
- Keep reference document updated as you learn more

**Tips for Success:**
1. Security evolves - revisit best practices regularly
2. Test authentication flows thoroughly in your projects
3. Never store passwords in plain text - always hash
```

**Deploy completion:**
```markdown
## Workflow Complete! 🎉

You've successfully deployed your FastAPI application to Render with production configuration.

**What you've accomplished:**
- Complete FastAPI application with authentication
- Comprehensive test suite with passing tests
- Production-ready configuration with security measures
- Live deployment on Render platform
- Verified end-to-end functionality

**Next Steps:**
- Add monitoring and alerting (Sentry, LogRocket)
- Set up CI/CD pipeline for automatic deployments
- Implement rate limiting and caching
- Add API documentation with Swagger/OpenAPI
- Consider scaling strategy as traffic grows

**Tips for Success:**
1. Monitor logs regularly for errors and performance issues
2. Keep dependencies updated for security patches
3. Back up database regularly and test restore process
```

---

### Step 8: Present Workflow and Storage Instructions

**DO NOT save the workflow file yourself. Instead, present it to the user with clear storage instructions.**

**Action:**
1. Display the complete workflow markdown content
2. Provide clear directory structure instructions
3. Let user save it to the correct location

**Directory Structure to Communicate:**

```
vault-website/workflows/workflow_YYYYMMDD_NNN_snake_case_title/
├── WORKFLOW.md         # Save the generated workflow here
└── references/         # Empty folder for future screenshots, code, configs
```

**Naming Components:**
1. **Date:** Current date in YYYYMMDD format (e.g., 20251115)
2. **Sequential number:** 001, 002, 003... (3 digits with leading zeros)
3. **Title:** Workflow title in snake_case (lowercase, underscores)

**Example directory name:**
```
workflow_20251115_012_deploy_fastapi_app_to_render/
```

**How to determine sequential number:**
1. Check existing workflow directories in `vault-website/workflows/` with current date pattern
2. Find highest `NNN` number used today
3. Suggest next number (add 1 and format with leading zeros)

**Example:**
```
If today is 2025-11-15 and existing directories are:
- workflow_20251115_001_deploy_fastapi_to_render/
- workflow_20251115_002_educate_authentication_concepts/

Suggest next directory:
- workflow_20251115_003_[your_workflow_title]/
```

**Convert title to snake_case:**
1. Take workflow title from metadata
2. Convert to lowercase
3. Replace spaces with underscores
4. Remove special characters (except underscores)

**Examples:**
- "Deploy FastAPI App to Render" → `deploy_fastapi_app_to_render`
- "Navigate Professional Video Editing Tool Selection" → `navigate_professional_video_editing_tool_selection`
- "Educate: Authentication Concepts" → `educate_authentication_concepts`

**See:** `references/format-standards/file-naming-conventions.md` for complete details

---

### Step 9: Present Complete Workflow to User

**Present the workflow with storage instructions:**

**Message Template:**
```
I've generated your [navigate/educate/deploy] workflow!

📋 **Workflow Title:** [Title]
⏱️ **Estimated Time:** [X-Y minutes/hours]
📝 **Total Steps:** [N]

**To save this workflow:**

1. Create directory:
   `vault-website/workflows/workflow_YYYYMMDD_NNN_snake_case_title/`

2. Create empty subdirectory:
   `vault-website/workflows/workflow_YYYYMMDD_NNN_snake_case_title/references/`

3. Save the workflow content below as:
   `vault-website/workflows/workflow_YYYYMMDD_NNN_snake_case_title/WORKFLOW.md`

**Suggested directory name for today:**
`workflow_YYYYMMDD_NNN_[snake_case_title]/`

---

[COMPLETE WORKFLOW MARKDOWN CONTENT HERE]

---

This workflow will guide you through [brief outcome description].
```

**Example:**
```
I've generated your deploy workflow!

📋 **Workflow Title:** Deploy FastAPI App to Render
⏱️ **Estimated Time:** 2-3 hours
📝 **Total Steps:** 10

**To save this workflow:**

1. Create directory:
   `vault-website/workflows/workflow_20251115_003_deploy_fastapi_app_to_render/`

2. Create empty subdirectory:
   `vault-website/workflows/workflow_20251115_003_deploy_fastapi_app_to_render/references/`

3. Save the workflow content below as:
   `vault-website/workflows/workflow_20251115_003_deploy_fastapi_app_to_render/WORKFLOW.md`

**Suggested directory name for today:**
`workflow_20251115_003_deploy_fastapi_app_to_render/`

---

[COMPLETE WORKFLOW MARKDOWN CONTENT]

---

This workflow will guide you through deploying a production-ready FastAPI application to Render with proper configuration and security.
```

---

## Process Checklist

### Phase 1 Checklist

- [ ] Used extended thinking (5-10+ lines analyzing request)
- [ ] Performed web search for current best practices (2025)
- [ ] Used AskUserQuestion tool (2-4 interactive questions)
- [ ] Read appropriate type guide (navigate/educate/deploy)
- [ ] Generated outline with correct step count (6-8 or 8-12)
- [ ] Presented outline to user
- [ ] Incorporated user feedback
- [ ] Got user approval before proceeding to Phase 2

### Phase 2 Checklist

- [ ] Read format specification (workflow-format-spec.md)
- [ ] Expanded each step with 3-5 line instructions
- [ ] All instructions specify Claude or Claude Code usage
- [ ] All deliverables are 10-20 words and concrete
- [ ] Steps are atomic (single action each)
- [ ] Steps flow progressively
- [ ] Added complete YAML metadata
- [ ] Added completion section with next steps and tips
- [ ] Determined correct directory name (workflow_YYYYMMDD_NNN_snake_case_title/)
- [ ] Presented complete workflow markdown to user
- [ ] Provided clear storage instructions (directory + WORKFLOW.md + references/)
- [ ] Did NOT save file yourself (let user save it)

---

## Common Process Mistakes

### Mistake 1: Skipping Discovery
**Problem:** Jumping straight to outline without thinking/asking
**Fix:** Always complete discovery phase (thinking + search + questions)

### Mistake 2: Wrong Workflow Type
**Problem:** Creating navigate when user wants educate
**Fix:** Analyze intent carefully during discovery

### Mistake 3: Skipping Refinement
**Problem:** Expanding without user approval of outline
**Fix:** Always present outline and get feedback before Phase 2

### Mistake 4: Ignoring Format Spec
**Problem:** Creating steps that don't follow format requirements
**Fix:** Read format spec before expanding, check each step

### Mistake 5: Wrong File Location
**Problem:** Saving to wrong directory or with wrong naming format
**Fix:** Always save to vault-website/workflows/ with standard naming

---

This process guide ensures consistent, high-quality workflow generation from discovery through delivery.
