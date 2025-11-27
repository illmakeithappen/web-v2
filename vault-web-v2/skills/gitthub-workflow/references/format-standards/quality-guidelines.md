# Workflow Quality Guidelines

This document defines quality standards for all gitthub workflows across navigate, educate, and deploy types.

---

## Target Audience

### Primary User Profile
**Enthusiastic computer users** (not professional developers)

**Characteristics:**
- Curious and motivated to learn
- Basic computer literacy (can navigate files, use browsers, install software)
- May have some coding exposure but not professional developers
- Want to accomplish specific goals with AI assistance
- Need clear guidance but can follow detailed instructions
- Comfortable asking AI for help

**NOT the target audience:**
- Professional software engineers (they don't need workflows)
- Complete computer novices (workflows assume basic literacy)
- Academic researchers (different needs)
- Enterprise teams (different scale)

**Why this matters:**
- Use simple, clear language (avoid jargon or explain it)
- Provide context and motivation (not just commands)
- Assume Claude/Claude Code usage (not manual implementation)
- Focus on practical outcomes (not theoretical understanding)

---

## Language and Tone

### Language Standards

**Simple and Clear:**
- ✅ "Ask Claude to create a comparison table"
- ❌ "Instantiate a comparative matrix utilizing LLM capabilities"

**Avoid unnecessary jargon:**
- ✅ "Request Claude to explain authentication using a simple analogy"
- ❌ "Leverage the LLM to elucidate identity verification protocols"

**When technical terms are needed, explain them:**
- ✅ "Have Claude explain REST APIs (a way for apps to talk to each other) with examples"
- ❌ "Learn about REST APIs" (no context or explanation)

### Tone Standards

**Instructional but friendly:**
- Use second person ("you")
- Be encouraging but not patronizing
- Focus on action, not description
- Assume intelligence, provide clarity

**Good tone examples:**
- "Ask Claude to guide you through..."
- "Request Claude to create..."
- "Have Claude explain... using simple analogies"

**Poor tone examples:**
- "Obviously, you should..." (patronizing)
- "The user must configure..." (too formal/distant)
- "Just do X" (too casual, unclear)

**Instructional focus:**
- Every step tells user what to DO
- Every instruction specifies HOW to use Claude
- Every deliverable states WHAT you'll have when done

---

## Workflow-Wide Standards

### 1. Action-Oriented Guidance

**Every step must:**
- Start with an action verb (Ask, Request, Have, Use, Create, Build, etc.)
- Specify how to use Claude or Claude Code
- Lead to a tangible deliverable

**Good examples:**
- "Ask Claude to create a comparison table..."
- "Use Claude Code to generate configuration files..."
- "Request Claude to explain authentication concepts..."

**Bad examples:**
- "Authentication is important" (descriptive, not actionable)
- "Learn about APIs" (vague, no Claude usage specified)
- "Understand deployment" (no action, no deliverable)

### 2. Claude/Claude Code Integration

**Every instruction must specify:**
- Which tool to use (Claude or Claude Code)
- What to ask for or request
- What format or structure to expect

**Claude vs. Claude Code:**
- **Claude:** Explanations, comparisons, analysis, guidance, learning
- **Claude Code:** File generation, code writing, configuration creation, implementation

**Good Claude usage:**
- "Ask Claude to explain the difference between..."
- "Request Claude to create a comparison table..."
- "Have Claude walk through the authentication flow..."

**Good Claude Code usage:**
- "Use Claude Code to generate database schema files..."
- "Request Claude Code to create the project structure..."
- "Have Claude Code write configuration files with..."

**Bad (no tool specified):**
- "Create a comparison table" (who creates it?)
- "Generate configuration files" (how?)
- "Research authentication methods" (using what?)

### 3. Measurable Deliverables

**Every step must produce something tangible:**
- A document, file, decision, understanding, plan, or configuration
- Something the user can verify exists
- Something that enables the next step

**Good deliverables (specific, tangible):**
- "Comparison table with 4 tools rated across 6 criteria"
- "Complete schema.sql file with table definitions and indexes"
- "Clear understanding of when to use REST vs GraphQL with decision criteria"
- "Project structure with configuration files and dependencies installed"

**Bad deliverables (vague, unmeasurable):**
- "Better understanding" (of what? how to verify?)
- "Configured system" (what got configured?)
- "Research complete" (what was learned?)
- "Files created" (which files? what's in them?)

### 4. Progressive Flow

**Each step must:**
- Build on previous steps
- Produce output needed for next steps
- Maintain momentum toward final goal
- Be completable before moving to next step

**Good flow example (deploy workflow):**
1. Install prerequisites → Environment ready
2. Initialize project → Project structure created
3. Configure database → Database connected and tested
4. Build API endpoints → Working API with tests
5. Test locally → Verified functionality
6. Deploy to production → Live deployment

**Bad flow example:**
1. Install tools
2. Deploy to production ← Can't do this without building anything first
3. Configure database ← Should happen before deployment
4. Test ← Too late, already deployed

### 5. Completable as Single Action

**Each step is ONE action, not multiple sub-tasks:**

**Good (single action):**
- "Ask Claude to create a comparison table showing pros, cons, and costs for each approach"
- "Use Claude Code to generate the project structure with configuration files"

**Bad (multiple sub-tasks):**
- "Research tools, compare features, create table, and make decision" ← This is 4 steps
- "Install dependencies, configure database, write schema, and test connection" ← This is 4 steps

**If instruction lists 3+ sub-tasks, break into multiple steps**

---

## Step-Specific Standards

### Title Requirements

**Format:** 3-5 words, action verb

**Good examples:**
- "Compare Tool Pricing Models"
- "Create Decision Matrix"
- "Deploy to Render"
- "Test Authentication Flow"

**Bad examples:**
- "Comparison" (no action verb, too short)
- "Create a comprehensive comparison table showing all features" (too long)
- "Learn" (too vague)

### Instruction Requirements

**CRITICAL: Length Limit**
- **3-5 lines maximum** (not 10, 20, or 30+ lines)
- Be concise and focused
- List key points only
- Users can ask Claude for details during execution

**Good instruction examples (3-5 lines):**

Example 1 (3 lines):
```text
Ask Claude to create a comparison table for the shortlisted tools covering:
pricing, ease of use, key features, platform support, and learning curve.
Request that Claude highlight which tool best fits your specific requirements.
```

Example 2 (4 lines):
```text
Use Claude Code to generate the initial FastAPI project structure including:
main.py, routers, models, database configuration, and requirements.txt.
Request error handling, logging setup, and basic health check endpoint.
Have Claude Code add comments explaining key sections.
```

Example 3 (5 lines):
```text
Request Claude to walk through a complete authentication flow step-by-step,
covering: user login, token generation, token validation, session management,
and logout. Ask for a visual diagram or sequence showing browser, server, and
database interactions. Have Claude explain potential security vulnerabilities
at each step and how to prevent them.
```

**Bad instruction examples (too long):**

Example 1 (15 lines - TOO LONG):
```text
Ask Claude to create a comprehensive comparison table for video editing tools.
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

Request that Claude highlight which tool best fits your budget and needs.
Also ask Claude to identify any deal-breakers for your use case.
```
**Problem:** This is way too detailed. Condense to 3-5 lines focusing on key points.

**Fixed version (4 lines):**
```text
Ask Claude to create a comparison table for the shortlisted tools covering:
pricing, ease of use, key features, platform support, and learning curve.
Request that Claude highlight which tool best fits your specific requirements
and identify any potential deal-breakers for your use case.
```

### Deliverable Requirements

**Format:** 10-20 words, tangible outcome, italicized

**Good examples:**
- _Comparison table with 4 tools rated across 6 criteria with recommendation_
- _Complete project structure with configuration files and dependencies installed_
- _Clear understanding of authentication flow with security best practices_
- _Live deployment on Render with verified functionality_

**Bad examples:**
- _Comparison table_ (too vague - what's in it?)
- _Better understanding_ (not measurable)
- _Files_ (which files? what do they contain?)
- _A comprehensive, detailed, thoroughly researched comparison table..._ (too long, > 20 words)

### Instruction Structure Pattern

**Recommended pattern (3-5 lines):**

```text
Line 1: Ask/Request/Have [Claude/Claude Code] to [action] covering: [key points]
Line 2-3: [List 3-5 key dimensions, parameters, or requirements]
Line 4-5: [Optional: specify format, reference earlier steps, or mention validation]
```

**Examples:**

Pattern for Navigate step:
```text
Ask Claude to create a comparison table for [options] covering: [criteria 1],
[criteria 2], [criteria 3], [criteria 4], and [criteria 5]. Request that
Claude highlight which option best fits your requirements from Step 1.
```

Pattern for Educate step:
```text
Request Claude to explain [concept] using a simple analogy (like [familiar example]).
Have Claude cover: [key point 1], [key point 2], and [key point 3]. Ask for
concrete examples showing how [concept] works in real applications.
```

Pattern for Deploy step:
```text
Use Claude Code to generate [artifact] with: [component 1], [component 2],
[component 3]. Request error handling, logging, and input validation. Have
Claude Code add comments explaining the purpose of each section.
```

---

## Common Patterns

### Good Step Instructions (3-5 lines, concise)

**Navigate example:**
```text
Ask Claude to create a comparison table showing pros, cons, and costs for each
approach. Request scoring across your priorities from Step 1. Have Claude
identify which option best balances your constraints and requirements.
```

**Educate example:**
```text
Have Claude explain REST APIs using a simple analogy (like a restaurant menu).
Request coverage of GET, POST, PUT, DELETE methods with real-world examples.
Ask Claude to show how to make each type of request with your specific data.
```

**Deploy example:**
```text
Use Claude Code to generate the initial project structure and configuration files
including package.json, environment variables, and folder structure. Request
error handling setup and basic health check endpoint with logging.
```

### Poor Step Instructions (avoid)

**Too vague, no Claude guidance:**
```text
Set up your environment
```
**Problem:** Doesn't specify how to use Claude, what to set up, or what the outcome is.

**Not action-oriented:**
```text
Learn about APIs
```
**Problem:** No action verb, no Claude usage, no deliverable, too vague.

**Multiple sub-tasks (should be separate steps):**
```text
Research and implement authentication, configure the database, set up logging,
write tests, and deploy to production
```
**Problem:** This is 5+ different steps crammed into one instruction.

**No concrete deliverable:**
```text
Do testing
```
**Problem:** What kind of testing? What's the deliverable? How does Claude help?

**Too long (10+ lines, overwhelming):**
```text
Ask Claude to create a comprehensive comparison table for video editing tools.
The table should include the following criteria:
1. Pricing (monthly, annual, one-time)
2. Ease of use rating (1-10)
3. Key features (list top 5)
[...10 more lines...]
```
**Problem:** Way too detailed, should be condensed to 3-5 lines.

**Numbered lists with 8+ items in instruction:**
```text
Request Claude to cover:
1. Authentication basics
2. Session management
3. Token generation
4. Password hashing
5. OAuth flows
6. Two-factor authentication
7. Security best practices
8. Common vulnerabilities
9. Testing strategies
10. Production deployment
```
**Problem:** This should be broken into multiple steps (e.g., Step 2: Basics, Step 3: Advanced, Step 4: Security).

---

## Quality Validation Checklist

### Before Finalizing Any Workflow

**Workflow-Wide Checks:**
- [ ] Target audience is enthusiastic computer users (not developers)
- [ ] Language is simple and clear (jargon explained)
- [ ] Tone is instructional but friendly
- [ ] All steps are action-oriented
- [ ] Steps flow progressively toward final goal
- [ ] Total steps match workflow type (6-8 for navigate/educate, 8-12 for deploy)

**Step-Level Checks (for EVERY step):**
- [ ] Title is 3-5 words starting with action verb
- [ ] Instruction is 3-5 lines maximum (not 10, 20, or 30+)
- [ ] Instruction specifies Claude or Claude Code usage
- [ ] Instruction focuses on key points (not exhaustive lists)
- [ ] Deliverable is 10-20 words
- [ ] Deliverable is tangible and measurable
- [ ] Step is completable as single action (not multiple sub-tasks)
- [ ] Step builds on previous steps
- [ ] Step produces output needed for next steps

**Content Quality Checks:**
- [ ] No vague instructions ("set up environment", "learn about X")
- [ ] No multi-task instructions (break into separate steps)
- [ ] No numbered lists with 8+ items (condense or split)
- [ ] No instructions longer than 5 lines (condense key points)
- [ ] All technical terms are explained or contextualized
- [ ] Real examples provided where helpful
- [ ] User's context/requirements referenced from discovery phase

---

## Examples of Quality Standards in Action

### Example 1: Navigate Workflow Step

**Poor quality:**
```markdown
## Step 3: Compare

**Instruction:**

```text
Compare the tools
```

**Deliverable:** _Comparison_
```

**Problems:**
- Title too short (1 word), no action context
- Instruction is 1 line, too vague, no Claude usage
- Deliverable too vague, not measurable

**High quality:**
```markdown
## Step 3: Create Comparison Matrix

**Instruction:**

```text
Ask Claude to create a comparison table for the 4 shortlisted tools covering:
pricing, ease of use, key features, platform support, and learning curve.
Request that Claude highlight which tool best fits your specific requirements.
```

**Deliverable:** _Comparison matrix with 4 tools rated across 5 criteria with personalized recommendation_
```

**Why better:**
- ✅ Title 3 words, clear action
- ✅ Instruction 3 lines, concise, specifies Claude usage
- ✅ Lists key criteria without being exhaustive
- ✅ Deliverable is specific and measurable

### Example 2: Educate Workflow Step

**Poor quality:**
```markdown
## Step 2: Learn APIs

**Instruction:**

```text
Ask Claude to teach you about APIs. You should learn what they are, how they work,
why they're used, different types of APIs, how to use them, when to use REST,
when to use GraphQL, how to authenticate, how to handle errors, how to test them,
best practices for designing APIs, common mistakes to avoid, and real-world examples
of popular APIs like Twitter, Google Maps, and Stripe.
```

**Deliverable:** _Understanding of APIs_
```

**Problems:**
- Instruction is 6 lines (too long)
- Lists 12+ topics (should be multiple steps)
- Deliverable too vague ("understanding")

**High quality:**
```markdown
## Step 2: Understand API Fundamentals

**Instruction:**

```text
Ask Claude to explain APIs using a simple analogy (like a restaurant menu where
you order from available options). Request coverage of what APIs are, why apps
use them, and how request/response works with a concrete example (e.g., weather app).
```

**Deliverable:** _Clear mental model of APIs with real-world analogy and concrete example_
```

**Why better:**
- ✅ Instruction 3 lines, focused on fundamentals
- ✅ Uses analogy for accessibility
- ✅ Concrete example specified
- ✅ Deliverable is measurable (mental model + example)
- ✅ Advanced topics (GraphQL, auth, testing) deferred to later steps

### Example 3: Deploy Workflow Step

**Poor quality:**
```markdown
## Step 4: Build API

**Instruction:**

```text
Use Claude Code to create API endpoints. Include authentication endpoints for
register, login, logout, password reset, email verification, token refresh,
and profile management. Also create CRUD endpoints for users, posts, comments,
likes, and followers. Add middleware for authentication, logging, error handling,
rate limiting, and CORS. Include input validation using Pydantic, database
models using SQLAlchemy, password hashing with bcrypt, JWT token generation,
email sending functionality, file upload handling, pagination, filtering, sorting,
and search. Write tests for all endpoints covering success cases, error cases,
edge cases, and integration tests. Add API documentation using Swagger.
```

**Deliverable:** _API endpoints_
```

**Problems:**
- Instruction is 11 lines (way too long)
- Lists 20+ requirements (overwhelming)
- This is really 5+ separate steps
- Deliverable too vague

**High quality:**
```markdown
## Step 4: Build Authentication API

**Instruction:**

```text
Use Claude Code to generate authentication endpoints: register, login, logout,
and password reset with JWT tokens. Request error handling, input validation,
and password hashing. Ask Claude to create test file for each endpoint.
```

**Deliverable:** _Authentication API with working endpoints, security measures, and tests_
```

**Why better:**
- ✅ Instruction 3 lines, focused on one component (auth)
- ✅ Key requirements listed concisely
- ✅ Other features (CRUD, posts, comments) deferred to later steps
- ✅ Deliverable is specific and measurable
- ✅ Single action (build auth API), not multiple sub-systems

---

## When to Break Steps Into Multiple Steps

**If instruction lists 3+ sub-tasks:**
- Break into separate steps
- Each sub-task becomes its own step
- Maintain progressive flow

**Example of instruction that should be multiple steps:**

**Bad (1 step with 4 sub-tasks):**
```markdown
## Step 5: Complete Backend

**Instruction:**

```text
Use Claude Code to: (1) set up database with schema and migrations, (2) create
all API endpoints with error handling, (3) implement authentication and authorization,
and (4) write comprehensive test suite covering all functionality.
```
```

**Good (4 separate steps):**
```markdown
## Step 5: Configure Database

**Instruction:**

```text
Use Claude Code to generate database schema with user tables, relationships,
and indexes. Request migration files and connection pooling configuration.
Include test query to verify connection works.
```

**Deliverable:** _Database schema created, migrations applied, connection verified_

---

## Step 6: Build API Endpoints

**Instruction:**

```text
Use Claude Code to create core API endpoints: user CRUD, data retrieval, and
updates. Request error handling, input validation, and logging for each endpoint.
Have Claude Code add descriptive comments.
```

**Deliverable:** _Working API endpoints with error handling and validation_

---

## Step 7: Implement Authentication

**Instruction:**

```text
Use Claude Code to add authentication middleware: JWT token generation, validation,
and refresh. Request password hashing, session management, and protected route
decorators. Include logout endpoint that invalidates tokens.
```

**Deliverable:** _Complete authentication system with secure token handling_

---

## Step 8: Write Test Suite

**Instruction:**

```text
Request Claude Code to generate test suite covering all endpoints: success cases,
error handling, edge cases, and authentication. Ask for test fixtures, database
setup/teardown, and clear test organization. Run tests and fix any failures.
```

**Deliverable:** _Passing test suite confirming all functionality works correctly_
```

**Why better:**
- ✅ Each step is single, focused action
- ✅ Each has clear deliverable
- ✅ Progressive flow: database → endpoints → auth → tests
- ✅ User can validate progress after each step
- ✅ Easier to troubleshoot if issues arise

---

This quality guidelines document ensures consistent, high-quality workflows across all types and creators.
