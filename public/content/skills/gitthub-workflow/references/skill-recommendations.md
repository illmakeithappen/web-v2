# Skill Recommendation Guide

This guide explains how to analyze workflows and recommend related skills that enhance automation, reusability, and learning.

---

## Overview

Skill recommendations help users:
- Automate repetitive tasks in the workflow
- Create reusable tools for similar workflows
- Standardize approaches across projects
- Enhance learning with interactive practice
- Build a library of domain-specific utilities

Every workflow should analyze opportunities for 1-3 related skills after the outline is approved.

---

## When to Recommend Skills

### Skill Recommendation Analysis (Step 8)

After the outline is approved but before expansion, perform skill recommendation analysis:

1. **Analyze workflow content** for patterns and repetition
2. **Review reference materials** for concepts that could be templated
3. **Identify automation opportunities** in the workflow steps
4. **Consider user's goals** from context and discovery questions
5. **Generate 1-3 specific recommendations** with rationale

**Important:** This analysis happens AFTER outline approval, BEFORE step expansion.

---

## Criteria for Good Skill Recommendations

### 1. Solves a Specific Need

**Good:** Skills that address concrete, repeated tasks
- "docker-config-generator" - creates consistent Dockerfiles
- "postgres-migration-manager" - handles schema changes
- "api-endpoint-validator" - tests API specifications

**Bad:** Vague or overly general skills
- "helper-functions" - too vague
- "general-automation" - no specific purpose
- "utility-tool" - unclear what it does

### 2. Provides Reusability

**Good:** Skills useful beyond this single workflow
- "feature-comparison-matrix" - reusable for any comparison
- "tco-calculator" - applicable to cost analysis workflows
- "concept-quiz-generator" - works for any learning topic

**Bad:** One-time use, too specific to this workflow
- "video-editing-tool-comparer-2024" - too narrow
- "johns-project-deployer" - not transferable
- "this-specific-database-only" - limited reuse

### 3. Reduces Complexity or Saves Time

**Good:** Skills that simplify difficult or tedious tasks
- "environment-config-generator" - automates complex configs
- "migration-script-builder" - reduces error-prone manual work
- "test-suite-generator" - speeds up quality assurance

**Bad:** Skills that don't save significant effort
- "echo-text" - trivial, not worth a skill
- "create-empty-file" - too simple
- "print-hello-world" - no practical value

### 4. Grounded in Reference Materials or Workflow Content

**Good:** Skills based on patterns in the workflow or references
- Reference has style guide → "style-guide-checker" skill
- Workflow does database migrations → "migration-helper" skill
- Reference shows testing patterns → "test-template-generator" skill

**Bad:** Skills unrelated to workflow or references
- Navigate video tools → "blockchain-deployer" (unrelated)
- Educate Docker → "fashion-recommender" (unrelated)
- Deploy API → "game-asset-manager" (unrelated)

## Balancing Specificity and Reusability

### The Specificity Spectrum

**Too Specific (Avoid):**
- ❌ `johns-schwarzenbach-project-only` - Single use, single client
- ❌ `november-2025-deployment` - Time-locked
- ❌ `this-specific-database-only` - One instance only

**Domain-Specific (Excellent):**
- ✅ `wealth-management-site-generator` - Reusable across wealth mgmt clients
- ✅ `financial-services-compliance-checker` - Industry-specific, multi-client
- ✅ `swiss-legal-page-generator` - Geography-specific, multi-client

**Pattern-Specific (Excellent):**
- ✅ `brand-guideline-applier` - Works for any brand PDF
- ✅ `logo-asset-integrator` - Works for any logo package
- ✅ `client-presentation-site-builder` - Works for any client site

**Too Generic (Low Value):**
- ⚠️ `static-site-generator` - Already exists everywhere
- ⚠️ `file-uploader` - Too basic, minimal value-add

---

## Analysis Process

### Step 1: Review Workflow Content

Examine the approved outline for:
- **Repeated patterns** across steps
- **Complex configurations** that could be templated
- **Validation/testing** steps that could be automated
- **Decision frameworks** that could be encoded
- **Format/structure** requirements that could be enforced

**Example:**
```
Outline:
1. Setup database
2. Configure authentication
3. Build API endpoints
4. Setup deployment
5. Configure monitoring

Patterns identified:
- Configuration files (database, auth, deployment, monitoring)
- Testing/validation needed at each step
→ Potential skill: "config-file-generator"
→ Potential skill: "endpoint-test-generator"
```

### Step 2: Review Reference Materials

Examine references for:
- **Templates** that could be made interactive
- **Checklists** that could be automated
- **Standards** that could be enforced
- **Calculations** that could be programmed
- **Diagrams** that could be generated

#### Quick Reference Analysis Checklist

For each reference, ask:

**Is it brand/style material?**
- Logo files, brand PDFs, style guides, color palettes
- → Skill: `brand-guideline-applier`, `logo-asset-integrator`

**Does it show domain patterns?**
- Industry-specific content (wealth, legal, healthcare, e-commerce)
- → Skill: `[domain]-site-generator`, `[domain]-compliance-checker`

**Does it contain compliance/legal requirements?**
- Legal pages, regulations, certifications, disclaimers
- → Skill: `[regulation]-compliance-automator`, `legal-page-builder`

**Does it show templates/structures?**
- Page layouts, content structures, repeated patterns
- → Skill: `[pattern]-template-generator`

**Is it multi-language/regional?**
- Content in multiple languages, regional requirements
- → Skill: `multi-language-site-builder`, `[region]-compliance-helper`

**Example:**
```
References:
- deployment-checklist.md (manual checklist)
- database-schema.sql (static template)
- style-guide.pdf (manual rules)

Opportunities:
→ "deployment-checklist-validator" (automates checklist verification)
→ "schema-migration-generator" (creates migrations from schema)
→ "style-guide-enforcer" (checks compliance automatically)
```

#### Reference Pattern Recognition

When analyzing references, identify these patterns:

**1. Brand/Style Materials**
- **Indicators:** Brand PDFs, logo files, style guides, presentations
- **Example:** Schwarzenbach_Presentation.pdf + Logo files
- **Pattern-Based Skill:** `brand-guideline-applier`
- **Rationale:** Any client with brand assets benefits from automated brand application

**2. Domain-Specific Content**
- **Indicators:** Industry terminology (wealth management, legal, healthcare)
- **Example:** Wealth management website content
- **Domain-Based Skill:** `wealth-management-site-generator`
- **Rationale:** Reusable across all industry clients

**3. Legal/Compliance Requirements**
- **Indicators:** DSGVO, GDPR, Impressum, Datenschutz pages
- **Example:** German legal pages for Swiss company
- **Region-Specific Skill:** `swiss-legal-page-builder`
- **Rationale:** Geography-specific but multi-client value

**4. Multi-Language Content**
- **Indicators:** Content in multiple languages, i18n requirements
- **Example:** German website content
- **Pattern-Based Skill:** `multi-language-site-builder`
- **Rationale:** Language patterns apply to many clients

### Step 3: Consider Workflow Type

Different workflow types suggest different skill categories:

**Navigate Workflows:**
- Decision framework skills
- Comparison matrix generators
- Cost calculators
- Scenario analysis tools

**Educate Workflows:**
- Quiz/practice generators
- Concept visualizers
- Interactive examples
- Reference creators
- Progress trackers

**Deploy Workflows:**
- Config generators
- Deployment automators
- Test suite builders
- Monitoring setup tools
- Environment managers

### Step 4: Match to User's Context

From the `context` field and discovery questions, understand:
- **User's goal:** What are they trying to accomplish?
- **Constraints:** What limitations do they have?
- **Frequency:** Will they do this once or repeatedly?
- **Complexity:** What's most challenging for them?

**Example:**
```
Context: "I deploy FastAPI apps weekly for clients. Need consistent setup."
Discovery: "Intermediate skill, timeline pressure, needs repeatability"

Recommendation:
→ "fastapi-project-scaffolder" (reduces setup time)
→ "deployment-config-bundler" (ensures consistency)
```

### Step 5: Generate Recommendations

For each potential skill:
1. **Name it descriptively** (what it does + domain)
2. **Write clear rationale** (why it's useful)
3. **Ensure it's actionable** (user can create or use it)

**Format:**
```yaml
skills:
  - skill-name (brief rationale explaining value)
```

**Examples:**
```yaml
skills:
  - docker-config-generator (for creating optimized container configs)
  - postgres-migration-manager (for managing database schema changes)
  - api-endpoint-validator (for automated API testing)
```

---

## Skill Recommendations by Workflow Type

### Navigate Workflows

**Common Skill Opportunities:**

**1. Decision Framework Encoders**
- When: Workflow creates decision criteria or rules
- Example: "database-decision-framework"
- Rationale: "encodes decision rules for future database selections"

**2. Comparison Matrix Generators**
- When: Workflow builds comparison across dimensions
- Example: "feature-comparison-builder"
- Rationale: "automates creation of weighted comparison matrices"

**3. TCO Calculators**
- When: Workflow includes cost analysis
- Example: "cloud-tco-calculator"
- Rationale: "calculates total cost of ownership for cloud services"

**4. Scenario Analyzers**
- When: Workflow evaluates use cases
- Example: "use-case-scenario-generator"
- Rationale: "creates what-if scenarios for different approaches"

**Example from Navigate Workflow:**
```yaml
# Workflow: Compare video editing software
skills:
  - video-editing-tco-calculator (for automated cost analysis across tools)
  - feature-comparison-matrix (for consistent feature-by-feature analysis)
  - workflow-efficiency-estimator (for calculating time savings per tool)
```

### Educate Workflows

**Common Skill Opportunities:**

**1. Quiz Generators**
- When: Workflow teaches concepts that need reinforcement
- Example: "concept-quiz-builder"
- Rationale: "generates interactive quizzes to test understanding"

**2. Practice Exercise Creators**
- When: Workflow needs hands-on application
- Example: "docker-command-practice"
- Rationale: "creates practice scenarios for Docker commands"

**3. Concept Visualizers**
- When: Workflow explains abstract concepts
- Example: "api-flow-diagram-generator"
- Rationale: "visualizes API request/response flows"

**4. Reference Sheet Builders**
- When: Workflow covers many details
- Example: "quick-reference-creator"
- Rationale: "generates personalized cheat sheets"

**Example from Educate Workflow:**
```yaml
# Workflow: Learn Docker fundamentals
skills:
  - docker-command-builder (for hands-on practice with Docker commands)
  - container-concept-visualizer (for visualizing container lifecycles)
  - dockerfile-validator (for checking Dockerfile best practices)
```

### Deploy Workflows

**Common Skill Opportunities:**

**1. Config File Generators**
- When: Workflow creates multiple config files
- Example: "fastapi-config-generator"
- Rationale: "generates production-ready FastAPI configurations"

**2. Deployment Automators**
- When: Workflow has multi-step deployment
- Example: "render-deploy-automator"
- Rationale: "automates Render deployment with health checks"

**3. Test Suite Builders**
- When: Workflow needs comprehensive testing
- Example: "api-test-suite-generator"
- Rationale: "creates test suites for REST APIs"

**4. Migration Tools**
- When: Workflow manages database changes
- Example: "schema-migration-creator"
- Rationale: "generates migration scripts from schema changes"

**5. Environment Managers**
- When: Workflow handles multiple environments
- Example: "env-config-manager"
- Rationale: "manages environment variables across dev/staging/prod"

**Example from Deploy Workflow:**
```yaml
# Workflow: Deploy FastAPI to Render
skills:
  - fastapi-docker-generator (for creating optimized container configs)
  - postgres-migration-manager (for managing database schema updates)
  - render-health-check-builder (for automated deployment verification)
```

**Example from Deploy Workflow:**
```yaml
# Workflow: Deploy Client Presentation Website
# References: Brand PDF, Logo files, German content, Legal requirements
skills:
  - brand-guideline-applier (for applying any client's brand PDF to website styling and assets)
  - wealth-management-site-generator (for creating compliant financial services client sites)
  - multi-language-legal-page-builder (for DSGVO-compliant sites with Impressum/Datenschutz)
```

---

## Formatting Skills in YAML

### Format

```yaml
skills:
  - skill-name (rationale in parentheses)
  - another-skill (another rationale)
```

### Guidelines

1. **Skill Naming:**
   - Lowercase with hyphens
   - Descriptive: action + domain
   - Examples: `docker-config-generator`, `api-test-builder`, `tco-calculator`

2. **Rationale:**
   - Brief (5-10 words)
   - Explains value or purpose
   - Format: `(for [benefit or use case])`

3. **Quantity:**
   - 1-3 skills recommended
   - Too few (0): missed opportunity
   - Too many (4+): overwhelming, dilutes focus

4. **Order:**
   - Most impactful first
   - Most frequently used second
   - Nice-to-have third

### Good Examples

```yaml
skills:
  - database-decision-framework (for reusable database selection criteria)
  - tco-calculator (for automated cost analysis)
```

```yaml
skills:
  - docker-command-practice (for hands-on Docker practice scenarios)
  - dockerfile-validator (for checking best practices)
  - container-troubleshooter (for debugging common container issues)
```

```yaml
skills:
  - fastapi-project-scaffolder (for consistent project structure)
  - deployment-config-bundler (for environment-specific configurations)
```

### Bad Examples

```yaml
# Too vague
skills:
  - helper-tool (for helping with stuff)
  - utility (for utilities)

# Too specific, not reusable
skills:
  - johns-exact-project-deployer (for John's specific project only)

# No rationale
skills:
  - docker-generator
  - test-builder

# Too many (overwhelming)
skills:
  - skill-1 (rationale)
  - skill-2 (rationale)
  - skill-3 (rationale)
  - skill-4 (rationale)
  - skill-5 (rationale)
  - skill-6 (rationale)
```

---

## Common Skill Recommendation Patterns

### Pattern 1: Configuration Trilogy

For deployment workflows:
```yaml
skills:
  - [domain]-config-generator (for generating base configurations)
  - [domain]-env-manager (for managing environment variables)
  - [domain]-validator (for validating configuration correctness)
```

### Pattern 2: Learning Reinforcement

For educate workflows:
```yaml
skills:
  - [topic]-quiz-generator (for testing understanding)
  - [topic]-practice-builder (for hands-on exercises)
  - [topic]-reference-creator (for personalized cheat sheets)
```

### Pattern 3: Decision Support

For navigate workflows:
```yaml
skills:
  - [domain]-comparison-matrix (for structured comparisons)
  - [domain]-tco-calculator (for cost analysis)
  - [domain]-decision-framework (for encoded decision rules)
```

### Pattern 4: Automation Suite

For workflows with repetitive tasks:
```yaml
skills:
  - [task]-template-generator (for creating starting templates)
  - [task]-validator (for automated checking)
  - [task]-deployer (for one-command execution)
```

---

## Validation Checklist

Before finalizing skill recommendations:

- [ ] 1-3 skills recommended (not 0, not 4+)
- [ ] Each skill has clear, descriptive name
- [ ] Each skill has brief rationale (5-10 words)
- [ ] Skills are grounded in workflow content or references
- [ ] Skills provide reusability (not one-time use)
- [ ] Skills match workflow type (navigate/educate/deploy)
- [ ] Skills address user's context and goals
- [ ] Skills reduce complexity or save time
- [ ] Skill names are lowercase-with-hyphens
- [ ] Most impactful skills listed first

---

## Common Mistakes to Avoid

1. **No Skill Recommendations**
   - Every workflow has opportunities for skills
   - Even if small, suggest at least 1 skill

2. **Too Many Skills (4+)**
   - Overwhelming for users
   - Dilutes focus on most valuable skills

3. **Vague Rationale**
   - ❌ "(for automation)"
   - ✅ "(for automating database migration scripts)"

4. **Unrelated to Workflow**
   - Skills must connect to workflow content
   - Don't suggest random popular skills

5. **Too Specific to This Workflow**
   - Skills should be reusable
   - Avoid "johns-project-only" skills

6. **No Rationale**
   - Always explain why the skill is valuable
   - Format: `skill-name (rationale)`

7. **Generic Names**
   - ❌ "helper", "tool", "utility"
   - ✅ "docker-config-generator", "api-test-builder"

---

## Advanced Patterns

### Skill Families

Recommend skills that work together:
```yaml
skills:
  - fastapi-project-scaffolder (for initial project structure)
  - fastapi-endpoint-generator (for adding new API routes)
  - fastapi-test-suite-builder (for comprehensive API testing)
```

### Progressive Skills

Recommend skills that support skill progression:
```yaml
# Beginner workflow
skills:
  - docker-command-builder (for learning Docker commands interactively)

# Intermediate workflow
skills:
  - dockerfile-optimizer (for improving container performance)

# Advanced workflow
skills:
  - multi-stage-build-generator (for complex production builds)
```

### Reference-Derived Skills

Skills directly from reference materials:
```
Reference: style-guide.pdf → style-guide-checker
Reference: architecture.md → architecture-validator
Reference: deployment-checklist.md → deployment-checklist-automator
```

---

## Skill Recommendation Quality

### Excellent Recommendations

**Specific + Reusable + Valuable:**
```yaml
skills:
  - postgres-migration-generator (for creating SQL migrations from schema changes)
  - api-endpoint-validator (for automated testing of REST APIs)
  - render-deploy-automation (for streamlined Render deployments)
```

**Why Good:**
- Specific actions (migration, validation, automation)
- Reusable across projects
- Clear value (reduces manual work, catches errors, speeds deployment)

### Poor Recommendations

**Vague + Limited + Unclear Value:**
```yaml
skills:
  - helper-tool (for helping)
  - utility-functions (for utilities)
  - project-thing (for project)
```

**Why Bad:**
- Vague names (what do they actually do?)
- Unclear reusability
- No clear value proposition

---

## Summary

Great skill recommendations:
1. **Solve specific needs** from the workflow
2. **Provide reusability** beyond this workflow
3. **Save time or reduce complexity** significantly
4. **Connect to workflow content** and references
5. **Match workflow type** (navigate/educate/deploy)
6. **Include clear rationale** explaining value

Every workflow should have 1-3 thoughtfully chosen skill recommendations that enhance automation, learning, or reusability.
