# Workflow Structure Redesign

**Date:** 2025-11-15
**Status:** 🚧 IN PROGRESS

---

## Current Problems

### Flat File Structure
```
vault-website/workflows/
├── workflow_20251115_008_deploy_gitthub_workflow_skill_to_claude_ai.md
├── workflow_20251115_009_deploy_gitthub_workflow_skill_to_claude_code.md
└── workflow_20251115_010_deploy_gitthub_workflow_skill_to_claude_desktop.md
```

**Issues:**
- ❌ No way to attach reference materials (screenshots, config files, code samples)
- ❌ Can't link to reusable resources across workflows
- ❌ No modular organization of supporting files
- ❌ Steps can't reference external tools/skills directly
- ❌ Difficult to maintain and update shared resources

---

## New Directory-Based Structure

### Proposed Architecture

```
vault-website/workflows/
├── workflow_20251115_008_deploy_gitthub_workflow_skill_to_claude_ai/
│   ├── WORKFLOW.md                    # Main workflow file (YAML + steps)
│   ├── references/                     # Supporting materials
│   │   ├── screenshots/                # Step-by-step screenshots
│   │   │   ├── step1_settings.png
│   │   │   ├── step2_upload.png
│   │   │   └── step3_enable.png
│   │   ├── code/                       # Code samples and scripts
│   │   │   └── verify_installation.sh
│   │   ├── configs/                    # Configuration files
│   │   │   └── skill_config.json
│   │   ├── tools/                      # Tool references (external links)
│   │   │   └── claude_ai.md
│   │   └── skills/                     # Skill references (internal links)
│   │       └── gitthub_workflow.md
│   └── README.md                       # Optional: workflow overview
│
├── workflow_20251115_009_deploy_gitthub_workflow_skill_to_claude_code/
│   ├── WORKFLOW.md
│   └── references/
│       ├── screenshots/
│       ├── code/
│       └── skills/
│
└── shared/                             # Shared resources across workflows
    ├── tools/                          # Common tool references
    │   ├── vscode.md
    │   ├── claude_desktop.md
    │   └── claude_ai.md
    ├── skills/                         # Skill reference library
    │   ├── gitthub_workflow.md
    │   └── skill_creator.md
    └── templates/                      # Workflow templates
        ├── deploy_template.md
        ├── navigate_template.md
        └── educate_template.md

```

---

## WORKFLOW.md Format

### Enhanced YAML Frontmatter

```yaml
---
# Core Metadata
workflow_id: "workflow_20251115_008"
title: "Deploy Gitthub-Workflow Skill to Claude.ai"
description: "install and configure the gitthub-workflow skill in claude.ai"
type: "deploy"
difficulty: "beginner"
status: "active"

# Workflow Info
estimated_time: "10-15 minutes"
total_steps: 4
version: "1.0"
created_date: "2025-11-15"
last_modified: "2025-11-15"
author: "Claude Code with gitthub-workflow skill"
agent: "Claude Code"
model: "claude-sonnet-4-5"

# Context
category: "workflow"
tags:
  - "deploy"
  - "claude-skills"
  - "claude-ai"
  - "skill-installation"
prerequisites:
  - "Claude Pro, Max, Team, or Enterprise account"
  - "Gitthub-workflow skill ZIP file"

# References (NEW)
tools_used:
  - name: "Claude.ai"
    type: "platform"
    reference: "../../shared/tools/claude_ai.md"
    url: "https://claude.ai"
  - name: "Web browser"
    type: "application"

skills_referenced:
  - name: "gitthub-workflow"
    reference: "../../shared/skills/gitthub_workflow.md"
    location: "../../../skills/gitthub-workflow/SKILL.md"

# Supporting Files (NEW)
has_screenshots: true
has_code: true
has_configs: true
---
```

### Step Format with References

```markdown
## Step 1: Verify Account and Enable Code Execution

**Instruction:**

Go to [Claude.ai](../../shared/tools/claude_ai.md) settings and verify you have a
Pro, Max, Team, or Enterprise subscription. Navigate to the Skills section and
ensure "Code execution" is enabled.

**Deliverable:** _Claude.ai account verified with valid subscription tier and code execution enabled_

**References:**
- 📸 [Settings Screenshot](references/screenshots/step1_settings.png)
- 🔗 [Claude.ai Platform Guide](../../shared/tools/claude_ai.md)

---

## Step 2: Upload Gitthub-Workflow Skill ZIP

**Instruction:**

In the Skills section, click "Upload skill" button and select the
[gitthub-workflow.zip](../../skills/gitthub-workflow.zip) file from your computer.

**Deliverable:** _Gitthub-workflow skill successfully uploaded_

**References:**
- 📸 [Upload Process](references/screenshots/step2_upload.png)
- 📦 [Skill Reference](../../shared/skills/gitthub_workflow.md)
- 🏷️ [Skill Source](../../../skills/gitthub-workflow/SKILL.md)

---

## Step 3: Enable the Skill

**Instruction:**

Locate the [gitthub-workflow](../../shared/skills/gitthub_workflow.md) skill in
your skills list and toggle it to "enabled" status.

**Deliverable:** _Skill enabled and active_

**References:**
- 📸 [Enable Toggle](references/screenshots/step3_enable.png)
- ✅ [Verification Script](references/code/verify_installation.sh)

---
```

---

## Reference File Types

### 1. Tool References (`references/tools/` or `shared/tools/`)

**Purpose:** Document external tools, platforms, and applications used in workflows

**Format:** Markdown file with tool metadata

**Example:** `shared/tools/claude_ai.md`
```yaml
---
tool_name: "Claude.ai"
tool_type: "platform"
vendor: "Anthropic"
url: "https://claude.ai"
documentation: "https://docs.anthropic.com"
pricing_tiers:
  - "Free"
  - "Pro ($20/month)"
  - "Team (custom)"
  - "Enterprise (custom)"
required_for_workflows:
  - "workflow_20251115_008"
  - "workflow_20251115_011"
---

# Claude.ai Platform

Web-based interface for interacting with Claude AI models.

## Key Features
- Custom skills upload
- Code execution
- Multi-modal input
- Conversation history

## Workflow Integration
Used in deployment workflows for skill installation and testing.
```

### 2. Skill References (`references/skills/` or `shared/skills/`)

**Purpose:** Link workflows to skills they install/use/reference

**Format:** Markdown file pointing to skill source

**Example:** `shared/skills/gitthub_workflow.md`
```yaml
---
skill_name: "gitthub-workflow"
skill_id: "gitthub-workflow"
skill_source: "../../../skills/gitthub-workflow/SKILL.md"
skill_zip: "../../../skills/gitthub-workflow.zip"
skill_type: "workflow-generator"
installation_workflows:
  - "workflow_20251115_008_deploy_gitthub_workflow_skill_to_claude_ai"
  - "workflow_20251115_009_deploy_gitthub_workflow_skill_to_claude_code"
  - "workflow_20251115_010_deploy_gitthub_workflow_skill_to_claude_desktop"
---

# Gitthub-Workflow Skill

Generate comprehensive, actionable workflows for complex tasks.

## Capabilities
- Navigate workflows (compare approaches)
- Educate workflows (learn concepts)
- Deploy workflows (implement systems)

## Installation
See installation workflows for each platform.

## References
- [Skill Source](../../../skills/gitthub-workflow/SKILL.md)
- [Skill ZIP](../../../skills/gitthub-workflow.zip)
```

### 3. Code Samples (`references/code/`)

**Purpose:** Provide executable scripts, config files, verification tools

**Example:** `references/code/verify_installation.sh`
```bash
#!/bin/bash
# Verify gitthub-workflow skill installation

echo "Checking Claude.ai skills..."

# Instructions for manual verification
cat << EOF
Manual Verification Steps:
1. Go to https://claude.ai/settings
2. Navigate to Skills section
3. Look for "gitthub-workflow" in skills list
4. Verify status shows "Enabled"
5. Test with: "create a gitthub workflow to test installation"
EOF
```

### 4. Screenshots (`references/screenshots/`)

**Purpose:** Visual step-by-step guidance

**Naming Convention:**
- `step1_description.png` - Screenshots for each step
- `error_screenshot.png` - Common error states
- `success_state.png` - Expected success state

### 5. Config Files (`references/configs/`)

**Purpose:** Configuration templates, settings files, example data

**Example:** `references/configs/skill_config.json`
```json
{
  "skill_name": "gitthub-workflow",
  "enabled": true,
  "auto_trigger": true,
  "triggers": [
    "create a gitthub workflow",
    "generate a workflow"
  ]
}
```

---

## Benefits of New Structure

### 1. Modularity
- ✅ Each workflow is self-contained with all supporting materials
- ✅ Shared resources reduce duplication
- ✅ Easy to update common tools/skills references

### 2. Maintainability
- ✅ Update tool references once, affects all workflows
- ✅ Screenshots organized by workflow
- ✅ Version control friendly (separate directories)

### 3. Discoverability
- ✅ Clear structure shows what resources are available
- ✅ Shared resources library for reuse
- ✅ Tool and skill reference catalog

### 4. Rich Context
- ✅ Visual guidance with screenshots
- ✅ Executable code samples
- ✅ Configuration templates
- ✅ External tool documentation links

### 5. Linking Capabilities
- ✅ Steps can link to tool references
- ✅ Steps can link to skill sources
- ✅ Steps can link to screenshots
- ✅ Workflows can reference other workflows

---

## Migration Plan

### Phase 1: Structure Setup
1. ✅ Create `shared/` directory for common resources
2. Create workflow subdirectories for existing workflows
3. Move existing `.md` files to `WORKFLOW.md` in subdirectories

### Phase 2: Reference Creation
4. Create tool reference files in `shared/tools/`
5. Create skill reference files in `shared/skills/`
6. Create workflow templates in `shared/templates/`

### Phase 3: Enhancement
7. Add screenshots to workflow references
8. Add code samples where applicable
9. Update step content to include reference links

### Phase 4: Skill Update
10. Update gitthub-workflow skill guides to generate folder-based workflows
11. Update workflow-format-spec.md with new structure
12. Update example workflows with new format

### Phase 5: Backend Integration
13. Update backend API to read from subdirectories (WORKFLOW.md)
14. Add API support for workflow references
15. Frontend updates to display references

---

## File Naming Conventions

### Workflow Directories
```
workflow_YYYYMMDD_NNN_snake_case_title/
```

### Required Files
- `WORKFLOW.md` - Main workflow file (required)
- `README.md` - Optional overview

### Reference Subdirectories
- `references/screenshots/` - Visual guides
- `references/code/` - Code samples
- `references/configs/` - Configuration files
- `references/tools/` - Local tool references
- `references/skills/` - Local skill references

### Shared Resources
- `shared/tools/` - Common tool references
- `shared/skills/` - Common skill references
- `shared/templates/` - Workflow templates

---

## Next Steps

1. Create example workflow with new structure
2. Update gitthub-workflow skill generation guides
3. Update backend workflow API
4. Test workflow generation
5. Migrate existing workflows

---

**Status:** 🚧 Architecture designed, ready for implementation
