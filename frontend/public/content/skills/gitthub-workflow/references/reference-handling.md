# Reference Material Handling Guide

This guide explains how to collect, map, and incorporate reference materials into gitthub workflows.

---

## Overview

Reference materials enhance workflow quality by:
- Providing user-specific context and examples
- Standardizing approaches based on existing documentation
- Incorporating established practices and patterns
- Making workflows more practical and actionable

Every workflow should systematically collect and use reference materials from the user.

---

## Types of Reference Materials

### 1. File Paths from Vault

**What:** Markdown files, documentation, or resources in the user's vault directory

**Format:** `vault-web/path/to/file.md`

**Examples:**
- `vault-web/docs/deployment-checklist.md`
- `vault-web/references/style-guide.md`
- `vault-web/architecture/system-design.md`

**When to Use:**
- User has existing documentation
- Standard Operating Procedures (SOPs)
- Internal guides or best practices
- Architecture diagrams stored as markdown

**How to Collect:**
In Question 2, ask: "Do you have any documentation files in your vault that should inform this workflow?"

### 2. Attachments to Conversation

**What:** Files the user uploads directly to the conversation

**Format:** `attached:filename.ext`

**Examples:**
- `attached:architecture-diagram.pdf`
- `attached:database-schema.sql`
- `attached:style-guide.pdf`
- `attached:config-template.yml`

**When to Use:**
- PDFs, diagrams, spreadsheets
- Configuration templates
- Screenshots or mockups
- External documentation

**How to Collect:**
In Question 2, offer: "Attachments to this conversation (upload files like PDFs, configs, diagrams)"

### 3. URLs to External Documentation

**What:** Links to online documentation, tutorials, or resources

**Format:** Full URL starting with `https://`

**Examples:**
- `https://docs.render.com/deploy-fastapi`
- `https://react.dev/learn/thinking-in-react`
- `https://www.postgresql.org/docs/current/tutorial.html`

**When to Use:**
- Official documentation for tools/frameworks
- Tutorials or guides from trusted sources
- API references
- Best practices articles

**How to Collect:**
In Question 2, offer: "URLs to external documentation/tutorials you want referenced"

### 4. Related Skills from Catalog

**What:** Other skills in the vault-web/skills/ directory that should be referenced

**Format:** `skill:skill-name`

**Examples:**
- `skill:docker-config-generator`
- `skill:postgres-migration-manager`
- `skill:react-page-creator`

**When to Use:**
- Existing skills that complement the workflow
- Skills that automate parts of the workflow
- Skills that provide related functionality

**How to Collect:**
In Question 2, offer: "Related skills from the skills catalog"

---

## Collecting References (Question 2)

### Question Format

**Sequential (Claude.ai/Claude Desktop):**
```
Question 2: What reference materials should I incorporate into this workflow?

Options (select multiple):
- File paths from your vault
- Attachments to this conversation
- URLs to external documentation/tutorials
- Related skills from the skills catalog
- None/minimal (workflow should be self-contained)
```

**Batched (Claude Code):**
```json
{
  "question": "What reference materials should I incorporate into this workflow?",
  "header": "References",
  "multiSelect": true,
  "options": [
    {"label": "File paths from vault", "description": "e.g., vault-web/docs/deploy-guide.md"},
    {"label": "Attachments to conversation", "description": "Upload PDFs, configs, diagrams"},
    {"label": "URLs to external docs", "description": "Links to documentation or tutorials"},
    {"label": "Related skills", "description": "Other skills from the catalog"},
    {"label": "None/minimal", "description": "Workflow should be self-contained"}
  ]
}
```

### Follow-up Collection

After user selects reference types, collect specific references:

**If "File paths" selected:**
- Ask: "Please provide the file paths (e.g., vault-web/docs/file.md)"
- Format as array: `["vault-web/docs/file1.md", "vault-web/docs/file2.md"]`

**If "Attachments" selected:**
- Prompt: "Please attach the files to this conversation"
- Record as: `["attached:filename1.pdf", "attached:filename2.yml"]`

**If "URLs" selected:**
- Ask: "Please provide the URLs to the documentation"
- Record as: `["https://docs.example.com/guide", "https://tutorial.com/setup"]`

**If "Related skills" selected:**
- Ask: "Which skills should be referenced?"
- Record as: `["skill:skill-name-1", "skill:skill-name-2"]`

---

## Reference Mapping Analysis

After the outline is approved (Step 8), analyze which references are relevant to which steps.

### Mapping Process

For each step in the outline:

1. **Identify relevant references** based on step content
   - Does this step need configuration examples? → Config file references
   - Does this step need architectural guidance? → Architecture diagrams
   - Does this step need best practices? → Documentation links
   - Does this step need automation? → Skill references

2. **Determine incorporation method**
   - **As templates:** "Use [reference] as a starting point"
   - **For examples:** "See [reference] for example implementations"
   - **For validation:** "Check against [reference] for compliance"
   - **For deep dives:** "Refer to [reference] for detailed explanation"

3. **Document in step instruction** (Line 4 typically)
   - Be specific about what aspect of the reference to use
   - Tell user where to look within the reference if applicable

### Example Mapping

**Outline:**
```
Step 1: Setup prerequisites
Step 2: Initialize project structure
Step 3: Configure database
Step 4: Setup authentication
Step 5: Deploy to production
```

**References:**
```yaml
references:
  - "vault-web/docs/deployment-checklist.md"
  - "attached:database-schema.sql"
  - "https://docs.render.com/deploy-fastapi"
  - "skill:docker-config-generator"
```

**Mapping:**
- Step 1: `deployment-checklist.md` (for required tools list)
- Step 2: `skill:docker-config-generator` (for project structure)
- Step 3: `attached:database-schema.sql` (for schema template)
- Step 5: `deployment-checklist.md` + `https://docs.render.com/deploy-fastapi` (for deployment steps)

---

## Incorporating References in Steps

### Best Practices

1. **Be Specific**
   - ❌ "Refer to the attached file"
   - ✅ "Use the database schema from [attached:schema.sql] as a template"

2. **Specify Section/Content**
   - ❌ "Check the deployment guide"
   - ✅ "Follow the environment setup steps in [deployment-guide.md Section 3]"

3. **Explain How to Use**
   - ❌ "See [reference]"
   - ✅ "Use the Dockerfile template from [skill:docker-config-generator] and customize for FastAPI"

4. **Don't Over-Reference**
   - Only cite references when they add specific value
   - Don't cite the same reference in every step
   - Map each reference to 1-3 most relevant steps

### Instruction Format (Line 4)

```text
Line 1: [Claude/Claude Code action]
Line 2-3: [Key points, parameters, requirements]
Line 4: Reference: [How to use reference material]
Line 5: [Optional: output format]
```

**Example:**
```text
Use Claude Code to generate database configuration with connection pooling,
environment variables, and migration setup. Include error handling for
connection failures and pool exhaustion.
Use the schema from [attached:database-schema.sql] as a template for table structure.
Request Claude generate both development and production config files.
```

---

## Reference Examples by Workflow Type

### Navigate Workflows

**Common References:**
- Comparison spreadsheets
- Feature requirement docs
- Budget constraint documents
- Evaluation frameworks

**Example Step:**
```markdown
## Step 3: Build Cost-Focused Comparison Matrix

**Instruction:**

```text
Have Claude create a comparison matrix evaluating each approach across: costs,
features, and business factors. Request scoring weighted to your requirements.
Use the evaluation framework from [vault-web/docs/tool-selection-criteria.md]
to ensure all required dimensions are covered.
```

**Deliverable:** _Weighted comparison matrix using established evaluation framework_
```

### Educate Workflows

**Common References:**
- Conceptual diagrams
- Tutorial links
- Official documentation
- Example code

**Example Step:**
```markdown
## Step 4: Walk Through Authentication Flow

**Instruction:**

```text
Have Claude walk through a step-by-step authentication flow from login to token
refresh. Request detailed explanation of each step with browser/server interactions.
Reference the flow diagram in [attached:auth-flow.png] for the visual overview.
Request Claude explain how your application should implement each stage.
```

**Deliverable:** _Step-by-step understanding of authentication with implementation guidance_
```

### Deploy Workflows

**Common References:**
- Configuration templates
- Deployment checklists
- Architecture diagrams
- Skill automation tools

**Example Step:**
```markdown
## Step 2: Initialize Project Structure

**Instruction:**

```text
Use Claude Code to generate initial project structure with package.json, database
config, environment template, and folder structure (src, routes, models, tests).
Use the project template from [skill:fastapi-project-generator] as a starting
point and customize for your specific requirements from Step 1.
```

**Deliverable:** _Complete project scaffolding following established template structure_
```

---

## Storing References in YAML

### Format

```yaml
references:
  - "vault-web/docs/deployment-checklist.md"
  - "attached:database-schema.sql"
  - "https://docs.render.com/deploy-fastapi"
  - "skill:docker-config-generator"
```

### Guidelines

1. **Consistent Formatting:**
   - File paths: `vault-web/path/to/file.md`
   - Attachments: `attached:filename.ext`
   - URLs: Full URL with `https://`
   - Skills: `skill:skill-name`

2. **Order:** List in order of importance or frequency of use

3. **Empty Array:** If no references, use `references: []`

4. **Context Connection:** References should be mentioned in the `context` field

---

## Validation Checklist

Before finalizing workflow, verify reference handling:

- [ ] Question 2 asked about reference materials
- [ ] All reference types collected (files, attachments, URLs, skills)
- [ ] References stored in YAML frontmatter
- [ ] References mapped to specific steps (not just listed)
- [ ] Step instructions cite references explicitly
- [ ] Reference usage is specific (not vague "see reference")
- [ ] Each reference used in 1-3 most relevant steps
- [ ] Context field mentions how references relate to workflow

---

## Common Mistakes to Avoid

1. **Not Asking for References**
   - Always ask Question 2, even if user might not have any
   - Users often have valuable materials they forget to mention

2. **Collecting But Not Using**
   - Don't just list references in YAML frontmatter
   - Must map to specific steps with explicit citations

3. **Vague Citations**
   - ❌ "Refer to the attached file"
   - ✅ "Use the schema from [attached:schema.sql] for table structure"

4. **Over-Referencing**
   - Don't cite the same reference in every step
   - Be selective about which steps benefit most

5. **No Section Specificity**
   - ❌ "Check the deployment guide"
   - ✅ "Follow Section 3: Environment Setup in [deployment-guide.md]"

6. **Missing from Context**
   - References should be explained in the `context` field
   - User should understand why they're relevant

7. **Broken Reference Formats**
   - ❌ `vault-web\docs\file.md` (wrong slash direction)
   - ✅ `vault-web/docs/file.md` (forward slashes always)

---

## Advanced Patterns

### Conditional References

For navigate workflows, reference different materials for different approaches:

```text
For Approach A (Cloud): See [https://cloud-docs.com/deployment]
For Approach B (Self-hosted): Refer to [attached:server-setup-guide.pdf]
```

### Layered References

Use primary and supplementary references:

```text
Use the database schema from [attached:schema.sql] as the primary template.
For advanced indexing strategies, consult [https://postgresql.org/docs/indexes].
```

### Reference Combinations

Combine multiple reference types:

```text
Initialize the project using [skill:fastapi-project-generator], then customize
the database configuration based on [attached:db-requirements.pdf] and follow
the security guidelines at [https://fastapi-security-guide.com].
```

---

## Reference Material Quality

### Good References

- Up-to-date (2024-2025)
- Official documentation sources
- User's own documentation (always valuable)
- Specific and actionable
- Relevant to workflow type

### Poor References

- Outdated tutorials (pre-2023)
- Vague or generic guides
- Unverified blog posts
- Irrelevant to workflow goals
- Conflicting with workflow approach

---

This guide ensures references are systematically collected, mapped to steps, and incorporated effectively to enhance workflow quality and practicality.
