# Workflow File Naming Conventions

This document defines the standard directory and file naming format for all gitthub workflows.

---

## Standard Format

All workflows MUST follow this exact directory structure:

```
vault-website/workflows/workflow_YYYYMMDD_NNN_snake_case_title/
├── WORKFLOW.md         # Main workflow file
└── references/         # Empty folder for future screenshots, code, configs
```

---

## Component Breakdown

### Directory Path
**Required:** `vault-website/workflows/`

All workflow directories MUST be created in this location. Never save workflows to:
- Project root
- `.claude/` directory
- Other locations

### Directory Name Prefix
**Required:** `workflow_`

Every workflow directory name MUST start with `workflow_` prefix.

### Date Component
**Format:** `YYYYMMDD`
**Required:** Yes
**Rules:**
- Use current date when creating the workflow
- Format: 4-digit year + 2-digit month + 2-digit day
- No hyphens, slashes, or other separators
- Must be valid date (e.g., 20251115 not 20251399)

**Examples:**
- ✅ `20251115` (November 15, 2025)
- ✅ `20250101` (January 1, 2025)
- ✅ `20241231` (December 31, 2024)
- ❌ `2025-11-15` (contains hyphens)
- ❌ `20251399` (invalid date)
- ❌ `251115` (missing century)

### Sequential Number
**Format:** `NNN`
**Required:** Yes
**Rules:**
- Three-digit sequential number: 001, 002, 003, etc.
- Must be unique for that date
- Always use leading zeros (001, not 1)
- Increment by 1 for each new workflow on same date

**How to Determine Sequential Number:**
1. Check existing workflow directories in `vault-website/workflows/` for current date
2. Find highest number used today
3. Add 1 to that number
4. Format with leading zeros (e.g., 003)

**Examples:**
- First workflow today: `001`
- Second workflow today: `002`
- Tenth workflow today: `010`
- Hundredth workflow today: `100`

**Common Mistakes:**
- ❌ Single digit: `1` (should be `001`)
- ❌ Two digits: `03` (should be `003`)
- ❌ Skipping numbers: `001`, then `003` (should be sequential)
- ❌ Duplicate numbers on same date

### Title Component
**Format:** `snake_case_title`
**Required:** Yes
**Rules:**
- All lowercase letters
- Words separated by underscores (_)
- No spaces, hyphens, or other punctuation
- Should match workflow's actual title (converted to snake_case)
- Be descriptive but concise (3-8 words typical)
- Use action verbs when possible

**Converting Title to snake_case:**

1. Start with workflow title from metadata
2. Convert to lowercase
3. Replace spaces with underscores
4. Remove special characters (except underscores)
5. Remove articles (a, an, the) if too long

**Examples:**

| Workflow Title | snake_case_title |
|----------------|------------------|
| Deploy FastAPI App to Render | `deploy_fastapi_app_to_render` |
| Navigate Professional Video Editing Tool Selection | `navigate_professional_video_editing_tool_selection` |
| Educate Authentication Concepts | `educate_authentication_concepts` |
| Compare CI/CD Pipeline Tools | `compare_cicd_pipeline_tools` |

**Common Mistakes:**
- ❌ Uppercase letters: `Deploy_App` (should be all lowercase)
- ❌ Spaces: `deploy app` (should use underscores)
- ❌ Hyphens: `deploy-app` (should use underscores)
- ❌ Special chars: `deploy_app!` (remove special characters)
- ❌ Too short: `deploy` (be descriptive)
- ❌ Too long: `navigate_comprehensive_professional_video_editing_tool_selection_and_comparison` (too verbose)

---

## Complete Examples

### Good Examples ✅

**Example 1:**
```
vault-website/workflows/workflow_20251115_001_deploy_fastapi_app_to_render/
├── WORKFLOW.md
└── references/
```
- ✅ Correct directory structure
- ✅ Date: November 15, 2025
- ✅ First workflow of the day
- ✅ Clear, descriptive title in snake_case
- ✅ WORKFLOW.md file present
- ✅ Empty references/ folder

**Example 2:**
```
vault-website/workflows/workflow_20251115_007_navigate_professional_video_editing_tool_selection/
├── WORKFLOW.md
└── references/
```
- ✅ Correct directory structure
- ✅ Same date as Example 1
- ✅ Seventh workflow of the day
- ✅ Descriptive navigate workflow title

**Example 3:**
```
vault-website/workflows/workflow_20250103_012_educate_authentication_fundamentals/
├── WORKFLOW.md
└── references/
```
- ✅ Correct directory structure
- ✅ Date: January 3, 2025
- ✅ Twelfth workflow of the day
- ✅ Clear educate workflow title

### Bad Examples ❌

**Example 1:**
```
workflow_20251115_1_deploy_app/WORKFLOW.md
```
- ❌ Missing vault-website/workflows/ directory path
- ❌ Single-digit sequential number (should be 001)
- ❌ Missing references/ folder
- ⚠️ Title too brief (be more descriptive)

**Example 2:**
```
vault-website/workflows/workflow_2025-11-15_003_Deploy_FastAPI_App/WORKFLOW.md
```
- ❌ Date uses hyphens (should be 20251115)
- ❌ Title has uppercase letters (should be all lowercase)
- ❌ Missing references/ folder

**Example 3:**
```
vault-website/workflows/deploy_fastapi_to_render.md
```
- ❌ Not a directory (flat file structure)
- ❌ Missing `workflow_` prefix
- ❌ Missing date component
- ❌ Missing sequential number
- ❌ Wrong file extension (.md instead of directory)

**Example 4:**
```
vault-website/skills/workflow_20251115_003_deploy_app/WORKFLOW.md
```
- ❌ Wrong directory (should be `workflows/` not `skills/`)
- ⚠️ Otherwise correct format

**Example 5:**
```
vault-website/workflows/workflow_20251115_003_deploy_app.md
```
- ❌ Flat file instead of directory structure
- ❌ Missing WORKFLOW.md file in subdirectory
- ❌ Missing references/ folder

---

## Process for Determining Directory Name

**Step 1: Determine Date**
- Use current date in YYYYMMDD format

**Step 2: Find Sequential Number**
- List directories in `vault-website/workflows/` for current date
- Find highest `NNN` number used today
- Add 1, format with leading zeros

**Step 3: Convert Title**
- Take workflow title from metadata
- Convert to lowercase
- Replace spaces with underscores
- Remove special characters

**Step 4: Construct Directory Name**
```
vault-website/workflows/workflow_{DATE}_{NNN}_{title}/
```

**Step 5: Inform User**
- Present the workflow markdown content
- Provide directory structure instructions
- Give suggested directory name
- **DO NOT save the workflow yourself**

---

## User Instructions Template

When presenting a workflow to the user, provide these instructions:

```
**To save this workflow:**

1. Create directory:
   `vault-website/workflows/workflow_YYYYMMDD_NNN_snake_case_title/`

2. Create empty subdirectory:
   `vault-website/workflows/workflow_YYYYMMDD_NNN_snake_case_title/references/`

3. Save the workflow content below as:
   `vault-website/workflows/workflow_YYYYMMDD_NNN_snake_case_title/WORKFLOW.md`

**Suggested directory name for today:**
`workflow_YYYYMMDD_NNN_[snake_case_title]/`
```

**Example:**
```
**To save this workflow:**

1. Create directory:
   `vault-website/workflows/workflow_20251115_003_deploy_fastapi_app_to_render/`

2. Create empty subdirectory:
   `vault-website/workflows/workflow_20251115_003_deploy_fastapi_app_to_render/references/`

3. Save the workflow content below as:
   `vault-website/workflows/workflow_20251115_003_deploy_fastapi_app_to_render/WORKFLOW.md`

**Suggested directory name for today:**
`workflow_20251115_003_deploy_fastapi_app_to_render/`
```

---

## Common Issues and Solutions

### Issue 1: Duplicate Sequential Numbers

**Problem:** Two workflows on same date with same sequential number

**Solution:**
- Always check existing files before assigning number
- Use `ls vault-website/workflows/workflow_YYYYMMDD_*` to list today's workflows
- Increment from highest number found

### Issue 2: Inconsistent Title Formatting

**Problem:** Mixing hyphens, spaces, or inconsistent capitalization

**Solution:**
- Always convert title to snake_case first
- Double-check: all lowercase, underscores only, no special chars
- Be consistent across all workflows

### Issue 3: Wrong Directory

**Problem:** Saving workflows to wrong location

**Solution:**
- Always use `vault-website/workflows/` directory
- Create directory if it doesn't exist
- Never save to project root or other directories

### Issue 4: Missing Leading Zeros

**Problem:** Using `1` instead of `001`, or `12` instead of `012`

**Solution:**
- Always format sequential numbers with 3 digits
- Use leading zeros for numbers < 100
- Examples: 001, 002, 012, 099, 100

---

## Why These Conventions Matter

**1. Consistency**
- Easy to find workflows
- Predictable organization
- Clear chronological order

**2. Sorting**
- Files sort chronologically by date
- Sequential numbers maintain order within date
- Alphabetical title sorting when needed

**3. Readability**
- Date format is unambiguous (no confusion about MM/DD vs DD/MM)
- snake_case titles are easy to read
- Leading zeros ensure proper sorting

**4. Automation**
- Scripts can parse filenames reliably
- Consistent patterns enable tooling
- Easy to validate programmatically

**5. Scalability**
- Can handle 999 workflows per day
- Years of workflows without conflicts
- Clear separation by date

---

## Validation Checklist

Before finalizing a workflow filename, verify:

- [ ] Directory is `vault-website/workflows/`
- [ ] Filename starts with `workflow_`
- [ ] Date is current date in YYYYMMDD format
- [ ] Sequential number is 3 digits with leading zeros
- [ ] Sequential number is unique for this date
- [ ] Title is all lowercase
- [ ] Title uses underscores (not spaces or hyphens)
- [ ] Title is descriptive (3-8 words)
- [ ] No special characters in title
- [ ] File extension is `.md`
- [ ] Complete filename follows pattern: `workflow_YYYYMMDD_NNN_snake_case_title.md`

---

This naming convention ensures consistency, organization, and maintainability across all gitthub workflows.
