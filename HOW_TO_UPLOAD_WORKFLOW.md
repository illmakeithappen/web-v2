# How to Upload Workflow Files to Supabase

## Current Status

**Database Status**: ✅ Connected
**Content Status**: ⚠️ Empty - No content uploaded yet
**Records in Database**: 11 total (3 workflows, 2 skills, 4 MCP servers, 2 subagents)
**Content Columns**: All empty (needs migration)

## Two Methods to Upload Content

### Method 1: Bulk Migration (Recommended for Initial Setup)

This method uploads all existing markdown files at once from `/public/content/` to Supabase.

#### Step 1: Run the Migration Script

```bash
npm run migrate-content
```

This will:
1. Read all markdown files from `/public/content/workflows/`, `/public/content/mcp/`, `/public/content/subagents/`
2. Parse frontmatter and content
3. Match files to existing database records by name/ID
4. Upload content, raw_content, and frontmatter to Supabase
5. Upload reference files to `content_references` table

#### Expected Output:

```
🚀 Starting Content Migration to Supabase
=========================================

📁 Migrating Workflows...
  ✓ Migrated workflow: Workflow 20251115 010 Deploy Gitthub Workflow Skill To Claude Desktop
  ✓ Migrated workflow: Workflow 20251115 009 Deploy Gitthub Workflow Skill To Claude Code
  ✓ Migrated workflow: Workflow 20251115 008 Deploy Gitthub Workflow Skill To Claude Ai

  Summary: 3 successful, 0 errors

📁 Migrating MCP Servers...
  ✓ Migrated MCP server: brave-search
  ✓ Migrated MCP server: aws-api
  ✓ Migrated MCP server: render
  ✓ Migrated MCP server: playwright
    ✓ Reference: setup-guide.md
    ✓ Reference: examples.md

  Summary: 4 successful, 0 errors
  References: 2 successful, 0 errors

📁 Migrating Subagents...
  ✓ Migrated subagent: general-purpose
  ✓ Migrated subagent: explore

  Summary: 2 successful, 0 errors

✨ Migration Complete!
====================
Workflows:    3 successful, 0 errors
MCP Servers:  4 successful, 0 errors
Subagents:    2 successful, 0 errors

Total:        9 successful, 0 errors

✅ All content migrated successfully!
```

#### Step 2: Verify Upload

```bash
npm run check-db
```

You should now see:
```
📋 Workflows:
   Total: 3
   With content: 3  ✅
   Templates: 3

🔌 MCP Servers:
   Total: 4
   With content: 4  ✅
   Templates: 4
```

---

### Method 2: UI Upload (For Individual Files)

Use the built-in upload modal in the Docs page to upload individual markdown files.

#### Step 1: Navigate to Docs Page

1. Open your browser to `http://localhost:3002/doc`
2. Log in if required

#### Step 2: Open Upload Modal

**Option A - Via Command Palette**:
1. Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux)
2. Click "Upload New..." at the top of the list

**Option B - Via Navigation**:
1. Click on the section you want to upload to (Workflows, Skills, MCP, or Subagents)
2. Press `⌘K` or `Ctrl+K`
3. Click "Upload New..."

#### Step 3: Select Section

The upload modal will show with the currently selected section (Workflows, Skills, MCP, or Subagents). You can change the section using the dropdown.

#### Step 4: Upload File

**Drag & Drop**:
1. Drag a `.md` file from your file manager
2. Drop it onto the drop zone
3. Preview will show parsed metadata

**Or Click to Browse**:
1. Click the drop zone
2. Select a `.md` file from the file picker
3. Preview will show parsed metadata

#### Step 5: Review Metadata

The modal will parse and display:
- Title (from frontmatter)
- Description
- Category
- Tags
- Difficulty
- Other custom fields

#### Step 6: Confirm Upload

1. Review the metadata
2. Click "Upload" button
3. File will be uploaded to Supabase
4. Document will automatically appear in the selected section

---

## File Format Requirements

Workflow files MUST have this structure:

```markdown
---
title: Your Workflow Title
description: Brief description of what this workflow does
category: deployment | education | navigation
difficulty: beginner | intermediate | advanced
tags: [tag1, tag2, tag3]
workflow_id: unique-workflow-id
---

# Your Workflow Title

## Overview

Content goes here...

## Steps

1. First step
2. Second step
...
```

### Required Frontmatter Fields:
- `title` - Workflow name (string)
- `description` - Brief description (string)
- `category` - Workflow type (string)

### Optional Frontmatter Fields:
- `difficulty` - Skill level (string)
- `tags` - Keywords (array)
- `workflow_id` - Unique identifier (string)
- `total_steps` - Number of steps (number)
- Custom fields as needed

---

## Current Workflow Files in `/public/content/workflows/`

To see what's available to migrate:

```bash
ls -la /Users/gitt/hub/web-v2/public/content/workflows/
```

Expected structure:
```
public/content/workflows/
├── workflow_20251115_008_deploy_gitthub_workflow_skill_to_claude_ai/
│   └── WORKFLOW.md
├── workflow_20251115_009_deploy_gitthub_workflow_skill_to_claude_code/
│   └── WORKFLOW.md
└── workflow_20251115_010_deploy_gitthub_workflow_skill_to_claude_desktop/
    └── WORKFLOW.md
```

---

## Troubleshooting

### Issue: Migration script shows "No matching workflow found"

**Cause**: Directory name doesn't match database record name

**Solution**:
1. Check database records: `npm run check-db`
2. Check directory names: `ls public/content/workflows/`
3. Ensure workflow records exist in database (run seed script first if needed)

### Issue: Upload modal doesn't parse frontmatter

**Cause**: Frontmatter format is invalid

**Solution**:
1. Ensure frontmatter is wrapped in `---` fences
2. Check YAML syntax (no tabs, proper indentation)
3. Verify all values are properly quoted if they contain special characters

### Issue: "Failed to upload" error in UI

**Cause**: Missing required fields or database permissions

**Solution**:
1. Check browser console for detailed error
2. Ensure you're logged in
3. Verify Supabase connection (check `npm run check-db`)
4. Check that required frontmatter fields are present

---

## Next Steps After Upload

### 1. Verify Content is Visible

Navigate to `/doc` and:
1. Select "Workflows" section
2. Press `⌘K` to open command palette
3. Search for your workflow
4. Click to view - content should display

### 2. Test Editing

1. Click the "Edit" button in the document header
2. TOAST UI editor should open
3. Make changes
4. Press `Cmd+S` or click "Save"
5. Changes should save to Supabase and display immediately

### 3. Verify in Hub Section

1. Navigate to `/hub`
2. Open a workflow
3. Content should display from Supabase (same as Docs section)

---

## Summary

**For Bulk Upload (Recommended First Time)**:
```bash
npm run migrate-content
npm run check-db
```

**For Individual Files**:
1. Go to http://localhost:3002/doc
2. Press `⌘K`
3. Click "Upload New..."
4. Drag & drop `.md` file
5. Click "Upload"

**Current State**:
- ✅ Database: 11 records exist
- ⚠️ Content: Empty (run migration)
- ✅ Upload UI: Ready
- ✅ Edit UI: Ready with TOAST UI editor

Once you run `npm run migrate-content`, all workflows will have content and be fully editable via the UI!
