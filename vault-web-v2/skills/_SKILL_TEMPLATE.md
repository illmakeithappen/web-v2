---
# ============================================================================
# SKILL FRONTMATTER TEMPLATE
# ============================================================================
# This template defines the comprehensive frontmatter structure for skills.
# Copy this template when creating new skills and fill in all fields.
# Aligns with workflow frontmatter structure for consistency.
# ============================================================================

# ----------------------------------------------------------------------------
# BASIC IDENTITY (Required)
# ----------------------------------------------------------------------------
name: skill-name-here                         # Kebab-case identifier (e.g., gitthub-workflow)
skill_id: skill-name-here                     # Unique identifier (usually matches name)
description: |                                # Comprehensive description (2-3 sentences)
  Brief description of what this skill does and when to use it.
  Should clearly explain the skill's purpose and primary use case.

# ----------------------------------------------------------------------------
# CLASSIFICATION (Required)
# ----------------------------------------------------------------------------
skill_type: general                           # Type: workflow-generation, code-analysis, data-processing, automation, etc.
category: general                             # Category: automation, analysis, generation, development, etc.
difficulty: beginner                          # beginner | intermediate | advanced
language: general                             # Primary language/format: markdown, python, javascript, general, etc.

# ----------------------------------------------------------------------------
# METADATA (Required)
# ----------------------------------------------------------------------------
author: Claude                                # Creator name or organization
created_date: 2025-01-01                      # YYYY-MM-DD format
last_modified: 2025-01-01                     # YYYY-MM-DD format (update when skill changes)
version: "1.0"                                # Semantic versioning: "major.minor" or "major.minor.patch"
status: draft                                 # draft | active | deprecated

# ----------------------------------------------------------------------------
# USAGE INFORMATION (Required)
# ----------------------------------------------------------------------------
estimated_time: 10-20 minutes                 # Time to use/apply this skill
agent: claude.ai, claude desktop, claude code # Which platforms support this skill
model: claude-sonnet-4-5                      # Recommended/tested model(s)

# ----------------------------------------------------------------------------
# ORGANIZATION (Required)
# ----------------------------------------------------------------------------
tags:                                         # Array of tags for filtering/search
  - tag1
  - tag2
  - tag3

# ----------------------------------------------------------------------------
# REQUIREMENTS (Optional but Recommended)
# ----------------------------------------------------------------------------
prerequisites:                                # What users need before using this skill
  - Understanding of [concept]
  - Access to [resource]
  - Familiarity with [tool]

tools_required:                               # Tools/systems needed to use this skill
  - Tool 1
  - Tool 2
  - Tool 3

# ----------------------------------------------------------------------------
# REFERENCES (Optional)
# ----------------------------------------------------------------------------
references:                                   # Related files, guides, or resources
  - references/guide-name.md
  - references/example-name.md
  - external-url

# ----------------------------------------------------------------------------
# ANALYTICS (Optional - automatically updated)
# ----------------------------------------------------------------------------
usage_count: 0                                # Number of times skill has been used

# ----------------------------------------------------------------------------
# MARKETPLACE INTEGRATION (Optional but Recommended for Distribution)
# ----------------------------------------------------------------------------
# These fields enable distribution via Claude Code plugin marketplaces
# Maintains compatibility with Skills API while adding marketplace discoverability

organization: gitthub                         # Publisher/organization name
repository: https://github.com/your-org/skills/tree/main/skill-name-here  # Link to skill source
homepage: https://gitthub.org/doc?section=skills&skill=skill-name-here    # Link to full documentation
license: MIT                                  # License type (MIT, Apache-2.0, GPL-3.0, etc.)
keywords:                                     # Marketplace search terms (5-10 keywords)
  - keyword1
  - keyword2
  - keyword3
  - keyword4
  - keyword5
compatibility:                                # Platforms where skill works
  - "Claude Code"
  - "Claude.ai"
  - "Claude API"
installation_method: plugin                   # How to install: plugin | api | manual

---

# Skill Name Here

Brief introduction to the skill (1-2 sentences).

---

## When to Use

- Trigger phrase or scenario 1
- Trigger phrase or scenario 2
- Trigger phrase or scenario 3

**Example triggers:**
- "Example user request 1"
- "Example user request 2"
- "Example user request 3"

---

## How It Works

Brief overview of the skill's approach or methodology.

### Step 1: First Major Phase

Description of first phase...

### Step 2: Second Major Phase

Description of second phase...

### Step 3: Final Phase

Description of final phase...

---

## Key Features

1. **Feature 1** - Description
2. **Feature 2** - Description
3. **Feature 3** - Description

---

## Usage Instructions

1. **Step 1:** Do this first thing
2. **Step 2:** Then do this
3. **Step 3:** Finally do this

---

## Output Format

Description of what the skill produces or generates.

Example output structure if applicable.

---

## Best Practices

- Best practice 1
- Best practice 2
- Best practice 3

---

## Common Pitfalls

- Pitfall 1 and how to avoid it
- Pitfall 2 and how to avoid it
- Pitfall 3 and how to avoid it

---

## Resources

**Related Skills:**
- Related skill 1
- Related skill 2

**Documentation:**
- Reference document 1
- Reference document 2

**Examples:**
- Example file 1
- Example file 2

---

## Quick Reference

**Invocation** → **Phase 1** → **Phase 2** → **Phase 3** → **Output**

---

This skill [summary sentence about what it accomplishes].
