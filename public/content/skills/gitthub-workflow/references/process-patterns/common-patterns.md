# Common Workflow Patterns

This document provides a comprehensive library of good and poor instruction patterns, action verb examples, and deliverable formats for gitthub workflows.

---

## Table of Contents

1. [Action Verb Library](#action-verb-library)
2. [Good Instruction Patterns](#good-instruction-patterns)
3. [Poor Instruction Patterns](#poor-instruction-patterns)
4. [Deliverable Format Examples](#deliverable-format-examples)
5. [Claude Usage Patterns](#claude-usage-patterns)
6. [Step Title Patterns](#step-title-patterns)

---

## Action Verb Library

### For Navigate Workflows (Comparison/Decision)

**Discovery & Analysis:**
- Identify, Discover, Assess, Analyze, Evaluate, Explore
- "Identify candidate tools for your use case"
- "Assess your requirements and constraints"
- "Analyze current market options"

**Comparison:**
- Compare, Contrast, Evaluate, Rate, Score, Rank
- "Compare pricing models across platforms"
- "Evaluate tools against your criteria"
- "Score options based on priorities"

**Decision-Making:**
- Choose, Select, Decide, Determine, Recommend, Pick
- "Select the best-fit tool"
- "Decide on deployment platform"
- "Determine optimal approach"

### For Educate Workflows (Learning/Understanding)

**Understanding:**
- Understand, Learn, Explore, Discover, Grasp, Comprehend
- "Understand why authentication matters"
- "Learn core API fundamentals"
- "Explore different database types"

**Building Knowledge:**
- Build, Create, Develop, Establish, Construct, Form
- "Build mental model of authentication"
- "Create decision framework"
- "Develop understanding of REST principles"

**Applying:**
- Apply, Practice, Use, Implement, Exercise, Try
- "Apply concepts to your use case"
- "Practice with real examples"
- "Use framework to solve problem"

### For Deploy Workflows (Implementation)

**Setup & Configuration:**
- Install, Setup, Configure, Initialize, Prepare, Establish
- "Install required dependencies"
- "Configure database connection"
- "Initialize project structure"

**Building:**
- Build, Create, Generate, Develop, Implement, Write
- "Build authentication API"
- "Create database schema"
- "Generate configuration files"

**Testing & Validation:**
- Test, Verify, Validate, Check, Confirm, Ensure
- "Test application locally"
- "Verify database connection"
- "Validate API endpoints work"

**Deployment:**
- Deploy, Launch, Publish, Release, Ship, Go-live
- "Deploy to Render platform"
- "Launch production instance"
- "Publish to production environment"

---

## Good Instruction Patterns

### Navigate Workflow Instructions

#### Pattern 1: Requirements Assessment
```text
Ask Claude to guide you through a requirements assessment covering: [criteria 1],
[criteria 2], [criteria 3], and [criteria 4]. Request that Claude organize
your answers into a priority matrix for tool selection.
```

**Example:**
```text
Ask Claude to guide you through a professional needs assessment covering:
client project types, typical deliverables, budget constraints, and current
hardware. Request that Claude organize your answers into a requirements profile.
```

#### Pattern 2: Option Identification
```text
Request Claude to identify [number] leading [options] for your use case based
on current market research (2025). Ask for brief description of each [option's]
primary strengths and typical users.
```

**Example:**
```text
Request Claude to identify 4-5 leading video editing tools for professional
use based on current market research (2025). Ask for brief description of
each tool's primary strengths and typical users.
```

#### Pattern 3: Comparison Matrix Creation
```text
Ask Claude to create a comparison table for the [options] covering: [criterion 1],
[criterion 2], [criterion 3], [criterion 4], and [criterion 5]. Request scoring
based on your priorities from Step 1.
```

**Example:**
```text
Ask Claude to create a comparison table for the shortlisted tools covering:
pricing, ease of use, key features, platform support, and learning curve.
Request scoring based on your priorities from Step 1.
```

#### Pattern 4: Recommendation with Rationale
```text
Request Claude to analyze the comparison and recommend the best-fit [option]
for your requirements. Ask for clear rationale, potential tradeoffs, and any
deal-breakers to confirm before committing.
```

**Example:**
```text
Request Claude to analyze the comparison matrix and recommend the best-fit
tool for your requirements. Ask for clear rationale, potential tradeoffs,
and any deal-breakers to confirm before committing to purchase.
```

### Educate Workflow Instructions

#### Pattern 1: Context and Motivation
```text
Ask Claude to explain why [topic] matters by exploring what happens without it
([problem 1], [problem 2], [problem 3]). Request real-world examples of
[failures or successes] to illustrate the importance.
```

**Example:**
```text
Ask Claude to explain why authentication matters by exploring what happens
without it (security risks, data breaches, impersonation). Request real-world
examples of authentication failures to illustrate the importance.
```

#### Pattern 2: Foundational Concepts with Analogies
```text
Request Claude to explain [concept 1], [concept 2], and [concept 3] using
simple analogies (like [familiar example]). Have Claude create a comparison
table showing differences and when each applies.
```

**Example:**
```text
Request Claude to explain authentication, authorization, and sessions using
simple analogies (like hotel key cards and building access). Have Claude
create a comparison table showing differences and when each applies.
```

#### Pattern 3: Component Breakdown
```text
Ask Claude to present [number] common [approaches/methods/types] for [topic]:
[option 1], [option 2], [option 3]. Request explanation of how each works,
pros/cons, and typical use cases with familiar examples.
```

**Example:**
```text
Ask Claude to present four common authentication methods: passwords, tokens,
OAuth, and biometrics. Request explanation of how each works, pros/cons,
and typical use cases with familiar examples (Gmail, banking apps).
```

#### Pattern 4: Step-by-Step Walkthrough
```text
Have Claude walk through a complete [process/flow] step-by-step from [starting point]
to [ending point]. Request detailed explanation of each step including [component 1],
[component 2], and [component 3] interactions with visual diagram.
```

**Example:**
```text
Have Claude walk through a complete authentication flow step-by-step from
user entering credentials to receiving access token. Request detailed explanation
of each step including browser, server, and database interactions with diagram.
```

#### Pattern 5: Decision Framework Creation
```text
Ask Claude to create decision framework showing when to choose [option 1] vs.
[option 2] vs. [option 3] based on: [criterion 1], [criterion 2], [criterion 3],
and [criterion 4]. Request specific scenarios for each approach.
```

**Example:**
```text
Ask Claude to create decision framework showing when to choose passwords vs.
tokens vs. OAuth vs. biometrics based on: security needs, user experience,
implementation complexity, and cost. Request specific scenarios for each.
```

### Deploy Workflow Instructions

#### Pattern 1: Prerequisites Installation
```text
Ask Claude to verify system requirements and guide installation of: [tool 1],
[tool 2], [tool 3], and [tool 4]. Request Claude provide installation commands
for your operating system and verification steps to confirm setup.
```

**Example:**
```text
Ask Claude to verify system requirements and guide installation of: Node.js 18+,
PostgreSQL 15+, Git, and Docker. Request Claude provide installation commands
for your operating system and verification steps to confirm each works.
```

#### Pattern 2: Project Initialization
```text
Use Claude Code to generate initial project structure with: [component 1],
[component 2], [component 3], and [component 4]. Request Claude include all
dependencies and setup scripts.
```

**Example:**
```text
Use Claude Code to generate initial project structure with: package.json,
database config, environment variables template, and folder structure (src,
routes, models, tests). Request Claude include all dependencies and setup scripts.
```

#### Pattern 3: Configuration Setup
```text
Have Claude Code create [configuration type] file with [setting 1], [setting 2],
and [setting 3]. Request [additional requirement 1] and [additional requirement 2].
Include [validation step] to verify configuration works.
```

**Example:**
```text
Have Claude Code create database schema file with user tables, relationships,
and indexes. Request connection pooling configuration and migration files.
Include test query to verify database connection works.
```

#### Pattern 4: Feature Implementation
```text
Use Claude Code to generate [feature/component] including: [part 1], [part 2],
and [part 3] with [requirement 1]. Request error handling, input validation,
and [requirement 2]. Ask Claude to create test file.
```

**Example:**
```text
Use Claude Code to generate authentication endpoints including: register, login,
logout, and password reset with JWT tokens. Request error handling, input
validation, and password hashing. Ask Claude to create test file for each endpoint.
```

#### Pattern 5: Testing and Validation
```text
Request Claude to create test suite covering [component 1], [component 2], and
[component 3]. Use Claude Code to run tests, identify failures, and fix errors.
Have Claude verify [validation 1] and [validation 2] work correctly.
```

**Example:**
```text
Request Claude to create test suite covering all API endpoints and authentication
flow. Use Claude Code to run tests, identify failures, and fix errors. Have
Claude verify database operations and error handling work correctly.
```

#### Pattern 6: Deployment Configuration
```text
Have Claude Code generate production configuration: [config 1], [config 2],
[config 3], and deployment script for [platform]. Request Claude include
[requirement 1], [requirement 2], and [requirement 3].
```

**Example:**
```text
Have Claude Code generate production configuration: Dockerfile, docker-compose.yml,
environment variables, and deployment script for Render. Request Claude include
security settings, CORS configuration, and health check endpoint.
```

#### Pattern 7: Production Verification
```text
Request Claude to create verification checklist: test [item 1], verify [item 2],
check [item 3], test [item 4], and confirm [item 5]. Have Claude help troubleshoot
any issues discovered during verification.
```

**Example:**
```text
Request Claude to create verification checklist: test all endpoints on live URL,
verify database connections, check authentication flow, test error handling,
and confirm logging works. Have Claude help troubleshoot any issues.
```

---

## Poor Instruction Patterns (Avoid These)

### Anti-Pattern 1: No Claude Usage Specified
```text
❌ Set up your development environment
❌ Create a comparison table
❌ Research authentication methods
❌ Deploy to production
```

**Problem:** Doesn't specify how to use Claude or Claude Code

**Fix:**
```text
✅ Ask Claude to guide you through development environment setup...
✅ Request Claude to create a comparison table...
✅ Have Claude explain authentication methods...
✅ Use Claude Code to deploy to production with...
```

### Anti-Pattern 2: Too Vague
```text
❌ Learn about APIs
❌ Understand deployment
❌ Configure the database
❌ Do testing
```

**Problem:** No specific action, outcome, or Claude usage

**Fix:**
```text
✅ Ask Claude to explain APIs using a simple analogy, covering...
✅ Have Claude walk through deployment process step-by-step...
✅ Use Claude Code to create database configuration with...
✅ Request Claude to create test suite covering...
```

### Anti-Pattern 3: Multiple Sub-Tasks in One Step
```text
❌ Research tools, compare features, create table, and make decision
❌ Install dependencies, configure database, write schema, and test connection
❌ Build API, add authentication, write tests, and deploy
```

**Problem:** 3-5 separate actions crammed into one step

**Fix:** Break into separate atomic steps (one action each)

### Anti-Pattern 4: Way Too Long (10+ Lines)
```text
❌ Ask Claude to create a comprehensive comparison table for video editing tools.
The table should include the following criteria:

1. Pricing (monthly, annual, one-time)
2. Ease of use rating (1-10)
3. Key features (list top 5)
4. Platform support (Windows, Mac, Linux)
5. Learning curve (beginner, intermediate, advanced)
6. Export formats supported
7. Collaboration features
8. Customer support quality
9. Community size
10. Performance with 4K video

Request that Claude highlight which tool fits your budget and needs.
```

**Problem:** 15+ lines, overwhelming detail

**Fix:**
```text
✅ Ask Claude to create comparison table for shortlisted tools covering: pricing,
ease of use, key features, platform support, and learning curve. Request
personalized recommendation based on your requirements from Step 1.
```

### Anti-Pattern 5: No Concrete Deliverable
```text
❌ Better understanding (of what?)
❌ Research complete (what was learned?)
❌ Configuration done (what got configured?)
❌ Files created (which files?)
```

**Problem:** Vague, unmeasurable outcomes

**Fix:**
```text
✅ Clear mental model of authentication with security best practices
✅ List of 5 candidate tools with descriptions and typical use cases
✅ Database configuration file with connection pooling and migration scripts
✅ Complete project structure with package.json, main.py, and config files
```

### Anti-Pattern 6: Not Action-Oriented
```text
❌ Authentication is important for security
❌ There are several deployment options available
❌ APIs allow different applications to communicate
❌ Testing ensures code quality
```

**Problem:** Descriptive statements, not actionable instructions

**Fix:**
```text
✅ Ask Claude to explain why authentication matters by exploring...
✅ Request Claude to present 3-4 deployment options with tradeoffs...
✅ Have Claude explain how APIs work using a simple analogy...
✅ Use Claude Code to create test suite covering...
```

### Anti-Pattern 7: Assumes Manual Implementation
```text
❌ Manually create a table with pricing for each tool
❌ Write code for authentication endpoints
❌ Type out configuration file with database settings
❌ Search Google for video editing tools
```

**Problem:** Doesn't leverage Claude/Claude Code

**Fix:**
```text
✅ Ask Claude to create pricing comparison table...
✅ Use Claude Code to generate authentication endpoints...
✅ Have Claude Code create configuration file with...
✅ Request Claude to identify leading video editing tools based on 2025 research...
```

---

## Deliverable Format Examples

### Good Deliverables (Concrete, Specific, 10-20 Words)

**Navigate Workflows:**
- _Requirements profile with prioritized criteria and constraints documented_
- _List of 5 candidate tools with descriptions and target users_
- _Comparison matrix with tools rated across 6 criteria_
- _Final tool selection with clear rationale and understood tradeoffs_
- _Implementation plan with timeline and resource requirements_

**Educate Workflows:**
- _Understanding of why authentication matters with real-world security examples_
- _Clear mental model of authentication fundamentals with analogies_
- _Structured overview of 4 authentication methods with pros/cons_
- _Step-by-step understanding of complete authentication flow with diagram_
- _Decision framework for selecting authentication method based on use case_

**Deploy Workflows:**
- _Development environment with Node.js, PostgreSQL, Git, and Docker verified_
- _Complete project structure with configuration files and dependencies installed_
- _Database schema created, migrations applied, and connection verified_
- _Authentication API with working endpoints, security measures, and tests_
- _Passing test suite confirming all functionality works locally_
- _Production configuration with Dockerfile, environment variables, and deployment script_
- _Live deployment on Render with verified health check and functionality_

### Bad Deliverables (Vague, Unmeasurable)

- ❌ _Better understanding_ (of what? how to verify?)
- ❌ _Research complete_ (what did you learn?)
- ❌ _Comparison table_ (what's in it? how many options?)
- ❌ _Configuration done_ (what got configured?)
- ❌ _Files created_ (which files? what's in them?)
- ❌ _Decision made_ (what was decided? rationale?)
- ❌ _Deployment_ (where? is it working?)
- ❌ _Tests_ (which tests? are they passing?)
- ❌ _Understanding_ (of what topic? to what depth?)
- ❌ _Setup complete_ (what was set up? verified how?)

---

## Claude Usage Patterns

### Asking Claude for Explanations

**Pattern:**
```text
Ask Claude to explain [concept] using [format/approach]
```

**Examples:**
- Ask Claude to explain REST APIs using a simple analogy (like a restaurant menu)
- Ask Claude to explain authentication by walking through what happens during login
- Ask Claude to explain deployment by comparing it to publishing a book
- Ask Claude to explain databases using a filing cabinet metaphor

### Requesting Claude to Create Artifacts

**Pattern:**
```text
Request Claude to create [artifact] covering [key points]
```

**Examples:**
- Request Claude to create a comparison table covering pricing, features, and ease of use
- Request Claude to create a decision matrix showing tradeoffs between options
- Request Claude to create a step-by-step walkthrough of the deployment process
- Request Claude to create a visual diagram showing authentication flow

### Having Claude Provide Guidance

**Pattern:**
```text
Have Claude [guide/walk through/help with] [task/process]
```

**Examples:**
- Have Claude guide you through requirements assessment
- Have Claude walk through the complete authentication flow step-by-step
- Have Claude help you troubleshoot deployment errors
- Have Claude provide recommendations based on your priorities

### Using Claude Code for Implementation

**Pattern:**
```text
Use Claude Code to [generate/create/write] [artifact/code]
```

**Examples:**
- Use Claude Code to generate initial project structure with configuration files
- Use Claude Code to create database schema with tables and indexes
- Use Claude Code to write API endpoints with error handling
- Use Claude Code to generate deployment configuration for Render

### Requesting Claude Code to Include Features

**Pattern:**
```text
Request [error handling/validation/logging/comments/tests]
```

**Examples:**
- Request error handling for all API endpoints
- Request input validation using Pydantic models
- Request logging setup with different severity levels
- Request comments explaining the purpose of each section
- Request test file with success and error cases

---

## Step Title Patterns

### Navigate Workflow Titles (3-5 words, action verb)

**Discovery Phase:**
- "Assess Requirements and Constraints"
- "Identify Use Case Priorities"
- "Define Selection Criteria"

**Research Phase:**
- "Identify Candidate Tools"
- "Research Available Options"
- "Discover Leading Platforms"

**Comparison Phase:**
- "Create Comparison Matrix"
- "Compare Pricing Models"
- "Evaluate Feature Sets"
- "Analyze Tradeoffs"

**Decision Phase:**
- "Select Best-Fit Tool"
- "Make Informed Decision"
- "Choose Final Platform"
- "Finalize Tool Selection"

### Educate Workflow Titles (3-5 words, action verb)

**Context Phase:**
- "Understand Why [Topic] Matters"
- "Explore [Topic] Motivation"
- "Discover [Topic] Importance"

**Foundation Phase:**
- "Learn Core [Topic] Fundamentals"
- "Build [Concept] Mental Model"
- "Understand [Topic] Basics"

**Exploration Phase:**
- "Explore [Topic] Categories"
- "Break Down [System] Components"
- "Understand [Topic] Types"

**Application Phase:**
- "See Real-World Applications"
- "Apply Concepts Practically"
- "Build Decision Framework"
- "Create Personal Reference"

### Deploy Workflow Titles (3-5 words, action verb)

**Setup Phase:**
- "Install Required Tools"
- "Configure Development Environment"
- "Initialize Project Structure"

**Implementation Phase:**
- "Configure Database Connection"
- "Build Authentication API"
- "Create Frontend Interface"
- "Implement Core Features"

**Testing Phase:**
- "Test Application Locally"
- "Verify Functionality Works"
- "Run Comprehensive Tests"

**Deployment Phase:**
- "Configure Production Environment"
- "Deploy to Render"
- "Launch on Platform"

**Verification Phase:**
- "Verify Deployment Works"
- "Confirm Production Functionality"
- "Validate End-to-End Flow"

---

## Pattern Selection Guide

### When to Use Each Pattern

**Navigate Pattern Selection:**
- Requirements assessment → Use Pattern 1
- Finding options → Use Pattern 2
- Comparing options → Use Pattern 3
- Making decision → Use Pattern 4

**Educate Pattern Selection:**
- Motivation/context → Use Pattern 1
- Core concepts → Use Pattern 2
- Components/types → Use Pattern 3
- How it works → Use Pattern 4
- Decision criteria → Use Pattern 5

**Deploy Pattern Selection:**
- Installing tools → Use Pattern 1
- Project setup → Use Pattern 2
- Configuration → Use Pattern 3
- Building features → Use Pattern 4
- Testing → Use Pattern 5
- Deployment prep → Use Pattern 6
- Verification → Use Pattern 7

---

## Quality Check Questions

Before finalizing any instruction, ask:

1. **Is Claude usage specified?** (Ask Claude.../Use Claude Code...)
2. **Is it 3-5 lines?** (not 1 line, not 10+ lines)
3. **Is it focused on key points?** (not exhaustive details)
4. **Does it start with action verb?** (Ask, Request, Have, Use)
5. **Is the deliverable concrete?** (specific artifact, 10-20 words)
6. **Is it atomic?** (single action, not multiple sub-tasks)
7. **Does it build on previous steps?** (progressive flow)
8. **Can user verify completion?** (tangible outcome)

If answer to any question is NO, revise the instruction.

---

This pattern library provides templates and examples for creating high-quality workflow instructions across all types.
