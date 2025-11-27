# Skill Frontmatter Structure

This document defines the comprehensive frontmatter structure for all skills in the gitthub.org platform. Skills should include rich metadata to enable proper display, filtering, attribution, and versioning.

---

## Why Comprehensive Frontmatter?

**Problem:** Skills with minimal frontmatter (only name and description) result in:
- UI showing default/blank values
- Broken filtering and search functionality
- No attribution or version tracking
- Missing prerequisites and requirements
- Inconsistency with workflow structure

**Solution:** Rich frontmatter aligned with workflow structure enables:
- Proper UI display with accurate metadata
- Working filters by type, difficulty, tags
- Clear attribution and version history
- Documented prerequisites and tools
- "Incremental reading" - users can understand the skill from frontmatter alone

---

## Frontmatter Sections

### 1. Basic Identity (Required)

**Fields:**
```yaml
name: skill-name-here
skill_id: skill-name-here
description: |
  Multi-line description (2-3 sentences).
  Explains what the skill does and when to use it.
```

**Purpose:** Uniquely identifies the skill and provides human-readable summary.

**Guidelines:**
- `name`: Kebab-case identifier (e.g., `gitthub-workflow`, `code-analyzer`)
- `skill_id`: Usually matches `name`, used for programmatic references
- `description`: Comprehensive 2-3 sentence explanation with use cases

---

### 2. Classification (Required)

**Fields:**
```yaml
skill_type: workflow-generation
category: automation
difficulty: intermediate
language: markdown
```

**Purpose:** Enables filtering, categorization, and skill discovery.

**Valid Values:**

**skill_type:** (What the skill does)
- `workflow-generation` - Creates structured workflows
- `code-analysis` - Analyzes code/patterns
- `data-processing` - Processes/transforms data
- `automation` - Automates tasks
- `content-generation` - Creates content
- `research` - Gathers/synthesizes information
- `general` - Multi-purpose or uncategorized

**category:** (Broader grouping)
- `automation` - Task automation
- `analysis` - Code/data analysis
- `generation` - Content/artifact creation
- `development` - Software development
- `learning` - Educational/teaching
- `general` - Cross-category

**difficulty:**
- `beginner` - Basic usage, minimal prerequisites
- `intermediate` - Some experience required
- `advanced` - Extensive knowledge needed

**language:** (Primary format/language)
- `markdown`, `python`, `javascript`, `typescript`, `yaml`, `json`, `general`

---

### 3. Metadata (Required)

**Fields:**
```yaml
author: Claude
created_date: 2025-11-15
last_modified: 2025-11-18
version: "1.1"
status: active
```

**Purpose:** Attribution, version tracking, lifecycle management.

**Guidelines:**
- `author`: Creator name or organization
- `created_date`: YYYY-MM-DD format
- `last_modified`: Update when skill changes
- `version`: Semantic versioning ("major.minor" or "major.minor.patch")
- `status`: `draft` | `active` | `deprecated`

---

### 4. Usage Information (Required)

**Fields:**
```yaml
estimated_time: 15-30 minutes
agent: claude.ai, claude desktop, claude code
model: claude-sonnet-4-5
```

**Purpose:** Helps users understand time commitment and compatibility.

**Guidelines:**
- `estimated_time`: Realistic time to use/apply the skill
- `agent`: Comma-separated list of supported platforms
  - `claude.ai` - Web interface
  - `claude desktop` - Desktop app
  - `claude code` - VS Code extension
- `model`: Recommended or tested model(s)
  - Common: `claude-sonnet-4-5`, `claude-opus-4`, `claude-3-5-sonnet-20241022`

---

### 5. Organization (Required)

**Fields:**
```yaml
tags:
  - workflow-generation
  - automation
  - structured-output
  - two-phase-approach
```

**Purpose:** Enables search, filtering, and related skill discovery.

**Guidelines:**
- Use lowercase kebab-case
- 3-8 tags per skill
- Mix of general and specific tags
- Include skill_type as a tag
- Common tags:
  - Functional: `automation`, `analysis`, `generation`, `research`
  - Format: `markdown`, `code`, `structured-output`
  - Approach: `two-phase-approach`, `interactive`, `batch-processing`
  - Domain: `web-development`, `data-science`, `devops`

---

### 6. Requirements (Optional but Recommended)

**Fields:**
```yaml
prerequisites:
  - Understanding of workflow types
  - Access to vault-website directory
  - Familiarity with Claude Code

tools_required:
  - WebSearch
  - AskUserQuestion
  - File writing capabilities
```

**Purpose:** Communicates what users need before using the skill.

**Guidelines:**
- `prerequisites`: Knowledge, access, or understanding required
  - Be specific but concise
  - Focus on essential requirements
- `tools_required`: Specific tools, APIs, or capabilities needed
  - Include Claude tools (WebSearch, AskUserQuestion, etc.)
  - Include external tools (git, docker, npm, etc.)
  - Include platform capabilities (file writing, web access, etc.)

---

### 7. References (Optional)

**Fields:**
```yaml
references:
  - references/navigate-guide.md
  - references/workflow-format-spec.md
  - https://example.com/external-guide
```

**Purpose:** Links to supporting documentation and resources.

**Guidelines:**
- Relative paths for internal files
- Full URLs for external resources
- Include guide files, examples, and related documentation
- Order by importance/relevance

---

### 8. Analytics (Optional)

**Fields:**
```yaml
usage_count: 0
```

**Purpose:** Track skill usage for analytics and improvements.

**Guidelines:**
- Automatically incremented by system (when implemented)
- Initialize to `0` for new skills
- Can be used for "most popular" features

---

## Complete Example

```yaml
---
# Basic Identity
name: gitthub-workflow
skill_id: gitthub-workflow
description: |
  Generate comprehensive, actionable gitthub workflows for complex tasks.
  Uses a two-phase approach: conversational discovery followed by structured expansion.
  Creates step-by-step workflows for navigation, education, or deployment.

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
  - Access to vault-website/workflows directory
  - Familiarity with conversational discovery process

tools_required:
  - WebSearch (for researching best practices)
  - AskUserQuestion (for sequential discovery)
  - File writing capabilities

# References
references:
  - references/navigate-guide.md
  - references/educate-guide.md
  - references/deploy-guide.md
  - references/workflow-format-spec.md

# Analytics
usage_count: 0
---
```

---

### 9. Marketplace Integration (Optional but Recommended)

**Fields:**
```yaml
organization: gitthub
repository: https://github.com/your-org/skills/tree/main/skill-name
homepage: https://gitthub.org/doc?section=skills&skill=skill-name
license: MIT
keywords:
  - keyword1
  - keyword2
  - keyword3
compatibility:
  - "Claude Code"
  - "Claude.ai"
  - "Claude API"
installation_method: plugin
```

**Purpose:** Enables distribution via Claude Code plugin marketplaces while maintaining Skills API compatibility.

**Context:** The Claude blog (https://www.claude.com/blog/skills-explained) confirms: *"Claude Code users: Install Skills via plugin marketplaces."* These fields enable marketplace discoverability and installation.

**Guidelines:**

**organization:**
- Publisher or organization name (e.g., `gitthub`, `anthropic`, `your-company`)
- Used for attribution in marketplace listings
- Should match your GitHub organization or brand name

**repository:**
- Direct link to the skill's source code
- Enables transparency and community contributions
- Format: `https://github.com/org/repo/tree/main/path/to/skill`

**homepage:**
- Link to comprehensive documentation
- Should point to gitthub.org skill detail page
- Format: `https://gitthub.org/doc?section=skills&skill=skill-name`

**license:**
- Open source license type
- Common values: `MIT`, `Apache-2.0`, `GPL-3.0`, `BSD-3-Clause`
- Provides legal clarity for users

**keywords:**
- 5-10 search terms for marketplace discovery
- More specific than tags (marketplace-focused)
- Should include technical terms users might search for
- Example: `["workflow", "automation", "documentation", "github"]`

**compatibility:**
- Platforms where the skill works
- Options: `"Claude Code"`, `"Claude.ai"`, `"Claude API"`, `"Claude Desktop"`
- Helps users know where they can install/use the skill

**installation_method:**
- How users should install the skill
- Values: `plugin` (via marketplace), `api` (via Skills API), `manual` (download/copy)
- Most skills distributed via marketplace should use `plugin`

**Benefits:**
- Discoverable via `/plugin search` command in Claude Code
- Installable via `/plugin install skill-name` command
- Proper attribution and licensing
- Links to comprehensive documentation
- Dual compatibility: Skills API + Plugin marketplace

**When to Include:**
- When planning to distribute via Claude Code marketplace
- When skill is stable and ready for public use
- When you want maximum discoverability
- Recommended for all production-ready skills

---

## Comparison with Workflows

Skills and workflows share the same frontmatter structure for consistency:

| Section | Skills | Workflows | Notes |
|---------|--------|-----------|-------|
| Basic Identity | ✅ name, skill_id, description | ✅ title, workflow_id, description | Different ID field names |
| Classification | ✅ skill_type, category, difficulty | ✅ type, category, difficulty | Same structure |
| Metadata | ✅ author, dates, version, status | ✅ author, dates, version, status | Identical |
| Usage | ✅ estimated_time, agent, model | ✅ estimated_time, agent, model | Identical |
| Organization | ✅ tags | ✅ tags | Identical |
| Requirements | ✅ prerequisites, tools_required | ✅ prerequisites, tools | Same concept |
| References | ✅ references | ✅ references | Identical |
| Analytics | ✅ usage_count | ✅ usage_count | Identical |
| Marketplace | ✅ organization, repository, license, etc. | ❌ Not applicable | Skills only |

**Key Differences:**
- Skills use `name` and `skill_id`, workflows use `title` and `workflow_id`
- Skills use `skill_type`, workflows use `type`
- Workflows also include `steps` array and `total_steps` count

---

## Required vs Optional Fields

### Always Required (8 fields)
1. `name` - Identity
2. `skill_id` - Programmatic reference
3. `description` - Purpose and use cases
4. `skill_type` - Functional classification
5. `difficulty` - Complexity level
6. `author` - Attribution
7. `created_date` - Creation timestamp
8. `status` - Lifecycle state

### Recommended (8 fields)
9. `category` - Broader grouping
10. `language` - Primary format
11. `last_modified` - Update tracking
12. `version` - Version control
13. `estimated_time` - Time expectation
14. `agent` - Platform compatibility
15. `model` - Model compatibility
16. `tags` - Discoverability

### Optional but Valuable (13 fields)
17. `prerequisites` - Requirements
18. `tools_required` - Tool dependencies
19. `references` - Related resources
20. `usage_count` - Analytics
21. `organization` - Publisher/org name (marketplace)
22. `repository` - Link to source (marketplace)
23. `homepage` - Link to documentation (marketplace)
24. `license` - Legal clarity (marketplace)
25. `keywords` - Search terms (marketplace)
26. `compatibility` - Platform support (marketplace)
27. `installation_method` - Install method (marketplace)
28. Custom fields as needed

---

## Migration Guide

### For Existing Skills with Minimal Frontmatter

**Before (2 fields):**
```yaml
---
name: my-skill
description: Brief description
---
```

**After (20+ fields):**
```yaml
---
# Basic Identity
name: my-skill
skill_id: my-skill
description: |
  Expanded description with use cases.
  Explains what the skill does and when to use it.

# Classification
skill_type: [determine from content]
category: [determine from content]
difficulty: [beginner/intermediate/advanced]
language: [primary format]

# Metadata
author: [your name or "Claude"]
created_date: [YYYY-MM-DD when created]
last_modified: [YYYY-MM-DD today]
version: "1.0"
status: active

# Usage Information
estimated_time: [X-Y minutes]
agent: claude.ai, claude desktop, claude code
model: claude-sonnet-4-5

# Organization
tags:
  - [relevant]
  - [tags]
  - [here]

# Requirements
prerequisites:
  - [what users need]

tools_required:
  - [required tools]

# References
references:
  - [related files]

# Analytics
usage_count: 0
---
```

**Steps:**
1. Copy `_SKILL_TEMPLATE.md`
2. Fill in all required fields
3. Add recommended fields
4. Include optional fields as relevant
5. Test frontmatter display in UI

---

## Validation Checklist

Before committing a skill, verify:

**Required Fields:**
- [ ] `name` and `skill_id` are kebab-case and unique
- [ ] `description` is 2-3 complete sentences
- [ ] `skill_type` is a valid type from the list
- [ ] `difficulty` is beginner/intermediate/advanced
- [ ] `author` is specified
- [ ] `created_date` and `last_modified` are YYYY-MM-DD format
- [ ] `version` uses semantic versioning
- [ ] `status` is draft/active/deprecated
- [ ] `estimated_time` is realistic
- [ ] `agent` lists supported platforms
- [ ] `model` specifies recommended model(s)
- [ ] `tags` has 3-8 relevant tags in kebab-case
- [ ] `prerequisites` lists essential requirements
- [ ] `tools_required` lists necessary tools
- [ ] `references` paths are correct

**Marketplace Fields (Optional but Recommended):**
- [ ] `organization` is specified (publisher/org name)
- [ ] `repository` is a valid GitHub URL
- [ ] `homepage` links to gitthub.org skill page
- [ ] `license` is a recognized open source license
- [ ] `keywords` has 5-10 marketplace search terms
- [ ] `compatibility` lists all supported platforms
- [ ] `installation_method` is specified (plugin/api/manual)

---

## Backend Integration

The backend API (`backend/app/api/endpoints/skills.py`) expects these frontmatter fields. Missing fields will use defaults:

```python
skill = {
    "skill_id": frontmatter.get("skill_id", skill_dir_name),
    "skill_name": frontmatter.get("name", "Untitled Skill"),
    "description": frontmatter.get("description", ""),
    "skill_type": frontmatter.get("skill_type", "general"),
    "difficulty": frontmatter.get("difficulty", "beginner"),
    "language": frontmatter.get("language", "general"),
    "estimated_time": frontmatter.get("estimated_time", "Unknown"),
    "tags": frontmatter.get("tags", []),
    "status": frontmatter.get("status", "draft"),
    "created_date": frontmatter.get("created_date", ""),
    "created_by": frontmatter.get("author", "Unknown"),
    "version": frontmatter.get("version", "1.0"),
    "agent": frontmatter.get("agent", ""),
    "model": frontmatter.get("model", ""),
    "category": frontmatter.get("category", "general"),
    "prerequisites": frontmatter.get("prerequisites", []),
    "tools_required": frontmatter.get("tools_required", []),
    "usage_count": frontmatter.get("usage_count", 0),
    # Marketplace fields (optional)
    "organization": frontmatter.get("organization", ""),
    "repository": frontmatter.get("repository", ""),
    "homepage": frontmatter.get("homepage", ""),
    "license": frontmatter.get("license", ""),
    "keywords": frontmatter.get("keywords", []),
    "compatibility": frontmatter.get("compatibility", []),
    "installation_method": frontmatter.get("installation_method", ""),
}
```

**Providing complete frontmatter ensures:**
- Accurate UI display instead of defaults
- Working filters and search
- Proper attribution and tracking
- Complete user information
- Marketplace discoverability (when marketplace fields included)
- Installation guidance for Claude Code users

---

## Resources

**Templates:**
- `_SKILL_TEMPLATE.md` - Complete skill template with all fields

**Examples:**
- `gitthub-workflow/SKILL.md` - Reference implementation

**Related Documentation:**
- Workflow frontmatter structure (similar pattern)
- Backend API expectations (`skills.py`)
- Frontend display components (`SkillPreview.jsx`)

---

## Summary

**Comprehensive frontmatter transforms skills from simple documents into rich, discoverable, well-documented resources.**

Minimum viable skill: 2 fields (name, description)
Well-structured skill: 20+ fields with complete metadata
Best practice: Follow this guide and use `_SKILL_TEMPLATE.md`

The investment in comprehensive frontmatter pays dividends in:
- Better user experience
- Improved discoverability
- Proper attribution
- Version tracking
- System consistency
