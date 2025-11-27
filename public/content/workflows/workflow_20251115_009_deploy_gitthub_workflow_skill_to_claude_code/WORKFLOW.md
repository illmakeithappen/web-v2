---
title: "Deploy Gitthub-Workflow Skill to Claude Code"
description: "install and configure the gitthub-workflow skill in claude code via skills directory for generating structured workflows"
type: "deploy"
difficulty: "beginner"
status: "active"
agent: "Claude Code"
model: "claude-sonnet-4-5"
estimated_time: "10-15 minutes"
total_steps: 4
tags:
  - "deploy"
  - "claude-skills"
  - "claude-code"
  - "skill-installation"
  - "vscode"
category: "workflow"
created_date: "2025-11-15"
last_modified: "2025-11-15"
workflow_id: "workflow_20251115_009"
author: "Claude Code with gitthub-workflow skill"
version: "1.0"
prerequisites:
  - "Claude Code extension installed in VS Code"
  - "Gitthub-workflow skill ZIP file"
tools_required:
  - "VS Code with Claude Code extension"
  - "Terminal or file explorer"
steps:
  - "Locate Claude Code Skills Directory"
  - "Extract Skill to Skills Directory"
  - "Verify Skill Installation"
  - "Test Workflow Generation"
---
# Deploy Gitthub-Workflow Skill to Claude Code

**Purpose:** Install the gitthub-workflow skill in Claude Code by placing it in the skills directory for seamless workflow generation in VS Code.

**Target Completion Time:** 10-15 minutes
**Total Steps:** 4

---

## Step 1: Locate Claude Code Skills Directory

**Instruction:**

```text
Navigate to your Claude Code skills directory, typically located at ~/.claude/skills/
on macOS/Linux or %USERPROFILE%\.claude\skills\ on Windows. Create the directory
if it doesn't exist using mkdir -p ~/.claude/skills/ in terminal.
```

**Deliverable:** _Claude Code skills directory located or created and ready for skill installation_

---

## Step 2: Extract Skill to Skills Directory

**Instruction:**

```text
Unzip the gitthub-workflow.zip file and move the gitthub-workflow folder (containing
SKILL.md and references/ subdirectory) into the ~/.claude/skills/ directory. Verify
the final path is ~/.claude/skills/gitthub-workflow/SKILL.md.
```

**Deliverable:** _Gitthub-workflow skill folder extracted and placed in Claude Code skills directory_

---

## Step 3: Verify Skill Installation

**Instruction:**

```text
Restart VS Code or reload the Claude Code extension. Open Claude Code and check
that the gitthub-workflow skill appears in the available skills list. Confirm
the skill shows correct metadata and is ready to use.
```

**Deliverable:** _Gitthub-workflow skill visible in Claude Code skills list and ready for use_

---

## Step 4: Test Workflow Generation

**Instruction:**

```text
Test the skill by asking Claude Code: "create a gitthub workflow to compare
database options". Verify the skill triggers correctly with discovery questions,
generates an outline for approval, and creates a complete formatted workflow
saved to your project directory.
```

**Deliverable:** _Successfully generated test workflow confirming skill is working correctly in Claude Code_

---

## Workflow Complete! 🎉

You've successfully deployed the gitthub-workflow skill to Claude Code!

**What you've accomplished:**
- ✅ Located or created Claude Code skills directory
- ✅ Extracted and installed gitthub-workflow skill files
- ✅ Verified skill appears in Claude Code
- ✅ Tested workflow generation successfully

**Next Steps:**
- Create workflows for your development projects
- Save generated workflows to your project's documentation
- Use workflow generation directly in your VS Code workspace
- Leverage Claude Code's file access for project-specific workflows

**Tips for Success:**
1. **Keep skills directory organized** - Each skill in its own folder
2. **Update skills regularly** - Replace old version with new ZIP when updated
3. **Use in project context** - Claude Code can reference your project files
4. **Save workflows locally** - Generated workflows saved to vault-website/workflows/
5. **Restart when needed** - Reload VS Code if skill doesn't appear immediately

**Claude Code Advantages:**
- Direct file system access for reading project context
- Can save workflows directly to your project folders
- Integrated with your development workflow
- No need to leave VS Code for workflow generation
- Full skills directory support with automatic detection

Enjoy generating workflows directly in your development environment! 🚀
