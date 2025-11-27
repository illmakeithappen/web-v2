---
title: Claude Code Memory Hierarchy Reference
topic: claude-code
type: reference
source: ai-generated
last_verified: 2025-10-13
relevant_to: [all-projects]
url: https://docs.claude.com/en/docs/claude-code/memory
status: current
---

# Claude Code Memory Hierarchy Reference

## Overview

Claude Code uses a hierarchical memory system with CLAUDE.md files that are loaded based on your working directory and organizational structure. Understanding this hierarchy is essential for organizing context across personal preferences, team projects, and enterprise policies.

## Memory Hierarchy (Priority Order)

### 1. Enterprise Policy Memory (Organization-wide)
**Location:** `/Library/Application Support/ClaudeCode/CLAUDE.md`

**Scope:** All users in the organization

**Purpose:** IT/DevOps managed policies and organization-wide standards

**Shared with:** Everyone in the organization

**Use cases:**
- Company-wide coding standards
- Security policies
- Required tooling and infrastructure
- Legal/compliance requirements

---

### 2. Project Memory (Team-shared)
**Location:** `./CLAUDE.md` or `./.claude/CLAUDE.md`

**Scope:** Everyone working on this specific project

**Purpose:** Team conventions, project structure, architecture decisions

**Shared with:** Team members via source control (git)

**Use cases:**
- Project architecture and structure
- API endpoints and data models
- Development workflow and commands
- Project-specific conventions
- Technical debt and known issues

**Notes:**
- Committed to git repository
- Both locations (`./CLAUDE.md` and `./.claude/CLAUDE.md`) are functionally equivalent
- `./.claude/CLAUDE.md` keeps root directory cleaner

---

### 3. User Memory (Personal, global) ⭐
**Location:** `~/.claude/CLAUDE.md`

**Scope:** You, across ALL your projects

**Purpose:** Personal preferences and working style

**Shared with:** Just you

**Use cases:**
- Preferred tools (e.g., "I use uv across all projects")
- IDE preferences (e.g., "I use pycharm")
- Personal coding style preferences
- Communication preferences (e.g., "Don't use emojis")
- Personal workflows and shortcuts

**Notes:**
- Lives in your home directory
- Applies to every project you work on
- Not committed to any repository

---

### 4. ~~Local Project Memory~~ (DEPRECATED)
**Location:** `./CLAUDE.local.md` or `./.claude/CLAUDE.local.md`

**Status:** No longer recommended

**Replacement:** Use imports in CLAUDE.md instead

**Why deprecated:**
- Imports work better across multiple git worktrees
- More flexible and maintainable
- Supports recursive imports (up to 5 levels deep)

---

## How Claude Code Discovers Memory Files

### Discovery Pattern: Recursive Upward Search

When you launch Claude Code in a directory, it:

1. **Starts in current working directory (cwd)**
2. **Looks for CLAUDE.md** (or `.claude/CLAUDE.md`)
3. **Recurses UP to parent directories**
4. **Stops before reaching root** (`/`)
5. **Loads all discovered files hierarchically**

### Example Discovery Flow

**Launch location:** `/Users/gitt/hub/website/backend/`

**Files discovered (in order):**
```
1. ~/.claude/CLAUDE.md                      # User preferences (global)
2. /Users/gitt/hub/.claude/CLAUDE.md        # Hub organization context
3. /Users/gitt/hub/website/.claude/CLAUDE.md # Website project context
4. /Users/gitt/hub/website/backend/CLAUDE.md # Backend-specific context
```

**Result:** All four files are loaded, with more specific contexts building on broader ones.

---

## Advanced Feature: Subdirectory Memory

Claude Code also discovers CLAUDE.md files in **subdirectories below** your current working directory, but handles them differently:

**Behavior:** Instead of loading them at launch, they are **only included when Claude reads files in those subtrees**.

**Example:**
```
hub/
├── .claude/CLAUDE.md           # Loaded at launch
├── website/
│   ├── .claude/CLAUDE.md       # Loaded if working in website/
│   ├── frontend/
│   │   └── CLAUDE.md           # Loaded only when reading frontend/ files
│   └── backend/
│       └── CLAUDE.md           # Loaded only when reading backend/ files
```

This prevents context overload while maintaining relevant information.

---

## Import System (Modern Pattern)

Instead of using deprecated CLAUDE.local.md files, use imports in your CLAUDE.md:

### Syntax
```markdown
# CLAUDE.md

## Project Context
[Your project-specific content here]

## Personal Preferences
- @~/.claude/personal-preferences.md
- @~/.claude/coding-style.md
```

### Import Features
- **Recursive imports** up to 5 hops deep
- **Relative paths** for project-specific imports
- **Absolute paths** for user-wide preferences
- **Better maintainability** than CLAUDE.local.md

### Example Structure
```
~/.claude/
├── CLAUDE.md                    # Base user preferences
├── python-preferences.md        # Python-specific preferences
├── react-preferences.md         # React-specific preferences
└── communication-style.md       # How you like Claude to communicate

project/.claude/
└── CLAUDE.md                    # Imports relevant user preferences
```

---

## Best Practices

### What Goes Where?

| Content Type | Location | Example |
|--------------|----------|---------|
| Personal tool preferences | `~/.claude/CLAUDE.md` | "I use uv", "I use pycharm" |
| Communication style | `~/.claude/CLAUDE.md` | "Don't use emojis", "Be concise" |
| Company structure | `hub/.claude/CLAUDE.md` | Directory structure, component relationships |
| Project architecture | `project/.claude/CLAUDE.md` | Tech stack, API endpoints, commands |
| Feature-specific context | `project/feature/CLAUDE.md` | Feature implementation details |

### File Location Choice

**Use `./CLAUDE.md` (root) when:**
- Documentation visibility is important
- Project is documentation-focused
- You want it obvious there's a CLAUDE.md

**Use `./.claude/CLAUDE.md` (hidden) when:**
- Keeping root directory minimal
- Grouping with other Claude Code config
- Project has many root-level files already

Both are functionally equivalent!

---

## Common Patterns

### Multi-Repo Company Structure

```
company-hub/
├── .claude/CLAUDE.md              # Company-wide context
├── vault-hub/
│   └── CLAUDE.md -> ../.claude/CLAUDE.md  # Symlink for Obsidian
├── website/
│   └── .claude/CLAUDE.md          # Website project context
├── api/
│   └── .claude/CLAUDE.md          # API project context
└── docs/
    └── .claude/CLAUDE.md          # Docs project context
```

**Benefit:** Each subdirectory has its own git repo, but inherits company context when working within them.

---

### Personal + Team + Project Layers

```
~/.claude/CLAUDE.md                # "I prefer Python 3.12+"
    ↓ (loaded first)
company/.claude/CLAUDE.md          # "We use FastAPI + React"
    ↓ (builds on personal)
project/.claude/CLAUDE.md          # "This project: auth system"
    ↓ (builds on company)
feature/CLAUDE.md                  # "Feature: OAuth integration"
```

**Result:** Claude has context from all layers, getting more specific as it goes deeper.

---

## Migration from CLAUDE.local.md

If you have existing CLAUDE.local.md files:

### Step 1: Identify Content Type
- **Personal preferences** → Move to `~/.claude/CLAUDE.md`
- **Project-specific overrides** → Move to project CLAUDE.md
- **Outdated content** → Delete

### Step 2: Use Imports
```markdown
# project/.claude/CLAUDE.md

## Project Context
[Project-specific content]

## Personal Overrides
- @~/.claude/project-specific-preferences.md
```

### Step 3: Delete CLAUDE.local.md
```bash
rm .claude/CLAUDE.local.md
```

---

## Quick Reference Commands

### Find all CLAUDE.md files in a project
```bash
find . -name "CLAUDE.md" -o -name ".claude"
```

### Check what Claude will load from a directory
```bash
# From current directory, traverse upward
pwd
ls CLAUDE.md 2>/dev/null || ls .claude/CLAUDE.md 2>/dev/null || echo "None here"
cd .. && pwd
ls CLAUDE.md 2>/dev/null || ls .claude/CLAUDE.md 2>/dev/null || echo "None here"
```

### View your user-wide preferences
```bash
cat ~/.claude/CLAUDE.md
```

---

## Summary

**Key Principles:**
1. **Personal preferences** → `~/.claude/CLAUDE.md` (applies everywhere)
2. **Team conventions** → `project/.claude/CLAUDE.md` (applies to project)
3. **Hierarchical loading** → More specific contexts build on general ones
4. **Imports over CLAUDE.local.md** → Modern, flexible approach
5. **Both locations work** → `./CLAUDE.md` and `./.claude/CLAUDE.md` are equivalent

**Remember:** Claude Code loads files hierarchically, starting from your current directory and recursing upward, so organize your context from general (user-wide) to specific (feature-level).

---

**Last Updated:** October 13, 2025
**Source:** [Claude Code Memory Documentation](https://docs.claude.com/en/docs/claude-code/memory)
